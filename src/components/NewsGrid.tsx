import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsGridProps {
  articles: NewsArticle[];
  title?: string;
  subtitle?: string;
}

export function NewsGrid({ articles, title, subtitle }: NewsGridProps) {
  return (
    <div className="space-y-8">
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">{title}</h2>}
          {subtitle && <p className="text-white/40 text-xs font-mono tracking-widest">{subtitle}</p>}
          <div className="h-1 w-12 bg-red-600 mt-2" />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col space-y-4"
          >
            <Link to={`/article/${article.slug || article.id}`} className="relative aspect-video overflow-hidden bg-white/5">
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest">
                  {article.category}
                </span>
              </div>
            </Link>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-[10px] font-mono text-white/30">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(article.published_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{article.views} views</span>
                </div>
              </div>
              
              <Link to={`/article/${article.slug || article.id}`}>
                <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-red-500 transition-colors">
                  {article.title}
                </h3>
              </Link>
              
              <p className="text-white/50 text-sm line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
