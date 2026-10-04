import React, { useState } from 'react';
import { Sparkles, Wand2, ChefHat, ArrowRight, CornerDownRight, RotateCcw } from 'lucide-react';
import { EXAMPLES } from '../examples';
import type { RecipeExample } from '../examples';

interface RecipeFormProps {
  onSubmit: (transcript: string) => Promise<void>;
  isLoading: boolean;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit, isLoading }) => {
  const [transcript, setTranscript] = useState('');
  const [activeExampleIndex, setActiveExampleIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim() || isLoading) return;
    onSubmit(transcript.trim());
  };

  const handleSelectExample = (example: RecipeExample, index: number) => {
    setTranscript(example.transcript);
    setActiveExampleIndex(index);
  };

  const handleClear = () => {
    setTranscript('');
    setActiveExampleIndex(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero Title & Subtitle */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-medium mb-3 shadow-sm">
          <ChefHat className="w-3.5 h-3.5 text-cookbook-primary" />
          <span>Hacktoberfest 2026 • Open-Weight AI Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-cookbook-textDark tracking-tight leading-tight">
          Dadi's Recipe Vault
        </h2>
        <p className="mt-3 text-base sm:text-lg text-cookbook-textMuted max-w-xl mx-auto font-light">
          Turn a family recipe into something you can keep forever.
        </p>
      </div>

      {/* Main Card with Form */}
      <div className="bg-cookbook-surface border border-cookbook-border rounded-2xl p-5 sm:p-7 shadow-warm relative">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="recipe-transcript" 
              className="text-sm font-semibold text-cookbook-textDark flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-cookbook-primary"></span>
              Paste or type a family recipe / voice transcript here...
            </label>
            {transcript && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              id="recipe-transcript"
              rows={8}
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                setActiveExampleIndex(null);
              }}
              placeholder="Take two cups of rice, wash it and soak it for 20 minutes... Add some salt, simmer on low flame till soft."
              className="w-full rounded-xl border border-cookbook-border p-4 text-cookbook-textDark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-base leading-relaxed resize-y bg-cookbook-card shadow-inner transition-all"
              required
            />
            <div className="absolute right-3 bottom-3 text-xs text-stone-400 pointer-events-none">
              {transcript.trim() ? `${transcript.trim().split(/\s+/).length} words` : ''}
            </div>
          </div>

          {/* Quick Example Selector */}
          <div className="pt-1">
            <p className="text-xs font-medium text-stone-500 mb-2 flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5 text-amber-700" />
              <span>Or try an authentic family transcript:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {EXAMPLES.map((ex, idx) => (
                <button
                  key={ex.title}
                  type="button"
                  onClick={() => handleSelectExample(ex, idx)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    activeExampleIndex === idx
                      ? 'border-cookbook-primary bg-amber-50 text-cookbook-primary font-medium shadow-sm'
                      : 'border-cookbook-border bg-cookbook-card/70 hover:bg-cookbook-card hover:border-cookbook-borderHover text-cookbook-textDark'
                  }`}
                >
                  <div className="font-semibold truncate">{ex.title}</div>
                  <div className="text-[11px] text-stone-500 truncate mt-0.5">{ex.tagline}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !transcript.trim()}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cookbook-primary to-amber-700 hover:from-orange-800 hover:to-amber-800 text-white font-medium text-base sm:text-lg shadow-warm transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-warm-lg active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Dadi's AI is structuring your recipe...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>Create Recipe</span>
                  <ArrowRight className="w-5 h-5 text-amber-200" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Small Trust Note */}
        <div className="mt-4 pt-3 border-t border-cookbook-border/60 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Strict prompt: Never invents ingredients or quantities.</span>
          </span>
          <span className="hidden sm:inline text-stone-400">
            Open-Weight Meta Llama 3.1 8B
          </span>
        </div>
      </div>
    </div>
  );
};
