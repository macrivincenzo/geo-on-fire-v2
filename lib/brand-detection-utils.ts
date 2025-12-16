/**
 * Enhanced brand detection utilities for accurate brand mention matching
 * Supports smart matching for ANY brand (small businesses, startups, enterprises)
 */

import { getBrandDetectionConfig } from './brand-detection-config';

/**
 * SMART BRAND MATCHING SYSTEM
 * Works for any brand - small bakeries to big enterprises!
 * 
 * Features:
 * 1. Parentheses extraction - "Amazon Web Services (AWS)" matches "AWS"
 * 2. Auto-abbreviation - "Best Bakery Shop" matches "BBS"
 * 3. Full name expansion - "AWS" matches "Amazon Web Services"
 * 4. Fuzzy matching - handles hyphens, spaces, special chars
 * 5. Suffix handling - ignores Inc, LLC, Ltd, etc.
 */

/**
 * Extracts abbreviations and full names from text with parentheses
 * e.g., "Amazon Web Services (AWS)" → { fullName: "Amazon Web Services", abbreviation: "AWS" }
 * e.g., "AWS (Amazon Web Services)" → { fullName: "Amazon Web Services", abbreviation: "AWS" }
 */
export function extractParenthesesVariations(text: string): { fullName: string; abbreviation: string }[] {
  const results: { fullName: string; abbreviation: string }[] = [];
  
  // Pattern 1: "Full Name (ABBREV)" - e.g., "Amazon Web Services (AWS)"
  const pattern1 = /([A-Za-z][A-Za-z\s&\-\.]+?)\s*\(([A-Z]{2,10})\)/g;
  let match;
  while ((match = pattern1.exec(text)) !== null) {
    results.push({
      fullName: match[1].trim(),
      abbreviation: match[2].trim()
    });
  }
  
  // Pattern 2: "ABBREV (Full Name)" - e.g., "AWS (Amazon Web Services)"
  const pattern2 = /\b([A-Z]{2,10})\s*\(([A-Za-z][A-Za-z\s&\-\.]+?)\)/g;
  while ((match = pattern2.exec(text)) !== null) {
    results.push({
      fullName: match[2].trim(),
      abbreviation: match[1].trim()
    });
  }
  
  // Pattern 3: "Full Name - ABBREV" or "ABBREV - Full Name"
  const pattern3 = /([A-Za-z][A-Za-z\s&]+?)\s*[-–—]\s*([A-Z]{2,10})\b/g;
  while ((match = pattern3.exec(text)) !== null) {
    results.push({
      fullName: match[1].trim(),
      abbreviation: match[2].trim()
    });
  }
  
  return results;
}

/**
 * Generates an abbreviation from a multi-word brand name
 * e.g., "Best Bakery Shop" → "BBS"
 * e.g., "Google Cloud Platform" → "GCP"
 */
export function generateAbbreviation(brandName: string): string[] {
  const words = brandName.trim().split(/\s+/).filter(w => w.length > 0);
  const abbreviations: string[] = [];
  
  if (words.length >= 2) {
    // First letter of each word (uppercase)
    const firstLetters = words.map(w => w.charAt(0).toUpperCase()).join('');
    if (firstLetters.length >= 2) {
      abbreviations.push(firstLetters);
    }
    
    // First letter of significant words (skip common words like "of", "the", "and")
    const skipWords = ['of', 'the', 'and', 'for', 'to', 'in', 'on', 'at', 'by', 'a', 'an'];
    const significantWords = words.filter(w => !skipWords.includes(w.toLowerCase()));
    if (significantWords.length >= 2) {
      const sigAbbrev = significantWords.map(w => w.charAt(0).toUpperCase()).join('');
      if (sigAbbrev !== firstLetters && sigAbbrev.length >= 2) {
        abbreviations.push(sigAbbrev);
      }
    }
  }
  
  return abbreviations;
}

/**
 * Checks if a short string could be an abbreviation of a longer string
 * e.g., isAbbreviationOf("AWS", "Amazon Web Services") → true
 */
