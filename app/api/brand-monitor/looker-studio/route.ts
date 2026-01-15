import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brandAnalyses, brandAnalysisSnapshots } from '@/lib/db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

/**
 * Google Looker Studio Community Connector
 * Returns data in the format expected by Looker Studio
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestType = searchParams.get('requestType');
    
    // Handle schema request (required by Looker Studio)
    if (requestType === 'schema') {
      return NextResponse.json({
        schema: [
          {
            name: 'date',
            label: 'Date',
            dataType: 'STRING',
            semantics: {
              conceptType: 'DIMENSION',
              semanticType: 'YEAR_MONTH_DAY',
            },
          },
          {
            name: 'brand_name',
            label: 'Brand Name',
            dataType: 'STRING',
            semantics: {
              conceptType: 'DIMENSION',
            },
          },
          {
            name: 'visibility_score',
            label: 'Visibility Score',
            dataType: 'NUMBER',
            semantics: {
              conceptType: 'METRIC',
              semanticType: 'NUMBER',
            },
          },
          {
            name: 'sentiment_score',
            label: 'Sentiment Score',
            dataType: 'NUMBER',
            semantics: {
              conceptType: 'METRIC',
              semanticType: 'NUMBER',
            },
          },
          {
            name: 'share_of_voice',
            label: 'Share of Voice',
            dataType: 'NUMBER',
            semantics: {
              conceptType: 'METRIC',
              semanticType: 'PERCENT',
            },
          },
          {
            name: 'average_position',
            label: 'Average Position',
            dataType: 'NUMBER',
            semantics: {
              conceptType: 'METRIC',
              semanticType: 'NUMBER',
            },
          },
          {
            name: 'rank',
            label: 'Rank',
            dataType: 'NUMBER',
            semantics: {
              conceptType: 'METRIC',
              semanticType: 'NUMBER',
            },
          },
          {
            name: 'competitor_name',
            label: 'Competitor Name',
            dataType: 'STRING',
            semantics: {
              conceptType: 'DIMENSION',
            },
          },
          {
            name: 'mentions',
            label: 'Mentions',
            dataType: 'NUMBER',
            semantics: {
              conceptType: 'METRIC',
              semanticType: 'NUMBER',
            },
          },
        ],
      });
    }
    
    // Handle data request
    const analysisId = searchParams.get('analysisId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch analysis
    const analysisRecord = await db.query.brandAnalyses.findFirst({
      where: eq(brandAnalyses.id, analysisId),
    });
    
    if (!analysisRecord) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }
    
    // Fetch historical snapshots
    const conditions = [eq(brandAnalysisSnapshots.brandAnalysisId, analysisId)];
    
    if (startDate) {
      conditions.push(gte(brandAnalysisSnapshots.snapshotDate, new Date(startDate)));
    }
    
    if (endDate) {
      conditions.push(lte(brandAnalysisSnapshots.snapshotDate, new Date(endDate)));
    }
    
    const snapshots = await db.query.brandAnalysisSnapshots.findMany({
      where: and(...conditions),
      orderBy: desc(brandAnalysisSnapshots.snapshotDate),
    });
    
    // Parse current analysis data
    const analysis = typeof analysisRecord.analysisData === 'string'
      ? JSON.parse(analysisRecord.analysisData)
      : analysisRecord.analysisData;
    
    // Format data for Looker Studio
    const rows: any[] = [];
    
    // Add current analysis data
    const currentDate = new Date().toISOString().split('T')[0];
    const brandData = analysis.competitors?.find((c: any) => c.isOwn);
    
    if (brandData) {
      rows.push({
        date: currentDate,
        brand_name: analysisRecord.companyName || '',
        visibility_score: brandData.visibilityScore || 0,
        sentiment_score: brandData.sentimentScore || 0,
        share_of_voice: brandData.shareOfVoice || 0,
        average_position: brandData.averagePosition || null,
        rank: null, // Will be calculated from snapshots
        competitor_name: '',
        mentions: brandData.mentions || 0,
      });
    }
    
    // Add competitor data
    (analysis.competitors || []).forEach((comp: any) => {
      if (!comp.isOwn) {
        rows.push({
          date: currentDate,
          brand_name: analysisRecord.companyName || '',
          visibility_score: comp.visibilityScore || 0,
          sentiment_score: comp.sentimentScore || 0,
          share_of_voice: comp.shareOfVoice || 0,
          average_position: comp.averagePosition || null,
          rank: null,
          competitor_name: comp.name,
          mentions: comp.mentions || 0,
        });
      }
    });
    
    // Add historical snapshot data
    snapshots.forEach(snapshot => {
      const snapshotDate = snapshot.snapshotDate instanceof Date
        ? snapshot.snapshotDate.toISOString().split('T')[0]
        : new Date(snapshot.snapshotDate).toISOString().split('T')[0];
      
      rows.push({
        date: snapshotDate,
        brand_name: analysisRecord.companyName || '',
        visibility_score: snapshot.visibilityScore,
        sentiment_score: snapshot.sentimentScore,
        share_of_voice: snapshot.shareOfVoice,
        average_position: snapshot.averagePosition,
        rank: snapshot.rank,
        competitor_name: '',
        mentions: 0,
      });
    });
    
    return NextResponse.json({
      rows,
    });
  } catch (error: any) {
    console.error('Looker Studio connector error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}
