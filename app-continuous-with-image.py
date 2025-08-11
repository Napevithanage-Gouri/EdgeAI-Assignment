from flask import Flask, render_template, Response, request, jsonify
from ultralytics import YOLO
from datetime import datetime
import uuid
import threading
import json
import time
import gc
import cv2
import numpy as np
import requests
import paho.mqtt.client as mqtt
import base64


# --- CONFIG ---
CAM_URL = "http://192.168.1.54:8080/shot.jpg"
INTERVAL = 1.5
INTERVAL_MS = INTERVAL * 1000
MOVING_THRESH = 1.0
EVENT_COOLDOWN = 5

AWS_IOT_ENDPOINT = "a2t95zamnvi1v8-ats.iot.us-east-1.amazonaws.com"
AWS_IOT_PORT = 8883
AWS_TOPIC = "edge/edge_device1/logs"

CERT_PATH = "mqtt_certs/e9b9f9da64dc652a47312aa7a0b2a1b83f9ed3ba5e438065f33d2a7a6effd72b-certificate.pem.crt"
PRIVATE_KEY_PATH = "mqtt_certs/e9b9f9da64dc652a47312aa7a0b2a1b83f9ed3ba5e438065f33d2a7a6effd72b-private.pem.key"
CA_PATH = "mqtt_certs/AmazonRootCA1.pem"  


# --- GLOBAL STATE ---
latest_snapshot = None
event_logs = []
latest_alert = {"drowsy": False}
device_status = {"status": "not moving"}
gps_data = {"lat": None, "lon": None, "speed": 0.0}
speed_override = 0.0
speed_override_active = False
last_event_type = None
last_event_time = 0

# --- INIT ---
app = Flask(__name__)
gc.disable()
model = YOLO("finetuned-models/yolov8n.pt")

# --- MQTT ---
def publish_event_mqtt(event):
    import ssl
    from paho.mqtt.client import Client

    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to AWS IoT Core")
            client.publish(AWS_TOPIC, json.dumps(event), qos=1)
            print("Published to AWS:", event)
            client.disconnect()
        else:
            print("AWS IoT connection failed with code:", rc)

    client = Client()
    client.on_connect = on_connect

    client.tls_set(
        ca_certs=CA_PATH,
        certfile=CERT_PATH,
        keyfile=PRIVATE_KEY_PATH,
        tls_version=ssl.PROTOCOL_TLSv1_2
    )

    try:
        client.connect(AWS_IOT_ENDPOINT, AWS_IOT_PORT, keepalive=60)
        client.loop_forever()
    except Exception as e:
        print("AWS MQTT publish error:", e)

