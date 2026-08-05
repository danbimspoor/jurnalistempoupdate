import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { CATEGORIES } from '../types';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[60] h-20 border-b border-white/10 px-4 sm:px-8 flex items-center justify-between shrink-0 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex flex-col group">
              <h1 className="text-2xl font-black tracking-tighter leading-none italic text-white">
                <span className="text-red-600 group-hover:text-red-500 transition-colors">JurnalisTempo</span> UPDATE
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">
                Suara Fakta, Denyut Peristiwa
              </p>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 text-[11px] font-bold uppercase tracking-widest">
              {CATEGORIES.slice(0, 7).map((cat) => (
                <Link
                  key={cat}
                  to={`/?category=${cat}`}
                  className={cn(
                    "transition-all hover:text-red-500 relative py-2",
                    currentCategory === cat ? "text-red-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600" : "text-white/60"
                  )}
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-white/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>LIVE FEED</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-white/70 hover:text-red-500 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button className="hidden sm:block p-2 text-white/70 hover:text-red-500 transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              <button className="hidden sm:block p-2 text-white/70 hover:text-red-500 transition-colors">
                <User className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-4 text-white hover:text-red-500 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <form onSubmit={handleSearch} className="w-full max-w-4xl space-y-8">
              <div className="space-y-4">
                <p className="text-red-600 font-black italic tracking-widest text-sm uppercase">Cari Berita</p>
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Apa yang ingin Anda baca hari ini?"
                    className="w-full bg-transparent border-b-4 border-white/10 py-6 text-4xl md:text-6xl font-black text-white placeholder:text-white/10 focus:outline-none focus:border-red-600 transition-colors"
                  />
                  <button type="submit" className="absolute right-0 bottom-6 p-4 text-white/30 hover:text-red-500 transition-colors">
                    <Search className="w-10 h-10" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <p className="w-full text-white/30 text-xs font-mono uppercase tracking-widest">Populer:</p>
                {['Politik', 'IHSG', 'Sepak Bola', 'Gaza', 'Artificial Intelligence'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/search?q=${encodeURIComponent(tag)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-4 py-2 border border-white/10 text-white/50 hover:border-red-600 hover:text-red-500 transition-all text-sm font-bold italic"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[55] lg:hidden bg-[#0a0a0a] pt-20"
          >
            <div className="px-8 py-12 space-y-8">
              <nav className="flex flex-col space-y-6">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/?category=${cat}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "text-3xl font-black tracking-tighter italic transition-colors",
                      currentCategory === cat ? "text-red-500" : "text-white hover:text-red-500"
                    )}
                  >
                    {cat}
                  </Link>
                ))}
              </nav>
              
              <div className="pt-8 border-t border-white/10 space-y-6">
                <Link to="/about" className="block text-white/50 font-bold hover:text-white transition-colors">Tentang Kami</Link>
                <Link to="/contact" className="block text-white/50 font-bold hover:text-white transition-colors">Kontak</Link>
                <Link to="/sitemap" className="block text-white/50 font-bold hover:text-white transition-colors">Sitemap</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
