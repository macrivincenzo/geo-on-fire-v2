/**
 * Save sources to database
 * Aggregates sources from AI responses and saves them to source_domains and source_pages tables
 */

import { db } from './db';
import { sourceDomains, sourcePages } from './db/schema';
import { 
  aggregateSourcesByDomain, 
  categorizeDomain 
} from './source-tracker-utils';
import { AIResponse } from './types';

export async function saveSourcesToDatabase(
  brandAnalysisId: string,
  responses: AIResponse[],
  context?: {
    brandUrl?: string;
    competitorUrls?: string[];
  }
): Promise<void> {
  try {
    console.log('[Source Tracker] Saving sources to database for analysis:', brandAnalysisId);
    
    // Collect all sources from all responses
    const allSources: Array<{
      url: string;
      title?: string;
      domain: string;
      domainName?: string;
      citedText?: string;
    }> = [];
    
    for (const response of responses) {
      if (response.sources && response.sources.length > 0) {
        allSources.push(...response.sources);
      }
    }
    
    console.log('[Source Tracker] Total sources found:', allSources.length);
    
    if (allSources.length === 0) {
      console.log('[Source Tracker] No sources to save');
      return;
    }
    
    // Aggregate sources by domain with context for categorization
    const domainMap = aggregateSourcesByDomain(allSources, context);
    
    // Calculate total citations for share calculation
    const totalCitations = allSources.length;
    
    // Save domains and pages
    for (const [domainKey, domainData] of domainMap.entries()) {
      // Calculate share of citations for this domain
      const shareOfCitations = totalCitations > 0 
        ? Math.round((domainData.timesCited / totalCitations) * 1000) / 10 
        : 0;
      
      // Save domain (category is already set by aggregateSourcesByDomain with context)
      const [savedDomain] = await db.insert(sourceDomains).values({
        brandAnalysisId,
        domain: domainData.domain,
        domainName: domainData.domainName,
        timesCited: domainData.timesCited,
        shareOfCitations,
        category: domainData.category, // Already categorized with context
      }).returning();
      
      console.log('[Source Tracker] Saved domain:', savedDomain.domain, 'with', domainData.timesCited, 'citations');
      
      // Save pages for this domain
      for (const page of domainData.pages) {
        await db.insert(sourcePages).values({
          brandAnalysisId,
          domainId: savedDomain.id,
          url: page.url,
          title: page.title,
          timesCited: 1, // Each page appears once per response
          shareOfCitations: Math.round((1 / allSources.length) * 100), // Rough estimate
        });
      }
    }
    
    console.log('[Source Tracker] Successfully saved', domainMap.size, 'domains and', allSources.length, 'pages');
  } catch (error) {
    console.error('[Source Tracker] Error saving sources to database:', error);
    throw error;
  }
}

