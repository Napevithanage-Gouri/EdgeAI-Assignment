import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
from core.config import Config

class DynamoDBService:
    def __init__(self):
        self.dynamodb = boto3.resource(
            'dynamodb',
            region_name=Config.AWS_REGION,
            aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY
        )
        self.table = self.dynamodb.Table(f"edge-logs")

    def get_event_logs(self, device_name):
        response = self.table.query(
            KeyConditionExpression=Key('device_name').eq(device_name),
            Limit=100,
            ScanIndexForward=True  
        )
        items = response.get('Items', [])
        for item in items:
            if 'timestamp' in item:
                item['timestamp'] = datetime.fromtimestamp(int(item['timestamp']) / 1000).strftime('%Y-%m-%d %H:%M:%S')
        return items