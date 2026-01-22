/**
 * Content Generator
 * Generates finished, ready-to-use content based on Boost Actions
 */

import { generateText } from 'ai';
import { getProviderModel } from './provider-config';
import { ActionItem } from './strategic-insights';
import { CompetitorRanking, AIResponse } from './types';

export interface GeneratedContent {
  type: 'blog' | 'comparison' | 'faq' | 'landing-page' | 'technical';
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
   - Use REAL, SPECIFIC data points from the brand analysis provided above
   - Include actual statistics, percentages, and numbers from the brand metrics
   - Reference specific features, benefits, and use cases
   - Add concrete examples: "83.3% visibility score" not "high visibility"
   - Include real-world scenarios and practical applications
   - **CRITICAL: DO NOT fabricate or invent research studies, citations, or statistics**
   - **DO NOT cite specific studies like "BrightEdge 2024 Study" or "Stanford 2024 research" unless you have verified access to them**
   - If referencing industry trends, use generic phrasing like "Industry research indicates..." or "Studies show..." without naming specific institutions
   - Focus on the real brand data provided above rather than invented research

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
   - **Meta Description:** MUST include a complete, compelling meta description (150-160 characters, includes primary keyword) at the start of your response in this format: "Meta: [your meta description here]"
   - Key takeaways box or summary section
   - FAQ section (3-5 questions related to the topic)
   - Call-to-action at the end
   - Add a disclaimer at the end: "Note: Performance metrics and statistics are based on current brand analysis data. Specific numbers may vary based on market conditions and implementation."

**IMPORTANT FORMATTING:**
- Start your response with: "Meta: [150-160 character meta description including primary keyword]"
- Then write the full blog post content
- End with the disclaimer mentioned above

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
  
  // Try to extract meta description from the start (new format)
  let metaDescription = text.match(/^Meta:\s*(.+?)(?:\n|$)/im)?.[1]?.trim();
  
  // Remove "Meta:" prefix if it was included
  if (metaDescription?.startsWith('Meta:')) {
    metaDescription = metaDescription.replace(/^Meta:\s*/i, '').trim();
  }
  
  // If not found, try other patterns
  if (!metaDescription) {
    metaDescription = extractMetaDescription(text);
  }
  
