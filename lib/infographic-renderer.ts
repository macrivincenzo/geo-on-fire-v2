/**
 * Infographic Renderer
 * Renders infographics using HTML/CSS templates matching Figma designs
 * Converts HTML to images for use in blog posts
 */

import { InfographicData, GeneratedInfographic } from './figma-infographic-generator';

/**
 * Default infographic template - EXACT match to your Figma design
 * This uses your exact React/TSX structure converted to HTML with Tailwind CSS
 */
const DEFAULT_INFographic_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
  </style>
</head>
<body>
  <div class="min-h-full overflow-auto bg-white p-8">
    <div class="max-w-6xl w-full mx-auto py-20">
      <!-- Main Headline -->
      <div class="text-center mb-20">
        <h1 class="text-6xl text-gray-900 mb-4 leading-tight">
          {{TITLE}}
        </h1>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-12 mb-20 max-w-5xl mx-auto">
        <div class="text-center">
          <div class="text-7xl text-gray-900 mb-3">{{PRIMARY_METRIC}}</div>
          <div class="text-xl text-gray-600">{{PRIMARY_LABEL}}</div>
        </div>
        
        <div class="text-center">
          <div class="text-7xl text-gray-900 mb-3">{{SECONDARY_METRIC}}</div>
          <div class="text-xl text-gray-600">{{SECONDARY_LABEL}}</div>
        </div>
        
        <div class="text-center">
          <div class="text-7xl text-gray-900 mb-3">{{TERTIARY_METRIC}}</div>
          <div class="text-xl text-gray-600">{{TERTIARY_LABEL}}</div>
        </div>
      </div>

      <!-- Key Insight -->
      <div class="max-w-4xl mx-auto text-center mb-16">
        <div class="text-2xl text-gray-700 leading-relaxed">
          {{DESCRIPTION}}
        </div>
      </div>

      <!-- Three Column Info -->
      <div class="grid grid-cols-3 gap-16 max-w-5xl mx-auto pt-16 border-t border-gray-200">
        <div>
          <div class="text-gray-900 text-lg mb-3">The Shift</div>
          <div class="text-gray-600 leading-relaxed">
            {{SHIFT_TEXT}}
          </div>
        </div>
        
        <div>
          <div class="text-gray-900 text-lg mb-3">The Challenge</div>
          <div class="text-gray-600 leading-relaxed">
            {{CHALLENGE_TEXT}}
          </div>
        </div>
        
        <div>
          <div class="text-gray-900 text-lg mb-3">The Solution</div>
          <div class="text-gray-600 leading-relaxed">
            {{SOLUTION_TEXT}}
          </div>
        </div>
      </div>

      <!-- Source -->
      <div class="text-center mt-16 text-sm text-gray-400">
        Source: AI Brand Track Study
      </div>
    </div>
  </div>
</body>
</html>
`;

/**
 * Replace template variables with actual data
 * Handles title with blue highlight span matching your Figma design
 */
function renderTemplate(template: string, data: InfographicData): string {
  // Extract metrics
  const primaryMetric = data.metrics?.primary || data.dataPoints[0] || '40%';
  const secondaryMetric = data.metrics?.secondary || data.dataPoints[1] || 'Top 3';
  const tertiaryMetric = data.metrics?.tertiary || data.dataPoints[2] || '#1';
  
  // Extract labels from data points or use defaults
  const primaryLabel = extractLabel(data.dataPoints[0], primaryMetric) || 'Traffic Increase';
  const secondaryLabel = extractLabel(data.dataPoints[1], secondaryMetric) || 'Ranking Required';
  const tertiaryLabel = extractLabel(data.dataPoints[2], tertiaryMetric) || 'AEO Priority';
  
  // Process title - extract highlight text and wrap in blue span
  const title = processTitle(data.title || 'AI Platforms Are Now The Primary Touchpoint Between Brands & Consumers');
  
  // Generate supporting text from description with blue highlights
  const description = processDescription(
    data.description || 
    `Brands ranking in the top 3 on AI platforms like ChatGPT experience a 40% increase in traffic compared to lower-ranked competitors.`,
    primaryMetric,
    secondaryMetric
  );
  
  // Default column texts (matching your Figma design)
  const shiftText = 'AI-powered platforms becoming the primary discovery method for consumers';
  const challengeText = 'Effectively answering consumer questions is now critical for visibility';
  const solutionText = 'Answering Engine Optimization (AEO) ensures brands stay top-of-mind';
  
  return template
    .replace(/\{\{TITLE\}\}/g, title)
    .replace(/\{\{PRIMARY_METRIC\}\}/g, primaryMetric)
    .replace(/\{\{PRIMARY_LABEL\}\}/g, primaryLabel)
    .replace(/\{\{SECONDARY_METRIC\}\}/g, secondaryMetric)
    .replace(/\{\{SECONDARY_LABEL\}\}/g, secondaryLabel)
    .replace(/\{\{TERTIARY_METRIC\}\}/g, tertiaryMetric)
    .replace(/\{\{TERTIARY_LABEL\}\}/g, tertiaryLabel)
    .replace(/\{\{DESCRIPTION\}\}/g, description)
    .replace(/\{\{SHIFT_TEXT\}\}/g, shiftText)
    .replace(/\{\{CHALLENGE_TEXT\}\}/g, challengeText)
    .replace(/\{\{SOLUTION_TEXT\}\}/g, solutionText);
}

/**
 * Extract label from data point (remove the metric value)
 */
function extractLabel(dataPoint: string | undefined, metric: string): string | null {
  if (!dataPoint) return null;
  return dataPoint.replace(metric, '').trim() || null;
}

/**
 * Process title to add blue highlight span around key phrases
 * Matches your Figma design: "Primary Touchpoint" in blue
 */
function processTitle(title: string): string {
  // Look for common phrases to highlight
  const highlightPhrases = [
    'Primary Touchpoint',
    'Primary',
    'Touchpoint',
    'Key',
    'Essential',
  ];
  
  let processed = title;
  for (const phrase of highlightPhrases) {
    if (processed.includes(phrase)) {
      processed = processed.replace(
        phrase,
        `<span class="text-blue-600">${phrase}</span>`
      );
      break; // Only highlight first match
    }
  }
  
  return processed;
}

/**
 * Process description to add blue highlights for statistics
 */
function processDescription(description: string, primaryMetric: string, secondaryMetric: string): string {
  let processed = description;
  
  // Highlight "top 3" or similar phrases
  processed = processed.replace(
    /(top\s+\d+)/gi,
    '<span>$1</span>'
  );
  
  // Highlight the primary metric
  if (primaryMetric) {
    processed = processed.replace(
      new RegExp(`(${primaryMetric.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g'),
      `<span class="text-blue-600">$1</span>`
    );
  }
  
  return processed;
}

