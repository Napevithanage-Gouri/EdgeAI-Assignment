from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder
from core.config import Config
import uuid
import time
from typing import Callable

class MQTTService:
    def __init__(self):
        self.mqtt_connection = None
        self.on_data_callback: Callable[[str], None] = None

    def connect(self):
        credentials_provider = auth.AwsCredentialsProvider.new_static(
            access_key_id=Config.AWS_ACCESS_KEY_ID,
            secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
        )
        self.mqtt_connection = mqtt_connection_builder.websockets_with_default_aws_signing(
            endpoint=Config.IOT_CORE_URL,
            region=Config.AWS_REGION,
            credentials_provider=credentials_provider,
            client_id="python-client-" + str(uuid.uuid4()),
            clean_session=False,
            keep_alive_secs=30
        )

        print("Connecting to AWS IoT Core via WebSocket...")
        connect_future = self.mqtt_connection.connect()
        connect_future.result()
        print("Connected!")

    def subscribe_to_topic(self, topic: str):
        def on_message(topic, payload, dup, qos, retain, **kwargs):
            # print(f"Received message on {topic}: {payload.decode()[:300]}")
            if self.on_data_callback:
                self.on_data_callback(payload.decode())

        print(f"Subscribing to topic: {topic}")
        subscribe_future, _ = self.mqtt_connection.subscribe(
            topic=topic,
            qos=mqtt.QoS.AT_LEAST_ONCE,
            callback=on_message
        )
        subscribe_future.result()
        print("Subscribed!")

    def set_on_data_callback(self, callback: Callable[[str], None]):
        self.on_data_callback = callback
