from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta
from core.auth import get_password_hash, verify_password, create_access_token
from core.auth import ACCESS_TOKEN_EXPIRE_MINUTES
from db.database import get_db
from db.crud import get_user_by_email, create_user, get_user_devices
from schema.auth import SignUpRequest, SignInRequest
from fastapi import Depends
from core.auth import get_current_user

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


@router.get("/devices")
def get_user_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        return [
            {"device": "device A", "status": "active"},
            {"device": "device B", "status": "active"},
            {"device": "device C", "status": "active"}
        ]
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.get("/sensordata")
def get_sensor_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        return [
            {"location": "Location A", "image": "image_a.jpg", "speed": "50 km/h", "prediction": "pass"},
            {"location": "Location B", "image": "image_b.jpg", "speed": "60 km/h", "prediction": "pass"},
            {"location": "Location C", "image": "image_c.jpg", "speed": "70 km/h", "prediction": "pass"}
        ]
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.get("/userdeviceslist")
async def add_device_connection(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        user_email = current_user.get("sub")
        return get_user_devices(db, user_email)
    else:
        raise HTTPException(status_code=500, detail="User not found")

