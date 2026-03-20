from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.property import Property, PropertyStatus
from app.models.transaction import Transaction
import pandas as pd

router = APIRouter()

@router.get("/price-by-city")
def price_by_city(db: Session = Depends(get_db)):
    """Prix moyen par ville"""
    results = (
        db.query(Property.city, func.avg(Property.price).label("avg_price"), func.count(Property.id).label("count"))
        .group_by(Property.city)
        .all()
    )
    return [{"city": r.city, "avg_price": round(r.avg_price, 2), "count": r.count} for r in results]

@router.get("/sales-stats")
def sales_stats(db: Session = Depends(get_db)):
    """Statistiques de ventes par agence"""
    results = (
        db.query(
            Transaction.agency_id,
            func.count(Transaction.id).label("total_sales"),
            func.sum(Transaction.price).label("total_revenue")
        )
        .group_by(Transaction.agency_id)
        .all()
    )
    return [
        {"agency_id": r.agency_id, "total_sales": r.total_sales, "total_revenue": r.total_revenue}
        for r in results
    ]

@router.get("/popular-cities")
def popular_cities(db: Session = Depends(get_db)):
    """Villes avec le plus de biens disponibles"""
    results = (
        db.query(Property.city, func.count(Property.id).label("count"))
        .filter(Property.status == PropertyStatus.available)
        .group_by(Property.city)
        .order_by(func.count(Property.id).desc())
        .limit(10)
        .all()
    )
    return [{"city": r.city, "listings": r.count} for r in results]

@router.get("/price-prediction")
def price_prediction(surface: float, rooms: int, city: str, db: Session = Depends(get_db)):
    """Prédiction de prix basique par régression linéaire"""
    from sklearn.linear_model import LinearRegression
    import numpy as np

    props = db.query(Property).filter(
        Property.city.ilike(f"%{city}%"),
        Property.surface.isnot(None)
    ).all()

    if len(props) < 5:
        return {"error": "Pas assez de données pour cette ville", "min_required": 5}

    df = pd.DataFrame([{"surface": p.surface, "rooms": p.rooms, "price": p.price} for p in props])
    df = df.dropna()

    X = df[["surface", "rooms"]].values
    y = df["price"].values

    model = LinearRegression()
    model.fit(X, y)

    predicted = model.predict([[surface, rooms]])[0]
    return {
        "city": city,
        "surface": surface,
        "rooms": rooms,
        "predicted_price": round(predicted, 2),
        "based_on": len(df)
    }
