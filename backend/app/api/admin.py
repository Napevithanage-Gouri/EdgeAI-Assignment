from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta
from core.auth import get_current_user, get_password_hash, verify_password, create_access_token
from core.auth import ACCESS_TOKEN_EXPIRE_MINUTES
from db.database import get_db
from db.crud import create_connection, create_device, get_all_userdevices, get_all_users, get_user_by_email, create_user, get_user_devices, update_user_password, delete_user, get_all_devices, get_device_by_name
from schema.auth import SignUpRequest, SignInRequest

router = APIRouter()

@router.get("/devices")
def get_sensor_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        return get_all_devices(db)
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.post("/addevice")
async def add_device(request: Request, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        data = await request.json()
        device_name = data["device"]
        if device_name:
            create_device(db, device_name)
            return {"message": "Device added successfully"}
        else:
            raise HTTPException(status_code=400, detail="Device name is required")
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.get("/users")
def get_sensor_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        return get_all_users(db)
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.get("/userdevices")
def get_sensor_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        return get_all_userdevices(db)
    else:
        raise HTTPException(status_code=500, detail="User not found")
    
@router.post("/addconnection")
async def add_device_connection(request: Request,db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        data = await request.json()
        device_name = data["device"]
        user_email = data["email"]
        device = get_device_by_name(db, device_name)
        user = get_user_by_email(db, user_email)
        if not device:
            raise HTTPException(status_code=404, detail="Device not found")
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if device and user:
            create_connection(db, user.id, device.id)
            return {"message": "Connection created successfully"}
    else:
        raise HTTPException(status_code=500, detail="User not found")
    
@router.post("/userdeviceslist")
async def add_device_connection(request: Request,db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        user = await request.json()
        user_email = user["email"]
        
        return get_user_devices(db, user_email)
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.post("/setauthorization")
async def set_authorization(request: Request, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        user = await request.json()
        if user:
            db_user = get_user_by_email(db, user["email"])
            if db_user:
                db_user.authorized = 1 if user["authorization"] == "Yes" else 0
                db_user.admin_privilege = 1 if user["admin_privilege"] == "Yes" else 0
                db.commit()
                return {"message": "Authorization updated successfully"}
            else:
                raise HTTPException(status_code=404, detail="User not found")
    else:
        raise HTTPException(status_code=500, detail="User not found")


