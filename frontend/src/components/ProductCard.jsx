import React from 'react';
import { Star, Leaf, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { brand, name, price, rating, main_ingredient, cruelty_free, target_audience, skin_types } = product;

  // Active skin type labels
  const activeSkinTypes = Object.entries(skin_types || {})
    .filter(([_, active]) => active)
    .map(([type]) => {
      const translations = {
        dry: 'Kuru',
        oily: 'Yağlı',
        sensitive: 'Hassas',
        combination: 'Karma',
        normal: 'Normal'
      };
      return translations[type] || type;
    });

  // Unique abstract luxury background gradients based on brand name for premium visual wow factor!
  const getGradient = (brandName) => {
    const hashes = brandName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const options = [
      'from-rose-100 to-amber-50',
      'from-teal-100 to-stone-100',
      'from-orange-100 to-yellow-50',
      'from-slate-100 to-indigo-50',
      'from-emerald-50 to-stone-100',
      'from-pink-100 to-rose-50'
    ];
    return options[hashes % options.length];
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-luxury-200/40 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-luxury-300 hover:shadow-xl hover:shadow-luxury-900/5 animate-fade-in">
      
      {/* Product Image Holder */}
      <div className={`relative aspect-square w-full rounded-2xl bg-gradient-to-tr ${getGradient(brand)} flex items-center justify-center p-6 mb-4 overflow-hidden`}>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Luxury minimalist abstract bottle icon */}
        <div className="relative h-24 w-12 border-2 border-luxury-950/20 rounded-xl flex flex-col justify-between p-1 bg-white/30 backdrop-blur-sm group-hover:scale-105 group-hover:border-luxury-950/40 transition-all duration-500 shadow-sm">
          <div className="h-4 w-6 bg-luxury-900/10 rounded-md mx-auto border border-luxury-950/10"></div>
          <div className="flex-grow flex items-center justify-center">
            <span className="font-playfair text-[9px] font-bold text-luxury-900/50 uppercase tracking-widest">{brand.substring(0, 3)}</span>
          </div>
          <div className="h-1 w-full bg-luxury-900/20 rounded-full"></div>
        </div>

        {/* Cruelty-free badge on image */}
        {cruelty_free && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md border border-luxury-200/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-800 shadow-sm">
            <Leaf className="h-3 w-3 text-emerald-600" />
            <span>Cruelty Free</span>
          </span>
        )}

        {/* Target Audience badge */}
        <span className="absolute bottom-3 right-3 rounded-full bg-luxury-950/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-luxury-50 shadow-sm">
          {target_audience}
        </span>
      </div>

      {/* Brand & Name */}
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark">{brand}</span>
        <div className="flex items-center gap-0.5">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="text-xs font-bold text-luxury-950">{rating}</span>
        </div>
      </div>
      
      <h3 className="font-playfair text-sm font-bold text-luxury-950 group-hover:text-luxury-800 line-clamp-1 mb-2.5 transition-colors duration-200">
        {name.split(" - ")[0]}
      </h3>

      {/* Main Ingredient Chip */}
      <div className="mb-3.5 flex flex-wrap gap-1">
        <span className="rounded-full bg-luxury-100 border border-luxury-200/50 px-3 py-1 text-[10px] font-semibold text-luxury-700 tracking-wide">
          Bileşen: <strong className="text-luxury-900">{main_ingredient}</strong>
        </span>
      </div>

      {/* Skin Type tags */}
      <div className="mb-4 flex flex-wrap gap-1 border-t border-luxury-100 pt-3">
        {activeSkinTypes.map((type, idx) => (
          <span key={idx} className="rounded-md bg-stone-50 border border-stone-200/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-stone-500">
            {type}
          </span>
        ))}
      </div>

      {/* Price and Action */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-400">Fiyat</span>
          <span className="font-playfair text-base font-extrabold text-luxury-950">${price}</span>
        </div>
        <button className="rounded-xl bg-luxury-100 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-luxury-950 border border-luxury-200/50 transition-all duration-200 hover:bg-luxury-950 hover:text-luxury-50 hover:border-luxury-950">
          İncele
        </button>
      </div>

    </div>
  );
}
