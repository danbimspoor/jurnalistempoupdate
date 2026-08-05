import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NewsGrid } from '../components/NewsGrid';
import { SEO } from '../components/SEO';
import { NewsArticle, Author } from '../types';
import { Loader2, Mail, Share2, Globe } from 'lucide-react';

export function AuthorDetail() {
  const { id } = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/news`); // In real app, filter by author in API
        const data: NewsArticle[] = await res.json();
        const filtered = data.filter(a => a.author_id === id);
        setArticles(filtered);
        
        // Mock author data fetch if not in API
        setAuthor({
          id: id!,
          name: filtered[0]?.author_name || 'Reporter JurnalisTempo',
          bio: 'Dedikasi untuk menyajikan fakta dan berita terpercaya untuk masyarakat Indonesia.',
          avatar_url: filtered[0]?.author_avatar || 'https://picsum.photos/seed/author/200/200',
          role: 'Reporter Senior'
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-red-600 animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <SEO title={`Penulis: ${author?.name}`} description={author?.bio} />
      
      <div className="flex flex-col md:flex-row gap-12 items-center mb-20 pb-12 border-b border-white/10">
        <img 
          src={author?.avatar_url} 
          alt={author?.name}
          className="w-48 h-48 rounded-full object-cover grayscale hover:grayscale-0 transition-all border-4 border-red-600"
        />
        <div className="space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">{author?.name}</h1>
            <p className="text-red-600 font-black tracking-widest text-sm uppercase">{author?.role}</p>
          </div>
          <p className="text-white/60 max-w-2xl leading-relaxed">{author?.bio}</p>
          <div className="flex justify-center md:justify-start gap-4">
            <button className="p-2 bg-white/5 rounded-full text-white/50 hover:text-red-500 transition-colors"><Share2 className="w-5 h-5" /></button>
            <button className="p-2 bg-white/5 rounded-full text-white/50 hover:text-red-500 transition-colors"><Mail className="w-5 h-5" /></button>
            <button className="p-2 bg-white/5 rounded-full text-white/50 hover:text-red-500 transition-colors"><Globe className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <NewsGrid articles={articles} title={`Berita oleh ${author?.name}`} subtitle="Arsip liputan mendalam dan investigasi" />
    </div>
  );
}
