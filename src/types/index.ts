export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  author_bio?: string;
  author_role?: string;
  published_at: string;
  image_url: string;
  is_featured: boolean;
  is_trending: boolean;
  views: number;
  tags: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  role: string;
}

export type Category = 'Nasional' | 'Ekonomi' | 'Teknologi' | 'Olahraga' | 'Hiburan' | 'Internasional';

export const CATEGORIES: Category[] = [
  'Nasional',
  'Ekonomi',
  'Teknologi',
  'Olahraga',
  'Hiburan',
  'Internasional'
];
