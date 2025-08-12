import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link 
        to="/" 
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home size={16} />
        <span className="ml-1">Startseite</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight size={16} className="text-gray-400" />
          {item.href ? (
            <Link 
              to={item.href.replace('/#', '')} 
              className="hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.name}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumbs

