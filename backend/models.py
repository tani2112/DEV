from pydantic import BaseModel, Field
from typing import List, Optional

class RecipeGenerationRequest(BaseModel):
    transcript: str = Field(..., description="Unstructured recipe transcript or text from family member")
    provider: Optional[str] = Field("groq", description="AI provider: groq, huggingface, openai_compatible, or fallback")
    api_key: Optional[str] = Field(None, description="Optional API key passed from frontend if user provided one")

class RecipeResponse(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., description="Descriptive title of the recipe")
    description: str = Field(..., description="Short story or nostalgic summary of the recipe")
    ingredients: List[str] = Field(default_factory=list, description="List of ingredients with exact quantities from transcript or 'Not specified'")
    steps: List[str] = Field(default_factory=list, description="Ordered step-by-step instructions")
    cooking_time: str = Field(..., description="Cooking/prep time, or 'Not specified' if missing")
    servings: str = Field(..., description="Estimated servings or 'Not specified' if missing")
    notes: str = Field(..., description="Grandma's secrets, tips, or missing info notes")
    raw_transcript: Optional[str] = None
    created_at: Optional[str] = None
    model_used: Optional[str] = "Meta-Llama-3.1-8B-Instruct"

class RecipeSaveRequest(BaseModel):
    title: str
    description: str
    ingredients: List[str]
    steps: List[str]
    cooking_time: str
    servings: str
    notes: str
    raw_transcript: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    ai_model: str
    render_ready: bool
