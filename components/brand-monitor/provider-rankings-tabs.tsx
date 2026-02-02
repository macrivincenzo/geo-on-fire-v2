'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ProviderSpecificRanking } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Image from 'next/image';
import { getConfiguredProviders } from '@/lib/provider-config';
import { ProviderRankingsExplanation } from './explanation-card';

// Provider icon mapping
const getProviderIcon = (provider: string) => {
  switch (provider) {
    case 'OpenAI':
      return (
        <img 
          src="https://cdn.brandfetch.io/idR3duQxYl/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B" 
          alt="OpenAI" 
          className="w-7 h-7"
        />
      );
    case 'Anthropic':
      return (
        <img 
          src="https://cdn.brandfetch.io/idmJWF3N06/theme/dark/symbol.svg" 
          alt="Anthropic" 
          className="w-6 h-6"
        />
      );
    case 'Google':
      return (
        <div className="w-7 h-7 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
      );
    case 'Perplexity':
      return (
        <img 
          src="https://cdn.brandfetch.io/idNdawywEZ/w/800/h/800/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B" 
          alt="Perplexity" 
          className="w-6 h-6"
        />
      );
    default:
      return <div className="w-7 h-7 bg-gray-400 rounded" />;
  }
};

interface ProviderRankingsTabsProps {
  providerRankings: ProviderSpecificRanking[];
  brandName: string;
  shareOfVoice?: number;
  averagePosition?: number;
  sentimentScore?: number;
  weeklyChange?: number;
}

