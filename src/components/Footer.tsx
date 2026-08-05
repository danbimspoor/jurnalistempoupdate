import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Globe, Mail, Share2 } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1 space-y-6">
            <Link to="/" className="flex flex-col">
              <h2 className="text-3xl font-black tracking-tighter italic text-white leading-none">
                <span className="text-red-600">JurnalisTempo</span> UPDATE
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">
                Suara Fakta, Denyut Peristiwa
              </p>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Platform berita terpercaya yang menyajikan fakta akurat dan peristiwa terkini dengan integritas jurnalistik tinggi.
            </p>
            <div className="flex gap-4">
              <Globe className="w-5 h-5 text-white/30 hover:text-red-600 cursor-pointer transition-colors" />
              <Share2 className="w-5 h-5 text-white/30 hover:text-red-600 cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-white/30 hover:text-red-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs italic">Kategori Utama</h3>
            <ul className="space-y-4">
              {['Nasional', 'Ekonomi', 'Teknologi', 'Olahraga', 'Internasional'].map(cat => (
                <li key={cat}>
                  <Link to={`/?category=${cat}`} className="text-white/40 text-sm hover:text-red-500 transition-colors uppercase font-bold tracking-widest text-[11px]">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs italic">Perusahaan</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-white/40 text-sm hover:text-red-500 transition-colors">Tentang Kami</Link></li>
              <li><Link to="/contact" className="text-white/40 text-sm hover:text-red-500 transition-colors">Kontak</Link></li>
              <li><Link to="/pedoman-media-siber" className="text-white/40 text-sm hover:text-red-500 transition-colors">Pedoman Media Siber</Link></li>
              <li><Link to="/privacy" className="text-white/40 text-sm hover:text-red-500 transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-xs italic">Dukungan</h3>
            <ul className="space-y-4 text-white/40 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> redaksi@jurnalistempo.co.id</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> iklan@jurnalistempo.co.id</li>
              <li>Jl. Jurnalisme No. 1, Jakarta Pusat, Indonesia</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-[10px] font-mono tracking-widest uppercase">
            © {currentYear} JurnalisTempo Update. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex gap-8 text-white/20 text-[10px] font-mono tracking-widest uppercase">
            <Link to="/rss.xml" className="hover:text-red-600 transition-colors">RSS Feed</Link>
            <Link to="/sitemap.xml" className="hover:text-red-600 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
