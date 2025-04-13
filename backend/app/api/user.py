from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta
from core.auth import get_password_hash, verify_password, create_access_token
from core.auth import ACCESS_TOKEN_EXPIRE_MINUTES
from db.database import get_db
from db.crud import get_user_by_email, create_user
from schema.auth import SignUpRequest, SignInRequest
from fastapi import Depends
from core.auth import get_current_user

router = APIRouter()

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
