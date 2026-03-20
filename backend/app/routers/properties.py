from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.property import Property, PropertyStatus, PropertyType
from typing import Optional

router = APIRouter()

@router.get("/")
def get_properties(
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    property_type: Optional[PropertyType] = None,
    status: Optional[PropertyStatus] = PropertyStatus.available,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Property)
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if min_price:
        query = query.filter(Property.price >= min_price)
    if max_price:
        query = query.filter(Property.price <= max_price)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if status:
        query = query.filter(Property.status == status)
    return query.offset(skip).limit(limit).all()

@router.get("/{property_id}")
def get_property(property_id: int, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop

@router.post("/")
def create_property(data: dict, db: Session = Depends(get_db)):
    prop = Property(**data)
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop

@router.put("/{property_id}")
def update_property(property_id: int, data: dict, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    for key, value in data.items():
        setattr(prop, key, value)
    db.commit()
    db.refresh(prop)
    return prop

@router.delete("/{property_id}")
def delete_property(property_id: int, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(prop)
    db.commit()
    return {"message": "Deleted"}
