import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BreakingNews } from '../components/BreakingNews';
import { HeroSlider } from '../components/HeroSlider';
import { NewsGrid } from '../components/NewsGrid';
import { SEO } from '../components/SEO';
import { NewsArticle } from '../types';
import { Loader2, TrendingUp, Calendar } from 'lucide-react';

export function Home() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featured, setFeatured] = useState<NewsArticle[]>([]);
  const [trending, setTrending] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [newsRes, featuredRes, trendingRes] = await Promise.all([
          fetch(`/api/news?limit=12${category ? `&category=${category}` : ''}`),
          fetch('/api/news?featured=true&limit=5'),
          fetch('/api/news?trending=true&limit=10')
        ]);

        const [news, feat, trend] = await Promise.all([
          newsRes.json(),
          featuredRes.json(),
          trendingRes.json()
        ]);

        setArticles(Array.isArray(news) ? news : []);
        setFeatured(Array.isArray(feat) ? feat : []);
        setTrending(Array.isArray(trend) ? trend : []);
      } catch (err) {
        console.error(err);
        setArticles([]);
        setFeatured([]);
        setTrending([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a]">
      <SEO />
      <BreakingNews articles={trending} />
      
      {!category && <HeroSlider articles={featured} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            <NewsGrid 
              articles={articles} 
              title={category ? `Kategori: ${category}` : "Berita Utama"} 
              subtitle={category ? "Menampilkan arsip berita pilihan" : "Suara Fakta, Denyut Peristiwa"}
            />
            
            {/* Infinite scroll marker would go here */}
            <div className="flex justify-center pt-12">
              <button className="px-8 py-4 border border-white/10 text-white font-black italic uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Muat Lebih Banyak
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            {/* Trending Sidebar */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-red-600">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Sedang Tren</h2>
              </div>
              <div className="space-y-6">
                {trending.slice(0, 5).map((article, i) => (
                  <motion.div 
                    key={article.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex gap-4"
                  >
                    <span className="text-4xl font-black text-white/10 italic leading-none">{i + 1}</span>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">{article.category}</p>
                      <a href={`/article/${article.slug || article.id}`} className="text-sm font-bold text-white group-hover:text-red-500 transition-colors line-clamp-2">
                        {article.title}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Newsletter */}
            <section className="bg-red-600 p-8 space-y-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter leading-none">Berlangganan Update Terkini</h2>
              <p className="text-white/80 text-xs">Dapatkan ringkasan berita terbaik langsung di email Anda setiap pagi.</p>
              <form className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="w-full bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all text-sm"
                />
                <button className="w-full bg-black text-white py-3 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
                  Daftar Sekarang
                </button>
              </form>
            </section>

            {/* Tags Cloud */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-white/10">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Topik Populer</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Politik', 'Ekonomi', 'Hiburan', 'Teknologi', 'Sepak Bola', 'Kesehatan', 'Gaya Hidup', 'Internasional'].map((tag) => (
                  <a 
                    key={tag} 
                    href={`/search?q=${tag}`}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest hover:border-red-600 hover:text-red-500 transition-all"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
