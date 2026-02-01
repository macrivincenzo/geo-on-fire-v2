'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  ExternalLink,
  BarChart3,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';
import { AIResponse } from '@/lib/types';
import { 
  aggregateSourcesByDomain,
  extractDomain,
  getDomainName
} from '@/lib/source-tracker-utils';
import { normalizeUrlForComparison } from '@/lib/url-normalizer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DomainComparisonsTabProps {
  responses: AIResponse[];
  brandName: string;
  brandUrl?: string;
  competitorUrls?: Array<{ name: string; url?: string }>;
}

interface BrandDomainData {
  domain: string;
  domainName: string;
  brand: string; // 'yours' | competitor name
  timesCited: number;
  shareOfCitations: number;
  pages: Array<{
    url: string;
    title?: string;
    timesCited: number;
    shareOfCitations: number;
  }>;
}

export function DomainComparisonsTab({ 
  responses, 
  brandName, 
  brandUrl,
  competitorUrls = []
}: DomainComparisonsTabProps) {
  const [viewMode, setViewMode] = useState<'domains' | 'pages'>('domains');
  
  // Extract all sources
  const allSources = useMemo(() => {
    const sources: Array<{
      url: string;
      title?: string;
      domain: string;
      domainName?: string;
    }> = [];
    
    for (const response of responses) {
      if (response.sources && response.sources.length > 0) {
        sources.push(...response.sources);
      }
    }
    
    return sources;
  }, [responses]);

  // Normalize brand and competitor URLs for matching
  const normalizedBrandUrl = brandUrl ? normalizeUrlForComparison(brandUrl) : null;
  const normalizedCompetitorUrls = useMemo(() => {
    const map = new Map<string, string>(); // normalized domain -> competitor name
    competitorUrls.forEach(comp => {
      if (comp.url) {
        const normalized = normalizeUrlForComparison(comp.url);
        map.set(normalized, comp.name);
      }
    });
    return map;
  }, [competitorUrls]);

  // Identify which domains belong to brand vs competitors
  const brandDomainData = useMemo(() => {
    const domainMap = new Map<string, BrandDomainData>();
    const pageMap = new Map<string, Map<string, { url: string; title?: string; timesCited: number }>>();
    
    // First pass: collect all brand/competitor domain citations
    for (const source of allSources) {
      const domain = source.domain;
      const normalizedDomain = normalizeUrlForComparison(domain);
      
      // Determine if this domain belongs to brand or a competitor
      let brand: string = 'other';
      if (normalizedBrandUrl && normalizedDomain === normalizedBrandUrl) {
        brand = 'yours';
      } else {
        const competitorName = normalizedCompetitorUrls.get(normalizedDomain);
        if (competitorName) {
          brand = competitorName;
        }
      }
      
      // Only track brand and competitor domains
      if (brand === 'other') continue;
      
      // Track domain
      if (!domainMap.has(domain)) {
        domainMap.set(domain, {
          domain,
          domainName: source.domainName || getDomainName(domain),
          brand,
          timesCited: 0,
          shareOfCitations: 0,
          pages: []
        });
        pageMap.set(domain, new Map());
      }
      
      const domainData = domainMap.get(domain)!;
      domainData.timesCited++;
      
      // Track page
      const pages = pageMap.get(domain)!;
      const pageKey = source.url.toLowerCase();
      if (!pages.has(pageKey)) {
        pages.set(pageKey, {
          url: source.url,
          title: source.title,
          timesCited: 0
        });
      }
      pages.get(pageKey)!.timesCited++;
    }
    
    // Calculate total brand domain citations (only from tracked domains)
    const totalBrandDomainCitations = Array.from(domainMap.values())
      .reduce((sum, d) => sum + d.timesCited, 0);
    
    // Calculate share of citations based on brand domain citations only
    const result: BrandDomainData[] = [];
    for (const [domain, data] of domainMap.entries()) {
      data.shareOfCitations = totalBrandDomainCitations > 0 
        ? Math.round((data.timesCited / totalBrandDomainCitations) * 1000) / 10 
        : 0;
      
      const pages = pageMap.get(domain)!;
      
      data.pages = Array.from(pages.values())
        .map(page => ({
          ...page,
          shareOfCitations: totalBrandDomainCitations > 0 
            ? Math.round((page.timesCited / totalBrandDomainCitations) * 1000) / 10 
            : 0
        }))
        .sort((a, b) => b.timesCited - a.timesCited);
      
      result.push(data);
    }
    
    return result.sort((a, b) => b.timesCited - a.timesCited);
  }, [allSources, normalizedBrandUrl, normalizedCompetitorUrls]);

  // Separate brand domains from competitor domains
  const yourDomains = brandDomainData.filter(d => d.brand === 'yours');
  const competitorDomains = brandDomainData.filter(d => d.brand !== 'yours');
  
  // Prepare chart data (simplified - showing current snapshot)
  // In a real implementation, you'd fetch historical data
  const chartData = useMemo(() => {
    const data: Array<{ domain: string; share: number; brand: string }> = [];
    
    // Add top 10 domains
    brandDomainData.slice(0, 10).forEach(d => {
      data.push({
        domain: d.domainName,
        share: d.shareOfCitations,
        brand: d.brand === 'yours' ? brandName : d.brand
      });
    });
    
    return data;
  }, [brandDomainData, brandName]);

  const totalBrandCitations = yourDomains.reduce((sum, d) => sum + d.timesCited, 0);
  const totalCompetitorCitations = competitorDomains.reduce((sum, d) => sum + d.timesCited, 0);
  const totalTrackedCitations = totalBrandCitations + totalCompetitorCitations;

  if (totalTrackedCitations === 0) {
    return (
      <div className="flex flex-col h-full">
        <Card className="rounded-none border-2 border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Domain Comparisons</CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Compare citation share between your brand domains and competitor domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-none border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No brand domain citations found</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Domain comparisons will appear here when AI responses cite domains belonging to {brandName} or its competitors.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <Card className="rounded-none border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Domain Comparisons</CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            Compare citation share between your brand domains and competitor domains over time
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-none border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{yourDomains.length}</p>
              <p className="text-xs uppercase tracking-wider text-gray-500 mt-2 font-semibold">Your Brand Domains</p>
              <p className="text-xs text-gray-400 mt-1">{totalBrandCitations} citations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{competitorDomains.length}</p>
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-2 font-semibold">Competitor Domains</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{totalCompetitorCitations} citations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {totalTrackedCitations > 0 ? Math.round((totalBrandCitations / totalTrackedCitations) * 100) : 0}%
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-2 font-semibold">Your Share</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">of brand domain citations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Cited Brand Domains Table */}
      <Card className="rounded-none border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Top Cited Brand Domains</CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Most cited brand domains across AI platforms
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('domains')}
                className={`px-3 py-1.5 text-sm font-medium rounded-none border-2 transition-colors ${
                  viewMode === 'domains'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Domains
              </button>
              <button
                onClick={() => setViewMode('pages')}
                className={`px-3 py-1.5 text-sm font-medium rounded-none border-2 transition-colors ${
                  viewMode === 'pages'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pages
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'domains' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">#</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Domain</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Brand</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Times Cited</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {brandDomainData.slice(0, 10).map((domain, index) => (
                    <tr key={domain.domain} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">{domain.domain}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={domain.brand === 'yours' ? 'default' : 'outline'}
                          className={domain.brand === 'yours' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
                        >
                          {domain.brand === 'yours' ? brandName : domain.brand}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900">{domain.timesCited}</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600">{domain.shareOfCitations}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              {brandDomainData.slice(0, 10).flatMap((domain, domainIndex) => 
                domain.pages.slice(0, 3).map((page, pageIndex) => (
                  <div key={`${domain.domain}-${page.url}`} className="border-2 border-gray-200 dark:border-gray-600 rounded-none p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <LinkIcon className="w-4 h-4 text-gray-400" />
                          <a 
                            href={page.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:underline truncate"
                          >
                            {page.url}
                          </a>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </div>
                        {page.title && (
                          <p className="text-xs text-gray-600 mb-2">{page.title}</p>
                        )}
                        <div className="flex items-center gap-4">
                          <Badge 
                            variant={domain.brand === 'yours' ? 'default' : 'outline'}
                            className={domain.brand === 'yours' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}
                          >
                            {domain.brand === 'yours' ? brandName : domain.brand}
                          </Badge>
                          <span className="text-xs text-gray-500">{domain.domain}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-gray-900">{page.timesCited}</p>
                        <p className="text-xs text-gray-500">{page.shareOfCitations}%</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Citation Share Chart */}
      {chartData.length > 0 && (
        <Card className="rounded-none border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Citation Share by Domain</CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              Your brand domains compared to competitor domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="domain" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Share of Citations (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Share']}
                  labelFormatter={(label) => `Domain: ${label}`}
                />
                <Legend />
                <Bar 
                  name="Citation Share" 
                  dataKey="share" 
                  fill="#3b82f6"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.brand === brandName ? '#3b82f6' : '#f59e0b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

