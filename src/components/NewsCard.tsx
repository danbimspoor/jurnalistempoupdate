import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { NewsArticle } from '../types';
import { formatDate } from '../lib/utils';
import { ArrowRight } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-1 md:col-span-2 row-span-2 relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 group aspect-[16/9] md:aspect-auto min-h-[400px]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
        <img
          src={article.image_url}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 left-6 z-20">
          <span className="bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">Eksklusif</span>
        </div>
        <div className="absolute bottom-8 left-8 right-8 z-20">
          <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-4 group-hover:translate-x-2 transition-transform text-white">
            <Link to={`/article/${article.id}`}>{article.title}</Link>
          </h2>
          <p className="text-white/60 text-sm max-w-lg mb-6 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-700 border border-white/20 flex items-center justify-center font-bold text-xs italic text-red-500">JT</div>
            <div className="text-[10px] text-white/40">
              <p className="font-bold text-white/80">{article.author}</p>
              <p>{formatDate(article.published_at)}</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-zinc-800/20 pointer-events-none flex items-center justify-center text-8xl font-black text-white/5 italic">TOP NEWS</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="col-span-1 rounded-2xl bg-[#121212] border border-white/10 p-6 flex flex-col justify-between hover:bg-zinc-800 transition-colors group"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{article.category}</span>
          <span className="text-[10px] text-white/30">{formatDate(article.published_at).split(',')[0]}</span>
        </div>
        <h3 className="text-lg font-bold leading-snug group-hover:text-red-500 transition-colors">
          <Link to={`/article/${article.id}`}>{article.title}</Link>
        </h3>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="h-1 w-12 bg-red-600"></div>
        <Link to={`/article/${article.id}`} className="p-2 rounded-full bg-white/5 hover:bg-red-600 transition-colors">
          <ArrowRight className="w-3 h-3 text-white" />
        </Link>
      </div>
    </motion.div>
  );
}
