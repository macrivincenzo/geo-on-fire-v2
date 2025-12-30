'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Building2, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { Company } from '@/lib/types';
import Image from 'next/image';

interface CompanyCardProps {
  company: Company;
  onAnalyze: () => void;
  analyzing: boolean;
  showCompetitors?: boolean;
  identifiedCompetitors?: Array<{ 
    name: string; 
    url?: string;
    metadata?: {
      ogImage?: string;
      favicon?: string;
      description?: string;
      validated?: boolean;
    };
    loading?: boolean;
  }>;
  onRemoveCompetitor?: (index: number) => void;
  onAddCompetitor?: () => void;
  onContinueToAnalysis?: () => void;
}

export function CompanyCard({ 
  company, 
  onAnalyze, 
  analyzing,
  showCompetitors = false,
  identifiedCompetitors = [],
  onRemoveCompetitor,
  onAddCompetitor,
  onContinueToAnalysis 
}: CompanyCardProps) {
  const [logoError, setLogoError] = React.useState(false);
  const [faviconError, setFaviconError] = React.useState(false);
  const [keywordsExpanded, setKeywordsExpanded] = React.useState(false);
  
  // Validate URLs
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  const validLogoUrl = isValidUrl(company.logo) ? company.logo : null;
  const validFaviconUrl = isValidUrl(company.favicon) ? company.favicon : null;

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors hover:border-gray-300 dark:hover:border-gray-600">
      <div className="flex">
        {/* Left side - Logo/Image Display */}
        <div className="relative w-80 h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          {validLogoUrl && !logoError ? (
            <div className="absolute inset-0 pr-4 py-4">
              <Image
                src={validLogoUrl}
                alt={`${company.name} logo`}
                fill
                className="object-contain"
                sizes="320px"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : validFaviconUrl && !faviconError ? (
            // Show favicon prominently when no logo is available
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-36 w-36 rounded-2xl bg-white shadow-xl border-2 border-gray-300 flex items-center justify-center p-6 transition-transform hover:scale-105">
                <Image
                  src={validFaviconUrl}
                  alt={`${company.name} logo`}
                  width={120}
                  height={120}
                  className="object-contain w-30 h-30"
                  onError={() => setFaviconError(true)}
                />
              </div>
            </div>
          ) : (
            // Fallback icon with better styling
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-36 w-36 rounded-2xl bg-white/90 shadow-lg border-2 border-gray-300 flex items-center justify-center p-6">
                <Building2 className="h-20 w-20 text-gray-400" />
              </div>
            </div>
          )}
          
          {/* Website link overlay on image */}
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-md group"
          >
            <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
          </a>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{company.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {company.industry && (
                  <Badge variant="secondary">
                    {company.industry}
                  </Badge>
                )}
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {new URL(company.url).hostname}
                </span>
              </div>
            </div>
            <button
              onClick={onAnalyze}
              disabled={analyzing}
              className="h-9 px-4 py-1 text-sm font-medium flex items-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:hover:bg-gray-400"
            >
              {analyzing ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                'Identify Competitors'
              )}
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {company.description}
          </p>

          {/* Keywords inline */}
          {company.scrapedData?.keywords && company.scrapedData.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(keywordsExpanded 
                ? company.scrapedData.keywords 
                : company.scrapedData.keywords.slice(0, 6)
              ).map((keyword, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {keyword}
                </span>
              ))}
              {company.scrapedData.keywords.length > 6 && (
                <button
                  onClick={() => setKeywordsExpanded(!keywordsExpanded)}
                  className="text-xs text-gray-500 hover:text-gray-700 hover:underline cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 rounded px-1"
                  type="button"
                  aria-label={keywordsExpanded ? 'Show fewer keywords' : 'Show more keywords'}
                >
                  {keywordsExpanded 
                    ? 'Show less' 
                    : `+${company.scrapedData.keywords.length - 6} more`
                  }
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Competitors Section */}
      {showCompetitors && identifiedCompetitors.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-8 py-6">
            <div className="mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Competitors</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">We'll compare {company.name} against these {identifiedCompetitors.length} competitors</p>
              </div>
            </div>
              
              <div className="grid grid-cols-3 gap-4">
                {identifiedCompetitors.map((competitor, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors opacity-0 animate-fade-up"
                    style={{ 
                      animationDelay: `${idx * 50}ms`,
                      animationFillMode: 'forwards',
                      animationDuration: '400ms'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Favicon */}
                      <div className="w-10 h-10 flex-shrink-0">
                        {competitor.url ? (
                          <img 
                            src={`https://www.google.com/s2/favicons?domain=${competitor.url}&sz=64`}
                            alt=""
                            className="w-10 h-10 rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const placeholder = document.createElement('div');
                              placeholder.className = 'w-10 h-10 bg-gray-100 rounded flex items-center justify-center';
                              placeholder.innerHTML = '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>';
                              e.currentTarget.parentElement!.appendChild(placeholder);
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Name and URL */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-900 text-sm">{competitor.name}</span>
                          {competitor.url && (
                            <a 
                              href={competitor.url.startsWith('http') ? competitor.url : `https://${competitor.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {competitor.url && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{competitor.url}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Remove button */}
                    {onRemoveCompetitor && (
                      <button
                        onClick={() => onRemoveCompetitor(idx)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {onAddCompetitor && (
                  <button
                    onClick={onAddCompetitor}
                    className="h-10 px-4 text-sm font-medium flex items-center gap-1 transition-colors bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add Competitor
                  </button>
                )}

                <div className="flex-1" />

                {onContinueToAnalysis && (
                  <button
                    onClick={onContinueToAnalysis}
                    className="h-10 px-6 text-sm font-medium flex items-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:hover:bg-gray-400"
                  >
                    Continue to Analysis
                  </button>
                )}
              </div>
            </div>
        </div>
      )}
    </Card>
  );
}