import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RecipeForm } from './components/RecipeForm';
import { RecipeCard } from './components/RecipeCard';
import { SavedRecipes } from './components/SavedRecipes';
import { OpenSourceInfo } from './components/OpenSourceInfo';
import type { Recipe, HealthStatus } from './types';
import { 
  checkHealth, 
  generateRecipe, 
  saveRecipe, 
  getSavedRecipes, 
  deleteRecipe 
} from './api';
import { AlertCircle, X, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'create' | 'saved' | 'about'>('create');
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);

  // Initial data loading & health check
  useEffect(() => {
    const init = async () => {
      try {
        const healthData = await checkHealth();
        setHealth(healthData);
      } catch (err) {
        console.warn("Backend not yet reachable on startup:", err);
      }

      try {
        setIsLoadingSaved(true);
        const data = await getSavedRecipes();
        setSavedRecipes(data);
      } catch (err) {
        console.warn("Could not fetch saved recipes:", err);
      } finally {
        setIsLoadingSaved(false);
      }
    };

    init();
  }, []);

  // Handle recipe generation
  const handleGenerateRecipe = async (transcript: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateRecipe(transcript);
      setCurrentRecipe(generated);
      setIsSaved(false);
      // Stay on 'create' tab to show the result card
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate recipe.';
      setError(`Recipe generation failed: ${msg}. Please check backend connection.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving recipe to SQLite database
  const handleSaveRecipe = async (recipe: Recipe) => {
    setIsSaving(true);
    setError(null);
    try {
      const saved = await saveRecipe({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        cooking_time: recipe.cooking_time,
        servings: recipe.servings,
        notes: recipe.notes,
        raw_transcript: recipe.raw_transcript,
      });

      // Update local state
      setSavedRecipes((prev) => [saved, ...prev]);
      setCurrentRecipe(saved);
      setIsSaved(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save recipe.';
      setError(`Save failed: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle deleting recipe
  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteRecipe(id);
      setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
      if (currentRecipe?.id === id) {
        setCurrentRecipe(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not delete recipe.';
      setError(`Delete failed: ${msg}`);
    }
  };

  // Handle selecting a saved recipe to view
  const handleSelectRecipe = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setIsSaved(true);
    setCurrentTab('create');
  };

  const handleCreateAnother = () => {
    setCurrentRecipe(null);
    setIsSaved(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-cookbook-bg text-cookbook-textDark flex flex-col font-sans selection:bg-amber-200">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        savedCount={savedRecipes.length}
        health={health}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Error notification banner */}
        {error && (
          <div className="mb-6 max-w-3xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start justify-between gap-3 shadow-sm animate-fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Something went wrong</p>
                <p className="mt-0.5 text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab: About / Why Open-Source AI */}
        {currentTab === 'about' && (
          <OpenSourceInfo onBackToApp={() => setCurrentTab('create')} />
        )}

        {/* Tab: Saved Recipes Vault */}
        {currentTab === 'saved' && (
          <SavedRecipes
            recipes={savedRecipes}
            onSelectRecipe={handleSelectRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            onCreateNew={() => {
              setCurrentRecipe(null);
              setCurrentTab('create');
            }}
            isLoading={isLoadingSaved}
          />
        )}

        {/* Tab: Create Recipe or View Active Recipe */}
        {currentTab === 'create' && (
          <>
            {currentRecipe ? (
              <RecipeCard
                recipe={currentRecipe}
                onSave={handleSaveRecipe}
                onCreateAnother={handleCreateAnother}
                isSaving={isSaving}
                isSaved={isSaved}
              />
            ) : (
              <RecipeForm
                onSubmit={handleGenerateRecipe}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </main>

      {/* Warm Footer */}
      <footer className="border-t border-cookbook-border bg-cookbook-surface/70 py-6 mt-12 text-xs text-stone-500 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-cookbook-textDark">Dadi's Recipe Vault</span>
            <span>•</span>
            <span>Preserving culinary wisdom with Open-Weight AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('about')}
              className="text-stone-600 hover:text-cookbook-primary font-medium transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Why Open-Source AI?</span>
            </button>
            <span>•</span>
            <span className="text-stone-400">Hacktoberfest 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
