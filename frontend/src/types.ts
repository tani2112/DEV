export interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cooking_time: string;
  servings: string;
  notes: string;
  raw_transcript?: string;
  created_at?: string;
  model_used?: string;
}

export interface HealthStatus {
  status: string;
  app: string;
  version: string;
  ai_model: string;
  render_ready: boolean;
}