// Company cell component with favicon support
const CompanyCell = ({ 
  name, 
  isOwn, 
  url 
}: { 
  name: string; 
  isOwn?: boolean; 
  url?: string;
}) => {
  const [faviconError, setFaviconError] = useState(false);
  
  // Generate favicon URL using Google's favicon service
  const faviconUrl = url ? `https://www.google.com/s2/favicons?domain=${url}&sz=64` : null;
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 flex items-center justify-center rounded overflow-hidden flex-shrink-0">
        {faviconUrl && !faviconError ? (
          <Image
            src={faviconUrl}
            alt={`${name} logo`}
            width={20}
            height={20}
            className="object-contain"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-600 font-semibold text-[10px]">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <span className={`text-sm ${
        isOwn ? 'font-semibold text-black' : 'text-black'
      }`}>
        {name}
      </span>
    </div>
  );
};

// Generate a fallback URL from competitor name
const generateFallbackUrl = (competitorName: string): string | undefined => {
  const cleanName = competitorName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .trim();
  
  if (cleanName.length < 3 || ['inc', 'llc', 'corp', 'company', 'the'].includes(cleanName)) {
    return undefined;
  }
  
  return `${cleanName}.com`;
};

export function ProviderRankingsTabs({ 
  providerRankings, 
  brandName,
  shareOfVoice,
  averagePosition,
  sentimentScore,
  weeklyChange
}: ProviderRankingsTabsProps) {
  const [selectedProvider, setSelectedProvider] = useState(
    providerRankings?.[0]?.provider || 'OpenAI'
  );

  if (!providerRankings || providerRankings.length === 0) return null;

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge variant="secondary" className="bg-green-50 text-black text-xs">Positive</Badge>;
      case 'negative':
        return <Badge variant="secondary" className="bg-red-50 text-black text-xs">Negative</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-50 text-black text-xs">Neutral</Badge>;
    }
  };

  const getChangeIcon = (change: number | undefined) => {
    if (!change) return <Minus className="h-3 w-3 text-gray-400" />;
    if (change > 0) return <TrendingUp className="h-3 w-3 text-black" />;
    return <TrendingDown className="h-3 w-3 text-black" />;
  };

  // Get the selected provider's data
  const selectedProviderData = providerRankings.find(p => p.provider === selectedProvider);
  const competitors = selectedProviderData?.competitors || [];
  const brandRank = competitors.findIndex(c => c.isOwn) + 1;
  const brandVisibility = competitors.find(c => c.isOwn)?.visibilityScore || 0;

  return (
    <div className="flex flex-col h-full">
      {/* Simple Explanation Card */}
      <ProviderRankingsExplanation brandName={brandName} />
      
      <Card className="p-2 bg-card text-card-foreground gap-6 rounded-xl border py-6 shadow-sm border-gray-200 h-full flex flex-col">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold">Provider Rankings</CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Your brand performance by AI provider (per-provider visibility scores)
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600">#{brandRank}</p>
              <p className="text-xs text-gray-500 mt-1">Average Rank</p>
            </div>
          </div>
        </CardHeader>
      <CardContent className="pt-6 pb-2 flex-1 flex flex-col">
        <Tabs value={selectedProvider} onValueChange={setSelectedProvider} className="flex-1 flex flex-col">
          <TabsList className={`grid w-full mb-2 h-14 ${providerRankings.length === 2 ? 'grid-cols-2' : providerRankings.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
            {providerRankings.map(({ provider }) => {
              // Provider info is now handled by icon mapping directly
              return (
                <TabsTrigger 
                  key={provider} 
                  value={provider} 
                  className="text-sm flex items-center justify-center h-full"
                  title={provider}
                >
                  {getProviderIcon(provider)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {providerRankings.map(({ provider, competitors }) => {
            // Show all tracked competitors for consistency, but sort by visibility
            const sortedCompetitors = [...competitors].sort((a, b) => {
              // Brand always first, then by visibility score
              if (a.isOwn) return -1;
              if (b.isOwn) return 1;
              return b.visibilityScore - a.visibilityScore;
            });
            
            return (
            <TabsContent key={provider} value={provider} className="mt-0">
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="border-b-2 border-r border-gray-300 text-left p-4 text-xs font-semibold text-gray-900 uppercase tracking-wider w-12">#</th>
                      <th className="border-b-2 border-r border-gray-300 text-left p-4 text-xs font-semibold text-gray-900 uppercase tracking-wider w-[200px]">Company</th>
                      <th className="border-b-2 border-r border-gray-300 text-right p-4 text-xs font-semibold text-gray-900 uppercase tracking-wider">Visibility</th>
                      <th className="border-b-2 border-r border-gray-300 text-right p-4 text-xs font-semibold text-gray-900 uppercase tracking-wider">Share of Voice</th>
                      <th className="border-b-2 border-gray-300 text-right p-4 text-xs font-semibold text-gray-900 uppercase tracking-wider">Sentiment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCompetitors.map((competitor, idx) => {
                      const competitorUrl = generateFallbackUrl(competitor.name);
                      const hasVisibility = competitor.visibilityScore > 0;
                      
                      return (
                        <tr
                          key={idx}
                          className={`
                            ${idx > 0 ? 'border-t border-gray-200' : ''}
                            ${competitor.isOwn
                              ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-l-orange-500'
                              : hasVisibility
                              ? 'hover:bg-gray-50 transition-colors'
                              : 'opacity-60 bg-gray-50'
                            }
                          `}
                        >
                          <td className="border-r border-gray-200 p-4">
                            <div className="flex items-center justify-center">
                              {hasVisibility ? (
                                <span className={`text-sm font-bold ${
                                  competitor.isOwn ? 'text-orange-700' : idx === 0 ? 'text-blue-600' : 'text-gray-700'
                                }`}>
                                  #{idx + 1}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-4">
                            <CompanyCell
                              name={competitor.name}
                              isOwn={competitor.isOwn}
                              url={competitorUrl}
                            />
                          </td>
                          <td className="border-r border-gray-200 p-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-base font-semibold ${
                                  competitor.isOwn ? 'text-orange-700' : 'text-gray-900'
                                }`}>
                                  {competitor.visibilityScore}%
                                </span>
                                {competitor.weeklyChange !== undefined && competitor.weeklyChange !== 0 && (
                                  <span className={`text-xs ${
                                    competitor.weeklyChange > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {getChangeIcon(competitor.weeklyChange)}
                                  </span>
                                )}
                              </div>
                              {hasVisibility && (
                                <div className="w-20 bg-gray-200 h-1.5 overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ${
                                      competitor.isOwn ? 'bg-orange-500' : 'bg-blue-600'
                                    }`}
                                    style={{ width: `${competitor.visibilityScore}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border-r border-gray-200 p-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm font-medium text-gray-900">
                                {competitor.shareOfVoice}%
                              </span>
                              {hasVisibility && (
                                <div className="w-16 bg-gray-200 h-1 overflow-hidden">
                                  <div
                                    className="h-full bg-purple-500 transition-all duration-300"
                                    style={{ width: `${competitor.shareOfVoice}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            {getSentimentBadge(competitor.sentiment)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            );
          })}
        </Tabs>
        
        {/* Metrics Row at Bottom - Enhanced Design */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t-2 border-gray-200">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 text-center transition-transform hover:scale-105">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Competitors</p>
            <p className="text-2xl font-bold text-blue-900">{competitors.length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 p-4 text-center transition-transform hover:scale-105">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">{brandName} Rank</p>
            <p className="text-2xl font-bold text-orange-900">
              #{brandRank}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 text-center transition-transform hover:scale-105">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">{brandName} Visibility</p>
            <p className="text-2xl font-bold text-green-900">
              {brandVisibility}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-4 text-center transition-transform hover:scale-105">
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">Share of Voice</p>
            <p className="text-2xl font-bold text-purple-900">{shareOfVoice}%</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 p-4 text-center transition-transform hover:scale-105">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-2">Average Position</p>
            <p className="text-2xl font-bold text-indigo-900">#{averagePosition}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 p-4 text-center transition-transform hover:scale-105">
            <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide mb-2">Sentiment Score</p>
            <p className="text-2xl font-bold text-pink-900">{sentimentScore}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}