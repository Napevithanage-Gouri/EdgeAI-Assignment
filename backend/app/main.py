import uvicorn
from fastapi import FastAPI
from api import auth, user, admin
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],             
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],       
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    uvicorn.run()