/**
 * Figma Infographic Generator
 * Generates infographics using Figma design templates
 */

import {
  getFigmaFile,
  getFigmaImageExports,
  extractFileKeyFromUrl,
  getFrameNodes,
  findNodesByName,
  type FigmaNode,
} from './figma-utils';

export interface InfographicData {
  title: string;
  description: string;
  dataPoints: string[];
  metrics?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  section?: string;
  position?: number;
}

export interface GeneratedInfographic {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  section?: string;
  position?: number;
  altText: string;
  dataPoints: string[];
}

export interface FigmaInfographicConfig {
  /** Figma file URL or file key */
  figmaFileUrl: string;
  /** Node ID of the infographic template frame (optional - will search if not provided) */
  templateNodeId?: string;
  /** Template frame name to search for (e.g., "Infographic Template") */
  templateFrameName?: string;
}

/**
 * Generate infographics from blog data using Figma template
 */
export async function generateInfographicsFromFigma(
  config: FigmaInfographicConfig,
  infographicData: InfographicData[]
): Promise<GeneratedInfographic[]> {
  try {
    // Extract file key from URL
    const fileKey = extractFileKeyFromUrl(config.figmaFileUrl);

    // Get Figma file structure
    console.log('📐 Fetching Figma file structure...');
    const figmaFile = await getFigmaFile(fileKey);

    // Find template frame
    let templateNodeId = config.templateNodeId;
    
    if (!templateNodeId && config.templateFrameName) {
      const templateNodes = findNodesByName(figmaFile.document, config.templateFrameName);
      if (templateNodes.length > 0) {
        templateNodeId = templateNodes[0].id;
        console.log(`✅ Found template frame: ${config.templateFrameName} (${templateNodeId})`);
      }
    }

    if (!templateNodeId) {
      // Try to find any frame that could be a template
      const frames = getFrameNodes(figmaFile.document);
      if (frames.length > 0) {
        templateNodeId = frames[0].id;
        console.log(`✅ Using first available frame as template: ${frames[0].name} (${templateNodeId})`);
      }
    }

    if (!templateNodeId) {
      throw new Error('No template frame found in Figma file. Please specify templateNodeId or templateFrameName.');
    }

    // Generate infographics
    const generatedInfographics: GeneratedInfographic[] = [];

    for (let i = 0; i < infographicData.length; i++) {
      const data = infographicData[i];
      console.log(`🎨 Generating infographic ${i + 1}/${infographicData.length}: ${data.title}`);

      try {
        // For now, we'll export the template frame
        // In a full implementation, you'd duplicate the frame and modify text layers
        // Since Figma REST API is read-only, we export the template and note that
        // actual text replacement would need to be done via Figma Plugin API or manual duplication
        
        const imageExports = await getFigmaImageExports(
          fileKey,
          [templateNodeId],
          'png',
          2 // High resolution
        );

        if (imageExports.images && imageExports.images[templateNodeId]) {
          const imageUrl = imageExports.images[templateNodeId];
          
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

          console.log(`✅ Infographic generated: ${data.title}`);
        } else {
          console.warn(`⚠️ Failed to export image for: ${data.title}`);
        }

        // Rate limiting - wait 1 second between requests
        if (i < infographicData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Error generating infographic "${data.title}":`, error);
      }
    }

    console.log(`✨ Generated ${generatedInfographics.length}/${infographicData.length} infographics`);
    return generatedInfographics;

  } catch (error) {
    console.error('❌ Error in generateInfographicsFromFigma:', error);
    throw error;
  }
}

/**
 * Generate infographics for a blog post
 * This is the main function to integrate with blog generation workflow
 */
export async function generateBlogInfographics(
  blogContent: string,
  blogTopic: string,
  keywords: any,
  figmaConfig: FigmaInfographicConfig
): Promise<GeneratedInfographic[]> {
  // Extract key statistics and data points from blog content
  const infographicData: InfographicData[] = [];

  // Simple extraction - in production, you'd use AI to identify key stats
  const statPatterns = [
    /(\d+%)/g,
    /(\d+\.\d+%)/g,
    /(top \d+)/gi,
    /(#\d+)/g,
  ];

  const stats: string[] = [];
  for (const pattern of statPatterns) {
    const matches = blogContent.match(pattern);
    if (matches) {
      stats.push(...matches.slice(0, 3)); // Take first 3 matches
    }
  }

  // Create infographic data from extracted stats
  if (stats.length > 0) {
    infographicData.push({
      title: `${stats[0]} ${blogTopic}`,
      description: `Key statistic: ${stats[0]}`,
      dataPoints: stats.slice(0, 3),
      metrics: {
        primary: stats[0],
        secondary: stats[1],
        tertiary: stats[2],
      },
      section: 'start',
      position: 0,
    });
  }

  // Generate infographics using Figma
  if (infographicData.length > 0) {
    return await generateInfographicsFromFigma(figmaConfig, infographicData);
  }

  return [];
}