# --- INFERENCE ---
def run_inference(frame):
    global latest_alert, event_logs, gps_data
    global last_event_type, last_event_time, speed_override, speed_override_active

    annotated = frame.copy()
    speed = speed_override if speed_override_active else gps_data.get("speed", 0)
    moving = speed > MOVING_THRESH
    device_status["status"] = "moving" if moving else "not moving"
    now_str = datetime.now().isoformat()
    current_time = time.time()
    event_type = None
    is_drowsy = False
    confidence = None

    if moving:
        res = model(frame, verbose=False)[0]
        annotated = res.plot()

        # Check if drowsy and extract confidence
        for box in res.boxes:
            cls = int(box.cls)
            if model.names[cls] == "drowsy":
                is_drowsy = True
                confidence = float(box.conf[0])
                break

        event_type = "drowsy" if is_drowsy else "not_drowsy"

        def can_fire(event_type_check):
            return (
                last_event_type != event_type_check or
                (current_time - last_event_time) > EVENT_COOLDOWN
            )

        if is_drowsy and not latest_alert["drowsy"] and can_fire("drowsy"):
            latest_alert["drowsy"] = True
            event_logs.append({
                "timestamp": now_str,
                "event_type": "drowsy",
                "lat": gps_data.get("lat"),
                "lon": gps_data.get("lon"),
                "speed": speed,
                "confidence": confidence
            })
            last_event_type = "drowsy"
            last_event_time = current_time
            print("Drowsy event added to logs")

        elif not is_drowsy and latest_alert["drowsy"] and can_fire("not_drowsy"):
            latest_alert["drowsy"] = False
            event_logs.append({
                "timestamp": now_str,
                "event_type": "not_drowsy",
                "lat": gps_data.get("lat"),
                "lon": gps_data.get("lon"),
                "speed": speed,
                "confidence": None
            })
            last_event_type = "not_drowsy"
            last_event_time = current_time
            print("Not-drowsy event added to logs")

        if latest_alert["drowsy"]:
            cv2.putText(annotated, "🚨 DROWSY!", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)

    _, buffer = cv2.imencode(".jpg", annotated)
    jpg_as_text = base64.b64encode(buffer).decode("utf-8")

    event = {
        "event_id": str(uuid.uuid4()),
        "timestamp": now_str,
        "lat": gps_data.get("lat"),
        "lon": gps_data.get("lon"),
        "speed": speed,
        "status": "moving" if moving else "not moving",
        "event_type": event_type,
        "confidence": confidence,
        "image_base64": jpg_as_text
    }
    publish_event_mqtt(event)
    print("📡 MQTT sent:", event_type or "no prediction")

    cv2.putText(annotated, datetime.now().strftime("%H:%M:%S"), (10, annotated.shape[0] - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    cv2.putText(annotated, f"Speed: {speed:.1f} m/s", (10, annotated.shape[0] - 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

    return annotated, moving


# --- BACKGROUND THREAD ---
def fetch_images_loop():
    global latest_snapshot
    while True:
        try:
            response = requests.get(CAM_URL, timeout=5)
            if response.status_code == 200:
                img_bytes = response.content
                nparr = np.frombuffer(img_bytes, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                annotated, _ = run_inference(frame)
                ret, buf = cv2.imencode('.jpg', annotated)
                if ret:
                    latest_snapshot = buf.tobytes()
            else:
                print("Failed to fetch image:", response.status_code)
        except Exception as e:
            print("Camera fetch error:", e)
        time.sleep(INTERVAL)

threading.Thread(target=fetch_images_loop, daemon=True).start()

# --- ROUTES ---
@app.route("/")
def index():
    return render_template("index.html", INTERVAL_MS=INTERVAL_MS)

@app.route("/snapshot")
def snapshot():
    if not latest_snapshot:
        return "No image yet", 503
    return Response(latest_snapshot, mimetype="image/jpeg")

@app.route("/events")
def events():
    def stream():
        while True:
            yield f"data: {json.dumps({'drowsy': latest_alert['drowsy']})}\n\n"
            time.sleep(1)
    return Response(stream(), content_type="text/event-stream")

@app.route("/logs")
def logs():
    recent = list(reversed(event_logs[-20:]))
    return jsonify(logs=recent)

@app.route("/status")
def status():
    speed = speed_override if speed_override_active else gps_data.get("speed", 0)
    return jsonify(
        status=device_status["status"].upper(),
        speed=speed,
        override=speed_override_active
    )

@app.route("/gps", methods=["POST"])
def gps():
    global gps_data
    data = request.get_json(force=True)
    gps_data = {
        "lat": float(data.get("lat")) if data.get("lat") else None,
        "lon": float(data.get("lon")) if data.get("lon") else None,
        "speed": float(data.get("speed", 0))
    }
    print("GPS updated:", gps_data)
    return {"status": "ok"}, 200

@app.route("/speed", methods=["POST"])
def set_speed():
    global gps_data, speed_override, speed_override_active
    data = request.get_json(force=True)
    try:
        speed_override = float(data.get("speed"))
        speed_override_active = True
        gps_data["speed"] = speed_override
    except ValueError:
        return {"error": "Invalid speed"}, 400
    print("⚙️ Speed override set to:", speed_override)
    return {"status": "speed override active"}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)
