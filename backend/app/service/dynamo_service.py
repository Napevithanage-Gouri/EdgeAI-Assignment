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
        sorted_items = sorted(items, key=lambda x: x.get('timestamp', ''), reverse=True)
        return sorted_items

    def get_event_logs_agg(self, device_name):
        response = self.table.query(
            KeyConditionExpression=Key('device_name').eq(device_name),
            Limit=100,
            ScanIndexForward=True  
        )
        
        items = response.get('Items', [])
        
        for item in items:
            if 'timestamp' in item:
                item['timestamp'] = datetime.fromtimestamp(int(item['timestamp']) / 1000).strftime('%Y-%m-%d %H:%M:%S')

        if items:
                overall = {"Drowsy": 0, "Alert": 0}
                time_groups = {}
                for item in items:
                    time_key = item["timestamp"][:16]
                    if time_key not in time_groups:
                        time_groups[time_key] = {"time": time_key, "Drowsy": 0, "Alert": 0}
                    if item.get("event_type") is None:
                        overall["Drowsy"] += 1
                        time_groups[time_key]["Drowsy"] += 1
                    elif item.get("event_type").lower() == "not_drowsy":
                        overall["Alert"] += 1
                        time_groups[time_key]["Alert"] += 1
                time_series = sorted(list(time_groups.values()), key=lambda x: x["time"])
                return {"overall": overall, "time_series": time_series}