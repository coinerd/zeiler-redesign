import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Markdown-Renderer-Komponente für Artikel-Content
 * Unterstützt GitHub Flavored Markdown, Syntax-Highlighting und benutzerdefinierte Styling
 */
const MarkdownRenderer = ({ content, className = "" }) => {
  // Custom Components für verschiedene Markdown-Elemente
  const components = {
    // Blockquotes mit spezieller Styling
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 italic text-gray-700 text-lg leading-relaxed">
        {children}
      </blockquote>
    ),
    
    // Paragraphen mit verbessertem Spacing
    p: ({ children }) => (
      <p className="mb-6 text-gray-700 leading-relaxed text-lg">
        {children}
      </p>
    ),
    
    // Überschriften mit konsistenter Styling
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
        {children}
      </h1>
    ),
    
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 mt-10 leading-tight">
        {children}
      </h2>
    ),
    
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-8 leading-tight">
        {children}
      </h3>
    ),
    
    // Listen mit verbessertem Styling
    ul: ({ children }) => (
      <ul className="mb-6 pl-6 space-y-2">
        {children}
      </ul>
    ),
    
    ol: ({ children }) => (
      <ol className="mb-6 pl-6 space-y-2 list-decimal">
        {children}
      </ol>
    ),
    
    li: ({ children }) => (
      <li className="text-gray-700 leading-relaxed">
        {children}
      </li>
    ),
    
    // Links mit Hover-Effekten
    a: ({ href, children }) => (
      <a 
        href={href} 
        className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    
    // Bilder mit responsivem Design
    img: ({ src, alt }) => (
      <div className="my-8 text-center">
        <img 
          src={src} 
          alt={alt || "Artikel-Bild"} 
          className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            console.warn(`Bild konnte nicht geladen werden: ${src}`);
          }}
        />
        {alt && (
          <p className="text-sm text-gray-500 mt-2 italic">
            {alt}
          </p>
        )}
      </div>
    ),
    
    // Code-Blöcke mit Syntax-Highlighting
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      
      if (!inline && match) {
        return (
          <div className="my-6">
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              className="rounded-lg"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      }
      
      return (
        <code 
          className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" 
          {...props}
        >
          {children}
        </code>
      );
    },
    
    // Tabellen mit responsivem Design
    table: ({ children }) => (
      <div className="my-8 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          {children}
        </table>
      </div>
    ),
    
    th: ({ children }) => (
      <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
        {children}
      </th>
    ),
    
    td: ({ children }) => (
      <td className="border border-gray-300 px-4 py-2">
        {children}
      </td>
    ),
    
    // Horizontale Linien
    hr: () => (
      <hr className="my-8 border-t-2 border-gray-200" />
    ),
    
    // Starke Betonung
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">
        {children}
      </strong>
    ),
    
    // Kursive Betonung
    em: ({ children }) => (
      <em className="italic text-gray-700">
        {children}
      </em>
    )
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

