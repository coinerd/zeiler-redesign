/**
 * Daten-Hilfsfunktionen für das Zeiler-Redesign Projekt
 * Bietet Utilities für Artikel-Verarbeitung und Daten-Transformation
 */

import type { 
  Article, 
  ArticleMetadata, 
  ArticleSEO,
  ReadingTimeCalculator,
  ExcerptGenerator,
  SlugGenerator
} from '../types/Article';
import { URLManager } from './URLManager';
import { DEFAULT_READING_SPEED, DEFAULT_EXCERPT_LENGTH } from '../types/Article';

export class DataHelpers {
  /**
   * Berechnet die geschätzte Lesezeit für einen Text
   */
  static calculateReadingTime: ReadingTimeCalculator = (content: string): number => {
    const wordCount = DataHelpers.countWords(content);
    return Math.ceil(wordCount / DEFAULT_READING_SPEED);
  };

  /**
   * Zählt die Wörter in einem Text
   */
  static countWords(text: string): number {
    return text
      .replace(/[^\w\säöüß]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0).length;
  }

  /**
   * Generiert einen Excerpt aus einem Text
   */
  static generateExcerpt: ExcerptGenerator = (content: string, length = DEFAULT_EXCERPT_LENGTH): string => {
    // Entferne HTML-Tags falls vorhanden
    const cleanContent = content.replace(/<[^>]*>/g, '');
    
    if (cleanContent.length <= length) {
      return cleanContent;
    }

    // Schneide am letzten vollständigen Satz ab
    const truncated = cleanContent.substring(0, length);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );

