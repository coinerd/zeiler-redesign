import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'
import ArticleCard from './ArticleCard.jsx'
import { articles } from '../data/articles_comprehensive.js'
import { ArrowLeft, User, Code, History, BookOpen, Users } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

const CategoryPage = () => {
  const { category } = useParams()
  const [categoryArticles, setCategoryArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Filtere Artikel nach Kategorie - verwende die korrekte Logik
    const filteredArticles = articles.filter(article => {
      // Filtere basierend auf der Kategorie
      if (category === 'detlef') {
        const isDetlefAuthor = article.author === 'Detlef Zeiler'
        const isDetlefURL = article.url.toLowerCase().includes('/detlef/')
        const isDetlefCategory = article.category === 'detlef'
        return isDetlefAuthor || isDetlefURL || isDetlefCategory
      } else if (category === 'julian') {
        const isJulianAuthor = article.author === 'Julian Zeiler'
        const isJulianURL = article.url.toLowerCase().includes('/julian/')
        const isJulianCategory = article.category === 'julian'
        return isJulianAuthor || isJulianURL || isJulianCategory
      } else if (category === 'geschichte') {
        const isGeschichteCategory = article.category === 'geschichte'
        const isGeschichteURL = article.url.toLowerCase().includes('/geschichte/')
        return isGeschichteCategory || isGeschichteURL
      } else if (category === 'projekte') {
        const isProjekteCategory = article.category === 'projekte'
        const isProjekteURL = article.url.toLowerCase().includes('/projekte/')
        return isProjekteCategory || isProjekteURL
      } else if (category === 'medien') {
        const isMedienCategory = article.category === 'medien'
        const isMedienURL = article.url.toLowerCase().includes('/medien/')
        return isMedienCategory || isMedienURL
      } else if (category === 'deutsch') {
        const isDeutschCategory = article.category === 'deutsch'
        const isDeutschURL = article.url.toLowerCase().includes('/deutsch/')
        return isDeutschCategory || isDeutschURL
      } else if (category === 'techzap') {
        const isTechzapCategory = article.category === 'techzap'
        const isTechzapURL = article.url.toLowerCase().includes('/techzap/')
        return isTechzapCategory || isTechzapURL
      }
      
      return false
    })
    
    setCategoryArticles(filteredArticles)
    setLoading(false)
  }, [category])

  const getCategoryInfo = (cat) => {
    const categoryMap = {
      'detlef': {
        title: 'Detlef Zeiler',
        description: 'Artikel und Projekte von Detlef Zeiler zu Geschichte, Medien und Deutsch',
        icon: User,
        color: 'bg-blue-100 text-blue-600'
      },
      'julian': {
        title: 'Julian Zeiler',
        description: 'Artikel und Projekte von Julian Zeiler zu IT und Technologie',
        icon: Code,
        color: 'bg-green-100 text-green-600'
      },
      'geschichte': {
        title: 'Geschichte',
        description: 'Historische Artikel und Forschungsprojekte',
        icon: History,
        color: 'bg-amber-100 text-amber-600'
      },
      'projekte': {
        title: 'Projekte',
        description: 'Umfangreiche Forschungs- und Dokumentationsprojekte',
        icon: Users,
        color: 'bg-purple-100 text-purple-600'
      },
      'medien': {
        title: 'Medien',
        description: 'Artikel über Medienerziehung und Medienkompetenz',
        icon: BookOpen,
        color: 'bg-red-100 text-red-600'
      },
      'deutsch': {
        title: 'Deutsch',
        description: 'Textinterpretationen und literarische Analysen',
        icon: BookOpen,
        color: 'bg-indigo-100 text-indigo-600'
      },
      'techzap': {
        title: 'TechZap',
        description: 'Technische Artikel und IT-Themen',
        icon: Code,
        color: 'bg-cyan-100 text-cyan-600'
      }
    }
    
    return categoryMap[cat] || {
      title: cat.charAt(0).toUpperCase() + cat.slice(1),
      description: `Artikel in der Kategorie ${cat}`,
      icon: BookOpen,
      color: 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  const categoryInfo = getCategoryInfo(category)
  const IconComponent = categoryInfo.icon

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={null} searchTerm="" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: categoryInfo.title }]} />
        
        <Button variant="ghost" asChild className="mb-6">
          <a href="/#/" className="flex items-center space-x-2">
            <ArrowLeft size={16} />
            <span>Zurück zur Startseite</span>
          </a>
        </Button>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-16 h-16 rounded-lg ${categoryInfo.color} flex items-center justify-center`}>
              <IconComponent size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {categoryInfo.title}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {categoryInfo.description}
              </p>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {categoryArticles.length} Artikel gefunden
          </div>
        </div>

        {/* Articles Grid */}
        {categoryArticles.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Zeige {categoryArticles.length} von {articles.length} Artikeln für Kategorie "{category}"
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                title={article.title}
                excerpt={article.excerpt}
                author={article.author}
                date="2024"
                href={article.display_url}
                image={article.images && article.images.length > 0 ? `/src/assets/${article.images[0]}` : null}
              />
            ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Keine Artikel in Kategorie "{category}" gefunden
            </h2>
            <p className="text-gray-600">
              In dieser Kategorie sind derzeit keine Artikel verfügbar.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default CategoryPage

