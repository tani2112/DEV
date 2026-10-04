import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  Users, 
  Trash2, 
  Eye, 
  BookOpen, 
  PlusCircle, 
  X,
  Calendar
} from 'lucide-react';
import type { Recipe } from '../types';

interface SavedRecipesProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => Promise<void>;
  onCreateNew: () => void;
  isLoading: boolean;
}

export const SavedRecipes: React.FC<SavedRecipesProps> = ({
  recipes,
  onSelectRecipe,
  onDeleteRecipe,
  onCreateNew,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = recipes.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const inTitle = r.title.toLowerCase().includes(term);
    const inDesc = r.description.toLowerCase().includes(term);
    const inIng = r.ingredients.some((i) => i.toLowerCase().includes(term));
    const inNotes = r.notes.toLowerCase().includes(term);
    return inTitle || inDesc || inIng || inNotes;
  });

  const handleDelete = async (e: React.MouseEvent, id?: string) => {
    e.stopPropagation();
    if (!id) return;
    if (!window.confirm("Are you sure you want to remove this recipe from the vault?")) {
      return;
    }
    setDeletingId(id);
    try {
      await onDeleteRecipe(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-cookbook-textDark flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cookbook-primary" />
            <span>Family Recipe Vault</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} preserved forever.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or ingredient..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-sm border border-cookbook-border bg-cookbook-surface focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-cookbook-textDark placeholder:text-stone-400 shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onCreateNew}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-cookbook-primary text-white hover:bg-orange-800 transition-colors shadow-xs flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Recipe</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-16 text-center text-stone-500 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-600/30 border-t-amber-600 rounded-full animate-spin" />
          <p className="text-sm font-medium">Opening Dadi's Vault...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recipes.length === 0 && (
        <div className="bg-cookbook-surface border border-cookbook-border rounded-2xl p-10 text-center space-y-4 shadow-warm">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-3xl">
            🍲
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-cookbook-textDark">
              Your vault is empty
            </h3>
            <p className="text-sm text-stone-500 max-w-sm mx-auto mt-1">
              Preserve your grandmother's secret dishes, spices, and cooking wisdom before they are lost to time.
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cookbook-primary text-white text-sm font-medium hover:bg-orange-800 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Recipe</span>
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && recipes.length > 0 && filtered.length === 0 && (
        <div className="bg-cookbook-surface border border-cookbook-border rounded-2xl p-8 text-center text-stone-500">
          <p className="text-sm font-medium">No recipes matched "{searchTerm}".</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-cookbook-primary hover:underline mt-2 inline-block font-semibold"
          >
            Clear search filter
          </button>
        </div>
      )}

      {/* Recipe Cards Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="group bg-cookbook-surface border border-cookbook-border rounded-2xl p-5 hover:border-cookbook-primary/50 hover:shadow-warm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold font-serif text-cookbook-textDark group-hover:text-cookbook-primary transition-colors leading-snug">
                    {recipe.title}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(e, recipe.id)}
                    disabled={deletingId === recipe.id}
                    title="Delete recipe from vault"
                    className="text-stone-300 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 flex-shrink-0"
                  >
                    {deletingId === recipe.id ? (
                      <div className="w-4 h-4 border-2 border-stone-300 border-t-red-600 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Key Ingredients Pill List */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {recipe.ingredients.slice(0, 3).map((ing, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] truncate max-w-[180px]"
                    >
                      {ing}
                    </span>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-medium">
                      +{recipe.ingredients.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Metadata & View Button */}
              <div className="mt-5 pt-3 border-t border-cookbook-border/60 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  {recipe.cooking_time && recipe.cooking_time !== 'Not specified' && (
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {recipe.cooking_time}
                    </span>
                  )}
                  {recipe.servings && recipe.servings !== 'Not specified' && (
                    <span className="flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3 text-stone-400" />
                      {recipe.servings}
                    </span>
                  )}
                  {recipe.created_at && (
                    <span className="flex items-center gap-1 text-[11px] text-stone-400">
                      <Calendar className="w-3 h-3" />
                      {recipe.created_at.split(' ')[0]}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-cookbook-primary font-medium group-hover:translate-x-0.5 transition-transform text-xs">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
