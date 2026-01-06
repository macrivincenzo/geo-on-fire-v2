'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Globe, 
  FileText,
  TrendingUp,
  BarChart3,
  Link as LinkIcon
} from 'lucide-react';
import { AIResponse } from '@/lib/types';
import { 
  aggregateSourcesByDomain, 
  calculateSourceCategories,
  calculateShareOfCitations,
  SourceCategory
} from '@/lib/source-tracker-utils';

interface SourceTrackerTabProps {
  responses: AIResponse[];
  brandName: string;
}

export function SourceTrackerTab({ responses, brandName }: SourceTrackerTabProps) {
  // Extract all sources from responses
  const allSources = useMemo(() => {
    const sources: Array<{
      url: string;
      title?: string;
      domain: string;
      domainName?: string;
      citedText?: string;
    }> = [];
    
    // Debug logging
    console.log('[Source Tracker] Processing responses:', responses.length);
    
    for (const response of responses) {
      if (response.sources && response.sources.length > 0) {
        console.log(`[Source Tracker] Found ${response.sources.length} sources in ${response.provider} response`);
        sources.push(...response.sources);
      }
      // Note: Client-side extraction removed - sources should be extracted server-side
      // If sources are missing, they weren't in the response or extraction failed server-side
    }
    
    console.log('[Source Tracker] Total sources found:', sources.length);
    return sources;
  }, [responses]);

  // Aggregate by domain
  const domainMap = useMemo(() => {
    return aggregateSourcesByDomain(allSources);
  }, [allSources]);

  // Calculate categories
  const categories = useMemo(() => {
    return calculateSourceCategories(domainMap);
  }, [domainMap]);

  // Get top domains (sorted by citations)
  const topDomains = useMemo(() => {
    const domains = Array.from(domainMap.values());
    const totalCitations = domains.reduce((sum, d) => sum + d.timesCited, 0);
    
    const domainsWithShare = calculateShareOfCitations(domains, totalCitations);
    
    return domainsWithShare
      .sort((a, b) => b.timesCited - a.timesCited)
      .slice(0, 10)
      .map(d => ({
        ...d,
        domain: d.domain,
        domainName: d.domainName,
      }));
  }, [domainMap]);

  // Get top pages (sorted by citations)
  const topPages = useMemo(() => {
    const pages: Array<{
      url: string;
      title?: string;
      domain: string;
      timesCited: number;
    }> = [];
    
    const pageMap = new Map<string, {
      url: string;
      title?: string;
      domain: string;
      timesCited: number;
    }>();
    
    for (const source of allSources) {
      const key = source.url.toLowerCase();
      if (pageMap.has(key)) {
        pageMap.get(key)!.timesCited++;
      } else {
        pageMap.set(key, {
          url: source.url,
          title: source.title,
          domain: source.domain,
          timesCited: 1,
        });
      }
    }
    
    const totalCitations = Array.from(pageMap.values()).reduce((sum, p) => sum + p.timesCited, 0);
    
    return calculateShareOfCitations(Array.from(pageMap.values()), totalCitations)
      .sort((a, b) => b.timesCited - a.timesCited)
      .slice(0, 10);
  }, [allSources]);

  const totalCitations = allSources.length;
  const uniqueDomains = domainMap.size;
  const uniquePages = new Set(allSources.map(s => s.url.toLowerCase())).size;

  if (totalCitations === 0) {
    return (
      <div className="flex flex-col h-full">
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Source Tracker</CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Track which domains and pages cite your brand in AI responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-dashed border-gray-300">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-base font-semibold text-gray-700 mb-1">No sources found</p>
              <p className="text-sm text-gray-600">Sources will appear here when AI responses include citations or URLs.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <LinkIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Total Citations</p>
                <p className="text-2xl font-bold text-gray-900">{totalCitations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Unique Domains</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueDomains}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Unique Pages</p>
                <p className="text-2xl font-bold text-gray-900">{uniquePages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Top Cited Domains */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-white border-b">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl font-bold text-gray-900">Top Cited Domains</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-600 mt-1.5">
              Domains that cite {brandName} most frequently
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {topDomains.map((domain, idx) => {
                const domainData = domainMap.get(domain.domain);
                const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain.domain}&sz=32`;
                
                return (
                  <div 
                    key={domain.domain}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded flex items-center justify-center bg-white border border-gray-200 flex-shrink-0">
                        <img 
                          src={faviconUrl}
                          alt={domain.domain}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextSibling as HTMLDivElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="w-full h-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold rounded"
                          style={{ display: 'none' }}
                        >
                          {domain.domainName?.charAt(0) || domain.domain.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {domain.domainName || domain.domain}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{domain.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{domain.timesCited}</p>
                        <p className="text-xs text-gray-500">{domain.shareOfCitations}%</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs capitalize"
                      >
                        {domainData?.category || 'Other'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Cited Pages */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-white border-b">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-xl font-bold text-gray-900">Top Cited Pages</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-600 mt-1.5">
              Specific pages that cite {brandName}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {topPages.map((page) => {
                const faviconUrl = `https://www.google.com/s2/favicons?domain=${page.domain}&sz=32`;
                
                return (
                  <div 
                    key={page.url}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-white border border-gray-200 flex-shrink-0 mt-0.5">
                      <img 
                        src={faviconUrl}
                        alt={page.domain}
                        className="w-5 h-5 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {page.title ? (
                        <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                          {page.title}
                        </p>
                      ) : null}
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 truncate"
                      >
                        {page.url}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{page.timesCited}</p>
                      <p className="text-xs text-gray-500">{page.shareOfCitations}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Categories Breakdown */}
      {categories.length > 0 && (
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-white border-b">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-xl font-bold text-gray-900">Source Categories</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-600 mt-1.5">
              Breakdown of citation sources by category
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-gray-700 capitalize">
                    {category.name}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full transition-all"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <div className="w-20 text-right text-sm font-semibold text-gray-900">
                        {category.percentage}%
                      </div>
                      <div className="w-16 text-right text-xs text-gray-500">
                        ({category.count})
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

