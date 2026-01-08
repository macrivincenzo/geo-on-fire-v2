/**
 * URL normalization utilities
 * Normalize URLs for consistent matching (e.g., yeti.com vs www.yeti.com)
 */

/**
 * Normalize a URL for comparison
 * Removes protocol, www, trailing slashes, and converts to lowercase
 */
export function normalizeUrlForComparison(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  try {
    // Remove protocol if present
    let normalized = url.trim().toLowerCase();
    
    // Remove http:// or https://
    normalized = normalized.replace(/^https?:\/\//, '');
    
    // Remove www.
    normalized = normalized.replace(/^www\./, '');
    
    // Remove trailing slash
    normalized = normalized.replace(/\/$/, '');
    
    // Remove path (keep only domain)
    const domainMatch = normalized.match(/^([^\/]+)/);
    if (domainMatch) {
      normalized = domainMatch[1];
    }
    
    return normalized;
  } catch (error) {
    console.warn('Error normalizing URL:', url, error);
    return url.toLowerCase().trim();
  }
}

/**
 * Check if two URLs match (after normalization)
 */
export function urlsMatch(url1: string, url2: string): boolean {
  return normalizeUrlForComparison(url1) === normalizeUrlForComparison(url2);
}

