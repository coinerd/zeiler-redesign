import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Breadcrumbs from './components/Breadcrumbs.jsx'
import ArticleCard from './components/ArticleCard.jsx'
import ArticlePage from './components/ArticlePage.jsx'
import ArticlePageMarkdown from './components/ArticlePageMarkdown.jsx'
import CategoryPage from './components/CategoryPage.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Search, BookOpen, Code, History, Users } from 'lucide-react'
import { articles, searchArticles } from './data/articles.js'
import './App.css'

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term.trim()) {
      setSearchResults(searchArticles(term))
    } else {
      setSearchResults([])
    }
  }

  // Zeige die ersten 8 Artikel als Featured Articles
  const featuredArticles = articles.slice(0, 8)

  const categories = [
    {
      name: "IT & Medien",
      description: "Artikel über Technologie, Programmierung und digitale Medien",
      icon: Code,
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Geschichte",
      description: "Historische Artikel und Forschungsprojekte",
      icon: History,
      color: "bg-green-100 text-green-600"
    },
    {
      name: "Deutsch",
      description: "Textinterpretationen und literarische Analysen",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-600"
    },
    {
      name: "Projekte",
      description: "Umfangreiche Forschungs- und Dokumentationsprojekte",
      icon: Users,
      color: "bg-orange-100 text-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                ZEILER.me
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                IT & Medien, Geschichte, Deutsch
              </p>
              <p className="text-lg mb-8 max-w-3xl mx-auto text-blue-50">
                Herzlich Willkommen auf den Seiten von Detlef und Julian Zeiler. 
                Hier finden Sie einige Artikel die mein Vater Detlef und ich im Laufe der Zeit geschrieben haben.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Artikel durchsuchen..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Suchergebnisse ({searchResults.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    title={article.title}
                    excerpt={article.excerpt}
                    author={article.author}
                    date="2024"
                    href={article.display_url} // Hier die display_url verwenden
                    image={article.images && article.images.length > 0 ? `/src/assets/${article.images[0]}` : null}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        {searchResults.length === 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Kategorien
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => {
                  const IconComponent = category.icon
                  return (
                    <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                        <IconComponent size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Featured Articles Section */}
        {searchResults.length === 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Besondere Artikel
                </h2>
                <p className="text-lg text-gray-600">
                  Eine Auswahl unserer interessantesten Beiträge
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredArticles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    title={article.title}
                    excerpt={article.excerpt}
                    author={article.author}
                    date="2024"
                    href={article.display_url} // Hier die display_url verwenden
                    image={article.images && article.images.length > 0 ? `/src/assets/${article.images[0]}` : null}
                  />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <p className="text-gray-600">
                  Insgesamt {articles.length} Artikel verfügbar
                </p>
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        {searchResults.length === 0 && (
          <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Detlef und Julian
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Diese Webseite ist eine Sammlung von Artikeln und Projekten, die über die Jahre entstanden sind. 
                    Von historischen Forschungen über Heidelberg bis hin zu modernen IT-Themen - hier finden Sie 
                    eine vielfältige Auswahl an Inhalten.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">Historische Forschung und Dokumentation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">IT und Medientechnologie</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">Literatur und Textinterpretation</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Kontakt
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Haben Sie Fragen oder Anregungen zu unseren Artikeln? 
                    Wir freuen uns über Ihr Feedback.
                  </p>
                  <Button asChild>
                    <a href="/#/contact">Kontakt aufnehmen</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        {/* Spezielle Route für Markdown-Artikel (Test) */}
        <Route path="/markdown/:category/:subcategory/:slug" element={<ArticlePageMarkdown />} />
        <Route path="/markdown/:category/:slug" element={<ArticlePageMarkdown />} />
        {/* Fallback für alle anderen Artikel */}
        <Route path="/*" element={<ArticlePage />} />
      </Routes>
    </Router>
  )
}

export default App