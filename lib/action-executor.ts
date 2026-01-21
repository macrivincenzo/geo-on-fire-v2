/**
 * Boost Action Executor
 * Executes Boost Actions using MCP tools and AI to automate improvements
 */

import { ActionItem } from './strategic-insights';
import { getDataForSEOMetrics, getBatchDataForSEOMetrics } from './dataforseo-utils';
import { CompetitorRanking, AIResponse } from './types';
import { generateContentForAction, GeneratedContent } from './content-generator';

export interface ActionExecutionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  creditsUsed?: number;
  generatedContent?: GeneratedContent[];
}

export interface ActionExecutionContext {
  action: ActionItem;
  brandName: string;
  brandData: CompetitorRanking;
  competitors: CompetitorRanking[];
  responses: AIResponse[];
  brandUrl?: string;
}

/**
 * Execute a Boost Action based on its category and type
 */
export async function executeBoostAction(
  context: ActionExecutionContext
): Promise<ActionExecutionResult> {
  const { action, brandName, brandData, competitors, responses, brandUrl } = context;

  try {
    // Ensure brandUrl is properly scoped
    const url = brandUrl;
    
    switch (action.category) {
      case 'visibility':
        return await executeVisibilityAction(action, brandName, brandData, competitors, url);
      
      case 'content':
        return await executeContentAction(action, brandName, brandData, competitors, responses, url);
      
      case 'competitive':
        return await executeCompetitiveAction(action, brandName, brandData, competitors, url);
      
      case 'sentiment':
        return await executeSentimentAction(action, brandName, brandData, responses, url);
      
      case 'technical':
        return await executeTechnicalAction(action, brandName, brandData, url);
      
      default:
        return {
          success: false,
          message: `Action category "${action.category}" not yet supported`,
          error: 'Unsupported action category'
        };
    }
  } catch (error) {
    console.error(`[Action Executor] Error executing action ${action.id}:`, error);
    console.error(`[Action Executor] Error details:`, {
      actionId: action.id,
      category: action.category,
      brandName,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined
    });
    return {
      success: false,
      message: `Failed to execute action: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Execute visibility improvement actions
 */
async function executeVisibilityAction(
  action: ActionItem,
  brandName: string,
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[],
  brandUrl?: string
): Promise<ActionExecutionResult> {
  // Extract keywords from action description
  const keywords = extractKeywordsFromAction(action, brandName);
  
  // Get SEO metrics for target keywords
  const seoResults = await getBatchDataForSEOMetrics(keywords);
  
  // Analyze competitor keywords
  const topCompetitors = competitors
    .filter(c => !c.isOwn)
    .sort((a, b) => b.visibilityScore - a.visibilityScore)
    .slice(0, 3);
  
  const competitorKeywords = extractCompetitorKeywords(topCompetitors, brandName);
  const competitorSeoResults = competitorKeywords.length > 0 
    ? await getBatchDataForSEOMetrics(competitorKeywords)
    : [];
  
  // Generate actionable insights
  const insights = generateVisibilityInsights(
    action,
    brandName,
    seoResults,
    competitorSeoResults,
    topCompetitors
  );
  
  const recommendations = generateVisibilityRecommendations(seoResults, competitorSeoResults, brandName);
  
  // Generate actual content
  const generatedContent = await generateContentForAction({
    action,
    brandName,
    brandData,
    competitors: topCompetitors,
    brandUrl,
    seoData: {
      keywords: seoResults
        .filter(r => r.metrics)
        .map(r => ({
          keyword: r.keyword,
          searchVolume: r.metrics!.searchVolume,
          difficulty: r.metrics!.keywordDifficulty
        })),
      competitorKeywords: competitorSeoResults
        .filter(r => r.metrics)
        .map(r => ({
          keyword: r.keyword,
          searchVolume: r.metrics!.searchVolume,
          difficulty: r.metrics!.keywordDifficulty
        }))
    },
    context: {
      insights,
      recommendations
    }
  });
  
  return {
    success: true,
    message: `Visibility analysis complete and content generated for ${brandName}`,
    data: {
      keywords: seoResults,
      competitorKeywords: competitorSeoResults,
      insights,
      recommendations
    },
    generatedContent,
    creditsUsed: seoResults.length + competitorSeoResults.length
  };
}

/**
 * Execute content strategy actions
 */
async function executeContentAction(
  action: ActionItem,
  brandName: string,
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[],
  responses: AIResponse[],
  brandUrl?: string
): Promise<ActionExecutionResult> {
  // Extract content topics from action
  const topics = extractContentTopics(action, brandName, responses);
  
  // Get SEO metrics for content topics
  const topicKeywords = topics.map(t => `${brandName} ${t}`).slice(0, 10);
  const seoResults = await getBatchDataForSEOMetrics(topicKeywords);
  
  // Find missed opportunities from responses
  const missedPrompts = responses.filter(r => !r.brandMentioned);
  const missedTopics = extractTopicsFromPrompts(missedPrompts.map(r => r.prompt));
  
  // Generate content recommendations
  const contentPlan = generateContentPlan(
    action,
    brandName,
    seoResults,
    missedTopics,
    competitors
  );
  
  // Generate actual content
  console.log(`[Action Executor] Generating content for action ${action.id}, category: ${action.category}`);
  const generatedContent = await generateContentForAction({
    action,
    brandName,
    brandData,
    competitors,
    brandUrl,
    seoData: {
      keywords: seoResults
        .filter(r => r.metrics)
        .map(r => ({
          keyword: r.keyword,
          searchVolume: r.metrics!.searchVolume,
          difficulty: r.metrics!.keywordDifficulty
        }))
    },
    context: {
      missedTopics
    }
  });
  
  console.log(`[Action Executor] Generated ${generatedContent.length} piece(s) of content for ${brandName}`);
  
  return {
    success: true,
    message: `Content strategy and finished content generated for ${brandName}`,
    data: {
      contentPlan,
      seoMetrics: seoResults,
      missedOpportunities: missedTopics,
      priorityContent: contentPlan.filter(c => c.priority === 'high')
    },
    generatedContent: generatedContent || [],
    creditsUsed: seoResults.length
  };
}

/**
 * Execute competitive analysis actions
 */
async function executeCompetitiveAction(
  action: ActionItem,
  brandName: string,
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[],
  brandUrl?: string
): Promise<ActionExecutionResult> {
  // Identify target competitors from action
  const targetCompetitors = extractCompetitorNames(action, competitors);
  
  // Get competitive keywords
  const competitiveKeywords = targetCompetitors.flatMap(comp => [
    `${brandName} vs ${comp.name}`,
    `${comp.name} alternative`,
    `best ${comp.name} alternative`
  ]);
  
  const seoResults = await getBatchDataForSEOMetrics(competitiveKeywords);
  
  // Generate competitive analysis
  const competitiveAnalysis = generateCompetitiveAnalysis(
    action,
    brandName,
    brandData,
    targetCompetitors,
    seoResults
  );
  
  const gaps = calculateCompetitiveGaps(brandData, targetCompetitors);
  const opportunities = identifyCompetitiveOpportunities(brandData, targetCompetitors, seoResults);
  
  // Generate comparison content
  const generatedContent = await generateContentForAction({
    action,
    brandName,
    brandData,
    competitors: targetCompetitors,
    brandUrl,
    seoData: {
      keywords: seoResults
        .filter(r => r.metrics)
        .map(r => ({
          keyword: r.keyword,
          searchVolume: r.metrics!.searchVolume,
          difficulty: r.metrics!.keywordDifficulty
        }))
    },
    context: {
      insights: opportunities
    }
  });
  
  return {
    success: true,
    message: `Competitive analysis complete and comparison content generated for ${brandName}`,
    data: {
      competitiveAnalysis,
      keywords: seoResults,
      gaps,
      opportunities
    },
    generatedContent,
    creditsUsed: seoResults.length
  };
}

/**
 * Execute sentiment improvement actions
 */
async function executeSentimentAction(
  action: ActionItem,
  brandName: string,
  brandData: CompetitorRanking,
  responses: AIResponse[],
  brandUrl?: string
): Promise<ActionExecutionResult> {
  // Analyze sentiment patterns
  const negativeResponses = responses.filter(r => 
    r.brandMentioned && r.sentiment === 'negative'
  );
  
  const positiveResponses = responses.filter(r => 
    r.brandMentioned && r.sentiment === 'positive'
  );
  
  // Extract topics from negative mentions
  const negativeTopics = extractTopicsFromResponses(negativeResponses);
  
  // Generate sentiment improvement plan
  const improvementPlan = generateSentimentImprovementPlan(
    action,
    brandName,
    negativeTopics,
    positiveResponses,
    brandData.sentimentScore
  );
  
  // Generate content to improve sentiment
  const generatedContent = await generateContentForAction({
    action,
    brandName,
    brandData,
    competitors: [],
    brandUrl,
    context: {
      insights: negativeTopics,
      recommendations: improvementPlan.map(p => p.action)
    }
  });
  
  return {
    success: true,
    message: `Sentiment improvement plan and content generated for ${brandName}`,
    data: {
      improvementPlan,
      currentSentiment: brandData.sentimentScore,
      targetSentiment: Math.min(100, brandData.sentimentScore + 15),
      negativeTopics,
      positiveExamples: positiveResponses.slice(0, 5).map(r => ({
        provider: r.provider,
        quote: extractBrandQuote(r.response, brandName),
        sentiment: r.sentiment
      }))
    },
    generatedContent,
    creditsUsed: 0 // No external API calls needed
  };
}

/**
 * Execute technical SEO actions
 */
async function executeTechnicalAction(
  action: ActionItem,
  brandName: string,
  brandData: CompetitorRanking,
  brandUrl?: string
): Promise<ActionExecutionResult> {
  // Generate technical SEO checklist
  const technicalChecklist = generateTechnicalChecklist(action, brandName, brandUrl);
  
  // Generate technical implementation guide
  const generatedContent = await generateContentForAction({
    action,
    brandName,
    brandData,
    competitors: [],
    brandUrl
  });
  
  return {
    success: true,
    message: `Technical SEO checklist and implementation guide generated for ${brandName}`,
    data: {
      checklist: technicalChecklist,
      priority: technicalChecklist.filter(item => item.priority === 'high'),
      estimatedImpact: '25-30% improvement in AI comprehension'
    },
    generatedContent,
    creditsUsed: 0
  };
}

// ============================================
// Helper Functions
// ============================================

function extractKeywordsFromAction(action: ActionItem, brandName: string): string[] {
  const keywords: string[] = [];
  
  // Extract from title
  const titleWords = action.title.toLowerCase().split(/\s+/);
  const relevantWords = titleWords.filter(w => 
    w.length > 4 && 
    !['from', 'to', 'increase', 'improve', 'boost', 'visibility', 'score'].includes(w)
  );
  
  if (relevantWords.length > 0) {
    keywords.push(`${brandName} ${relevantWords[0]}`);
  }
  
  // Extract from description
  const descMatch = action.description.match(/(\d+)%/);
  if (descMatch) {
    keywords.push(`${brandName} visibility`);
  }
  
  // Add brand-specific keywords
  keywords.push(brandName);
  keywords.push(`best ${brandName}`);
  keywords.push(`${brandName} review`);
  
  return keywords.slice(0, 5);
}

function extractCompetitorKeywords(
  competitors: CompetitorRanking[],
  brandName: string
): string[] {
  return competitors.flatMap(comp => [
    `${comp.name} vs ${brandName}`,
    `best ${comp.name}`,
    `${comp.name} alternative`
  ]).slice(0, 10);
}

function extractContentTopics(
  action: ActionItem,
  brandName: string,
  responses: AIResponse[]
): string[] {
  const topics: string[] = [];
  
  // Extract from action description
  if (action.description.includes('comparison')) {
    topics.push('comparison');
  }
  if (action.description.includes('FAQ')) {
    topics.push('FAQ');
  }
  if (action.description.includes('guide')) {
    topics.push('guide');
  }
  
  // Extract from missed prompts
  const missedPrompts = responses.filter(r => !r.brandMentioned);
  const promptTopics = extractTopicsFromPrompts(missedPrompts.map(r => r.prompt));
  topics.push(...promptTopics);
  
  return [...new Set(topics)].slice(0, 10);
}

function extractCompetitorNames(
  action: ActionItem,
  competitors: CompetitorRanking[]
): CompetitorRanking[] {
  const names: CompetitorRanking[] = [];
  
  // Extract competitor names from action description
  competitors.forEach(comp => {
    if (action.description.includes(comp.name) || action.title.includes(comp.name)) {
      names.push(comp);
    }
  });
  
  // If no specific competitors mentioned, use top 3
  if (names.length === 0) {
    return competitors
      .filter(c => !c.isOwn)
      .sort((a, b) => b.visibilityScore - a.visibilityScore)
      .slice(0, 3);
  }
  
  return names;
}

function extractTopicsFromPrompts(prompts: string[]): string[] {
  const topics: string[] = [];
  
  prompts.forEach(prompt => {
    const words = prompt.toLowerCase()
      .replace(/[?!.,]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4 && !['best', 'what', 'which', 'when', 'where', 'there', 'their', 'about', 'should'].includes(w));
    
    if (words.length > 0) {
      topics.push(words.slice(0, 2).join(' '));
    }
  });
  
  return [...new Set(topics)].slice(0, 10);
}

function extractTopicsFromResponses(responses: AIResponse[]): string[] {
  return extractTopicsFromPrompts(responses.map(r => r.prompt));
}

function extractBrandQuote(response: string, brandName: string): string {
  const sentences = response.split(/[.!?]+/).filter(s => 
    s.toLowerCase().includes(brandName.toLowerCase())
  );
  return sentences[0]?.trim() || '';
}

function generateVisibilityInsights(
  action: ActionItem,
  brandName: string,
  seoResults: any[],
  competitorSeoResults: any[],
  competitors: CompetitorRanking[]
): string[] {
  const insights: string[] = [];
  
  // Find high-opportunity keywords
  const highOpportunity = seoResults.filter(r => 
    r.metrics && 
    r.metrics.searchVolume > 1000 && 
    r.metrics.keywordDifficulty < 50
  );
  
  if (highOpportunity.length > 0) {
    insights.push(`Found ${highOpportunity.length} high-opportunity keywords with good search volume (${highOpportunity.reduce((sum, r) => sum + (r.metrics?.searchVolume || 0), 0).toLocaleString()} total monthly searches) and low competition`);
  }
  
  // Find trending keywords
  const trendingKeywords = seoResults.filter(r => 
    r.metrics?.trends?.isTrending
  );
  
  if (trendingKeywords.length > 0) {
    insights.push(`${trendingKeywords.length} keywords are currently trending - prioritize these for maximum impact`);
  }
  
  // Compare with competitors
  if (competitorSeoResults.length > 0) {
    const competitorAvgVolume = competitorSeoResults
      .filter(r => r.metrics)
      .reduce((sum, r) => sum + (r.metrics.searchVolume || 0), 0) / competitorSeoResults.length;
    
    const brandAvgVolume = seoResults
      .filter(r => r.metrics)
      .reduce((sum, r) => sum + (r.metrics.searchVolume || 0), 0) / seoResults.length;
    
    if (competitorAvgVolume > brandAvgVolume * 1.5) {
      insights.push(`Competitors are targeting keywords with ${Math.round(competitorAvgVolume / brandAvgVolume)}x higher search volume - consider expanding your keyword strategy`);
    } else if (brandAvgVolume > competitorAvgVolume * 1.2) {
      insights.push(`You're targeting keywords with higher search volume than competitors - maintain this advantage`);
    }
  }
  
  // Keyword difficulty analysis
  const easyKeywords = seoResults.filter(r => 
    r.metrics && r.metrics.keywordDifficulty < 40
  );
  
  if (easyKeywords.length > 0) {
    insights.push(`${easyKeywords.length} low-difficulty keywords identified - quick wins for improving visibility`);
  }
  
  return insights;
}

function generateVisibilityRecommendations(
  seoResults: any[],
  competitorSeoResults: any[],
  brandName: string
): string[] {
  const recommendations: string[] = [];
  
  // Prioritize keywords by ROI (search volume / difficulty)
  const priorityKeywords = seoResults
    .filter(r => r.metrics && r.metrics.searchVolume > 500)
    .sort((a, b) => {
      const aROI = a.metrics.searchVolume / (a.metrics.keywordDifficulty + 1);
      const bROI = b.metrics.searchVolume / (b.metrics.keywordDifficulty + 1);
      return bROI - aROI;
    })
    .slice(0, 5);
  
  if (priorityKeywords.length > 0) {
    const keywordList = priorityKeywords.map(r => {
      const volume = r.metrics.searchVolume.toLocaleString();
      const difficulty = r.metrics.keywordDifficulty;
      return `${r.keyword} (${volume} searches/mo, ${difficulty}% difficulty)`;
    }).join('; ');
    recommendations.push(`Focus on these high-ROI keywords: ${keywordList}`);
  }
  
  // Quick wins
  const quickWins = seoResults
    .filter(r => r.metrics && r.metrics.searchVolume > 100 && r.metrics.keywordDifficulty < 30)
    .slice(0, 3);
  
  if (quickWins.length > 0) {
    recommendations.push(`Quick wins: Target ${quickWins.map(r => r.keyword).join(', ')} for fast visibility gains`);
  }
  
  // Trending opportunities
  const trending = seoResults.filter(r => r.metrics?.trends?.isTrending);
  if (trending.length > 0) {
    recommendations.push(`Capitalize on trends: ${trending.map(r => r.keyword).join(', ')} are currently trending`);
  }
  
  return recommendations;
}

function generateContentPlan(
  action: ActionItem,
  brandName: string,
  seoResults: any[],
  missedTopics: string[],
  competitors: CompetitorRanking[]
): Array<{ type: string; title: string; priority: 'high' | 'medium' | 'low'; keywords: string[] }> {
  const plan: Array<{ type: string; title: string; priority: 'high' | 'medium' | 'low'; keywords: string[] }> = [];
  
  // Comparison pages
  const topCompetitor = competitors.filter(c => !c.isOwn)[0];
  if (topCompetitor) {
    plan.push({
      type: 'comparison',
      title: `${brandName} vs ${topCompetitor.name}: Complete Comparison`,
      priority: 'high',
      keywords: [`${brandName} vs ${topCompetitor.name}`, `${topCompetitor.name} alternative`]
    });
  }
  
  // Topic-based content
  missedTopics.slice(0, 5).forEach(topic => {
    plan.push({
      type: 'blog',
      title: `${brandName} ${topic.charAt(0).toUpperCase() + topic.slice(1)} Guide`,
      priority: 'medium',
      keywords: [`${brandName} ${topic}`, `best ${topic}`]
    });
  });
  
  return plan;
}

function generateCompetitiveAnalysis(
  action: ActionItem,
  brandName: string,
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[],
  seoResults: any[]
): any {
  return {
    gaps: calculateCompetitiveGaps(brandData, competitors),
    opportunities: identifyCompetitiveOpportunities(brandData, competitors, seoResults),
    recommendations: generateCompetitiveRecommendations(brandName, competitors, seoResults)
  };
}

function calculateCompetitiveGaps(
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[]
): Array<{ competitor: string; gap: number; metric: string }> {
  return competitors.map(comp => ({
    competitor: comp.name,
    gap: comp.visibilityScore - brandData.visibilityScore,
    metric: 'visibility'
  }));
}

function identifyCompetitiveOpportunities(
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[],
  seoResults: any[]
): string[] {
  const opportunities: string[] = [];
  
  // Find keywords competitors rank for but brand doesn't
  const competitorKeywords = seoResults
    .filter(r => r.keyword.includes('vs') || r.keyword.includes('alternative'))
    .map(r => r.keyword);
  
  if (competitorKeywords.length > 0) {
    opportunities.push(`Target ${competitorKeywords.length} competitive keywords where competitors have presence`);
  }
  
  return opportunities;
}

function generateCompetitiveRecommendations(
  brandName: string,
  competitors: CompetitorRanking[],
  seoResults: any[]
): string[] {
  const recommendations: string[] = [];
  
  const topCompetitor = competitors[0];
  if (topCompetitor) {
    recommendations.push(`Create comparison content: "${brandName} vs ${topCompetitor.name}" to compete directly`);
  }
  
  return recommendations;
}

function generateSentimentImprovementPlan(
  action: ActionItem,
  brandName: string,
  negativeTopics: string[],
  positiveResponses: AIResponse[],
  currentScore: number
): Array<{ action: string; priority: 'high' | 'medium' | 'low'; impact: string }> {
  const plan: Array<{ action: string; priority: 'high' | 'medium' | 'low'; impact: string }> = [];
  
  // Address negative topics
  negativeTopics.slice(0, 3).forEach(topic => {
    plan.push({
      action: `Create content addressing "${topic}" concerns`,
      priority: 'high',
      impact: 'Improve sentiment on negative topics'
    });
  });
  
  // Amplify positive aspects
  if (positiveResponses.length > 0) {
    plan.push({
      action: 'Highlight positive aspects mentioned by AI',
      priority: 'medium',
      impact: 'Reinforce positive brand perception'
    });
  }
  
  return plan;
}

function generateTechnicalChecklist(
  action: ActionItem,
  brandName: string,
  brandUrl?: string
): Array<{ item: string; priority: 'high' | 'medium' | 'low'; status: 'pending' | 'completed' }> {
  return [
    {
      item: 'Implement structured data (Schema.org) markup',
      priority: 'high',
      status: 'pending'
    },
    {
      item: 'Optimize meta descriptions for AI readability',
      priority: 'high',
      status: 'pending'
    },
    {
      item: 'Ensure semantic HTML structure',
      priority: 'medium',
      status: 'pending'
    },
    {
      item: 'Add comprehensive FAQ schema',
      priority: 'medium',
      status: 'pending'
    },
    {
      item: 'Optimize content hierarchy and headings',
      priority: 'medium',
      status: 'pending'
    }
  ];
}
