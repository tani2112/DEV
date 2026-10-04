import React, { useState } from 'react';
import { 
  Clock, 
  Users, 
  Bookmark, 
  Check, 
  Copy, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  CheckSquare, 
  Square,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => Promise<void>;
  onCreateAnother: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSave,
  onCreateAnother,
  isSaving,
  isSaved,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopy = () => {
    const text = [
      recipe.title,
      '='.repeat(recipe.title.length),
      recipe.description,
      '',
      `Cooking Time: ${recipe.cooking_time}`,
      `Servings: ${recipe.servings}`,
      '',
      'INGREDIENTS:',
      ...recipe.ingredients.map((ing) => `- ${ing}`),
      '',
      'STEPS:',
      ...recipe.steps.map((st, i) => `${i + 1}. ${st}`),
      '',
      recipe.notes && recipe.notes !== 'Not specified' ? `NOTES:\n${recipe.notes}` : '',
      '',
      '-- Preserved with Dadi\'s Recipe Vault --'
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onCreateAnother}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-stone-600 bg-cookbook-surface border border-cookbook-border hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Create Another</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-stone-600 bg-cookbook-surface border border-cookbook-border hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-sm"
            title="Copy formatted recipe"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-stone-600 bg-cookbook-surface border border-cookbook-border hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-sm"
            title="Print recipe card"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={() => onSave(recipe)}
            disabled={isSaving || isSaved}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
              isSaved
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-cookbook-primary hover:bg-orange-800 text-white active:scale-95'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved in Vault</span>
              </>
            ) : isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Recipe</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Recipe Card (Cookbook Styling) */}
      <article className="recipe-card-print bg-cookbook-surface border-2 border-cookbook-border rounded-3xl p-6 sm:p-10 shadow-warm relative overflow-hidden">
        {/* Decorative corner stamp */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-bl-full pointer-events-none" />

        {/* AI Model Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-cookbook-primary" />
            <span>Structured with {recipe.model_used || 'Meta Llama 3.1 8B'}</span>
          </span>
        </div>

        {/* Title & Description */}
        <div className="border-b border-cookbook-border pb-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-cookbook-textDark tracking-tight leading-snug">
            {recipe.title}
          </h1>
          {recipe.description && (
            <p className="mt-3 text-base text-stone-600 font-light leading-relaxed italic">
              "{recipe.description}"
            </p>
          )}

          {/* Quick Metrics: Cooking Time & Servings */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cookbook-card border border-cookbook-border">
              <Clock className="w-4 h-4 text-cookbook-primary" />
              <span className="text-stone-500 text-xs">Cooking Time:</span>
              <span className={recipe.cooking_time === 'Not specified' ? 'text-stone-400 italic font-normal' : 'text-stone-800'}>
                {recipe.cooking_time}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cookbook-card border border-cookbook-border">
              <Users className="w-4 h-4 text-cookbook-primary" />
              <span className="text-stone-500 text-xs">Servings:</span>
              <span className={recipe.servings === 'Not specified' ? 'text-stone-400 italic font-normal' : 'text-stone-800'}>
                {recipe.servings}
              </span>
            </div>
          </div>
        </div>

        {/* Two-Column or Stacked Grid: Ingredients & Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Ingredients Column (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif text-cookbook-textDark flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cookbook-primary" />
                Ingredients
              </h2>
              <span className="text-xs text-stone-400 font-sans">
                {recipe.ingredients.length} items
              </span>
            </div>

            <ul className="space-y-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                const isUnspecified = ing.toLowerCase().includes('not specified');

                return (
                  <li
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer select-none transition-all text-sm leading-relaxed ${
                      isChecked
                        ? 'bg-emerald-50 text-stone-400 line-through'
                        : 'hover:bg-cookbook-card text-cookbook-textDark'
                    }`}
                  >
                    <button
                      type="button"
                      aria-label="Toggle ingredient"
                      className="mt-0.5 text-stone-400 hover:text-stone-600 transition-colors flex-shrink-0"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <span className={isUnspecified ? 'italic text-stone-500' : ''}>
                      {ing}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Steps Column (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif text-cookbook-textDark flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                Instructions
              </h2>
              <span className="text-xs text-stone-400 font-sans">
                {recipe.steps.length} steps
              </span>
            </div>

            <ol className="space-y-4">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center mt-0.5 shadow-xs">
                    {idx + 1}
                  </span>
                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed pt-0.5">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Dadi's Notes / Tips Section */}
        {recipe.notes && (
          <div className="mt-8 pt-6 border-t border-cookbook-border">
            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 sm:p-5 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-900 font-serif">
                  Dadi's Notes & Advice
                </h3>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed whitespace-pre-line">
                  {recipe.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Missing information notice if any */}
        {(recipe.cooking_time === 'Not specified' || recipe.servings === 'Not specified') && (
          <div className="mt-4 flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>
              Certain details were not specified in the original recording and have been left strictly uninvented to honor the authentic recipe.
            </span>
          </div>
        )}
      </article>
    </div>
  );
};
