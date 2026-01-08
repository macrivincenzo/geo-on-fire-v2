import type { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { join } from 'path';

export const metadata: Metadata = {
  title: 'Blog Preview - AI Brand Track',
  description: 'Preview of AI brand visibility blog content',
};

async function getLatestBlogPost() {
  try {
    // Path to blog-agent results (relative to geo-on-fire-v2)
    // process.cwd() in Next.js returns the project root (geo-on-fire-v2)
    const blogAgentPath = join(process.cwd(), '..', 'blog-agent');
    const fs = await import('fs/promises');
    
    // Check if directory exists
    try {
      await fs.access(blogAgentPath);
    } catch (accessError) {
      console.error('Blog agent directory not found:', blogAgentPath);
      console.error('Access error:', accessError);
      return null;
    }
    
    const files = await fs.readdir(blogAgentPath);
    
    // Find latest blog-results JSON file
    const blogFiles = files
      .filter(f => f.startsWith('blog-results-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (blogFiles.length === 0) {
      console.error('No blog-results JSON files found in:', blogAgentPath);
      return null;
    }
    
    const latestFile = blogFiles[0];
    const filePath = join(blogAgentPath, latestFile);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      return data;
    } catch (parseError) {
      console.error('Error reading/parsing blog post file:', filePath);
      console.error('Parse error:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error loading blog post:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
}

export default async function BlogPreviewPage() {
  let blogData;
  let errorMessage = null;
  
  try {
    blogData = await getLatestBlogPost();
  } catch (error) {
    console.error('Failed to load blog post:', error);
    errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  }
  
  if (!blogData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              No Blog Post Found
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              {errorMessage ? (
                <>
                  Error loading blog post: <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">{errorMessage}</code>
                  <br />
                  <br />
                  Please check the terminal for more details.
                </>
              ) : (
                'Please run the blog agent first to generate content.'
              )}
            </p>
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

  const { topic, content, seoOptimization, qualityScore } = blogData;
  const metaTitle = seoOptimization?.metaTitle || topic;
  const metaDescription = seoOptimization?.metaDescription || '';

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

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Article Header */}
          <article className="prose prose-zinc dark:prose-invert max-w-none">
            <header className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
              <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                {topic}
              </h1>
              {metaDescription && (
                <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">
                  {metaDescription}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                {qualityScore && (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Quality Score: {qualityScore}/100
                  </span>
                )}
                <span>Preview Mode</span>
              </div>
            </header>

            {/* Article Content */}
            <div className="blog-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-12 mb-6 first:mt-0" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-6 mb-3" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-zinc-700 dark:text-zinc-300" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-6 space-y-2 text-zinc-700 dark:text-zinc-300" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside mb-6 space-y-2 text-zinc-700 dark:text-zinc-300" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="ml-4 text-lg leading-relaxed" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-zinc-600 dark:text-zinc-400 my-6" {...props} />
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
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* SEO Info (Preview Only) */}
            {seoOptimization && (
              <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  SEO Optimization Details
                </h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Meta Title:</strong>
                    <p className="text-zinc-600 dark:text-zinc-400">{seoOptimization.metaTitle}</p>
                  </div>
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">Meta Description:</strong>
                    <p className="text-zinc-600 dark:text-zinc-400">{seoOptimization.metaDescription}</p>
                  </div>
                  {seoOptimization.keywordDensity && (
                    <div>
                      <strong className="text-zinc-900 dark:text-zinc-100">Keyword Density:</strong>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Primary: {seoOptimization.keywordDensity.primaryKeyword}% | 
                        Secondary: {seoOptimization.keywordDensity.secondaryKeywords}% | 
                        Status: {seoOptimization.keywordDensity.status}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </article>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/blog"
              className="btn-outline inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

