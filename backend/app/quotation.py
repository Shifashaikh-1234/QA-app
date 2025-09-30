# backend/app/quotation.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .models import Quotation
from .schemas import QuotationCreate
from .auth import get_db
import uuid

router = APIRouter()

@router.post("/quotation/finalize")
def finalize_quote(data: QuotationCreate, db: Session = Depends(get_db)):
    quote = Quotation(
        id=str(uuid.uuid4()),
        user_id=data.user_id,
        upload_id=data.upload_id,
        items=data.items,
        total_amount=data.total_amount
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return {"quotation_id": quote.id, "message": "Quotation saved"}

@router.get("/quotation/{quotation_id}")
def get_quotation(quotation_id: str, db: Session = Depends(get_db)):
    quote = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Not found")
    return quote
