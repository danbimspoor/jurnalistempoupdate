import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Eye, Share2, Globe, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { NewsArticle } from '../types';
import { SEO } from '../components/SEO';

export function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles/${id}`);
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0a0a0a]"><Loader2 className="w-12 h-12 text-red-600 animate-spin" /></div>;
  if (!article) return <div className="h-screen flex items-center justify-center text-white">Berita tidak ditemukan</div>;

  return (
    <article className="min-h-screen bg-[#0a0a0a] pb-24">
      <SEO 
        title={article.title} 
        description={article.excerpt}
        image={article.image_url}
        type="article"
        author={article.author_name}
        publishedDate={article.published_at}
        tags={article.tags?.split(',')}
      />

      {/* Hero Header */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={article.image_url} 
          alt={article.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none italic">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8 pt-12">
            <div className="space-y-4">
              <Link to={`/author/${article.author_id}`} className="group flex items-center gap-3">
                <img src={article.author_avatar} alt={article.author_name} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all border-2 border-white/10 group-hover:border-red-600" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Penulis</p>
                  <p className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">{article.author_name}</p>
                </div>
              </Link>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                <Clock className="w-4 h-4" />
                <span>{new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                <Eye className="w-4 h-4" />
                <span>{article.views} Pembaca</span>
              </div>
            </div>

            <div className="flex gap-2 pt-8 border-t border-white/10">
              <button className="p-3 bg-white/5 text-white/50 hover:bg-blue-600 hover:text-white transition-all"><Globe className="w-5 h-5" /></button>
              <button className="p-3 bg-white/5 text-white/50 hover:bg-sky-500 hover:text-white transition-all"><Mail className="w-5 h-5" /></button>
              <button className="p-3 bg-white/5 text-white/50 hover:bg-red-600 hover:text-white transition-all"><Share2 className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Article Content */}
          <div className="lg:col-span-3 space-y-12 bg-[#0a0a0a] p-8 md:p-12 shadow-2xl">
            <p className="text-2xl font-bold text-white/80 italic leading-relaxed border-l-4 border-red-600 pl-8">
              {article.excerpt}
            </p>

            <div className="prose prose-invert prose-red max-w-none prose-p:text-lg prose-p:leading-loose prose-p:text-white/70">
              <div className="whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {/* Tags Section */}
            <div className="pt-12 border-t border-white/10 flex flex-wrap gap-2">
              {article.tags?.split(',').map(tag => (
                <Link 
                  key={tag} 
                  to={`/search?q=${tag.trim()}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:border-red-600 hover:text-red-500 transition-all"
                >
                  #{tag.trim()}
                </Link>
              ))}
            </div>

            {/* Bottom Nav */}
            <div className="pt-12 flex justify-between items-center border-t border-white/10">
              <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-red-500 font-bold transition-all uppercase tracking-widest text-xs">
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </Link>
              <button className="flex items-center gap-2 text-white/50 hover:text-red-500 font-bold transition-all uppercase tracking-widest text-xs">
                <MessageSquare className="w-4 h-4" />
                <span>0 Komentar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
