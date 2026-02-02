'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Lightbulb,
  Target,
  Zap,
  FileText,
  Quote,
  Shield,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Trophy,
  BarChart3,
  MessageSquareQuote
} from 'lucide-react';
import { AIResponse, CompetitorRanking } from '@/lib/types';
import { 
  generateStrategicInsights, 
  StrategicInsights,
  ActionItem,
  CompetitiveGap,
  BrandQuote,
  ContentSuggestion,
  ProviderInsight
} from '@/lib/strategic-insights';
import { 
  calculateAIBrandStrength, 
  calculateAIBrandStrengthForAll,
  AIBrandStrength 
} from '@/lib/ai-brand-strength';

interface StrategicInsightsTabProps {
  brandData: CompetitorRanking;
  competitors: CompetitorRanking[];
  responses: AIResponse[];
  brandName: string;
}

// ============================================
// AI Brand Strength Card (0-100 score)
// ============================================
function AIBrandStrengthCard({ 
  brandStrength, 
  competitors, 
  brandName 
}: { 
  brandStrength: AIBrandStrength;
  competitors: CompetitorRanking[];
  brandName: string;
}) {
  // Calculate strength for top competitors (for comparison bars)
  const competitorStrengths = useMemo(() => {
    const strengths = calculateAIBrandStrengthForAll(competitors.filter(c => !c.isOwn));
    return Array.from(strengths.entries())
      .map(([name, strength]) => ({ name, strength }))
      .sort((a, b) => b.strength.score - a.strength.score)
      .slice(0, 3); // Top 3 competitors
  }, [competitors]);

  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    if (score >= 30) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 70) return 'bg-green-100 border-green-300';
    if (score >= 50) return 'bg-blue-100 border-blue-300';
    if (score >= 30) return 'bg-amber-100 border-amber-300';
    return 'bg-red-100 border-red-300';
  };

  return (
    <Card className={`${getScoreBgColor(brandStrength.score)} rounded-none border-2 shadow-sm`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              AI Brand Strength
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              Composite score based on visibility, sentiment, share of voice, and ranking
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Score Display */}
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold ${getScoreColor(brandStrength.score)} mb-2`}>
            {brandStrength.score}
          </div>
          <div className="text-2xl font-semibold text-gray-500">/ 100</div>
          <p className="text-sm text-gray-600 mt-2">
            {brandName}'s overall AI brand strength
          </p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/60 rounded-none border border-gray-200/50 p-3">
            <div className="text-xs text-gray-600 mb-1">Visibility</div>
            <div className="text-lg font-semibold text-gray-900">{brandStrength.breakdown.visibility}%</div>
          </div>
          <div className="bg-white/60 rounded-none border border-gray-200/50 p-3">
            <div className="text-xs text-gray-600 mb-1">Sentiment</div>
            <div className="text-lg font-semibold text-gray-900">{brandStrength.breakdown.sentiment}%</div>
          </div>
          <div className="bg-white/60 rounded-none border border-gray-200/50 p-3">
            <div className="text-xs text-gray-600 mb-1">Share of Voice</div>
            <div className="text-lg font-semibold text-gray-900">{brandStrength.breakdown.shareOfVoice}%</div>
          </div>
          <div className="bg-white/60 rounded-none border border-gray-200/50 p-3">
            <div className="text-xs text-gray-600 mb-1">Ranking</div>
            <div className="text-lg font-semibold text-gray-900">{brandStrength.breakdown.ranking}%</div>
          </div>
        </div>

        {/* Competitor Comparison Bars */}
        {competitorStrengths.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-sm font-semibold text-gray-700 mb-3">Top Competitors</p>
            <div className="space-y-3">
              {competitorStrengths.map(({ name, strength }) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-gray-600 truncate">{name}</div>
                  <div className="flex-1 bg-gray-200 rounded-none h-4 relative overflow-hidden">
                    <div
                      className={`h-full rounded-none transition-all ${
                        strength.score >= 70 ? 'bg-green-500' :
                        strength.score >= 50 ? 'bg-blue-600' :
                        strength.score >= 30 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-semibold text-gray-700">
                    {strength.score}
                  </div>
                </div>
              ))}
              {/* Your brand bar */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-300">
                <div className="w-24 text-xs font-semibold text-gray-900 truncate">{brandName}</div>
                <div className="flex-1 bg-gray-200 rounded-none h-5 relative overflow-hidden">
                  <div
                    className={`h-full rounded-none transition-all ${
                      brandStrength.score >= 70 ? 'bg-green-600' :
                      brandStrength.score >= 50 ? 'bg-blue-600' :
                      brandStrength.score >= 30 ? 'bg-amber-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${brandStrength.score}%` }}
                  />
                </div>
                <div className={`w-12 text-right text-sm font-bold ${getScoreColor(brandStrength.score)}`}>
                  {brandStrength.score}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Health Score Indicator
