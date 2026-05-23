import React from 'react';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

export default function Sidebar({ filters, setFilters, resetFilters }) {
  
  const skinTypes = [
    { id: 'dry', label: 'Kuru Cilt' },
    { id: 'oily', label: 'Yağlı Cilt' },
    { id: 'sensitive', label: 'Hassas Cilt' },
    { id: 'combination', label: 'Karma Cilt' },
    { id: 'normal', label: 'Normal Cilt' }
  ];

  const targetAudiences = [
    { id: 'Hepsi', label: 'Tümü' },
    { id: 'Kadın', label: 'Kadın' },
    { id: 'Erkek', label: 'Erkek' },
    { id: 'Unisex', label: 'Unisex' }
  ];

  const handleSkinTypeChange = (id) => {
    setFilters(prev => ({
      ...prev,
      skin_type: prev.skin_type === id ? '' : id
    }));
  };

  const handleAudienceChange = (id) => {
    setFilters(prev => ({
      ...prev,
      target_audience: id
    }));
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-luxury-50 border border-luxury-200/50 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-luxury-200/50 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-luxury-950" />
          <h2 className="font-playfair text-lg font-bold text-luxury-950 tracking-wide">Filtreler</h2>
        </div>
        <button
          onClick={resetFilters}
          className="group flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-luxury-500 hover:text-luxury-950 transition-colors duration-200"
        >
          <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45" />
          <span>Sıfırla</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Search Query */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-700">Ürün veya Bileşen Ara</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Örn: Retinol, CeraVe..."
              value={filters.query || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="w-full rounded-xl border border-luxury-200 bg-white pl-10 pr-4 py-3 text-sm text-luxury-950 placeholder-luxury-400 focus:border-luxury-950 focus:outline-none focus:ring-1 focus:ring-luxury-950 transition-all duration-200"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-luxury-400" />
          </div>
        </div>

        {/* Skin Type */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-700 block">Cilt Tipi</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {skinTypes.map(st => (
              <button
                key={st.id}
                onClick={() => handleSkinTypeChange(st.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 ${
                  filters.skin_type === st.id
                    ? 'border-luxury-950 bg-luxury-950 text-luxury-50 shadow-md shadow-luxury-950/5'
                    : 'border-luxury-200 bg-white text-luxury-600 hover:border-luxury-400 hover:bg-luxury-100/50'
                }`}
              >
                <span>{st.label}</span>
                {filters.skin_type === st.id && (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-700 block">Hedef Kitle</label>
          <div className="grid grid-cols-4 gap-1.5 bg-luxury-100 p-1 rounded-xl">
            {targetAudiences.map(ta => (
              <button
                key={ta.id}
                onClick={() => handleAudienceChange(ta.id)}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  (filters.target_audience === ta.id || (!filters.target_audience && ta.id === 'Hepsi'))
                    ? 'bg-white text-luxury-950 shadow-sm'
                    : 'text-luxury-500 hover:text-luxury-950'
                }`}
              >
                {ta.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget (Price Range Slider) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-700">Maksimum Bütçe</label>
            <span className="font-playfair text-sm font-bold text-luxury-950">${filters.max_price || 250}</span>
          </div>
          <input
            type="range"
            min="5"
            max="250"
            step="5"
            value={filters.max_price || 250}
            onChange={(e) => setFilters(prev => ({ ...prev, max_price: parseInt(e.target.value) }))}
            className="w-full accent-luxury-950 cursor-pointer h-1 bg-luxury-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-luxury-400">
            <span>$5</span>
            <span>$125</span>
            <span>$250+</span>
          </div>
        </div>

        {/* Cruelty-Free Toggle */}
        <div className="flex items-center justify-between border-t border-luxury-200/50 pt-5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-luxury-900 tracking-wide">Cruelty-Free Ürünler</span>
            <span className="text-[10px] text-luxury-400 font-medium">Hayvanlar üzerinde test edilmemiş</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.cruelty_free || false}
              onChange={(e) => setFilters(prev => ({ ...prev, cruelty_free: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-luxury-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-luxury-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-950"></div>
          </label>
        </div>
      </div>
    </aside>
  );
}
