import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'
import { getArticleByUrl } from '../data/articles.js'
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react'
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

  const renderParagraphs = (content) => {
    if (!content) return null

    // Teile Content in Blöcke und verarbeite eingebettete Zitate
    const blocks = []
    const paragraphs = content.split(/\n{2,}/).filter(para => para.trim())

    paragraphs.forEach(paragraph => {
      let text = paragraph.trim()
      const quoteRegex = /[„"][^“”"]+[“"]/
      let match

      while ((match = quoteRegex.exec(text)) !== null) {
        const before = text.slice(0, match.index).replace(/:\s*$/, '').trim()
        if (before) blocks.push({ type: 'paragraph', text: before })

        const quoteText = match[0].slice(1, -1).trim()
        if (quoteText) blocks.push({ type: 'quote', text: quoteText })

        text = text.slice(match.index + match[0].length).trim()
      }

      if (text) blocks.push({ type: 'paragraph', text })
    })

    return blocks.map((block, index) => {
      if (block.type === 'quote') {
        return (
          <blockquote
            key={index}
            className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 italic text-gray-800"
          >
            <p className="text-lg leading-relaxed">{block.text}</p>
          </blockquote>
        )
      }

      return (
        <p
          key={index}
          className="mb-6 text-gray-700 leading-relaxed text-lg"
          style={{ lineHeight: '1.8' }}
        >
          {block.text}
        </p>
      )
    })
  }

  const resolveImageSrc = (imagePath) => {
    if (!imagePath) return ''
    
    // Handle different image path formats - support both string and object
    let src
    if (typeof imagePath === 'string') {
      src = imagePath
    } else if (typeof imagePath === 'object' && imagePath.src) {
      src = imagePath.src
    } else {
      console.warn('Invalid image path format:', imagePath)
      return ''
    }
    
    // If already a full URL, return as-is
    if (/^https?:/i.test(src)) return src
    
    // Handle local asset paths
    if (src.startsWith('/src/assets/')) {
      return src
    }
    
    // Handle relative paths
    if (src.startsWith('./assets/') || src.startsWith('assets/')) {
      const filename = src.replace(/^\.?\/assets\//, '')
      return `/src/assets/${filename}`
    }
    
    // Default: assume it's a filename in assets
    return `/src/assets/${src}`
  }

  const renderImages = (images) => {
    if (!images || images.length === 0) return null

    return (
      <div className="my-8">
        {images.map((image, index) => (
          <figure key={index} className="mb-8">
            <div className="flex justify-center">
              <img
                src={resolveImageSrc(image)}
                alt={typeof image === 'object' && image.alt ? image.alt : typeof image === 'string' ? `Bild ${index + 1} zu ${article.title}` : image.alt || `Bild ${index + 1} zu ${article.title}`}
                className="max-w-full h-auto rounded-lg shadow-lg border"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
                loading="lazy"
                onError={(e) => {
                  const imageSrc = resolveImageSrc(image)
                  console.error('Fehler beim Laden des Bildes:', imageSrc, 'Original:', image)
                  // Show placeholder instead of hiding
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJpbGQgbmljaHQgdmVyZsO8Z2JhcjwvdGV4dD48L3N2Zz4='
                  e.target.alt = 'Bild nicht verfügbar'
                }}
              />
            </div>
            {(typeof image === 'object' && image.alt) && (
              <figcaption className="text-sm text-gray-600 text-center mt-3 italic">
                {image.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    )
  }

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
    const parts = url.split('/').filter(part => part);
    const breadcrumbs = [
      { name: 'Startseite', href: '/#/' }
    ];
    
    // Mapping für bessere Kategorie-Namen
    const categoryNames = {
      'detlef': 'Detlef',
      'julian': 'Julian', 
      'geschichte': 'Geschichte',
      'medien': 'Medien',
      'deutsch': 'Deutsch',
      'projekte': 'Projekte',
      'techzap': 'TechZap'
    };
    
    // Füge Kategorie-Breadcrumbs hinzu (ohne den letzten Teil, der der Artikel-Slug ist)
    for (let i = 0; i < parts.length - 1; i++) {
      const href = `/#/${parts.slice(0, i + 1).join('/')}`;
      const categoryKey = parts[i].toLowerCase();
      const name = categoryNames[categoryKey] || parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
      breadcrumbs.push({ name, href });
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>2024</span>
              </div>
              {article.word_count && (
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{Math.max(1, Math.round(article.word_count / 200))} Min. Lesezeit</span>
                </div>
              )}
              {article.category && (
                <div className="flex items-center space-x-1">
                  <Tag size={14} />
                  <span className="capitalize">{article.category}</span>
                </div>
              )}
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
          {article.images && article.images.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bilder</h3>
              {renderImages(article.images)}
            </div>
          )}

          {/* Artikelinhalt mit verbessertem Paragraph-Rendering */}
          <div className="prose prose-lg max-w-none">
            {renderParagraphs(article.content)}
          </div>

          {/* Artikel-Metadaten am Ende */}
          {(article.word_count || article.scraped_url) && (
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                {article.word_count && (
                  <div>
                    <strong>Wörter:</strong> {article.word_count.toLocaleString('de-DE')}
                  </div>
                )}
                {article.reading_time && (
                  <div>
                    <strong>Lesezeit:</strong> {article.reading_time} Minuten
                  </div>
                )}
                {article.category && (
                  <div>
                    <strong>Kategorie:</strong> <span className="capitalize">{article.category}</span>
                  </div>
                )}
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
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}

export default ArticlePage

