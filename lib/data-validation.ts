/**
 * Data Validation Utilities
 * Ensures consistency across visibility scores, mentions, and rankings
 */

import { CompetitorRanking, AIResponse } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that visibility scores match mention counts
 */
export function validateVisibilityScores(
  competitors: CompetitorRanking[],
  totalResponses: number
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  competitors.forEach(competitor => {
    // Calculate expected visibility score from mentions
    const expectedVisibility = totalResponses > 0 
      ? (competitor.mentions / totalResponses) * 100 
      : 0;
    
    // Round to 1 decimal place for comparison
    const expectedRounded = Math.round(expectedVisibility * 10) / 10;
    const actualRounded = competitor.visibilityScore;

    // Allow small rounding differences (0.1%)
    if (Math.abs(expectedRounded - actualRounded) > 0.1) {
      errors.push(
        `${competitor.name}: Visibility score (${actualRounded}%) doesn't match mentions (${competitor.mentions}/${totalResponses} = ${expectedRounded}%)`
      );
    }

    // Warn if mentions exceed total responses (shouldn't happen)
    if (competitor.mentions > totalResponses) {
      warnings.push(
        `${competitor.name}: Mentions (${competitor.mentions}) exceed total responses (${totalResponses})`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates that share of voice percentages sum to approximately 100%
 */
export function validateShareOfVoice(competitors: CompetitorRanking[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const totalShare = competitors.reduce((sum, c) => sum + c.shareOfVoice, 0);
  
  // Share of voice should sum to approximately 100% (allow 1% tolerance for rounding)
  if (Math.abs(totalShare - 100) > 1) {
    warnings.push(
      `Share of voice percentages sum to ${totalShare.toFixed(1)}% (expected ~100%)`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates consistency between aggregated and provider-specific rankings
 */
export function validateProviderConsistency(
  aggregatedCompetitors: CompetitorRanking[],
  providerRankings: Array<{ provider: string; competitors: CompetitorRanking[] }>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Get all unique competitor names from aggregated list
  const aggregatedNames = new Set(aggregatedCompetitors.map(c => c.name.toLowerCase()));

  // Check each provider's competitor list
  providerRankings.forEach(({ provider, competitors }) => {
    const providerNames = new Set(competitors.map(c => c.name.toLowerCase()));
    
    // Check for competitors in provider list but not in aggregated
    providerNames.forEach(name => {
      if (!aggregatedNames.has(name)) {
        warnings.push(
          `${provider}: Competitor "${name}" found in provider rankings but not in aggregated list`
        );
      }
    });

    // Check for competitors in aggregated but missing from provider (this is OK if they have 0% visibility)
    aggregatedNames.forEach(name => {
      if (!providerNames.has(name)) {
        const competitor = aggregatedCompetitors.find(c => c.name.toLowerCase() === name);
        if (competitor && competitor.visibilityScore > 0) {
          warnings.push(
            `${provider}: Competitor "${name}" in aggregated list (${competitor.visibilityScore}% visibility) but missing from provider rankings`
          );
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates that brand mentions count matches actual responses with brand mentions
 */
export function validateBrandMentions(
  brandData: CompetitorRanking,
  responses: AIResponse[],
  brandName: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Count actual responses where brand is mentioned
  // Brand can be mentioned in two ways:
  // 1. brandMentioned flag is true
  // 2. Brand appears in rankings (even if brandMentioned is false)
  const actualMentions = responses.filter(r => {
    const inRankings = r.rankings?.some(ranking => 
      ranking.company.toLowerCase().includes(brandName.toLowerCase()) ||
      brandName.toLowerCase().includes(ranking.company.toLowerCase())
    ) || false;
    return r.brandMentioned || inRankings;
  }).length;
  
  // Compare with brandData.mentions
  // Allow small difference (1) due to edge cases, but log as warning
  const difference = Math.abs(brandData.mentions - actualMentions);
  if (difference > 1) {
    errors.push(
      `Brand mentions mismatch: Brand data shows ${brandData.mentions} mentions, but ${actualMentions} responses have brand mentioned (via flag or rankings) (difference: ${difference})`
    );
  } else if (difference === 1) {
    warnings.push(
      `Brand mentions slight mismatch: Brand data shows ${brandData.mentions} mentions, but ${actualMentions} responses have brand mentioned. This may be due to brand matching logic differences.`
    );
  }

  // Validate visibility score matches mentions
  const expectedVisibility = responses.length > 0 
    ? (brandData.mentions / responses.length) * 100 
    : 0;
  const expectedRounded = Math.round(expectedVisibility * 10) / 10;
  
  if (Math.abs(brandData.visibilityScore - expectedRounded) > 0.1) {
    errors.push(
      `Brand visibility score (${brandData.visibilityScore}%) doesn't match mention count (${brandData.mentions}/${responses.length} = ${expectedRounded}%)`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Comprehensive validation of all analysis data
 */
export function validateAnalysisData(
  competitors: CompetitorRanking[],
  brandData: CompetitorRanking,
  responses: AIResponse[],
  brandName: string,
  providerRankings?: Array<{ provider: string; competitors: CompetitorRanking[] }>
): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validate visibility scores
  const visibilityValidation = validateVisibilityScores(competitors, responses.length);
  allErrors.push(...visibilityValidation.errors);
  allWarnings.push(...visibilityValidation.warnings);

  // Validate share of voice
  const shareValidation = validateShareOfVoice(competitors);
  allErrors.push(...shareValidation.errors);
  allWarnings.push(...shareValidation.warnings);

  // Validate brand mentions
  const brandValidation = validateBrandMentions(brandData, responses, brandName);
  allErrors.push(...brandValidation.errors);
  allWarnings.push(...brandValidation.warnings);

  // Validate provider consistency if provider rankings are available
  if (providerRankings) {
    const providerValidation = validateProviderConsistency(competitors, providerRankings);
    allErrors.push(...providerValidation.errors);
    allWarnings.push(...providerValidation.warnings);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}

