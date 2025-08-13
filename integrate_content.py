#!/usr/bin/env python3
"""
Content Integration Script for Zeiler Redesign
Processes scraped content and generates React-compatible data files with more test articles
"""

import json
import os
import re
from datetime import datetime

def clean_title(title):
    """Clean and normalize article titles"""
    if not title:
        return 'Unbekannter Titel'
    
    prefixes_to_remove = [
        'ZEILER.me - ',
        'IT & Medien, Geschichte, Deutsch - '
    ]
    
    cleaned = title
    for prefix in prefixes_to_remove:
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):]
    
    return cleaned.strip() or 'Unbekannter Titel'

def generate_test_articles():
    """Generate comprehensive test articles for all categories"""
    
    test_articles = [
        # Detlef - Geschichte
        {
            "id": 1,
            "title": "Alexis de Tocqueville über die plötzliche Grausamkeit in einer unglücklichen Zeit",
            "excerpt": "Tocqueville beschreibt in seinen Erinnerungen, wie schnell sich friedfertige Menschen in Krisenzeiten zu Gewalt hinreißen lassen.",
            "content": """Alexis de Tocqueville (1805-1859) ist vor allem mit seinem Buch „Über die Demokratie in Amerika" (1835/1840) bekannt geworden. In seinen „Erinnerungen" hinterlässt er aber auch ein lebensnahes historisches Dokument über die Geschehnisse der 1848er Revolution und der niedergeschlagenen Juniaufstände der Arbeiter von 1848.""",
            "url": "/detlef/geschichte/tocqueville-grausamkeit",
            "display_url": "/#/detlef/geschichte/tocqueville-grausamkeit",
            "images": [{"src": "/src/assets/tocqueville_portrait_531.jpg", "alt": "Portrait von Alexis de Tocqueville"}],
            "author": "Detlef Zeiler",
            "category": "geschichte",
            "scraped_url": "https://www.zeiler.me/detlef/geschichte/tocqueville-grausamkeit",
            "word_count": 296,
            "reading_time": 2
        },
        {
            "id": 2,
            "title": "Heidelberg im Mittelalter - Die Entstehung einer Stadt",
            "excerpt": "Die Geschichte Heidelbergs von den ersten Siedlungen bis zur Gründung der Universität im 14. Jahrhundert.",
            "content": """Heidelberg, heute eine der bekanntesten Städte Deutschlands, hat eine reiche mittelalterliche Geschichte, die bis ins 12. Jahrhundert zurückreicht.""",
            "url": "/detlef/geschichte/heidelberg-mittelalter",
            "display_url": "/#/detlef/geschichte/heidelberg-mittelalter",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "geschichte",
            "scraped_url": "https://www.zeiler.me/detlef/geschichte/heidelberg-mittelalter",
            "word_count": 189,
            "reading_time": 1
        },
        {
            "id": 3,
            "title": "Die Reformation in der Kurpfalz",
            "excerpt": "Wie die Reformation das religiöse und politische Leben in der Kurpfalz veränderte.",
            "content": """Die Reformation hatte tiefgreifende Auswirkungen auf die Kurpfalz und ihre Hauptstadt Heidelberg.""",
            "url": "/detlef/geschichte/reformation-kurpfalz",
            "display_url": "/#/detlef/geschichte/reformation-kurpfalz",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "geschichte",
            "scraped_url": "https://www.zeiler.me/detlef/geschichte/reformation-kurpfalz",
            "word_count": 156,
            "reading_time": 1
        },
        {
            "id": 4,
            "title": "Medienerziehung in der digitalen Welt",
            "excerpt": "Herausforderungen und Chancen der Medienerziehung im Zeitalter von Internet und sozialen Medien.",
            "content": """Die Medienerziehung steht heute vor völlig neuen Herausforderungen.""",
            "url": "/detlef/medien/medienerziehung-digital",
            "display_url": "/#/detlef/medien/medienerziehung-digital",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "medien",
            "scraped_url": "https://www.zeiler.me/detlef/medien/medienerziehung-digital",
            "word_count": 178,
            "reading_time": 1
        },
        {
            "id": 5,
            "title": "Fake News erkennen und bewerten",
            "excerpt": "Strategien und Methoden zur Identifikation von Falschinformationen in digitalen Medien.",
            "content": """In der heutigen Informationsgesellschaft ist die Fähigkeit, Fake News zu erkennen, zu einer Schlüsselkompetenz geworden.""",
            "url": "/detlef/medien/fake-news-erkennen",
            "display_url": "/#/detlef/medien/fake-news-erkennen",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "medien",
            "scraped_url": "https://www.zeiler.me/detlef/medien/fake-news-erkennen",
            "word_count": 201,
            "reading_time": 1
        },
        {
            "id": 6,
            "title": "Goethe: Der Erlkönig - Interpretation",
            "excerpt": "Eine detaillierte Analyse von Goethes berühmter Ballade und ihrer literarischen Bedeutung.",
            "content": """Goethes 'Erlkönig' aus dem Jahr 1782 ist eine der bekanntesten deutschen Balladen.""",
            "url": "/detlef/deutsch/goethe-erlkoenig",
            "display_url": "/#/detlef/deutsch/goethe-erlkoenig",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "deutsch",
            "scraped_url": "https://www.zeiler.me/detlef/deutsch/goethe-erlkoenig",
            "word_count": 234,
            "reading_time": 1
        },
        {
            "id": 7,
            "title": "Erörterung: Digitalisierung in der Schule",
            "excerpt": "Pro und Contra der zunehmenden Digitalisierung im Bildungswesen.",
            "content": """Die Digitalisierung der Schulen ist ein viel diskutiertes Thema.""",
            "url": "/detlef/deutsch/digitalisierung-schule",
            "display_url": "/#/detlef/deutsch/digitalisierung-schule",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "deutsch",
            "scraped_url": "https://www.zeiler.me/detlef/deutsch/digitalisierung-schule",
            "word_count": 245,
            "reading_time": 1
        },
        {
            "id": 8,
            "title": "React Hooks: Ein praktischer Leitfaden",
            "excerpt": "Eine praktische Anleitung zu React Hooks und deren Verwendung in modernen React-Anwendungen.",
            "content": """React Hooks haben die Art, wie wir React-Komponenten schreiben, revolutioniert.""",
            "url": "/julian/techzap/react-hooks",
            "display_url": "/#/julian/techzap/react-hooks",
            "images": [],
            "author": "Julian Zeiler",
            "category": "techzap",
            "scraped_url": "https://www.zeiler.me/julian/techzap/react-hooks",
            "word_count": 198,
            "reading_time": 1
        },
        {
            "id": 9,
            "title": "Linux Server Administration Grundlagen",
            "excerpt": "Wichtige Befehle und Konzepte für die Verwaltung von Linux-Servern.",
            "content": """Die Administration von Linux-Servern erfordert Kenntnisse verschiedener Befehle und Konzepte.""",
            "url": "/julian/techzap/linux-server-admin",
            "display_url": "/#/julian/techzap/linux-server-admin",
            "images": [],
            "author": "Julian Zeiler",
            "category": "techzap",
            "scraped_url": "https://www.zeiler.me/julian/techzap/linux-server-admin",
            "word_count": 189,
            "reading_time": 1
        },
        {
            "id": 10,
            "title": "CSS Grid Layout: Moderne Webentwicklung",
            "excerpt": "Wie CSS Grid das Layout-Design revolutioniert und praktische Anwendungsbeispiele.",
            "content": """CSS Grid ist ein mächtiges Layout-System, das zweidimensionale Layouts ermöglicht.""",
            "url": "/julian/techzap/css-grid-layout",
            "display_url": "/#/julian/techzap/css-grid-layout",
            "images": [],
            "author": "Julian Zeiler",
            "category": "techzap",
            "scraped_url": "https://www.zeiler.me/julian/techzap/css-grid-layout",
            "word_count": 223,
            "reading_time": 1
        }
        
    return test_articles

if __name__ == '__main__':
    print("🚀 Generating comprehensive test articles...")
    
    # Generate test articles
    processed_articles = generate_test_articles()

    # Convert articles to JavaScript format with proper escaping
    articles_js = "[\n"
    for i, article in enumerate(processed_articles):
        if i > 0:
            articles_js += ",\n"
        
        # Escape quotes and newlines in content
        content = article['content'].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        title = article['title'].replace('\\', '\\\\').replace('"', '\\"')
        excerpt = article['excerpt'].replace('\\', '\\\\').replace('"', '\\"')
        
        articles_js += f"""  {{
    "id": {article['id']},
    "title": "{title}",
    "excerpt": "{excerpt}",
    "content": "{content}",
    "url": "{article['url']}",
    "display_url": "{article['display_url']}",
    "images": {json.dumps(article['images'])},
    "author": "{article['author']}",
    "category": "{article['category']}",
    "scraped_url": "{article['scraped_url']}",
    "word_count": {article['word_count']},
    "reading_time": {article['reading_time']}
  }}"""
    
    articles_js += "\n];"

    js_content = f"""// Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

export const articles = {articles_js}

// Suchfunktion
export function searchArticles(query) {{
  if (!query || query.trim().length < 2) {{
    return articles;
  }}
  
  const searchTerm = query.toLowerCase().trim();
  
  return articles.filter(article => {{
    const searchableText = [
      article.title,
      article.excerpt,
      article.content,
      article.author,
      article.category
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  }});
}}

// Artikel nach URL finden
export function getArticleByUrl(url) {{
  if (!url) return null;
  
  // Normalisiere URL
  const normalizedUrl = url.replace(/^\/+|\/+$/g, '').toLowerCase();
  
  return articles.find(article => {{
    const articleUrl = article.url.replace(/^\/+|\/+$/g, '').toLowerCase();
    const displayUrl = article.display_url.replace(/^\/+|#+\/+|\/+$/g, '').toLowerCase();
    
    return articleUrl === normalizedUrl || 
           displayUrl === normalizedUrl ||
           articleUrl.endsWith(normalizedUrl) ||
           displayUrl.endsWith(normalizedUrl);
  }}) || null;
}}

// Artikel nach Kategorie
export function getArticlesByCategory(category) {{
  return articles.filter(article => article.category === category);
}}

// Statistiken
export const articleStats = {{
  total: articles.length,
  categories: [...new Set(articles.map(a => a.category))],
  authors: [...new Set(articles.map(a => a.author))],
  totalWords: articles.reduce((sum, a) => sum + a.word_count, 0),
  averageReadingTime: Math.round(articles.reduce((sum, a) => sum + a.reading_time, 0) / articles.length)
}};
"""
    
    # Create directory if it doesn't exist
    src_data_dir = os.path.join('src', 'data')
    if not os.path.exists(src_data_dir):
        os.makedirs(src_data_dir)
    
    output_file = os.path.join(src_data_dir, 'articles_comprehensive.js')
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"✅ Generated {output_file} successfully!")
        print("✅ Comprehensive test articles generated successfully!")
    except Exception as e:
        print(f"❌ Error writing {output_file}: {e}")
        print("❌ Failed to generate test articles!")
        exit(1)