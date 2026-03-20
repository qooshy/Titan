from sqlalchemy import Column, Integer, String, Boolean, Enum
from app.database import Base
import enum

class Role(str, enum.Enum):
    client = "client"
    commercial = "commercial"
    direction = "direction"
    marketing = "marketing"
    rh_juridique = "rh_juridique"
    it_support = "it_support"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(Role), default=Role.client)
    agency_id = Column(Integer, nullable=True)  # FK vers agency
    is_active = Column(Boolean, default=True)
