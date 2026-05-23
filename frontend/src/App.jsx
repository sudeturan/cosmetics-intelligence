import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Assistant from './pages/Assistant';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <div className="min-h-screen bg-luxury-50 text-luxury-950 font-sans antialiased selection:bg-gold/30 selection:text-luxury-950 flex flex-col justify-between">
      
      <div>
        {/* Navigation Header */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Dynamic Concept Router Page */}
        <main className="transition-all duration-300">
          {activeTab === 'assistant' ? <Assistant /> : <Dashboard />}
        </main>
      </div>

      {/* Luxury Footer */}
      <footer className="mt-20 border-t border-luxury-200/40 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="font-playfair text-sm font-bold tracking-widest text-luxury-950">
              AESTHETIQUE<span className="text-gold">.</span>
            </span>
            <span className="text-[10px] text-luxury-400 font-semibold uppercase tracking-wider block sm:inline sm:ml-2">
              © {new Date().getFullYear()} Cosmetics Intelligence Platform
            </span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-luxury-500">
            <a href="#" className="hover:text-luxury-950 transition-colors">Kullanım Koşulları</a>
            <a href="#" className="hover:text-luxury-950 transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-luxury-950 transition-colors">B2B API Destek</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
