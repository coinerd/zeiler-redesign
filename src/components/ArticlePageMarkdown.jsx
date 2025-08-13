import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import Breadcrumbs from './Breadcrumbs';
import { parseMarkdownWithFrontMatter, cleanArticleTitle, cleanArticleContent, validateArticleContent } from '../utils/MarkdownParser';

/**
 * Artikel-Seite mit Markdown-Unterstützung
 * Zeigt Artikel-Content mit verbesserter Formatierung und Metadaten
 */
const ArticlePageMarkdown = () => {
  const { category, subcategory, slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        
        // Konstruiere URL-Pfad
        const urlPath = subcategory 
          ? `/${category}/${subcategory}/${slug}`
          : `/${category}/${slug}`;
        
        console.log('Suche Artikel für URL-Pfad:', urlPath);
        
        // Lade Artikel-Daten (simuliert - später aus API oder statischen Daten)
        const foundArticle = await findArticleByPath(urlPath);
        
        if (foundArticle) {
          // Parse Markdown mit Front Matter
          const { metadata, content } = parseMarkdownWithFrontMatter(foundArticle.markdownContent || foundArticle.content || '');
          
          // Bereinige Titel und Content
          const cleanTitle = cleanArticleTitle(metadata.title || foundArticle.title);
          const cleanContent = cleanArticleContent(content);
          
          // Validiere Content
          const validation = validateArticleContent(cleanContent);
          
          if (!validation.isValid) {
            console.warn('Content-Validierung fehlgeschlagen:', validation.issues);
          }
          
          // Erstelle bereinigten Artikel
          const processedArticle = {
            ...foundArticle,
            title: cleanTitle,
            markdownContent: cleanContent, // NUR der bereinigte Content ohne YAML
            metadata: {
              ...foundArticle.metadata,
              ...metadata,
              wordCount: validation.wordCount,
              readingTime: Math.max(1, Math.ceil(validation.wordCount / 200))
            },
            contentValidation: validation
          };
          
          setArticle(processedArticle);
          setArticle(foundArticle);
        } else {
          setError('Artikel nicht gefunden');
        }
      } catch (err) {
        console.error('Fehler beim Laden des Artikels:', err);
        setError('Fehler beim Laden des Artikels');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [category, subcategory, slug]);

  // Simulierte Artikel-Suche (später durch echte Datenquelle ersetzen)
  const findArticleByPath = async (urlPath) => {
    // Test-Artikel für Tocqueville
    if (urlPath.includes('tocqueville') || urlPath.includes('grausamkeit')) {
      return {
        id: 'tocqueville-grausamkeit',
        title: 'Alexis de Tocqueville über die plötzliche Grausamkeit in einer unglücklichen Zeit',
        author: 'Detlef Zeiler',
        category: 'Geschichte',
        subcategory: 'Philosophie',
        publishDate: '2024-01-15',
        readingTime: 3,
        wordCount: 307,
        tags: ['Tocqueville', 'Geschichte', 'Philosophie', 'Gesellschaft'],
        excerpt: 'Tocqueville beschreibt in seinen Erinnerungen, wie schnell sich friedfertige Menschen in Krisenzeiten zu Gewalt hinreißen lassen.',
        markdownContent: `---
title: "Alexis de Tocqueville über die plötzliche Grausamkeit in einer unglücklichen Zeit"
author: "Detlef Zeiler"
category: "geschichte"
word_count: 307
reading_time: 1
extraction_date: "2025-08-12T17:46:38.550389"
extraction_method: "browser_content"
---

# Alexis de Tocqueville über die plötzliche Grausamkeit in einer unglücklichen Zeit

Alexis de Tocqueville (1805-1859) ist vor allem mit seinem Buch „Über die Demokratie in Amerika" (1835/1840) bekannt geworden. In seinen „Erinnerungen" hinterlässt er aber auch ein lebensnahes historisches Dokument über die Geschehnisse der 1848er Revolution und der niedergeschlagenen Juniaufstände der Arbeiter von 1848.

So schildert er, was für Auswirkungen die Bürgerkriegsatmosphäre auf seine Nachbarn, die bei der Nationalgarde Dienst taten, und auf ihn selbst hatte:

> „Als ich mit ihnen sprach, bemerkte ich, mit welch erschreckender Schnelligkeit selbst in einem zivilisierten Jahrhundert wie dem unseren die friedfertigsten Seelen sich sozusagen auf Bürgerkriege einstimmen und wie sich der Geschmack an der Gewalt und die Verachtung des Menschenlebens plötzlich in dieser unglücklichen Zeit dort ausbreiten. Die Menschen, mit denen ich mich unterhielt, waren gut gestellte und friedfertige Handwerker, deren sanfte und ein wenig weiche Gewohnheiten noch weiter von der Grausamkeit als vom Heroismus entfernt waren. Trotzdem dachten sie nur noch an Zerstörung und Massaker. Sie klagten darüber, dass man nicht mit Bomben, Minen und Gräben gegen die aufständischen Straßen vorging, und wollten gegenüber niemandem mehr Gnade walten lassen. […] als ich meinen Weg fortsetzte, kam ich nicht umhin, über mich selbst nachzudenken und über die Natur meiner Argumente zu staunen, mit der ich mich selbst unversehens binnen zweier Tage mit diesen Ideen erbarmungsloser Vernichtung und großer Härte vertraut gemacht hatte, die mir natürlicherweise so fern liegen."

Was Tocqueville hier selbstkritisch und reflektiert beschreibt, das wiederholt sich immer wieder in gesellschaftlichen Umbruchszeiten – und es scheint nicht vom jeweiligen Bildungsstand abzuhängen, wie sehr sich jemand von gewalthaltigen Ereignissen mitreißen lässt. 

Die Decke der Zivilisation ist viel dünner, als man sich das in Friedenszeiten vorstellen mag. Schlimmer als ein plötzlicher Ausbruch von Gewalt, der danach reflektiert wird, ist aber die allmähliche Gewöhnung an verdeckte Gewalt, wie sie sich heute abzuzeichnen scheint.`,
        images: [
          {
            src: '/src/assets/tocqueville_portrait_531.jpg',
            alt: 'Portrait von Alexis de Tocqueville'
          }
        ]
      };
    }
    
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Artikel wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel nicht gefunden</h1>
          <p className="text-gray-600 mb-6">{error || 'Der angeforderte Artikel konnte nicht gefunden werden.'}</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  // Debug-Informationen (nur in Development)
  if (process.env.NODE_ENV === 'development' && article.contentValidation && !article.contentValidation.isValid) {
    console.warn('Content-Validierung:', article.contentValidation);
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Übersicht
          </Link>
          
          <Breadcrumbs 
            category={article.category}
            subcategory={article.subcategory}
            articleTitle={article.title}
          />
        </div>
      </header>

      {/* Artikel-Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm p-8">
          {/* Artikel-Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-blue-600 mb-6 leading-relaxed font-medium">
                {article.excerpt}
              </p>
            )}
            
            {/* Metadaten */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-b border-gray-200 pb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{article.author}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(article.publishDate)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{article.metadata?.readingTime || article.readingTime} Min. Lesezeit</span>
              </div>
              
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                <span>{article.metadata?.wordCount || article.wordCount} Wörter</span>
              </div>
            </div>
            
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content-Validierung Warnung (nur in Development) */}
          {process.env.NODE_ENV === 'development' && article.contentValidation && !article.contentValidation.isValid && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-yellow-800 font-medium mb-2">Content-Validierung fehlgeschlagen:</h3>
              <ul className="text-yellow-700 text-sm">
                {article.contentValidation.issues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Markdown-Content */}
          <div className="prose prose-lg max-w-none">
            <MarkdownRenderer 
              content={article.markdownContent}
              className="article-content"
            />
          </div>

          {/* Artikel-Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Kategorie: <span className="font-medium">{article.category}</span>
                {article.subcategory && (
                  <> → <span className="font-medium">{article.subcategory}</span></>
                )}
              </div>
              
              <Link 
                to="/" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Weitere Artikel
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
};

export default ArticlePageMarkdown;

