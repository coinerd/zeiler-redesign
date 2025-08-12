/**
 * TypeScript-Definitionen für das Zeiler-Redesign Projekt
 * Definiert alle Datenstrukturen für Artikel, Kategorien und Suche
 */

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parent?: string;
  children: string[];
  articleCount: number;
  path: string[];
}

export interface ArticleImage {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ArticleMetadata {
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  readingTime: number; // in Minuten
  wordCount: number;
  language: string;
}

export interface ArticleSEO {
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
}

export interface Article {
  id: string;
  slug: string; // URL-freundlicher Identifier
  title: string; // Bereinigter Titel
  excerpt: string; // Sinnvolle Zusammenfassung
  content: string; // Bereinigter Inhalt
  author: Author;
  category: Category;
  metadata: ArticleMetadata;
  images: ArticleImage[];
  seo: ArticleSEO;
  url: string; // Vollständige URL zum Artikel
}

export interface SearchResult {
  article: Article;
  score: number;
  matchedFields: string[];
  highlights: string[];
}

export interface SearchQuery {
  query: string;
  category?: string;
  author?: string;
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: SearchQuery;
  executionTime: number;
}

// Utility Types für bessere Typsicherheit
export type ArticleId = string;
export type CategoryId = string;
export type AuthorId = string;

// Enums für bessere Typsicherheit
export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum SearchField {
  TITLE = 'title',
  CONTENT = 'content',
  EXCERPT = 'excerpt',
  TAGS = 'tags',
  AUTHOR = 'author',
  CATEGORY = 'category'
}

// Erweiterte Artikel-Schnittstelle für zukünftige Features
export interface ExtendedArticle extends Article {
  status: ArticleStatus;
  featured: boolean;
  relatedArticles: ArticleId[];
  comments?: Comment[];
  views?: number;
  likes?: number;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  parentId?: string;
}

// Type Guards für Runtime-Validierung
export function isArticle(obj: any): obj is Article {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.author === 'object' &&
    typeof obj.category === 'object' &&
    typeof obj.metadata === 'object' &&
    Array.isArray(obj.images)
  );
}

export function isCategory(obj: any): obj is Category {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.icon === 'string' &&
    typeof obj.color === 'string' &&
    Array.isArray(obj.children) &&
    Array.isArray(obj.path) &&
    typeof obj.articleCount === 'number'
  );
}

// Hilfsfunktionen für Datenmanipulation
export type ArticleFilter = (article: Article) => boolean;
export type ArticleSorter = (a: Article, b: Article) => number;

export interface ArticleQuery {
  filter?: ArticleFilter;
  sort?: ArticleSorter;
  limit?: number;
  offset?: number;
}

// Konstanten für bessere Wartbarkeit
export const DEFAULT_READING_SPEED = 200; // Wörter pro Minute
export const DEFAULT_EXCERPT_LENGTH = 200; // Zeichen
export const DEFAULT_SEARCH_LIMIT = 20;

// Utility-Funktionen als Typen
export type SlugGenerator = (title: string) => string;
export type ReadingTimeCalculator = (content: string) => number;
export type ExcerptGenerator = (content: string, length?: number) => string;

