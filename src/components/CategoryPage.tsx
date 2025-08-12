import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import ArticleCard from './ArticleCard';
import { getArticlesByCategory, categories } from '../data/articles';
import { ArrowLeft, User, Code, History, BookOpen, Users, FolderOpen, Monitor, FileText, Zap, MoreHorizontal } from 'lucide-react';
import type { Article, Category } from '../types/Article';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface CategoryInfo {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  articleCount: number;
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [categoryArticles, setCategoryArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    // Verwende die neue typisierte Funktion
    const filteredArticles = getArticlesByCategory(category);
    setCategoryArticles(filteredArticles);

    // Hole Kategorie-Informationen
    const categoryData = categories[category];
    if (categoryData) {
      setCategoryInfo(getCategoryInfo(categoryData));
    }

    setLoading(false);
  }, [category]);

  const getCategoryInfo = (categoryData: Category): CategoryInfo => {
    const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
      'User': User,
      'Code': Code,
      'Clock': History,
      'FileText': FileText,
      'FolderOpen': FolderOpen,
      'Monitor': Monitor,
      'Zap': Zap,
      'BookOpen': BookOpen,
      'MoreHorizontal': MoreHorizontal
    };

    return {
      title: categoryData.name,
      description: categoryData.description,
      icon: iconMap[categoryData.icon] || FileText,
      color: categoryData.color,
      articleCount: categoryData.articleCount
    };
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Startseite', href: '/' }
    ];

    if (categoryInfo) {
      breadcrumbs.push({ name: categoryInfo.title });
    }

    return breadcrumbs;
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      'blue': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
      'green': { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
      'purple': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
      'amber': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
      'red': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
      'indigo': { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
      'gray': { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' }
    };

    return colorMap[color] || colorMap['gray'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategorie nicht gefunden</h1>
            <p className="text-gray-600 mb-8">Die angeforderte Kategorie konnte nicht gefunden werden.</p>
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

  const colorClasses = getColorClasses(categoryInfo.color);
  const IconComponent = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={generateBreadcrumbs()} />
        
        <button 
          onClick={() => window.history.back()}
          className="mb-6 inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Zurück</span>
        </button>

        {/* Kategorie-Header */}
        <div className={`${colorClasses.bg} ${colorClasses.border} border rounded-lg p-8 mb-8`}>
          <div className="flex items-start space-x-4">
            <div className={`${colorClasses.text} p-3 rounded-lg bg-white shadow-sm`}>
              <IconComponent size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {categoryInfo.title}
              </h1>
              <p className="text-gray-700 text-lg mb-4">
                {categoryInfo.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <FileText size={14} />
                  <span>{categoryInfo.articleCount} Artikel</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Artikel-Liste */}
        {categoryArticles.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Alle Artikel ({categoryArticles.length})
              </h2>
              
              {/* Sortierung könnte hier hinzugefügt werden */}
              <div className="text-sm text-gray-500">
                Sortiert nach Relevanz
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryArticles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article}
                  showCategory={false} // Kategorie nicht anzeigen, da wir bereits in der Kategorie sind
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <IconComponent size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Keine Artikel gefunden
            </h3>
            <p className="text-gray-600">
              In dieser Kategorie sind noch keine Artikel verfügbar.
            </p>
          </div>
        )}

        {/* Verwandte Kategorien */}
        {category && categories[category]?.children.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Unterkategorien
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories[category].children.map((childId) => {
                const childCategory = categories[childId];
                if (!childCategory) return null;

                const childColorClasses = getColorClasses(childCategory.color);
                const ChildIcon = getCategoryInfo(childCategory).icon;

                return (
                  <button
                    key={childId}
                    onClick={() => window.location.href = `/category/${childId}`}
                    className={`${childColorClasses.bg} ${childColorClasses.border} border rounded-lg p-4 text-left hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center space-x-3">
                      <ChildIcon size={20} className={childColorClasses.text} />
                      <div>
                        <h4 className="font-medium text-gray-900">{childCategory.name}</h4>
                        <p className="text-sm text-gray-600">{childCategory.articleCount} Artikel</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;

