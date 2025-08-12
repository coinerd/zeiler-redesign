/**
 * URL-Verwaltung für das Zeiler-Redesign Projekt
 * Bietet konsistente URL-Generierung und -Parsing
 */

import type { Article, Category, SlugGenerator } from '../types/Article';

export class URLManager {
  /**
   * Generiert einen URL-freundlichen Slug aus einem Titel
   */
  static generateSlug: SlugGenerator = (title: string): string => {
    return title
      .toLowerCase()
      // Entferne deutsche Umlaute
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      // Entferne Sonderzeichen außer Bindestrichen und Leerzeichen
      .replace(/[^a-z0-9\s-]/g, '')
      // Ersetze Leerzeichen durch Bindestriche
      .replace(/\s+/g, '-')
      // Entferne mehrfache Bindestriche
      .replace(/-+/g, '-')
      // Entferne Bindestriche am Anfang und Ende
      .replace(/^-+|-+$/g, '')
      .trim();
  };

  /**
   * Erstellt die vollständige URL für einen Artikel
   */
  static buildArticleURL(article: Article): string {
    const categoryPath = article.category.path.join('/');
    return `/${categoryPath}/${article.slug}`;
  }

  /**
   * Erstellt die URL für eine Kategorie
   */
  static buildCategoryURL(category: Category): string {
    return `/category/${category.id}`;
  }

  /**
   * Parst eine Artikel-URL und extrahiert Kategorie-Pfad und Slug
   */
  static parseArticleURL(url: string): { categoryPath: string[], slug: string } {
    // Entferne führende und nachfolgende Slashes
    const cleanUrl = url.replace(/^\/+|\/+$/g, '');
    const parts = cleanUrl.split('/').filter(Boolean);
    
    if (parts.length === 0) {
      return { categoryPath: [], slug: '' };
    }
    
    const slug = parts.pop() || '';
    return { categoryPath: parts, slug };
  }

  /**
   * Parst eine Kategorie-URL
   */
  static parseCategoryURL(url: string): string {
    const match = url.match(/\/category\/([^\/]+)/);
    return match ? match[1] : '';
  }

  /**
   * Normalisiert eine URL für konsistente Verarbeitung
   */
  static normalizeURL(url: string): string {
    return url
      .replace(/\/+/g, '/') // Mehrfache Slashes entfernen
      .replace(/\/$/, '') // Trailing Slash entfernen
      .replace(/^\//, ''); // Leading Slash entfernen
  }

  /**
   * Konvertiert Hash-basierte URLs zu React Router Pfaden
   */
  static hashToRouterPath(hashUrl: string): string {
    return hashUrl.replace(/^#?\/?/, '/');
  }

  /**
   * Konvertiert React Router Pfade zu Hash-URLs (für Rückwärtskompatibilität)
   */
  static routerPathToHash(routerPath: string): string {
    return `#${routerPath.startsWith('/') ? routerPath : '/' + routerPath}`;
  }

  /**
   * Validiert ob eine URL ein gültiger Artikel-Pfad ist
   */
  static isValidArticlePath(url: string): boolean {
    const { categoryPath, slug } = this.parseArticleURL(url);
    return categoryPath.length > 0 && slug.length > 0;
  }

  /**
   * Validiert ob eine URL ein gültiger Kategorie-Pfad ist
   */
  static isValidCategoryPath(url: string): boolean {
    return /^\/category\/[a-z0-9-]+$/.test(url);
  }

  /**
   * Erstellt eine Breadcrumb-Struktur aus einer URL
   */
  static buildBreadcrumbs(url: string, categories: Record<string, Category>): Array<{ name: string, href: string }> {
    const breadcrumbs: Array<{ name: string, href: string }> = [
      { name: 'Startseite', href: '/' }
    ];

    if (this.isValidCategoryPath(url)) {
      const categoryId = this.parseCategoryURL(url);
      const category = categories[categoryId];
      if (category) {
        breadcrumbs.push({
          name: category.name,
          href: this.buildCategoryURL(category)
        });
      }
    } else if (this.isValidArticlePath(url)) {
      const { categoryPath } = this.parseArticleURL(url);
      
      // Füge Kategorie-Breadcrumbs hinzu
      categoryPath.forEach((categoryId, index) => {
        const category = categories[categoryId];
        if (category) {
          breadcrumbs.push({
            name: category.name,
            href: this.buildCategoryURL(category)
          });
        }
      });
    }

    return breadcrumbs;
  }

  /**
   * Generiert eine SEO-freundliche URL mit optionalen Parametern
   */
  static buildSEOURL(baseUrl: string, params?: Record<string, string>): string {
    let url = baseUrl;
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  /**
   * Extrahiert Parameter aus einer URL
   */
  static extractURLParams(url: string): Record<string, string> {
    const urlObj = new URL(url, 'http://localhost');
    const params: Record<string, string> = {};
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  }

  /**
   * Erstellt eine kanonische URL für SEO
   */
  static buildCanonicalURL(baseUrl: string, path: string): string {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    return `${cleanBase}/${cleanPath}`;
  }
}

// Hilfsfunktionen für spezielle URL-Operationen
export const URLHelpers = {
  /**
   * Prüft ob zwei URLs semantisch gleich sind
   */
  areURLsEqual(url1: string, url2: string): boolean {
    const normalized1 = URLManager.normalizeURL(url1);
    const normalized2 = URLManager.normalizeURL(url2);
    return normalized1 === normalized2;
  },

  /**
   * Erstellt eine relative URL aus einer absoluten
   */
  makeRelative(absoluteUrl: string, baseUrl: string): string {
    if (absoluteUrl.startsWith(baseUrl)) {
      return absoluteUrl.substring(baseUrl.length);
    }
    return absoluteUrl;
  },

  /**
   * Erstellt eine absolute URL aus einer relativen
   */
  makeAbsolute(relativeUrl: string, baseUrl: string): string {
    if (relativeUrl.startsWith('http')) {
      return relativeUrl;
    }
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const cleanRelative = relativeUrl.replace(/^\/+/, '');
    return `${cleanBase}/${cleanRelative}`;
  }
};

export default URLManager;

