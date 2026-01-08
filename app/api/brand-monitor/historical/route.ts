import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getHistoricalSnapshots, calculateTrends } from '@/lib/historical-tracking';
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/api-errors';
import { db } from '@/lib/db';
import { brandAnalyses } from '@/lib/db/schema';
import { eq, and, desc, or, like } from 'drizzle-orm';
import { normalizeUrlForComparison } from '@/lib/url-normalizer';

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
      // Normalize URL for matching
      const normalizedUrl = normalizeUrlForComparison(url);
      
      // Find all analyses for this URL (normalized matching)
      const allAnalyses = await db.query.brandAnalyses.findMany({
        where: eq(brandAnalyses.userId, sessionResponse.user.id),
        orderBy: desc(brandAnalyses.createdAt),
      });

      // Filter by normalized URL match
      const matchingAnalyses = allAnalyses.filter(a => 
        normalizeUrlForComparison(a.url) === normalizedUrl
      );

      if (matchingAnalyses.length === 0) {
        throw new ValidationError('No analysis found for this URL');
      }

      // Use the most recent analysis as the primary one
      analysis = matchingAnalyses[0];
      targetAnalysisId = analysis.id;
    } else {
      throw new ValidationError('Invalid request');
    }

    // Parse date range if provided
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    // If URL is provided, aggregate snapshots from all analyses with matching URL
    if (url) {
      const normalizedUrl = normalizeUrlForComparison(url);
      
      // Get all analyses for this user
      const allAnalyses = await db.query.brandAnalyses.findMany({
        where: eq(brandAnalyses.userId, sessionResponse.user.id),
      });
      
      // Filter by normalized URL match
      const matchingAnalyses = allAnalyses.filter(a => 
        normalizeUrlForComparison(a.url) === normalizedUrl
      );
      
      console.log(`[Historical Tracking] Found ${matchingAnalyses.length} analyses for URL: ${url} (normalized: ${normalizedUrl})`);
      
      // Get snapshots from all matching analyses
      const allSnapshots = [];
      for (const a of matchingAnalyses) {
        const analysisSnapshots = await getHistoricalSnapshots(a.id, startDate, endDate);
        allSnapshots.push(...analysisSnapshots);
        console.log(`[Historical Tracking] Found ${analysisSnapshots.length} snapshots for analysis ${a.id}`);
      }
      
      // Sort by date (newest first)
      allSnapshots.sort((a, b) => 
        new Date(b.snapshotDate).getTime() - new Date(a.snapshotDate).getTime()
      );
      
      console.log(`[Historical Tracking] Total snapshots aggregated: ${allSnapshots.length}`);
      
      // Calculate trends from all snapshots
      const trends = calculateTrends(allSnapshots);
      
      return NextResponse.json({
        snapshots: allSnapshots,
        trends,
        totalSnapshots: allSnapshots.length,
      });
    }
    
    // If only analysisId is provided, get snapshots for that specific analysis
    const snapshots = await getHistoricalSnapshots(targetAnalysisId, startDate, endDate);
    
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

