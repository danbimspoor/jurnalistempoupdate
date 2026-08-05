import React from 'react';
import { SEO } from '../components/SEO';
import { Newspaper, Shield, Users, Target } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-20 space-y-20">
      <SEO title="Tentang Kami" />
      
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase">Integritas Jurnalistik</h1>
        <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
          JurnalisTempo Update adalah mercusuar kebenaran di era informasi yang serba cepat. Kami percaya bahwa setiap peristiwa memiliki kedalaman yang harus digali.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4 bg-white/5 p-8 border border-white/10">
          <Newspaper className="w-12 h-12 text-red-600" />
          <h2 className="text-2xl font-black text-white italic uppercase">Visi Kami</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Menjadi platform berita digital terdepan yang tidak hanya melaporkan, tetapi juga mengedukasi dan menginspirasi masyarakat Indonesia melalui jurnalisme yang berkualitas.
          </p>
        </div>
        <div className="space-y-4 bg-white/5 p-8 border border-white/10">
          <Shield className="w-12 h-12 text-red-600" />
          <h2 className="text-2xl font-black text-white italic uppercase">Misi Kami</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Menyajikan berita yang akurat, berimbang, dan bebas dari intervensi pihak manapun, dengan mengedepankan Kode Etik Jurnalistik sebagai landasan utama.
          </p>
        </div>
      </div>

      <div className="space-y-8 border-t border-white/10 pt-20">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase text-center">Nilai-Nilai Inti</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <Users className="w-8 h-8 text-red-600 mx-auto" />
            <p className="text-white font-bold uppercase text-xs">Kolaborasi</p>
          </div>
          <div className="space-y-2">
            <Target className="w-8 h-8 text-red-600 mx-auto" />
            <p className="text-white font-bold uppercase text-xs">Akurasi</p>
          </div>
          <div className="space-y-2">
            <Shield className="w-8 h-8 text-red-600 mx-auto" />
            <p className="text-white font-bold uppercase text-xs">Independensi</p>
          </div>
          <div className="space-y-2">
            <Newspaper className="w-8 h-8 text-red-600 mx-auto" />
            <p className="text-white font-bold uppercase text-xs">Integritas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
