// Generiert am: 2025-08-13 17:51:08
// Automatisch generierte Artikel-Datenbank für das Zeiler-Redesign

export const articles = [
  {
    "id": 1,
    "title": "ZEILER .me - IT & Medien, Geschichte, Deutsch - Alexis de Tocqueville über die plötzliche Grausamkeit in einer unglücklichen Zeit",
    "excerpt": "Alexis de Tocqueville (1805-1859) ist vor allem mit seinem Buch \"Über die Demokratie in Amerika\" (1835/1840) bekannt geworden. In seinen \"Erinnerungen\" hinterlässt er aber auch ein lebensnahes...",
    "content": "Alexis de Tocqueville (1805-1859) ist vor allem mit seinem Buch \"Über die Demokratie in Amerika\" (1835/1840) bekannt geworden. In seinen \"Erinnerungen\" hinterlässt er aber auch ein lebensnahes historisches Dokument über die Geschehnisse der 1848er Revolution und der niedergeschlagenen Juniaufstände der Arbeiter von 1848. So schildert er, was für Auswirkungen die Bürgerkriegsatmosphäre auf seine Nachbarn, die bei der Nationalgarde Dienst taten, und auf ihn selbst hatte:\"Als ich mit ihnen sprach, bemerkte ich, mit welch erschreckender Schnelligkeit selbst in einem zivilisierten Jahrhundert wie dem unseren die friedfertigsten Seelen sich sozusagen auf Bürgerkriege einstimmen und wie sich der Geschmack an der Gewalt und die Verachtung des Menschenlebens plötzlich in dieser unglücklichen Zeit dort ausbreiten.Die Menschen, mit denen ich mich unterhielt, waren gut gestellte und friedfertige Handwerker, deren sanfte und ein wenig weiche Gewohnheiten noch weiter von der Grausamkeit als vom Heroismus entfernt waren. Trotzdem dachten sie nur noch an Zerstörung und Massaker. Sie klagten darüber, dass man nicht mit Bomben, Minen und Gräben gegen die aufständischen Straßen vorging, und wollten gegenüber niemandem mehr Gnade walten lassen. […] als ich meinen Weg fortsetzte, kam ich nicht umhin, über mich selbst nachzudenken und über die Natur meiner Argumente zu staunen, mit der ich mich selbst unversehens binnen zweier Tage mit diesen Ideen erbarmungsloser Vernichtung und großer Härte vertraut gemacht hatte, die mir natürlicherweise so fern liegen.\"Was Tocqueville hier selbstkritisch und reflektiert beschreibt, das wiederholt sich immer wieder in gesellschaftlichen Umbruchszeiten – und es scheint nicht vom jeweiligen Bildungsstand abzuhängen, wie sehr sich jemand von gewalthaltigen Ereignissen mitreißen lässt.Die Decke der Zivilisation ist viel dünner, als man sich das in Friedenszeiten vorstellen mag. Schlimmer als ein plötzlicher Ausbruch von Gewalt, der danach reflektiert wird, ist aber die allmähliche Gewöhnung an verdeckte Gewalt, wie sie sich heute abzuzeichnen scheint.",
    "url": "/detlef/geschichte/ber-die-pltzliche-grausamkeit-in-einer-unglcklichen-zeit",
    "display_url": "/#/detlef/geschichte/ber-die-pltzliche-grausamkeit-in-einer-unglcklichen-zeit",
    "images": [
      {
        "src": "tocqueville_portrait_531.jpg",
        "alt": "Artikel-Bild"
      }
    ],
    "author": "Detlef Zeiler",
    "category": "geschichte",
    "scraped_url": "https://www.zeiler.me/detlef/geschichte/ber-die-pltzliche-grausamkeit-in-einer-unglcklichen-zeit",
    "word_count": 296,
    "reading_time": 1
  }
];

// Suchfunktion
export function searchArticles(query) {
  if (!query || query.trim().length < 2) {
    return articles;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return articles.filter(article => {
    const searchableText = [
      article.title,
      article.excerpt,
      article.content,
      article.author,
      article.category
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
}

// Artikel nach URL finden
export function getArticleByUrl(url) {
  if (!url) return null;
  
  // Normalisiere URL
  const normalizedUrl = url.replace(/^\/+|\/+$/g, '').toLowerCase();
  
  return articles.find(article => {
    const articleUrl = article.url.replace(/^\/+|\/+$/g, '').toLowerCase();
    const displayUrl = article.display_url.replace(/^\/+|#+\/+|\/+$/g, '').toLowerCase();
    
    return articleUrl === normalizedUrl || 
           displayUrl === normalizedUrl ||
           articleUrl.endsWith(normalizedUrl) ||
           displayUrl.endsWith(normalizedUrl);
  }) || null;
}

// Artikel nach Kategorie
export function getArticlesByCategory(category) {
  return articles.filter(article => article.category === category);
}

// Statistiken
export const articleStats = {
  total: articles.length,
  categories: [...new Set(articles.map(a => a.category))],
  authors: [...new Set(articles.map(a => a.author))],
  totalWords: articles.reduce((sum, a) => sum + a.word_count, 0),
  averageReadingTime: Math.round(articles.reduce((sum, a) => sum + a.reading_time, 0) / articles.length)
};
