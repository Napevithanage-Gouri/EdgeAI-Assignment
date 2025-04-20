from sqlalchemy import UniqueConstraint, create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from core.config import Config

DATABASE_URL = Config.DATABASE_URL

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    authorized = Column(Boolean, default=False)
    admin_privilege = Column(Boolean, default=False)

    connections = relationship("Connection", back_populates="user")

class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)

    user = relationship("User", back_populates="connections")
    device = relationship("Device", back_populates="connections")

    __table_args__ = (
        UniqueConstraint('user_id', 'device_id', name='unique_user_device'),
    )

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    device_name = Column(String(255), nullable=False, unique=True)
    
    connections = relationship("Connection", back_populates="device")


Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()