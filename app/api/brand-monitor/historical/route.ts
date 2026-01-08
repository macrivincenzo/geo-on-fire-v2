import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getHistoricalSnapshots, calculateTrends } from '@/lib/historical-tracking';
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/api-errors';
import { db } from '@/lib/db';
import { brandAnalyses } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * GET /api/brand-monitor/historical?analysisId=xxx&startDate=xxx&endDate=xxx
 * Fetch historical snapshots for a brand analysis
 */
export async function GET(request: NextRequest) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError('Please log in to view historical data');
    }

    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('analysisId');
    const url = searchParams.get('url'); // Alternative: track by URL
    
    if (!analysisId && !url) {
      throw new ValidationError('Invalid request', {
        analysisId: 'Analysis ID or URL is required',
      });
    }

    let analysis;
    let targetAnalysisId: string;

    if (analysisId) {
      // Use specific analysis ID
      analysis = await db.query.brandAnalyses.findFirst({
        where: eq(brandAnalyses.id, analysisId),
      });

      if (!analysis) {
        throw new ValidationError('Analysis not found');
      }

      if (analysis.userId !== sessionResponse.user.id) {
        throw new AuthenticationError('You do not have access to this analysis');
      }
      
      targetAnalysisId = analysisId;
    } else if (url) {
      // Find the most recent analysis for this URL (to aggregate all snapshots)
      const analyses = await db.query.brandAnalyses.findMany({
        where: and(
          eq(brandAnalyses.userId, sessionResponse.user.id),
          eq(brandAnalyses.url, url)
        ),
        orderBy: desc(brandAnalyses.createdAt),
        limit: 1,
      });

      if (analyses.length === 0) {
        throw new ValidationError('No analysis found for this URL');
      }

      analysis = analyses[0];
      targetAnalysisId = analysis.id;
    } else {
      throw new ValidationError('Invalid request');
    }

    // Parse date range if provided
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    // Fetch snapshots for this analysis (or all analyses for this URL)
    const snapshots = await getHistoricalSnapshots(targetAnalysisId, startDate, endDate);
    
    // If tracking by URL, also get snapshots from other analyses for the same URL
    if (url && !analysisId) {
      const allAnalyses = await db.query.brandAnalyses.findMany({
        where: and(
          eq(brandAnalyses.userId, sessionResponse.user.id),
          eq(brandAnalyses.url, url)
        ),
      });
      
      // Get snapshots from all analyses for this URL
      const allSnapshots = [];
      for (const a of allAnalyses) {
        const analysisSnapshots = await getHistoricalSnapshots(a.id, startDate, endDate);
        allSnapshots.push(...analysisSnapshots);
      }
      
      // Sort by date (newest first)
      allSnapshots.sort((a, b) => 
        new Date(b.snapshotDate).getTime() - new Date(a.snapshotDate).getTime()
      );
      
      // Calculate trends from all snapshots
      const trends = calculateTrends(allSnapshots);
      
      return NextResponse.json({
        snapshots: allSnapshots,
        trends,
        totalSnapshots: allSnapshots.length,
      });
    }
    
    // Calculate trends if we have enough data
    const trends = calculateTrends(snapshots);

    return NextResponse.json({
      snapshots,
      trends,
      totalSnapshots: snapshots.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

