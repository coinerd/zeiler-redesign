#!/usr/bin/env python3
"""
Content Integration Script for Zeiler Redesign
Processes scraped content and generates React-compatible data files
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path

def clean_title(title):
    """Clean and normalize article titles"""
    if not title:
        return 'Unbekannter Titel'
    
    # Remove redundant prefixes
    cleaned = title
    prefixes_to_remove = [
        'ZEILER.me - IT & Medien, Geschichte, Deutsch - ',
        'ZEILER.me - ',
        'IT & Medien, Geschichte, Deutsch - '
    ]
    
    for prefix in prefixes_to_remove:
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):]
    
    return cleaned.strip() or 'Unbekannter Titel'

def clean_content(content):
    """Clean and normalize article content"""
    if not content:
        return ''
    
    # Remove Google Sites navigation and footer
    unwanted_patterns = [
        r'^Search this site.*?Skip to navigation\s*',
        r'^Skip to main content.*?Skip to navigation\s*',
        r'Startseite\s+Detlef Zeiler\s+Deutsch.*?Selfmade\s*',
        r'Copyright © \d{4} - \d{4} Detlef und Julian Zeiler.*?$',
        r'Google Sites\s+Report abuse.*?$',
        r'Made with Google Sites\s*$'
    ]
    
    cleaned_content = content
    for pattern in unwanted_patterns:
        cleaned_content = re.sub(pattern, '', cleaned_content, flags=re.DOTALL | re.MULTILINE)
    
    # Clean whitespace but preserve paragraph structure
    cleaned_content = re.sub(r'\n\s*\n\s*\n', '\n\n', cleaned_content)  # Multiple empty lines to double
    cleaned_content = re.sub(r'^\s+|\s+$', '', cleaned_content, flags=re.MULTILINE)  # Trim line whitespace
    
    return cleaned_content.strip()

def generate_excerpt(content, length=200):
    """Generate excerpt from content"""
    if not content:
        return ''
    
    # Remove HTML tags if present
    clean_content = re.sub(r'<[^>]*>', '', content)
    
    if len(clean_content) <= length:
        return clean_content
    
    # Cut at last complete sentence
    truncated = clean_content[:length]
    last_sentence_end = max(
        truncated.rfind('.'),
        truncated.rfind('!'),
        truncated.rfind('?')
    )
    
    if last_sentence_end > length * 0.7:
        return truncated[:last_sentence_end + 1]
    
    # Fallback: cut at last word
    last_space = truncated.rfind(' ')
    if last_space > 0:
        return truncated[:last_space] + '...'
    
    return truncated + '...'

def count_words(text):
    """Count words in text"""
    if not text:
        return 0
    
    # Remove HTML tags and count words
    clean_text = re.sub(r'<[^>]*>', '', text)
    words = re.findall(r'\b\w+\b', clean_text)
    return len(words)

def calculate_reading_time(word_count, words_per_minute=200):
    """Calculate reading time in minutes"""
    return max(1, round(word_count / words_per_minute))

def categorize_article(url, title, content):
    """Categorize article based on URL and content"""
    url_lower = url.lower()
    title_lower = title.lower()
    content_lower = content.lower()
    
    # URL-based categorization
    if '/detlef/' in url_lower:
        if '/geschichte/' in url_lower:
            return 'geschichte'
        elif '/medien/' in url_lower:
            return 'medien'
        elif '/deutsch/' in url_lower:
            return 'deutsch'
        elif '/projekte/' in url_lower:
            return 'projekte'
        else:
            return 'detlef'
    elif '/julian/' in url_lower:
        if '/techzap/' in url_lower:
            return 'techzap'
        else:
            return 'julian'
    
    # Content-based fallback categorization
    if any(word in title_lower or word in content_lower for word in ['geschichte', 'historisch', 'mittelalter']):
        return 'geschichte'
    elif any(word in title_lower or word in content_lower for word in ['medien', 'medienerziehung']):
        return 'medien'
    elif any(word in title_lower or word in content_lower for word in ['deutsch', 'interpretation', 'literatur']):
        return 'deutsch'
    elif any(word in title_lower or word in content_lower for word in ['projekt', 'heidelberg', 'kraichgau']):
        return 'projekte'
    elif any(word in title_lower or word in content_lower for word in ['techzap', 'programmierung', 'server']):
        return 'techzap'
    
    return 'andere'

def determine_author(url, content):
    """Determine article author"""
    if '/detlef/' in url.lower():
        return 'Detlef Zeiler'
    elif '/julian/' in url.lower():
        return 'Julian Zeiler'
    else:
        return 'ZEILER.me'

def create_display_url(url):
    """Create hash-based display URL"""
    # Remove leading slash and add hash prefix
    clean_url = url.lstrip('/')
    return f"/#/{clean_url}"

def process_images(images):
    """Process image data"""
    if not images:
        return []
    
    processed_images = []
    for img in images:
        if isinstance(img, str):
            # Handle string image paths
            processed_images.append({
                "src": img,
                "alt": "Artikel-Bild"
            })
        elif isinstance(img, dict):
            # Handle image objects
            processed_images.append({
                "src": img.get('src', ''),
                "alt": img.get('alt', 'Artikel-Bild'),
                "original_url": img.get('original_url', '')
            })
    
    return processed_images

def load_scraped_data():
    """Load scraped data from JSON file"""
    data_file = Path('scraped_content.json')
    if not data_file.exists():
        print(f"Warning: {data_file} not found. Creating empty dataset.")
        return []
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {data_file}: {e}")
        return []

def generate_articles_js():
    """Generate the articles.js file with proper JavaScript syntax"""
    
    # Load scraped data
    scraped_data = load_scraped_data()
    
    if not scraped_data:
        print("No data to process. Using sample data.")
        # Create sample data for testing
        scraped_data = [{
            "id": 1,
            "title": "ZEILER .me - IT & Medien, Geschichte, Deutsch - Alexis de Tocqueville über die plötzliche Grausamkeit in einer unglücklichen Zeit",
            "url": "/detlef/geschichte/ber-die-pltzliche-grausamkeit-in-einer-unglcklichen-zeit",
            "text_content": "Alexis de Tocqueville (1805-1859) ist vor allem mit seinem Buch „Über die Demokratie in Amerika" (1835/1840) bekannt geworden. In seinen „Erinnerungen" hinterlässt er aber auch ein lebensnahes historisches Dokument über die Geschehnisse der 1848er Revolution und der niedergeschlagenen Juniaufstände der Arbeiter von 1848. So schildert er, was für Auswirkungen die Bürgerkriegsatmosphäre auf seine Nachbarn, die bei der Nationalgarde Dienst taten, und auf ihn selbst hatte:\n\n„Als ich mit ihnen sprach, bemerkte ich, mit welch erschreckender Schnelligkeit selbst in einem zivilisierten Jahrhundert wie dem unseren die friedfertigsten Seelen sich sozusagen auf Bürgerkriege einstimmen und wie sich der Geschmack an der Gewalt und die Verachtung des Menschenlebens plötzlich in dieser unglücklichen Zeit dort ausbreiten.\n\nDie Menschen, mit denen ich mich unterhielt, waren gut gestellte und friedfertige Handwerker, deren sanfte und ein wenig weiche Gewohnheiten noch weiter von der Grausamkeit als vom Heroismus entfernt waren. Trotzdem dachten sie nur noch an Zerstörung und Massaker. Sie klagten darüber, dass man nicht mit Bomben, Minen und Gräben gegen die aufständischen Straßen vorging, und wollten gegenüber niemandem mehr Gnade walten lassen. […] als ich meinen Weg fortsetzte, kam ich nicht umhin, über mich selbst nachzudenken und über die Natur meiner Argumente zu staunen, mit der ich mich selbst unversehens binnen zweier Tage mit diesen Ideen erbarmungsloser Vernichtung und großer Härte vertraut gemacht hatte, die mir natürlicherweise so fern liegen."\n\nWas Tocqueville hier selbstkritisch und reflektiert beschreibt, das wiederholt sich immer wieder in gesellschaftlichen Umbruchszeiten – und es scheint nicht vom jeweiligen Bildungsstand abzuhängen, wie sehr sich jemand von gewalthaltigen Ereignissen mitreißen lässt.\n\nDie Decke der Zivilisation ist viel dünner, als man sich das in Friedenszeiten vorstellen mag. Schlimmer als ein plötzlicher Ausbruch von Gewalt, der danach reflektiert wird, ist aber die allmähliche Gewöhnung an verdeckte Gewalt, wie sie sich heute abzuzeichnen scheint.",
            "images": ["tocqueville_portrait_531.jpg"],
            "scraped_url": "https://www.zeiler.me/detlef/geschichte/ber-die-pltzliche-grausamkeit-in-einer-unglcklichen-zeit"
        }]
    
    # Process articles
    processed_articles = []
    
    for idx, item in enumerate(scraped_data):
        # Extract and clean data
        raw_title = item.get('title', f'Artikel {idx + 1}')
        clean_title_text = clean_title(raw_title)
        raw_content = item.get('text_content', item.get('content', ''))
        clean_content_text = clean_content(raw_content)
        
        # Generate metadata
        word_count = count_words(clean_content_text)
        reading_time = calculate_reading_time(word_count)
        excerpt = generate_excerpt(clean_content_text)
        
        # Determine categorization
        url = item.get('url', f'/artikel-{idx + 1}')
        category = categorize_article(url, clean_title_text, clean_content_text)
        author = determine_author(url, clean_content_text)
        display_url = create_display_url(url)
        
        # Process images
        images = process_images(item.get('images', []))
        
        # Create article object
        article = {
            "id": item.get('id', idx + 1),
            "title": clean_title_text,
            "excerpt": excerpt,
            "content": clean_content_text,
            "url": url,
            "display_url": display_url,
            "images": images,
            "author": author,
            "category": category,
            "scraped_url": item.get('scraped_url', ''),
            "word_count": word_count,
            "reading_time": reading_time
        }
        
        processed_articles.append(article)
    
    # Generate JavaScript file content
    js_content = f"""// Generiert am: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
// Automatisch generierte Artikel-Datenbank für das Zeiler-Redesign

export const articles = {json.dumps(processed_articles, ensure_ascii=False, indent=2)};

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
    
    # Write to file
    output_file = Path('src/data/articles.js')
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"✅ Successfully generated {output_file}")
        print(f"📊 Processed {len(processed_articles)} articles")
        print(f"📝 Total words: {sum(a['word_count'] for a in processed_articles):,}")
        
        # Show category breakdown
        category_counts = {}
        for article in processed_articles:
            cat = article['category']
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        print("📂 Categories:")
        for cat, count in sorted(category_counts.items()):
            print(f"   {cat}: {count} articles")
            
    except Exception as e:
        print(f"❌ Error writing {output_file}: {e}")
        return False
    
    return True

if __name__ == '__main__':
    print("🚀 Starting content integration...")
    
    if generate_articles_js():
        print("✅ Content integration completed successfully!")
    else:
        print("❌ Content integration failed!")
        exit(1)