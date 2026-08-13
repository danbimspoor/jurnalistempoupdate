import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { X, Save, Image as ImageIcon, Type, Layout, Tag, User, Upload, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ArticleFormProps {
  article?: NewsArticle;
  onClose: () => void;
  onSave: () => void;
}

const CATEGORIES = [
  'Nasional', 'Internasional', 'Ekonomi', 'Politik', 'Olahraga', 
  'Teknologi', 'Hiburan', 'Gaya Hidup', 'Kesehatan'
];

export function ArticleForm({ article, onClose, onSave }: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'Nasional',
    author_id: article?.author_id || 'a1', // Default to first author for now
    image_url: article?.image_url || '',
    is_featured: article?.is_featured || false,
    is_trending: article?.is_trending || false,
    tags: article?.tags || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Load image to canvas for resizing and compression
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve) => {
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });

      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = imageData;
      });

      // 2. Resize: max 1600px on longest side
      let width = img.width;
      let height = img.height;
      const maxSize = 1600;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      // 3. Compress: 80% quality (balanced) or as requested (user mentioned 10% size/quality)
      // I'll use 0.7 (70%) for a sharp but compact result
      const compressedDataUrl = canvas.toDataURL('image/webp', 0.7);

      // 4. Update form with the result (using Base64 for now as it's the most reliable "connected storage")
      setFormData({ ...formData, image_url: compressedDataUrl });
    } catch (err: any) {
      setError('Gagal memproses gambar: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = article ? `/api/articles/${article.id}` : '/api/news';
    const method = article ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json() as any;
        throw new Error(errData.error || 'Failed to save article');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, slug });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#121212] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl shadow-black/50"
      >
        <div className="sticky top-0 bg-[#121212]/80 backdrop-blur-md px-8 py-6 border-b border-white/10 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white font-serif">
            {article ? 'Edit Article' : 'Create New Article'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-3 h-3" /> Title
                </label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  onBlur={generateSlug}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all"
                  placeholder="Enter article title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Layout className="w-3 h-3" /> Slug
                </label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all font-mono text-sm"
                  placeholder="article-url-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                   Category
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all appearance-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-[#121212]">{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Foto Berita (Upload & Kompres)
                </label>
                <div className="flex flex-col gap-4">
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-xl px-4 py-8 flex flex-col items-center justify-center gap-2 group-hover:border-red-500/50 group-hover:bg-red-500/5 transition-all">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs font-bold text-white/40">Memproses...</span>
                        </div>
                      ) : formData.image_url ? (
                        <div className="flex flex-col items-center gap-2 text-green-500">
                          <CheckCircle2 className="w-8 h-8" />
                          <span className="text-xs font-bold">Gambar Terpasang</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-white/20 group-hover:text-red-500 transition-colors" />
                          <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">Pilih atau Seret Gambar</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {formData.image_url && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Atau URL Gambar Manual</label>
                    <input 
                      type="url" 
                      value={formData.image_url.startsWith('data:') ? '' : formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500/50 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                   Excerpt
                </label>
                <textarea 
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all resize-none"
                  placeholder="Short summary of the article..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Tags
                </label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all"
                  placeholder="politics, economy, ..."
                />
              </div>

              <div className="flex gap-8 pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 rounded-md border-white/10 bg-white/5 text-red-600 focus:ring-offset-0 focus:ring-0 transition-all"
                  />
                  <span className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">Featured</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.is_trending}
                    onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                    className="w-5 h-5 rounded-md border-white/10 bg-white/5 text-red-600 focus:ring-offset-0 focus:ring-0 transition-all"
                  />
                  <span className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">Trending</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3" /> Author ID
                </label>
                <input 
                  type="text" 
                  value={formData.author_id}
                  onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all"
                  placeholder="Author ID (e.g. a1)"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Content (Markdown supported)</label>
            <textarea 
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={12}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500/50 transition-all"
              placeholder="Write your article content here..."
              required
            />
          </div>

          <div className="pt-8 border-t border-white/10 flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-bold text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
