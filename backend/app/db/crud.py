from sqlalchemy.orm import Session
from .database import User
from core.auth import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, username: str, password: str, is_admin: bool):
    hashed_password = get_password_hash(password)
    new_user = User(
        email=email,
        name=username,
        password=hashed_password,
        admin_privilege=is_admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def update_user_password(db: Session, email: str, new_password: str):
    user = get_user_by_email(db, email)
    if user:
        user.password = get_password_hash(new_password)
        db.commit()
        db.refresh(user)
        return user
    return None

def delete_user(db: Session, email: str):
    user = get_user_by_email(db, email)
    if user:
        db.delete(user)
        db.commit()
        return True
    return False
