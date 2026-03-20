"""
Seed script - peuple la DB avec des données de test réalistes pour Ymmo
Lance avec : docker exec -it titan-backend-1 python seed.py
"""
import sys
sys.path.insert(0, "/app")

from app.database import SessionLocal, engine, Base
from app.models.agency import Agency
from app.models.user import User, Role
from app.models.property import Property, PropertyType, PropertyStatus
from app.models.transaction import Transaction, TransactionType
from passlib.context import CryptContext
from datetime import datetime, timedelta
import random

Base.metadata.create_all(bind=engine)
db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── Agences ──────────────────────────────────────────────────────────────────
agencies_data = [
    {"name": "Ymmo Siège - Aix-en-Provence", "city": "Aix-en-Provence", "address": "12 Cours Mirabeau", "phone": "04 42 00 00 00", "is_headquarters": 1},
    {"name": "Ymmo Paris 8",      "city": "Paris",         "address": "45 Av. des Champs-Élysées", "phone": "01 40 00 00 01", "is_headquarters": 0},
    {"name": "Ymmo Lyon Centre",  "city": "Lyon",          "address": "3 Place Bellecour",          "phone": "04 72 00 00 02", "is_headquarters": 0},
    {"name": "Ymmo Marseille",    "city": "Marseille",     "address": "10 La Canebière",            "phone": "04 91 00 00 03", "is_headquarters": 0},
    {"name": "Ymmo Bordeaux",     "city": "Bordeaux",      "address": "5 Place des Quinconces",     "phone": "05 56 00 00 04", "is_headquarters": 0},
    {"name": "Ymmo Toulouse",     "city": "Toulouse",      "address": "2 Place du Capitole",        "phone": "05 61 00 00 05", "is_headquarters": 0},
    {"name": "Ymmo Nice",         "city": "Nice",          "address": "8 Promenade des Anglais",    "phone": "04 93 00 00 06", "is_headquarters": 0},
    {"name": "Ymmo Nantes",       "city": "Nantes",        "address": "1 Place du Commerce",        "phone": "02 40 00 00 07", "is_headquarters": 0},
    {"name": "Ymmo Strasbourg",   "city": "Strasbourg",    "address": "4 Place Kléber",             "phone": "03 88 00 00 08", "is_headquarters": 0},
    {"name": "Ymmo Montpellier",  "city": "Montpellier",   "address": "6 Place de la Comédie",      "phone": "04 67 00 00 09", "is_headquarters": 0},
    {"name": "Ymmo Rennes",       "city": "Rennes",        "address": "7 Place de la République",   "phone": "02 99 00 00 10", "is_headquarters": 0},
    {"name": "Ymmo Lille",        "city": "Lille",         "address": "9 Grand Place",              "phone": "03 20 00 00 11", "is_headquarters": 0},
    {"name": "Ymmo Grenoble",     "city": "Grenoble",      "address": "11 Place Victor Hugo",       "phone": "04 76 00 00 12", "is_headquarters": 0},
]

agencies = []
for a in agencies_data:
    agency = Agency(**a)
    db.add(agency)
    db.flush()
    agencies.append(agency)
db.commit()
print(f"✅ {len(agencies)} agences créées")

# ── Utilisateurs ─────────────────────────────────────────────────────────────
users_data = [
    {"email": "admin@ymmo.fr",    "password": "admin123",  "full_name": "Admin Ymmo",      "role": Role.it_support,   "agency_id": agencies[0].id},
    {"email": "dir@ymmo.fr",      "password": "dir123",    "full_name": "Sophie Durand",   "role": Role.direction,    "agency_id": agencies[0].id},
    {"email": "com1@ymmo.fr",     "password": "com123",    "full_name": "Marc Lefebvre",   "role": Role.commercial,   "agency_id": agencies[1].id},
    {"email": "com2@ymmo.fr",     "password": "com123",    "full_name": "Julie Martin",    "role": Role.commercial,   "agency_id": agencies[2].id},
    {"email": "client1@gmail.com","password": "client123", "full_name": "Pierre Moreau",   "role": Role.client,       "agency_id": None},
    {"email": "client2@gmail.com","password": "client123", "full_name": "Emma Bernard",    "role": Role.client,       "agency_id": None},
    {"email": "client3@gmail.com","password": "client123", "full_name": "Lucas Petit",     "role": Role.client,       "agency_id": None},
]

users = []
for u in users_data:
    user = User(
        email=u["email"],
        hashed_password=pwd_context.hash(u["password"]),
        full_name=u["full_name"],
        role=u["role"],
        agency_id=u["agency_id"]
    )
    db.add(user)
    db.flush()
    users.append(user)
db.commit()
print(f"✅ {len(users)} utilisateurs créés")

