from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta
from core.auth import get_password_hash, verify_password, create_access_token
from core.auth import ACCESS_TOKEN_EXPIRE_MINUTES
from db.database import get_db
from db.crud import get_user_by_email, create_user
from schema.auth import SignUpRequest, SignInRequest

router = APIRouter()

@router.post("/signup")
async def sign_up(request: SignUpRequest, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    if request.role not in ["Admin", "User"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    create_user(
        db=db,
        email=request.email,
        username=request.username,
        password=request.password,
        is_admin=(request.role == "Admin")
    )
    return {"message": "User registered successfully"}

@router.post("/signin")
async def sign_in(request: SignInRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, request.email)
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    role = "Admin" if user.admin_privilege else "User"
    
    access_token = create_access_token(
        data={"sub": user.email, "role": role},
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": role}
