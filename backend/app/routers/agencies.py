from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.agency import Agency

router = APIRouter()

@router.get("/")
def get_agencies(db: Session = Depends(get_db)):
    return db.query(Agency).all()

@router.post("/")
def create_agency(data: dict, db: Session = Depends(get_db)):
    agency = Agency(**data)
    db.add(agency)
    db.commit()
    db.refresh(agency)
    return agency
