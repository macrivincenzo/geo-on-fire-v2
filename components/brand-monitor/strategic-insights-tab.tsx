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

interface StrategicInsightsTabProps {
  brandData: CompetitorRanking;
  competitors: CompetitorRanking[];
  responses: AIResponse[];
  brandName: string;
}

// ============================================
// Health Score Indicator
// ============================================
function HealthScoreCard({ insights }: { insights: StrategicInsights }) {
  const healthColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    'needs-work': 'bg-amber-500',
    critical: 'bg-red-500'
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
    <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {healthIcons[insights.overallHealth]}
              <div>
                <p className="text-sm text-gray-500 font-medium">AI Visibility Health</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthLabels[insights.overallHealth]}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
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
                  stroke={healthColors[insights.overallHealth].replace('bg-', '#').replace('-500', '')}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36 * (insights.healthScore / 100)} ${2 * Math.PI * 36}`}
                  className={healthColors[insights.overallHealth].replace('bg-', 'stroke-')}
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <div 
            key={action.id} 
            className={`p-4 rounded-lg border ${priorityColors[action.priority]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{action.title}</h4>
                  {effortBadges[action.effort]}
                </div>
                <p className="text-sm opacity-90 mb-2">{action.description}</p>
                <p className="text-xs font-medium flex items-center gap-1">
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <CardTitle className="text-lg">Competitive Gap Analysis</CardTitle>
        </div>
        <CardDescription>How you compare to each competitor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {gaps.slice(0, 5).map((gap, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{gap.competitor}</span>
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
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, gap.yourScore)}%` }}
                />
              </div>
              <span className="text-xs font-medium w-10">{gap.yourScore.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">Them</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, gap.competitorScore)}%` }}
                />
              </div>
              <span className="text-xs font-medium w-10">{gap.competitorScore.toFixed(0)}%</span>
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
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-lg">What AI Says About You</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Quote className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No direct quotes found mentioning {brandName}.</p>
            <p className="text-xs mt-1">This is an opportunity to create more content!</p>
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="w-5 h-5 text-teal-600" />
          <CardTitle className="text-lg">What AI Says About You</CardTitle>
        </div>
        <CardDescription>Direct quotes from AI responses mentioning your brand</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quotes.slice(0, 5).map((quote, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-r-lg border-l-4 ${sentimentColors[quote.sentiment]}`}
          >
            <div className="flex items-start gap-2">
              {sentimentIcons[quote.sentiment]}
              <div className="flex-1">
                <p className="text-sm italic">"{quote.quote}"</p>
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <CardTitle className="text-lg">Content Strategy</CardTitle>
        </div>
        <CardDescription>Recommended content to boost AI visibility</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.slice(0, 5).map((suggestion, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${typeColors[suggestion.type]}`}>
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <CardTitle className="text-lg">AI Provider Analysis</CardTitle>
        </div>
        <CardDescription>How each AI provider sees {brandName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
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
  
  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <HealthScoreCard insights={insights} />
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{brandData.visibilityScore}%</p>
            <p className="text-xs text-gray-500">Visibility Score</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">#{competitors.findIndex(c => c.isOwn) + 1}</p>
            <p className="text-xs text-gray-500">Market Rank</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{insights.actionItems.length}</p>
            <p className="text-xs text-gray-500">Action Items</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{insights.brandQuotes.length}</p>
            <p className="text-xs text-gray-500">Brand Mentions</p>
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

