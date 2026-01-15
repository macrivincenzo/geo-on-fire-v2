import { Analysis } from '@/lib/brand-monitor-reducer';
import { CompetitorRanking, AIResponse } from '@/lib/types';
import { Company } from '@/lib/types';

export interface ExportData {
  metadata: {
    brandName: string;
    brandUrl: string;
    exportDate: string;
    analysisDate?: string;
  };
  summary: {
    visibilityScore: number;
    sentimentScore: number;
    shareOfVoice: number;
    overallScore: number;
    averagePosition: number;
  };
  competitors: CompetitorExport[];
  responses: ResponseExport[];
  prompts: string[];
  historical?: HistoricalExport[];
}

export interface CompetitorExport {
  name: string;
  visibilityScore: number;
  sentimentScore: number;
  shareOfVoice: number;
  averagePosition: number;
  mentions: number;
  sentiment: string;
  weeklyChange?: number;
  isOwn: boolean;
}

export interface ResponseExport {
  provider: string;
  prompt: string;
  response: string;
  brandMentioned: boolean;
  brandPosition?: number;
  sentiment: string;
  confidence: number;
  timestamp: string;
  sourcesCount: number;
}

export interface HistoricalExport {
  date: string;
  visibilityScore: number;
  sentimentScore: number;
  shareOfVoice: number;
  averagePosition: number | null;
  rank: number | null;
}

/**
 * Convert analysis data to exportable format
 */
export function prepareExportData(
  analysis: Analysis,
  company: Company | null,
  historicalData?: any[]
): ExportData {
  const brandData = analysis.competitors?.find(c => c.isOwn);
  
  return {
    metadata: {
      brandName: company?.name || 'Unknown Brand',
      brandUrl: company?.url || '',
      exportDate: new Date().toISOString(),
      analysisDate: new Date().toISOString(),
    },
    summary: {
      visibilityScore: analysis.scores?.visibilityScore || 0,
      sentimentScore: analysis.scores?.sentimentScore || 0,
      shareOfVoice: analysis.scores?.shareOfVoice || 0,
      overallScore: analysis.scores?.overallScore || 0,
      averagePosition: analysis.scores?.averagePosition || 0,
    },
    competitors: (analysis.competitors || []).map(comp => ({
      name: comp.name,
      visibilityScore: comp.visibilityScore,
      sentimentScore: comp.sentimentScore,
      shareOfVoice: comp.shareOfVoice,
      averagePosition: comp.averagePosition,
      mentions: comp.mentions,
      sentiment: comp.sentiment,
      weeklyChange: comp.weeklyChange,
      isOwn: comp.isOwn || false,
    })),
    responses: (analysis.responses || []).map(resp => ({
      provider: resp.provider,
      prompt: resp.prompt,
      response: resp.response,
      brandMentioned: resp.brandMentioned,
      brandPosition: resp.brandPosition,
      sentiment: resp.sentiment,
      confidence: resp.confidence,
      timestamp: resp.timestamp instanceof Date 
        ? resp.timestamp.toISOString() 
        : new Date(resp.timestamp).toISOString(),
      sourcesCount: resp.sources?.length || 0,
    })),
    prompts: analysis.prompts?.map(p => typeof p === 'string' ? p : p.prompt) || [],
    historical: historicalData?.map(snapshot => ({
      date: snapshot.snapshotDate instanceof Date
        ? snapshot.snapshotDate.toISOString()
        : new Date(snapshot.snapshotDate).toISOString(),
      visibilityScore: snapshot.visibilityScore,
      sentimentScore: snapshot.sentimentScore,
      shareOfVoice: snapshot.shareOfVoice,
      averagePosition: snapshot.averagePosition,
      rank: snapshot.rank,
    })),
  };
}

/**
 * Convert export data to CSV format
 */
export function convertToCSV(data: ExportData): string {
  const lines: string[] = [];
  
  // Metadata section
  lines.push('=== METADATA ===');
  lines.push(`Brand Name,${data.metadata.brandName}`);
  lines.push(`Brand URL,${data.metadata.brandUrl}`);
  lines.push(`Export Date,${data.metadata.exportDate}`);
  lines.push(`Analysis Date,${data.metadata.analysisDate || ''}`);
  lines.push('');
  
  // Summary section
  lines.push('=== SUMMARY ===');
  lines.push(`Visibility Score,${data.summary.visibilityScore}`);
  lines.push(`Sentiment Score,${data.summary.sentimentScore}`);
  lines.push(`Share of Voice,${data.summary.shareOfVoice}`);
  lines.push(`Overall Score,${data.summary.overallScore}`);
  lines.push(`Average Position,${data.summary.averagePosition}`);
  lines.push('');
  
  // Competitors section
  lines.push('=== COMPETITORS ===');
  lines.push('Name,Visibility Score,Sentiment Score,Share of Voice,Average Position,Mentions,Sentiment,Weekly Change,Is Own Brand');
  data.competitors.forEach(comp => {
    const row = [
      escapeCSV(comp.name),
      comp.visibilityScore.toString(),
      comp.sentimentScore.toString(),
      comp.shareOfVoice.toString(),
      comp.averagePosition.toString(),
      comp.mentions.toString(),
      comp.sentiment,
      comp.weeklyChange?.toString() || '',
      comp.isOwn ? 'Yes' : 'No',
    ];
    lines.push(row.join(','));
  });
  lines.push('');
  
  // Responses section
  lines.push('=== AI RESPONSES ===');
  lines.push('Provider,Prompt,Brand Mentioned,Brand Position,Sentiment,Confidence,Timestamp,Sources Count');
  data.responses.forEach(resp => {
    const row = [
      escapeCSV(resp.provider),
      escapeCSV(resp.prompt),
      resp.brandMentioned ? 'Yes' : 'No',
      resp.brandPosition?.toString() || '',
      resp.sentiment,
      resp.confidence.toString(),
      resp.timestamp,
      resp.sourcesCount.toString(),
    ];
    lines.push(row.join(','));
  });
  lines.push('');
  
  // Prompts section
  lines.push('=== PROMPTS ===');
  lines.push('Prompt');
  data.prompts.forEach(prompt => {
    lines.push(escapeCSV(prompt));
  });
  lines.push('');
  
  // Historical data section (if available)
  if (data.historical && data.historical.length > 0) {
    lines.push('=== HISTORICAL DATA ===');
    lines.push('Date,Visibility Score,Sentiment Score,Share of Voice,Average Position,Rank');
    data.historical.forEach(snapshot => {
      const row = [
        snapshot.date,
        snapshot.visibilityScore.toString(),
        snapshot.sentimentScore.toString(),
        snapshot.shareOfVoice.toString(),
        snapshot.averagePosition?.toString() || '',
        snapshot.rank?.toString() || '',
      ];
      lines.push(row.join(','));
    });
  }
  
  return lines.join('\n');
}

/**
 * Escape CSV values
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Convert export data to JSON format
 */
export function convertToJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
