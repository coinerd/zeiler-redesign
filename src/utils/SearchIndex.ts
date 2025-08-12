/**
 * Optimierte Suchfunktionalität mit Indexierung für das Zeiler-Redesign Projekt
 * Bietet schnelle und relevante Suchergebnisse
 */

import type { 
  Article, 
  SearchResult, 
  SearchQuery, 
  SearchResponse, 
  SearchField 
} from '../types/Article';

interface IndexEntry {
  articleId: string;
  field: SearchField;
  position: number;
  weight: number;
}

interface SearchTerm {
  term: string;
  weight: number;
  field?: SearchField;
}

export class ArticleSearchIndex {
  private titleIndex = new Map<string, Set<string>>();
  private contentIndex = new Map<string, Set<string>>();
  private excerptIndex = new Map<string, Set<string>>();
  private tagIndex = new Map<string, Set<string>>();
  private authorIndex = new Map<string, Set<string>>();
  private categoryIndex = new Map<string, Set<string>>();
  
  private articles = new Map<string, Article>();
  private isBuilt = false;

  // Gewichtungen für verschiedene Felder
  private readonly fieldWeights = {
    [SearchField.TITLE]: 5,
    [SearchField.EXCERPT]: 3,
    [SearchField.TAGS]: 4,
    [SearchField.AUTHOR]: 2,
    [SearchField.CATEGORY]: 2,
    [SearchField.CONTENT]: 1
  };

  // Deutsche Stoppwörter
  private readonly stopWords = new Set([
    'der', 'die', 'das', 'und', 'oder', 'aber', 'in', 'auf', 'für', 'mit', 
    'von', 'zu', 'an', 'bei', 'nach', 'vor', 'über', 'unter', 'durch',
    'ist', 'sind', 'war', 'waren', 'hat', 'haben', 'wird', 'werden',
    'ein', 'eine', 'einer', 'eines', 'dem', 'den', 'des', 'sich', 'nicht',
    'auch', 'nur', 'noch', 'wie', 'was', 'wenn', 'dann', 'so', 'als'
  ]);

  /**
   * Baut den Suchindex aus einer Liste von Artikeln auf
   */
  buildIndex(articles: Article[]): void {
    console.log(`Building search index for ${articles.length} articles...`);
    const startTime = performance.now();

    // Lösche bestehende Indizes
    this.clearIndex();

    // Speichere Artikel für späteren Zugriff
    articles.forEach(article => {
      this.articles.set(article.id, article);
    });

    // Baue Indizes für jedes Feld
    articles.forEach(article => {
      this.indexText(article.title, article.id, this.titleIndex, SearchField.TITLE);
      this.indexText(article.excerpt, article.id, this.excerptIndex, SearchField.EXCERPT);
      this.indexText(article.content, article.id, this.contentIndex, SearchField.CONTENT);
      this.indexText(article.author.name, article.id, this.authorIndex, SearchField.AUTHOR);
      this.indexText(article.category.name, article.id, this.categoryIndex, SearchField.CATEGORY);
      
      // Indexiere Tags
      article.metadata.tags.forEach(tag => {
        this.addToIndex(tag.toLowerCase(), article.id, this.tagIndex);
      });
    });

    this.isBuilt = true;
    const endTime = performance.now();
    console.log(`Search index built in ${(endTime - startTime).toFixed(2)}ms`);
  }

  /**
   * Führt eine Suche durch und gibt gewichtete Ergebnisse zurück
   */
  search(query: SearchQuery): SearchResponse {
    const startTime = performance.now();

    if (!this.isBuilt) {
      throw new Error('Search index not built. Call buildIndex() first.');
    }

    if (!query.query || query.query.trim().length === 0) {
      return {
        results: [],
        total: 0,
        query,
        executionTime: 0
      };
    }

    const searchTerms = this.tokenizeQuery(query.query);
    const results = new Map<string, SearchResult>();

    // Suche in verschiedenen Feldern
    searchTerms.forEach(searchTerm => {
      this.searchInField(searchTerm, this.titleIndex, SearchField.TITLE, results);
      this.searchInField(searchTerm, this.excerptIndex, SearchField.EXCERPT, results);
      this.searchInField(searchTerm, this.contentIndex, SearchField.CONTENT, results);
      this.searchInField(searchTerm, this.tagIndex, SearchField.TAGS, results);
      this.searchInField(searchTerm, this.authorIndex, SearchField.AUTHOR, results);
      this.searchInField(searchTerm, this.categoryIndex, SearchField.CATEGORY, results);
    });

    // Filtere nach Kategorie, Autor, etc.
    let filteredResults = Array.from(results.values());
    
    if (query.category) {
      filteredResults = filteredResults.filter(result => 
        result.article.category.id === query.category
      );
    }

    if (query.author) {
      filteredResults = filteredResults.filter(result => 
        result.article.author.id === query.author
      );
    }

    if (query.tags && query.tags.length > 0) {
      filteredResults = filteredResults.filter(result =>
        query.tags!.some(tag => 
          result.article.metadata.tags.includes(tag)
        )
      );
    }

    // Sortiere nach Relevanz
    filteredResults.sort((a, b) => b.score - a.score);

    // Paginierung
    const offset = query.offset || 0;
    const limit = query.limit || 20;
    const paginatedResults = filteredResults.slice(offset, offset + limit);

    const endTime = performance.now();

    return {
      results: paginatedResults,
      total: filteredResults.length,
      query,
      executionTime: endTime - startTime
    };
  }