export function isAbbreviationOf(short: string, long: string): boolean {
  if (short.length >= long.length) return false;
  
  const shortUpper = short.toUpperCase();
  const words = long.split(/\s+/).filter(w => w.length > 0);
  
  // Check if first letters match
  const firstLetters = words.map(w => w.charAt(0).toUpperCase()).join('');
  if (shortUpper === firstLetters) return true;
  
  // Check without common words
  const skipWords = ['of', 'the', 'and', 'for', 'to', 'in', 'on', 'at', 'by', 'a', 'an'];
  const significantWords = words.filter(w => !skipWords.includes(w.toLowerCase()));
  const sigFirstLetters = significantWords.map(w => w.charAt(0).toUpperCase()).join('');
  if (shortUpper === sigFirstLetters) return true;
  
  return false;
}

/**
 * Smart brand matcher - finds if brandName is mentioned in text
 * Works with abbreviations, full names, parentheses variations, etc.
 */
export function smartBrandMatch(text: string, brandName: string): {
  found: boolean;
  matchedText: string | null;
  matchType: 'exact' | 'abbreviation' | 'fullname' | 'parentheses' | 'fuzzy' | 'none';
  confidence: number;
} {
  const textLower = text.toLowerCase();
  const brandLower = brandName.toLowerCase().trim();
  const brandClean = brandLower.replace(/[^\w\s]/g, '').trim();
  
  // 1. EXACT MATCH (highest confidence)
  const exactPattern = new RegExp(`\\b${escapeRegex(brandLower)}\\b`, 'i');
  if (exactPattern.test(text)) {
    const match = text.match(exactPattern);
    return { found: true, matchedText: match?.[0] || brandName, matchType: 'exact', confidence: 1.0 };
  }
  
  // 2. PARENTHESES EXTRACTION - "Amazon Web Services (AWS)" should match "AWS"
  const parenthesesVariations = extractParenthesesVariations(text);
  for (const variation of parenthesesVariations) {
    // Check if brand matches the abbreviation
    if (variation.abbreviation.toLowerCase() === brandLower) {
      return { found: true, matchedText: `${variation.fullName} (${variation.abbreviation})`, matchType: 'parentheses', confidence: 0.95 };
    }
    // Check if brand matches the full name
    if (variation.fullName.toLowerCase() === brandLower || 
        variation.fullName.toLowerCase().includes(brandLower) ||
        brandLower.includes(variation.fullName.toLowerCase())) {
      return { found: true, matchedText: `${variation.fullName} (${variation.abbreviation})`, matchType: 'parentheses', confidence: 0.95 };
    }
  }
  
  // 3. ABBREVIATION CHECK - "AWS" should match if text contains "Amazon Web Services"
  // If brand looks like an abbreviation (short, uppercase), look for expanded forms
  if (brandName.length <= 6 && brandName === brandName.toUpperCase()) {
    // Brand is likely an abbreviation, search for full names that match
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length - brandName.length + 1; i++) {
      const segment = words.slice(i, i + brandName.length + 3).join(' ');
      if (isAbbreviationOf(brandName, segment)) {
        return { found: true, matchedText: segment, matchType: 'abbreviation', confidence: 0.85 };
      }
    }
  }
  
  // 4. FULL NAME TO ABBREVIATION - "Amazon Web Services" should match if text contains "AWS"
  const brandAbbreviations = generateAbbreviation(brandName);
  for (const abbrev of brandAbbreviations) {
    const abbrevPattern = new RegExp(`\\b${escapeRegex(abbrev)}\\b`, 'i');
    if (abbrevPattern.test(text)) {
      const match = text.match(abbrevPattern);
      return { found: true, matchedText: match?.[0] || abbrev, matchType: 'fullname', confidence: 0.85 };
    }
  }
  
  // 5. FUZZY MATCH - Handle variations like hyphens, spaces, dots
  const fuzzyVariations = [
    brandClean,
    brandClean.replace(/\s+/g, ''),      // nospaces
    brandClean.replace(/\s+/g, '-'),     // with-hyphens
    brandClean.replace(/\s+/g, '.'),     // with.dots
    brandLower.replace(/-/g, ' '),       // hyphens to spaces
    brandLower.replace(/-/g, ''),        // remove hyphens
  ];
  
  for (const variation of fuzzyVariations) {
    if (variation.length < 2) continue;
    const fuzzyPattern = new RegExp(`\\b${escapeRegex(variation)}\\b`, 'i');
    if (fuzzyPattern.test(text)) {
      const match = text.match(fuzzyPattern);
      return { found: true, matchedText: match?.[0] || variation, matchType: 'fuzzy', confidence: 0.75 };
    }
  }
  
  // 6. SUFFIX HANDLING - "TechStartup Inc" should match "TechStartup"
  const suffixes = ['inc', 'incorporated', 'llc', 'ltd', 'limited', 'corp', 'corporation', 'co', 'company', 'plc', 'gmbh', 'ag', 'sa', 'srl', 'services', 'solutions', 'platform', 'technologies', 'tech'];
  for (const suffix of suffixes) {
    // Brand with suffix in text
    const withSuffixPattern = new RegExp(`\\b${escapeRegex(brandClean)}\\s+${suffix}\\b`, 'i');
    if (withSuffixPattern.test(text)) {
      const match = text.match(withSuffixPattern);
      return { found: true, matchedText: match?.[0] || `${brandName} ${suffix}`, matchType: 'fuzzy', confidence: 0.8 };
    }
    
    // Brand without suffix when searching with suffix
    if (brandLower.endsWith(` ${suffix}`) || brandLower.endsWith(suffix)) {
      const withoutSuffix = brandLower.replace(new RegExp(`\\s*${suffix}\\s*$`, 'i'), '').trim();
      const withoutSuffixPattern = new RegExp(`\\b${escapeRegex(withoutSuffix)}\\b`, 'i');
      if (withoutSuffixPattern.test(text)) {
        const match = text.match(withoutSuffixPattern);
        return { found: true, matchedText: match?.[0] || withoutSuffix, matchType: 'fuzzy', confidence: 0.8 };
      }
    }
  }
  
  return { found: false, matchedText: null, matchType: 'none', confidence: 0 };
}

