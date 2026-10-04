import React from 'react';
import { Sparkles, Cpu, Layers, ShieldCheck, ArrowRight, HeartHandshake } from 'lucide-react';

interface OpenSourceInfoProps {
  onBackToApp: () => void;
}

export const OpenSourceInfo: React.FC<OpenSourceInfoProps> = ({ onBackToApp }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cookbook-primary" />
          <span>Hacktoberfest 2026 Showcase</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-cookbook-textDark">
          Why Open-Source AI?
        </h2>
        <p className="text-stone-600 max-w-xl mx-auto text-base">
          How open-weight models safeguard family culinary heritage without vendor lock-in.
        </p>
      </div>

      {/* Main explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-cookbook-surface border border-cookbook-border rounded-2xl p-6 shadow-warm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-cookbook-primary flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-serif text-cookbook-textDark">
            Genuinely Open-Weight Model
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            The core recipe extraction is powered by <strong>Meta Llama 3.1 8B Instruct</strong>, a state-of-the-art open-weight large language model. Its weights, tokenizer, and architectural specifications are openly accessible.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-cookbook-surface border border-cookbook-border rounded-2xl p-6 shadow-warm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-serif text-cookbook-textDark">
            Interchangeable Without Redesign
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Because our FastAPI backend adheres to standard structured JSON generation, <strong>the underlying open-source model can be swapped seamlessly</strong> (e.g., to Mistral 7B, Qwen 2.5, or Gemma 2) without changing the frontend or database schemas.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-cookbook-surface border border-cookbook-border rounded-2xl p-6 shadow-warm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-serif text-cookbook-textDark">
            Data Sovereignty & Privacy
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Grandmother's handwritten notes and voice recordings are intimate cultural artifacts. Open-weight models can be hosted locally with Ollama or vLLM, ensuring your family's recipes are never used to train proprietary third-party commercial bots.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-cookbook-surface border border-cookbook-border rounded-2xl p-6 shadow-warm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold font-serif text-cookbook-textDark">
            Strict Culinary Grounding
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Our prompt enforces a zero-hallucination constraint: the model is strictly forbidden from inventing quantities or ingredients. Missing measurements are preserved as <em>"Not specified"</em> to retain authenticity.
          </p>
        </div>
      </div>

      {/* Architecture Overview */}
      <div className="bg-cookbook-card border border-cookbook-border rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold font-serif text-cookbook-textDark">
          Open-Source Architecture Pipeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-cookbook-surface p-3 rounded-xl border border-cookbook-border">
            <div className="font-semibold text-stone-800">1. Raw Transcript</div>
            <div className="text-stone-500 mt-1">Audio voice dictation or typed notes</div>
          </div>
          <div className="bg-cookbook-surface p-3 rounded-xl border border-cookbook-border">
            <div className="font-semibold text-stone-800">2. FastAPI Backend</div>
            <div className="text-stone-500 mt-1">Python async pipeline & JSON schema</div>
          </div>
          <div className="bg-cookbook-surface p-3 rounded-xl border border-cookbook-border">
            <div className="font-semibold text-stone-800">3. Llama 3.1 8B</div>
            <div className="text-stone-500 mt-1">Open-weight reasoning engine</div>
          </div>
          <div className="bg-cookbook-surface p-3 rounded-xl border border-cookbook-border">
            <div className="font-semibold text-stone-800">4. Vault Card & SQLite</div>
            <div className="text-stone-500 mt-1">Interactive checklist & persistent storage</div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="text-center pt-2">
        <button
          onClick={onBackToApp}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cookbook-primary text-white font-medium hover:bg-orange-800 transition-colors shadow-sm"
        >
          <span>Try Structuring a Recipe Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
