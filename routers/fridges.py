from fastapi import APIRouter, Depends, Query
from database import get_db

router = APIRouter(prefix="/fridges", tags=["fridges"])


@router.get("")
async def list_fridges(restaurant_id: int = Query(...), db=Depends(get_db)):
    cur = await db.execute(
        "SELECT id, restaurant_id, name, type, min_temp, max_temp "
        "FROM fridges WHERE restaurant_id = ? ORDER BY name",
        (restaurant_id,),
    )
    rows = await cur.fetchall()
    return [dict(r) for r in rows]
