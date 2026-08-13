-- Migration to fix login issues by ensuring tables exist
-- Migration Name: 0001_create_users_table.sql

CREATE TABLE IF NOT EXISTS authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Reporter'
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS articles (
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

-- Seed initial admin if not present
-- Note: 'admin123' is used as plaintext because the code does NOT use hashing.
INSERT OR IGNORE INTO users (id, username, password, role) 
VALUES ('u1', 'admin', 'admin123', 'admin');

-- Seed initial authors if not present
INSERT OR IGNORE INTO authors (id, name, bio, avatar_url, role) VALUES
('a1', 'Redaksi Utama', 'Tim redaksi pusat JurnalisTempo Update.', 'https://picsum.photos/seed/author1/200/200', 'Editor in Chief'),
('a2', 'Budi Santoso', 'Jurnalis senior spesialis ekonomi dan pasar modal.', 'https://picsum.photos/seed/author2/200/200', 'Senior Reporter');
