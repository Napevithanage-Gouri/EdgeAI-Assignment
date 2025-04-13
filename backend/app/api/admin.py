from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta
from core.auth import get_current_user, get_password_hash, verify_password, create_access_token
from core.auth import ACCESS_TOKEN_EXPIRE_MINUTES
from db.database import get_db
from db.crud import get_all_users, get_user_by_email, create_user
from schema.auth import SignUpRequest, SignInRequest

router = APIRouter()

@router.get("/devices")
def get_sensor_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        return [
            {"device": "device A", "status": "active"},
            {"device": "device B", "status": "active"},
            {"device": "device C", "status": "active"}
        ]
    else:
        raise HTTPException(status_code=500, detail="User not found")

@router.get("/users")
def get_sensor_data(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user:
        return get_all_users(db)
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