/**
 * Helper to escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalizes a brand name for consistent matching
 * @param name The brand name to normalize
 * @returns Normalized brand name
 */
export function normalizeBrandName(name: string): string {
  const config = getBrandDetectionConfig();
  const suffixPattern = new RegExp(`\\b(${config.ignoredSuffixes.join('|')})\\b\\.?$`, 'gi');
  
  return name
    .toLowerCase()
    .trim()
    // Preserve important punctuation but normalize spacing
    .replace(/\s+/g, ' ')
    // Remove possessive forms
    .replace(/'s\b/g, '')
    // Remove configured suffixes
    .replace(suffixPattern, '')
    .trim();
}

/**
 * Generates variations of a brand name for matching
 * @param brandName The original brand name
 * @returns Array of possible variations
 */
export function generateBrandVariations(brandName: string): string[] {
  const normalized = normalizeBrandName(brandName);
  const variations = new Set<string>();
  
  // Add original and normalized
  variations.add(brandName.toLowerCase());
  variations.add(normalized);
  
  // Without spaces
  variations.add(normalized.replace(/\s+/g, ''));
  
  // With dashes instead of spaces
  variations.add(normalized.replace(/\s+/g, '-'));
  
  // With underscores instead of spaces
  variations.add(normalized.replace(/\s+/g, '_'));
  
  // With dots instead of spaces (e.g., "open.ai")
  variations.add(normalized.replace(/\s+/g, '.'));
  
  // Camel case variations
  const words = normalized.split(' ');
  if (words.length > 1) {
    // PascalCase
    variations.add(words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''));
    // camelCase
    variations.add(words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''));
    // lowercase with no separators
    variations.add(words.join('').toLowerCase());
    // Each word capitalized with space
    variations.add(words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ').toLowerCase());
  }
  
  // Handle special characters
  if (brandName.includes('&')) {
    variations.add(normalized.replace(/&/g, 'and'));
    variations.add(normalized.replace(/&/g, 'n'));
    variations.add(normalized.replace(/&/g, ''));
  }
  
  if (brandName.includes('+')) {
    variations.add(normalized.replace(/\+/g, 'plus'));
    variations.add(normalized.replace(/\+/g, 'and'));
    variations.add(normalized.replace(/\+/g, ''));
  }
  
  // Handle numbers written as words
  const numberMap: Record<string, string> = {
    '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
    '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '0': 'zero'
  };
  
  let hasNumbers = false;
  Object.entries(numberMap).forEach(([num, word]) => {
    if (normalized.includes(num)) {
      hasNumbers = true;
      variations.add(normalized.replace(new RegExp(num, 'g'), word));
    }
  });
  
  // Common abbreviations
  const abbrevMap: Record<string, string[]> = {
    'artificial intelligence': ['ai'],
    'machine learning': ['ml'],
    'natural language': ['nl', 'nlp'],
    'technologies': ['tech'],
    'laboratories': ['labs'],
    'solutions': ['sol'],
    'systems': ['sys'],
    'software': ['sw'],
    'hardware': ['hw'],
    'incorporated': ['inc'],
    'corporation': ['corp'],
    'limited': ['ltd'],
  };
  
  Object.entries(abbrevMap).forEach(([full, abbrevs]) => {
    if (normalized.includes(full)) {
      abbrevs.forEach(abbrev => {
        variations.add(normalized.replace(full, abbrev));
      });
    }
  });
  
  // Add variations with common TLDs if the brand name looks like a domain
  if (!brandName.includes('.') && brandName.length > 2) {
    const commonTlds = ['com', 'io', 'ai', 'dev', 'co', 'net', 'org', 'app'];
    commonTlds.forEach(tld => {
      variations.add(`${normalized.replace(/\s+/g, '')}.${tld}`);
    });
  }
  
  return Array.from(variations);
}