# ── Biens immobiliers ─────────────────────────────────────────────────────────
properties_data = [
    # Paris
    {"title": "Appartement Haussmannien", "city": "Paris", "address": "12 Rue de Rivoli", "zip_code": "75001", "price": 850000, "surface": 95, "rooms": 4, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 48.8566, "longitude": 2.3522},
    {"title": "Studio Montmartre", "city": "Paris", "address": "3 Rue Lepic", "zip_code": "75018", "price": 320000, "surface": 28, "rooms": 1, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 48.8847, "longitude": 2.3388},
    {"title": "Loft République", "city": "Paris", "address": "45 Av. de la République", "zip_code": "75011", "price": 620000, "surface": 72, "rooms": 3, "property_type": PropertyType.residential, "status": PropertyStatus.sold, "latitude": 48.8630, "longitude": 2.3634},
    {"title": "Bureau Opéra", "city": "Paris", "address": "8 Bd des Capucines", "zip_code": "75009", "price": 1200000, "surface": 180, "rooms": 6, "property_type": PropertyType.professional, "status": PropertyStatus.available, "latitude": 48.8719, "longitude": 2.3311},
    # Lyon
    {"title": "T3 Presqu'île", "city": "Lyon", "address": "5 Rue de la République", "zip_code": "69001", "price": 380000, "surface": 68, "rooms": 3, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 45.7640, "longitude": 4.8357},
    {"title": "Maison Croix-Rousse", "city": "Lyon", "address": "22 Montée de la Grande Côte", "zip_code": "69001", "price": 490000, "surface": 110, "rooms": 5, "property_type": PropertyType.residential, "status": PropertyStatus.under_offer, "latitude": 45.7750, "longitude": 4.8300},
    {"title": "Local commercial Part-Dieu", "city": "Lyon", "address": "17 Rue du Docteur Bouchut", "zip_code": "69003", "price": 650000, "surface": 120, "rooms": 4, "property_type": PropertyType.professional, "status": PropertyStatus.available, "latitude": 45.7606, "longitude": 4.8590},
    # Marseille
    {"title": "Appartement vue mer", "city": "Marseille", "address": "3 Corniche Kennedy", "zip_code": "13007", "price": 420000, "surface": 75, "rooms": 3, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 43.2800, "longitude": 5.3570},
    {"title": "Villa Les Goudes", "city": "Marseille", "address": "8 Rue des Goudes", "zip_code": "13008", "price": 780000, "surface": 160, "rooms": 6, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 43.2100, "longitude": 5.3500},
    # Bordeaux
    {"title": "Appartement Chartrons", "city": "Bordeaux", "address": "15 Rue Notre-Dame", "zip_code": "33000", "price": 310000, "surface": 60, "rooms": 3, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 44.8537, "longitude": -0.5702},
    {"title": "Maison avec jardin", "city": "Bordeaux", "address": "4 Allée des Acacias", "zip_code": "33200", "price": 520000, "surface": 140, "rooms": 5, "property_type": PropertyType.residential, "status": PropertyStatus.sold, "latitude": 44.8600, "longitude": -0.5800},
    # Toulouse
    {"title": "T2 Capitole", "city": "Toulouse", "address": "7 Rue Saint-Rome", "zip_code": "31000", "price": 220000, "surface": 45, "rooms": 2, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 43.6047, "longitude": 1.4442},
    {"title": "Loft industriel", "city": "Toulouse", "address": "12 Rue du Taur", "zip_code": "31000", "price": 350000, "surface": 85, "rooms": 3, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 43.6080, "longitude": 1.4410},
    # Nice
    {"title": "Appartement Promenade", "city": "Nice", "address": "10 Promenade des Anglais", "zip_code": "06000", "price": 680000, "surface": 90, "rooms": 4, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 43.6955, "longitude": 7.2661},
    {"title": "Studio Vieux-Nice", "city": "Nice", "address": "3 Cours Saleya", "zip_code": "06300", "price": 195000, "surface": 25, "rooms": 1, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 43.6961, "longitude": 7.2758},
    # Aix-en-Provence
    {"title": "Appartement Cours Mirabeau", "city": "Aix-en-Provence", "address": "20 Cours Mirabeau", "zip_code": "13100", "price": 450000, "surface": 80, "rooms": 3, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 43.5263, "longitude": 5.4454},
    {"title": "Villa avec piscine", "city": "Aix-en-Provence", "address": "5 Route de Galice", "zip_code": "13100", "price": 950000, "surface": 220, "rooms": 7, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 43.5300, "longitude": 5.4200},
    # Nantes
    {"title": "T4 Île de Nantes", "city": "Nantes", "address": "8 Bd de la Prairie au Duc", "zip_code": "44200", "price": 340000, "surface": 78, "rooms": 4, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 47.2055, "longitude": -1.5582},
    # Lille
    {"title": "Maison de ville", "city": "Lille", "address": "3 Rue de Gand", "zip_code": "59000", "price": 280000, "surface": 100, "rooms": 4, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 50.6292, "longitude": 3.0573},
    # Montpellier
    {"title": "T3 Antigone", "city": "Montpellier", "address": "12 Place du Nombre d'Or", "zip_code": "34000", "price": 260000, "surface": 65, "rooms": 3, "property_type": PropertyType.residential, "status": PropertyStatus.available, "latitude": 43.6110, "longitude": 3.8978},
]

properties = []
for i, p in enumerate(properties_data):
    agency = agencies[i % len(agencies)]
    prop = Property(**p, agency_id=agency.id, description=f"Beau bien situé en plein cœur de {p['city']}. Idéal pour habiter ou investir.")
    db.add(prop)
    db.flush()
    properties.append(prop)
db.commit()
print(f"✅ {len(properties)} biens créés")

# ── Transactions ──────────────────────────────────────────────────────────────
sold_properties = [p for p in properties if p.status == PropertyStatus.sold]
transactions = []
for i, prop in enumerate(sold_properties):
    t = Transaction(
        property_id=prop.id,
        buyer_id=users[4 + (i % 3)].id,
        seller_id=users[2 + (i % 2)].id,
        agency_id=prop.agency_id,
        transaction_type=TransactionType.sale,
        price=prop.price,
        completed_at=datetime.utcnow() - timedelta(days=random.randint(10, 90))
    )
    db.add(t)
    transactions.append(t)
db.commit()
print(f"✅ {len(transactions)} transactions créées")

db.close()
print("\n🎉 Seed terminé ! Comptes de test :")
print("  admin@ymmo.fr     / admin123  (IT Support)")
print("  dir@ymmo.fr       / dir123    (Direction)")
print("  com1@ymmo.fr      / com123    (Commercial)")
print("  client1@gmail.com / client123 (Client)")
