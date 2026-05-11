from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from database import get_db
import datetime

router = APIRouter(prefix="/records", tags=["records"])


class RecordIn(BaseModel):
    restaurant_id: int
    fridge_id: int
    fridge_name: str
    employee_name: str
    temperature: float
    is_ok: bool


@router.post("", status_code=201)
async def create_record(payload: RecordIn, db=Depends(get_db)):
    cur = await db.execute(
        """INSERT INTO records
           (restaurant_id, fridge_id, fridge_name, employee_name, temperature, is_ok)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (
            payload.restaurant_id,
            payload.fridge_id,
            payload.fridge_name,
            payload.employee_name,
            payload.temperature,
            payload.is_ok,
        ),
    )
    await db.commit()
    record_id = cur.lastrowid
    cur2 = await db.execute("SELECT * FROM records WHERE id = ?", (record_id,))
    row = await cur2.fetchone()
    return dict(row)


@router.get("")
async def list_records(
    date: Optional[str] = Query(None, description="YYYY-MM-DD"),
    restaurant_id: Optional[int] = Query(None),
    db=Depends(get_db),
):
    if date is None:
        date = datetime.date.today().isoformat()

    conditions = ["DATE(created_at) = ?"]
    params: list = [date]

    if restaurant_id is not None:
        conditions.append("restaurant_id = ?")
        params.append(restaurant_id)

    where = " AND ".join(conditions)
    cur = await db.execute(
        f"SELECT * FROM records WHERE {where} ORDER BY created_at DESC",
        params,
    )
    rows = await cur.fetchall()
    return [dict(r) for r in rows]
