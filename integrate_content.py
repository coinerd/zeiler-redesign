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

def generate_test_articles():
    """Generate comprehensive test articles for all categories"""
    
    test_articles = [
        # Detlef - Geschichte
        {
            "id": 1,
            "title": "Alexis de Tocqueville über die plötzliche Grausamkeit in einer unglücklichen Zeit",
            "excerpt": "Tocqueville beschreibt in seinen Erinnerungen, wie schnell sich friedfertige Menschen in Krisenzeiten zu Gewalt hinreißen lassen.",
            "content": "Alexis de Tocqueville (1805-1859) ist vor allem mit seinem Buch „Über die Demokratie in Amerika" (1835/1840) bekannt geworden. In seinen „Erinnerungen" hinterlässt er aber auch ein lebensnahes historisches Dokument über die Geschehnisse der 1848er Revolution und der niedergeschlagenen Juniaufstände der Arbeiter von 1848.\n\nSo schildert er, was für Auswirkungen die Bürgerkriegsatmosphäre auf seine Nachbarn, die bei der Nationalgarde Dienst taten, und auf ihn selbst hatte:\n\n„Als ich mit ihnen sprach, bemerkte ich, mit welch erschreckender Schnelligkeit selbst in einem zivilisierten Jahrhundert wie dem unseren die friedfertigsten Seelen sich sozusagen auf Bürgerkriege einstimmen und wie sich der Geschmack an der Gewalt und die Verachtung des Menschenlebens plötzlich in dieser unglücklichen Zeit dort ausbreiten.\n\nDie Menschen, mit denen ich mich unterhielt, waren gut gestellte und friedfertige Handwerker, deren sanfte und ein wenig weiche Gewohnheiten noch weiter von der Grausamkeit als vom Heroismus entfernt waren. Trotzdem dachten sie nur noch an Zerstörung und Massaker. Sie klagten darüber, dass man nicht mit Bomben, Minen und Gräben gegen die aufständischen Straßen vorging, und wollten gegenüber niemandem mehr Gnade walten lassen. […] als ich meinen Weg fortsetzte, kam ich nicht umhin, über mich selbst nachzudenken und über die Natur meiner Argumente zu staunen, mit der ich mich selbst unversehens binnen zweier Tage mit diesen Ideen erbarmungsloser Vernichtung und großer Härte vertraut gemacht hatte, die mir natürlicherweise so fern liegen."\n\nWas Tocqueville hier selbstkritisch und reflektiert beschreibt, das wiederholt sich immer wieder in gesellschaftlichen Umbruchszeiten – und es scheint nicht vom jeweiligen Bildungsstand abzuhängen, wie sehr sich jemand von gewalthaltigen Ereignissen mitreißen lässt.\n\nDie Decke der Zivilisation ist viel dünner, als man sich das in Friedenszeiten vorstellen mag. Schlimmer als ein plötzlicher Ausbruch von Gewalt, der danach reflektiert wird, ist aber die allmähliche Gewöhnung an verdeckte Gewalt, wie sie sich heute abzuzeichnen scheint.",
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
            "content": "Heidelberg, heute eine der bekanntesten Städte Deutschlands, hat eine reiche mittelalterliche Geschichte, die bis ins 12. Jahrhundert zurückreicht.\n\nDie erste urkundliche Erwähnung Heidelbergs stammt aus dem Jahr 1196, als der Ort noch „Heidelberch" genannt wurde. Der Name leitet sich vermutlich von „Heidelbeere" ab, was auf die waldreiche Umgebung hinweist.\n\nIm 13. Jahrhundert entwickelte sich Heidelberg unter den Pfalzgrafen bei Rhein zu einem wichtigen politischen und wirtschaftlichen Zentrum. Die strategisch günstige Lage am Neckar und die Kontrolle über wichtige Handelswege trugen zu diesem Aufstieg bei.\n\nEin Wendepunkt in der Geschichte der Stadt war die Gründung der Universität Heidelberg im Jahr 1386 durch Kurfürst Ruprecht I. Sie war die erste Universität im Heiligen Römischen Reich deutscher Nation und zog Gelehrte aus ganz Europa an.\n\nDas Heidelberger Schloss, dessen älteste Teile aus dem 14. Jahrhundert stammen, wurde zum Symbol der kurpfälzischen Macht und zu einem der bedeutendsten Renaissanceschlösser nördlich der Alpen.",
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
            "content": "Die Reformation hatte tiefgreifende Auswirkungen auf die Kurpfalz und ihre Hauptstadt Heidelberg. Kurfürst Friedrich II. führte 1546 die Reformation ein und machte die Kurpfalz zu einem der wichtigsten protestantischen Territorien im Reich.\n\nDie Universität Heidelberg wurde zu einem Zentrum der reformatorischen Theologie. Hier lehrten bedeutende Theologen wie Zacharias Ursinus und Caspar Olevianus, die maßgeblich an der Entstehung des Heidelberger Katechismus beteiligt waren.\n\nDer Heidelberger Katechismus von 1563 wurde zu einem der wichtigsten Bekenntnisschriften des reformierten Protestantismus und fand Verbreitung in ganz Europa und den amerikanischen Kolonien.\n\nDie konfessionellen Spannungen führten jedoch auch zu politischen Konflikten. Die Kurpfalz wurde zu einem der Hauptschauplätze der Religionskriege des 16. und 17. Jahrhunderts.",
            "url": "/detlef/geschichte/reformation-kurpfalz",
            "display_url": "/#/detlef/geschichte/reformation-kurpfalz",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "geschichte",
            "scraped_url": "https://www.zeiler.me/detlef/geschichte/reformation-kurpfalz",
            "word_count": 156,
            "reading_time": 1
        },
        
        # Detlef - Medien
        {
            "id": 4,
            "title": "Medienerziehung in der digitalen Welt",
            "excerpt": "Herausforderungen und Chancen der Medienerziehung im Zeitalter von Internet und sozialen Medien.",
            "content": "Die Medienerziehung steht heute vor völlig neuen Herausforderungen. Während früher hauptsächlich Fernsehen, Radio und Printmedien im Fokus standen, müssen wir heute Kinder und Jugendliche auf eine komplexe digitale Medienwelt vorbereiten.\n\nSoziale Medien, Streaming-Dienste, Online-Spiele und mobile Apps prägen den Alltag junger Menschen. Dabei entstehen neue Risiken: Cybermobbing, Datenschutzprobleme, Fake News und Suchtverhalten sind nur einige der Herausforderungen.\n\nGleichzeitig bieten digitale Medien auch große Chancen: kreative Gestaltungsmöglichkeiten, globale Vernetzung, Zugang zu Wissen und neue Formen des Lernens.\n\nEine moderne Medienerziehung muss daher sowohl kritische Medienkompetenz als auch kreative Mediengestaltung fördern. Schüler sollen lernen, Medieninhalte zu hinterfragen, eigene Inhalte zu erstellen und verantwortungsvoll mit digitalen Medien umzugehen.",
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
            "content": "In der heutigen Informationsgesellschaft ist die Fähigkeit, Fake News zu erkennen, zu einer Schlüsselkompetenz geworden. Falschinformationen verbreiten sich in sozialen Medien oft schneller als seriöse Nachrichten.\n\nTypische Merkmale von Fake News sind: reißerische Überschriften, fehlende Quellenangaben, emotionale Sprache, einseitige Darstellung und die Verbreitung über dubiose Websites.\n\nZur Überprüfung von Nachrichten können verschiedene Strategien angewendet werden:\n\n1. Quellencheck: Ist die Quelle seriös und bekannt?\n2. Autor prüfen: Wer hat den Artikel geschrieben?\n3. Datum beachten: Ist die Information aktuell?\n4. Andere Quellen suchen: Berichten auch andere Medien darüber?\n5. Fact-Checking-Websites nutzen: Plattformen wie Correctiv oder Mimikama helfen bei der Überprüfung.\n\nBesonders wichtig ist es, bei emotionalen Reaktionen auf eine Nachricht innezuhalten und die Information kritisch zu hinterfragen, bevor man sie weiterteilt.",
            "url": "/detlef/medien/fake-news-erkennen",
            "display_url": "/#/detlef/medien/fake-news-erkennen",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "medien",
            "scraped_url": "https://www.zeiler.me/detlef/medien/fake-news-erkennen",
            "word_count": 201,
            "reading_time": 1
        },
        
        # Detlef - Deutsch
        {
            "id": 6,
            "title": "Interpretation: Goethes 'Erlkönig'",
            "excerpt": "Eine detaillierte Analyse von Goethes berühmter Ballade und ihrer literarischen Bedeutung.",
            "content": "Goethes 'Erlkönig' aus dem Jahr 1782 ist eine der bekanntesten deutschen Balladen und ein Meisterwerk der Romantik.\n\nDie Ballade erzählt die Geschichte eines Vaters, der mit seinem kranken Kind durch die Nacht reitet. Das Kind glaubt, den Erlkönig zu sehen und zu hören, der es zu sich locken will. Der Vater versucht das Kind zu beruhigen und rational zu erklären, was es sieht und hört.\n\nDie Spannung steigert sich durch den Dialog zwischen Vater und Kind sowie durch die Stimme des Erlkönigs. Goethe verwendet verschiedene sprachliche Mittel:\n\n- Personifikation der Natur (Wind wird zu Erlkönigs Stimme)\n- Steigerung der Bedrohung in drei Stufen\n- Wechsel zwischen rationaler Erklärung und mystischer Wahrnehmung\n- Dramatischer Schluss mit dem Tod des Kindes\n\nDie Ballade kann auf verschiedenen Ebenen interpretiert werden: als Darstellung des Konflikts zwischen Rationalität und Irrationalität, als Kritik an der Aufklärung oder als psychologische Studie über Angst und Krankheit.\n\nSchuberts Vertonung von 1815 verstärkt die dramatische Wirkung durch die musikalische Umsetzung der verschiedenen Stimmen.",
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
            "content": "Die Digitalisierung der Schulen ist ein viel diskutiertes Thema, das sowohl Chancen als auch Risiken birgt.\n\nArgumente für die Digitalisierung:\n\n1. Zeitgemäße Bildung: Schüler müssen auf eine digitale Arbeitswelt vorbereitet werden\n2. Individualisierung: Digitale Medien ermöglichen personalisiertes Lernen\n3. Motivation: Interaktive Inhalte können das Interesse der Schüler steigern\n4. Effizienz: Digitale Verwaltung und Kommunikation sparen Zeit\n5. Barrierefreiheit: Digitale Hilfsmittel unterstützen Schüler mit besonderen Bedürfnissen\n\nArgumente gegen übermäßige Digitalisierung:\n\n1. Ablenkung: Digitale Geräte können vom Lernen ablenken\n2. Gesundheit: Zu viel Bildschirmzeit schadet den Augen und der Haltung\n3. Soziale Kompetenzen: Persönliche Interaktion wird reduziert\n4. Kosten: Anschaffung und Wartung sind teuer\n5. Datenschutz: Persönliche Daten der Schüler sind gefährdet\n\nFazit: Eine ausgewogene Digitalisierung, die traditionelle und digitale Methoden kombiniert, scheint der beste Weg zu sein. Wichtig ist, dass die Technik dem pädagogischen Ziel dient und nicht zum Selbstzweck wird.",
            "url": "/detlef/deutsch/digitalisierung-schule",
            "display_url": "/#/detlef/deutsch/digitalisierung-schule",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "deutsch",
            "scraped_url": "https://www.zeiler.me/detlef/deutsch/digitalisierung-schule",
            "word_count": 245,
            "reading_time": 1
        },
        
        # Julian - TechZap
        {
            "id": 8,
            "title": "Einführung in React Hooks",
            "excerpt": "Eine praktische Anleitung zu React Hooks und deren Verwendung in modernen React-Anwendungen.",
            "content": "React Hooks haben die Art, wie wir React-Komponenten schreiben, revolutioniert. Sie ermöglichen es, State und andere React-Features in Funktionskomponenten zu verwenden.\n\nDie wichtigsten Hooks:\n\n**useState**: Verwaltet lokalen State in Funktionskomponenten\n```javascript\nconst [count, setCount] = useState(0);\n```\n\n**useEffect**: Führt Seiteneffekte aus (ähnlich componentDidMount)\n```javascript\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```\n\n**useContext**: Ermöglicht den Zugriff auf React Context\n```javascript\nconst theme = useContext(ThemeContext);\n```\n\n**useReducer**: Alternative zu useState für komplexeren State\n```javascript\nconst [state, dispatch] = useReducer(reducer, initialState);\n```\n\nVorteile von Hooks:\n- Weniger Code als Klassenkomponenten\n- Bessere Wiederverwendbarkeit von Logik\n- Einfacheres Testen\n- Moderne React-Entwicklung\n\nHooks haben die React-Entwicklung vereinfacht und sind heute der Standard für neue React-Anwendungen.",
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
            "content": "Die Administration von Linux-Servern erfordert Kenntnisse verschiedener Befehle und Konzepte.\n\n**Wichtige Befehle:**\n\n- `ls -la`: Dateien und Verzeichnisse anzeigen\n- `cd`: Verzeichnis wechseln\n- `mkdir`: Verzeichnis erstellen\n- `rm -rf`: Dateien/Verzeichnisse löschen\n- `chmod`: Dateiberechtigungen ändern\n- `chown`: Besitzer ändern\n- `ps aux`: Laufende Prozesse anzeigen\n- `top`: Systemressourcen überwachen\n- `df -h`: Festplattenspeicher anzeigen\n- `free -h`: Arbeitsspeicher anzeigen\n\n**Systemdienste verwalten:**\n```bash\nsudo systemctl start nginx\nsudo systemctl enable nginx\nsudo systemctl status nginx\n```\n\n**Log-Dateien überwachen:**\n```bash\ntail -f /var/log/nginx/access.log\njournalctl -u nginx -f\n```\n\n**Netzwerk-Konfiguration:**\n```bash\nip addr show\nnetstat -tulpn\nss -tulpn\n```\n\n**Sicherheit:**\n- Regelmäßige Updates: `sudo apt update && sudo apt upgrade`\n- Firewall konfigurieren: `ufw enable`\n- SSH-Keys verwenden statt Passwörter\n- Fail2ban für Brute-Force-Schutz\n\nEine gute Server-Administration erfordert kontinuierliches Lernen und Übung.",
            "url": "/julian/techzap/linux-server-admin",
            "display_url": "/#/julian/techzap/linux-server-admin",
            "images": [],
            "author": "Julian Zeiler",
            "category": "techzap",
            "scraped_url": "https://www.zeiler.me/julian/techzap/linux-server-admin",
            "word_count": 234,
            "reading_time": 1
        },
        {
            "id": 10,
            "title": "Modern CSS Grid Layout",
            "excerpt": "Wie CSS Grid das Layout-Design revolutioniert und praktische Anwendungsbeispiele.",
            "content": "CSS Grid ist ein mächtiges Layout-System, das zweidimensionale Layouts ermöglicht und Flexbox perfekt ergänzt.\n\n**Grundlagen:**\n```css\n.container {\n  display: grid;\n  grid-template-columns: 1fr 2fr 1fr;\n  grid-template-rows: auto 1fr auto;\n  gap: 20px;\n}\n```\n\n**Grid-Bereiche definieren:**\n```css\n.container {\n  grid-template-areas:\n    'header header header'\n    'sidebar main aside'\n    'footer footer footer';\n}\n\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main { grid-area: main; }\n```\n\n**Responsive Design:**\n```css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n}\n```\n\n**Vorteile von CSS Grid:**\n- Zweidimensionale Layouts (Zeilen und Spalten)\n- Einfache responsive Designs\n- Weniger HTML-Markup nötig\n- Bessere Browser-Performance\n- Intuitive Syntax\n\n**Wann Grid vs. Flexbox verwenden:**\n- Grid: Für komplexe, zweidimensionale Layouts\n- Flexbox: Für eindimensionale Layouts und Komponenten\n\nCSS Grid hat die Art, wie wir Layouts erstellen, grundlegend verändert und ist heute ein unverzichtbares Tool für moderne Webentwicklung.",
            "url": "/julian/techzap/css-grid-layout",
            "display_url": "/#/julian/techzap/css-grid-layout",
            "images": [],
            "author": "Julian Zeiler",
            "category": "techzap",
            "scraped_url": "https://www.zeiler.me/julian/techzap/css-grid-layout",
            "word_count": 223,
            "reading_time": 1
        }
    ]
    
    return test_articles

def generate_articles_js():
    """Generate the articles.js file with comprehensive test data"""
    
    # Generate test articles
    processed_articles = generate_test_articles()
    
    # Generate JavaScript file content
    js_content = f"""// Generiert am: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
// Umfassende Test-Artikel-Datenbank für das Zeiler-Redesign

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
    
    # Create directory if it doesn't exist
    src_data_dir = os.path.join('src', 'data')
    if not os.path.exists(src_data_dir):
        os.makedirs(src_data_dir)
    
    # Write to file
    output_file = os.path.join(src_data_dir, 'articles_comprehensive.js')
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"✅ Successfully generated {output_file}")
        print(f"📊 Generated {len(processed_articles)} comprehensive test articles")
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
    print("🚀 Generating comprehensive test articles...")
    
    if generate_articles_js():
        print("✅ Comprehensive test articles generated successfully!")
    else:
        print("❌ Failed to generate test articles!")
        exit(1)