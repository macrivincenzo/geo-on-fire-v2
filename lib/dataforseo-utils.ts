/**
 * DataForSEO API Utilities
 * Provides real SEO data: search volumes, keyword difficulty, competition metrics
 * Uses DataForSEO API with login/password authentication
 */

export interface DataForSEOKeywordMetrics {
  searchVolume: number;
  keywordDifficulty: number; // 0-100
  competition: 'low' | 'medium' | 'high';
  cpc?: number; // Cost per click
  trends?: {
    trendScore: number;
    isTrending: boolean;
  };
}

export interface DataForSEOResult {
  keyword: string;
  metrics: DataForSEOKeywordMetrics | null;
  error?: string;
}

interface CachedKeywordData {
  result: DataForSEOResult;
  cachedAt: number;
}

// In-memory cache for keyword metrics (24-hour TTL)
const keywordCache = new Map<string, CachedKeywordData>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cached keyword data if available and not expired
 */
function getCachedKeyword(keyword: string): DataForSEOResult | null {
  const cached = keywordCache.get(keyword.toLowerCase());
  if (!cached) return null;
  
  const age = Date.now() - cached.cachedAt;
  if (age > CACHE_TTL_MS) {
    keywordCache.delete(keyword.toLowerCase());
    return null;
  }
  
  console.log(`✅ Using cached data for keyword: "${keyword}" (saved ${Math.round(age / 1000 / 60)} minutes ago)`);
  return cached.result;
}

/**
 * Store keyword data in cache
 */
function setCachedKeyword(keyword: string, result: DataForSEOResult): void {
  keywordCache.set(keyword.toLowerCase(), {
    result,
    cachedAt: Date.now(),
  });
}

/**
 * Clear expired cache entries (call periodically)
 */
function clearExpiredCache(): void {
  const now = Date.now();
  let cleared = 0;
  for (const [keyword, cached] of keywordCache.entries()) {
    if (now - cached.cachedAt > CACHE_TTL_MS) {
      keywordCache.delete(keyword);
      cleared++;
    }
  }
  if (cleared > 0) {
    console.log(`🧹 Cleared ${cleared} expired cache entries`);
  }
}

/**
 * Get real SEO metrics for a keyword using DataForSEO API
 * DataForSEO uses login/password authentication (not API key)
 */
