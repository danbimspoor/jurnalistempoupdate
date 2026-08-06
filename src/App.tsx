import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ArticleDetail } from './pages/ArticleDetail';
import { SearchResults } from './pages/SearchResults';
import { AuthorDetail } from './pages/AuthorDetail';
import { About } from './pages/About';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans selection:bg-red-600 selection:text-white">
          <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] py-1 text-center sticky top-0 z-[100]">
            JURNALISTEMPO UPDATE - v1.0.1
          </div>
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/author/:id" element={<AuthorDetail />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
