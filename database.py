import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "haccp.db")


async def get_db():
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    try:
        yield db
    finally:
        await db.close()


async def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        await db.executescript("""
            CREATE TABLE IF NOT EXISTS restaurants (
                id   INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS fridges (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                restaurant_id INTEGER NOT NULL,
                name          TEXT    NOT NULL,
                type          TEXT    NOT NULL CHECK(type IN ('froid','congelateur')),
                min_temp      REAL    NOT NULL,
                max_temp      REAL    NOT NULL
            );

            CREATE TABLE IF NOT EXISTS records (
                id            INTEGER  PRIMARY KEY AUTOINCREMENT,
                restaurant_id INTEGER  NOT NULL,
                fridge_id     INTEGER  NOT NULL,
                fridge_name   TEXT     NOT NULL,
                employee_name TEXT     NOT NULL,
                temperature   REAL     NOT NULL,
                is_ok         BOOLEAN  NOT NULL,
                created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        """)
        await db.commit()

        # Seed restaurants if empty
        cur = await db.execute("SELECT COUNT(*) FROM restaurants")
        count = (await cur.fetchone())[0]
        if count == 0:
            seed_sql = os.path.join(os.path.dirname(__file__), "data", "seed.sql")
            with open(seed_sql, "r") as f:
                await db.executescript(f.read())
            await db.commit()
