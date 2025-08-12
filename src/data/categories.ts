/**
 * Strukturierte Kategorie-Verwaltung für das Zeiler-Redesign Projekt
 * Definiert alle Kategorien mit Metadaten und Hierarchien
 */

import type { Category, Author } from '../types/Article';

// Autor-Definitionen
export const authors: Record<string, Author> = {
  'detlef': {
    id: 'detlef',
    name: 'Detlef Zeiler',
    bio: 'Medienpädagoge, Journalist und Lehrer mit Schwerpunkt auf Geschichte, Medien und Deutsch.',
    avatar: '/images/authors/detlef-zeiler.jpg'
  },
  'julian': {
    id: 'julian',
    name: 'Julian Zeiler',
    bio: 'IT-Experte und Entwickler mit Fokus auf moderne Webtechnologien und Programmierung.',
    avatar: '/images/authors/julian-zeiler.jpg'
  },
  'zeiler': {
    id: 'zeiler',
    name: 'ZEILER.me',
    bio: 'Gemeinsame Artikel und Projekte der Familie Zeiler.',
    avatar: '/images/authors/zeiler-logo.jpg'
  }
};

// Kategorie-Definitionen mit vollständigen Metadaten
export const categories: Record<string, Category> = {
  // Hauptkategorien (Autoren)
  'detlef': {
    id: 'detlef',
    name: 'Detlef Zeiler',
    description: 'Artikel und Projekte von Detlef Zeiler zu Geschichte, Medien und Deutsch',
    icon: 'User',
    color: 'blue',
    children: ['medien', 'geschichte', 'deutsch', 'projekte'],
    articleCount: 159,
    path: ['detlef']
  },
  
  'julian': {
    id: 'julian',
    name: 'Julian Zeiler',
    description: 'IT-Artikel und technische Projekte von Julian Zeiler',
    icon: 'Code',
    color: 'green',
    children: ['techzap', 'artikel'],
    articleCount: 25,
    path: ['julian']
  },

  // Detlef's Unterkategorien
  'medien': {
    id: 'medien',
    name: 'Medien',
    description: 'Medienerziehung, Medienkompetenz und Medienkultur',
    icon: 'Monitor',
    color: 'purple',
    parent: 'detlef',
    children: ['medienerziehung'],
    articleCount: 15,
    path: ['detlef', 'medien']
  },

  'medienerziehung': {
    id: 'medienerziehung',
    name: 'Medienerziehung',
    description: 'Artikel zur Medienerziehung und Medienkompetenz',
    icon: 'BookOpen',
    color: 'purple',
    parent: 'medien',
    children: [],
    articleCount: 12,
    path: ['detlef', 'medien', 'medienerziehung']
  },

  'geschichte': {
    id: 'geschichte',
    name: 'Geschichte',
    description: 'Historische Artikel und Forschungsprojekte',
    icon: 'Clock',
    color: 'amber',
    parent: 'detlef',
    children: [],
    articleCount: 35,
    path: ['detlef', 'geschichte']
  },

  'deutsch': {
    id: 'deutsch',
    name: 'Deutsch',
    description: 'Textinterpretationen, Erörterungen und literarische Analysen',
    icon: 'FileText',
    color: 'red',
    parent: 'detlef',
    children: ['textinterpretation', 'eroerterung'],
    articleCount: 28,
    path: ['detlef', 'deutsch']
  },

  'textinterpretation': {
    id: 'textinterpretation',
    name: 'Textinterpretation',
    description: 'Interpretationen literarischer Texte und Beispiele',
    icon: 'Search',
    color: 'red',
    parent: 'deutsch',
    children: [],
    articleCount: 15,
    path: ['detlef', 'deutsch', 'textinterpretation']
  },

  'eroerterung': {
    id: 'eroerterung',
    name: 'Erörterung',
    description: 'Essays und Erörterungen zu verschiedenen Themen',
    icon: 'Edit',
    color: 'red',
    parent: 'deutsch',
    children: [],
    articleCount: 8,
    path: ['detlef', 'deutsch', 'eroerterung']
  },

  'projekte': {
    id: 'projekte',
    name: 'Projekte',
    description: 'Umfangreiche Forschungs- und Dokumentationsprojekte',
    icon: 'FolderOpen',
    color: 'indigo',
    parent: 'detlef',
    children: ['heidelberg', 'kraichgau', 'neuenheim', 'providence'],
    articleCount: 65,
    path: ['detlef', 'projekte']
  },

  'heidelberg': {
    id: 'heidelberg',
    name: 'Heidelberg im Mittelalter',
    description: 'Umfassendes Projekt zur Geschichte Heidelbergs im Mittelalter',
    icon: 'Castle',
    color: 'indigo',
    parent: 'projekte',
    children: [],
    articleCount: 25,
    path: ['detlef', 'projekte', 'heidelberg']
  },

  'kraichgau': {
    id: 'kraichgau',
    name: 'Die Elsenz und der Kraichgau',
    description: 'Geographische und historische Erkundung des Kraichgaus',
    icon: 'Map',
    color: 'indigo',
    parent: 'projekte',
    children: [],
    articleCount: 12,
    path: ['detlef', 'projekte', 'kraichgau']
  },

  'neuenheim': {
    id: 'neuenheim',
    name: 'Neuenheim',
    description: 'Geschichte und Entwicklung des Heidelberger Stadtteils Neuenheim',
    icon: 'Home',
    color: 'indigo',
    parent: 'projekte',
    children: [],
    articleCount: 8,
    path: ['detlef', 'projekte', 'neuenheim']
  },

  'providence': {
    id: 'providence',
    name: 'Old Providence',
    description: 'Die Geschichte der Insel Providencia',
    icon: 'Anchor',
    color: 'indigo',
    parent: 'projekte',
    children: [],
    articleCount: 10,
    path: ['detlef', 'projekte', 'providence']
  },

  // Julian's Unterkategorien
  'techzap': {
    id: 'techzap',
    name: 'TechZap',
    description: 'Technische Artikel zu Programmierung, Server und Design',
    icon: 'Zap',
    color: 'green',
    parent: 'julian',
    children: ['programmierung', 'server', 'design'],
    articleCount: 20,
    path: ['julian', 'techzap']
  },

  'programmierung': {
    id: 'programmierung',
    name: 'Programmierung',
    description: 'Artikel zu verschiedenen Programmiersprachen und -techniken',
    icon: 'Code2',
    color: 'green',
    parent: 'techzap',
    children: [],
    articleCount: 8,
    path: ['julian', 'techzap', 'programmierung']
  },

  'server': {
    id: 'server',
    name: 'Server',
    description: 'Server-Administration, Unix/Linux und Systemkonfiguration',
    icon: 'Server',
    color: 'green',
    parent: 'techzap',
    children: [],
    articleCount: 6,
    path: ['julian', 'techzap', 'server']
  },

  'design': {
    id: 'design',
    name: 'Design',
    description: 'Webdesign, Grafik und Benutzeroberflächen',
    icon: 'Palette',
    color: 'green',
    parent: 'techzap',
    children: [],
    articleCount: 4,
    path: ['julian', 'techzap', 'design']
  },

  'artikel': {
    id: 'artikel',
    name: 'Artikel',
    description: 'Allgemeine Artikel von Julian Zeiler',
    icon: 'FileText',
    color: 'green',
    parent: 'julian',
    children: [],
    articleCount: 5,
    path: ['julian', 'artikel']
  },

  // Sonstige Kategorien
  'andere': {
    id: 'andere',
    name: 'Andere',
    description: 'Verschiedene Artikel und Inhalte',
    icon: 'MoreHorizontal',
    color: 'gray',
    children: [],
    articleCount: 6,
    path: ['andere']
  },

  'impressum': {
    id: 'impressum',
    name: 'Impressum',
    description: 'Rechtliche Informationen und Kontaktdaten',
    icon: 'Info',
    color: 'gray',
    children: [],
    articleCount: 1,
    path: ['impressum']
  },

  'contact': {
    id: 'contact',
    name: 'Kontakt',
    description: 'Kontaktinformationen und Anfragen',
    icon: 'Mail',
    color: 'gray',
    children: [],
    articleCount: 1,
    path: ['contact']
  }
};

