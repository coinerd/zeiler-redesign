#!/usr/bin/env python3
"""
Web Scraper for zeiler.me Website
Automatically downloads all content from the original zeiler.me website
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import re
import time
from urllib.parse import urljoin, urlparse
from datetime import datetime
import hashlib

class ZeilerScraper:
    def __init__(self, base_url="https://www.zeiler.me"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.scraped_data = []
        self.visited_urls = set()
        self.images_downloaded = set()
        
    def clean_text(self, text):
        """Clean and normalize text content"""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize line breaks
        text = re.sub(r'\s+', ' ', text.strip())
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        return text
    
    def extract_metadata(self, soup, url):
        """Extract metadata from page"""
        metadata = {
            'url': url,
            'title': '',
            'author': '',
            'category': '',
            'date': '',
            'word_count': 0,
            'reading_time': 0
        }
        
        # Extract title
        title_elem = soup.find('title')
        if title_elem:
            metadata['title'] = self.clean_text(title_elem.get_text())
        
        # Extract author from URL or content
        if '/detlef/' in url:
            metadata['author'] = 'Detlef Zeiler'
        elif '/julian/' in url:
            metadata['author'] = 'Julian Zeiler'
        else:
            metadata['author'] = 'ZEILER.me'
        
        # Extract category from URL
        url_parts = url.replace(self.base_url, '').strip('/').split('/')
        if len(url_parts) >= 2:
            metadata['category'] = url_parts[1]
        
        return metadata
    
    def download_image(self, img_url, filename):
        """Download and save image"""
        try:
            response = self.session.get(img_url, timeout=10)
            response.raise_for_status()
            
            # Create assets directory if it doesn't exist
            assets_dir = os.path.join('src', 'assets')
            os.makedirs(assets_dir, exist_ok=True)
            
            # Save image
            img_path = os.path.join(assets_dir, filename)
            with open(img_path, 'wb') as f:
                f.write(response.content)
            
            print(f"Downloaded image: {filename}")
            return True
            
        except Exception as e:
            print(f"Failed to download image {img_url}: {e}")
            return False
    
    def extract_images(self, soup, base_url):
        """Extract and download images from page"""
        images = []
        
        for img in soup.find_all('img'):
            src = img.get('src')
            if not src:
                continue
            
            # Make URL absolute
            img_url = urljoin(base_url, src)
            
            # Skip if already processed
            if img_url in self.images_downloaded:
                continue
            
            # Generate filename
            parsed_url = urlparse(img_url)
            filename = os.path.basename(parsed_url.path)
            
            # If no filename, generate one
            if not filename or '.' not in filename:
                filename = f"image_{hashlib.md5(img_url.encode()).hexdigest()[:8]}.jpg"
            
            # Download image
            if self.download_image(img_url, filename):
                images.append({
                    'src': filename,
                    'alt': img.get('alt', ''),
                    'original_url': img_url
                })
                self.images_downloaded.add(img_url)
        
        return images
    
    def extract_content(self, soup):
        """Extract main content from page"""
        content = ""
        
        # Try different content selectors
        content_selectors = [
            'main',
            '.content',
            '.post-content',
            '.article-content',
            '#content',
            'article'
        ]
        
        content_elem = None
        for selector in content_selectors:
            content_elem = soup.select_one(selector)
            if content_elem:
                break
        
        # Fallback to body if no specific content area found
        if not content_elem:
            content_elem = soup.find('body')
        
        if content_elem:
            # Remove navigation, header, footer elements
            for elem in content_elem.find_all(['nav', 'header', 'footer', '.navigation', '.nav']):
                elem.decompose()
            
            # Extract text content
            content = self.clean_text(content_elem.get_text())
        
        return content
    
    def scrape_page(self, url):
        """Scrape a single page"""
        if url in self.visited_urls:
            return None
        
        try:
            print(f"Scraping: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract metadata
            metadata = self.extract_metadata(soup, url)
            
            # Extract content
            content = self.extract_content(soup)
            
            # Skip if no meaningful content
            if len(content.strip()) < 100:
                print(f"Skipping {url} - insufficient content")
                return None
            
            # Extract images
            images = self.extract_images(soup, url)
            
            # Calculate word count and reading time
            word_count = len(content.split())
            reading_time = max(1, round(word_count / 200))  # 200 words per minute
            
            # Create article data
            article_data = {
                'id': len(self.scraped_data) + 1,
                'url': url,
                'relative_url': url.replace(self.base_url, ''),
                'title': metadata['title'],
                'content': content,
                'author': metadata['author'],
                'category': metadata['category'],
                'images': images,
                'word_count': word_count,
                'reading_time': reading_time,
                'scraped_at': datetime.now().isoformat(),
                'scraped_url': url
            }
            
            self.visited_urls.add(url)
            return article_data
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return None
    
    def find_article_links(self, soup, base_url):
        """Find all article links on a page"""
        links = set()
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(base_url, href)
            
            # Only include links from the same domain
            if not full_url.startswith(self.base_url):
                continue
            
            # Skip certain file types and fragments
            if any(full_url.endswith(ext) for ext in ['.pdf', '.jpg', '.png', '.gif', '.css', '.js']):
                continue
            
            if '#' in full_url:
                full_url = full_url.split('#')[0]
            
            # Skip if already visited
            if full_url in self.visited_urls:
                continue
            
            links.add(full_url)
        
        return links
    
    def scrape_website(self, max_pages=100):
        """Scrape the entire website"""
        print(f"Starting to scrape {self.base_url}")
        
        # Start with the homepage
        urls_to_visit = {self.base_url}
        pages_scraped = 0
        
        while urls_to_visit and pages_scraped < max_pages:
            url = urls_to_visit.pop()
            
            # Scrape the page
            article_data = self.scrape_page(url)
            if article_data:
                self.scraped_data.append(article_data)
                pages_scraped += 1
                print(f"Scraped {pages_scraped}/{max_pages}: {article_data['title'][:50]}...")
            
            # Find more links to scrape
            try:
                response = self.session.get(url, timeout=10)
                soup = BeautifulSoup(response.content, 'html.parser')
                new_links = self.find_article_links(soup, url)
                urls_to_visit.update(new_links)
            except Exception as e:
                print(f"Error finding links on {url}: {e}")
            
            # Be respectful - add delay
            time.sleep(1)
        
        print(f"Scraping completed. Found {len(self.scraped_data)} articles.")
        return self.scraped_data
    
    def save_data(self, filename='scraped_data.json'):
        """Save scraped data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.scraped_data, f, ensure_ascii=False, indent=2)
        
        print(f"Saved {len(self.scraped_data)} articles to {filename}")
        
        # Also save a summary
        summary = {
            'total_articles': len(self.scraped_data),
            'categories': list(set(article['category'] for article in self.scraped_data if article['category'])),
            'authors': list(set(article['author'] for article in self.scraped_data if article['author'])),
            'total_words': sum(article['word_count'] for article in self.scraped_data),
            'scraped_at': datetime.now().isoformat()
        }
        
        with open('scrape_summary.json', 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        print(f"Saved summary to scrape_summary.json")

def main():
    scraper = ZeilerScraper()
    
    # Scrape the website
    scraped_data = scraper.scrape_website(max_pages=50)  # Limit to 50 pages for now
    
    # Save the data
    scraper.save_data()
    
    print("\n" + "="*50)
    print("SCRAPING COMPLETED")
    print("="*50)
    print(f"Total articles scraped: {len(scraped_data)}")
    print(f"Total images downloaded: {len(scraper.images_downloaded)}")
    print("\nNext steps:")
    print("1. Run 'python3 integrate_content.py' to process the scraped data")
    print("2. The processed data will be saved to 'src/data/articles_comprehensive.js'")

if __name__ == '__main__':
    main()