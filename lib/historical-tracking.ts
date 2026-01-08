/**
 * Historical Tracking Utilities
 * Functions to save and retrieve brand analysis snapshots over time
 */

import { db } from './db';
import { brandAnalysisSnapshots, brandAnalyses } from './db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { AnalysisResult } from './analyze-common';
import { CompetitorRanking } from './types';

export interface SnapshotMetrics {
  visibilityScore: number;
  sentimentScore: number;
  shareOfVoice: number;
  averagePosition: number | null;
  rank: number | null;
}

/**
 * Extract metrics from analysis result for snapshot
 */
export function extractSnapshotMetrics(
  analysisResult: AnalysisResult,
  companyName: string
): SnapshotMetrics {
  const scores = analysisResult.scores;
  const competitors = analysisResult.competitors || [];
  
  // Find brand's position in rankings
  const brandRanking = competitors.find(c => 
    c.name.toLowerCase() === companyName.toLowerCase()
  );
  
  // Calculate average position from all responses
  let averagePosition: number | null = null;
  if (brandRanking && brandRanking.averagePosition) {
    averagePosition = Math.round(brandRanking.averagePosition);
  }
  
  // Find rank (position in sorted list)
  let rank: number | null = null;
  if (brandRanking) {
    const sortedCompetitors = [...competitors].sort(
      (a, b) => b.visibilityScore - a.visibilityScore
    );
    rank = sortedCompetitors.findIndex(c => c.id === brandRanking.id) + 1;
  }
  
  return {
    visibilityScore: Math.round(scores.visibilityScore),
    sentimentScore: Math.round(scores.sentimentScore),
    shareOfVoice: Math.round(scores.shareOfVoice),
    averagePosition,
    rank,
  };
}

/**
 * Save a snapshot after analysis completes
 */
export async function saveAnalysisSnapshot(
  brandAnalysisId: string,
  metrics: SnapshotMetrics
): Promise<void> {
  try {
    await db.insert(brandAnalysisSnapshots).values({
      brandAnalysisId,
      visibilityScore: metrics.visibilityScore,
      sentimentScore: metrics.sentimentScore,
      shareOfVoice: metrics.shareOfVoice,
      averagePosition: metrics.averagePosition,
      rank: metrics.rank,
      snapshotDate: new Date(),
    });
    
    console.log('[Historical Tracking] Snapshot saved:', {
      brandAnalysisId,
      metrics,
    });
  } catch (error) {
    console.error('[Historical Tracking] Failed to save snapshot:', error);
    // Don't throw - snapshot saving shouldn't break the analysis flow
  }
}

/**
 * Get historical snapshots for a brand analysis
 */
export async function getHistoricalSnapshots(
  brandAnalysisId: string,
  startDate?: Date,
  endDate?: Date
) {
  const conditions = [eq(brandAnalysisSnapshots.brandAnalysisId, brandAnalysisId)];
  
  if (startDate) {
    conditions.push(gte(brandAnalysisSnapshots.snapshotDate, startDate));
  }
  
  if (endDate) {
    conditions.push(lte(brandAnalysisSnapshots.snapshotDate, endDate));
  }
  
  const snapshots = await db.query.brandAnalysisSnapshots.findMany({
    where: and(...conditions),
    orderBy: desc(brandAnalysisSnapshots.snapshotDate),
  });
  
  return snapshots;
}

/**
 * Calculate trend indicators (percentage change vs previous period)
 */
export interface TrendData {
  visibilityScore: { current: number; previous: number; change: number; trend: 'up' | 'down' | 'stable' };
  sentimentScore: { current: number; previous: number; change: number; trend: 'up' | 'down' | 'stable' };
  shareOfVoice: { current: number; previous: number; change: number; trend: 'up' | 'down' | 'stable' };
  rank: { current: number | null; previous: number | null; change: number | null; trend: 'up' | 'down' | 'stable' };
}

export function calculateTrends(snapshots: typeof brandAnalysisSnapshots.$inferSelect[]): TrendData | null {
  if (snapshots.length < 2) {
    return null; // Need at least 2 snapshots to calculate trends
  }
  
  // Sort by date (newest first)
  const sorted = [...snapshots].sort(
    (a, b) => new Date(b.snapshotDate).getTime() - new Date(a.snapshotDate).getTime()
  );
  
  const current = sorted[0];
  const previous = sorted[1];
  
  const calculateChange = (current: number | null, previous: number | null): { change: number; trend: 'up' | 'down' | 'stable' } => {
    if (current === null || previous === null) {
      return { change: 0, trend: 'stable' };
    }
    const change = current - previous;
    const trend = change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable';
    return { change: Math.round(change * 10) / 10, trend };
  };
  
  const visibilityChange = calculateChange(current.visibilityScore, previous.visibilityScore);
  const sentimentChange = calculateChange(current.sentimentScore, previous.sentimentScore);
  const shareChange = calculateChange(current.shareOfVoice, previous.shareOfVoice);
  
  // For rank, lower is better (rank 1 is best)
  let rankChange: { change: number | null; trend: 'up' | 'down' | 'stable' };
  if (current.rank === null || previous.rank === null) {
    rankChange = { change: null, trend: 'stable' };
  } else {
    const change = previous.rank - current.rank; // Positive = improved (lower rank number)
    rankChange = {
      change,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  }
  
  return {
    visibilityScore: {
      current: current.visibilityScore || 0,
      previous: previous.visibilityScore || 0,
      ...visibilityChange,
    },
    sentimentScore: {
      current: current.sentimentScore || 0,
      previous: previous.sentimentScore || 0,
      ...sentimentChange,
    },
    shareOfVoice: {
      current: current.shareOfVoice || 0,
      previous: previous.shareOfVoice || 0,
      ...shareChange,
    },
    rank: {
      current: current.rank,
      previous: previous.rank,
      ...rankChange,
    },
  };
}

