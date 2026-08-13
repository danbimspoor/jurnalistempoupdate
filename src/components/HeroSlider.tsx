import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { NewsArticle } from '../types';

interface HeroSliderProps {
  articles: NewsArticle[];
}

export function HeroSlider({ articles }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [articles.length]);

  if (articles.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % articles.length);
  const prev = () => setCurrent((prev) => (prev - 1 + articles.length) % articles.length);

  const active = articles[current];

  return (
    <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-black group">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={active.image_url} 
            alt={active.title}
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest">
                  {active.category}
                </span>
                <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(active.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              
              <Link to={`/article/${active.slug || active.id}`} className="block">
                <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] hover:text-red-500 transition-colors max-w-4xl">
                  {active.title}
                </h2>
              </Link>
              
              <p className="text-white/90 text-sm md:text-lg max-w-2xl font-medium leading-relaxed hidden md:block">
                {active.excerpt}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={prev} className="p-3 bg-black/50 text-white hover:bg-red-600 transition-colors backdrop-blur-md">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={next} className="p-3 bg-black/50 text-white hover:bg-red-600 transition-colors backdrop-blur-md">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {articles.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all ${current === i ? 'w-8 bg-red-600' : 'w-4 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
