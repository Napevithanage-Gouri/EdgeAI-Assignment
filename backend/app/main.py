import uvicorn
from fastapi import FastAPI
from api import auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],             
    allow_credentials=True,
    allow_methods=["*"],         
    allow_headers=["*"],       
)

app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    uvicorn.run()