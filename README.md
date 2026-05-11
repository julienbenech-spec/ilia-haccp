# 🌡️ ILIA HACCP — Relevés de température

MVP de saisie des relevés de température frigos pour la chaîne de restaurants ILIA.  
Interface tablette/mobile optimisée, sans dépendances lourdes.

---

## 🚀 Lancement

```bash
pip install -r requirements.txt
python main.py
# → http://localhost:8000
```

L'application démarre sur `http://localhost:8000`.  
La base SQLite est créée automatiquement dans `data/haccp.db` au premier démarrage,  
avec les restaurants et frigos ILIA pré-chargés.

---

## 🏗️ Stack technique

| Composant  | Technologie               |
|------------|---------------------------|
| Backend    | Python 3.11+ · FastAPI · aiosqlite |
| Frontend   | HTML/CSS/JS vanilla — SPA mobile-first |
| Base       | SQLite (fichier local `data/haccp.db`) |
| Serveur    | Uvicorn (intégré)         |

---

## 🍽️ Restaurants & IDs

| Restaurant  | ID   |
|-------------|------|
| Mathurins   | 3287 |
| Vernier     | 4240 |
| Washington  | 5523 |
| Casanova    | 5829 |
| Rivière     | 5830 |

---

## 📋 Fonctionnalités MVP

### Page Accueil
- Sélection rapide du restaurant (grille de cartes)

### Page Saisie
- Sélection du frigo (liste par restaurant)
- Saisie température (clavier numérique, °C)
- Sélection de l'employé
- Indicateur visuel temps réel :
  - ✅ Vert → dans la plage (0–4°C frigo / −25–−18°C congélateur)
  - ⚠️ Rouge → hors plage HACCP

### Page Historique
- Filtres par restaurant et par date
- Tableau des relevés : heure, employé, frigo, température, statut

---

## 🔌 API REST

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/restaurants` | Liste des restaurants |
| GET | `/fridges?restaurant_id=X` | Frigos d'un restaurant |
| POST | `/records` | Enregistrer un relevé |
| GET | `/records?date=YYYY-MM-DD&restaurant_id=X` | Lister les relevés |

### Exemple POST `/records`

```json
{
  "restaurant_id": 5523,
  "fridge_id": 7,
  "fridge_name": "Frigo viandes",
  "employee_name": "Julien",
  "temperature": 2.5,
  "is_ok": true
}
```

Documentation interactive : [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📁 Structure

```
ilia-haccp/
├── README.md
├── requirements.txt
├── main.py              # Point d'entrée FastAPI
├── database.py          # Init SQLite + seed
├── routers/
│   ├── records.py
│   ├── restaurants.py
│   └── fridges.py
├── static/
│   ├── index.html       # SPA mobile-friendly
│   ├── style.css
│   └── app.js
└── data/
    └── seed.sql         # Restaurants & frigos ILIA
```

---

## ⚙️ Configuration des frigos

Éditer `data/seed.sql` pour ajouter/modifier les frigos.  
Supprimer `data/haccp.db` et relancer pour réinitialiser avec les nouvelles données.

---

## 📜 Licence

Usage interne ILIA — confidentiel.
