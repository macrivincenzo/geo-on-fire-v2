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
  infographics?: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    section?: string;
    position?: number;
    altText: string;
    dataPoints: string[];
  }>;
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
  
  // Build comprehensive SEO data context
  const primaryKeyword = seoData?.keywords?.[0];
  const keywordContext = seoData?.keywords?.slice(0, 10).map(k => {
    const difficulty = k.difficulty >= 70 ? 'high' : k.difficulty >= 40 ? 'medium' : 'low';
    return `- "${k.keyword}": ${k.searchVolume.toLocaleString()} monthly searches, ${difficulty} difficulty (${k.difficulty}%)`;
  }).join('\n') || '';
  
  let prompt = `You are an expert content writer creating a comprehensive, research-backed blog post for ${brandName}.\n\n`;
  
  prompt += `**CRITICAL: Use real data, specific examples, and research-backed claims. Avoid generic statements.**\n\n`;
  
  prompt += `**Topic:** ${action.title}\n`;
  prompt += `**Description:** ${action.description}\n\n`;
  
  prompt += `**SEO Keyword Research (DataForSEO Real Data):**
${keywordContext || 'No keyword data available'}

**Primary Target Keyword:** ${primaryKeyword?.keyword || 'N/A'}
- Search Volume: ${primaryKeyword?.searchVolume.toLocaleString() || 'N/A'} monthly searches
- Keyword Difficulty: ${primaryKeyword?.difficulty || 'N/A'}% (${primaryKeyword?.difficulty && primaryKeyword.difficulty >= 70 ? 'High competition' : primaryKeyword?.difficulty && primaryKeyword.difficulty >= 40 ? 'Medium competition' : 'Low competition'})
${primaryKeyword ? `- **Content Strategy:** Target this keyword naturally in H1, first paragraph, and 2-3 H2/H3 headings` : ''}\n\n`;
  
  if (context?.insights && context.insights.length > 0) {
    prompt += `**Key Insights from Analysis:**
${context.insights.slice(0, 5).map(i => `- ${i}`).join('\n')}\n\n`;
  }
  
  if (focus === 'sentiment-improvement') {
    prompt += `**Focus:** Address negative perceptions and highlight positive aspects of ${brandName}. Use a helpful, solution-oriented tone. Include specific examples of ${brandName}'s strengths.\n\n`;
  }
  
  prompt += `**Brand Performance Data (Real Metrics):**
- Brand: ${brandName}
- AI Visibility Score: ${brandData.visibilityScore}% (${brandData.visibilityScore >= 80 ? 'Excellent' : brandData.visibilityScore >= 60 ? 'Good' : brandData.visibilityScore >= 40 ? 'Fair' : 'Needs Improvement'})
- Sentiment Score: ${brandData.sentimentScore}/100 (${brandData.sentimentScore >= 80 ? 'Very Positive' : brandData.sentimentScore >= 60 ? 'Positive' : brandData.sentimentScore >= 40 ? 'Neutral' : 'Negative'})
- Average Position: ${brandData.averagePosition || 'N/A'}
- Mentions: ${brandData.mentions || 'N/A'}
${brandUrl ? `- Website: ${brandUrl}` : ''}

${competitors.length > 0 ? `**Competitive Context:** ${competitors.slice(0, 3).map(c => `${c.name} (${c.visibilityScore}% visibility, ${c.sentimentScore}/100 sentiment)`).join(', ')}` : ''}\n\n`;

  prompt += `**Content Requirements (CRITICAL - Follow Exactly):**

1. **Structure & Length:**
   - Write 2000-2500 words (comprehensive, authoritative)
   - Use clear H2/H3 headings with target keywords naturally integrated
   - Include an engaging, hook-driven introduction (first 100 words)
   - End with a strong, actionable conclusion

2. **Specificity & Data (MOST IMPORTANT):**
   - Use REAL, SPECIFIC data points throughout
   - Include actual statistics, percentages, and numbers
   - Reference specific features, benefits, and use cases
   - Add concrete examples: "83.3% visibility score" not "high visibility"
   - Include real-world scenarios and practical applications
   - Cite specific metrics from the brand analysis

3. **SEO Optimization:**
   - Naturally integrate primary keyword "${primaryKeyword?.keyword || action.title}" in:
     * H1 title
     * First paragraph (within first 100 words)
     * 2-3 H2/H3 headings
     * Meta description
   - Use related keywords naturally throughout (LSI terms)
   - Include semantic variations of target keywords
   - Optimize for featured snippets with clear, concise answers

4. **Content Quality:**
   - Write in an authoritative, helpful tone
   - Include actionable insights and practical examples
   - Add data-driven recommendations
   - Use subheadings to break up content (every 300-400 words)
   - Include bullet points and lists for scannability
   - Add internal linking opportunities (mention related topics)

5. **Additional Elements:**
   - Compelling meta description (150-160 characters, includes primary keyword)
   - Key takeaways box or summary section
   - FAQ section (3-5 questions related to the topic)
   - Call-to-action at the end

**Write the complete, polished blog post now. Make it exceptional - the kind of content that makes readers say "wow, this is exactly what I needed!":`;

  // Prefer Anthropic for high-quality content generation
  const model = getProviderModel('anthropic') || getProviderModel('openai');
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
      maxTokens: 8000, // Increased for comprehensive content
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

  // Generate infographics automatically
  let infographics: GeneratedContent['infographics'] = [];
  try {
    const { generateInfographicsFromTemplate } = await import('./infographic-renderer');
    
    // Extract statistics from blog content
    const statPatterns = [
      /(\d+%)/g,
      /(\d+\.\d+%)/g,
      /(top \d+)/gi,
      /(#\d+)/g,
      /(\d+\.\d+%?)/g,
    ];

    const statsRaw: string[] = [];
    for (const pattern of statPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        statsRaw.push(...matches);
      }
    }

    // Create infographic data from extracted stats
    // Dedupe while preserving order
    const stats = Array.from(new Set(statsRaw.map(s => s.trim()))).filter(Boolean);

    if (stats.length > 0) {
      // Build up to 3 infographics: start, middle, end
      const groups: string[][] = [];
      for (let i = 0; i < Math.min(stats.length, 9); i += 3) {
        const group = stats.slice(i, i + 3);
        if (group.length > 0) groups.push(group);
      }

      const infographicData = groups.slice(0, 3).map((group, idx) => {
        const primary = group[0] || stats[0] || '40%';
        const secondary = group[1] || stats[1] || 'Top 3';
        const tertiary = group[2] || stats[2] || '#1';

        const placement =
          idx === 0 ? ({ section: 'start' as const, position: 0 } as const) :
          idx === 1 ? ({ section: 'middle' as const, position: -1 } as const) :
          ({ section: 'end' as const, position: 999 } as const);

        const titleVariant =
          idx === 0 ? title :
          idx === 1 ? `${title} — Key Insight` :
          `${title} — Summary`;

        const descriptionVariant =
          idx === 0 ? (metaDescription || action.description) :
          idx === 1 ? `Key insight: ${primary} · ${secondary} · ${tertiary}` :
          `Takeaway: ${primary} matters — act on it.`;

        return {
          title: titleVariant,
          description: descriptionVariant,
          dataPoints: group,
          metrics: { primary, secondary, tertiary },
          ...placement,
        };
      });

      // Generate infographics using HTML template renderer
      infographics = await generateInfographicsFromTemplate(infographicData);
      console.log(`✅ Generated ${infographics.length} infographic(s) for blog post`);
    }
  } catch (error) {
    console.warn('[Content Generator] Failed to generate infographics:', error);
    // Continue without infographics if generation fails
  }

  return {
    type: 'blog',
    title,
    content: text,
    metaDescription,
    keywords: seoData?.keywords?.slice(0, 5).map(k => k.keyword) || [],
    wordCount: text.split(/\s+/).length,
    readyToPublish: true,
    infographics,
  };
}

/**
 * Generate a comparison page
 */
async function generateComparisonPage(
  request: ContentGenerationRequest
): Promise<GeneratedContent> {
  const { action, brandName, brandData, competitors, seoData, brandUrl } = request;
  
  const topCompetitor = competitors.filter(c => !c.isOwn)[0];
  const competitorName = topCompetitor?.name || 'Competitors';
  
  // Build comprehensive SEO data context
  const primaryKeyword = seoData?.keywords?.[0];
  const keywordContext = seoData?.keywords?.slice(0, 10).map(k => {
    const difficulty = k.difficulty >= 70 ? 'high' : k.difficulty >= 40 ? 'medium' : 'low';
    return `- "${k.keyword}": ${k.searchVolume.toLocaleString()} monthly searches, ${difficulty} difficulty (${k.difficulty}%)`;
  }).join('\n') || '';
  
  let prompt = `You are an expert content writer creating a comprehensive, research-backed comparison page. Write a detailed comparison: "${brandName} vs ${competitorName}".\n\n`;

  prompt += `**CRITICAL: Use real data, specific examples, and research-backed claims. Avoid generic statements.**\n\n`;
  
  prompt += `**Purpose:** ${action.description}\n\n`;
  
  prompt += `**SEO Keyword Research (DataForSEO Real Data):**
${keywordContext || 'No keyword data available'}

**Primary Target Keyword:** ${primaryKeyword?.keyword || 'N/A'} 
- Search Volume: ${primaryKeyword?.searchVolume.toLocaleString() || 'N/A'} monthly searches
- Keyword Difficulty: ${primaryKeyword?.difficulty || 'N/A'}% (${primaryKeyword?.difficulty && primaryKeyword.difficulty >= 70 ? 'High competition' : primaryKeyword?.difficulty && primaryKeyword.difficulty >= 40 ? 'Medium competition' : 'Low competition'})
${primaryKeyword ? `- **Content Strategy:** Target this keyword naturally in H1, first paragraph, and 2-3 H2/H3 headings` : ''}\n\n`;
  
  prompt += `**Brand Performance Data (Real Metrics):**
- ${brandName}: 
  * AI Visibility Score: ${brandData.visibilityScore}% (${brandData.visibilityScore >= 80 ? 'Excellent' : brandData.visibilityScore >= 60 ? 'Good' : brandData.visibilityScore >= 40 ? 'Fair' : 'Needs Improvement'})
  * Sentiment Score: ${brandData.sentimentScore}/100 (${brandData.sentimentScore >= 80 ? 'Very Positive' : brandData.sentimentScore >= 60 ? 'Positive' : brandData.sentimentScore >= 40 ? 'Neutral' : 'Negative'})
  * Average Position: ${brandData.averagePosition || 'N/A'}
  * Mentions: ${brandData.mentions || 'N/A'}
${brandUrl ? `  * Website: ${brandUrl}` : ''}

${topCompetitor ? `- ${topCompetitor.name}:
  * AI Visibility Score: ${topCompetitor.visibilityScore}% (${topCompetitor.visibilityScore >= 80 ? 'Excellent' : topCompetitor.visibilityScore >= 60 ? 'Good' : topCompetitor.visibilityScore >= 40 ? 'Fair' : 'Needs Improvement'})
  * Sentiment Score: ${topCompetitor.sentimentScore}/100
  * Average Position: ${topCompetitor.averagePosition || 'N/A'}
  * Mentions: ${topCompetitor.mentions || 'N/A'}` : ''}\n\n`;

  prompt += `**Content Requirements (CRITICAL - Follow Exactly):**

1. **Structure & Length:**
   - Write 2500-3000 words (comprehensive, not generic)
   - Use clear H2/H3 headings with target keywords naturally integrated
   - Include a detailed table of contents at the start

2. **Specificity & Data (MOST IMPORTANT):**
   - Use REAL, SPECIFIC data points (not "typically" or "usually")
   - Include actual product model comparisons when possible
   - Reference specific features, specs, and real-world use cases
   - Cite specific pricing ranges with actual dollar amounts
   - Include concrete examples: "YETI Tundra 45 holds ice for 7 days" not "coolers hold ice for several days"
   - Add real user scenarios: "Best for 3-day camping trips" not "good for camping"

3. **Comparison Tables:**
   - Create detailed side-by-side comparison tables
   - Include: Features, Pricing, Dimensions, Weight, Ice Retention, Warranty, Best Use Cases
   - Use actual data, not generic statements

4. **Decision Framework:**
   - Create a "Best For" section with specific scenarios:
     * "Choose ${brandName} if you need [specific feature/use case]"
     * "Choose ${competitorName} if you prefer [specific alternative]"
   - Include a clear "Which is Better?" verdict with specific reasoning
   - Add a "Quick Decision Guide" with 3-5 key questions

5. **SEO Optimization:**
   - Naturally integrate primary keyword "${primaryKeyword?.keyword || `${brandName} vs ${competitorName}`}" in:
     * H1 title
     * First paragraph (within first 100 words)
     * 2-3 H2/H3 headings
     * Meta description
   - Use related keywords naturally throughout
   - Include semantic keywords and LSI terms

6. **Content Quality:**
   - Write in a helpful, authoritative tone
   - Include actionable insights and specific recommendations
   - Add real-world examples and use cases
   - Make it fair and balanced but highlight ${brandName}'s unique strengths
   - Include a compelling meta description (150-160 characters, includes primary keyword)

7. **Additional Sections:**
   - "Key Differences at a Glance" (bullet points)
   - "Detailed Feature Comparison" (with specific examples)
   - "Pricing Breakdown" (with actual price ranges)
   - "Real User Scenarios" (specific use cases)
   - "Final Verdict" (clear recommendation with reasoning)
   - "FAQ Section" (5-7 common questions with specific answers)

**Write the complete, polished comparison page now. Make it exceptional - the kind of content that makes readers say "wow, this is exactly what I needed!":`;

  // Prefer Anthropic for high-quality content generation
  const model = getProviderModel('anthropic') || getProviderModel('openai');
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
      maxTokens: 8000, // Increased for comprehensive content
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

  // Prefer Anthropic for high-quality content generation
  const model = getProviderModel('anthropic') || getProviderModel('openai');
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
      maxTokens: 4000, // Increased for comprehensive content
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
  const { action, brandName, brandData, seoData } = request;
  
  const primaryKeyword = seoData?.keywords?.[0];
  const visibilityStat = `${brandData.visibilityScore}% AI visibility`;
  const sentimentStat = `${brandData.sentimentScore}/100 sentiment score`;
  
  let prompt = `You are a social media expert creating clean, professional, data-driven social media content for ${brandName}.\n\n`;
  
  prompt += `**CRITICAL REQUIREMENTS:**
- Use ONLY standard ASCII characters and standard Unicode emojis (no special encoding)
- Write clean, readable text without any garbled characters
- Format posts clearly with proper line breaks
- Include specific stats, data points, and actionable CTAs
- Make each post valuable and shareable\n\n`;
  
  prompt += `**Action:** ${action.title}\n`;
  prompt += `**Description:** ${action.description}\n\n`;
  
  prompt += `**Brand Performance Stats (Use These in Posts):**
- AI Visibility: ${visibilityStat}
- Sentiment Score: ${sentimentStat}
- Primary Keyword: ${primaryKeyword?.keyword || 'N/A'} (${primaryKeyword?.searchVolume.toLocaleString() || 'N/A'} monthly searches)\n\n`;
  
  prompt += `**Content Requirements (CRITICAL - Follow Exactly):**

1. **Platform-Specific Format:**
   - **Twitter/X:** Create 3-4 posts, max 280 characters each (including hashtags)
   - **LinkedIn:** Create 2-3 posts, 150-300 words each, professional tone
   - **Facebook:** Create 2-3 posts, 100-200 words each, engaging and conversational

2. **Content Structure (Use This Exact Format):**
   For each platform, format like this:
   
   ## **Twitter/X:**
   **Post 1:**
   [Post content here - max 280 chars, include 2-3 hashtags at the end]
   
   **Post 2:**
   [Post content here]
   
   ## **LinkedIn:**
   **Post 1:**
   [Post content here - 150-300 words, professional tone, include 3-5 hashtags]
   
   ## **Facebook:**
   **Post 1:**
   [Post content here - 100-200 words, conversational, include 2-4 hashtags]

3. **Content Types (Mix These):**
   - Data-driven posts: Include specific stats like "${visibilityStat}" or "${sentimentStat}"
   - Educational posts: Share insights about ${action.title.toLowerCase()}
   - Engagement posts: Ask questions, encourage comments
   - Promotional posts: Highlight ${brandName}'s strengths (but make it valuable, not salesy)

4. **Each Post Must Include:**
   - Specific data point or statistic (use the brand performance stats above)
   - Clear value proposition or insight
   - Relevant hashtags (mix of branded, industry, and trending) - place at the end
   - Call-to-action (CTA) when appropriate: "Learn more: [link]", "Read the full comparison: [link]", "Share your thoughts below"
   - Use standard emojis sparingly (1-2 per post max): ✅ 📊 💪 🎯 🔥 📈 (use standard Unicode only)

5. **Content Quality:**
   - Make each post standalone valuable (not just promotional)
   - Include actionable insights or tips
   - Use numbers and specific data to build credibility
   - Write in a conversational, engaging tone
   - Avoid generic statements - be specific
   - NO garbled characters, NO encoding issues, NO special symbols that might break

6. **Formatting Rules:**
   - Use clean markdown formatting
   - Separate each post with clear line breaks
   - Use **bold** for post numbers only
   - Keep hashtags at the end of each post
   - Use standard line breaks (\\n) between sections
   - NO special characters that might cause encoding issues

**Write the complete social media content now. Use clean, standard text formatting. Make it exceptional - the kind of content that gets shared and drives engagement:`;

  // Prefer Anthropic for high-quality content generation
  const model = getProviderModel('anthropic') || getProviderModel('openai');
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
      maxTokens: 3000, // Increased for comprehensive social content
      temperature: 0.7, // Lower temperature for more consistent formatting
    });
    text = result.text;
    
    // Clean up any encoding issues or garbled characters
    text = cleanSocialMediaContent(text);
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
 * Clean social media content to remove encoding issues and garbled characters
 */
function cleanSocialMediaContent(content: string): string {
  // Remove specific garbled character patterns we've seen
  let cleaned = content
    // Remove garbled emoji patterns like "Ø=Ý%", "Ø=ÜÊ", "Ø<ß¯", "Ø=ÜG", "Ø=Þ—", etc.
    .replace(/Ø=[^\s\n]+/g, '')
    .replace(/Ø<[^\s\n]+/g, '')
    // Remove standalone garbled sequences
    .replace(/[ØÝÜÊßÞ][=<>][^\s\n]*/g, '')
    // Clean up broken sentences that start with garbled characters
    .replace(/^[ØÝÜÊßÞ][^\w]*/gm, '')
    // Remove any remaining control characters that might cause issues
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    // Clean up multiple spaces (but keep intentional spacing)
    .replace(/[ \t]{3,}/g, ' ')
    // Clean up excessive line breaks
    .replace(/\n{4,}/g, '\n\n\n')
    // Fix broken markdown formatting
    .replace(/\*\*(\*+)\*\*/g, '**$1**')
    // Ensure proper spacing around hashtags
    .replace(/\s+#(\w+)/g, ' #$1');
  
  // Ensure proper section headers
  cleaned = cleaned
    .replace(/##\s*\*\*Twitter\/X:\*\*/gi, '## **Twitter/X:**')
    .replace(/##\s*\*\*LinkedIn:\*\*/gi, '## **LinkedIn:**')
    .replace(/##\s*\*\*Facebook:\*\*/gi, '## **Facebook:**')
    // Fix post numbering
    .replace(/\*\*Post\s+(\d+):\*\*/gi, '**Post $1:**');
  
  // Remove any lines that are just garbled characters
  cleaned = cleaned
    .split('\n')
    .filter(line => {
      // Keep lines that have actual content (letters, numbers, or common punctuation)
      const hasContent = /[a-zA-Z0-9]/.test(line);
      // Remove lines that are mostly special characters
      const isGarbled = /^[ØÝÜÊßÞ<>=%]+$/.test(line.trim());
      return hasContent && !isGarbled;
    })
    .join('\n');
  
  return cleaned.trim();
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
