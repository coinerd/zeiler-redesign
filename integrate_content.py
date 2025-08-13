#!/usr/bin/env python3
"""
Content Integration Script for Zeiler Redesign
Processes scraped content and generates React-compatible data files
"""

import json
import os
import re
from datetime import datetime

def load_scraped_data():
    """Load scraped data from JSON file"""
    try:
        with open('scraped_data.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("⚠️  No scraped data found. Run 'python3 scrape_zeiler.py' first.")
        return []
    except Exception as e:
        print(f"❌ Error loading scraped data: {e}")
        return []

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
        cleaned_content = re.sub(pattern, '', cleaned_content, flags=re.DOTALL | re.IGNORECASE)

    # Clean whitespace but preserve paragraph structure
    cleaned_content = re.sub(r'\n\s*\n\s*\n', '\n\n', cleaned_content)  # Multiple line breaks to double
    cleaned_content = re.sub(r'^\s+|\s+$', '', cleaned_content, flags=re.MULTILINE)  # Whitespace at line start/end
    cleaned_content = cleaned_content.strip()

    return cleaned_content

def generate_excerpt(content, max_length=200):
    """Generate an excerpt from content"""
    if not content:
        return ''
    
    # Clean content first
    clean_text = re.sub(r'[^\w\s\.\!\?]', ' ', content)
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    
    if len(clean_text) <= max_length:
        return clean_text
    
    # Try to cut at sentence end
    truncated = clean_text[:max_length]
    last_sentence = max(
        truncated.rfind('.'),
        truncated.rfind('!'),
        truncated.rfind('?')
    )
    
    if last_sentence > max_length * 0.7:
        return truncated[:last_sentence + 1]
    
    # Fallback: cut at word boundary
    last_space = truncated.rfind(' ')
    if last_space > 0:
        return truncated[:last_space] + '...'
    
    return truncated + '...'

def process_scraped_articles(scraped_data):
    """Process scraped articles into the format needed for the React app"""
    processed_articles = []
    
    for i, raw_article in enumerate(scraped_data):
        try:
            # Clean and process the article data
            title = clean_title(raw_article.get('title', ''))
            content = clean_content(raw_article.get('content', ''))
            
            # Skip articles with insufficient content
            if len(content.strip()) < 100:
                continue
            
            # Generate excerpt
            excerpt = generate_excerpt(content)
            
            # Process images
            images = []
            for img in raw_article.get('images', []):
                if isinstance(img, dict):
                    images.append({
                        'src': f"/src/assets/{img.get('src', '')}",
                        'alt': img.get('alt', f"Bild zu {title}")
                    })
            
            # Determine category from URL
            url = raw_article.get('relative_url', raw_article.get('url', ''))
            category = 'andere'  # default
            
            if '/detlef/' in url:
                if '/geschichte/' in url:
                    category = 'geschichte'
                elif '/medien/' in url:
                    category = 'medien'
                elif '/deutsch/' in url:
                    category = 'deutsch'
                elif '/projekte/' in url:
                    category = 'projekte'
                else:
                    category = 'detlef'
            elif '/julian/' in url:
                if '/techzap/' in url:
                    category = 'techzap'
                else:
                    category = 'julian'
            
            # Create display URL for hash routing
            display_url = f"/#/{url.strip('/')}" if url else f"/#/artikel-{i+1}"
            
            # Calculate reading time
            word_count = len(content.split())
            reading_time = max(1, round(word_count / 200))
            
            processed_article = {
                'id': i + 1,
                'title': title,
                'excerpt': excerpt,
                'content': content,
                'url': url,
                'display_url': display_url,
                'images': images,
                'author': raw_article.get('author', 'ZEILER.me'),
                'category': category,
                'scraped_url': raw_article.get('scraped_url', raw_article.get('url', '')),
                'word_count': word_count,
                'reading_time': reading_time
            }
            
            processed_articles.append(processed_article)
            
        except Exception as e:
            print(f"❌ Error processing article {i}: {e}")
            continue
    
    return processed_articles

def generate_test_articles():
    """Generate test articles as fallback when no scraped data is available"""
    
    test_articles = [
        # Detlef - Geschichte
        {
            "id": 1,
            "title": "Alexis de Tocqueville über die plötzliche Grausamkeit in einer unglücklichen Zeit",
            "excerpt": "Tocqueville beschreibt in seinen Erinnerungen, wie schnell sich friedfertige Menschen in Krisenzeiten zu Gewalt hinreißen lassen.",
            "content": """Alexis de Tocqueville (1805-1859) ist vor allem mit seinem Buch „Über die Demokratie in Amerika" (1835/1840) bekannt geworden. In seinen „Erinnerungen" hinterlässt er aber auch ein lebensnahes historisches Dokument über die Geschehnisse der 1848er Revolution und der niedergeschlagenen Juniaufstände der Arbeiter von 1848.

So schildert er, was für Auswirkungen die Bürgerkriegsatmosphäre auf seine Nachbarn, die bei der Nationalgarde Dienst taten, und auf ihn selbst hatte:

„Als ich mit ihnen sprach, bemerkte ich, mit welch erschreckender Schnelligkeit selbst in einem zivilisierten Jahrhundert wie dem unseren die friedfertigsten Seelen sich sozusagen auf Bürgerkriege einstimmen und wie sich der Geschmack an der Gewalt und die Verachtung des Menschenlebens plötzlich in dieser unglücklichen Zeit dort ausbreiten.

Die Menschen, mit denen ich mich unterhielt, waren gut gestellte und friedfertige Handwerker, deren sanfte und ein wenig weiche Gewohnheiten noch weiter von der Grausamkeit als vom Heroismus entfernt waren. Trotzdem dachten sie nur noch an Zerstörung und Massaker. Sie klagten darüber, dass man nicht mit Bomben, Minen und Gräben gegen die aufständischen Straßen vorging, und wollten gegenüber niemandem mehr Gnade walten lassen. […] als ich meinen Weg fortsetzte, kam ich nicht umhin, über mich selbst nachzudenken und über die Natur meiner Argumente zu staunen, mit der ich mich selbst unversehens binnen zweier Tage mit diesen Ideen erbarmungsloser Vernichtung und großer Härte vertraut gemacht hatte, die mir natürlicherweise so fern liegen."

Was Tocqueville hier selbstkritisch und reflektiert beschreibt, das wiederholt sich immer wieder in gesellschaftlichen Umbruchszeiten – und es scheint nicht vom jeweiligen Bildungsstand abzuhängen, wie sehr sich jemand von gewalthaltigen Ereignissen mitreißen lässt.

Die Decke der Zivilisation ist viel dünner, als man sich das in Friedenszeiten vorstellen mag. Schlimmer als ein plötzlicher Ausbruch von Gewalt, der danach reflektiert wird, ist aber die allmähliche Gewöhnung an verdeckte Gewalt, wie sie sich heute abzuzeichnen scheint.""",
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
            "content": """Heidelberg, heute eine der bekanntesten Städte Deutschlands, hat eine reiche mittelalterliche Geschichte, die bis ins 12. Jahrhundert zurückreicht.

Die erste urkundliche Erwähnung Heidelbergs stammt aus dem Jahr 1196, als der Ort noch „Heidelberch" genannt wurde. Der Name leitet sich vermutlich von „Heidel" (Heidekraut) und „berg" ab, was auf die ursprüngliche Vegetation der Gegend hinweist.

Im 13. Jahrhundert begann der Aufstieg Heidelbergs unter den Pfalzgrafen bei Rhein. Ludwig der Kelheimer verlegte seine Residenz nach Heidelberg und ließ die erste Burg auf dem Königstuhl errichten. Diese strategisch günstige Lage am Neckar machte Heidelberg zu einem wichtigen Handelszentrum.

Die Stadtrechte erhielt Heidelberg wahrscheinlich um 1196, spätestens aber 1225. Die mittelalterliche Stadt entwickelte sich planmäßig zwischen Neckar und Königstuhl. Die Hauptstraße bildete das Rückgrat der Siedlung, von der aus sich die Stadt nach Norden und Süden ausdehnte.

Ein Wendepunkt in der Geschichte war die Gründung der Universität Heidelberg im Jahr 1386 durch Kurfürst Ruprecht I. Sie war die erste Universität im Heiligen Römischen Reich deutscher Nation und machte Heidelberg zu einem bedeutenden Zentrum der Gelehrsamkeit.

Die mittelalterliche Stadtbefestigung umschloss ein Gebiet von etwa 68 Hektar. Reste der alten Stadtmauer sind heute noch sichtbar und zeugen von der wehrhaften Vergangenheit der Stadt. Die Heiliggeistkirche, deren Bau 1398 begann, wurde zum religiösen Zentrum der Stadt.""",
            "url": "/detlef/geschichte/heidelberg-mittelalter",
            "display_url": "/#/detlef/geschichte/heidelberg-mittelalter",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "geschichte",
            "scraped_url": "https://www.zeiler.me/detlef/geschichte/heidelberg-mittelalter",
            "word_count": 245,
            "reading_time": 2
        },
        {
            "id": 3,
            "title": "Die Reformation in der Kurpfalz",
            "excerpt": "Wie die Reformation das religiöse und politische Leben in der Kurpfalz veränderte.",
            "content": """Die Reformation hatte tiefgreifende Auswirkungen auf die Kurpfalz und ihre Hauptstadt Heidelberg. Als eine der ersten deutschen Territorien führte die Kurpfalz bereits 1546 unter Kurfürst Friedrich II. die lutherische Reformation ein.

Die Heidelberger Universität wurde zu einem Zentrum der reformatorischen Theologie. Hier lehrten bedeutende Reformatoren wie Zacharias Ursinus und Caspar Olevianus, die maßgeblich an der Entstehung des Heidelberger Katechismus beteiligt waren.

Der Heidelberger Katechismus von 1563 wurde unter Kurfürst Friedrich III. verfasst und sollte die verschiedenen protestantischen Strömungen vereinen. Er gilt als eines der wichtigsten Bekenntnisschriften des reformierten Protestantismus und prägte die religiöse Identität der Kurpfalz nachhaltig.

Die Reformation brachte jedoch auch Konflikte mit sich. Der Übergang vom Luthertum zum Calvinismus unter Friedrich III. führte zu Spannungen mit den lutherischen Nachbarterritorien und dem katholischen Kaiser.

Besonders dramatisch waren die Auswirkungen des Dreißigjährigen Krieges. Die protestantische Kurpfalz wurde zum Schauplatz verheerender Kämpfe. Heidelberg wurde mehrfach erobert und geplündert, die berühmte Bibliotheca Palatina nach Rom verschleppt.

Nach dem Westfälischen Frieden 1648 musste die Kurpfalz erhebliche Gebietsverluste hinnehmen. Die Reformation hatte das Territorium religiös und kulturell geprägt, aber auch politisch geschwächt.""",
            "url": "/detlef/geschichte/reformation-kurpfalz",
            "display_url": "/#/detlef/geschichte/reformation-kurpfalz",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "geschichte",
            "scraped_url": "https://www.zeiler.me/detlef/geschichte/reformation-kurpfalz",
            "word_count": 278,
            "reading_time": 2
        },
        {
            "id": 4,
            "title": "Medienerziehung in der digitalen Welt",
            "excerpt": "Herausforderungen und Chancen der Medienerziehung im Zeitalter von Internet und sozialen Medien.",
            "content": """Die Medienerziehung steht heute vor völlig neuen Herausforderungen. Die Digitalisierung hat die Medienlandschaft grundlegend verändert und erfordert neue pädagogische Ansätze.

Kinder und Jugendliche wachsen heute als „Digital Natives" auf. Sie nutzen Smartphones, Tablets und Computer selbstverständlich, oft bevor sie lesen und schreiben können. Diese frühe Mediennutzung bringt sowohl Chancen als auch Risiken mit sich.

Zu den wichtigsten Kompetenzen gehört die Fähigkeit zur kritischen Bewertung von Informationen. In Zeiten von Fake News und Filterblasen müssen junge Menschen lernen, Quellen zu prüfen und verschiedene Perspektiven zu berücksichtigen.

Der Datenschutz ist ein weiterer zentraler Aspekt. Viele Nutzer geben unbedacht persönliche Daten preis, ohne die langfristigen Konsequenzen zu verstehen. Hier ist Aufklärung über Privatsphäre-Einstellungen und den Wert persönlicher Daten notwendig.

Cybermobbing stellt eine neue Form der Gewalt dar, die rund um die Uhr stattfinden kann. Präventionsarbeit und der Aufbau von Empathie im digitalen Raum sind daher essentiell.

Gleichzeitig bieten digitale Medien enorme Bildungschancen. Interaktive Lernplattformen, Erklärvideos und virtuelle Realität können das Lernen bereichern und individualisieren.

Die Medienerziehung muss daher einen ausgewogenen Ansatz verfolgen: Risiken aufzeigen, ohne zu verteufeln, und Chancen nutzen, ohne naiv zu sein.""",
            "url": "/detlef/medien/medienerziehung-digital",
            "display_url": "/#/detlef/medien/medienerziehung-digital",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "medien",
            "scraped_url": "https://www.zeiler.me/detlef/medien/medienerziehung-digital",
            "word_count": 312,
            "reading_time": 2
        },
        {
            "id": 5,
            "title": "Fake News erkennen und bewerten",
            "excerpt": "Strategien und Methoden zur Identifikation von Falschinformationen in digitalen Medien.",
            "content": """In der heutigen Informationsgesellschaft ist die Fähigkeit, Fake News zu erkennen, zu einer Schlüsselkompetenz geworden. Die Verbreitung von Falschinformationen hat durch soziale Medien eine neue Dimension erreicht.

Fake News sind bewusst falsche oder irreführende Informationen, die als echte Nachrichten präsentiert werden. Sie können verschiedene Formen annehmen: von völlig erfundenen Geschichten bis hin zu manipulierten Bildern oder aus dem Kontext gerissenen Zitaten.

Die Motivation hinter Fake News ist vielfältig. Manchmal geht es um politische Meinungsmache, manchmal um wirtschaftliche Interessen durch Klicks und Werbeeinnahmen. Auch persönliche Rache oder der Wunsch nach Aufmerksamkeit können Motive sein.

Zur Erkennung von Fake News gibt es bewährte Strategien: Zunächst sollte man die Quelle prüfen. Seriöse Medien haben ein Impressum und transparente Redaktionsstrukturen. Unbekannte Websites oder Accounts ohne klare Identität sind verdächtig.

Der Faktencheck ist ein weiteres wichtiges Instrument. Mehrere unabhängige Quellen sollten die gleiche Information bestätigen. Faktenchecker-Websites wie Correctiv oder Mimikama helfen bei der Überprüfung zweifelhafter Meldungen.

Auch emotionale Manipulation ist ein Warnsignal. Nachrichten, die starke Gefühle wie Wut oder Angst auslösen sollen, verdienen besondere Skepsis. Seriöser Journalismus bemüht sich um Sachlichkeit und Ausgewogenheit.

Schließlich ist gesunder Menschenverstand gefragt: Klingt eine Meldung zu spektakulär oder zu schön, um wahr zu sein, ist Vorsicht geboten.""",
            "url": "/detlef/medien/fake-news-erkennen",
            "display_url": "/#/detlef/medien/fake-news-erkennen",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "medien",
            "scraped_url": "https://www.zeiler.me/detlef/medien/fake-news-erkennen",
            "word_count": 298,
            "reading_time": 2
        },
        {
            "id": 6,
            "title": "Goethe: Der Erlkönig - Interpretation",
            "excerpt": "Eine detaillierte Analyse von Goethes berühmter Ballade und ihrer literarischen Bedeutung.",
            "content": """Goethes 'Erlkönig' aus dem Jahr 1782 ist eine der bekanntesten deutschen Balladen und ein Meisterwerk der deutschen Literatur. Die Ballade erzählt die dramatische Geschichte eines Vaters, der mit seinem kranken Kind durch die Nacht reitet.

Die Handlung ist schnell erzählt: Ein Vater reitet mit seinem fiebernden Sohn durch einen dunklen Wald. Das Kind glaubt, den Erlkönig zu sehen und zu hören, der es zu sich locken will. Der Vater versucht, das Kind zu beruhigen und rational zu erklären, was es sieht. Am Ende erreichen sie den Hof, doch das Kind ist tot.

Die Interpretation der Ballade ist vielschichtig. Auf der Oberfläche handelt es sich um eine Geistergeschichte aus der Welt der Volksmärchen. Der Erlkönig als mythische Gestalt verkörpert die Macht des Todes, die besonders Kinder bedroht.

Auf einer tieferen Ebene lässt sich die Ballade als Konflikt zwischen Rationalität und Irrationalität lesen. Der Vater repräsentiert die aufgeklärte, rationale Weltsicht, während das Kind in einer Welt voller Fantasie und Ängste lebt.

Die sprachliche Gestaltung ist meisterhaft. Goethe verwendet verschiedene Sprechweisen für die drei Stimmen: die erzählende Stimme, den besorgten Vater und das ängstliche Kind. Der Erlkönig spricht in verführerischen, melodischen Versen.

Das Versmaß und der Rhythmus verstärken die dramatische Spannung. Die Ballade beginnt ruhig, wird aber immer hektischer, bis sie im tragischen Ende kulminiert.

Schuberts Vertonung von 1815 hat die Popularität der Ballade noch gesteigert und zeigt, wie Musik und Literatur sich gegenseitig bereichern können.""",
            "url": "/detlef/deutsch/goethe-erlkoenig",
            "display_url": "/#/detlef/deutsch/goethe-erlkoenig",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "deutsch",
            "scraped_url": "https://www.zeiler.me/detlef/deutsch/goethe-erlkoenig",
            "word_count": 356,
            "reading_time": 2
        },
        {
            "id": 7,
            "title": "Erörterung: Digitalisierung in der Schule",
            "excerpt": "Pro und Contra der zunehmenden Digitalisierung im Bildungswesen.",
            "content": """Die Digitalisierung der Schulen ist ein viel diskutiertes Thema, das sowohl Befürworter als auch Kritiker auf den Plan ruft. Die Corona-Pandemie hat die Debatte zusätzlich angeheizt und Defizite wie Chancen gleichermaßen aufgezeigt.

Für die Digitalisierung sprechen mehrere gewichtige Argumente. Zunächst entspricht sie der Lebenswelt der Schüler. Kinder und Jugendliche sind mit digitalen Medien aufgewachsen und nutzen sie selbstverständlich. Die Schule sollte diese Realität anerkennen und produktiv nutzen.

Digitale Medien ermöglichen individualisiertes Lernen. Lernprogramme können sich an das Tempo und die Bedürfnisse einzelner Schüler anpassen. Schwächere Schüler erhalten zusätzliche Übungen, stärkere können schneller voranschreiten.

Auch die Motivation kann durch digitale Medien gesteigert werden. Interaktive Lernspiele, Simulationen und multimediale Inhalte können trockenen Stoff lebendig machen und verschiedene Lerntypen ansprechen.

Kritiker wenden jedoch ein, dass die Digitalisierung auch Risiken birgt. Die ständige Verfügbarkeit digitaler Ablenkungen kann die Konzentrationsfähigkeit beeinträchtigen. Studien zeigen, dass handschriftliche Notizen oft besser im Gedächtnis bleiben als getippte.

Ein weiteres Problem ist die digitale Kluft. Nicht alle Familien können sich die notwendige Ausstattung leisten. Dies könnte bestehende Bildungsungleichheiten verstärken statt verringern.

Zudem besteht die Gefahr einer Überbetonung der Technik auf Kosten der Inhalte. Computer und Tablets sind nur Werkzeuge – entscheidend bleibt die pädagogische Qualität des Unterrichts.

Ein ausgewogener Ansatz scheint daher sinnvoll: Digitale Medien dort einsetzen, wo sie echten Mehrwert bieten, aber traditionelle Methoden nicht völlig verdrängen.""",
            "url": "/detlef/deutsch/digitalisierung-schule",
            "display_url": "/#/detlef/deutsch/digitalisierung-schule",
            "images": [],
            "author": "Detlef Zeiler",
            "category": "deutsch",
            "scraped_url": "https://www.zeiler.me/detlef/deutsch/digitalisierung-schule",
            "word_count": 387,
            "reading_time": 2
        },
        {
            "id": 8,
            "title": "React Hooks: Ein praktischer Leitfaden",
            "excerpt": "Eine praktische Anleitung zu React Hooks und deren Verwendung in modernen React-Anwendungen.",
            "content": """React Hooks haben die Art, wie wir React-Komponenten schreiben, revolutioniert. Seit ihrer Einführung in React 16.8 ermöglichen sie es, State und andere React-Features in Funktionskomponenten zu verwenden, ohne Klassen schreiben zu müssen.

Der useState Hook ist der grundlegendste und am häufigsten verwendete Hook. Er ermöglicht es, lokalen State in Funktionskomponenten zu verwalten. Die Syntax ist einfach und intuitiv: const [state, setState] = useState(initialValue).

Ein praktisches Beispiel zeigt die Verwendung:

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Du hast {count} mal geklickt</p>
      <button onClick={() => setCount(count + 1)}>
        Klick mich
      </button>
    </div>
  );
}
```

Der useEffect Hook ersetzt die Lifecycle-Methoden von Klassenkomponenten. Er wird für Side Effects wie API-Aufrufe, Subscriptions oder DOM-Manipulationen verwendet. Der Hook läuft nach jedem Render, kann aber durch ein Dependency Array kontrolliert werden.

Weitere wichtige Hooks sind useContext für den Zugriff auf React Context, useReducer für komplexere State-Logik und useMemo für Performance-Optimierungen.

Custom Hooks ermöglichen es, Logik zwischen Komponenten zu teilen. Sie sind einfach JavaScript-Funktionen, die andere Hooks verwenden und mit 'use' beginnen.

Die Regeln der Hooks sind wichtig: Sie dürfen nur auf der obersten Ebene von React-Funktionen aufgerufen werden, nicht in Schleifen, Bedingungen oder verschachtelten Funktionen.""",
            "url": "/julian/techzap/react-hooks",
            "display_url": "/#/julian/techzap/react-hooks",
            "images": [],
            "author": "Julian Zeiler",
            "category": "techzap",
            "scraped_url": "https://www.zeiler.me/julian/techzap/react-hooks",
            "word_count": 298,
            "reading_time": 2
        },
        {
            "id": 9,
            "title": "Linux Server Administration Grundlagen",
            "excerpt": "Wichtige Befehle und Konzepte für die Verwaltung von Linux-Servern.",
            "content": """Die Administration von Linux-Servern erfordert Kenntnisse verschiedener Befehle und Konzepte. Linux ist das dominierende Betriebssystem für Server und bietet Stabilität, Sicherheit und Flexibilität.

Die Kommandozeile ist das wichtigste Werkzeug für Serveradministratoren. Grundlegende Befehle wie ls, cd, mkdir, rm und cp sollten in Fleisch und Blut übergehen. Der Texteditor vi oder nano ist unverzichtbar für die Konfiguration.

Das Dateisystem zu verstehen ist fundamental. Linux organisiert alles in einer Baumstruktur, beginnend mit dem Root-Verzeichnis (/). Wichtige Verzeichnisse sind /etc für Konfigurationsdateien, /var für variable Daten und /home für Benutzerdaten.

Benutzer- und Rechteverwaltung sind kritische Sicherheitsaspekte. Der Befehl sudo ermöglicht es, Befehle mit erhöhten Rechten auszuführen. Dateiberechtigungen werden mit chmod gesetzt, Besitzer mit chown geändert.

Prozessverwaltung ist ein weiterer wichtiger Bereich. Mit ps können laufende Prozesse angezeigt, mit kill beendet werden. Der htop-Befehl bietet eine übersichtliche Darstellung der Systemauslastung.

Netzwerkkonfiguration umfasst die Einrichtung von IP-Adressen, Routing und Firewall-Regeln. Tools wie netstat, ss und iptables sind hier unverzichtbar.

Systemdienste werden meist über systemctl verwaltet. Dieser Befehl ermöglicht das Starten, Stoppen und Überwachen von Services wie Webservern oder Datenbanken.

Regelmäßige Backups und Monitoring sind essentiell für einen stabilen Serverbetrieb. Tools wie rsync für Backups und nagios für Monitoring helfen dabei.""",
            "url": "/julian/techzap/linux-server-admin",
            "display_url": "/#/julian/techzap/linux-server-admin",
            "images": [],
            "author": "Julian Zeiler",
            "category": "techzap",
            "scraped_url": "https://www.zeiler.me/julian/techzap/linux-server-admin",
            "word_count": 312,
            "reading_time": 2
        },
        {
            "id": 10,
            "title": "CSS Grid Layout: Moderne Webentwicklung",
            "excerpt": "Wie CSS Grid das Layout-Design revolutioniert und praktische Anwendungsbeispiele.",
            "content": """CSS Grid ist ein mächtiges Layout-System, das zweidimensionale Layouts ermöglicht und die Webentwicklung revolutioniert hat. Im Gegensatz zu Flexbox, das eindimensional arbeitet, kann Grid sowohl Zeilen als auch Spalten gleichzeitig verwalten.

Die Grundlagen von CSS Grid sind schnell erklärt. Ein Grid-Container wird mit display: grid definiert. Dann können Spalten mit grid-template-columns und Zeilen mit grid-template-rows festgelegt werden.

Ein einfaches Beispiel zeigt die Mächtigkeit:

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}
```

Grid-Items können explizit positioniert werden. Mit grid-column und grid-row lassen sich Elemente präzise platzieren. Dies ermöglicht komplexe Layouts, die früher nur mit Tricks möglich waren.

Besonders praktisch sind Grid-Areas. Mit grid-template-areas können Layouts semantisch definiert werden:

```css
.layout {
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}
```

Responsive Design wird mit Grid deutlich einfacher. Die repeat()-Funktion und auto-fit/auto-fill ermöglichen flexible Layouts, die sich automatisch an verschiedene Bildschirmgrößen anpassen.

Grid löst viele klassische CSS-Probleme: vertikale Zentrierung, gleich hohe Spalten und komplexe Layouts werden trivial. Die Browser-Unterstützung ist mittlerweile ausgezeichnet.

Für moderne Webentwicklung ist CSS Grid unverzichtbar geworden. Es ergänzt Flexbox perfekt und ermöglicht saubere, wartbare Layouts.""",
            "url": "/julian/techzap/css-grid-layout",
            "display_url": "/#/julian/techzap/css-grid-layout",
            "images": [],
            "author": "Julian Zeiler",
            "category": "techzap",
            "scraped_url": "https://www.zeiler.me/julian/techzap/css-grid-layout",
            "word_count": 334,
            "reading_time": 2
        }
    ]
        
    return test_articles

if __name__ == '__main__':
    print("🚀 Processing scraped content...")
    
    # Try to load scraped data first
    scraped_data = load_scraped_data()
    
    if scraped_data:
        print(f"📄 Found {len(scraped_data)} scraped articles")
        processed_articles = process_scraped_articles(scraped_data)
        print(f"✅ Processed {len(processed_articles)} articles from scraped data")
    else:
        print("📝 No scraped data found, using test articles...")
        processed_articles = generate_test_articles()
        print(f"✅ Generated {len(processed_articles)} test articles")

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
        print(f"✅ Generated {output_file} with {len(processed_articles)} articles!")
        
        if scraped_data:
            print("✅ Real scraped content integrated successfully!")
        else:
            print("✅ Test articles generated successfully!")
            print("💡 To use real content, run: python3 scrape_zeiler.py")
            
    except Exception as e:
        print(f"❌ Error writing {output_file}: {e}")
        print("❌ Failed to generate articles!")
        exit(1)