/**
 * Creates regex patterns for brand detection with word boundaries
 * @param brandName The brand name
 * @param variations Optional additional variations
 * @returns Array of regex patterns
 */
export function createBrandRegexPatterns(brandName: string, variations?: string[]): RegExp[] {
  const config = getBrandDetectionConfig();
  
  // Get aliases from config if available
  const configAliases = config.brandAliases.get(brandName) || 
                        config.brandAliases.get(brandName.toLowerCase()) || [];
  
  // Generate abbreviations for multi-word names
  const abbreviations = generateAbbreviation(brandName);
  
  const allVariations = new Set([
    ...generateBrandVariations(brandName),
    ...configAliases,
    ...abbreviations,
    ...(variations || [])
  ]);
  
  const patterns: RegExp[] = [];
  
  allVariations.forEach(variation => {
    // Escape special regex characters
    const escaped = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create patterns with word boundaries
    // Basic word boundary pattern
    patterns.push(new RegExp(`\\b${escaped}\\b`, 'i'));
    
    // Pattern for hyphenated compounds (e.g., "brand-name-based")
    patterns.push(new RegExp(`\\b${escaped}(?:-\\w+)*\\b`, 'i'));
    
    // Pattern for possessive forms
    patterns.push(new RegExp(`\\b${escaped}'s?\\b`, 'i'));
    
    // Pattern allowing for common suffixes
    patterns.push(new RegExp(`\\b${escaped}(?:\\s+(?:inc|llc|ltd|corp|corporation|company|co)\\.?)?\\b`, 'i'));
  });
  
  return patterns;
}

/**
 * Detects if a brand is mentioned in text using multiple strategies
 * @param text The text to search in
 * @param brandName The brand name to search for
 * @param options Detection options
 * @returns Detection result with details
 */
export interface BrandDetectionResult {
  mentioned: boolean;
  matches: {
    text: string;
    index: number;
    pattern: string;
    confidence: number;
  }[];
  confidence: number;
}

export interface BrandDetectionOptions {
  caseSensitive?: boolean;
  wholeWordOnly?: boolean;
  includeVariations?: boolean;
  customVariations?: string[];
  excludeNegativeContext?: boolean;
  includeUrlDetection?: boolean;
  brandUrls?: string[];
}

