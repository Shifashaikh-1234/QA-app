#from fastapi import FastAPI
#from . import models, database
#from fastapi.middleware.cors import CORSMiddleware
#from .users import router as user_router
#from .upload import router as upload_router
#from .database import SessionLocal






#models.Base.metadata.create_all(bind=database.engine)

#app = FastAPI()

#origins = ["*"]
#app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

#app.include_router(user_router)
#app.include_router(upload_router)


# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .users import router as user_router
from .upload import router as upload_router
from .extracted_items import router as extracted_router
from .inventory import router as inventory_router
from .quotation import router as quotation_router

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS
origins = ["*"]
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Routers
app.include_router(user_router)
app.include_router(upload_router)
app.include_router(extracted_router)
app.include_router(inventory_router)
app.include_router(quotation_router)
