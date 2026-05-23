import React from 'react';
import { Sparkles, BarChart3, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-luxury-200/50 bg-luxury-50/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <span className="font-playfair text-xl md:text-2xl font-bold tracking-widest text-luxury-950">
            AESTHETIQUE<span className="text-gold">.</span>
          </span>
          <span className="hidden sm:inline-block rounded-full bg-luxury-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-luxury-600 border border-luxury-200/30">
            Intelligence
          </span>
        </div>

        {/* Concept Switchers */}
        <nav className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`group relative flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'assistant'
                ? 'bg-luxury-950 text-luxury-50 shadow-lg shadow-luxury-950/15'
                : 'bg-transparent text-luxury-600 hover:bg-luxury-100 hover:text-luxury-950'
            }`}
          >
            <Sparkles className={`h-4.5 w-4.5 transition-transform duration-500 group-hover:rotate-12 ${
              activeTab === 'assistant' ? 'text-gold-light' : 'text-luxury-500'
            }`} />
            <span>Güzellik Asistanı</span>
            {activeTab === 'assistant' && (
              <span className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-gold"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`group relative flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-luxury-950 text-luxury-50 shadow-lg shadow-luxury-950/15'
                : 'bg-transparent text-luxury-600 hover:bg-luxury-100 hover:text-luxury-950'
            }`}
          >
            <BarChart3 className={`h-4.5 w-4.5 ${
              activeTab === 'dashboard' ? 'text-gold-light' : 'text-luxury-500'
            }`} />
            <span>Yönetici Paneli</span>
            {activeTab === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-gold"></span>
            )}
          </button>
        </nav>

        {/* Right Info */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs text-luxury-500 font-semibold">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
          <span className="tracking-wide">AI Recommendation Engine Online</span>
        </div>

      </div>
    </header>
  );
}
