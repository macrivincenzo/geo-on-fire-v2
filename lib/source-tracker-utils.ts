/**
 * Source Tracker Utilities
 * Extracts and tracks which domains/pages cite the brand in AI responses
 */

export interface SourceInfo {
  url: string;
  title?: string;
  domain: string;
  domainName?: string;
  citedText?: string;
}

export interface SourceCategory {
  name: string;
  count: number;
  percentage: number;
}

/**
 * Extract URLs from text using regex
 */
export function extractUrlsFromText(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  try {
    // Log a sample of the text for debugging (first 500 chars)
    const textSample = text.substring(0, 500);
    console.log(`[Source Extraction] Searching for URLs in text sample: "${textSample}..."`);
    
    const allMatches: string[] = [];
    
    // 1. Extract markdown links: [text](url) or [url]
    const markdownLinkPattern = /\[([^\]]*)\]\(([^)]+)\)/gi;
    let markdownMatch;
    while ((markdownMatch = markdownLinkPattern.exec(text)) !== null) {
      const url = markdownMatch[2].trim();
      if (url) {
        allMatches.push(url);
      }
    }
    
    // 2. Extract URLs in parentheses: (url) or (see url)
    const parenUrlPattern = /\(([^)]*(?:https?:\/\/|www\.)[^)]+)\)/gi;
    let parenMatch;
    while ((parenMatch = parenUrlPattern.exec(text)) !== null) {
      const url = parenMatch[1].trim();
      if (url) {
        allMatches.push(url);
      }
    }
    
    // 3. Standard HTTP/HTTPS URLs (most common)
    const httpPattern = /https?:\/\/[^\s<>"']+/gi;
    const httpMatches = text.match(httpPattern) || [];
    allMatches.push(...httpMatches);
    
    // 4. URLs without protocol but with www.
    const wwwPattern = /(?:^|\s|>|"|')(www\.[^\s<>"')]+)/gi;
    let wwwMatch;
    while ((wwwMatch = wwwPattern.exec(text)) !== null) {
      const url = wwwMatch[1].trim();
      if (url) {
        allMatches.push(url);
      }
    }
    
    // 5. Domain patterns (domain.com, domain.com/path, etc.)
    // More lenient pattern for domains
    const domainPattern = /\b([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.(?:[a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,}))(?:\/[^\s<>"')]*)?/gi;
    let domainMatch;
    while ((domainMatch = domainPattern.exec(text)) !== null) {
      const url = domainMatch[0].trim();
      // Skip if it's already matched as http:// or www.
      if (!url.startsWith('http') && !url.startsWith('www.')) {
        // Only include if it looks like a real domain (has TLD)
        if (/\.(com|org|net|edu|gov|io|co|ai|dev|app|tech|store|shop|blog|news|media|site|online|xyz|info|biz|me|tv|cc|ws|name|mobi|asia|jobs|travel|museum|pro|tel|xxx|ac|ad|ae|af|ag|ai|al|am|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)[^\s<>"')]*/i.test(url)) {
          allMatches.push(url);
        }
      }
    }
    
    // Clean and normalize URLs
    const cleanedUrls = allMatches
      .map(url => {
        // Remove leading/trailing whitespace
        url = url.trim();
        
        // Remove common trailing punctuation that's part of the sentence
        url = url.replace(/[.,;:!?)\]}>]+$/, '');
        
        // Remove quotes if present
        url = url.replace(/^["']|["']$/g, '');
        
        // Add https:// if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          // If it starts with www., add https://
          if (url.startsWith('www.')) {
            url = 'https://' + url;
          } else {
            // For other domains, add https://
            url = 'https://' + url;
          }
        }
        
        return url;
      })
      .filter(url => {
        // More lenient validation - just check if it looks like a URL
        if (!url || url.length < 4) return false;
        
        // Must contain a dot (for domain)
        if (!url.includes('.')) return false;
        
        // Try to validate as URL, but be lenient
        try {
          const urlObj = new URL(url);
          // Must have a valid hostname
          return urlObj.hostname.length > 0 && urlObj.hostname.includes('.');
        } catch {
          // If URL parsing fails, check if it at least looks like a domain
          return /^https?:\/\/[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}/.test(url);
        }
      });
    
    // Remove duplicates (case-insensitive)
    const uniqueUrls = Array.from(new Set(cleanedUrls.map(u => u.toLowerCase())))
      .map(lowerUrl => {
        // Find the original URL (preserve https:// vs http:// preference)
        return cleanedUrls.find(u => u.toLowerCase() === lowerUrl) || lowerUrl;
      });
    
    console.log(`[Source Extraction] Found ${uniqueUrls.length} URLs in text (${text.length} chars):`, uniqueUrls.slice(0, 5));
    
    return uniqueUrls;
  } catch (error) {
    console.warn('Error extracting URLs from text:', error);
    return [];
  }
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    // If URL parsing fails, try simple extraction
    const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/);
    return match ? match[1] : url;
  }
}

/**
 * Get domain name (human-readable) from domain
 */
