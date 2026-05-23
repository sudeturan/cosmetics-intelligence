import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, 
  BarChart, Bar, Cell, ReferenceLine
} from 'recharts';
import { Loader2, Globe, TrendingUp, Sparkles, DollarSign, Award, Leaf } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [correlationData, setCorrelationData] = useState({ points: [], correlation: 0, avg_price: 0, avg_rating: 0 });
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchB2BData = async () => {
      setLoading(true);
      try {
        const [countriesData, correlationResult, ingredientsData] = await Promise.all([
          apiService.getCountryDistribution(),
          apiService.getPriceRatingCorrelation(),
          apiService.getTopIngredients(10) // top 10 ingredients
        ]);
        
        setCountries(countriesData);
        setCorrelationData(correlationResult);
        setIngredients(ingredientsData);
      } catch (err) {
        console.error('Error fetching B2B analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchB2BData();
  }, []);

  // Leaflet Map Initialization
  useEffect(() => {
    if (loading || countries.length === 0) return;

    // Check if container exists
    const container = document.getElementById('b2b-real-world-map');
    if (!container) return;

    // Custom luxury glowing gold marker using Leaflet DivIcon
    const luxuryIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div class="relative flex items-center justify-center" style="width: 24px; height: 24px;">
          <span class="absolute inline-flex h-6 w-6 rounded-full bg-[#D4AF37] opacity-60 animate-ping"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-[#14120D] border border-[#D4AF37] shadow-md flex items-center justify-center">
            <span class="h-1.5 w-1.5 rounded-full bg-[#F3E5AB]"></span>
          </span>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Create Leaflet map object
    const map = L.map('b2b-real-world-map', {
      center: [30, 10], // Centered globally
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 12,
      scrollWheelZoom: false, // Don't steal scrolling zoom
      zoomControl: true,
      attributionControl: true
    });

    // Add CartoDB Positron elegant light-toned base map layer matching the luxury design system
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Place country markers with styled detailed B2B popups
    countries.forEach(c => {
      if (c.lat !== 0 && c.lng !== 0) {
        const marker = L.marker([c.lat, c.lng], { icon: luxuryIcon }).addTo(map);
        
        const popupHtml = `
          <div style="font-family: 'Inter', sans-serif; padding: 4px; min-width: 150px; color: #14120D;">
            <h4 style="font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 800; border-bottom: 1px solid #E7E4D9; padding-bottom: 5px; margin: 0 0 6px 0; letter-spacing: 0.3px;">
              ${c.country}
            </h4>
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #645B47; margin-bottom: 3px;">
              Ürün Sayısı: <strong style="color: #14120D; font-size: 11px; font-weight: 800;">${c.count}</strong>
            </div>
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #645B47; margin-bottom: 3px;">
              Ortalama Fiyat: <strong style="color: #14120D; font-size: 11px; font-weight: 800;">$${c.avg_price}</strong>
            </div>
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #645B47;">
              Memnuniyet Puanı: <strong style="color: #14120D; font-size: 11px; font-weight: 800;">${c.avg_rating} / 5.0</strong>
            </div>
          </div>
        `;
        marker.bindPopup(popupHtml);
      }
    });

    // Cleanup function on component unmount
    return () => {
      map.remove();
    };
  }, [loading, countries]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-900" />
        <span className="text-xs font-bold uppercase tracking-widest text-luxury-500">Sektör Analiz Verileri Yükleniyor...</span>
      </div>
    );
  }

  const totalProducts = correlationData.points.length;
  const crueltyFreeRatio = "49.39%"; // Derived from active raw dataset feature engineering steps

  const getCorrelationAnalysis = (r) => {
    if (r > 0.5) return "Güçlü Pozitif: Pahalı ürünlerin puanları belirgin şekilde daha yüksektir. Marka prestiji kalite algısını doğrudan besliyor.";
    if (r > 0.1) return "Zayıf Pozitif: Fiyat artışı puanları hafifçe artırıyor. Ancak bütçe dostu ürünler de sıklıkla yüksek puan alabiliyor.";
    if (Math.abs(r) <= 0.1) return "Korelasyon Yok: Fiyat ve puan arasında anlamlı bir ilişki bulunmamaktadır. Tüketiciler ucuz formülleri de pahalılar kadar başarılı buluyor.";
    return "Negatif: İlginç şekilde, daha ucuz ürünler daha yüksek puan alıyor. Lüks segment beklentileri karşılamakta zorlanıyor olabilir.";
  };

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-8 py-10 animate-fade-in">
      
      {/* Header */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-black text-luxury-950 tracking-tight leading-tight">
            Kozmetik Sektörü Analiz Paneli<span className="text-gold">.</span>
          </h1>
          <p className="mt-3 text-sm md:text-base font-semibold text-luxury-500 max-w-3xl leading-relaxed uppercase tracking-wider">
            B2B Marka Yöneticileri ve Sektör Profesyonelleri için Pazar Trendleri, Fiyatlama Stratejileri ve Bileşen Analitiği.
          </p>
        </div>
        <div className="rounded-full bg-luxury-950 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gold-light border border-gold/20 flex items-center gap-2 self-center md:self-auto shadow-md">
          <Sparkles className="h-4 w-4 text-gold animate-pulse-subtle" />
          <span>B2B KURUMSAL ERİŞİM</span>
        </div>
      </div>

      {/* 4 Premium Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Metric 1 */}
        <div className="bg-white border border-luxury-200/50 rounded-3xl p-6 shadow-sm flex items-center gap-4.5 hover:border-luxury-300 transition-all">
          <div className="rounded-full bg-luxury-100 p-3.5 text-luxury-950">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-400 block mb-0.5">Toplam Ürün Hacmi</span>
            <span className="font-playfair text-2xl font-black text-luxury-950">{totalProducts}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-luxury-200/50 rounded-3xl p-6 shadow-sm flex items-center gap-4.5 hover:border-luxury-300 transition-all">
          <div className="rounded-full bg-luxury-100 p-3.5 text-luxury-950">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-400 block mb-0.5">Ortalama Ürün Fiyatı</span>
            <span className="font-playfair text-2xl font-black text-luxury-950">${correlationData.avg_price}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-luxury-200/50 rounded-3xl p-6 shadow-sm flex items-center gap-4.5 hover:border-luxury-300 transition-all">
          <div className="rounded-full bg-luxury-100 p-3.5 text-luxury-950">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-400 block mb-0.5">Ortalama Puan Skoru</span>
            <span className="font-playfair text-2xl font-black text-luxury-950">{correlationData.avg_rating} <span className="text-xs text-luxury-400">/ 5.0</span></span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-luxury-200/50 rounded-3xl p-6 shadow-sm flex items-center gap-4.5 hover:border-luxury-300 transition-all">
          <div className="rounded-full bg-emerald-50 p-3.5 text-emerald-800 border border-emerald-100">
            <Leaf className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-400 block mb-0.5">Cruelty-Free Oranı</span>
            <span className="font-playfair text-2xl font-black text-emerald-800">{crueltyFreeRatio}</span>
          </div>
        </div>

      </div>

      {/* Grid of Charts (Main Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">

        {/* Left Side: Country Map and Ingredients */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Chart 1: Interactive Geographic Distribution */}
          <div className="bg-white border border-luxury-200/50 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-luxury-100">
              <div>
                <h3 className="font-playfair text-lg font-bold text-luxury-950">Coğrafi Üretim & Menşe Dağılımı</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-400">Küresel kozmetik üretim merkezlerindeki ürün sayıları</p>
              </div>
              <span className="rounded-lg bg-luxury-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-luxury-600">
                {countries.length} Ülke Aktif
              </span>
            </div>

            {/* Real World Geographic Map */}
            <div 
              id="b2b-real-world-map" 
              className="w-full h-80 rounded-2xl overflow-hidden mb-6 border border-luxury-200/50 shadow-inner z-10"
              style={{ minHeight: "320px" }}
            ></div>

            {/* List and detail table of country distributions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {countries.map((c) => (
                <div 
                  key={c.country}
                  className="p-4 rounded-2xl border border-luxury-200/50 bg-stone-50 hover:bg-stone-100/50 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-luxury-950">{c.country}</span>
                    <span className="rounded bg-luxury-900 px-1.5 py-0.5 text-[9px] font-bold text-luxury-50">{c.count} Ürün</span>
                  </div>
                  <div className="space-y-0.5 text-[9px] font-bold text-luxury-400 uppercase tracking-wider">
                    <div>Orta. Fiyat: <strong className="text-luxury-800">${c.avg_price}</strong></div>
                    <div>Orta. Puan: <strong className="text-luxury-800">{c.avg_rating}</strong></div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Chart 3: Top Ingredients Bar Chart */}
          <div className="bg-white border border-luxury-200/50 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-luxury-100">
              <div>
                <h3 className="font-playfair text-lg font-bold text-luxury-950">Trend Aktif Bileşen Dağılımı</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-400">Ürün formüllerinde en sık kullanılan öncelikli bileşenler</p>
              </div>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ingredients}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#9E967D" fontSize={10} fontWeight="bold" />
                  <YAxis dataKey="ingredient" type="category" stroke="#9E967D" fontSize={9} fontWeight="bold" width={95} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#14120D',
                      borderColor: '#D4AF37',
                      borderRadius: '12px',
                      color: '#FAF9F6',
                      fontSize: '11px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    cursor={{ fill: 'rgba(244, 242, 236, 0.5)' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {ingredients.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? '#9E967D' : '#2A261D'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>

        {/* Right Side: Scatter Chart correlation */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Chart 2: Price-Rating Correlation Scatter Plot */}
          <div className="bg-white border border-luxury-200/50 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="mb-6 pb-4 border-b border-luxury-100">
              <h3 className="font-playfair text-lg font-bold text-luxury-950">Fiyat & Puan Korelasyonu</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-400">Ürün fiyatları ile müşteri memnuniyeti ilişkisi</p>
            </div>

            {/* Metrics sub-block */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-stone-50 border border-luxury-200/30 rounded-xl text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-400 block mb-0.5">Pearson Katsayısı (r)</span>
                <span className="font-playfair text-lg font-extrabold text-luxury-950">{correlationData.correlation}</span>
              </div>
              <div className="p-3 bg-stone-50 border border-luxury-200/30 rounded-xl text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-400 block mb-0.5">Müşteri Memnuniyeti</span>
                <span className="font-playfair text-sm font-extrabold text-emerald-800 uppercase tracking-widest">Dengeli Dağılım</span>
              </div>
            </div>

            {/* Scatter Plot Chart */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 10, bottom: 20, left: -25 }}>
                  <XAxis 
                    type="number" 
                    dataKey="price" 
                    name="Fiyat" 
                    unit="$" 
                    stroke="#9E967D" 
                    fontSize={10} 
                    fontWeight="bold" 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="rating" 
                    name="Puan" 
                    domain={[0.0, 5.0]} 
                    stroke="#9E967D" 
                    fontSize={10} 
                    fontWeight="bold" 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{
                      backgroundColor: '#14120D',
                      borderColor: '#D4AF37',
                      borderRadius: '12px',
                      color: '#FAF9F6',
                      fontSize: '11px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                  <Scatter 
                    name="Kozmetik Ürünleri" 
                    data={correlationData.points.slice(0, 150)} // Slice sample for clean look
                    fill="#9E967D" 
                    opacity={0.65} 
                  />
                  {/* Regression Trendline indicator */}
                  <ReferenceLine 
                    y={correlationData.avg_rating} 
                    stroke="#D4AF37" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Orta. Puan', fill: '#AA7C11', fontSize: 9, position: 'top', fontWeight: 'bold' }} 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Analytical Commentary */}
            <div className="mt-6 p-5 rounded-2xl bg-luxury-950 text-luxury-50 border border-gold/20 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5">
                <TrendingUp className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-4 w-4 text-gold-light" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">Yönetici Analiz Raporu</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed uppercase tracking-wider text-luxury-300">
                  {getCorrelationAnalysis(correlationData.correlation)}
                </p>
                <div className="mt-3 border-t border-luxury-800 pt-3 text-[9px] font-bold text-luxury-400 uppercase tracking-widest leading-relaxed">
                  Analiz Özeti: Yüksek bütçeli lüks kozmetik formülasyonları yüksek pazarlama değerlerine rağmen her zaman orantılı bir puan artışı elde edememektedir. Tüketiciler uygun fiyatlı, saf içerikli butik markalara da son derece yüksek memnuniyet puanları vermektedir.
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