export async function getDataForSEOMetrics(
  keyword: string
): Promise<DataForSEOResult> {
  // Check cache first
  const cached = getCachedKeyword(keyword);
  if (cached) {
    return cached;
  }
  
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  
  if (!login || !password) {
    return {
      keyword,
      metrics: null,
      error: 'DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD not configured',
    };
  }

  try {
    // DataForSEO API endpoint for search volume and keyword metrics
    const apiUrl = 'https://api.dataforseo.com/v3/keywords_data/google/search_volume/live';
    const auth = Buffer.from(`${login}:${password}`).toString('base64');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify([{
        keywords: [keyword],
        location_code: 2840, // United States (adjust as needed)
        language_code: 'en',
      }]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DataForSEO API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // DataForSEO returns data in tasks array format
    const taskData = data.tasks?.[0]?.result?.[0];
    
    if (!taskData) {
      return {
        keyword,
        metrics: null,
        error: 'No data returned from DataForSEO',
      };
    }
    
    const result = {
      keyword,
      metrics: {
        searchVolume: taskData.search_volume || 0,
        keywordDifficulty: taskData.keyword_difficulty || 0,
        competition: mapCompetitionLevel(taskData.competition_index || taskData.competition_level),
        cpc: taskData.cpc,
        trends: taskData.trends ? {
          trendScore: taskData.trends.score || 0,
          isTrending: taskData.trends.is_trending || false,
        } : undefined,
      },
    };
    
    // Cache the result
    setCachedKeyword(keyword, result);
    
    return result;
  } catch (error) {
    console.warn(`DataForSEO API call failed for "${keyword}":`, error);
    return {
      keyword,
      metrics: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get metrics for multiple keywords (batch request) using DataForSEO API
 */
export async function getBatchDataForSEOMetrics(
  keywords: string[]
): Promise<DataForSEOResult[]> {
  // Clear expired cache entries periodically
  if (Math.random() < 0.1) { // 10% chance to clean up
    clearExpiredCache();
  }
  
  const results: DataForSEOResult[] = [];
  const keywordsToFetch: string[] = [];
  
  // Check cache for each keyword
  for (const keyword of keywords) {
    const cached = getCachedKeyword(keyword);
    if (cached) {
      results.push(cached);
    } else {
      keywordsToFetch.push(keyword);
    }
  }
  
  // If all keywords were cached, return early
  if (keywordsToFetch.length === 0) {
    console.log(`✅ All ${keywords.length} keywords served from cache`);
    return results;
  }
  
  console.log(`📡 Fetching ${keywordsToFetch.length} new keywords (${results.length} from cache)`);
  
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  
  if (!login || !password) {
    // Return cached results + errors for uncached
    return [
      ...results,
      ...keywordsToFetch.map(keyword => ({
        keyword,
        metrics: null,
        error: 'DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD not configured',
      }))
    ];
  }

  try {
    // DataForSEO batch API endpoint for search volume
    const apiUrl = 'https://api.dataforseo.com/v3/keywords_data/google/search_volume/live';
    const auth = Buffer.from(`${login}:${password}`).toString('base64');
    
    // Create tasks array for batch request
    const tasks = [{
      keywords: keywords,
      location_code: 2840, // United States (adjust as needed)
      language_code: 'en',
    }];
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(tasks),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DataForSEO API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // DataForSEO returns all keywords in result array
    const apiResults = data.tasks?.[0]?.result || [];
    
    // Process fetched results and cache them
    const fetchedResults = keywordsToFetch.map((keyword) => {
      const taskData = apiResults.find((r: any) => r.keyword === keyword);
      
      if (!taskData) {
        return {
          keyword,
          metrics: null,
          error: 'No data returned',
        };
      }

      const result = {
        keyword,
        metrics: {
          searchVolume: taskData.search_volume || 0,
          keywordDifficulty: taskData.keyword_difficulty || 0,
          competition: mapCompetitionLevel(taskData.competition_index || taskData.competition_level),
          cpc: taskData.cpc,
          trends: taskData.trends ? {
            trendScore: taskData.trends.score || 0,
            isTrending: taskData.trends.is_trending || false,
          } : undefined,
        },
      };
      
      // Cache the result
      setCachedKeyword(keyword, result);
      
      return result;
    });
    
    return [...results, ...fetchedResults];
  } catch (error) {
    console.warn(`DataForSEO batch API call failed:`, error);
    // Return cached results + errors for uncached
    return [
      ...results,
      ...keywordsToFetch.map(keyword => ({
        keyword,
        metrics: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      }))
    ];
  }
}

/**
 * Map competition value to standardized level
 */
function mapCompetitionLevel(competition: any): 'low' | 'medium' | 'high' {
  if (typeof competition === 'number') {
    if (competition < 33) return 'low';
    if (competition < 66) return 'medium';
    return 'high';
  }
  
  if (typeof competition === 'string') {
    const lower = competition.toLowerCase();
    if (lower.includes('low')) return 'low';
    if (lower.includes('high')) return 'high';
    return 'medium';
  }
  
  return 'medium';
}

/**
 * Format search volume for display
 */
export function formatSearchVolume(volume: number): string {
  if (volume >= 10000) return 'high';
  if (volume >= 1000) return 'medium';
  if (volume >= 100) return 'low-medium';
  return 'low';
}

/**
 * Get keyword difficulty category
 */
export function getDifficultyCategory(difficulty: number): string {
  if (difficulty >= 70) return 'high';
  if (difficulty >= 40) return 'medium';
  return 'low';
}
