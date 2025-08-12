import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import ArticlePage from './src/components/ArticlePage_Fixed';
import { articles } from './src/data/articles_test';

// Einfache Startseite für Tests
const HomePage = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ZEILER.me - Test Version</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Test-Artikel</h2>
        <p className="text-gray-600 mb-4">
          Diese Test-Version zeigt die verbesserte Paragraph-Formatierung und Bild-Integration.
        </p>
        
        {articles.map(article => (
          <div key={article.id} className="border-b pb-4 mb-4 last:border-b-0">
            <h3 className="text-lg font-medium mb-2">
              <a 
                href={article.display_url} 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {article.title}
              </a>
            </h3>
            <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
            <div className="text-xs text-gray-500">
              {article.author} • {article.reading_time} Min. • {article.word_count} Wörter
            </div>
          </div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<ArticlePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

