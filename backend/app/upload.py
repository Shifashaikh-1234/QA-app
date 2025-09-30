# backend/app/upload.py
import os
import uuid
import json
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

# adjust these imports to your project structure:
from .models import ImageUpload, ExtractedItem, User   # or whatever you have
from .auth import get_db, get_current_user             # your auth & db deps
from .extractor import extract_items                   # your image->items extractor

router = APIRouter()

TMP_DIR = os.path.join(os.getcwd(), "tmp_uploads")
os.makedirs(TMP_DIR, exist_ok=True)


def normalize_name(s: str) -> str:
    return " ".join((s or "").strip().lower().split())


def merge_items(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Merge items by normalized name summing quantities."""
    bucket: Dict[str, Dict[str, Any]] = {}
    for it in items:
        name = str(it.get("item", "")).strip()
        try:
            qty = int(it.get("quantity", 0) or 0)
        except Exception:
            qty = 0
        key = normalize_name(name)
        if not key:
            continue
        if key in bucket:
            bucket[key]["quantity"] += qty
        else:
            bucket[key] = {"item": name, "quantity": qty}
    return list(bucket.values())


@router.post("/upload")
async def upload_images(
    files: List[UploadFile] = File(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Accept multiple image files under form-field name "files".
    Returns per-file items and a merged items list across all files.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    all_items: List[Dict[str, Any]] = []
    response_files = []

    try:
        for file in files:
            # Save temp file
            tmp_name = f"{uuid.uuid4().hex}_{file.filename}"
            tmp_path = os.path.join(TMP_DIR, tmp_name)
            with open(tmp_path, "wb") as f:
                f.write(await file.read())

            # Call your extractor. It should return list of {item, quantity}
            # If your extractor is sync, call it directly; if async, await it.
            extracted = await extract_items(tmp_path)  # adjust if sync

            # Save the image metadata and extracted items to DB (optional)
            image_record = ImageUpload(
                filename=file.filename,
                user_id=user.id,
                content=json.dumps(extracted),
            )
            db.add(image_record)
            db.flush()  # ensure image_record.id is available

            for it in extracted:
                db.add(
                    ExtractedItem(
                        user_id=user.id,
                        upload_id=image_record.id,
                        item_name=str(it.get("item", "")).strip(),
                        quantity=int(it.get("quantity", 0) or 0),
                    )
                )

            response_files.append({"filename": file.filename, "items": extracted})
            all_items.extend(extracted)

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Extraction or save failed: {str(e)}")

    merged = merge_items(all_items)

    return {"files": response_files, "items": merged}

























#---------------------------------######################################
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
#from sqlalchemy.orm import Session
#from .auth import get_current_user, get_db
#from . import models
#import uuid
#from .extractor import extract_items 

# Inside the upload_image endpoint




#router = APIRouter()

#@router.post("/upload")
#async def upload_image(
   # file: UploadFile = File(...),
   # user=Depends(get_current_user),
   #db: Session = Depends(get_db)
#):
    # Generate a temporary filename
    #filename = f"temp_{uuid.uuid4()}_{file.filename}"
    #items = await extract_items(filename)
    

   # try:
        # Save uploaded file to disk
       # with open(filename, "wb") as buffer:
            #buffer.write(await file.read())  

        # Call async extractor function with saved filename
        #items = await extract_items(filename)

        # Save the data in database
        #image_record = models.ImageUpload(
          #  filename=file.filename,
           # content=str(items),
            #owner=user
        #)
        #db.add(image_record)
        #db.commit()
        #db.refresh(image_record)

        #return {
            #"filename": file.filename,
            #"items": items
        #}

    #except Exception as e:
        #raise HTTPException(status_code=500, detail=f"Extraction error: {str(e)}")

