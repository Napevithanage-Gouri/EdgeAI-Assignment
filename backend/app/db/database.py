from sqlalchemy import UniqueConstraint, create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

DATABASE_URL = "sqlite:///./db/test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    authorized = Column(Boolean, default=True)
    admin_privilege = Column(Boolean, default=True)

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
    device_name = Column(Integer, nullable=False, unique=True)
    
    connections = relationship("Connection", back_populates="device")


Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()