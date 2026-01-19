/**
 * Content Generator
 * Generates finished, ready-to-use content based on Boost Actions
 */

import { generateText } from 'ai';
import { getProviderModel } from './provider-config';
import { ActionItem } from './strategic-insights';
import { CompetitorRanking, AIResponse } from './types';

export interface GeneratedContent {
  type: 'blog' | 'comparison' | 'faq' | 'landing-page' | 'social' | 'email' | 'technical';
  title: string;
  content: string;
  metaDescription?: string;
  keywords?: string[];
  wordCount: number;
  seoScore?: number;
  readyToPublish: boolean;
}

export interface ContentGenerationRequest {
  action: ActionItem;
  brandName: string;
  brandData: CompetitorRanking;
  competitors: CompetitorRanking[];
  brandUrl?: string;
  seoData?: {
    keywords: Array<{ keyword: string; searchVolume: number; difficulty: number }>;
    competitorKeywords?: Array<{ keyword: string; searchVolume: number; difficulty: number }>;
  };
  context?: {
    insights?: string[];
    recommendations?: string[];
    missedTopics?: string[];
  };
}

/**
 * Generate content based on action type and category
 */
export async function generateContentForAction(
  request: ContentGenerationRequest
): Promise<GeneratedContent[]> {
  const { action, brandName, brandData, competitors, brandUrl, seoData, context } = request;
  
  const generatedContent: GeneratedContent[] = [];
  
  try {
    switch (action.category) {
      case 'content':
        // Generate blog posts, comparison pages, FAQs
        if (action.title.includes('Comparison') || action.title.includes('vs')) {
          const comparison = await generateComparisonPage(request);
          generatedContent.push(comparison);
        } else if (action.title.includes('FAQ') || action.title.includes('guide')) {
          const faq = await generateFAQPage(request);
          generatedContent.push(faq);
        } else {
          const blog = await generateBlogPost(request);
          generatedContent.push(blog);
        }
        break;
      
      case 'visibility':
        // Generate SEO-optimized landing page or blog post
        const landingPage = await generateLandingPage(request);
        generatedContent.push(landingPage);
        break;
      
      case 'competitive':
        // Generate comparison content
        const competitiveComparison = await generateComparisonPage(request);
        generatedContent.push(competitiveComparison);
        break;
      
      case 'sentiment':
        // Generate positive content to improve sentiment
        const sentimentBlog = await generateBlogPost(request, 'sentiment-improvement');
        generatedContent.push(sentimentBlog);
        break;
      
      case 'technical':
        // Generate technical documentation or implementation guide
        const technicalGuide = await generateTechnicalGuide(request);
        generatedContent.push(technicalGuide);
        break;
      
      default:
        // Default to blog post
        const defaultBlog = await generateBlogPost(request);
        generatedContent.push(defaultBlog);
    }
    
    // Also generate supporting content
    if (action.category === 'content' || action.category === 'visibility') {
      const socialContent = await generateSocialMediaContent(request);
      generatedContent.push(socialContent);
    }
    
  } catch (error) {
    console.error('[Content Generator] Error generating content:', error);
    console.error('[Content Generator] Error details:', {
      actionId: request.action.id,
      category: request.action.category,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
  
  console.log(`[Content Generator] Successfully generated ${generatedContent.length} piece(s) of content for action ${request.action.id}`);
  if (generatedContent.length > 0) {
    console.log(`[Content Generator] Content types: ${generatedContent.map(c => c.type).join(', ')}`);
  }
  
  return generatedContent;
}

/**
 * Generate a comprehensive blog post
 */
async function generateBlogPost(
  request: ContentGenerationRequest,
  focus?: 'sentiment-improvement' | 'seo' | 'general'
): Promise<GeneratedContent> {
  const { action, brandName, brandData, competitors, brandUrl, seoData, context } = request;
  
  // Build prompt based on action and focus
  let prompt = `Write a comprehensive, SEO-optimized blog post for ${brandName}.\n\n`;
  
  prompt += `**Topic:** ${action.title}\n`;
  prompt += `**Description:** ${action.description}\n\n`;
  
  if (seoData?.keywords && seoData.keywords.length > 0) {
    prompt += `**Target Keywords:** ${seoData.keywords.slice(0, 5).map(k => k.keyword).join(', ')}\n`;
    prompt += `**SEO Context:** Primary keyword has ${seoData.keywords[0]?.searchVolume || 0} monthly searches with ${seoData.keywords[0]?.difficulty || 0}% difficulty.\n\n`;
  }
  
  if (context?.insights && context.insights.length > 0) {
    prompt += `**Key Insights:**\n${context.insights.slice(0, 3).map(i => `- ${i}`).join('\n')}\n\n`;
  }
  
  if (focus === 'sentiment-improvement') {
    prompt += `**Focus:** Address negative perceptions and highlight positive aspects of ${brandName}. Use a helpful, solution-oriented tone.\n\n`;
  }
  
  prompt += `**Requirements:**
- Write 1500-2000 words
- Use clear headings (H2, H3) with target keywords
- Include an engaging introduction and strong conclusion
- Add actionable insights and practical examples
- Optimize for SEO while maintaining readability
- Include a compelling meta description (150-160 characters)
- Make it ready to publish - no placeholders or TODOs

**Brand Context:**
- Brand: ${brandName}
- Current visibility: ${brandData.visibilityScore}%
- Current sentiment: ${brandData.sentimentScore}/100
${brandUrl ? `- Website: ${brandUrl}` : ''}

${competitors.length > 0 ? `**Competitors:** ${competitors.slice(0, 3).map(c => c.name).join(', ')}` : ''}

Write the complete blog post now:`;

  const model = getProviderModel('openai') || getProviderModel('anthropic');
  if (!model) {
    const openaiConfigured = process.env.OPENAI_API_KEY ? 'configured' : 'not configured';
    const anthropicConfigured = process.env.ANTHROPIC_API_KEY ? 'configured' : 'not configured';
    throw new Error(`No AI provider available for content generation. OpenAI: ${openaiConfigured}, Anthropic: ${anthropicConfigured}`);
  }

  let text: string;
  try {
    const result = await generateText({
      model,
      prompt,
      maxTokens: 4000,
      temperature: 0.7,
    });
    text = result.text;
  } catch (error) {
    console.error('[Content Generator] Error generating blog post text:', error);
    throw new Error(`Failed to generate blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Extract title and meta description
  const titleMatch = text.match(/^#\s+(.+)$/m) || text.match(/^Title:\s*(.+)$/mi);
  const title = titleMatch ? titleMatch[1].trim() : action.title;
  
  const metaDescription = extractMetaDescription(text) || 
    `Learn about ${action.title.toLowerCase()} for ${brandName}. ${action.description.substring(0, 100)}...`;

  return {
    type: 'blog',
    title,
    content: text,
    metaDescription,
    keywords: seoData?.keywords?.slice(0, 5).map(k => k.keyword) || [],
    wordCount: text.split(/\s+/).length,
    readyToPublish: true,
  };
}

/**
 * Generate a comparison page
 */
async function generateComparisonPage(
  request: ContentGenerationRequest
): Promise<GeneratedContent> {
  const { action, brandName, brandData, competitors, seoData } = request;
  
  const topCompetitor = competitors.filter(c => !c.isOwn)[0];
  const competitorName = topCompetitor?.name || 'Competitors';
  
  let prompt = `Write a comprehensive comparison page: "${brandName} vs ${competitorName}".\n\n`;
  
  prompt += `**Purpose:** ${action.description}\n\n`;
  
  if (seoData?.keywords) {
    prompt += `**Target Keywords:** ${seoData.keywords.slice(0, 3).map(k => k.keyword).join(', ')}\n\n`;
  }
  
  prompt += `**Brand Context:**
- ${brandName}: Visibility ${brandData.visibilityScore}%, Sentiment ${brandData.sentimentScore}/100
${topCompetitor ? `- ${topCompetitor.name}: Visibility ${topCompetitor.visibilityScore}%, Sentiment ${topCompetitor.sentimentScore}/100` : ''}

**Requirements:**
- Write 2000-2500 words
- Compare features, pricing, use cases, pros/cons
- Use comparison tables where appropriate
- Include "Which is better?" section with clear recommendation
- Optimize for SEO with target keywords naturally integrated
- Make it fair and balanced but highlight ${brandName}'s strengths
- Include a compelling meta description
- Ready to publish - complete and polished

Write the complete comparison page now:`;

  const model = getProviderModel('openai') || getProviderModel('anthropic');
  if (!model) {
    const openaiConfigured = process.env.OPENAI_API_KEY ? 'configured' : 'not configured';
    const anthropicConfigured = process.env.ANTHROPIC_API_KEY ? 'configured' : 'not configured';
    throw new Error(`No AI provider available for content generation. OpenAI: ${openaiConfigured}, Anthropic: ${anthropicConfigured}`);
  }

  let text: string;
  try {
    const result = await generateText({
      model,
      prompt,
      maxTokens: 5000,
      temperature: 0.7,
    });
    text = result.text;
  } catch (error) {
    console.error('[Content Generator] Error generating text:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const title = `${brandName} vs ${competitorName}: Complete Comparison`;
  const metaDescription = `Compare ${brandName} and ${competitorName}. See features, pricing, pros, cons, and which is better for your needs.`;

  return {
    type: 'comparison',
    title,
    content: text,
    metaDescription,
    keywords: [`${brandName} vs ${competitorName}`, `${competitorName} alternative`, `best ${competitorName} alternative`],
    wordCount: text.split(/\s+/).length,
    readyToPublish: true,
  };
}

/**
 * Generate an FAQ page
 */
async function generateFAQPage(
  request: ContentGenerationRequest
): Promise<GeneratedContent> {
  const { action, brandName, brandData, context } = request;
  
  let prompt = `Create a comprehensive FAQ page for ${brandName}.\n\n`;
  
  prompt += `**Topic:** ${action.title}\n`;
  prompt += `**Context:** ${action.description}\n\n`;
  
  if (context?.missedTopics && context.missedTopics.length > 0) {
    prompt += `**Common Questions to Address:**\n${context.missedTopics.slice(0, 10).map(t => `- ${t}`).join('\n')}\n\n`;
  }
  
  prompt += `**Requirements:**
- Write 10-15 comprehensive Q&A pairs
- Each answer should be 100-200 words
- Use Schema.org FAQPage structured data format in your response
- Cover common questions, features, pricing, use cases, troubleshooting
- Optimize for SEO with natural keyword integration
- Include a compelling meta description
- Ready to publish

Write the complete FAQ page now:`;

  const model = getProviderModel('openai') || getProviderModel('anthropic');
  if (!model) {
    const openaiConfigured = process.env.OPENAI_API_KEY ? 'configured' : 'not configured';
    const anthropicConfigured = process.env.ANTHROPIC_API_KEY ? 'configured' : 'not configured';
    throw new Error(`No AI provider available for content generation. OpenAI: ${openaiConfigured}, Anthropic: ${anthropicConfigured}`);
  }

  let text: string;
  try {
    const result = await generateText({
      model,
      prompt,
      maxTokens: 3000,
      temperature: 0.7,
    });
    text = result.text;
  } catch (error) {
    console.error('[Content Generator] Error generating FAQ text:', error);
    throw new Error(`Failed to generate FAQ content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const title = `${brandName} FAQ: ${action.title}`;
  const metaDescription = `Frequently asked questions about ${brandName}. Get answers about features, pricing, and more.`;

  return {
    type: 'faq',
    title,
    content: text,
    metaDescription,
    keywords: [`${brandName} FAQ`, `${brandName} questions`, `how to use ${brandName}`],
    wordCount: text.split(/\s+/).length,
    readyToPublish: true,
  };
}

/**
 * Generate a landing page
 */
async function generateLandingPage(
  request: ContentGenerationRequest
): Promise<GeneratedContent> {
  const { action, brandName, brandData, brandUrl, seoData } = request;
  
  let prompt = `Create an SEO-optimized landing page for ${brandName}.\n\n`;
  
  prompt += `**Goal:** ${action.title}\n`;
  prompt += `**Description:** ${action.description}\n\n`;
  
  if (seoData?.keywords && seoData.keywords.length > 0) {
    prompt += `**Primary Keyword:** ${seoData.keywords[0]?.keyword} (${seoData.keywords[0]?.searchVolume || 0} monthly searches)\n`;
    prompt += `**Secondary Keywords:** ${seoData.keywords.slice(1, 4).map(k => k.keyword).join(', ')}\n\n`;
  }
  
  prompt += `**Brand Context:**
- Visibility: ${brandData.visibilityScore}%
- Sentiment: ${brandData.sentimentScore}/100
${brandUrl ? `- Website: ${brandUrl}` : ''}

**Requirements:**
- Write 1200-1500 words
- Include compelling headline and subheadline
- Add clear value propositions and benefits
- Include call-to-action sections
- Optimize for target keywords naturally
- Use clear sections: Hero, Features, Benefits, Social Proof, CTA
- Include a compelling meta description
- Ready to publish

Write the complete landing page now:`;

  const model = getProviderModel('openai') || getProviderModel('anthropic');
  if (!model) {
    const openaiConfigured = process.env.OPENAI_API_KEY ? 'configured' : 'not configured';
    const anthropicConfigured = process.env.ANTHROPIC_API_KEY ? 'configured' : 'not configured';
    throw new Error(`No AI provider available for content generation. OpenAI: ${openaiConfigured}, Anthropic: ${anthropicConfigured}`);
  }

  let text: string;
  try {
    const result = await generateText({
      model,
      prompt,
      maxTokens: 3500,
      temperature: 0.7,
    });
    text = result.text;
  } catch (error) {
    console.error('[Content Generator] Error generating landing page text:', error);
    throw new Error(`Failed to generate landing page: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const title = action.title;
  const metaDescription = `${action.description.substring(0, 140)}...`;

  return {
    type: 'landing-page',
    title,
    content: text,
    metaDescription,
    keywords: seoData?.keywords?.slice(0, 5).map(k => k.keyword) || [],
    wordCount: text.split(/\s+/).length,
    readyToPublish: true,
  };
}

/**
 * Generate social media content
 */
async function generateSocialMediaContent(
  request: ContentGenerationRequest
): Promise<GeneratedContent> {
  const { action, brandName } = request;
  
  let prompt = `Create social media content for ${brandName} based on this action:\n\n`;
  prompt += `**Action:** ${action.title}\n`;
  prompt += `**Description:** ${action.description}\n\n`;
  
  prompt += `**Requirements:**
- Create 5-7 social media posts (Twitter/X, LinkedIn, Facebook)
- Each post should be platform-optimized (280 chars for Twitter, longer for LinkedIn)
- Include relevant hashtags
- Make them engaging and shareable
- Include a mix of educational, promotional, and engaging content
- Ready to post

Write the social media content now:`;

  const model = getProviderModel('openai') || getProviderModel('anthropic');
  if (!model) {
    const openaiConfigured = process.env.OPENAI_API_KEY ? 'configured' : 'not configured';
    const anthropicConfigured = process.env.ANTHROPIC_API_KEY ? 'configured' : 'not configured';
    throw new Error(`No AI provider available for content generation. OpenAI: ${openaiConfigured}, Anthropic: ${anthropicConfigured}`);
  }

  let text: string;
  try {
    const result = await generateText({
      model,
      prompt,
      maxTokens: 1500,
      temperature: 0.8,
    });
    text = result.text;
  } catch (error) {
    console.error('[Content Generator] Error generating social media text:', error);
    throw new Error(`Failed to generate social media content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    type: 'social',
    title: `Social Media Posts: ${action.title}`,
    content: text,
    keywords: [brandName, action.category],
    wordCount: text.split(/\s+/).length,
    readyToPublish: true,
  };
}

/**
 * Generate technical guide
 */
async function generateTechnicalGuide(
  request: ContentGenerationRequest
): Promise<GeneratedContent> {
  const { action, brandName, brandUrl } = request;
  
  let prompt = `Create a technical implementation guide for ${brandName}.\n\n`;
  prompt += `**Topic:** ${action.title}\n`;
  prompt += `**Description:** ${action.description}\n\n`;
  
  prompt += `**Requirements:**
- Write a step-by-step technical guide
- Include code examples or implementation details where relevant
- Add clear sections and subsections
- Make it actionable and easy to follow
- Include troubleshooting tips
- Optimize for SEO
- Include a compelling meta description
- Ready to publish

Write the complete technical guide now:`;

  const model = getProviderModel('openai') || getProviderModel('anthropic');
  if (!model) {
    const openaiConfigured = process.env.OPENAI_API_KEY ? 'configured' : 'not configured';
    const anthropicConfigured = process.env.ANTHROPIC_API_KEY ? 'configured' : 'not configured';
    throw new Error(`No AI provider available for content generation. OpenAI: ${openaiConfigured}, Anthropic: ${anthropicConfigured}`);
  }

  let text: string;
  try {
    const result = await generateText({
      model,
      prompt,
      maxTokens: 3000,
      temperature: 0.6,
    });
    text = result.text;
  } catch (error) {
    console.error('[Content Generator] Error generating technical guide text:', error);
    throw new Error(`Failed to generate technical guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    type: 'technical',
    title: action.title,
    content: text,
    metaDescription: `Technical guide: ${action.description.substring(0, 140)}...`,
    keywords: [brandName, 'technical guide', 'implementation'],
    wordCount: text.split(/\s+/).length,
    readyToPublish: true,
  };
}

/**
 * Extract meta description from content
 */
function extractMetaDescription(content: string): string | undefined {
  // Look for meta description patterns
  const patterns = [
    /meta description:?\s*(.+?)(?:\n|$)/i,
    /description:?\s*(.+?)(?:\n|$)/i,
    /summary:?\s*(.+?)(?:\n|$)/i,
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim().substring(0, 160);
    }
  }
  
  // Extract first paragraph if no explicit meta description
  const firstParagraph = content.split('\n\n')[0];
  if (firstParagraph && firstParagraph.length > 50 && firstParagraph.length < 200) {
    return firstParagraph.trim().substring(0, 160);
  }
  
  return undefined;
}
