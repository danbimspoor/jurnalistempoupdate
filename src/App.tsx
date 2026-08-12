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
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider } from './components/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans selection:bg-red-600 selection:text-white">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/author/:id" element={<AuthorDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
