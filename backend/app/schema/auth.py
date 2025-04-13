from pydantic import BaseModel


class SignUpRequest(BaseModel):
    email: str
    username: str
    password: str
    role: str

class SignInRequest(BaseModel):
    email: str
    password: str