    if (lastSentenceEnd > length * 0.7) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }

    // Fallback: Schneide am letzten Wort ab
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  };

  /**
   * Extrahiert Tags aus einem Text basierend auf Häufigkeit und Relevanz
   */
  static extractTags(content: string, maxTags = 10): string[] {
    const words = content
      .toLowerCase()
      .replace(/[^\w\säöüß]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Zähle Worthäufigkeiten
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    // Deutsche Stoppwörter
    const stopWords = new Set([
      'aber', 'alle', 'allem', 'allen', 'aller', 'alles', 'also', 'andere',
      'anderen', 'andern', 'anders', 'auch', 'auf', 'aus', 'bei', 'bin',
      'bis', 'bist', 'da', 'damit', 'dann', 'das', 'dass', 'dazu', 'dem',
      'den', 'der', 'des', 'dessen', 'die', 'dies', 'diese', 'diesem',
      'diesen', 'dieser', 'dieses', 'doch', 'dort', 'durch', 'ein', 'eine',
      'einem', 'einen', 'einer', 'eines', 'er', 'es', 'etwas', 'für',
      'gegen', 'gewesen', 'hab', 'habe', 'haben', 'hat', 'hatte', 'hatten',
      'hier', 'hin', 'hinter', 'ich', 'ihm', 'ihn', 'ihnen', 'ihr', 'ihre',
      'ihrem', 'ihren', 'ihrer', 'ihres', 'im', 'in', 'indem', 'ins', 'ist',
      'ja', 'kann', 'kein', 'keine', 'keinem', 'keinen', 'keiner', 'keines',
      'können', 'könnte', 'machen', 'man', 'manche', 'manchen', 'mancher',
      'manches', 'mein', 'meine', 'meinem', 'meinen', 'meiner', 'meines',
      'mit', 'muss', 'musste', 'nach', 'nicht', 'nichts', 'noch', 'nun',
      'nur', 'ob', 'oder', 'ohne', 'sehr', 'sein', 'seine', 'seinem',
      'seinen', 'seiner', 'seines', 'selbst', 'sich', 'sie', 'sind', 'so',
      'solche', 'solchem', 'solchen', 'solcher', 'solches', 'soll', 'sollte',
      'sondern', 'sonst', 'über', 'um', 'und', 'uns', 'unse', 'unser',
      'unsere', 'unserem', 'unseren', 'unserer', 'unseres', 'unter', 'viel',
      'vom', 'von', 'vor', 'während', 'war', 'waren', 'warst', 'was', 'weg',
      'weil', 'weiter', 'welche', 'welchem', 'welchen', 'welcher', 'welches',
      'wenn', 'werde', 'werden', 'wie', 'wieder', 'will', 'wir', 'wird',
      'wirst', 'wo', 'wollen', 'wollte', 'würde', 'würden', 'zu', 'zum',
      'zur', 'zwar', 'zwischen'
    ]);

    // Filtere Stoppwörter und sortiere nach Häufigkeit
    const tags = Array.from(wordCount.entries())
      .filter(([word, count]) => !stopWords.has(word) && count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxTags)
      .map(([word]) => word);

    return tags;
  }

  /**
   * Bereinigt und normalisiert Artikel-Titel
   */
  static cleanTitle(title: string): string {
    return title
      .replace(/^ZEILER\.me - IT & Medien, Geschichte, Deutsch - /, '')
      .replace(/^ZEILER\.me - /, '')
      .replace(/^IT & Medien, Geschichte, Deutsch - /, '')
      .trim() || 'Unbekannter Titel';
  }

  /**
   * Bereinigt Artikel-Inhalt von unerwünschten Elementen
   */
  static cleanContent(content: string): string {
    // Entferne Google Sites Navigation
    const unwantedPatterns = [
      /^Search this site.*?Skip to navigation\s*/s,
      /^Skip to main content.*?Skip to navigation\s*/s,
      /Startseite\s+Detlef Zeiler\s+Deutsch.*?Selfmade\s*/s,
      /Copyright © \d{4} - \d{4} Detlef und Julian Zeiler.*?$/s,
      /Google Sites\s+Report abuse.*?$/s,
      /Made with Google Sites\s*$/s
    ];

    let cleanedContent = content;
    unwantedPatterns.forEach(pattern => {
      cleanedContent = cleanedContent.replace(pattern, '');
    });

    // Bereinige Whitespace
    cleanedContent = cleanedContent
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/gm, '')
      .trim();

    return cleanedContent;
  }

  /**
   * Generiert SEO-Metadaten für einen Artikel
   */
  static generateSEO(article: Partial<Article>): ArticleSEO {
    const metaDescription = article.excerpt 
      ? DataHelpers.generateExcerpt(article.excerpt, 160)
      : 'Artikel von ZEILER.me';

    const keywords = [
      ...(article.metadata?.tags || []),
      article.author?.name || '',
      article.category?.name || ''
    ].filter(Boolean);

    return {
      metaDescription,
      keywords,
      canonicalUrl: article.url
    };
  }

  /**
   * Erstellt vollständige Artikel-Metadaten
   */
  static generateMetadata(content: string, existingTags: string[] = []): ArticleMetadata {
    const wordCount = DataHelpers.countWords(content);
    const readingTime = DataHelpers.calculateReadingTime(content);
    const extractedTags = DataHelpers.extractTags(content, 5);
    const allTags = [...new Set([...existingTags, ...extractedTags])];

    return {
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: allTags,
      readingTime,
      wordCount,
      language: 'de'
    };
  }

  /**
   * Validiert ein Artikel-Objekt
   */
  static validateArticle(article: Partial<Article>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!article.id) errors.push('Article ID is required');
    if (!article.title) errors.push('Article title is required');
    if (!article.content) errors.push('Article content is required');
    if (!article.author) errors.push('Article author is required');
    if (!article.category) errors.push('Article category is required');

    if (article.title && article.title.length < 3) {
      errors.push('Article title must be at least 3 characters long');
    }

    if (article.content && article.content.length < 50) {
      errors.push('Article content must be at least 50 characters long');
    }

    if (article.slug && !/^[a-z0-9-]+$/.test(article.slug)) {
      errors.push('Article slug must contain only lowercase letters, numbers, and hyphens');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Konvertiert Legacy-Artikel-Daten zum neuen Format
   */
  static convertLegacyArticle(legacyData: any): Partial<Article> {
    const cleanTitle = DataHelpers.cleanTitle(legacyData.title || '');
    const cleanContent = DataHelpers.cleanContent(legacyData.content || legacyData.text_content || '');
    const slug = URLManager.generateSlug(cleanTitle);

    return {
      id: legacyData.id?.toString() || slug,
      slug,
      title: cleanTitle,
      excerpt: DataHelpers.generateExcerpt(cleanContent),
      content: cleanContent,
      url: legacyData.url || legacyData.relative_url || '',
      images: (legacyData.images || legacyData.local_image_paths || []).map((src: string) => ({
        src,
        alt: cleanTitle
      })),
      metadata: DataHelpers.generateMetadata(cleanContent, legacyData.tags || [])
    };
  }

  /**
   * Sortiert Artikel nach verschiedenen Kriterien
   */
  static sortArticles(articles: Article[], sortBy: 'date' | 'title' | 'readingTime' | 'wordCount' = 'date'): Article[] {
    return [...articles].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title, 'de');
        case 'readingTime':
          return b.metadata.readingTime - a.metadata.readingTime;
        case 'wordCount':
          return b.metadata.wordCount - a.metadata.wordCount;
        case 'date':
        default:
          return b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime();
      }
    });
  }

  /**
   * Gruppiert Artikel nach Kategorie
   */
  static groupArticlesByCategory(articles: Article[]): Record<string, Article[]> {
    return articles.reduce((groups, article) => {
      const categoryId = article.category.id;
      if (!groups[categoryId]) {
        groups[categoryId] = [];
      }
      groups[categoryId].push(article);
      return groups;
    }, {} as Record<string, Article[]>);
  }

  /**
   * Findet ähnliche Artikel basierend auf Tags und Kategorie
   */
  static findSimilarArticles(targetArticle: Article, allArticles: Article[], limit = 5): Article[] {
    const similarities = allArticles
      .filter(article => article.id !== targetArticle.id)
      .map(article => {
        let score = 0;

        // Gleiche Kategorie
        if (article.category.id === targetArticle.category.id) {
          score += 3;
        }

        // Gemeinsame Tags
        const commonTags = targetArticle.metadata.tags.filter(tag =>
          article.metadata.tags.includes(tag)
        );
        score += commonTags.length * 2;

        // Gleicher Autor
        if (article.author.id === targetArticle.author.id) {
          score += 1;
        }

        return { article, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return similarities.map(item => item.article);
  }

  /**
   * Erstellt eine Statistik über alle Artikel
   */
  static generateArticleStats(articles: Article[]): {
    totalArticles: number;
    totalWords: number;
    totalReadingTime: number;
    averageWordsPerArticle: number;
    averageReadingTime: number;
    categoryCounts: Record<string, number>;
    authorCounts: Record<string, number>;
    tagCounts: Record<string, number>;
  } {
    const totalWords = articles.reduce((sum, article) => sum + article.metadata.wordCount, 0);
    const totalReadingTime = articles.reduce((sum, article) => sum + article.metadata.readingTime, 0);

    const categoryCounts: Record<string, number> = {};
    const authorCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};

    articles.forEach(article => {
      // Kategorie-Zählung
      categoryCounts[article.category.id] = (categoryCounts[article.category.id] || 0) + 1;
      
      // Autor-Zählung
      authorCounts[article.author.id] = (authorCounts[article.author.id] || 0) + 1;
      
      // Tag-Zählung
      article.metadata.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      totalArticles: articles.length,
      totalWords,
      totalReadingTime,
      averageWordsPerArticle: Math.round(totalWords / articles.length),
      averageReadingTime: Math.round(totalReadingTime / articles.length),
      categoryCounts,
      authorCounts,
      tagCounts
    };
  }
}

export default DataHelpers;

