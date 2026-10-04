import React from 'react';
import { BookOpen, Sparkles, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import type { HealthStatus } from '../types';

interface HeaderProps {
  currentTab: 'create' | 'saved' | 'about';
  setCurrentTab: (tab: 'create' | 'saved' | 'about') => void;
  savedCount: number;
  health: HealthStatus | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  savedCount,
  health,
}) => {
  return (
    <header className="border-b border-cookbook-border bg-cookbook-surface/90 backdrop-blur-sm sticky top-0 z-30 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab('create')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
            👵🍲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-cookbook-textDark tracking-tight group-hover:text-cookbook-primary transition-colors">
                Dadi's Recipe Vault
              </h1>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Open AI
              </span>
            </div>
            <p className="text-xs text-cookbook-textMuted flex items-center gap-1">
              <Heart className="w-3 h-3 text-cookbook-primary fill-cookbook-primary" />
              Turn family recipes into something you can keep forever.
            </p>
          </div>
        </div>

        {/* Navigation & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center bg-cookbook-bg p-1 rounded-xl border border-cookbook-border text-sm">
            <button
              onClick={() => setCurrentTab('create')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'create'
                  ? 'bg-cookbook-surface text-cookbook-primary shadow-sm font-semibold'
                  : 'text-cookbook-textMuted hover:text-cookbook-textDark'
              }`}
            >
              Create Recipe
            </button>
            <button
              onClick={() => setCurrentTab('saved')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'saved'
                  ? 'bg-cookbook-surface text-cookbook-primary shadow-sm font-semibold'
                  : 'text-cookbook-textMuted hover:text-cookbook-textDark'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Saved Vault</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 bg-cookbook-primary text-white text-[11px] font-bold rounded-full">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab('about')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                currentTab === 'about'
                  ? 'bg-cookbook-surface text-amber-800 shadow-sm font-semibold'
                  : 'text-cookbook-textMuted hover:text-cookbook-textDark'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Why Open AI?</span>
            </button>
          </nav>

          {/* Backend Connection Indicator */}
          <div 
            title={health ? `Backend Connected: ${health.ai_model}` : "Checking backend connection..."}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-cookbook-bg border border-cookbook-border text-cookbook-textMuted"
          >
            {health ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="text-[11px] font-medium text-stone-600">Online</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-amber-600 animate-pulse" />
                <span className="text-[11px] text-stone-500">Connecting</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