  /**
   * Sucht nach ähnlichen Artikeln basierend auf Tags und Kategorie
   */
  findSimilarArticles(article: Article, limit = 5): Article[] {
    const similarArticles: Array<{ article: Article, score: number }> = [];

    this.articles.forEach(otherArticle => {
      if (otherArticle.id === article.id) return;

      let score = 0;

      // Gleiche Kategorie
      if (otherArticle.category.id === article.category.id) {
        score += 3;
      }

      // Gemeinsame Tags
      const commonTags = article.metadata.tags.filter(tag =>
        otherArticle.metadata.tags.includes(tag)
      );
      score += commonTags.length * 2;

      // Gleicher Autor
      if (otherArticle.author.id === article.author.id) {
        score += 1;
      }

      if (score > 0) {
        similarArticles.push({ article: otherArticle, score });
      }
    });

    return similarArticles
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.article);
  }

  /**
   * Gibt Suchvorschläge basierend auf einer partiellen Eingabe zurück
   */
  getSuggestions(partialQuery: string, limit = 5): string[] {
    const suggestions = new Set<string>();
    const lowerQuery = partialQuery.toLowerCase();

    // Suche in Titeln
    this.titleIndex.forEach((articleIds, term) => {
      if (term.startsWith(lowerQuery) && suggestions.size < limit) {
        suggestions.add(term);
      }
    });

    // Suche in Tags
    this.tagIndex.forEach((articleIds, term) => {
      if (term.startsWith(lowerQuery) && suggestions.size < limit) {
        suggestions.add(term);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Tokenisiert eine Suchanfrage in einzelne Begriffe
   */
  private tokenizeQuery(query: string): SearchTerm[] {
    const terms = query
      .toLowerCase()
      .replace(/[^\w\säöüß-]/g, ' ') // Entferne Sonderzeichen außer deutschen Umlauten
      .split(/\s+/)
      .filter(term => term.length > 2 && !this.stopWords.has(term))
      .map(term => ({ term, weight: 1 }));

    return terms;
  }

  /**
   * Indexiert Text für ein bestimmtes Feld
   */
  private indexText(text: string, articleId: string, index: Map<string, Set<string>>, field: SearchField): void {
    const terms = this.tokenizeText(text);
    terms.forEach(term => {
      this.addToIndex(term, articleId, index);
    });
  }

  /**
   * Tokenisiert Text in einzelne Begriffe
   */
  private tokenizeText(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\säöüß-]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2 && !this.stopWords.has(term));
  }

  /**
   * Fügt einen Begriff zum Index hinzu
   */
  private addToIndex(term: string, articleId: string, index: Map<string, Set<string>>): void {
    if (!index.has(term)) {
      index.set(term, new Set());
    }
    index.get(term)!.add(articleId);
  }

  /**
   * Sucht in einem bestimmten Feld
   */
  private searchInField(
    searchTerm: SearchTerm, 
    index: Map<string, Set<string>>, 
    field: SearchField, 
    results: Map<string, SearchResult>
  ): void {
    const weight = this.fieldWeights[field] * searchTerm.weight;

    // Exakte Übereinstimmung
    if (index.has(searchTerm.term)) {
      index.get(searchTerm.term)!.forEach(articleId => {
        this.addSearchResult(articleId, weight, field, results);
      });
    }

    // Fuzzy-Suche (beginnt mit)
    index.forEach((articleIds, indexTerm) => {
      if (indexTerm.startsWith(searchTerm.term) && indexTerm !== searchTerm.term) {
        articleIds.forEach(articleId => {
          this.addSearchResult(articleId, weight * 0.7, field, results);
        });
      }
    });

    // Fuzzy-Suche (enthält)
    index.forEach((articleIds, indexTerm) => {
      if (indexTerm.includes(searchTerm.term) && !indexTerm.startsWith(searchTerm.term)) {
        articleIds.forEach(articleId => {
          this.addSearchResult(articleId, weight * 0.5, field, results);
        });
      }
    });
  }

  /**
   * Fügt ein Suchergebnis hinzu oder aktualisiert die Bewertung
   */
  private addSearchResult(
    articleId: string, 
    score: number, 
    field: SearchField, 
    results: Map<string, SearchResult>
  ): void {
    const article = this.articles.get(articleId);
    if (!article) return;

    if (results.has(articleId)) {
      const existing = results.get(articleId)!;
      existing.score += score;
      if (!existing.matchedFields.includes(field)) {
        existing.matchedFields.push(field);
      }
    } else {
      results.set(articleId, {
        article,
        score,
        matchedFields: [field],
        highlights: [] // TODO: Implementiere Highlighting
      });
    }
  }

  /**
   * Löscht alle Indizes
   */
  private clearIndex(): void {
    this.titleIndex.clear();
    this.contentIndex.clear();
    this.excerptIndex.clear();
    this.tagIndex.clear();
    this.authorIndex.clear();
    this.categoryIndex.clear();
    this.articles.clear();
    this.isBuilt = false;
  }

  /**
   * Gibt Statistiken über den Index zurück
   */
  getIndexStats(): {
    articleCount: number;
    titleTerms: number;
    contentTerms: number;
    excerptTerms: number;
    tagTerms: number;
    authorTerms: number;
    categoryTerms: number;
  } {
    return {
      articleCount: this.articles.size,
      titleTerms: this.titleIndex.size,
      contentTerms: this.contentIndex.size,
      excerptTerms: this.excerptIndex.size,
      tagTerms: this.tagIndex.size,
      authorTerms: this.authorIndex.size,
      categoryTerms: this.categoryIndex.size
    };
  }
}

export default ArticleSearchIndex;

