import type { Recipe, HealthStatus } from './types';

// Environment variable for backend URL (Render requirement)
// In production on Render, VITE_API_URL points to the backend web service (e.g. https://dadis-vault-api.onrender.com)
// In development, default to http://localhost:8000
const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // If running in development and no env var is provided, default to localhost:8000
  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }
  // In production if not provided, assume reverse-proxy or same host
  return '';
};

const BASE_URL = getBaseUrl();

export async function checkHealth(): Promise<HealthStatus> {
  const response = await fetch(`${BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }
  return response.json();
}

export async function generateRecipe(transcript: string, apiKey?: string): Promise<Recipe> {
  const response = await fetch(`${BASE_URL}/api/recipes/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcript,
      api_key: apiKey || undefined,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Generation failed: ${response.statusText}`);
  }

  return response.json();
}

export async function saveRecipe(recipe: Omit<Recipe, 'id' | 'created_at'>): Promise<Recipe> {
  const response = await fetch(`${BASE_URL}/api/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to save recipe: ${response.statusText}`);
  }

  return response.json();
}

export async function getSavedRecipes(query?: string): Promise<Recipe[]> {
  const url = query && query.trim()
    ? `${BASE_URL}/api/recipes?q=${encodeURIComponent(query.trim())}`
    : `${BASE_URL}/api/recipes`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to load recipes: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/recipes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to delete recipe: ${response.statusText}`);
  }
}
