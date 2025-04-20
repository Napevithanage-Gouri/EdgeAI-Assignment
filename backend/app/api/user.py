from fastapi import Depends
from fastapi import APIRouter, HTTPException, Depends, Request, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from datetime import timedelta
from core.auth import get_current_user, decode_access_token
from core.auth import ACCESS_TOKEN_EXPIRE_MINUTES
from core.auth import get_password_hash, verify_password, create_access_token
from db.database import get_db
from db.crud import get_user_by_email, create_user, get_user_devices
from schema.auth import SignUpRequest, SignInRequest
from service.dynamo_service import DynamoDBService
import asyncio
from service.mqtt_service import MQTTService

router = APIRouter()

@router.get("/userdata")
def get_user_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        user = get_user_by_email(db, current_user.get("sub"))
        return {
            "email": user.email,
            "name": user.name,
        }
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.post("/sensordata")
async def get_sensor_data(request: Request, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        data = await request.json()
        user_email = current_user.get("sub")
        device_name = data["device"]
        user_devices = [device["device"] for device in get_user_devices(db, user_email)]
        dynamodb = DynamoDBService()
        if device_name in user_devices:
            sensor_data = dynamodb.get_event_logs(device_name)
            if sensor_data:
                return sensor_data
            else:
                raise HTTPException(status_code=404, detail="No sensor data found for this device")
        else:
            raise HTTPException(status_code=403, detail="Device not associated with the user")
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.post("/sensordata/aggregate")
async def get_sensor_data(request: Request, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        data = await request.json()
        user_email = current_user.get("sub")
        device_name = data["device"]
        user_devices = [device["device"] for device in get_user_devices(db, user_email)]
        dynamodb = DynamoDBService()
        if device_name in user_devices:
            return dynamodb.get_event_logs_agg(device_name)
        else:
            raise HTTPException(status_code=403, detail="Device not associated with the user")
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.get("/userdeviceslist")
async def add_device_connection(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        user_email = current_user.get("sub")
        return get_user_devices(db, user_email)
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token")
    device = websocket.query_params.get("device")
    if not token or not device:
        await websocket.close(code=1008) 
        return
    try:
        current_user = decode_access_token(token)
    except Exception:
        await websocket.close(code=1008)
        return

    await websocket.accept()
    loop = asyncio.get_running_loop() 
    mqtt_service = MQTTService()
    mqtt_service.connect()
    topic = f"edge/{device}/logs" 
    mqtt_service.subscribe_to_topic(topic)
    mqtt_service.set_on_data_callback(lambda data: asyncio.run_coroutine_threadsafe(websocket.send_text(data), loop))

    try:
        while True:
            await websocket.receive_text() 
    except WebSocketDisconnect:
        pass

