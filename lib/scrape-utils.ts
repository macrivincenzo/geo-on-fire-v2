import { generateObject } from 'ai';
import { z } from 'zod';
import { Company } from './types';
import FirecrawlApp from '@mendable/firecrawl-js';
import { getConfiguredProviders, getProviderModel } from './provider-config';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const CompanyInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  industry: z.string(),
  mainProducts: z.array(z.string()),
  competitors: z.array(z.string()).optional(),
});

// Helper function to extract images from HTML content
function extractImagesFromContent(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  const urlObj = new URL(baseUrl);
  const baseOrigin = urlObj.origin;
  
  // Extract from img tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src && !src.startsWith('data:')) {
      // Convert relative URLs to absolute
      try {
        const absoluteUrl = src.startsWith('http') ? src : new URL(src, baseOrigin).href;
        images.push(absoluteUrl);
      } catch {
        // Skip invalid URLs
      }
    }
  }
  
  // Extract from meta tags (og:image, twitter:image, etc.)
  const metaRegex = /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image|image)["'][^>]+content=["']([^"']+)["']/gi;
  while ((match = metaRegex.exec(html)) !== null) {
    const content = match[1];
    if (content && !content.startsWith('data:')) {
      try {
        const absoluteUrl = content.startsWith('http') ? content : new URL(content, baseOrigin).href;
        images.push(absoluteUrl);
      } catch {
        // Skip invalid URLs
      }
    }
  }
  
  // Extract from link tags (rel="image_src")
  const linkRegex = /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (href && !href.startsWith('data:')) {
      try {
        const absoluteUrl = href.startsWith('http') ? href : new URL(href, baseOrigin).href;
        images.push(absoluteUrl);
      } catch {
        // Skip invalid URLs
      }
    }
  }
  
  return images;
}

// Helper function to find logo from common paths
function tryCommonLogoPaths(baseUrl: string): string[] {
  const urlObj = new URL(baseUrl);
  const baseOrigin = urlObj.origin;
  const commonPaths = [
    '/logo.png',
    '/logo.svg',
    '/logo.jpg',
    '/logo.jpeg',
    '/images/logo.png',
    '/images/logo.svg',
    '/assets/logo.png',
    '/assets/logo.svg',
    '/static/logo.png',
    '/static/logo.svg',
    '/img/logo.png',
    '/img/logo.svg',
  ];
  
  return commonPaths.map(path => `${baseOrigin}${path}`);
}

