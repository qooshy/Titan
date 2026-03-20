from sqlalchemy import Column, Integer, String, Float, Boolean, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum

class PropertyType(str, enum.Enum):
    residential = "residential"
    professional = "professional"

class PropertyStatus(str, enum.Enum):
    available = "available"
    under_offer = "under_offer"
    sold = "sold"

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    surface = Column(Float)  # m²
    rooms = Column(Integer)
    address = Column(String)
    city = Column(String, index=True)
    zip_code = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    property_type = Column(Enum(PropertyType), default=PropertyType.residential)
    status = Column(Enum(PropertyStatus), default=PropertyStatus.available)
    agency_id = Column(Integer, ForeignKey("agencies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
