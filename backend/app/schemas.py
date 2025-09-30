from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict


class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ImageOut(BaseModel):
    filename: str
    content: dict

# backend/app/schemas.py


class ExtractedItemUpdate(BaseModel):
    item_name: str
    quantity: int

class QuotationCreate(BaseModel):
    user_id: str
    upload_id: str
    items: List[Dict]
    total_amount: float
