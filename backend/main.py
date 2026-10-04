import os
import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from dotenv import load_dotenv

from models import (
    RecipeGenerationRequest,
    RecipeResponse,
    RecipeSaveRequest,
    HealthResponse
)
from ai_service import generate_recipe_from_transcript
import db

# Load environment variables
load_dotenv()

# Initialize Database
db.init_db()

app = FastAPI(
    title="Dadi's Recipe Vault API",
    description="Backend API to turn unstructured family recipe transcripts into structured recipes using open-weight AI.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and Render deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint required by Render and monitoring systems."""
    return HealthResponse(
        status="healthy",
        app="Dadi's Recipe Vault",
        version="1.0.0",
        ai_model="Meta-Llama-3.1-8B-Instruct (Open-Weight Model)",
        render_ready=True
    )

@app.post("/api/recipes/generate", response_model=RecipeResponse)
async def generate_recipe(request: RecipeGenerationRequest):
    """
    Transforms unstructured recipe voice transcripts or messy notes
    into a structured recipe using Meta Llama 3.1 8B Instruct.
    """
    if not request.transcript or not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript text cannot be empty.")
    
    try:
        recipe = await generate_recipe_from_transcript(
            transcript=request.transcript.strip(),
            user_api_key=request.api_key,
            provider=request.provider
        )
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recipe: {str(e)}")

@app.post("/api/recipes", response_model=RecipeResponse)
async def save_recipe(recipe: RecipeSaveRequest):
    """Saves a structured recipe into the SQLite database."""
    try:
        saved = db.save_recipe(recipe)
        return saved
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save recipe: {str(e)}")

@app.get("/api/recipes", response_model=List[RecipeResponse])
async def list_recipes(q: Optional[str] = Query(None, description="Optional search term")):
    """Retrieves all saved recipes, with optional search query."""
    try:
        recipes = db.get_all_recipes(query=q)
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recipes: {str(e)}")

@app.get("/api/recipes/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(recipe_id: str):
    """Retrieves a single saved recipe by its ID."""
    recipe = db.get_recipe_by_id(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    return recipe

@app.delete("/api/recipes/{recipe_id}")
async def delete_recipe(recipe_id: str):
    """Deletes a recipe from the vault."""
    success = db.delete_recipe_by_id(recipe_id)
    if not success:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    return {"message": "Recipe deleted successfully."}

if __name__ == "__main__":
    # Render provides PORT in the environment
    port = int(os.environ.get("PORT", 8000))
    # Host must be 0.0.0.0 as required by Render
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
