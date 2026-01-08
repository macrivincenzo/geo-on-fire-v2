import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getHistoricalSnapshots, calculateTrends } from '@/lib/historical-tracking';
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/api-errors';
import { db } from '@/lib/db';
import { brandAnalyses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
    
    if (!analysisId) {
      throw new ValidationError('Invalid request', {
        analysisId: 'Analysis ID is required',
      });
    }

    // Verify the analysis belongs to the user
    const analysis = await db.query.brandAnalyses.findFirst({
      where: eq(brandAnalyses.id, analysisId),
    });

    if (!analysis) {
      throw new ValidationError('Analysis not found');
    }

    if (analysis.userId !== sessionResponse.user.id) {
      throw new AuthenticationError('You do not have access to this analysis');
    }

    // Parse date range if provided
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    // Fetch snapshots
    const snapshots = await getHistoricalSnapshots(analysisId, startDate, endDate);
    
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