// Hilfsfunktionen für Kategorie-Verwaltung
export class CategoryManager {
  /**
   * Gibt alle Hauptkategorien zurück (ohne Parent)
   */
  static getRootCategories(): Category[] {
    return Object.values(categories).filter(cat => !cat.parent);
  }

  /**
   * Gibt alle Unterkategorien einer Kategorie zurück
   */
  static getChildCategories(categoryId: string): Category[] {
    const category = categories[categoryId];
    if (!category) return [];
    
    return category.children.map(childId => categories[childId]).filter(Boolean);
  }

  /**
   * Gibt den vollständigen Pfad einer Kategorie zurück
   */
  static getCategoryPath(categoryId: string): Category[] {
    const category = categories[categoryId];
    if (!category) return [];

    const path: Category[] = [];
    let current = category;

    while (current) {
      path.unshift(current);
      current = current.parent ? categories[current.parent] : undefined;
    }

    return path;
  }

  /**
   * Sucht Kategorien nach Name oder Beschreibung
   */
  static searchCategories(query: string): Category[] {
    const lowerQuery = query.toLowerCase();
    return Object.values(categories).filter(category =>
      category.name.toLowerCase().includes(lowerQuery) ||
      category.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Gibt alle Kategorien einer bestimmten Ebene zurück
   */
  static getCategoriesByLevel(level: number): Category[] {
    return Object.values(categories).filter(category =>
      category.path.length === level
    );
  }

  /**
   * Aktualisiert die Artikel-Anzahl einer Kategorie
   */
  static updateArticleCount(categoryId: string, count: number): void {
    if (categories[categoryId]) {
      categories[categoryId].articleCount = count;
    }
  }

  /**
   * Gibt die Gesamtanzahl der Artikel zurück
   */
  static getTotalArticleCount(): number {
    return Object.values(categories).reduce((total, category) => {
      // Nur Kategorien ohne Kinder zählen (Blatt-Kategorien)
      if (category.children.length === 0) {
        return total + category.articleCount;
      }
      return total;
    }, 0);
  }

  /**
   * Validiert die Kategorie-Hierarchie
   */
  static validateHierarchy(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    Object.values(categories).forEach(category => {
      // Prüfe Parent-Referenzen
      if (category.parent && !categories[category.parent]) {
        errors.push(`Category ${category.id} references non-existent parent ${category.parent}`);
      }

      // Prüfe Child-Referenzen
      category.children.forEach(childId => {
        if (!categories[childId]) {
          errors.push(`Category ${category.id} references non-existent child ${childId}`);
        } else if (categories[childId].parent !== category.id) {
          errors.push(`Category ${childId} parent mismatch with ${category.id}`);
        }
      });

      // Prüfe Pfad-Konsistenz
      const expectedPath = CategoryManager.getCategoryPath(category.id).map(c => c.id);
      if (JSON.stringify(expectedPath) !== JSON.stringify(category.path)) {
        errors.push(`Category ${category.id} has inconsistent path`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Exportiere auch als Default für einfacheren Import
export default {
  categories,
  authors,
  CategoryManager
};

