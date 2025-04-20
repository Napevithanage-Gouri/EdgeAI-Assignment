from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = os.getenv("AWS_REGION")
    DATABASE_URL = os.getenv("DATABASE_URL")
    IOT_CORE_URL = os.getenv("IOT_CORE_URL")
