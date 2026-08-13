import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, User as UserIcon, Settings, FileText, BarChart3, Plus, Trash2, Edit, Loader2, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NewsArticle } from '../types';
import { ArticleForm } from '../components/ArticleForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | undefined>();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news?limit=50');
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArticles();
      } else {
        alert('Failed to delete article');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const stats = [
    { label: 'Total Articles', value: articles.length.toString(), icon: FileText, color: 'text-blue-500' },
    { label: 'Total Views', value: articles.reduce((acc, curr) => acc + (curr.views || 0), 0).toLocaleString(), icon: BarChart3, color: 'text-green-500' },
    { label: 'Featured', value: articles.filter(a => a.is_featured).length.toString(), icon: UserIcon, color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Dashboard - JurnalisTempo Admin</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">Admin Dashboard</h1>
          <p className="text-white/60">Welcome back, <span className="text-red-500 font-bold">{user?.username}</span></p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Key className="w-5 h-5" />
            Ganti Password
          </button>
          <button 
            onClick={() => {
              setEditingArticle(undefined);
              setIsFormOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Article
          </button>
          <button 
            onClick={handleLogout}
            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-white/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 bg-white/5 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-white/40 font-bold uppercase tracking-widest text-xs">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Articles</h2>
              <button onClick={fetchArticles} className="text-red-500 text-sm font-bold hover:underline">Refresh</button>
            </div>
            <div className="p-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {articles.length === 0 ? (
                    <p className="text-white/40 text-center py-12">No articles found.</p>
                  ) : (
                    articles.map((article, i) => (
                      <motion.div 
                        key={article.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white/20">
                            {article.image_url ? (
                              <img src={article.image_url} alt="" className="w-full h-full object-cover rounded-lg opacity-50" />
                            ) : (
                              <FileText className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-white font-medium group-hover:text-red-500 transition-colors line-clamp-1">{article.title}</h3>
                            <p className="text-white/40 text-xs mt-1">
                              {new Date(article.published_at!).toLocaleDateString()} • {article.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingArticle(article);
                              setIsFormOpen(true);
                            }}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/30 hover:text-white"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(article.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-white/30 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Cloudflare D1</span>
                <span className="flex items-center gap-2 text-green-500 text-sm font-bold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Workers Runtime</span>
                <span className="flex items-center gap-2 text-green-500 text-sm font-bold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Session Date</span>
                <span className="text-white font-mono text-xs">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ArticleForm 
            article={editingArticle}
            onClose={() => setIsFormOpen(false)}
            onSave={fetchArticles}
          />
        )}
        {isPasswordModalOpen && (
          <ChangePasswordForm 
            onClose={() => setIsPasswordModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
