from fastapi import Depends
from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from datetime import timedelta
from core.auth import get_current_user
from core.auth import ACCESS_TOKEN_EXPIRE_MINUTES
from core.auth import get_password_hash, verify_password, create_access_token
from db.database import get_db
from db.crud import get_user_by_email, create_user, get_user_devices
from schema.auth import SignUpRequest, SignInRequest
from service.dynamo_service import DynamoDBService
# from service.dynamo_service import DynamoDBService

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


# @router.get("/devices")
# def get_user_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
#     if current_user:
#         return [
#             {"device": "device A", "status": "active"},
#             {"device": "device B", "status": "active"},
#             {"device": "device C", "status": "active"}
#         ]
#     else:
#         raise HTTPException(status_code=500, detail="User not found")

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

@router.get("/userdeviceslist")
async def add_device_connection(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        user_email = current_user.get("sub")
        return get_user_devices(db, user_email)
    else:
        raise HTTPException(status_code=500, detail="User not found")

