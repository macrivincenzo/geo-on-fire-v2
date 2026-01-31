import React from 'react';
import { Globe, Loader2, Sparkles } from 'lucide-react';

interface UrlInputSectionProps {
  url: string;
  urlValid: boolean | null;
  loading: boolean;
  analyzing: boolean;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
}

export function UrlInputSection({
  url,
  urlValid,
  loading,
  analyzing,
  onUrlChange,
  onSubmit
}: UrlInputSectionProps) {
  const isProcessing = loading || analyzing;

  return (
    <div className="flex flex-col items-center animate-panel-in pb-12">
      <div className="w-full">
        <div className="relative">
          <Globe className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
            isProcessing ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
          }`} />
          <input
            type="text"
            className={`w-full pl-12 pr-16 h-12 sm:h-14 text-base rounded-none border-2 focus:outline-none focus:ring-2 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              urlValid === false
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-transparent'
                : urlValid === true
                ? 'border-blue-300 dark:border-blue-700 focus:ring-blue-500 focus:border-transparent'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-transparent'
            } ${isProcessing ? 'opacity-60' : ''}`}
            placeholder="Enter your website URL (e.g., example.com)"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading && !analyzing && url) {
                onSubmit();
              }
            }}
            onFocus={(e) => {
              if (!url) {
                e.target.placeholder = "example.com";
              }
            }}
            onBlur={(e) => {
              e.target.placeholder = "Enter your website URL (e.g., example.com)";
            }}
            disabled={isProcessing}
          />

          {/* Arrow button inside input */}
          <button
            onClick={onSubmit}
            disabled={isProcessing || !url || urlValid === false}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:hover:bg-gray-300 rounded-none border-2 border-blue-600"
            aria-label="Analyze website"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>

        {/* Professional Loading State */}
        {isProcessing && (
          <div className="mt-8 space-y-6">
            {/* Status Message */}
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {loading ? 'Analyzing your website...' : 'Preparing comprehensive analysis...'}
              </p>
            </div>

            {/* Progress Skeleton */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-4">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-3">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                </div>

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full bg-blue-600 animate-progress-flow"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Multiple skeleton cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                  <div className="space-y-3">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info text */}
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This may take 30-60 seconds as we analyze across multiple AI platforms
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress-flow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
        .animate-progress-flow {
          animation: progress-flow 1.5s ease-in-out infinite;
          width: 25%;
        }
      `}</style>
    </div>
  );
}