export function getDomainName(domain: string): string {
  // Remove common TLDs and get the main part
  const parts = domain.split('.');
  if (parts.length >= 2) {
    return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
  }
  return domain;
}

/**
 * Categorize domain based on common patterns
 */
export function categorizeDomain(domain: string): string {
  const domainLower = domain.toLowerCase();
  
  // Social media
  if (domainLower.includes('reddit') || 
      domainLower.includes('twitter') || 
      domainLower.includes('facebook') ||
      domainLower.includes('linkedin') ||
      domainLower.includes('instagram')) {
    return 'Social';
  }
  
  // Wikipedia
  if (domainLower.includes('wikipedia')) {
    return 'Encyclopedia';
  }
  
  // YouTube
  if (domainLower.includes('youtube') || domainLower.includes('youtu.be')) {
    return 'Video';
  }
  
  // News/Media
  if (domainLower.includes('news') || 
      domainLower.includes('blog') ||
      domainLower.includes('medium') ||
      domainLower.includes('substack')) {
    return 'News & Media';
  }
  
  // Forums/Communities
  if (domainLower.includes('forum') || 
      domainLower.includes('community') ||
      domainLower.includes('discussion')) {
    return 'Community';
  }
  
  // E-commerce
  if (domainLower.includes('shop') || 
      domainLower.includes('store') ||
      domainLower.includes('amazon') ||
      domainLower.includes('ebay')) {
    return 'E-commerce';
  }
  
  // Default category
  return 'Industry & Network';
}

/**
 * Extract sources from AI response
 * Combines web search results (when available) with URL extraction from text
 */
export function extractSourcesFromResponse(
  response: string,
  webSearchResults?: Array<{ url: string; title?: string; cited_text?: string }>
): SourceInfo[] {
  if (!response || typeof response !== 'string') {
    return [];
  }
  
  try {
    const sources: Map<string, SourceInfo> = new Map();
    
    // Add sources from web search results (most reliable)
    if (webSearchResults && Array.isArray(webSearchResults)) {
      for (const result of webSearchResults) {
        if (result && result.url && typeof result.url === 'string') {
          try {
            const domain = extractDomain(result.url);
            const key = result.url.toLowerCase();
            
            sources.set(key, {
              url: result.url,
              title: result.title,
              domain,
              domainName: getDomainName(domain),
              citedText: result.cited_text,
            });
          } catch (error) {
            console.warn('Error processing web search result:', error);
            // Continue with next result
          }
        }
      }
    }
    
    // Extract URLs from response text (fallback)
    const urlsFromText = extractUrlsFromText(response);
    for (const url of urlsFromText) {
      try {
        const key = url.toLowerCase();
        
        // Don't overwrite if we already have it from web search
        if (!sources.has(key)) {
          const domain = extractDomain(url);
          sources.set(key, {
            url,
            domain,
            domainName: getDomainName(domain),
          });
        }
      } catch (error) {
        console.warn('Error processing extracted URL:', error);
        // Continue with next URL
      }
    }
    
    return Array.from(sources.values());
  } catch (error) {
    console.warn('Error extracting sources from response:', error);
    return [];
  }
}

/**
 * Aggregate sources by domain
 */
export function aggregateSourcesByDomain(sources: SourceInfo[]): Map<string, {
  domain: string;
  domainName: string;
  pages: SourceInfo[];
  timesCited: number;
  category: string;
}> {
  const domainMap = new Map<string, {
    domain: string;
    domainName: string;
    pages: SourceInfo[];
    timesCited: number;
    category: string;
  }>();
  
  for (const source of sources) {
    const domain = source.domain;
    
    if (!domainMap.has(domain)) {
      domainMap.set(domain, {
        domain,
        domainName: source.domainName || getDomainName(domain),
        pages: [],
        timesCited: 0,
        category: categorizeDomain(domain),
      });
    }
    
    const domainData = domainMap.get(domain)!;
    domainData.pages.push(source);
    domainData.timesCited++;
  }
  
  return domainMap;
}

/**
 * Calculate source categories breakdown
 */
export function calculateSourceCategories(
  domainMap: Map<string, { category: string; timesCited: number }>
): SourceCategory[] {
  const categoryMap = new Map<string, number>();
  let total = 0;
  
  for (const [, data] of domainMap) {
    const count = categoryMap.get(data.category) || 0;
    categoryMap.set(data.category, count + data.timesCited);
    total += data.timesCited;
  }
  
  const categories: SourceCategory[] = [];
  for (const [name, count] of categoryMap) {
    categories.push({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    });
  }
  
  // Sort by count descending
  return categories.sort((a, b) => b.count - a.count);
}

/**
 * Calculate share of citations for each source
 */
export function calculateShareOfCitations(
  sources: Array<{ timesCited: number }>,
  totalCitations: number
): Array<{ timesCited: number; shareOfCitations: number }> {
  return sources.map(source => ({
    ...source,
    shareOfCitations: totalCitations > 0 
      ? Math.round((source.timesCited / totalCitations) * 1000) / 10 
      : 0,
  }));
}