export function detectBrandMention(
  text: string, 
  brandName: string, 
  options: BrandDetectionOptions = {}
): BrandDetectionResult {
  const {
    caseSensitive = false,
    wholeWordOnly = true,
    includeVariations = true,
    customVariations = [],
    excludeNegativeContext = false
  } = options;
  
  const searchText = caseSensitive ? text : text.toLowerCase();
  const matches: BrandDetectionResult['matches'] = [];
  
  // FIRST: Try smart brand matching (handles abbreviations, parentheses, etc.)
  const smartMatch = smartBrandMatch(text, brandName);
  if (smartMatch.found && smartMatch.matchedText) {
    const matchIndex = text.toLowerCase().indexOf(smartMatch.matchedText.toLowerCase());
    matches.push({
      text: smartMatch.matchedText,
      index: matchIndex >= 0 ? matchIndex : 0,
      pattern: `smart:${smartMatch.matchType}`,
      confidence: smartMatch.confidence
    });
  }
  
  // THEN: Also try traditional pattern matching for additional matches
  const patterns = wholeWordOnly 
    ? createBrandRegexPatterns(brandName, customVariations)
    : [new RegExp(brandName, caseSensitive ? 'g' : 'gi')];
  
  // Search with each pattern
  patterns.forEach(pattern => {
    const regex = new RegExp(pattern.source, pattern.flags + 'g');
    let match;
    
    while ((match = regex.exec(searchText)) !== null) {
      const matchText = match[0];
      const matchIndex = match.index;
      
      // Check for negative context if requested
      if (excludeNegativeContext) {
        const contextStart = Math.max(0, matchIndex - 50);
        const contextEnd = Math.min(searchText.length, matchIndex + matchText.length + 50);
        const context = searchText.substring(contextStart, contextEnd);
        
        const negativePatterns = [
          /\bnot\s+(?:recommended|good|worth|reliable)/i,
          /\bavoid\b/i,
          /\bworse\s+than\b/i,
          /\binferior\s+to\b/i,
          /\bdon't\s+(?:use|recommend|like)\b/i
        ];
        
        const hasNegativeContext = negativePatterns.some(np => np.test(context));
        if (hasNegativeContext) continue;
      }
      
      // Calculate confidence based on match quality
      let confidence = 0.5; // Base confidence
      
      // Exact match (case-insensitive)
      if (matchText.toLowerCase() === brandName.toLowerCase()) {
        confidence = 1.0;
      }
      // Exact match with suffix
      else if (matchText.toLowerCase().startsWith(brandName.toLowerCase() + ' ')) {
        confidence = 0.9;
      }
      // Variation match
      else if (includeVariations) {
        confidence = 0.7;
      }
      
      matches.push({
        text: matchText,
        index: matchIndex,
        pattern: pattern.source,
        confidence
      });
    }
  });
  
  // Remove duplicate matches at the same position
  const uniqueMatches = matches.reduce((acc, match) => {
    const existing = acc.find(m => m.index === match.index);
    if (!existing || match.confidence > existing.confidence) {
      return [...acc.filter(m => m.index !== match.index), match];
    }
    return acc;
  }, [] as typeof matches);
  
  // Calculate overall confidence
  const overallConfidence = uniqueMatches.length > 0
    ? Math.max(...uniqueMatches.map(m => m.confidence))
    : 0;
  
  return {
    mentioned: uniqueMatches.length > 0,
    matches: uniqueMatches.sort((a, b) => b.confidence - a.confidence),
    confidence: overallConfidence
  };
}

/**
 * Detects multiple brands in text
 * @param text The text to search in
 * @param brands Array of brand names
 * @param options Detection options
 * @returns Map of brand names to detection results
 */
export function detectMultipleBrands(
  text: string,
  brands: string[],
  options: BrandDetectionOptions = {}
): Map<string, BrandDetectionResult> {
  const results = new Map<string, BrandDetectionResult>();
  
  brands.forEach(brand => {
    results.set(brand, detectBrandMention(text, brand, options));
  });
  
  return results;
}

/**
 * Extracts context around brand mentions
 * @param text The full text
 * @param match The match details
 * @param contextWords Number of words to include on each side
 * @returns Context string with the match highlighted
 */
export function extractMatchContext(
  text: string,
  match: BrandDetectionResult['matches'][0],
  contextWords: number = 10
): string {
  const words = text.split(/\s+/);
  const matchStart = text.substring(0, match.index).split(/\s+/).length - 1;
  const matchEnd = matchStart + match.text.split(/\s+/).length;
  
  const contextStart = Math.max(0, matchStart - contextWords);
  const contextEnd = Math.min(words.length, matchEnd + contextWords);
  
  const contextWords_arr = words.slice(contextStart, contextEnd);
  
  // Highlight the match
  const matchWordIndices = Array.from(
    { length: matchEnd - matchStart },
    (_, i) => matchStart - contextStart + i
  );
  
  const highlighted = contextWords_arr.map((word, idx) => {
    if (matchWordIndices.includes(idx)) {
      return `**${word}**`;
    }
    return word;
  }).join(' ');
  
  const prefix = contextStart > 0 ? '...' : '';
  const suffix = contextEnd < words.length ? '...' : '';
  
  return `${prefix}${highlighted}${suffix}`;
}