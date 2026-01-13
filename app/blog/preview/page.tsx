import type { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Path utilities will be imported dynamically
import { TableOfContents } from './table-of-contents';

export const metadata: Metadata = {
  title: 'Blog Preview - AI Brand Track',
  description: 'Preview of AI brand visibility blog content',
};

async function getLatestBlogPost() {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Try multiple possible paths
    const possiblePaths = [
      path.join(process.cwd(), '..', 'blog-agent'),
      path.join(process.cwd(), 'blog-agent'),
    ];
    
    let blogAgentPath: string | null = null;
    for (const testPath of possiblePaths) {
      try {
        await fs.access(testPath);
        blogAgentPath = testPath;
        break;
      } catch {
        continue;
      }
    }
    
    if (!blogAgentPath) {
      console.error('Blog agent directory not found. Tried:', possiblePaths);
      return null;
    }
    
    const files = await fs.readdir(blogAgentPath);
    const blogFiles = files
      .filter(f => f.startsWith('blog-results-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (blogFiles.length === 0) {
      console.error('No blog-results JSON files found in:', blogAgentPath);
      return null;
    }
    
    const latestFile = blogFiles[0];
    const filePath = path.join(blogAgentPath, latestFile);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data;
  } catch (error) {
    console.error('Error loading blog post:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

// Helper to extract title from content (first H1 or use topic)
function extractTitle(content: string, topic: string): string {
  const h1Match = content.match(/^#\s+(.+)$/m);
  return h1Match ? h1Match[1] : topic;
}

// Helper to remove H1 from content if present (we'll use topic as H1)
function removeH1FromContent(content: string): string {
  return content.replace(/^#\s+.+$/m, '');
}

// Helper to generate heading IDs
function generateHeadingId(text: string): string {
  const cleanText = typeof text === 'string' ? text : String(text);
  return cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Helper to inject infographics into content
function injectInfographicsIntoContent(content: string, infographics: any[]): string {
  if (!infographics || infographics.length === 0) return content;
  
  let modifiedContent = content;
  
  // Sort infographics by section and position
  const sortedInfographics = [...infographics].sort((a, b) => {
    // First sort by section order in content
    const aIndex = content.indexOf(a.section || '');
    const bIndex = content.indexOf(b.section || '');
    if (aIndex !== bIndex) return aIndex - bIndex;
    // Then by position
    return (a.position || 0) - (b.position || 0);
  });
  
  // Inject each infographic after its corresponding section heading
  // Process in reverse to maintain correct positions
  for (let i = sortedInfographics.length - 1; i >= 0; i--) {
    const infographic = sortedInfographics[i];
    const section = infographic.section || '';
    if (!section) continue;
    
    // Find the section heading in content (H2 or H3)
    const headingPattern = new RegExp(`(#{1,2}\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\n])`, 'i');
    const match = modifiedContent.match(headingPattern);
    
    if (match && match.index !== undefined) {
      const insertPosition = match.index + match[0].length;
      const imageUrl = infographic.imageUrl || infographic.url || `https://placehold.co/1200x600/2563eb/ffffff?text=${encodeURIComponent(infographic.title || 'Infographic')}`;
      const imageMarkdown = `\n\n![${infographic.altText || infographic.title}](${imageUrl})\n\n*${infographic.description || infographic.title}*\n\n`;
      
      modifiedContent = 
        modifiedContent.slice(0, insertPosition) + 
        imageMarkdown + 
        modifiedContent.slice(insertPosition);
    }
  }
  
  return modifiedContent;
}

// Helper to inject infographics into content
function injectInfographicsIntoContent(content: string, infographics: any[]): string {
  if (!infographics || infographics.length === 0) return content;
  
  let modifiedContent = content;
  
  // Sort infographics by section and position
  const sortedInfographics = [...infographics].sort((a, b) => {
    // First sort by section order in content
    const aIndex = content.indexOf(a.section || '');
    const bIndex = content.indexOf(b.section || '');
    if (aIndex !== bIndex) return aIndex - bIndex;
    // Then by position
    return (a.position || 0) - (b.position || 0);
  });
  
  // Inject each infographic after its corresponding section heading
  sortedInfographics.forEach((infographic) => {
    const section = infographic.section || '';
    if (!section) return;
    
    // Find the section heading in content
    const headingRegex = new RegExp(`(#{1,2}\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\n])`, 'i');
    const match = modifiedContent.match(headingRegex);
    
    if (match && match.index !== undefined) {
      const insertPosition = match.index + match[0].length;
      const imageUrl = infographic.imageUrl || infographic.url || `https://placehold.co/1200x600/2563eb/ffffff?text=${encodeURIComponent(infographic.title || 'Infographic')}`;
      const imageMarkdown = `\n\n![${infographic.altText || infographic.title}](${imageUrl})\n\n*${infographic.description || infographic.title}*\n\n`;
      
      modifiedContent = 
        modifiedContent.slice(0, insertPosition) + 
        imageMarkdown + 
        modifiedContent.slice(insertPosition);
    }
  });
  
  return modifiedContent;
}

export default async function BlogPreviewPage() {
  let blogData;
  let errorMessage: string | null = null;
  let errorDetails: string | null = null;
  
  try {
    blogData = await getLatestBlogPost();
    if (!blogData) {
      errorMessage = 'No blog post data found. Please run the blog agent first.';
    }
  } catch (error) {
    console.error('Failed to load blog post:', error);
    errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    errorDetails = error instanceof Error ? error.stack || '' : String(error);
  }
  
  if (!blogData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              No Blog Post Found
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
              {errorMessage || 'Please run the blog agent first to generate content.'}
            </p>
            {errorDetails && (
              <details className="mt-4 text-left max-w-2xl mx-auto">
                <summary className="cursor-pointer text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300">
                  Show error details
                </summary>
                <pre className="mt-2 p-4 bg-zinc-100 dark:bg-zinc-800 rounded text-xs overflow-auto">
                  {errorDetails}
                </pre>
              </details>
            )}
            <Link
              href="/blog"
              className="btn-primary inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safely extract data with defaults
  const topic = blogData?.topic || 'Blog Post';
  const content = blogData?.content || '';
  const seoOptimization = blogData?.seoOptimization || null;
  const qualityScore = blogData?.qualityScore || null;
  const faq = blogData?.faq || null;
  const topics = blogData?.topics || null;
  const infographics = blogData?.infographics || null;
  const metaTitle = seoOptimization?.metaTitle || topic || 'Blog Post';
  const metaDescription = seoOptimization?.metaDescription || '';
  const publishDate = seoOptimization?.schemaMarkup?.datePublished || new Date().toISOString().split('T')[0];
  const authorName = seoOptimization?.schemaMarkup?.author?.name || 'AI Brand Track Team';
  
  // Extract title and clean content
  const articleTitle = extractTitle(content || '', topic || 'Blog Post');
  let cleanContent = removeH1FromContent(content || '');
  
  // Inject infographics into content if available
  if (infographics?.infographics && Array.isArray(infographics.infographics)) {
    cleanContent = injectInfographicsIntoContent(cleanContent, infographics.infographics);
  }
  
  // Extract headings for TOC
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headingMatches = Array.from((content || '').matchAll(headingRegex));

  return (
    <>
      {/* JSON-LD Schema */}
      {seoOptimization?.schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              ...seoOptimization.schemaMarkup,
              "url": `https://www.aibrandtrack.com/blog/preview`,
              "publisher": {
                "@type": "Organization",
                "name": "AI Brand Track",
                "url": "https://www.aibrandtrack.com"
              }
            })
          }}
        />
      )}
      
      {/* FAQ Schema */}
      {faq?.faqs && seoOptimization?.faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoOptimization.faqSchema)
          }}
        />
      )}

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-zinc-900 dark:text-zinc-100">Preview</li>
            </ol>
          </nav>

          {/* Three Column Layout - Firecrawl Style */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Sidebar - Table of Contents */}
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white dark:bg-gray-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-sm">
                  <TableOfContents content={content || ''} />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-6 order-1 lg:order-2">
              {/* Article Header */}
              <header className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight">
                  {articleTitle}
                </h1>
                {metaDescription && (
                  <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                    {metaDescription}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">By {authorName}</span>
                  </div>
                  <span>•</span>
                  <time dateTime={publishDate}>
                    {new Date(publishDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                </div>
              </header>

              {/* Article Content */}
              <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, children, ...props }: any) => {
                      const text = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : String(children);
                      const id = generateHeadingId(text);
                      return (
                        <h1 
                          id={id}
                          className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-12 mb-6 first:mt-0 scroll-mt-24" 
                          {...props}
                        >
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ node, children, ...props }: any) => {
                      const text = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : String(children);
                      const id = generateHeadingId(text);
                      return (
                        <h2 
                          id={id}
                          className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-12 mb-6 first:mt-0 scroll-mt-24" 
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ node, children, ...props }: any) => {
                      const text = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : String(children);
                      const id = generateHeadingId(text);
                      return (
                        <h3 
                          id={id}
                          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4 scroll-mt-24" 
                          {...props}
                        >
                          {children}
                        </h3>
                      );
                    },
                    p: ({ node, ...props }) => (
                      <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />
                    ),
                    a: ({ node, href, ...props }) => {
                      // Fix internal links
                      const isInternal = href?.startsWith('/') || href?.startsWith('#');
                      const fixedHref = href?.startsWith('https://example.com') 
                        ? href.replace('https://example.com', '') 
                        : href;
                      
                      if (isInternal || fixedHref?.startsWith('/')) {
                        return (
                          <Link 
                            href={fixedHref || '#'} 
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            {...props}
                          />
                        );
                      }
                      return (
                        <a 
                          href={href} 
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      );
                    },
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-6 space-y-2 text-zinc-700 dark:text-zinc-300 ml-4" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-6 space-y-2 text-zinc-700 dark:text-zinc-300 ml-4" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-6 italic text-zinc-600 dark:text-zinc-400 my-6 bg-zinc-50 dark:bg-zinc-800 py-4 rounded-r" {...props} />
                    ),
                    code: ({ node, inline, ...props }: any) => {
                      if (inline) {
                        return (
                          <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm font-mono" {...props} />
                        );
                      }
                      return (
                        <code className="block bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-6" {...props} />
                      );
                    },
                    img: ({ node, src, alt, ...props }: any) => (
                      <figure className="my-8">
                        <img
                          src={src}
                          alt={alt}
                          className="w-full rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800"
                          loading="lazy"
                          {...props}
                        />
                        {alt && (
                          <figcaption className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400 italic">
                            {alt}
                          </figcaption>
                        )}
                      </figure>
                    ),
                  }}
                >
                  {cleanContent}
                </ReactMarkdown>
              </div>

              {/* FAQ Section */}
              {faq?.faqs && faq.faqs.length > 0 && (
                <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {faq.faqs.map((item: any, index: number) => (
                      <div key={index} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                          {item.question}
                        </h3>
                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {item.answer}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio */}
              <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {authorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      {authorName}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Expert in AI brand visibility, SEO, AEO, and GEO optimization. Helping brands maximize their presence across ChatGPT, Claude, Perplexity, and Google Gemini.
                    </p>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {topics && Array.isArray(topics) && topics.length > 1 && (
                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topics.slice(1, 5).map((relatedTopic: any, index: number) => (
                      <Link
                        key={index}
                        href="/blog/preview"
                        className="block p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                      >
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                          {relatedTopic.title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {relatedTopic.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <Link
                  href="/blog"
                  className="btn-outline inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
                >
                  ← Back to Blog
                </Link>
              </div>
            </article>

            {/* Right Sidebar - CTA */}
            <aside className="lg:col-span-3 order-3">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white dark:bg-gray-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
                  <div className="text-center mb-4">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">// Get started \\</span>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 text-center">
                    Ready to build?
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed text-center">
                    Start tracking your AI brand visibility for free and scale seamlessly as your project expands. No credit card needed.
                  </p>
                  <div className="space-y-3">
                    <Link
                      href="/brand-monitor?from=blog"
                      className="btn-firecrawl-orange w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-6"
                      prefetch={false}
                    >
                      Start for free
                    </Link>
                    <Link
                      href="/plans?from=blog"
                      className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-6 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
                      prefetch={false}
                    >
                      See our plans
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
