from sqlalchemy import func
from sqlalchemy.orm import Session
from .database import Device, User, Connection
from core.auth import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_all_users(db: Session):
    users =  db.query(User.id, User.name, User.email, User.authorized, User.admin_privilege).all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "authorization": "Yes" if user.authorized else "No",
            "admin_privilege": "Yes" if user.admin_privilege else "No"
        } for user in users
    ]

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

def get_all_devices(db: Session):
    devices = db.query(Device.id, Device.device_name).all()
    return [
        {
            "id": device.id,
            "device": device.device_name,
            "status":"active",
        } for device in devices
    ]

def get_device_by_name(db: Session, device_name: str):
    return db.query(Device).filter(Device.device_name == device_name).first()

def create_device(db: Session, device_name: str):
    new_device = Device(
        device_name=device_name,
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device

def update_device(db: Session, device_name: str, new_device_name: str = None):
    device = get_device_by_name(db, device_name)
    if device:
        if new_device_name is not None:
            device.device_name = new_device_name
        db.commit()
        db.refresh(device)
        return device
    return None

def delete_device(db: Session, device_name: str):
    device = get_device_by_name(db, device_name)
    if device:
        db.delete(device)
        db.commit()
        return True
    return False

def create_connection(db: Session, user_id: int, device_id: int):
    new_connection = Connection(
        user_id=user_id,
        device_id=device_id,
    )
    db.add(new_connection)
    db.commit()
    db.refresh(new_connection)
    return new_connection

def get_all_connections(db: Session):
    connections = db.query(Connection.id, Connection.user_id, Connection.device_id).all()
    return [
        {
            "id": connection.id,
            "user_id": connection.user_id,
            "device_id": connection.device_id,
        } for connection in connections
    ]

def get_connection_by_id(db: Session, connection_id: int):
    return db.query(Connection).filter(Connection.id == connection_id).first()

def update_connection(db: Session, connection_id: int, user_id: int = None, device_id: int = None):
    connection = get_connection_by_id(db, connection_id)
    if connection:
        if user_id is not None:
            connection.user_id = user_id
        if device_id is not None:
            connection.device_id = device_id
        db.commit()
        db.refresh(connection)
        return connection
    return None

def delete_connection(db: Session, connection_id: int):
    connection = get_connection_by_id(db, connection_id)
    if connection:
        db.delete(connection)
        db.commit()
        return True
    return False

def get_all_userdevices(db: Session):
    userdevices = (
        db.query(User.name, User.email, func.count(Device.id).label("device_count"))
        .outerjoin(Connection, User.id == Connection.user_id)
        .outerjoin(Device, Device.id == Connection.device_id)
        .group_by(User.id)
        .all()
    )
    return [
        {
            "name": userdevice.name,
            "email": userdevice.email,
            "device_count": userdevice.device_count,
        } for userdevice in userdevices
    ]

def get_user_devices(db: Session, user_email: str):
    user = get_user_by_email(db, user_email)
    if user:
        devices = (
            db.query(Device.device_name)
            .join(Connection, Device.id == Connection.device_id)
            .filter(Connection.user_id == user.id)
            .all()
        )
    return [
        {
            "device": device.device_name,
            "status": "active",
        } for device in devices
    ]


