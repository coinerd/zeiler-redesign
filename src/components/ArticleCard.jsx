import { Calendar, User, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'

const ArticleCard = ({ title, excerpt, author, date, href, image }) => {
  // Convert hash-based URLs to React Router paths
  const routerPath = href ? href.replace('/#', '') : '#'
  
  return (
    <article className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300">
      {image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>
        
        {excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {author && (
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{author}</span>
              </div>
            )}
            {date && (
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{date}</span>
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="sm" asChild>
            <Link to={routerPath} className="flex items-center space-x-1">
              <span>Lesen</span>
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard

