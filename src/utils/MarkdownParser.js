/**
 * Markdown-Parser für das Zeiler-Redesign Projekt
 * Verarbeitet Markdown-Content mit YAML Front Matter korrekt
 */

/**
 * Parst YAML Front Matter aus Markdown-Content
 * @param {string} markdownContent - Der vollständige Markdown-String mit Front Matter
 * @returns {Object} - { metadata, content }
 */
export const parseMarkdownWithFrontMatter = (markdownContent) => {
  if (!markdownContent || typeof markdownContent !== 'string') {
    return { metadata: {}, content: '' };
  }

  // Regex für YAML Front Matter (zwischen --- und ---)
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdownContent.match(frontMatterRegex);
  
  if (match) {
    const yamlContent = match[1];
    const content = match[2].trim(); // NUR den Content nach dem Front Matter
    
    // Parse YAML zu JavaScript Object
    const metadata = parseYAML(yamlContent);
    
    return { 
      metadata, 
      content // Nur der eigentliche Artikel-Content ohne YAML
    };
  }
  
  // Fallback: Kein Front Matter gefunden, gesamter Content ist Artikel
  return { 
    metadata: {}, 
    content: markdownContent.trim() 
  };
};

/**
 * Einfacher YAML-Parser für Front Matter
 * @param {string} yamlString - YAML-String
 * @returns {Object} - Geparste Metadaten
 */
const parseYAML = (yamlString) => {
  const metadata = {};
  
  if (!yamlString) return metadata;
  
  // Teile YAML in Zeilen auf
  const lines = yamlString.split('\n');
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Überspringe leere Zeilen und Kommentare
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }
    
    // Parse Key-Value Paare
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmedLine.substring(0, colonIndex).trim();
      let value = trimmedLine.substring(colonIndex + 1).trim();
      
      // Entferne Anführungszeichen
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Konvertiere Zahlen
      if (/^\d+$/.test(value)) {
        value = parseInt(value, 10);
      } else if (/^\d+\.\d+$/.test(value)) {
        value = parseFloat(value);
      }
      
      metadata[key] = value;
    }
  });
  
  return metadata;
};

/**
 * Bereinigt Artikel-Titel von redundanten Präfixen
 * @param {string} title - Ursprünglicher Titel
 * @returns {string} - Bereinigter Titel
 */
export const cleanArticleTitle = (title) => {
  if (!title) return 'Unbekannter Titel';
  
  return title
    .replace(/^ZEILER\.me - IT & Medien, Geschichte, Deutsch - /, '')
    .replace(/^ZEILER\.me - /, '')
    .replace(/^IT & Medien, Geschichte, Deutsch - /, '')
    .trim() || 'Unbekannter Titel';
};

/**
 * Extrahiert und bereinigt Artikel-Content
 * @param {string} content - Roher Content
 * @returns {string} - Bereinigter Content
 */
export const cleanArticleContent = (content) => {
  if (!content) return '';
  
  // Entferne Google Sites Navigation und Footer
  const unwantedPatterns = [
    /^Search this site.*?Skip to navigation\s*/s,
    /^Skip to main content.*?Skip to navigation\s*/s,
    /Startseite\s+Detlef Zeiler\s+Deutsch.*?Selfmade\s*/s,
    /Copyright © \d{4} - \d{4} Detlef und Julian Zeiler.*?$/s,
    /Google Sites\s+Report abuse.*?$/s,
    /Made with Google Sites\s*$/s
  ];

  let cleanedContent = content;
  unwantedPatterns.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '');
  });

  // Bereinige Whitespace aber erhalte Paragraph-Struktur
  cleanedContent = cleanedContent
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Mehrfache Leerzeilen zu doppelten
    .replace(/^\s+|\s+$/gm, '') // Whitespace am Zeilenanfang/-ende
    .trim();

  return cleanedContent;
};

/**
 * Validiert ob Content ausreichend ist
 * @param {string} content - Zu validierender Content
 * @returns {Object} - { isValid, wordCount, issues }
 */
export const validateArticleContent = (content) => {
  const issues = [];
  
  if (!content || content.trim().length === 0) {
    issues.push('Kein Content vorhanden');
    return { isValid: false, wordCount: 0, issues };
  }
  
  // Zähle Wörter
  const wordCount = content
    .replace(/[^\w\säöüß]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0).length;
  
  if (wordCount < 10) {
    issues.push('Content zu kurz (weniger als 10 Wörter)');
  }
  
  // Prüfe auf YAML Front Matter im Content (sollte nicht da sein)
  if (content.includes('---') && content.includes('title:')) {
    issues.push('YAML Front Matter im Content gefunden - Parser-Fehler');
  }
  
  return {
    isValid: issues.length === 0,
    wordCount,
    issues
  };
};

export default {
  parseMarkdownWithFrontMatter,
  cleanArticleTitle,
  cleanArticleContent,
  validateArticleContent
};