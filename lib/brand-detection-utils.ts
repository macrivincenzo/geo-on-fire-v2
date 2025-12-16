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
 * Strips markdown formatting from text for cleaner brand matching
 * Removes: **bold**, *italic*, `code`, [links](url), # headers, etc.
 */
function stripMarkdown(text: string): string {
  return text
    // Remove bold/italic: **text** or *text* or ***text***
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    // Remove code blocks: `code`
    .replace(/`([^`]+)`/g, '$1')
    // Remove links: [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove headers: # Header
    .replace(/^#{1,6}\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove blockquotes: > text
    .replace(/^>\s+/gm, '')
    // Remove numbered list markers but keep text: 1. text -> text
    .replace(/^\d+\.\s+/gm, '')
    // Remove bullet list markers: - text or * text
    .replace(/^[-*]\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * UNIVERSAL SMART BRAND MATCHER
 * Works for ANY brand - small bakeries to big enterprises!
 * 
 * Matching strategies (in order of confidence):
 * 1. Exact match
 * 2. Parentheses extraction
 * 3. Contains match (bidirectional) - NEW!
 * 4. Word prefix match - NEW!
 * 5. Word overlap scoring - NEW!
 * 6. Abbreviation matching
 * 7. Suffix expansion - NEW!
 * 8. Fuzzy variations
 */
export function smartBrandMatch(text: string, brandName: string): {
  found: boolean;
  matchedText: string | null;
  matchType: 'exact' | 'abbreviation' | 'fullname' | 'parentheses' | 'contains' | 'prefix' | 'overlap' | 'fuzzy' | 'none';
  confidence: number;
} {
  // IMPORTANT: Strip markdown formatting first!
  const cleanText = stripMarkdown(text);
  const textLower = cleanText.toLowerCase();
  const brandLower = brandName.toLowerCase().trim();
  const brandClean = brandLower.replace(/[^\w\s]/g, '').trim();
  const brandWords = brandClean.split(/\s+/).filter(w => w.length > 0);
  
  // ============================================================
  // 1. EXACT MATCH (highest confidence)
  // ============================================================
  const exactPattern = new RegExp(`\\b${escapeRegex(brandLower)}\\b`, 'i');
  if (exactPattern.test(cleanText)) {
    const match = cleanText.match(exactPattern);
    return { found: true, matchedText: match?.[0] || brandName, matchType: 'exact', confidence: 1.0 };
  }
  
  // ============================================================
  // 2. PARENTHESES EXTRACTION
  // "Amazon Web Services (AWS)" should match "AWS"
  // "Google Cloud Platform (GCP)" should match "Google Cloud"
  // ============================================================
  // Use cleaned text for parentheses extraction
  const parenthesesVariations = extractParenthesesVariations(cleanText);
  for (const variation of parenthesesVariations) {
    const fullNameLower = variation.fullName.toLowerCase();
    const abbrevLower = variation.abbreviation.toLowerCase();
    
    // Check if brand matches the abbreviation
    if (abbrevLower === brandLower) {
      return { found: true, matchedText: `${variation.fullName} (${variation.abbreviation})`, matchType: 'parentheses', confidence: 0.95 };
    }
    // Check if brand matches the full name exactly
    if (fullNameLower === brandLower) {
      return { found: true, matchedText: `${variation.fullName} (${variation.abbreviation})`, matchType: 'parentheses', confidence: 0.95 };
    }
    // Check if brand is contained in full name (e.g., "Google Cloud" in "Google Cloud Platform")
    if (fullNameLower.includes(brandLower) && brandLower.length >= 3) {
      return { found: true, matchedText: `${variation.fullName} (${variation.abbreviation})`, matchType: 'parentheses', confidence: 0.92 };
    }
    // Check if full name is contained in brand
    if (brandLower.includes(fullNameLower) && fullNameLower.length >= 3) {
      return { found: true, matchedText: `${variation.fullName} (${variation.abbreviation})`, matchType: 'parentheses', confidence: 0.90 };
    }
  }
  
  // ============================================================
  // 3. CONTAINS MATCH (BIDIRECTIONAL) - UNIVERSAL!
  // "Google Cloud" should match "Google Cloud Platform"
  // "Best Bakery" should match "Best Bakery Shop"
  // ============================================================
  // Strategy: Find phrases in text that START with the brand name
  if (brandWords.length >= 1 && brandClean.length >= 3) {
    // Look for brand as start of a longer phrase
    const containsPattern = new RegExp(`\\b${escapeRegex(brandClean)}(?:\\s+\\w+)*\\b`, 'gi');
    const containsMatches = cleanText.match(containsPattern);
    if (containsMatches && containsMatches.length > 0) {
      // Find the best (longest) match
      const bestMatch = containsMatches.reduce((a, b) => a.length > b.length ? a : b);
      if (bestMatch.toLowerCase() !== brandLower) {
        return { found: true, matchedText: bestMatch, matchType: 'contains', confidence: 0.88 };
      }
    }
  }
  
  // ============================================================
  // 4. WORD PREFIX MATCH - UNIVERSAL!
  // All brand words appear at the start of a text phrase
  // "Google Cloud" matches ["Google", "Cloud", "Platform"]
  // ============================================================
  if (brandWords.length >= 2) {
    // Find all multi-word phrases in text (use cleaned text)
    const textPhrases = extractPhrases(cleanText);
    for (const phrase of textPhrases) {
      const phraseWords = phrase.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      if (phraseWords.length >= brandWords.length) {
        // Check if brand words are a prefix of phrase words
        const isPrefix = brandWords.every((word, idx) => 
          phraseWords[idx] && phraseWords[idx].startsWith(word.substring(0, Math.min(word.length, phraseWords[idx].length)))
        );
        if (isPrefix && brandWords.join(' ') !== phraseWords.join(' ')) {
          return { found: true, matchedText: phrase, matchType: 'prefix', confidence: 0.85 };
        }
      }
    }
  }
  
  // ============================================================
  // 5. WORD OVERLAP SCORING - UNIVERSAL!
  // Count matching words between brand and text phrases
  // If >60% of brand words found, it's a match
  // ============================================================
  if (brandWords.length >= 2) {
    const textPhrases = extractPhrases(cleanText);
    for (const phrase of textPhrases) {
      const phraseWords = phrase.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      const matchingWords = brandWords.filter(bw => 
        phraseWords.some(pw => pw === bw || pw.startsWith(bw) || bw.startsWith(pw))
      );
      const overlapRatio = matchingWords.length / brandWords.length;
      if (overlapRatio >= 0.6 && matchingWords.length >= 2) {
        return { found: true, matchedText: phrase, matchType: 'overlap', confidence: 0.75 + (overlapRatio * 0.15) };
      }
    }
  }
  
  // ============================================================
  // 6. ABBREVIATION CHECK
  // "AWS" should match if text contains "Amazon Web Services"
  // ============================================================
  if (brandName.length <= 6 && brandName === brandName.toUpperCase()) {
    const words = cleanText.split(/\s+/);
    for (let i = 0; i < words.length - brandName.length + 1; i++) {
      const segment = words.slice(i, i + brandName.length + 3).join(' ');
      if (isAbbreviationOf(brandName, segment)) {
        return { found: true, matchedText: segment, matchType: 'abbreviation', confidence: 0.85 };
      }
    }
  }
  
  // Full name to abbreviation
  const brandAbbreviations = generateAbbreviation(brandName);
  for (const abbrev of brandAbbreviations) {
    const abbrevPattern = new RegExp(`\\b${escapeRegex(abbrev)}\\b`, 'i');
    if (abbrevPattern.test(cleanText)) {
      const match = cleanText.match(abbrevPattern);
      return { found: true, matchedText: match?.[0] || abbrev, matchType: 'fullname', confidence: 0.85 };
    }
  }
  
  // ============================================================
  // 7. SUFFIX EXPANSION - UNIVERSAL!
  // Try brand + common business suffixes
  // "Google Cloud" → try "Google Cloud Platform", "Google Cloud Services", etc.
  // ============================================================
  const commonSuffixes = [
    'platform', 'services', 'solutions', 'cloud', 'tech', 'technologies',
    'software', 'systems', 'app', 'apps', 'inc', 'incorporated', 'llc', 
    'ltd', 'limited', 'corp', 'corporation', 'co', 'company', 'group',
    'labs', 'studio', 'studios', 'digital', 'online', 'web', 'net',
    'shop', 'store', 'market', 'hub', 'center', 'centre', 'pro', 'plus'
  ];
  
  for (const suffix of commonSuffixes) {
    // Try brand + suffix
    const withSuffix = `${brandClean} ${suffix}`;
    const withSuffixPattern = new RegExp(`\\b${escapeRegex(withSuffix)}\\b`, 'i');
    if (withSuffixPattern.test(cleanText)) {
      const match = cleanText.match(withSuffixPattern);
      return { found: true, matchedText: match?.[0] || withSuffix, matchType: 'fuzzy', confidence: 0.82 };
    }
  }
  
  // Remove suffix from brand and search
  for (const suffix of commonSuffixes) {
    if (brandLower.endsWith(` ${suffix}`) || brandLower.endsWith(suffix)) {
      const withoutSuffix = brandLower.replace(new RegExp(`\\s*${suffix}\\s*$`, 'i'), '').trim();
      if (withoutSuffix.length >= 3) {
        const withoutSuffixPattern = new RegExp(`\\b${escapeRegex(withoutSuffix)}\\b`, 'i');
        if (withoutSuffixPattern.test(cleanText)) {
          const match = cleanText.match(withoutSuffixPattern);
          return { found: true, matchedText: match?.[0] || withoutSuffix, matchType: 'fuzzy', confidence: 0.80 };
        }
      }
    }
  }
  
  // ============================================================
  // 8. FUZZY MATCH - Handle variations
  // ============================================================
  const fuzzyVariations = [
    brandClean,
    brandClean.replace(/\s+/g, ''),
    brandClean.replace(/\s+/g, '-'),
    brandClean.replace(/\s+/g, '.'),
    brandLower.replace(/-/g, ' '),
    brandLower.replace(/-/g, ''),
    brandLower.replace(/\./g, ' '),
    brandLower.replace(/\./g, ''),
  ];
  
  for (const variation of fuzzyVariations) {
    if (variation.length < 2) continue;
    const fuzzyPattern = new RegExp(`\\b${escapeRegex(variation)}\\b`, 'i');
    if (fuzzyPattern.test(cleanText)) {
      const match = cleanText.match(fuzzyPattern);
      return { found: true, matchedText: match?.[0] || variation, matchType: 'fuzzy', confidence: 0.70 };
    }
  }
  
  // FALLBACK: Try original text if cleaned text didn't match (rare edge cases)
  if (text !== cleanText) {
    const originalTextLower = text.toLowerCase();
    if (originalTextLower.includes(brandLower)) {
      return { found: true, matchedText: brandName, matchType: 'fuzzy', confidence: 0.65 };
    }
  }
  
  return { found: false, matchedText: null, matchType: 'none', confidence: 0 };
}

/**
 * Extract meaningful phrases from text (for word matching)
 * Returns phrases that look like company/brand names
 */
function extractPhrases(text: string): string[] {
  const phrases: string[] = [];
  
  // Extract capitalized phrases (likely proper nouns/brand names)
  const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Platform|Services|Cloud|Inc|LLC|Ltd|Corp|Co|Solutions|Technologies|Tech|Software|Systems|App|Labs|Studio|Digital|Online|Web|Shop|Store|Pro|Plus))?)\b/g;
  let match;
  while ((match = capitalizedPattern.exec(text)) !== null) {
    if (match[1].length >= 3) {
      phrases.push(match[1]);
    }
  }
  
  // Extract phrases from numbered lists (common in AI responses)
  // e.g., "1. Google Cloud Platform (GCP)"
  const listPattern = /\d+\.\s*\*?\*?([A-Za-z][A-Za-z\s\-\.]+?)(?:\s*[\(\:\-\*]|$)/gm;
  while ((match = listPattern.exec(text)) !== null) {
    const phrase = match[1].trim().replace(/\*+/g, '');
    if (phrase.length >= 3) {
      phrases.push(phrase);
    }
  }
  
  // Extract bold text (often brand names in markdown)
  const boldPattern = /\*\*([A-Za-z][A-Za-z\s\-\.]+?)\*\*/g;
  while ((match = boldPattern.exec(text)) !== null) {
    if (match[1].length >= 3) {
      phrases.push(match[1]);
    }
  }
  
  return [...new Set(phrases)]; // Remove duplicates
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
  
  // Strip markdown formatting for cleaner matching
  const cleanedText = stripMarkdown(text);
  const searchText = caseSensitive ? cleanedText : cleanedText.toLowerCase();
  const matches: BrandDetectionResult['matches'] = [];
  
  // FIRST: Try smart brand matching (handles abbreviations, parentheses, etc.)
  // Pass original text - smartBrandMatch handles markdown stripping internally
  const smartMatch = smartBrandMatch(text, brandName);
  if (smartMatch.found && smartMatch.matchedText) {
    const matchIndex = cleanedText.toLowerCase().indexOf(smartMatch.matchedText.toLowerCase());
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