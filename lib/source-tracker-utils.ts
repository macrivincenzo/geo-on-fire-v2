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
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const matches = text.match(urlRegex) || [];
    
    // Remove duplicates and normalize
    const uniqueUrls = Array.from(new Set(matches.map(url => url.trim()).filter(url => url.length > 0)));
    
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