/**
 * Convert HTML to image using browser automation
 * This requires a headless browser (Puppeteer/Playwright)
 * For now, returns a data URL that can be used
 */
export async function renderInfographicToImage(
  htmlContent: string
): Promise<string> {
  // For server-side rendering, we'll need to use Puppeteer or Playwright
  // For now, this is a placeholder that returns the HTML
  // You'll need to install: npm install puppeteer
  
  try {
    // Check if we're in a browser environment (client-side)
    if (typeof window !== 'undefined') {
      // Client-side: Use html-to-image library
      const { toPng } = await import('html-to-image');
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      document.body.appendChild(element);
      const dataUrl = await toPng(element);
      document.body.removeChild(element);
      return dataUrl;
    } else {
      // Server-side: Use Puppeteer
      const puppeteer = await import('puppeteer');
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.setViewport({ width: 1200, height: 800 });
      
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: true,
      });
      
      await browser.close();
      
      // Convert buffer to base64 data URL
      const base64 = Buffer.from(screenshot as Buffer).toString('base64');
      return `data:image/png;base64,${base64}`;
    }
  } catch (error) {
    console.error('Error rendering infographic to image:', error);
    // Fallback: return placeholder
    return `https://placehold.co/1200x800/2563eb/ffffff?text=Infographic+Error`;
  }
}

/**
 * Generate infographics using HTML/CSS template
 * This uses your Figma design structure but renders it programmatically
 */
export async function generateInfographicsFromTemplate(
  infographicData: InfographicData[],
  customTemplate?: string
): Promise<GeneratedInfographic[]> {
  const template = customTemplate || DEFAULT_INFographic_TEMPLATE;
  const generatedInfographics: GeneratedInfographic[] = [];

  for (let i = 0; i < infographicData.length; i++) {
    const data = infographicData[i];
    console.log(`🎨 Rendering infographic ${i + 1}/${infographicData.length}: ${data.title}`);

    try {
      // Render HTML from template
      const htmlContent = renderTemplate(template, data);
      
      // Convert HTML to image
      const imageUrl = await renderInfographicToImage(htmlContent);
      
      generatedInfographics.push({
        id: `infographic-${i + 1}-${Date.now()}`,
        title: data.title,
        description: data.description,
        imageUrl: imageUrl,
        section: data.section,
        position: data.position,
        altText: data.description || data.title,
        dataPoints: data.dataPoints || [],
      });

      console.log(`✅ Infographic rendered: ${data.title}`);
    } catch (error) {
      console.error(`❌ Error rendering infographic "${data.title}":`, error);
    }
  }

  return generatedInfographics;
}

/**
 * Load custom template from Figma code
 * Paste your Figma HTML/CSS code here
 */
export function loadFigmaTemplate(figmaCode: string): string {
  // The figmaCode should be the HTML/CSS you copy from Figma
  // Replace template variables with {{VARIABLE}} placeholders
  return figmaCode;
}
