import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { getArticleByUrl } from '../data/articles_test'; // Verwende Test-Daten
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

// Vereinfachte Article-Interface für die Test-Daten
interface SimpleArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  url: string;
  display_url: string;
  images: Array<{
    src: string;
    alt: string;
    original_url?: string;
  }>;
  author: string;
  category: string;
  scraped_url?: string;
  word_count: number;
  reading_time: number;
}

const ArticlePage: React.FC = () => {
  const { '*': urlPath } = useParams<{ '*': string }>();
  const [article, setArticle] = useState<SimpleArticle | null>(null);
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

  const renderParagraphs = (content: string) => {
    if (!content) return null;

    // Teile Content in Paragraphen basierend auf \n\n
    const paragraphs = content.split('\n\n').filter(para => para.trim());

    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      if (!trimmedParagraph) return null;

      // Erkenne Zitate (beginnen mit Anführungszeichen)
      const isQuote = trimmedParagraph.startsWith('„') || trimmedParagraph.startsWith('"');
      
      if (isQuote) {
        return (
          <blockquote 
            key={index} 
            className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 italic text-gray-800"
          >
            <p className="text-lg leading-relaxed">
              {trimmedParagraph}
            </p>
          </blockquote>
        );
      }

      // Normale Paragraphen
      return (
        <p 
          key={index} 
          className="mb-6 text-gray-700 leading-relaxed text-lg"
          style={{ lineHeight: '1.8' }}
        >
          {trimmedParagraph}
        </p>
      );
    });
  };

  const renderImages = (images: SimpleArticle['images']) => {
    if (!images || images.length === 0) return null;

    return (
      <div className="my-8">
        {images.map((image, index) => (
          <figure key={index} className="mb-8">
            <div className="flex justify-center">
              <img 
                src={image.src.replace('/src/assets/', '/src/assets/')} // Korrigiere Pfad falls nötig
                alt={image.alt}
                className="max-w-full h-auto rounded-lg shadow-lg border"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
                loading="lazy"
                onError={(e) => {
                  console.error('Fehler beim Laden des Bildes:', image.src);
                  // Fallback: Verstecke das Bild bei Fehlern
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            {image.alt && (
              <figcaption className="text-sm text-gray-600 text-center mt-3 italic">
                {image.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    );
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
              <ArrowLeft size={16} className="mr-2" />
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{article.reading_time} Min. Lesezeit</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag size={14} />
                <span className="capitalize">{article.category}</span>
              </div>
            </div>

            {/* Excerpt als Einleitung */}
            {article.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
                <p className="text-blue-800 italic text-lg leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            )}
          </header>

          {/* Bilder anzeigen - vor dem Content für bessere Integration */}
          {renderImages(article.images)}

          {/* Artikelinhalt mit verbessertem Paragraph-Rendering */}
          <div className="prose prose-lg max-w-none">
            {renderParagraphs(article.content)}
          </div>

          {/* Artikel-Metadaten am Ende */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>Wörter:</strong> {article.word_count.toLocaleString('de-DE')}
              </div>
              <div>
                <strong>Lesezeit:</strong> {article.reading_time} Minuten
              </div>
              <div>
                <strong>Kategorie:</strong> <span className="capitalize">{article.category}</span>
              </div>
            </div>
            
            {article.scraped_url && (
              <div className="mt-4 text-xs text-gray-500">
                <strong>Quelle:</strong> 
                <a 
                  href={article.scraped_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 hover:text-blue-800 underline"
                >
                  Original-Artikel
                </a>
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

