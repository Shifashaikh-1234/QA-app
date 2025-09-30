from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from .auth import get_db
from .models import Inventory
from rapidfuzz import process, fuzz

router = APIRouter()

@router.get("/inventory/match")
def match_inventory(query: str, db: Session = Depends(get_db)):
    items = db.query(Inventory).all()

    # Use correct attribute from model
    names = [i.product_name for i in items]

    # Fuzzy matching
    matches = process.extract(query, names, limit=5, scorer=fuzz.WRatio)
   
    

    results = []
    SCORE_THRESHOLD = 70
    for name, score, _ in matches:
        if score < SCORE_THRESHOLD:
            continue
        item = next((i for i in items if i.product_name == name), None)
        if item:
            results.append({
                "name": item.product_name,
                "price": item.price_per_unit,
                "score": score
            })

            if not results:
                return [{"name": "No Match Found", "price": None, "score": 0}]

    return results