// ============================================
function HealthScoreCard({ insights }: { insights: StrategicInsights }) {
  const getStrokeColor = (health: string): string => {
    const colorMap: Record<string, string> = {
      excellent: '#10b981', // green-500
      good: '#2563eb',       // blue-600
      'needs-work': '#f59e0b', // amber-500
      critical: '#ef4444'    // red-500
    };
    return colorMap[health] || '#6b7280';
  };
  
  const healthIcons = {
    excellent: <Trophy className="w-6 h-6 text-green-600" />,
    good: <CheckCircle className="w-6 h-6 text-blue-600" />,
    'needs-work': <AlertCircle className="w-6 h-6 text-amber-600" />,
    critical: <AlertTriangle className="w-6 h-6 text-red-600" />
  };
  
  const healthLabels = {
    excellent: 'Excellent',
    good: 'Good',
    'needs-work': 'Needs Work',
    critical: 'Critical'
  };
  
  return (
    <Card className="rounded-none border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {healthIcons[insights.overallHealth]}
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">AI Visibility Health</p>
                <p className="text-3xl font-bold text-gray-900">
                  {healthLabels[insights.overallHealth]}
                </p>
              </div>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              {insights.summary}
            </p>
          </div>
          <div className="ml-6 flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke={getStrokeColor(insights.overallHealth)}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36 * (insights.healthScore / 100)} ${2 * Math.PI * 36}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{insights.healthScore}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Health Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Action Items Section
// ============================================
function ActionItemsCard({ actions, title, icon }: { 
  actions: ActionItem[]; 
  title: string;
  icon: React.ReactNode;
}) {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  };
  
  const effortBadges = {
    easy: <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">Quick Win</Badge>,
    medium: <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">Medium Effort</Badge>,
    hard: <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">Strategic</Badge>
  };
  
  if (actions.length === 0) return null;
  
  return (
    <Card className="rounded-none border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-xl font-bold text-gray-900">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <div 
            key={action.id} 
            className={`p-4 rounded-none border-2 border-gray-200 ${priorityColors[action.priority]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-gray-900">{action.title}</h4>
                  {effortBadges[action.effort]}
                </div>
                <p className="text-sm opacity-90 mb-2 text-gray-800">{action.description}</p>
                <p className="text-xs font-medium flex items-center gap-1 text-gray-700">
                  <Sparkles className="w-3 h-3" />
                  Impact: {action.impact}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 opacity-50 flex-shrink-0" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================
// Competitive Gap Analysis
// ============================================
function CompetitiveGapsCard({ gaps }: { gaps: CompetitiveGap[] }) {
  if (gaps.length === 0) return null;
  
  return (
    <Card className="rounded-none border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-white border-b">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <CardTitle className="text-xl font-bold text-gray-900">Competitive Gap Analysis</CardTitle>
        </div>
        <CardDescription className="text-sm text-gray-600 mt-1.5">How you compare to each competitor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {gaps.slice(0, 5).map((gap, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-gray-900">{gap.competitor}</span>
              <div className="flex items-center gap-2">
                {gap.gapType === 'winning' ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{gap.gap.toFixed(1)}%
                  </Badge>
                ) : gap.gapType === 'losing' ? (
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {gap.gap.toFixed(1)}%
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                    Tied
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Visual bar comparison */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">You</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-none transition-all"
                  style={{ width: `${Math.min(100, gap.yourScore)}%` }}
                />
              </div>
              <span className="text-xs font-medium w-10 text-gray-900">{gap.yourScore.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">Them</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-none transition-all"
                  style={{ width: `${Math.min(100, gap.competitorScore)}%` }}
                />
              </div>
              <span className="text-xs font-medium w-10 text-gray-900">{gap.competitorScore.toFixed(0)}%</span>
            </div>
            
            <p className="text-xs text-gray-600 mt-1">{gap.insight}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================
// Brand Quotes Section
// ============================================
function BrandQuotesCard({ quotes, brandName }: { quotes: BrandQuote[]; brandName: string }) {
  if (quotes.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-xl font-bold text-gray-900">What AI Says About You</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 bg-gray-50 rounded-none border-2 border-dashed border-gray-300">
            <Quote className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-base font-semibold text-gray-700 mb-1">No direct quotes found mentioning {brandName}</p>
            <p className="text-sm text-gray-600">This is an opportunity to create more content!</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const sentimentColors = {
    positive: 'border-l-green-500 bg-green-50',
    neutral: 'border-l-gray-400 bg-gray-50',
    negative: 'border-l-red-500 bg-red-50'
  };
  
  const sentimentIcons = {
    positive: <CheckCircle className="w-4 h-4 text-green-600" />,
    neutral: <AlertCircle className="w-4 h-4 text-gray-500" />,
    negative: <AlertTriangle className="w-4 h-4 text-red-600" />
  };
  
  return (
    <Card className="rounded-none border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 bg-gradient-to-r from-teal-50 to-white border-b">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="w-5 h-5 text-teal-600" />
          <CardTitle className="text-xl font-bold text-gray-900">What AI Says About You</CardTitle>
        </div>
        <CardDescription className="text-sm text-gray-600 mt-1.5">Direct quotes from AI responses mentioning your brand</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quotes.slice(0, 5).map((quote, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-none border-l-4 ${sentimentColors[quote.sentiment]}`}
          >
            <div className="flex items-start gap-2">
              {sentimentIcons[quote.sentiment]}
              <div className="flex-1">
                <p className="text-sm italic text-gray-900">"{quote.quote}"</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{quote.provider}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{quote.context}</Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================
// Content Suggestions Section
// ============================================
function ContentSuggestionsCard({ suggestions }: { suggestions: ContentSuggestion[] }) {
  const typeIcons = {
    blog: <FileText className="w-4 h-4" />,
    comparison: <BarChart3 className="w-4 h-4" />,
    testimonial: <Quote className="w-4 h-4" />,
    'landing-page': <Target className="w-4 h-4" />,
    social: <MessageSquareQuote className="w-4 h-4" />,
    pr: <Sparkles className="w-4 h-4" />
  };
  
  const typeColors = {
    blog: 'bg-blue-100 text-blue-700',
    comparison: 'bg-purple-100 text-purple-700',
    testimonial: 'bg-green-100 text-green-700',
    'landing-page': 'bg-orange-100 text-orange-700',
    social: 'bg-pink-100 text-pink-700',
    pr: 'bg-yellow-100 text-yellow-700'
  };
  
  return (
    <Card className="rounded-none border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 bg-gradient-to-r from-yellow-50 to-white border-b">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <CardTitle className="text-xl font-bold text-gray-900">Content Strategy</CardTitle>
        </div>
        <CardDescription className="text-sm text-gray-600 mt-1.5">Recommended content to boost AI visibility</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.slice(0, 5).map((suggestion, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-none border-2 border-gray-200">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-none border border-gray-200 ${typeColors[suggestion.type]}`}>
                {typeIcons[suggestion.type]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  {suggestion.priority === 'high' && (
                    <Badge className="bg-red-100 text-red-700 text-xs">High Priority</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                <div className="flex flex-wrap gap-1">
                  {suggestion.targetKeywords.map((keyword, kidx) => (
                    <Badge key={kidx} variant="outline" className="text-xs bg-white">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================
// Provider Insights Section
// ============================================
function ProviderInsightsCard({ insights, brandName }: { insights: ProviderInsight[]; brandName: string }) {
  return (
    <Card className="rounded-none border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-white border-b">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <CardTitle className="text-xl font-bold text-gray-900">AI Provider Analysis</CardTitle>
        </div>
        <CardDescription className="text-sm text-gray-600 mt-1.5">How each AI provider sees {brandName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-none border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">{insight.provider}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Mention Rate:</span>
                <Badge 
                  className={
                    insight.mentionRate >= 75 ? 'bg-green-100 text-green-700' :
                    insight.mentionRate >= 50 ? 'bg-blue-100 text-blue-700' :
                    insight.mentionRate > 0 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }
                >
                  {insight.mentionRate.toFixed(0)}%
                </Badge>
              </div>
            </div>
            
            {insight.strength && (
              <p className="text-xs text-green-700 flex items-center gap-1 mb-1">
                <CheckCircle className="w-3 h-3" />
                {insight.strength}
              </p>
            )}
            {insight.weakness && (
              <p className="text-xs text-red-700 flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3 h-3" />
                {insight.weakness}
              </p>
            )}
            {insight.opportunity && (
              <p className="text-xs text-blue-700 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                {insight.opportunity}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ============================================
// Main Component
// ============================================
export function StrategicInsightsTab({
  brandData,
  competitors,
  responses,
  brandName
}: StrategicInsightsTabProps) {
  const insights = useMemo(() => 
    generateStrategicInsights(brandData, competitors, responses, brandName),
    [brandData, competitors, responses, brandName]
  );

  // Calculate AI Brand Strength
  const brandStrength = useMemo(() => 
    calculateAIBrandStrength(brandData),
    [brandData]
  );
  
  return (
    <div className="space-y-6">
      {/* AI Brand Strength Score (0-100) - Prominent Display */}
      <AIBrandStrengthCard 
        brandStrength={brandStrength}
        competitors={competitors}
        brandName={brandName}
      />
      
      {/* Health Score Overview */}
      <HealthScoreCard insights={insights} />
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 shadow-sm hover:shadow-md transition-all hover:scale-105 border-l-4 border-l-orange-500">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{brandData.visibilityScore}%</p>
            <p className="text-xs uppercase tracking-wider text-gray-500 mt-2 font-semibold">Visibility Score</p>
          </div>
        </Card>
        <Card className="rounded-none border-2 border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-600">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              #{(() => {
                const rankIndex = competitors.findIndex(c => c.isOwn);
                return rankIndex >= 0 ? rankIndex + 1 : '?';
              })()}
            </p>
            <p className="text-xs uppercase tracking-wider text-gray-500 mt-2 font-semibold">Market Rank</p>
          </div>
        </Card>
        <Card className="rounded-none border-2 border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-purple-500">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{insights.actionItems.length}</p>
            <p className="text-xs uppercase tracking-wider text-gray-500 mt-2 font-semibold">Action Items</p>
          </div>
        </Card>
        <Card className="rounded-none border-2 border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-green-500">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{brandData.mentions}</p>
            <p className="text-xs uppercase tracking-wider text-gray-500 mt-2 font-semibold">Brand Mentions</p>
            <p className="text-xs text-gray-400 mt-1" title="Total number of AI responses (across all providers) where your brand was mentioned">
              {responses.length} total responses
            </p>
          </div>
        </Card>
      </div>
      
      {/* Priority Actions */}
      {insights.strategicPriorities.length > 0 && (
        <ActionItemsCard 
          actions={insights.strategicPriorities}
          title="🚨 Priority Actions"
          icon={<Zap className="w-5 h-5 text-red-600" />}
        />
      )}
      
      {/* Quick Wins */}
      {insights.quickWins.length > 0 && (
        <ActionItemsCard 
          actions={insights.quickWins}
          title="⚡ Quick Wins"
          icon={<Target className="w-5 h-5 text-green-600" />}
        />
      )}
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitive Gaps */}
        <CompetitiveGapsCard gaps={insights.competitiveGaps} />
        
        {/* Brand Quotes */}
        <BrandQuotesCard quotes={insights.brandQuotes} brandName={brandName} />
      </div>
      
      {/* Content Strategy */}
      <ContentSuggestionsCard suggestions={insights.contentSuggestions} />
      
      {/* Provider Insights */}
      <ProviderInsightsCard insights={insights.providerInsights} brandName={brandName} />
    </div>
  );
}


