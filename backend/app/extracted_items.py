# backend/app/extracted_items.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .auth import get_db
from .models import ExtractedItem
from .schemas import ExtractedItemUpdate

router = APIRouter()

@router.patch("/extracted-item/{item_id}")

def update_extracted_item(item_id: str, update: ExtractedItemUpdate, db: Session = Depends(get_db)):
    item = db.query(ExtractedItem).filter(ExtractedItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.item_name = update.item_name
    item.quantity = update.quantity
    db.commit()
    return {"message": "Item updated", "data": {"id": item.id, "item_name": item.item_name, "quantity": item.quantity}}
