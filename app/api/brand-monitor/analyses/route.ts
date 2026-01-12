import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { brandAnalyses } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/api-errors';
import { extractSnapshotMetrics, saveAnalysisSnapshot } from '@/lib/historical-tracking';
import { saveSourcesToDatabase } from '@/lib/save-sources';

// GET /api/brand-monitor/analyses - Get user's brand analyses
export async function GET(request: NextRequest) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError('Please log in to view your analyses');
    }

    const analyses = await db.query.brandAnalyses.findMany({
      where: eq(brandAnalyses.userId, sessionResponse.user.id),
      orderBy: desc(brandAnalyses.createdAt),
    });

    return NextResponse.json(analyses);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/brand-monitor/analyses - Save a new brand analysis
export async function POST(request: NextRequest) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError('Please log in to save analyses');
    }

    const body = await request.json();
    
    if (!body.url || !body.analysisData) {
      throw new ValidationError('Invalid request', {
        url: body.url ? undefined : 'URL is required',
        analysisData: body.analysisData ? undefined : 'Analysis data is required',
      });
    }

    const [analysis] = await db.insert(brandAnalyses).values({
      userId: sessionResponse.user.id,
      url: body.url,
      companyName: body.companyName,
      industry: body.industry,
      analysisData: body.analysisData,
      competitors: body.competitors,
      prompts: body.prompts,
      creditsUsed: body.creditsUsed || 10,
    }).returning();

    // Save historical snapshot if analysis data is available
    if (body.analysisData && body.companyName) {
      try {
        console.log('[Historical Tracking] Attempting to save snapshot for:', {
          analysisId: analysis.id,
          companyName: body.companyName,
          hasAnalysisData: !!body.analysisData,
          analysisDataKeys: body.analysisData ? Object.keys(body.analysisData) : [],
        });
        
        const metrics = extractSnapshotMetrics(
          body.analysisData as any,
          body.companyName
        );
        
        console.log('[Historical Tracking] Extracted metrics:', metrics);
        
        await saveAnalysisSnapshot(analysis.id, metrics);
        
        console.log('[Historical Tracking] Snapshot saved successfully');
      } catch (snapshotError) {
        console.error('[Historical Tracking] Failed to save snapshot (non-blocking):', snapshotError);
        console.error('[Historical Tracking] Error details:', {
          message: snapshotError instanceof Error ? snapshotError.message : String(snapshotError),
          stack: snapshotError instanceof Error ? snapshotError.stack : undefined,
        });
        // Continue - snapshot saving shouldn't break analysis save
      }
    } else {
      console.warn('[Historical Tracking] Skipping snapshot - missing data:', {
        hasAnalysisData: !!body.analysisData,
        hasCompanyName: !!body.companyName,
      });
    }

    // Save sources to database if responses are available
    if (body.analysisData?.responses && Array.isArray(body.analysisData.responses)) {
      try {
        // Extract competitor URLs from competitors data
        const competitorUrls: string[] = [];
        if (body.competitors && Array.isArray(body.competitors)) {
          const { assignUrlToCompetitor } = await import('@/lib/brand-monitor-utils');
          
          for (const comp of body.competitors) {
            if (typeof comp === 'object') {
              // Object format: { name: string, url?: string }
              if (comp.url) {
                competitorUrls.push(comp.url);
              } else if (comp.name) {
                // Try to get URL from name
                const url = assignUrlToCompetitor(comp.name);
                if (url) competitorUrls.push(url);
              }
            } else if (typeof comp === 'string') {
              // String format: just the competitor name
              const url = assignUrlToCompetitor(comp);
              if (url) competitorUrls.push(url);
            }
          }
        }
        
        const context = {
          brandUrl: body.url,
          competitorUrls
        };
        
        await saveSourcesToDatabase(analysis.id, body.analysisData.responses, context);
      } catch (sourceError) {
        console.error('[Source Tracker] Failed to save sources (non-blocking):', sourceError);
        // Continue - source saving shouldn't break analysis save
      }
    }

    return NextResponse.json(analysis);
  } catch (error) {
    return handleApiError(error);
  }
}