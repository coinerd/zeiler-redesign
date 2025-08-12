import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { getArticleByUrl } from '../data/articles';
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';
import type { Article } from '../types/Article';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

const ArticlePage: React.FC = () => {
  const { '*': urlPath } = useParams<{ '*': string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!urlPath) {
      setLoading(false);
      return;
    }

    // Entferne den führenden Slash, falls vorhanden, um die URL zu normalisieren
    const normalizedUrlPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
    const foundArticle = getArticleByUrl(normalizedUrlPath);
    setArticle(foundArticle || null);
    setLoading(false);
  }, [urlPath]);

  const generateBreadcrumbs = (url: string): BreadcrumbItem[] => {
    const parts = url.split('/').filter(part => part);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Startseite', href: '/' }
    ];
    
    for (let i = 0; i < parts.length - 1; i++) {
      const href = `/${parts.slice(0, i + 1).join('/')}`;
      const name = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
      breadcrumbs.push({ name, href });
    }
    
    if (article) {
      breadcrumbs.push({ name: article.title });
    }
    
    return breadcrumbs;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unbekanntes Datum';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel nicht gefunden</h1>
            <p className="text-gray-600 mb-8">Der angeforderte Artikel konnte nicht gefunden werden.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Zur Startseite
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={generateBreadcrumbs(article.url)} />
        
        <button 
          onClick={() => window.history.back()}
          className="mb-6 inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Zurück</span>
        </button>

        <article className="bg-white rounded-lg shadow-sm border p-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{formatDate(article.metadata.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{article.metadata.readingTime} Min. Lesezeit</span>
              </div>
            </div>

            {/* Kategorie und Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `var(--color-${article.category.color}-100, #f3f4f6)`,
                  color: `var(--color-${article.category.color}-800, #374151)`
                }}
              >
                {article.category.name}
              </span>
              
              {article.metadata.tags.slice(0, 5).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                >
                  <Tag size={10} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-800 italic">{article.excerpt}</p>
              </div>
            )}
          </header>

          {/* Bilder anzeigen */}
          {article.images && article.images.length > 0 && (
            <div className="mb-8">
              {article.images.map((image, index) => (
                <figure key={index} className="mb-6">
                  <img 
                    src={image.src} 
                    alt={image.alt || `Bild ${index + 1} zu ${article.title}`}
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
                    loading="lazy"
                  />
                  {image.caption && (
                    <figcaption className="text-sm text-gray-600 text-center mt-2 italic">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {/* Artikelinhalt */}
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => {
              if (!paragraph.trim()) return null;
              
              return (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Artikel-Metadaten am Ende */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>Wörter:</strong> {article.metadata.wordCount.toLocaleString('de-DE')}
              </div>
              <div>
                <strong>Lesezeit:</strong> {article.metadata.readingTime} Minuten
              </div>
              <div>
                <strong>Sprache:</strong> {article.metadata.language.toUpperCase()}
              </div>
            </div>
            
            {article.metadata.tags.length > 0 && (
              <div className="mt-4">
                <strong className="text-gray-700">Tags:</strong>
                <div className="flex flex-wrap gap-1 mt-2">
                  {article.metadata.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;

