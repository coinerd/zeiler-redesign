import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ArticleCard from './ArticleCard';
import { searchArticles, categories, authors } from '../data/articles';
import { Search, Filter, X, Clock, User, Tag, ArrowLeft } from 'lucide-react';
import type { Article, Category, Author } from '../types/Article';

interface SearchFilters {
  category?: string;
  author?: string;
  tags?: string[];
  minReadingTime?: number;
  maxReadingTime?: number;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Memoized filter options
  const filterOptions = useMemo(() => {
    const allTags = new Set<string>();
    Object.values(searchArticles('')).forEach(article => {
      article.metadata.tags.forEach(tag => allTags.add(tag));
    });

    return {
      categories: Object.values(categories).filter(cat => cat.articleCount > 0),
      authors: Object.values(authors),
      tags: Array.from(allTags).sort(),
      readingTimes: [
        { label: '< 5 Min', min: 0, max: 5 },
        { label: '5-10 Min', min: 5, max: 10 },
        { label: '10-20 Min', min: 10, max: 20 },
        { label: '> 20 Min', min: 20, max: Infinity }
      ]
    };
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
    
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setResults([]);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    
    try {
      // Simuliere eine kleine Verzögerung für bessere UX
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let searchResults = searchArticles(searchQuery);
      
      // Anwenden der Filter
      if (filters.category) {
        searchResults = searchResults.filter(article => 
          article.category.id === filters.category
        );
      }
      
      if (filters.author) {
        searchResults = searchResults.filter(article => 
          article.author.id === filters.author
        );
      }
      
      if (filters.tags && filters.tags.length > 0) {
        searchResults = searchResults.filter(article =>
          filters.tags!.some(tag => article.metadata.tags.includes(tag))
        );
      }
      
      if (filters.minReadingTime !== undefined || filters.maxReadingTime !== undefined) {
        searchResults = searchResults.filter(article => {
          const readingTime = article.metadata.readingTime;
          const min = filters.minReadingTime ?? 0;
          const max = filters.maxReadingTime ?? Infinity;
          return readingTime >= min && readingTime <= max;
        });
      }
      
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    if (query.trim()) {
      performSearch(query);
    }
  };

  const clearFilters = () => {
    setFilters({});
    if (query.trim()) {
      performSearch(query);
    }
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && value !== null && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="mb-4 inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Zurück</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">Suche</h1>
          
          {/* Suchformular */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Artikel durchsuchen..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Suchen
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 border rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter size={20} />
              </button>
            </div>
          </form>

          {/* Filter-Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filter</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <X size={14} />
                    <span>Filter zurücksetzen</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Kategorie-Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategorie
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Alle Kategorien</option>
                    {filterOptions.categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.articleCount})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Autor-Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor
                  </label>
                  <select
                    value={filters.author || ''}
                    onChange={(e) => handleFilterChange({ author: e.target.value || undefined })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Alle Autoren</option>
                    {filterOptions.authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lesezeit-Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesezeit
                  </label>
                  <select
                    value={`${filters.minReadingTime || 0}-${filters.maxReadingTime || Infinity}`}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-').map(v => 
                        v === 'Infinity' ? Infinity : parseInt(v)
                      );
                      handleFilterChange({ 
                        minReadingTime: min === 0 ? undefined : min,
                        maxReadingTime: max === Infinity ? undefined : max
                      });
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0-Infinity">Alle Lesezeiten</option>
                    {filterOptions.readingTimes.map((time, index) => (
                      <option key={index} value={`${time.min}-${time.max}`}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags-Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <select
                    multiple
                    value={filters.tags || []}
                    onChange={(e) => {
                      const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
                      handleFilterChange({ tags: selectedTags.length > 0 ? selectedTags : undefined });
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    size={4}
                  >
                    {filterOptions.tags.slice(0, 20).map(tag => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Strg/Cmd + Klick für Mehrfachauswahl
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aktive Filter anzeigen */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Kategorie: {categories[filters.category]?.name}
                  <button
                    onClick={() => handleFilterChange({ category: undefined })}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {filters.author && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Autor: {authors[filters.author]?.name}
                  <button
                    onClick={() => handleFilterChange({ author: undefined })}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {filters.tags && filters.tags.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  Tags: {filters.tags.join(', ')}
                  <button
                    onClick={() => handleFilterChange({ tags: undefined })}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Suchergebnisse */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Suche läuft...</p>
          </div>
        ) : query.trim() ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {results.length > 0 
                  ? `${results.length} Ergebnis${results.length !== 1 ? 'se' : ''} für "${query}"`
                  : `Keine Ergebnisse für "${query}"`
                }
              </h2>
              {hasActiveFilters && (
                <p className="text-sm text-gray-600 mt-1">
                  Mit aktiven Filtern
                </p>
              )}
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article}
                    showCategory={true}
                    highlightQuery={query}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Keine Artikel gefunden
                </h3>
                <p className="text-gray-600 mb-4">
                  Versuchen Sie es mit anderen Suchbegriffen oder passen Sie die Filter an.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Filter zurücksetzen
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Artikel durchsuchen
            </h3>
            <p className="text-gray-600">
              Geben Sie einen Suchbegriff ein, um relevante Artikel zu finden.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;

