/**
 * Save sources to database
 * Aggregates sources from AI responses and saves them to source_domains and source_pages tables
 */

import { db } from './db';
import { sourceDomains, sourcePages } from './db/schema';
import { 
  aggregateSourcesByDomain, 
  calculateShareOfCitations,
  categorizeSource 
} from './source-tracker-utils';
import { AIResponse } from './types';

export async function saveSourcesToDatabase(
  brandAnalysisId: string,
  responses: AIResponse[]
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
    
    // Aggregate sources by domain
    const domainMap = aggregateSourcesByDomain(allSources);
    const domainMapWithShares = calculateShareOfCitations(domainMap);
    
    // Save domains and pages
    for (const [domainKey, domainData] of domainMapWithShares.entries()) {
      // Save domain
      const [savedDomain] = await db.insert(sourceDomains).values({
        brandAnalysisId,
        domain: domainData.domain,
        domainName: domainData.domainName,
        timesCited: domainData.timesCited,
        shareOfCitations: domainData.share,
        category: categorizeSource(domainData.domain),
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
    
    console.log('[Source Tracker] Successfully saved', domainMapWithShares.size, 'domains and', allSources.length, 'pages');
  } catch (error) {
    console.error('[Source Tracker] Error saving sources to database:', error);
    throw error;
  }
}

