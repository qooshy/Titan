from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import properties, users, agencies, analytics

# Crée toutes les tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Ymmo API",
    description="Plateforme immobilière Ymmo - Groupe Ynov",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(properties.router, prefix="/api/properties", tags=["Properties"])
app.include_router(agencies.router, prefix="/api/agencies", tags=["Agencies"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "Ymmo API is running "}
