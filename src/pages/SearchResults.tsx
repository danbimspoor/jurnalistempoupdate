import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NewsGrid } from '../components/NewsGrid';
import { SEO } from '../components/SEO';
import { NewsArticle } from '../types';
import { Search, Loader2 } from 'lucide-react';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    if (query) fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <SEO title={`Pencarian: ${query}`} />
      
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-4">
          <Search className="w-8 h-8 text-red-600" />
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Hasil Pencarian</h1>
        </div>
        <p className="text-white/40 text-sm font-mono tracking-widest">
          Menampilkan hasil untuk: <span className="text-red-500">"{query}"</span> ({articles.length} ditemukan)
        </p>
      </div>

      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
        </div>
      ) : articles.length > 0 ? (
        <NewsGrid articles={articles} />
      ) : (
        <div className="h-[400px] flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-2xl font-black text-white/20 italic uppercase">Tidak ada berita ditemukan</p>
          <p className="text-white/40 max-w-md">Coba gunakan kata kunci lain atau telusuri berdasarkan kategori utama kami.</p>
        </div>
      )}
    </div>
  );
}