export async function scrapeCompanyInfo(url: string, maxAge?: number): Promise<Company> {
  try {
    // Ensure URL has protocol
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    
    // Default to 1 week cache if not specified
    const cacheAge = maxAge ? Math.floor(maxAge / 1000) : 604800; // 1 week in seconds
    
    // Request both markdown and HTML for better image extraction
    const response = await firecrawl.scrapeUrl(normalizedUrl, {
      formats: ['markdown', 'html'],  // Request HTML for image extraction
      maxAge: cacheAge,
    });
    if (!response.success) {
      throw new Error(response.error);
    }
    const html = response.markdown;
    const htmlContent = response.html || '';  // Get HTML content for image extraction
    const metadata = response.metadata;
    

    // Use AI to extract structured information - use first available provider
    const configuredProviders = getConfiguredProviders();
    if (configuredProviders.length === 0) {
      throw new Error('No AI providers configured and enabled for content extraction');
    }
    
    // Use the first available provider with a fast model
    const provider = configuredProviders[0];
    const model = getProviderModel(provider.id, provider.models.find(m => m.name.toLowerCase().includes('mini') || m.name.toLowerCase().includes('flash'))?.id || provider.defaultModel);
    if (!model) {
      throw new Error(`${provider.name} model not available`);
    }
    
    const { object } = await generateObject({
      model,
      schema: CompanyInfoSchema,
      prompt: `Extract company information from this website content:
      
      URL: ${normalizedUrl}
      Content: ${html}
      
      Extract the company name, a brief description, relevant keywords, and identify the PRIMARY industry category. 
      
      Industry detection rules (check in this order):
      - If the company offers brand monitoring, brand tracking, brand visibility, AI visibility monitoring, social listening, mention tracking, categorize as "brand monitoring"
      - If the company makes coolers, drinkware, outdoor equipment, camping gear, categorize as "outdoor gear"
      - If the company offers web scraping, crawling, data extraction, or HTML parsing tools/services, categorize as "web scraping"
      - If the company primarily provides AI/ML models or services (builds AI models like GPT, Claude, LLMs), categorize as "AI platform provider"
      - If the company offers hosting, deployment, or cloud infrastructure, categorize as "deployment"
      - If the company is an e-commerce platform or online store builder, categorize as "e-commerce platform"
      - If the company sells physical products directly to consumers (clothing, accessories, etc.), categorize as "direct-to-consumer brand"
      - If the company is in fashion/apparel/underwear/clothing, categorize as "apparel & fashion"
      - If the company provides software tools or APIs, categorize as "developer tools"
      - If the company is a marketplace or aggregator, categorize as "marketplace"
      - For other B2B software, use "SaaS"
      - For other consumer products, use "consumer goods"
      
      IMPORTANT: 
      1. For mainProducts, list the ACTUAL PRODUCTS (e.g., "coolers", "tumblers", "drinkware") not product categories
      2. For competitors, extract FULL COMPANY NAMES (e.g., "RTIC", "IGLOO", "Coleman") not just initials
      3. Focus on what the company MAKES/SELLS, not what goes IN their products (e.g., Yeti makes coolers, not beverages)
      4. Differentiate between "brand monitoring" (tools that track brand visibility) and "AI platform provider" (companies that build AI models)`,
    });

    // Extract logo/image URL - comprehensive multi-source approach
    const urlObj = new URL(normalizedUrl);
    const domain = urlObj.hostname.replace('www.', '');
    
    // Priority 1: Metadata fields (most reliable)
    let logoUrl = 
      metadata?.ogImage ||           // Open Graph image (best quality, most common)
      metadata?.image ||             // Generic image metadata
      metadata?.logo ||              // Direct logo field
      metadata?.twitterImage ||      // Twitter card image
      metadata?.twitterCard ||       // Twitter card (alternative)
      undefined;
    
    // Priority 2: Extract from HTML content if metadata didn't work
    if (!logoUrl && htmlContent) {
      const extractedImages = extractImagesFromContent(htmlContent, normalizedUrl);
      
      // Filter for likely logo images (prioritize images with "logo" in path/name)
      const logoCandidates = extractedImages.filter(img => {
        const imgLower = img.toLowerCase();
        return imgLower.includes('logo') || 
               imgLower.includes('brand') ||
               imgLower.includes('icon') ||
               imgLower.includes('header');
      });
      
      // If we found logo candidates, use the first one
      // Otherwise, try the first large image (likely hero/header image)
      if (logoCandidates.length > 0) {
        logoUrl = logoCandidates[0];
      } else if (extractedImages.length > 0) {
        // Use first image as fallback (often the main image)
        logoUrl = extractedImages[0];
      }
    }
    
    // Priority 3: Try common logo paths (as last resort before favicon)
    // Note: We don't actually fetch these here to avoid extra requests
    // The frontend can try these if needed
    
    // Try to get a high-quality favicon from various sources
    const faviconUrl = metadata?.favicon || 
                      `https://www.google.com/s2/favicons?domain=${domain}&sz=128` ||
                      `${urlObj.origin}/favicon.ico`;
    
    return {
      id: crypto.randomUUID(),
      url: normalizedUrl,
      name: object.name,
      description: object.description,
      industry: object.industry,
      logo: logoUrl,  // Use comprehensive logo extraction
      favicon: faviconUrl,
      scraped: true,
      scrapedData: {
        title: object.name,
        description: object.description,
        keywords: object.keywords,
        mainContent: html || '',
        mainProducts: object.mainProducts,
        competitors: object.competitors,
        ogImage: logoUrl,  // Store the best available image
        favicon: faviconUrl,
      },
    };
  } catch (error) {
    console.error('Error scraping company info:', error);
    
    // Ensure URL has protocol for fallback
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    
    // Fallback: extract company name from URL
    const urlObj = new URL(normalizedUrl);
    const domain = urlObj.hostname.replace('www.', '');
    const companyName = domain.split('.')[0];
    const formattedName = companyName.charAt(0).toUpperCase() + companyName.slice(1);

    return {
      id: crypto.randomUUID(),
      url: normalizedUrl,
      name: formattedName,
      description: `Information about ${formattedName}`,
      industry: 'technology',
      scraped: false,
    };
  }
} 