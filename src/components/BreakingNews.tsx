import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { NewsArticle } from '../types';

interface BreakingNewsProps {
  articles: NewsArticle[];
}

export function BreakingNews({ articles }: BreakingNewsProps) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-red-600 text-white h-10 flex items-center overflow-hidden whitespace-nowrap px-4 sm:px-8 border-b border-red-700">
      <div className="flex items-center gap-2 mr-6 shrink-0 bg-red-600 z-10 font-black italic tracking-tighter text-xs uppercase">
        <TrendingUp className="w-4 h-4" />
        <span>Breaking News</span>
      </div>
      
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex items-center gap-12"
      >
        {articles.map((article) => (
          <Link 
            key={article.id} 
            to={`/article/${article.slug || article.id}`}
            className="text-xs font-bold hover:underline transition-all flex items-center gap-2"
          >
            <span className="opacity-50">/</span>
            {article.title}
          </Link>
        ))}
        {/* Duplicate for seamless loop */}
        {articles.map((article) => (
          <Link 
            key={`${article.id}-clone`} 
            to={`/article/${article.slug || article.id}`}
            className="text-xs font-bold hover:underline transition-all flex items-center gap-2"
          >
            <span className="opacity-50">/</span>
            {article.title}
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
