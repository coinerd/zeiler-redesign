import React from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, Home, User, BookOpen, Code, History } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

const Header = ({ onSearch, searchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '')
  const location = useLocation()
  
  // Update local search term when prop changes
  React.useEffect(() => {
    setLocalSearchTerm(searchTerm || '')
  }, [searchTerm])
  
  // Clear search when not on homepage
  React.useEffect(() => {
    if (location.pathname !== '/' && location.hash !== '#/') {
      setLocalSearchTerm('')
    }
  }, [location])
  
  const handleSearchChange = (e) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    if (onSearch && (location.pathname === '/' || location.hash === '#/')) {
      onSearch(value)
    }
  }

  const navigationItems = [
    { name: 'Startseite', to: '/', icon: Home },
    { name: 'Detlef', to: '/category/detlef', icon: User },
    { name: 'Julian', to: '/category/julian', icon: Code },
    { name: 'Geschichte', to: '/category/geschichte', icon: History },
    { name: 'Projekte', to: '/category/projekte', icon: BookOpen },
  ]

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              ZEILER.me
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.to || location.hash === item.to
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - only show on homepage */}
            {(location.pathname === '/' || location.hash === '#/') && (
              <div className="hidden sm:flex relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Suchen..."
                    value={localSearchTerm}
                    onChange={handleSearchChange}
                    className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.to || location.hash === item.to
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent size={16} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Search - only show on homepage */}
              {(location.pathname === '/' || location.hash === '#/') && (
                <div className="px-3 py-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Artikel durchsuchen..."
                      value={localSearchTerm}
                      onChange={handleSearchChange}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

