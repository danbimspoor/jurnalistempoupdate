DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS users;

CREATE TABLE authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Reporter'
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin'
);

CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id TEXT NOT NULL,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT 0,
  is_trending BOOLEAN DEFAULT 0,
  views INTEGER DEFAULT 0,
  tags TEXT,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

INSERT INTO authors (id, name, bio, avatar_url, role) VALUES
('a1', 'Redaksi Utama', 'Tim redaksi pusat JurnalisTempo Update.', 'https://picsum.photos/seed/author1/200/200', 'Editor in Chief'),
('a2', 'Budi Santoso', 'Jurnalis senior spesialis ekonomi dan pasar modal.', 'https://picsum.photos/seed/author2/200/200', 'Senior Reporter');

INSERT INTO users (id, username, password, role) VALUES
('u1', 'admin', 'admin123', 'admin');

INSERT INTO articles (id, title, slug, excerpt, content, category, author_id, image_url, is_featured, is_trending, tags) VALUES
('1', 'Indonesia Menuju Indonesia Emas 2045', 'indonesia-emas-2045', 'Visi jangka panjang Indonesia untuk menjadi negara maju di usia satu abad.', 'Konten lengkap mengenai visi Indonesia Emas 2045 yang mencakup pembangunan ekonomi, infrastruktur, dan sumber daya manusia...', 'Nasional', 'a1', 'https://picsum.photos/seed/indo2045/1200/800', 1, 1, 'Nasional,Ekonomi,MasaDepan'),
('2', 'Pasar Saham Regional Menguat Hari Ini', 'pasar-saham-menguat-hari-ini', 'Indeks Harga Saham Gabungan (IHSG) menunjukkan tren positif di awal pekan.', 'Laporan pasar modal hari ini menunjukkan kepercayaan investor meningkat seiring dengan kebijakan moneter yang stabil...', 'Ekonomi', 'a2', 'https://picsum.photos/seed/economy/1200/800', 0, 1, 'Ekonomi,IHSG,Investasi'),
('3', 'Evolusi AI dalam Kehidupan Sehari-hari', 'evolusi-ai-kehidupan', 'Bagaimana kecerdasan buatan mulai mengubah cara kita bekerja dan berinteraksi.', 'Dari asisten virtual hingga otomasi industri, AI kini hadir di berbagai lini kehidupan kita...', 'Teknologi', 'a1', 'https://picsum.photos/seed/tech/1200/800', 0, 0, 'Teknologi,AI,MasaDepan');
