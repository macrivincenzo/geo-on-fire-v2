/**
 * Figma API Client
 * Handles communication with Figma REST API
 */

const FIGMA_API_BASE = 'https://api.figma.com/v1';

export interface FigmaFile {
  document: FigmaNode;
  components: Record<string, FigmaComponent>;
  styles: Record<string, FigmaStyle>;
  name: string;
  lastModified: string;
  version: string;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
}

export interface FigmaStyle {
  key: string;
  name: string;
  styleType: string;
}

export interface FigmaImageExport {
  images: Record<string, string>;
  error?: boolean;
  status?: number;
}

/**
 * Get Figma API token from environment
 */
function getFigmaToken(): string {
  const token = process.env.FIGMA_API_TOKEN;
  if (!token) {
    throw new Error('FIGMA_API_TOKEN is not set in environment variables');
  }
  return token;
}

/**
 * Extract file key from Figma URL
 * Example: https://www.figma.com/file/ABC123xyz/Design -> ABC123xyz
 */
export function extractFileKeyFromUrl(url: string): string {
  const match = url.match(/file\/([a-zA-Z0-9]+)/);
  if (!match || !match[1]) {
    throw new Error(`Invalid Figma URL: ${url}`);
  }
  return match[1];
}

/**
 * Get Figma file data
 */
export async function getFigmaFile(fileKey: string): Promise<FigmaFile> {
  const token = getFigmaToken();
  const response = await fetch(`${FIGMA_API_BASE}/files/${fileKey}`, {
    headers: {
      'X-Figma-Token': token,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Figma API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Get image exports from Figma file
 * @param fileKey - Figma file key
 * @param nodeIds - Array of node IDs to export
 * @param format - Image format (png, jpg, svg, pdf)
 * @param scale - Scale factor (1, 2, 4)
 */
export async function getFigmaImageExports(
  fileKey: string,
  nodeIds: string[],
  format: 'png' | 'jpg' | 'svg' | 'pdf' = 'png',
  scale: 1 | 2 | 4 = 2
): Promise<FigmaImageExport> {
  const token = getFigmaToken();
  const ids = nodeIds.join(',');
  const response = await fetch(
    `${FIGMA_API_BASE}/images/${fileKey}?ids=${ids}&format=${format}&scale=${scale}`,
    {
      headers: {
        'X-Figma-Token': token,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Figma API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Find nodes by name in Figma file
 */
export function findNodesByName(
  node: FigmaNode,
  name: string,
  results: FigmaNode[] = []
): FigmaNode[] {
  if (node.name === name) {
    results.push(node);
  }
  if (node.children) {
    for (const child of node.children) {
      findNodesByName(child, name, results);
    }
  }
  return results;
}

/**
 * Get all frame nodes (potential infographic templates)
 */
export function getFrameNodes(node: FigmaNode, frames: FigmaNode[] = []): FigmaNode[] {
  if (node.type === 'FRAME' || node.type === 'COMPONENT') {
    frames.push(node);
  }
  if (node.children) {
    for (const child of node.children) {
      getFrameNodes(child, frames);
    }
  }
  return frames;
}
