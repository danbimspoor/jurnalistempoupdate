import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedDate?: string;
  tags?: string[];
}

export function SEO({ 
  title = "JurnalisTempo Update - Suara Fakta, Denyut Peristiwa",
  description = "Portal berita terpercaya yang menyajikan fakta akurat dan peristiwa terkini dengan integritas jurnalistik yang tinggi.",
  image = "/og-image.jpg",
  url = "https://jurnalistempo-update.pages.dev",
  type = "website",
  author = "JurnalisTempo Redaksi",
  publishedDate,
  tags = []
}: SEOProps) {
  const siteTitle = title.includes("JurnalisTempo") ? title : `${title} | JurnalisTempo Update`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'NewsArticle' : 'WebSite',
    "headline": title,
    "description": description,
    "image": [image],
    "datePublished": publishedDate,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "JurnalisTempo Update",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jurnalistempo-update.pages.dev/logo.png"
      }
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={tags.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
