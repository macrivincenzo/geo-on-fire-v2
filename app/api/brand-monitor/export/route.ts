import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brandAnalyses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { prepareExportData, convertToCSV, convertToJSON } from '@/lib/export-utils';
import { getHistoricalSnapshots } from '@/lib/historical-tracking';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const analysisId = searchParams.get('analysisId');
    const format = searchParams.get('format') || 'json'; // 'json' or 'csv'
    
    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch analysis from database
    const analysisRecord = await db.query.brandAnalyses.findFirst({
      where: eq(brandAnalyses.id, analysisId),
    });
    
    if (!analysisRecord || !analysisRecord.analysisData) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }
    
    // Parse analysis data
    const analysis = typeof analysisRecord.analysisData === 'string'
      ? JSON.parse(analysisRecord.analysisData)
      : analysisRecord.analysisData;
    
    // Fetch historical data if available
    let historicalData = null;
    try {
      historicalData = await getHistoricalSnapshots(analysisId);
    } catch (error) {
      console.warn('Could not fetch historical data:', error);
    }
    
    // Prepare export data
    const exportData = prepareExportData(
      analysis,
      {
        id: analysisRecord.id,
        name: analysisRecord.companyName || '',
        url: analysisRecord.url || '',
        industry: analysisRecord.industry || undefined,
      },
      historicalData || undefined
    );
    
    // Convert to requested format
    if (format === 'csv') {
      const csv = convertToCSV(exportData);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="brand-analysis-${analysisId}-${Date.now()}.csv"`,
        },
      });
    } else {
      const json = convertToJSON(exportData);
      return new NextResponse(json, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="brand-analysis-${analysisId}-${Date.now()}.json"`,
        },
      });
    }
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data', details: error.message },
      { status: 500 }
    );
  }
}
