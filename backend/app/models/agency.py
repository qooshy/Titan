from sqlalchemy import Column, Integer, String
from app.database import Base

class Agency(Base):
    __tablename__ = "agencies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    city = Column(String)
    address = Column(String)
    phone = Column(String)
    is_headquarters = Column(Integer, default=0)  # 1 = siège Aix-en-Provence
