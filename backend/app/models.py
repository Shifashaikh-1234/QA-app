from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID, JSONB

class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    images = relationship("ImageUpload", back_populates="owner")

class ImageUpload(Base):
    __tablename__ = 'images'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    filename = Column(String)
    content = Column(JSONB)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    owner = relationship("User", back_populates="images")

class Inventory(Base):
    __tablename__ = 'inventory'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    product_name = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    price_per_unit = Column(Float, nullable=False)

class ExtractedItem(Base):
    __tablename__ = "extracted_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    upload_id = Column(UUID(as_uuid=True), ForeignKey("images.id"))
    item_name = Column(String)
    quantity = Column(Integer)


class Quotation(Base):
    __tablename__ = "quotations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    upload_id = Column(UUID(as_uuid=True), ForeignKey("images.id"))
    items = Column(JSONB)
    total_amount = Column(Float)
