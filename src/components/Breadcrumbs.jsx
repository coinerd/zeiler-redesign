import { ChevronRight, Home } from 'lucide-react'

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <a 
        href="/" 
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home size={16} />
        <span className="ml-1">Startseite</span>
      </a>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight size={16} className="text-gray-400" />
          {item.href ? (
            <a 
              href={item.href} 
              className="hover:text-blue-600 transition-colors"
            >
              {item.name}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">{item.name}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumbs

