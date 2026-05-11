from fastapi import APIRouter, Depends
from database import get_db

router = APIRouter(prefix="/restaurants", tags=["restaurants"])


@router.get("")
async def list_restaurants(db=Depends(get_db)):
    cur = await db.execute("SELECT id, name FROM restaurants ORDER BY name")
    rows = await cur.fetchall()
    return [dict(r) for r in rows]
