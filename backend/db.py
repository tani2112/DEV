import sqlite3
import json
import uuid
from typing import List, Optional
from datetime import datetime
import os
from models import RecipeResponse, RecipeSaveRequest

DB_PATH = os.environ.get("DATABASE_PATH", "recipes.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recipes (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            ingredients TEXT NOT NULL,
            steps TEXT NOT NULL,
            cooking_time TEXT,
            servings TEXT,
            notes TEXT,
            raw_transcript TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_recipe(recipe_data: RecipeSaveRequest) -> RecipeResponse:
    recipe_id = str(uuid.uuid4())
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO recipes (id, title, description, ingredients, steps, cooking_time, servings, notes, raw_transcript, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        recipe_id,
        recipe_data.title,
        recipe_data.description,
        json.dumps(recipe_data.ingredients),
        json.dumps(recipe_data.steps),
        recipe_data.cooking_time,
        recipe_data.servings,
        recipe_data.notes,
        recipe_data.raw_transcript or "",
        now
    ))
    conn.commit()
    conn.close()

    return RecipeResponse(
        id=recipe_id,
        title=recipe_data.title,
        description=recipe_data.description,
        ingredients=recipe_data.ingredients,
        steps=recipe_data.steps,
        cooking_time=recipe_data.cooking_time,
        servings=recipe_data.servings,
        notes=recipe_data.notes,
        raw_transcript=recipe_data.raw_transcript,
        created_at=now,
        model_used="Saved in Vault"
    )

def get_all_recipes(query: Optional[str] = None) -> List[RecipeResponse]:
    conn = get_connection()
    cursor = conn.cursor()
    if query and query.strip():
        search_pattern = f"%{query.strip()}%"
        cursor.execute("""
            SELECT * FROM recipes 
            WHERE title LIKE ? OR description LIKE ? OR ingredients LIKE ? OR notes LIKE ?
            ORDER BY created_at DESC
        """, (search_pattern, search_pattern, search_pattern, search_pattern))
    else:
        cursor.execute("SELECT * FROM recipes ORDER BY created_at DESC")
    
    rows = cursor.fetchall()
    conn.close()

    results = []
    for row in rows:
        results.append(RecipeResponse(
            id=row["id"],
            title=row["title"],
            description=row["description"],
            ingredients=json.loads(row["ingredients"]),
            steps=json.loads(row["steps"]),
            cooking_time=row["cooking_time"],
            servings=row["servings"],
            notes=row["notes"],
            raw_transcript=row["raw_transcript"],
            created_at=row["created_at"]
        ))
    return results

def get_recipe_by_id(recipe_id: str) -> Optional[RecipeResponse]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes WHERE id = ?", (recipe_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return RecipeResponse(
        id=row["id"],
        title=row["title"],
        description=row["description"],
        ingredients=json.loads(row["ingredients"]),
        steps=json.loads(row["steps"]),
        cooking_time=row["cooking_time"],
        servings=row["servings"],
        notes=row["notes"],
        raw_transcript=row["raw_transcript"],
        created_at=row["created_at"]
    )

def delete_recipe_by_id(recipe_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM recipes WHERE id = ?", (recipe_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted
