/**
 * Strategic Insights Generator
 * Analyzes brand monitoring data and generates actionable business intelligence
 */

import { AIResponse, CompetitorRanking } from './types';
import { stripMarkdown } from './brand-detection-utils';

// ============================================
// Types
// ============================================

export interface BrandQuote {
  quote: string;
  provider: string;
  prompt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  context: 'recommendation' | 'comparison' | 'feature' | 'pricing' | 'warning' | 'general';
}

export interface CompetitiveGap {
  competitor: string;
  competitorScore: number;
  yourScore: number;
  gap: number;
  gapType: 'winning' | 'losing' | 'tied';
  insight: string;
  actionItem: string;
}

export interface ActionItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'content' | 'visibility' | 'sentiment' | 'competitive' | 'technical';
  title: string;
  description: string;
  impact: string;
  effort: 'easy' | 'medium' | 'hard';
}

export interface ContentSuggestion {
  type: 'blog' | 'comparison' | 'testimonial' | 'landing-page' | 'social' | 'pr';
  title: string;
  description: string;
  targetKeywords: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface ProviderInsight {
  provider: string;
  mentionRate: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  averagePosition: number;
  strength: string;
  weakness: string;
  opportunity: string;
}

export interface StrategicInsights {
  // Summary
  overallHealth: 'excellent' | 'good' | 'needs-work' | 'critical';
  healthScore: number;
  summary: string;
  
  // Extracted Quotes
  brandQuotes: BrandQuote[];
  competitorQuotes: Map<string, BrandQuote[]>;
  
  // Competitive Analysis
  competitiveGaps: CompetitiveGap[];
  biggestThreat: string | null;
  biggestOpportunity: string | null;
  
  // Action Items (Prioritized)
  actionItems: ActionItem[];
  quickWins: ActionItem[];
  strategicPriorities: ActionItem[];
  
  // Content Strategy
  contentSuggestions: ContentSuggestion[];
  missingTopics: string[];
  
  // Provider-Specific Insights
  providerInsights: ProviderInsight[];
  bestProvider: string | null;
  worstProvider: string | null;
  
  // Key Metrics
  visibilityTrend: 'up' | 'down' | 'stable';
  sentimentTrend: 'improving' | 'declining' | 'stable';
  competitivePosition: 'leader' | 'challenger' | 'follower' | 'niche';
}

// ============================================
// Quote Extraction
// ============================================

export function extractBrandQuotes(
  responses: AIResponse[],
  brandName: string
): BrandQuote[] {
  if (!responses || responses.length === 0 || !brandName) {
    return [];
  }
  
  const quotes: BrandQuote[] = [];
  const brandLower = brandName.toLowerCase();
  
  responses.forEach(response => {
    const cleanedText = stripMarkdown(response.response);
    const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    sentences.forEach(sentence => {
      const sentenceLower = sentence.toLowerCase();
      
      // Check if sentence mentions the brand
      if (sentenceLower.includes(brandLower) || 
          sentenceLower.includes(brandLower.replace(/\s+/g, ''))) {
        
        // Determine sentiment from context
        const sentiment = detectSentimentFromText(sentence);
        
        // Determine context type
        const context = detectContextType(sentence);
        
        quotes.push({
          quote: sentence.trim(),
          provider: response.provider,
          prompt: response.prompt,
          sentiment,
          context
        });
      }
    });
  });
  
  // Remove duplicates and limit to most relevant
  const uniqueQuotes = removeDuplicateQuotes(quotes);
  return uniqueQuotes.slice(0, 10);
}

function detectSentimentFromText(text: string): 'positive' | 'neutral' | 'negative' {
  const textLower = text.toLowerCase();
  
  const positiveWords = [
    'best', 'excellent', 'great', 'top', 'leading', 'popular', 'recommended',
    'powerful', 'efficient', 'reliable', 'innovative', 'outstanding', 'superior',
    'favorite', 'preferred', 'trusted', 'quality', 'impressive', 'strong'
  ];
  
  const negativeWords = [
    'worst', 'poor', 'bad', 'limited', 'expensive', 'slow', 'difficult',
    'complex', 'outdated', 'lacking', 'disappointing', 'weak', 'concern',
    'issue', 'problem', 'drawback', 'downside', 'avoid', 'not recommended'
  ];
  
  const positiveCount = positiveWords.filter(w => textLower.includes(w)).length;
  const negativeCount = negativeWords.filter(w => textLower.includes(w)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function detectContextType(text: string): BrandQuote['context'] {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('recommend') || textLower.includes('suggest') || textLower.includes('best for')) {
    return 'recommendation';
  }
  if (textLower.includes('vs') || textLower.includes('compared') || textLower.includes('alternative')) {
    return 'comparison';
  }
  if (textLower.includes('feature') || textLower.includes('capability') || textLower.includes('function')) {
    return 'feature';
  }
  if (textLower.includes('price') || textLower.includes('cost') || textLower.includes('free') || textLower.includes('plan')) {
    return 'pricing';
  }
  if (textLower.includes('warning') || textLower.includes('caution') || textLower.includes('note that')) {
    return 'warning';
  }
  return 'general';
}

function removeDuplicateQuotes(quotes: BrandQuote[]): BrandQuote[] {
  const seen = new Set<string>();
  return quotes.filter(q => {
    const key = q.quote.toLowerCase().substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ============================================
// Competitive Gap Analysis
// ============================================

export function analyzeCompetitiveGaps(
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[]
): CompetitiveGap[] {
  if (!competitors || competitors.length === 0 || !brandData) {
    return [];
  }
  
  const gaps: CompetitiveGap[] = [];
  
  competitors.filter(c => !c.isOwn).forEach(competitor => {
    const gap = brandData.visibilityScore - competitor.visibilityScore;
    const gapType: CompetitiveGap['gapType'] = 
      gap > 5 ? 'winning' : 
      gap < -5 ? 'losing' : 
      'tied';
    
    let insight = '';
    let actionItem = '';
    
    if (gapType === 'losing') {
      const gapPercent = Math.abs(gap).toFixed(1);
      insight = `${competitor.name} has ${gapPercent}% more AI visibility than you. AI recommends them more frequently.`;
      actionItem = `Research what makes ${competitor.name} visible to AI - analyze their content strategy and online presence.`;
    } else if (gapType === 'winning') {
      insight = `You're outperforming ${competitor.name} by ${gap.toFixed(1)}%. Your brand is more visible to AI.`;
      actionItem = `Maintain your advantage over ${competitor.name} by continuing your current strategy.`;
    } else {
      insight = `You and ${competitor.name} have similar AI visibility. Small improvements could help you pull ahead.`;
      actionItem = `Target specific keywords and topics where ${competitor.name} might be weak.`;
    }
    
    gaps.push({
      competitor: competitor.name,
      competitorScore: competitor.visibilityScore,
      yourScore: brandData.visibilityScore,
      gap,
      gapType,
      insight,
      actionItem
    });
  });
  
  // Sort by gap (biggest losses first)
  return gaps.sort((a, b) => a.gap - b.gap);
}

// ============================================
// Action Item Generation
// ============================================

export function generateActionItems(
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[],
  responses: AIResponse[],
  brandName: string
): ActionItem[] {
  if (!brandData || !brandName) {
    return [];
  }
  
  const actions: ActionItem[] = [];
  let actionId = 1;
  
  // Check visibility score
  if (brandData.visibilityScore === 0) {
    actions.push({
      id: `action-${actionId++}`,
      priority: 'high',
      category: 'visibility',
      title: 'Critical: Zero AI Visibility',
      description: `Your brand "${brandName}" was not mentioned by any AI provider. This means potential customers asking AI for recommendations won't find you.`,
      impact: 'Could increase leads by 50%+ once AI starts recommending you',
      effort: 'medium'
    });
  } else if (brandData.visibilityScore < 25) {
    actions.push({
      id: `action-${actionId++}`,
      priority: 'high',
      category: 'visibility',
      title: 'Low AI Visibility Detected',
      description: `Your visibility score of ${brandData.visibilityScore}% means AI rarely recommends you. Focus on building online presence.`,
      impact: 'Could double your AI visibility within 3-6 months',
      effort: 'medium'
    });
  }
  
  // Check sentiment
  if (brandData.sentiment === 'negative') {
    actions.push({
      id: `action-${actionId++}`,
      priority: 'high',
      category: 'sentiment',
      title: 'Negative Brand Sentiment Detected',
      description: 'AI has a negative perception of your brand. This could be due to reviews, news articles, or content about issues.',
      impact: 'Fixing negative perception can increase conversion rates by 20-40%',
      effort: 'hard'
    });
  }
  
  // Check position
  if (brandData.averagePosition > 5) {
    actions.push({
      id: `action-${actionId++}`,
      priority: 'medium',
      category: 'competitive',
      title: 'Improve Ranking Position',
      description: `You rank #${Math.round(brandData.averagePosition)} on average. Focus on being in the top 3 for better visibility.`,
      impact: 'Top 3 positions get 70% of clicks and attention',
      effort: 'medium'
    });
  }
  
  // Check if losing to top competitor
  const topCompetitor = competitors.filter(c => !c.isOwn)[0];
  if (topCompetitor && topCompetitor.visibilityScore > brandData.visibilityScore + 20) {
    actions.push({
      id: `action-${actionId++}`,
      priority: 'high',
      category: 'competitive',
      title: `Close Gap with ${topCompetitor.name}`,
      description: `${topCompetitor.name} has ${(topCompetitor.visibilityScore - brandData.visibilityScore).toFixed(1)}% more visibility. Analyze their strategy.`,
      impact: 'Closing this gap could capture significant market share',
      effort: 'hard'
    });
  }
  
  // Content-based actions
  const mentionedInResponses = responses && responses.length > 0 ? responses.some(r => r.brandMentioned) : false;
  if (!mentionedInResponses) {
    actions.push({
      id: `action-${actionId++}`,
      priority: 'high',
      category: 'content',
      title: 'Create AI-Discoverable Content',
      description: 'Your brand wasn\'t found in AI responses. Create content that answers common industry questions.',
      impact: 'Content indexed by AI can drive organic discovery',
      effort: 'medium'
    });
  }
  
  // Add comparison content suggestion
  if (competitors.length > 0) {
    actions.push({
      id: `action-${actionId++}`,
      priority: 'medium',
      category: 'content',
      title: 'Create Comparison Content',
      description: `Create "vs" pages comparing ${brandName} to top competitors. AI often pulls from these.`,
      impact: 'Comparison content is highly searched and AI-referenced',
      effort: 'easy'
    });
  }
  
  // Quick win: Update website metadata
  actions.push({
    id: `action-${actionId++}`,
    priority: 'low',
    category: 'technical',
    title: 'Optimize Website for AI Crawlers',
    description: 'Ensure your website has clear, structured content that AI can easily understand and reference.',
    impact: 'Better structured content improves AI comprehension',
    effort: 'easy'
  });
  
  return actions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// ============================================
// Content Strategy Suggestions
// ============================================

export function generateContentSuggestions(
  brandName: string,
  competitors: CompetitorRanking[],
  responses: AIResponse[]
): ContentSuggestion[] {
  if (!brandName) {
    return [];
  }
  
  const suggestions: ContentSuggestion[] = [];
  
  // Extract topics from prompts that didn't mention the brand
  const missedPrompts = responses && responses.length > 0 ? responses.filter(r => !r.brandMentioned) : [];
  const topCompetitors = competitors.filter(c => !c.isOwn).slice(0, 3);
  
  // Comparison articles
  topCompetitors.forEach(comp => {
    suggestions.push({
      type: 'comparison',
      title: `${brandName} vs ${comp.name}: Complete Comparison`,
      description: `Create a detailed comparison page. AI frequently references these when users ask about alternatives.`,
      targetKeywords: [`${brandName} vs ${comp.name}`, `${comp.name} alternative`, `${brandName} or ${comp.name}`],
      priority: comp.visibilityScore > 30 ? 'high' : 'medium'
    });
  });
  
  // Best-of articles
  suggestions.push({
    type: 'blog',
    title: `Why ${brandName} is a Top Choice in ${new Date().getFullYear()}`,
    description: 'Create authoritative content about your strengths. Include specific features, use cases, and benefits.',
    targetKeywords: [`best ${brandName.toLowerCase()}`, `${brandName} review`, `${brandName} features`],
    priority: 'high'
  });
  
  // Testimonial/Case study
  suggestions.push({
    type: 'testimonial',
    title: 'Customer Success Stories & Testimonials',
    description: 'AI learns from reviews and testimonials. Publish customer success stories on your website.',
    targetKeywords: [`${brandName} reviews`, `${brandName} testimonials`, `${brandName} success story`],
    priority: 'medium'
  });
  
  // FAQ/Knowledge base
  suggestions.push({
    type: 'landing-page',
    title: 'Comprehensive FAQ & Knowledge Base',
    description: 'Create detailed FAQ pages answering common questions. AI often pulls from these for answers.',
    targetKeywords: [`${brandName} FAQ`, `how to use ${brandName}`, `${brandName} guide`],
    priority: 'medium'
  });
  
  // Industry thought leadership
  suggestions.push({
    type: 'blog',
    title: 'Industry Insights & Thought Leadership',
    description: 'Position your brand as an authority by publishing industry insights and trends.',
    targetKeywords: ['industry trends', 'expert insights', `${brandName} expertise`],
    priority: 'low'
  });
  
  return suggestions;
}

// ============================================
// Provider-Specific Insights
// ============================================

export function analyzeProviderPerformance(
  responses: AIResponse[],
  brandName: string
): ProviderInsight[] {
  if (!responses || responses.length === 0) {
    return [];
  }
  
  const providerMap = new Map<string, AIResponse[]>();
  
  // Group responses by provider
  responses.forEach(r => {
    const existing = providerMap.get(r.provider) || [];
    existing.push(r);
    providerMap.set(r.provider, existing);
  });
  
  const insights: ProviderInsight[] = [];
  
  providerMap.forEach((providerResponses, provider) => {
    if (providerResponses.length === 0) {
      insights.push({
        provider,
        mentionRate: 0,
        sentiment: 'neutral',
        averagePosition: 99,
        strength: '',
        weakness: `${provider} has no responses`,
        opportunity: `Ensure ${provider} is properly configured and responding`
      });
      return;
    }
    
    const mentioned = providerResponses.filter(r => r.brandMentioned);
    const mentionRate = (mentioned.length / providerResponses.length) * 100;
    
    const sentiments = providerResponses.map(r => r.sentiment);
    const sentiment = determineDominantSentiment(sentiments);
    
    const positions = providerResponses
      .filter(r => r.brandPosition)
      .map(r => r.brandPosition!);
    const averagePosition = positions.length > 0 
      ? positions.reduce((a, b) => a + b, 0) / positions.length 
      : 99;
    
    let strength = '';
    let weakness = '';
    let opportunity = '';
    
    if (mentionRate >= 75) {
      strength = `${provider} frequently recommends your brand (${mentionRate.toFixed(0)}% of responses)`;
      opportunity = 'Maintain this strong position by continuing to create quality content';
    } else if (mentionRate >= 50) {
      strength = `${provider} mentions you in half of relevant queries`;
      weakness = 'Not consistently recommended';
      opportunity = 'Focus on content that aligns with how this AI processes information';
    } else if (mentionRate > 0) {
      weakness = `${provider} rarely mentions you (only ${mentionRate.toFixed(0)}% of responses)`;
      opportunity = `Research what content ${provider} typically references and create similar content`;
    } else {
      weakness = `${provider} never mentioned your brand in any response`;
      opportunity = `This is a major growth opportunity - getting ${provider} to recognize you could significantly boost visibility`;
    }
    
    insights.push({
      provider,
      mentionRate,
      sentiment,
      averagePosition,
      strength,
      weakness,
      opportunity
    });
  });
  
  return insights.sort((a, b) => b.mentionRate - a.mentionRate);
}

function determineDominantSentiment(
  sentiments: ('positive' | 'neutral' | 'negative')[]
): 'positive' | 'neutral' | 'negative' {
  const counts = { positive: 0, neutral: 0, negative: 0 };
  sentiments.forEach(s => counts[s]++);
  
  if (counts.positive > counts.negative && counts.positive > counts.neutral) return 'positive';
  if (counts.negative > counts.positive && counts.negative > counts.neutral) return 'negative';
  return 'neutral';
}

// ============================================
// Main Insights Generator
// ============================================

export function generateStrategicInsights(
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[],
  responses: AIResponse[],
  brandName: string
): StrategicInsights {
  // Calculate overall health
  let healthScore = 0;
  
  // Visibility contributes 40%
  healthScore += (brandData.visibilityScore / 100) * 40;
  
  // Sentiment contributes 30%
  const sentimentScore = brandData.sentiment === 'positive' ? 100 : 
                         brandData.sentiment === 'neutral' ? 50 : 0;
  healthScore += (sentimentScore / 100) * 30;
  
  // Position contributes 30%
  const positionScore = brandData.averagePosition <= 3 ? 100 :
                       brandData.averagePosition <= 5 ? 70 :
                       brandData.averagePosition <= 10 ? 40 : 10;
  healthScore += (positionScore / 100) * 30;
  
  const overallHealth: StrategicInsights['overallHealth'] = 
    healthScore >= 70 ? 'excellent' :
    healthScore >= 50 ? 'good' :
    healthScore >= 25 ? 'needs-work' : 'critical';
  
  // Generate all insights
  const brandQuotes = extractBrandQuotes(responses, brandName);
  const competitiveGaps = analyzeCompetitiveGaps(brandData, competitors);
  const actionItems = generateActionItems(brandData, competitors, responses, brandName);
  const contentSuggestions = generateContentSuggestions(brandName, competitors, responses);
  const providerInsights = analyzeProviderPerformance(responses, brandName);
  
  // Extract competitor quotes
  const competitorQuotes = new Map<string, BrandQuote[]>();
  competitors.filter(c => !c.isOwn).forEach(comp => {
    const quotes = extractBrandQuotes(responses, comp.name);
    if (quotes.length > 0) {
      competitorQuotes.set(comp.name, quotes);
    }
  });
  
  // Find biggest threat and opportunity
  const losingGaps = competitiveGaps.filter(g => g.gapType === 'losing');
  const biggestThreat = losingGaps.length > 0 ? losingGaps[0].competitor : null;
  
  const winningGaps = competitiveGaps.filter(g => g.gapType === 'winning');
  const biggestOpportunity = winningGaps.length > 0 
    ? `Maintain lead over ${winningGaps[winningGaps.length - 1].competitor}`
    : losingGaps.length > 0 
    ? `Catch up to ${losingGaps[0].competitor}`
    : 'Expand into new markets';
  
  // Find best and worst providers
  const bestProvider = providerInsights.length > 0 && providerInsights[0].mentionRate > 0
    ? providerInsights[0].provider
    : null;
  const worstProvider = providerInsights.length > 0 
    ? providerInsights[providerInsights.length - 1].provider
    : null;
  
  // Generate summary
  const summary = generateSummary(healthScore, brandData, competitors, brandName);
  
  // Categorize actions
  const quickWins = actionItems.filter(a => a.effort === 'easy');
  const strategicPriorities = actionItems.filter(a => a.priority === 'high');
  
  // Identify missing topics from prompts
  const missedPrompts = responses.filter(r => !r.brandMentioned).map(r => r.prompt);
  const missingTopics = extractTopicsFromPrompts(missedPrompts);
  
  return {
    overallHealth,
    healthScore: Math.round(healthScore),
    summary,
    brandQuotes,
    competitorQuotes,
    competitiveGaps,
    biggestThreat,
    biggestOpportunity,
    actionItems,
    quickWins,
    strategicPriorities,
    contentSuggestions,
    missingTopics,
    providerInsights,
    bestProvider,
    worstProvider,
    visibilityTrend: 'stable', // Would need historical data
    sentimentTrend: 'stable',  // Would need historical data
    competitivePosition: determineCompetitivePosition(brandData, competitors)
  };
}

function generateSummary(
  healthScore: number,
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[],
  brandName: string
): string {
  if (!competitors || competitors.length === 0) {
    return `${brandName} has ${brandData.visibilityScore}% visibility. No competitor data available for comparison.`;
  }
  
  const rankIndex = competitors.findIndex(c => c.isOwn);
  const rank = rankIndex >= 0 ? rankIndex + 1 : competitors.length;
  const totalCompetitors = competitors.length;
  
  if (healthScore >= 70) {
    return `${brandName} is performing excellently in AI visibility. You rank #${rank} out of ${totalCompetitors} competitors with ${brandData.visibilityScore}% visibility. AI actively recommends your brand, giving you a strong competitive advantage.`;
  } else if (healthScore >= 50) {
    return `${brandName} has good AI presence but room for improvement. You rank #${rank} out of ${totalCompetitors} competitors with ${brandData.visibilityScore}% visibility. Focus on the action items below to strengthen your position.`;
  } else if (healthScore >= 25) {
    return `${brandName} needs work on AI visibility. You rank #${rank} out of ${totalCompetitors} competitors with only ${brandData.visibilityScore}% visibility. Implementing the recommended actions could significantly improve your AI presence.`;
  } else {
    return `${brandName} has critical visibility issues. ${brandData.visibilityScore === 0 ? 'AI doesn\'t mention your brand at all' : `Only ${brandData.visibilityScore}% visibility`}. Immediate action is needed to ensure AI-powered tools recommend your brand to potential customers.`;
  }
}

function determineCompetitivePosition(
  brandData: CompetitorRanking,
  competitors: CompetitorRanking[]
): StrategicInsights['competitivePosition'] {
  if (!competitors || competitors.length === 0) {
    return 'niche';
  }
  
  const rankIndex = competitors.findIndex(c => c.isOwn);
  if (rankIndex < 0) return 'niche';
  
  const rank = rankIndex + 1;
  const total = competitors.length;
  
  if (rank === 1) return 'leader';
  if (rank <= Math.ceil(total * 0.25)) return 'challenger';
  if (rank <= Math.ceil(total * 0.5)) return 'follower';
  return 'niche';
}

function extractTopicsFromPrompts(prompts: string[]): string[] {
  const topics: string[] = [];
  
  prompts.forEach(prompt => {
    // Extract key topics from prompts
    const words = prompt.toLowerCase()
      .replace(/[?!.,]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4);
    
    // Find meaningful topic words
    const topicWords = words.filter(w => 
      !['best', 'what', 'which', 'when', 'where', 'there', 'their', 'about', 'should'].includes(w)
    );
    
    if (topicWords.length > 0) {
      topics.push(topicWords.slice(0, 3).join(' '));
    }
  });
  
  // Remove duplicates
  return [...new Set(topics)].slice(0, 5);
}


