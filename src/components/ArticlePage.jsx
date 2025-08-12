import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'
import { getArticleByUrl } from '../data/articles.js'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

const ArticlePage = () => {
  const { '*': urlPath } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Entferne den führenden Slash, falls vorhanden, um die URL zu normalisieren
    const normalizedUrlPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
    const foundArticle = getArticleByUrl(normalizedUrlPath);
    setArticle(foundArticle)
    setLoading(false)
  }, [urlPath])

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
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel nicht gefunden</h1>
            <p className="text-gray-600 mb-8">Der angeforderte Artikel konnte nicht gefunden werden.</p>
            <Button asChild>
              <a href="/#/">Zur Startseite</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Generiere Breadcrumbs basierend auf der URL
  const generateBreadcrumbs = (url) => {
    const parts = url.split('/').filter(part => part)
    const breadcrumbs = []
    
    for (let i = 0; i < parts.length - 1; i++) {
      const href = `/#/${parts.slice(0, i + 1).join('/')}`
      const name = parts[i].charAt(0).toUpperCase() + parts[i].slice(1)
      breadcrumbs.push({ name, href })
    }
    
    breadcrumbs.push({ name: article.title })
    return breadcrumbs
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={generateBreadcrumbs(article.url)} />
        
        <Button variant="ghost" asChild className="mb-6">
          <a href="/#/" className="flex items-center space-x-2">
            <ArrowLeft size={16} />
            <span>Zurück zur Startseite</span>
          </a>
        </Button>

        <article className="bg-white rounded-lg shadow-sm border p-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>2024</span>
              </div>
            </div>
          </header>

          {/* Bilder anzeigen */}
          {article.images && article.images.length > 0 && (
            <div className="mb-8">
              {article.images.map((image, index) => (
                <div key={index} className="mb-4">
                  <img 
                    src={`/src/assets/${image}`} 
                    alt={`Bild ${index + 1} zu ${article.title}`}
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Artikelinhalt */}
          <div className="prose prose-lg max-w-none">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

export default ArticlePage