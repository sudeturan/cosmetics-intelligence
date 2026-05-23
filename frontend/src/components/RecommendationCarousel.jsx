import React from 'react';
import { Sparkles, Star, Award, ShieldCheck, Heart } from 'lucide-react';

export default function RecommendationCarousel({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  // Convert match score to a neat percentage for display (e.g. 2.85 -> 95%)
  const getMatchPercent = (score) => {
    // Scores usually sit between 1.5 and 8.0 depending on TF-IDF + ratings
    // Let's map it: a score above 5 is 99%, below 2 is 85-89%, etc.
    const percent = Math.min(99, Math.max(82, Math.round(score * 12 + 50)));
    return percent;
  };

  return (
    <div className="w-full bg-gradient-to-r from-luxury-100 to-luxury-50 border border-luxury-200/50 rounded-3xl p-6 md:p-8 shadow-sm mb-10 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="rounded-full bg-luxury-950 p-2 text-white">
            <Sparkles className="h-5 w-5 text-gold-light animate-pulse-subtle" />
          </div>
          <div>
            <h2 className="font-playfair text-lg md:text-xl font-black tracking-wide text-luxury-950">Sizin İçin En İyiler</h2>
            <p className="text-[11px] font-bold text-luxury-500 uppercase tracking-widest">Yapay Zeka ve Filtre Uyumlu En Yüksek Puanlı Eşleşmeler</p>
          </div>
        </div>
        <span className="hidden md:flex items-center gap-1.5 rounded-full bg-white border border-luxury-200 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-luxury-800 shadow-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Kişiselleştirilmiş Öneriler</span>
        </span>
      </div>

      {/* Recommender Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((item, idx) => {
          const matchPercent = getMatchPercent(item.match_score);
          
          return (
            <div 
              key={item.id} 
              className="relative flex flex-col md:flex-row gap-5 rounded-2xl border border-luxury-300 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-luxury-400"
            >
              {/* Match Score Badge */}
              <div className="absolute -top-3 -right-3 z-10 flex items-center gap-1 rounded-full bg-luxury-950 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gold-light shadow-md shadow-luxury-950/20 border border-gold/30">
                <Award className="h-3.5 w-3.5 text-gold" />
                <span>%{matchPercent} UYUM</span>
              </div>

              {/* Product Info Left/Top */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gold-dark">{item.brand}</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-gold text-gold" />
                      <span className="text-[11px] font-extrabold text-luxury-950">{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-playfair text-sm font-extrabold text-luxury-950 leading-tight mb-2">
                    {item.name.split(" - ")[0]}
                  </h3>
                  
                  <div className="space-y-1.5 mb-4">
                    <p className="text-[10px] text-luxury-500 font-semibold leading-relaxed line-clamp-2">
                      <strong className="text-luxury-800 font-bold uppercase text-[9px] tracking-wider block mb-0.5">Ana Aktif:</strong>
                      {item.main_ingredient}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-luxury-100 pt-3">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-luxury-400">Özel Fiyat</span>
                    <span className="font-playfair text-sm font-extrabold text-luxury-950">${item.price}</span>
                  </div>
                  <span className="rounded-lg bg-luxury-50 border border-luxury-200/50 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-luxury-600">
                    {item.country}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