  // Fallback to generated description
  if (!metaDescription || metaDescription.length < 50) {
    metaDescription = `Learn about ${action.title.toLowerCase()} for ${brandName}. ${action.description.substring(0, 100)}...`;
    // Ensure it's 150-160 characters
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + '...';
    }
  }
  
  // Clean up the content to remove the Meta: line if present
  text = text.replace(/^Meta:\s*.+?(?:\n|$)/im, '').trim();

  // Generate VALUABLE infographics automatically using AI-powered insight identification
  let infographics: GeneratedContent['infographics'] = [];
  try {
    const { generateInfographicsFromTemplate } = await import('./infographic-renderer');
    
    // Use AI to identify the MOST VALUABLE insights from the blog content
    console.log('🎯 Identifying valuable insights for infographics...');
    const insightModel = getProviderModel('anthropic') || getProviderModel('openai');
    
    if (insightModel) {
      const insightPrompt = `Analyze this blog post and identify the 3 MOST VALUABLE insights that would make excellent infographics. Each insight must:
1. Be a key statistic or data point (percentage, number, ranking, etc.)
2. Tell a clear, valuable story
3. Be actionable or provide real value to readers
4. Be shareable and scroll-stopping

**Blog Content:**
${text.substring(0, 4000)}${text.length > 4000 ? '...' : ''}

**Blog Topic:** ${title}

Return a JSON array with exactly 3 insights. Each insight should have:
{
  "theme": "The Problem" | "The Impact" | "The Solution" | "Key Statistic" | "The Opportunity",
  "title": "Compelling headline (8-12 words max) that highlights the insight",
  "description": "One sentence explaining the value/impact (15-25 words)",
  "primaryMetric": "Main statistic (e.g., '40%', 'Top 3', '#1')",
  "secondaryMetric": "Supporting stat or context",
  "tertiaryMetric": "Additional supporting data",
  "whyValuable": "Why this insight matters to readers (one sentence)"
}

Focus on insights that:
- Are surprising or counterintuitive
- Show clear impact or opportunity
- Are actionable or provide clear value
- Would make people stop scrolling

Return ONLY valid JSON array, no markdown, no explanations.`;

      try {
        const { generateObject } = await import('ai');
        const { z } = await import('zod');
        
        const InsightSchema = z.object({
          theme: z.string(),
          title: z.string(),
          description: z.string(),
          primaryMetric: z.string(),
          secondaryMetric: z.string(),
          tertiaryMetric: z.string(),
          whyValuable: z.string(),
        });

        // Wrap array in object schema for Anthropic compatibility
        const InsightsResponseSchema = z.object({
          insights: z.array(InsightSchema).length(3),
        });

        // Enhanced prompt with clearer instructions
        const enhancedPrompt = `${insightPrompt}

IMPORTANT: Return a JSON object with this exact structure:
{
  "insights": [
    {
      "theme": "...",
      "title": "...",
      "description": "...",
      "primaryMetric": "...",
      "secondaryMetric": "...",
      "tertiaryMetric": "...",
      "whyValuable": "..."
    },
    // ... 2 more insights
  ]
}

Return ONLY the JSON object, no markdown, no code blocks, no explanations.`;

        const insightsResult = await generateObject({
          model: insightModel,
          schema: InsightsResponseSchema,
          prompt: enhancedPrompt,
          temperature: 0.7,
          maxRetries: 2, // Retry on failure
        });

        const insights = insightsResult.object?.insights || [];
        if (insights.length > 0) {
          console.log(`✅ AI identified ${insights.length} valuable insight(s)`);
          
          const infographicData = insights.map((insight, idx) => {
            const placement =
              idx === 0 ? ({ section: 'start' as const, position: 0 } as const) :
              idx === 1 ? ({ section: 'middle' as const, position: -1 } as const) :
              ({ section: 'end' as const, position: 999 } as const);

            console.log(`   Insight ${idx + 1}: ${insight.title} (${insight.theme})`);

            return {
              title: insight.title,
              description: insight.description,
              dataPoints: [insight.primaryMetric, insight.secondaryMetric, insight.tertiaryMetric].filter(Boolean),
              metrics: {
                primary: insight.primaryMetric,
                secondary: insight.secondaryMetric,
                tertiary: insight.tertiaryMetric,
              },
              ...placement,
            };
          });

          // Generate infographics using HTML template renderer
          infographics = await generateInfographicsFromTemplate(infographicData);
          console.log(`✅ Generated ${infographics.length} valuable infographic(s) for blog post`);
        } else {
          console.warn('[Content Generator] AI returned empty insights array, falling back to stat extraction');
          throw new Error('Empty insights array');
        }
      } catch (aiError) {
        console.warn('[Content Generator] AI insight identification failed, falling back to stat extraction:', aiError);
        // Fallback to simple stat extraction if AI fails
        const statPatterns = [
          /(\d+%)/g,
          /(\d+\.\d+%)/g,
          /(top \d+)/gi,
          /(#\d+)/g,
        ];

        const statsRaw: string[] = [];
        for (const pattern of statPatterns) {
          const matches = text.match(pattern);
          if (matches) {
            statsRaw.push(...matches);
          }
        }

        const stats = Array.from(new Set(statsRaw.map(s => s.trim()))).filter(Boolean);

        if (stats.length >= 3) {
          const infographicData = [
            {
              title: title,
              description: metaDescription || action.description,
              dataPoints: stats.slice(0, 3),
              metrics: {
                primary: stats[0],
                secondary: stats[1],
                tertiary: stats[2],
              },
              section: 'start' as const,
              position: 0,
            },
          ];

          infographics = await generateInfographicsFromTemplate(infographicData);
          console.log(`✅ Generated ${infographics.length} infographic(s) using fallback method`);
        }
      }
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
   - **Meta Description:** MUST include a complete meta description (150-160 characters) at the start: "Meta: [your meta description here]"

2. **Specificity & Data (MOST IMPORTANT):**
   - Use REAL, SPECIFIC data points from the brand analysis provided above
   - Include actual product model comparisons when possible
   - Reference specific features, specs, and real-world use cases
   - **CRITICAL: DO NOT fabricate specific test results, studies, or research citations**
   - **DO NOT cite specific publications like "Outdoor Life magazine" or specific test results unless you have verified access**
   - If referencing performance data, use the brand metrics provided above or use generic phrasing like "Independent testing shows..." or "Performance data indicates..."
   - Include concrete examples based on the real brand data provided
   - Add real user scenarios based on typical use cases

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
   - "Pricing Breakdown" (with estimated price ranges - note if data is estimated)
   - "Real User Scenarios" (specific use cases)
   - "Final Verdict" (clear recommendation with reasoning)
   - "FAQ Section" (5-7 common questions with specific answers)
   - Add a disclaimer: "Note: Pricing, specifications, and performance data are based on available information and may vary. Always verify current details directly with manufacturers."

**IMPORTANT FORMATTING:**
- Start your response with: "Meta: [150-160 character meta description including primary keyword]"
- Then write the full comparison content
- End with the disclaimer mentioned above

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
  
  // Try to extract meta description from the start (new format)
  let metaDescription = text.match(/^Meta:\s*(.+?)(?:\n|$)/im)?.[1]?.trim();
  
  // Remove "Meta:" prefix if it was included
  if (metaDescription?.startsWith('Meta:')) {
    metaDescription = metaDescription.replace(/^Meta:\s*/i, '').trim();
  }
  
  // Fallback to generated description
  if (!metaDescription || metaDescription.length < 50) {
    metaDescription = `Compare ${brandName} and ${competitorName}. See features, pricing, pros, cons, and which is better for your needs.`;
    // Ensure it's 150-160 characters
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + '...';
    }
  }
  
  // Clean up the content to remove the Meta: line if present
  text = text.replace(/^Meta:\s*.+?(?:\n|$)/im, '').trim();

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
  const { action, brandName, brandData, competitors, brandUrl, seoData, context } = request;
  
  // Build comprehensive SEO data context
  const primaryKeyword = seoData?.keywords?.[0];
  const keywordContext = seoData?.keywords?.slice(0, 10).map(k => {
    const difficulty = k.difficulty >= 70 ? 'high' : k.difficulty >= 40 ? 'medium' : 'low';
    return `- "${k.keyword}": ${k.searchVolume.toLocaleString()} monthly searches, ${difficulty} difficulty (${k.difficulty}%)`;
  }).join('\n') || '';
  
  let prompt = `You are an expert content writer creating a comprehensive, data-driven FAQ page for ${brandName}.\n\n`;
  
  prompt += `**CRITICAL: Use real data, specific examples, and research-backed claims. Avoid generic statements.**\n\n`;
  
  prompt += `**Topic:** ${action.title}\n`;
  prompt += `**Context:** ${action.description}\n\n`;
  
  prompt += `**SEO Keyword Research (DataForSEO Real Data):**
${keywordContext || 'No keyword data available'}

**Primary Target Keyword:** ${primaryKeyword?.keyword || 'N/A'}
- Search Volume: ${primaryKeyword?.searchVolume.toLocaleString() || 'N/A'} monthly searches
- Keyword Difficulty: ${primaryKeyword?.difficulty || 'N/A'}% (${primaryKeyword?.difficulty && primaryKeyword.difficulty >= 70 ? 'High competition' : primaryKeyword?.difficulty && primaryKeyword.difficulty >= 40 ? 'Medium competition' : 'Low competition'})
${primaryKeyword ? `- **Content Strategy:** Target this keyword naturally in H1, questions, and answers` : ''}\n\n`;
  
  if (context?.insights && context.insights.length > 0) {
    prompt += `**Key Insights from Analysis:**
${context.insights.slice(0, 5).map(i => `- ${i}`).join('\n')}\n\n`;
  }
  
  if (context?.missedTopics && context.missedTopics.length > 0) {
    prompt += `**Common Questions to Address (Based on User Queries):**
${context.missedTopics.slice(0, 10).map(t => `- ${t}`).join('\n')}\n\n`;
  }
  
  prompt += `**Brand Performance Data (Real Metrics - Use These Specific Numbers):**
- Brand: ${brandName}
- AI Visibility Score: ${brandData.visibilityScore}% (${brandData.visibilityScore >= 80 ? 'Excellent' : brandData.visibilityScore >= 60 ? 'Good' : brandData.visibilityScore >= 40 ? 'Fair' : 'Needs Improvement'})
- Sentiment Score: ${brandData.sentimentScore}/100 (${brandData.sentimentScore >= 80 ? 'Very Positive' : brandData.sentimentScore >= 60 ? 'Positive' : brandData.sentimentScore >= 40 ? 'Neutral' : 'Negative'})
- Average Position: ${brandData.averagePosition || 'N/A'}
- Mentions: ${brandData.mentions || 'N/A'}
${brandUrl ? `- Website: ${brandUrl}` : ''}

${competitors.length > 0 ? `**Competitive Context:** ${competitors.slice(0, 3).map(c => `${c.name} (${c.visibilityScore}% visibility, ${c.sentimentScore}/100 sentiment)`).join(', ')}` : ''}\n\n`;
  
  prompt += `**Content Requirements (CRITICAL - Follow Exactly):**

1. **Structure & Length:**
   - Write 10-15 comprehensive Q&A pairs
   - Each answer should be 100-200 words (detailed, not generic)
   - Use Schema.org FAQPage structured data format in your response
   - **Meta Description:** MUST include a complete meta description (150-160 characters) at the start: "Meta: [your meta description here]"

2. **Specificity & Data (MOST IMPORTANT):**
   - Use REAL, SPECIFIC data points from the brand analysis provided above
   - Reference the actual visibility score (${brandData.visibilityScore}%), sentiment score (${brandData.sentimentScore}/100), and other metrics
   - Include specific features, benefits, and use cases for ${brandName}
   - Add concrete examples based on the real brand data provided
   - **CRITICAL: DO NOT fabricate specific research studies, citations, or statistics**
   - **DO NOT cite specific publications or test results unless you have verified access**
   - Focus on real brand information and data provided above

3. **Question Coverage:**
   - Cover common questions about features, pricing, use cases, troubleshooting
   - Address questions related to the ${brandData.visibilityScore}% visibility score and how to improve it
   - Include questions about ${brandName}'s competitive position
   - Answer questions about implementation, setup, and best practices
   - Address common concerns and objections

4. **SEO Optimization:**
   - Naturally integrate primary keyword "${primaryKeyword?.keyword || `${brandName} FAQ`}" in:
     * H1 title
     * First question or introduction
     * Multiple questions and answers
     * Meta description
   - Use related keywords naturally throughout
   - Include semantic variations of target keywords
   - Optimize for featured snippets with clear, concise answers

5. **Content Quality:**
   - Write in a helpful, authoritative tone
   - Include actionable insights and specific recommendations
   - Add real-world examples and use cases
   - Make answers comprehensive and valuable
   - Use the brand metrics to provide context in answers

6. **Additional Elements:**
   - Compelling meta description (150-160 characters, includes primary keyword)
   - Schema.org FAQPage structured data format
   - Clear, scannable question formatting
   - Comprehensive, detailed answers

**IMPORTANT FORMATTING:**
- Start your response with: "Meta: [150-160 character meta description including primary keyword]"
- Then write the full FAQ content with Schema.org FAQPage format
- Use clear Q&A structure

**Write the complete, polished FAQ page now. Make it exceptional - the kind of content that makes readers say "wow, this answered all my questions!":`;

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
  
  // Try to extract meta description from the start (new format)
  let metaDescription = text.match(/^Meta:\s*(.+?)(?:\n|$)/im)?.[1]?.trim();
  
  // Remove "Meta:" prefix if it was included
  if (metaDescription?.startsWith('Meta:')) {
    metaDescription = metaDescription.replace(/^Meta:\s*/i, '').trim();
  }
  
  // Fallback to generated description
  if (!metaDescription || metaDescription.length < 50) {
    metaDescription = `Frequently asked questions about ${brandName}. Get answers about features, pricing, and more.`;
    // Ensure it's 150-160 characters
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + '...';
    }
  }
  
  // Clean up the content to remove the Meta: line if present
  text = text.replace(/^Meta:\s*.+?(?:\n|$)/im, '').trim();

  return {
    type: 'faq',
    title,
    content: text,
    metaDescription,
    keywords: seoData?.keywords?.slice(0, 5).map(k => k.keyword) || [`${brandName} FAQ`, `${brandName} questions`, `how to use ${brandName}`],
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
  const { action, brandName, brandData, competitors, brandUrl, seoData, context } = request;
  
  // Build comprehensive SEO data context
  const primaryKeyword = seoData?.keywords?.[0];
  const keywordContext = seoData?.keywords?.slice(0, 10).map(k => {
    const difficulty = k.difficulty >= 70 ? 'high' : k.difficulty >= 40 ? 'medium' : 'low';
    return `- "${k.keyword}": ${k.searchVolume.toLocaleString()} monthly searches, ${difficulty} difficulty (${k.difficulty}%)`;
  }).join('\n') || '';
  
  let prompt = `You are an expert content writer creating a comprehensive, data-driven landing page for ${brandName}.\n\n`;
  
  prompt += `**CRITICAL: Use real data, specific examples, and research-backed claims. Avoid generic statements.**\n\n`;
  
  prompt += `**Goal:** ${action.title}\n`;
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
  
  prompt += `**Brand Performance Data (Real Metrics - Use These Specific Numbers):**
- Brand: ${brandName}
- AI Visibility Score: ${brandData.visibilityScore}% (${brandData.visibilityScore >= 80 ? 'Excellent' : brandData.visibilityScore >= 60 ? 'Good' : brandData.visibilityScore >= 40 ? 'Fair' : 'Needs Improvement'})
- Sentiment Score: ${brandData.sentimentScore}/100 (${brandData.sentimentScore >= 80 ? 'Very Positive' : brandData.sentimentScore >= 60 ? 'Positive' : brandData.sentimentScore >= 40 ? 'Neutral' : 'Negative'})
- Average Position: ${brandData.averagePosition || 'N/A'}
- Mentions: ${brandData.mentions || 'N/A'}
${brandUrl ? `- Website: ${brandUrl}` : ''}

${competitors.length > 0 ? `**Competitive Context:** ${competitors.slice(0, 3).map(c => `${c.name} (${c.visibilityScore}% visibility, ${c.sentimentScore}/100 sentiment)`).join(', ')}` : ''}\n\n`;
  
  prompt += `**Content Requirements - Write a comprehensive landing page:**

**Start with:** "Meta: [150-160 character meta description including primary keyword]"

**Then write the complete landing page with these sections (write each section in full detail):**

1. **Hero Section** (200-250 words)
   - Compelling headline with primary keyword "${primaryKeyword?.keyword || action.title}"
   - Powerful subheadline highlighting ${brandName}'s ${brandData.visibilityScore}% visibility and ${brandData.sentimentScore}/100 sentiment
   - Clear value proposition
   - Strong opening hook

2. **Why Choose ${brandName}?** (300-400 words)
   - Key differentiators
   - Market leadership position (${brandData.visibilityScore}% visibility vs competitors)
   - Customer satisfaction (${brandData.sentimentScore}/100 sentiment score)
   - Unique value propositions
   - Real benefits and outcomes

3. **Features & Capabilities** (350-450 words)
   - Detailed feature descriptions
   - How features solve customer problems
   - Technical specifications where relevant
   - Innovation highlights
   - Quality indicators

4. **Benefits & Outcomes** (300-400 words)
   - What customers achieve with ${brandName}
   - Real-world results and success stories
   - ROI and value proposition
   - Long-term advantages
   - Competitive benefits

5. **Social Proof & Trust Signals** (200-250 words)
   - ${brandData.sentimentScore}/100 sentiment score as proof of satisfaction
   - ${brandData.visibilityScore}% AI visibility as proof of authority
   - Market position and recognition
   - Customer testimonials (if applicable)
   - Industry recognition

6. **Use Cases & Applications** (250-300 words)
   - Specific scenarios where ${brandName} excels
   - Target audience applications
   - Real-world examples
   - Industry-specific use cases

7. **Competitive Advantage** (200-250 words)
   - How ${brandName} compares to competitors
   - Unique positioning
   - Why choose ${brandName} over alternatives
   - Market differentiation

8. **Call-to-Action Section** (150-200 words)
   - Clear, compelling CTA
   - Next steps for prospects
   - How to get started
   - Contact or conversion options

9. **Conclusion** (100-150 words)
   - Summary of key points
   - Final value proposition
   - Strong closing statement

**End with:** A final compelling call-to-action

**Writing Guidelines:**
- Write each section in full detail with specific examples
- Use the real data: ${brandData.visibilityScore}% visibility, ${brandData.sentimentScore}/100 sentiment, ${brandData.averagePosition || 'N/A'} average position
- Reference ${brandName} specifically throughout
- Write in a compelling, conversion-focused tone
- Include the primary keyword "${primaryKeyword?.keyword || action.title}" naturally in H1, first paragraph, and 2-3 headings
- Make it persuasive but authentic
- Each section should be comprehensive and valuable

**Write the complete landing page now, covering all sections in detail:**`;

  // Prefer Anthropic for long-form landing pages (handles length better)
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
      maxTokens: 8000, // Increased for comprehensive landing pages (1500-2000 words)
      temperature: 0.7,
    });
    text = result.text;
  } catch (error) {
    console.error('[Content Generator] Error generating landing page text:', error);
    throw new Error(`Failed to generate landing page: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const title = action.title;
  
  // Try to extract meta description from the start (new format)
  let metaDescription = text.match(/^Meta:\s*(.+?)(?:\n|$)/im)?.[1]?.trim();
  
  // Remove "Meta:" prefix if it was included
  if (metaDescription?.startsWith('Meta:')) {
    metaDescription = metaDescription.replace(/^Meta:\s*/i, '').trim();
  }
  
  // Fallback to generated description
  if (!metaDescription || metaDescription.length < 50) {
    metaDescription = action.description.substring(0, 140);
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + '...';
    }
  }
  
  // Clean up the content to remove the Meta: line if present
  text = text.replace(/^Meta:\s*.+?(?:\n|$)/im, '').trim();

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
 * Generate technical guide
 */
async function generateTechnicalGuide(
  request: ContentGenerationRequest
): Promise<GeneratedContent> {
  const { action, brandName, brandData, competitors, brandUrl, seoData, context } = request;
  
  // Build comprehensive SEO data context
  const primaryKeyword = seoData?.keywords?.[0];
  const keywordContext = seoData?.keywords?.slice(0, 10).map(k => {
    const difficulty = k.difficulty >= 70 ? 'high' : k.difficulty >= 40 ? 'medium' : 'low';
    return `- "${k.keyword}": ${k.searchVolume.toLocaleString()} monthly searches, ${difficulty} difficulty (${k.difficulty}%)`;
  }).join('\n') || '';
  
  let prompt = `You are an expert technical SEO writer creating a comprehensive, data-driven technical implementation guide for ${brandName}.\n\n`;
  
  prompt += `**CRITICAL: Use real data, specific examples, and actionable implementation steps. Avoid generic statements.**\n\n`;
  
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
  
  prompt += `**Brand Performance Data (Real Metrics - Use These Specific Numbers):**
- Brand: ${brandName}
- AI Visibility Score: ${brandData.visibilityScore}% (${brandData.visibilityScore >= 80 ? 'Excellent' : brandData.visibilityScore >= 60 ? 'Good' : brandData.visibilityScore >= 40 ? 'Fair' : 'Needs Improvement'})
- Sentiment Score: ${brandData.sentimentScore}/100 (${brandData.sentimentScore >= 80 ? 'Very Positive' : brandData.sentimentScore >= 60 ? 'Positive' : brandData.sentimentScore >= 40 ? 'Neutral' : 'Negative'})
- Average Position: ${brandData.averagePosition || 'N/A'}
- Mentions: ${brandData.mentions || 'N/A'}
${brandUrl ? `- Website: ${brandUrl}` : ''}

${competitors.length > 0 ? `**Competitive Context:** ${competitors.slice(0, 3).map(c => `${c.name} (${c.visibilityScore}% visibility, ${c.sentimentScore}/100 sentiment)`).join(', ')}` : ''}\n\n`;
  
  prompt += `**Content Requirements - Write a comprehensive technical guide:**

**Start with:** "Meta: [150-160 character meta description including primary keyword]"

**Then write the complete guide with these sections (write each section in full detail):**

1. **Table of Contents** - List all sections with anchor links

2. **Current Status Analysis** (200-300 words)
   - Analyze ${brandName}'s current ${brandData.visibilityScore}% visibility score
   - Discuss the ${brandData.sentimentScore}/100 sentiment score
   - Explain what these metrics mean for technical SEO
   - Identify specific improvement opportunities

3. **Step-by-Step Implementation: Structured Data** (400-500 words)
   - Detailed explanation of Schema.org markup
   - Multiple code examples (JSON-LD for Organization, Product, Article)
   - Specific examples for ${brandName}'s website
   - Implementation checklist
   - Common mistakes to avoid

4. **Step-by-Step Implementation: Semantic HTML** (300-400 words)
   - Explanation of semantic HTML5 elements
   - Before/after code examples
   - Best practices for ${brandName}
   - Accessibility considerations
   - Validation methods

5. **Step-by-Step Implementation: Meta Descriptions** (250-350 words)
   - How to write effective meta descriptions
   - Examples for different page types
   - Optimization tips
   - Tools for bulk generation

6. **Step-by-Step Implementation: Content Hierarchy** (300-400 words)
   - Proper heading structure (H1, H2, H3)
   - Content organization best practices
   - Examples of good vs. bad hierarchy
   - Impact on AI comprehension

7. **Validation and Testing** (250-300 words)
   - Tools for testing structured data
   - HTML validation methods
   - SEO audit checklists
   - How to verify improvements

8. **Expected Results** (200-250 words)
   - What to expect after implementation
   - Timeline for seeing improvements
   - How the ${brandData.visibilityScore}% score can improve
   - ROI considerations

9. **Troubleshooting Common Issues** (300-400 words)
   - Common structured data errors and fixes
   - HTML validation problems
   - Meta description issues
   - Content hierarchy mistakes
   - Solutions for each issue

10. **FAQ Section** (250-300 words)
    - 5-7 common technical questions
    - Detailed answers with examples
    - Links to resources

11. **Conclusion and Next Steps** (150-200 words)
    - Summary of key points
    - Action items
    - Resources for further learning

**End with:** "Note: Performance metrics and statistics are based on current brand analysis data. Specific numbers may vary based on market conditions and implementation."

**Writing Guidelines:**
- Write each section in full detail with examples
- Use code blocks for all technical examples
- Include specific references to ${brandName} throughout
- Write naturally and comprehensively - aim for thorough coverage
- Each section should be detailed enough to be actionable
- Use the primary keyword "${primaryKeyword?.keyword || action.title}" naturally throughout
- Write in an authoritative, technical tone
- Include real data: ${brandData.visibilityScore}% visibility, ${brandData.sentimentScore}/100 sentiment

**Write the complete guide now, covering all sections in detail:**`;

  // Prefer Anthropic for long-form technical content (handles length better)
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
      maxTokens: 8000, // Increased for comprehensive technical guides (2000-2500 words)
      temperature: 0.7,
    });
    text = result.text;
  } catch (error) {
    console.error('[Content Generator] Error generating technical guide text:', error);
    throw new Error(`Failed to generate technical guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Try to extract meta description from the start (new format)
  let metaDescription = text.match(/^Meta:\s*(.+?)(?:\n|$)/im)?.[1]?.trim();
  
  // Remove "Meta:" prefix if it was included
  if (metaDescription?.startsWith('Meta:')) {
    metaDescription = metaDescription.replace(/^Meta:\s*/i, '').trim();
  }
  
  // Fallback to generated description
  if (!metaDescription || metaDescription.length < 50) {
    metaDescription = `Technical guide: ${action.description.substring(0, 140)}`;
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + '...';
    }
  }
  
  // Clean up the content to remove the Meta: line if present
  text = text.replace(/^Meta:\s*.+?(?:\n|$)/im, '').trim();

  return {
    type: 'technical',
    title: action.title,
    content: text,
    metaDescription,
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
