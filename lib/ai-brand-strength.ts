/**
 * AI Brand Strength Calculator
 * Calculates a composite 0-100 score based on visibility, sentiment, share of voice, and ranking
 */

import { CompetitorRanking } from './types';

export interface AIBrandStrength {
  score: number; // 0-100
  breakdown: {
    visibility: number; // 0-100
    sentiment: number; // 0-100
    shareOfVoice: number; // 0-100
    ranking: number; // 0-100
  };
}

/**
 * Calculate AI Brand Strength score (0-100)
 * 
 * Formula:
 * - Visibility: 35% weight (how often brand is mentioned)
 * - Sentiment: 25% weight (positive/neutral/negative)
 * - Share of Voice: 20% weight (percentage of total mentions)
 * - Ranking: 20% weight (average position in rankings)
 */
export function calculateAIBrandStrength(
  brandData: CompetitorRanking
): AIBrandStrength {
  // 1. Visibility Score (0-100) - already a percentage
  const visibilityScore = Math.min(100, Math.max(0, brandData.visibilityScore));
  
  // 2. Sentiment Score (0-100)
  // Positive = 100, Neutral = 50, Negative = 0
  const sentimentScore = brandData.sentiment === 'positive' ? 100 :
                        brandData.sentiment === 'neutral' ? 50 : 0;
  
  // 3. Share of Voice Score (0-100)
  // Already a percentage, but normalize to 0-100
  const shareOfVoiceScore = Math.min(100, Math.max(0, brandData.shareOfVoice));
  
  // 4. Ranking Score (0-100)
  // Position 1 = 100, Position 2-3 = 80, Position 4-5 = 60, Position 6-10 = 40, >10 = 20
  let rankingScore = 0;
  if (brandData.averagePosition <= 1) {
    rankingScore = 100;
  } else if (brandData.averagePosition <= 3) {
    rankingScore = 80;
  } else if (brandData.averagePosition <= 5) {
    rankingScore = 60;
  } else if (brandData.averagePosition <= 10) {
    rankingScore = 40;
  } else if (brandData.averagePosition > 0) {
    rankingScore = 20;
  }
  // If no position data, give neutral score
  if (brandData.averagePosition === 0 || !brandData.averagePosition) {
    rankingScore = 50;
  }
  
  // Calculate weighted composite score
  const compositeScore = 
    (visibilityScore * 0.35) +
    (sentimentScore * 0.25) +
    (shareOfVoiceScore * 0.20) +
    (rankingScore * 0.20);
  
  // Round to nearest integer (0-100)
  const finalScore = Math.round(Math.min(100, Math.max(0, compositeScore)));
  
  return {
    score: finalScore,
    breakdown: {
      visibility: Math.round(visibilityScore),
      sentiment: sentimentScore,
      shareOfVoice: Math.round(shareOfVoiceScore),
      ranking: rankingScore
    }
  };
}

/**
 * Calculate AI Brand Strength for multiple competitors
 */
export function calculateAIBrandStrengthForAll(
  competitors: CompetitorRanking[]
): Map<string, AIBrandStrength> {
  const strengthMap = new Map<string, AIBrandStrength>();
  
  for (const competitor of competitors) {
    const strength = calculateAIBrandStrength(competitor);
    strengthMap.set(competitor.name, strength);
  }
  
  return strengthMap;
}

