/**
 * Configuration for brand detection behavior
 */

import { BrandDetectionOptions } from './brand-detection-utils';

export interface BrandDetectionConfig {
  // Default detection options
  defaultOptions: BrandDetectionOptions;
  
  // Brand-specific aliases and variations
  brandAliases: Map<string, string[]>;
  
  // Common suffixes to ignore when matching
  ignoredSuffixes: string[];
  
  // Negative context patterns to exclude
  negativeContextPatterns: RegExp[];
  
  // Confidence thresholds
  confidenceThresholds: {
    high: number;
    medium: number;
    low: number;
  };
}

// Common brand aliases for popular companies (backup for smart matching)
const COMMON_BRAND_ALIASES = new Map<string, string[]>([
  // Cloud & Hosting
  ['AWS', ['Amazon Web Services', 'Amazon AWS', 'Amazon Cloud']],
  ['Amazon Web Services', ['AWS', 'Amazon AWS', 'Amazon Cloud']],
  ['GCP', ['Google Cloud Platform', 'Google Cloud', 'Google GCP']],
  ['Google Cloud', ['GCP', 'Google Cloud Platform', 'Google GCP']],
  ['Google Cloud Platform', ['GCP', 'Google Cloud', 'Google GCP']],
  ['Azure', ['Microsoft Azure', 'MS Azure', 'Azure Cloud']],
  ['Microsoft Azure', ['Azure', 'MS Azure', 'Azure Cloud']],
  
  // Development Platforms
  ['Vercel', ['Vercel Inc', 'Vercel Platform']],
  ['Netlify', ['Netlify Inc', 'Netlify Platform']],
  ['Heroku', ['Heroku Platform', 'Salesforce Heroku']],
  ['DigitalOcean', ['Digital Ocean', 'DO']],
  ['Railway', ['Railway App', 'Railway.app']],
  ['Render', ['Render.com', 'Render Cloud']],
  
  // AI Companies
  ['OpenAI', ['Open AI', 'ChatGPT', 'GPT']],
  ['Anthropic', ['Claude AI', 'Claude']],
  ['Google AI', ['Google Gemini', 'Gemini', 'Bard']],
  ['Meta AI', ['Facebook AI', 'LLaMA', 'Llama']],
  
  // E-commerce
  ['Shopify', ['Shopify Inc', 'Shopify Platform']],
  ['WooCommerce', ['Woo Commerce', 'WooCommerce Plugin']],
  ['BigCommerce', ['Big Commerce']],
  ['Magento', ['Adobe Commerce', 'Magento Commerce']],
  
  // Marketing & CRM
  ['HubSpot', ['Hub Spot', 'HubSpot CRM']],
  ['Salesforce', ['SFDC', 'Salesforce CRM', 'Sales Force']],
  ['Mailchimp', ['Mail Chimp', 'Mailchimp Email']],
  
  // Social Media
  ['Meta', ['Facebook', 'FB', 'Meta Platforms']],
  ['X', ['Twitter', 'X.com', 'X Platform']],
  ['Twitter', ['X', 'X.com', 'X Platform']],
  ['LinkedIn', ['Linked In', 'LinkedIn Platform']],
  ['TikTok', ['Tik Tok', 'TikTok App']],
  
  // Tech Giants
  ['Microsoft', ['MS', 'MSFT', 'Microsoft Corporation']],
  ['Google', ['Alphabet', 'Google LLC']],
  ['Apple', ['Apple Inc', 'AAPL']],
  ['Amazon', ['AMZN', 'Amazon.com']],
  ['IBM', ['International Business Machines', 'IBM Corporation']],
]);

// Default configuration
export const DEFAULT_BRAND_DETECTION_CONFIG: BrandDetectionConfig = {
  defaultOptions: {
    caseSensitive: false,
    wholeWordOnly: true,
    includeVariations: true,
    excludeNegativeContext: false,
  },
  
  brandAliases: COMMON_BRAND_ALIASES,
  
  ignoredSuffixes: [
    'inc', 'incorporated',
    'llc', 'limited liability company',
    'ltd', 'limited',
    'corp', 'corporation',
    'co', 'company',
    'plc', 'public limited company',
    'gmbh', 'ag', 'sa', 'srl',
  ],
  
  negativeContextPatterns: [
    /\bnot\s+(?:recommended|good|worth|reliable|suitable)\b/i,
    /\bavoid(?:ing)?\s+/i,
    /\bworse\s+than\b/i,
    /\binferior\s+to\b/i,
    /\bdon't\s+(?:use|recommend|like|trust)\b/i,
    /\bstay\s+away\s+from\b/i,
    /\bnever\s+use\b/i,
    /\bterrible\s+(?:service|product|quality)\b/i,
    /\bscam\b/i,
    /\bfraud(?:ulent)?\b/i,
  ],
  
  confidenceThresholds: {
    high: 0.8,
    medium: 0.5,
    low: 0.3,
  },
};

// Global configuration instance
let globalConfig = { ...DEFAULT_BRAND_DETECTION_CONFIG };

/**
 * Updates the global brand detection configuration
 * @param updates Partial configuration updates
 */
export function updateBrandDetectionConfig(updates: Partial<BrandDetectionConfig>) {
  if (updates.defaultOptions) {
    globalConfig.defaultOptions = { ...globalConfig.defaultOptions, ...updates.defaultOptions };
  }
  
  if (updates.brandAliases) {
    updates.brandAliases.forEach((aliases, brand) => {
      globalConfig.brandAliases.set(brand, aliases);
    });
  }
  
  if (updates.ignoredSuffixes) {
    globalConfig.ignoredSuffixes = updates.ignoredSuffixes;
  }
  
  if (updates.negativeContextPatterns) {
    globalConfig.negativeContextPatterns = updates.negativeContextPatterns;
  }
  
  if (updates.confidenceThresholds) {
    globalConfig.confidenceThresholds = { ...globalConfig.confidenceThresholds, ...updates.confidenceThresholds };
  }
}

/**
 * Gets the current brand detection configuration
 * @returns Current configuration
 */
export function getBrandDetectionConfig(): BrandDetectionConfig {
  return { ...globalConfig };
}

/**
 * Resets the configuration to defaults
 */
export function resetBrandDetectionConfig() {
  globalConfig = { ...DEFAULT_BRAND_DETECTION_CONFIG };
  globalConfig.brandAliases = new Map();
}

/**
 * Adds aliases for a specific brand
 * @param brandName The brand name
 * @param aliases Array of aliases
 */
export function addBrandAliases(brandName: string, aliases: string[]) {
  const existingAliases = globalConfig.brandAliases.get(brandName) || [];
  globalConfig.brandAliases.set(brandName, [...new Set([...existingAliases, ...aliases])]);
}

/**
 * Gets detection options for a specific brand
 * @param brandName The brand name
 * @returns Detection options with brand-specific aliases
 */
export function getBrandDetectionOptions(brandName: string): BrandDetectionOptions {
  const options = { ...globalConfig.defaultOptions };
  const aliases = globalConfig.brandAliases.get(brandName);
  
  if (aliases && aliases.length > 0) {
    options.customVariations = aliases;
  }
  
  return options;
}