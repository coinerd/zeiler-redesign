import { Mail, Github, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">ZEILER.me</h3>
            <p className="text-gray-300 mb-4">
              Eine Sammlung von Artikeln und Projekten zu IT & Medien, Geschichte und Deutsch 
              von Detlef und Julian Zeiler.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:contact@zeiler.me" className="text-gray-300 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Schnellzugriff</h4>
            <ul className="space-y-2">
              <li><a href="/detlef" className="text-gray-300 hover:text-white transition-colors">Detlef</a></li>
              <li><a href="/julian" className="text-gray-300 hover:text-white transition-colors">Julian</a></li>
              <li><a href="/geschichte" className="text-gray-300 hover:text-white transition-colors">Geschichte</a></li>
              <li><a href="/projekte" className="text-gray-300 hover:text-white transition-colors">Projekte</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kategorien</h4>
            <ul className="space-y-2">
              <li><a href="/it-medien" className="text-gray-300 hover:text-white transition-colors">IT & Medien</a></li>
              <li><a href="/geschichte" className="text-gray-300 hover:text-white transition-colors">Geschichte</a></li>
              <li><a href="/deutsch" className="text-gray-300 hover:text-white transition-colors">Deutsch</a></li>
              <li><a href="/techzap" className="text-gray-300 hover:text-white transition-colors">TechZap</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ZEILER.me. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

