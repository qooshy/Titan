from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Enum
from app.database import Base
from datetime import datetime
import enum

class TransactionType(str, enum.Enum):
    sale = "sale"
    purchase = "purchase"

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    agency_id = Column(Integer, ForeignKey("agencies.id"))
    transaction_type = Column(Enum(TransactionType))
    price = Column(Float)
    completed_at = Column(DateTime, default=datetime.utcnow)
