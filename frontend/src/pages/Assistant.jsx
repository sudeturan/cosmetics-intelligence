import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import RecommendationCarousel from '../components/RecommendationCarousel';
import { apiService } from '../services/api';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function Assistant() {
  const [filters, setFilters] = useState({
    skin_type: '',
    target_audience: 'Hepsi',
    cruelty_free: false,
    max_price: 250,
    query: ''
  });

  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Reset filters helper
  const resetFilters = () => {
    setFilters({
      skin_type: '',
      target_audience: 'Hepsi',
      cruelty_free: false,
      max_price: 250,
      query: ''
    });
    setPage(1);
  };

  // Fetch recommendations (AI Carousel)
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const queryParams = {
          ...filters,
          target_audience: filters.target_audience === 'Hepsi' ? '' : filters.target_audience
        };
        const data = await apiService.getRecommendations(queryParams);
        setRecommendations(data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [filters]);

  // Fetch products (Grid)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = {
          ...filters,
          target_audience: filters.target_audience === 'Hepsi' ? '' : filters.target_audience,
          skip: (page - 1) * itemsPerPage,
          limit: itemsPerPage
        };
        const data = await apiService.getProducts(queryParams);
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const hasMore = totalProducts > page * itemsPerPage;

  return (
    <div className="mx-auto max-w-7xl px-6 sm:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-black text-luxury-950 tracking-tight leading-tight">
          Akıllı Cilt Bakım Asistanı<span className="text-gold">.</span>
        </h1>
        <p className="mt-3 text-sm md:text-base font-semibold text-luxury-500 max-w-3xl leading-relaxed uppercase tracking-wider">
          Cilt tipinize, hassasiyetinize ve bütçenize göre en ideal dermokozmetik ürünlerini keşfedin. Yapay zeka motorumuz içerikleri sizin yerinize incelesin.
        </p>
      </div>

      {/* AI Recommendation Carousel Area */}
      {loadingRecommendations ? (
        <div className="w-full bg-luxury-100/50 border border-luxury-200/50 rounded-3xl p-8 mb-10 flex items-center justify-center h-48 animate-pulse">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-luxury-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-luxury-500">Yapay Zeka Önerileri Hazırlanıyor...</span>
          </div>
        </div>
      ) : (
        <RecommendationCarousel recommendations={recommendations} />
      )}

      {/* Layout Content (Sidebar + Products Grid) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Filters */}
        <Sidebar 
          filters={filters} 
          setFilters={setFilters} 
          resetFilters={resetFilters} 
        />

        {/* Product Grid & List Area */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-luxury-100">
            <span className="text-xs font-bold uppercase tracking-wider text-luxury-500">
              Toplam <strong className="text-luxury-950">{totalProducts}</strong> Ürün Listeleniyor
            </span>
            {filters.skin_type && (
              <span className="rounded-full bg-gold/10 border border-gold/30 px-3 py-1 text-[10px] font-bold text-gold-dark uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>{filters.skin_type.toUpperCase()} CİLT ODAKLI</span>
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="h-96 rounded-3xl border border-luxury-200 bg-white p-5 flex flex-col gap-4 animate-pulse">
                  <div className="aspect-square bg-luxury-100 rounded-2xl w-full"></div>
                  <div className="h-4 bg-luxury-100 rounded w-1/3"></div>
                  <div className="h-6 bg-luxury-100 rounded w-3/4"></div>
                  <div className="h-10 bg-luxury-100 rounded w-full mt-auto"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-luxury-50 rounded-3xl border border-dashed border-luxury-200">
              <div className="rounded-full bg-white p-4 border border-luxury-100 mb-4 shadow-sm">
                <AlertCircle className="h-8 w-8 text-luxury-400" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-luxury-950 mb-2">Eşleşen Ürün Bulunamadı</h3>
              <p className="text-xs font-semibold text-luxury-500 uppercase tracking-widest max-w-sm mb-6">
                Seçtiğiniz filtre kombinasyonuna veya arama terimine uygun ürün listelenemedi. Farklı kriterler deneyebilirsiniz.
              </p>
              <button
                onClick={resetFilters}
                className="rounded-full bg-luxury-950 px-6 py-3 text-xs font-bold uppercase tracking-widest text-luxury-50 shadow-md hover:bg-luxury-800 transition-colors"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          ) : (
            <>
              {/* Grid of Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    className="rounded-full border border-luxury-950 bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-luxury-950 hover:bg-luxury-950 hover:text-white transition-all duration-300 shadow-sm"
                  >
                    Daha Fazla Ürün Göster
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
}
