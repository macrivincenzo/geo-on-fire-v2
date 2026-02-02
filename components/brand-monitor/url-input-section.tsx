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
            isProcessing ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <input
            type="text"
            className={`w-full pl-12 pr-[7.5rem] sm:pr-32 h-12 sm:h-14 text-base rounded-none border-2 focus:outline-none focus:ring-2 transition-all bg-white text-gray-900 placeholder-gray-500 ${
              urlValid === false
                ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                : urlValid === true
                ? 'border-blue-300 focus:ring-blue-600 focus:border-transparent'
                : 'border-gray-300 focus:ring-blue-600 focus:border-transparent'
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

          {/* Submit button - label + arrow, clearly visible in light and dark mode */}
          <button
            onClick={onSubmit}
            disabled={isProcessing || !url || urlValid === false}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-9 sm:h-10 px-3 sm:px-4 flex items-center gap-1.5 sm:gap-2 transition-all duration-200 rounded-none border-2 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border-blue-600 hover:border-blue-700 disabled:opacity-50 disabled:bg-blue-600 disabled:border-blue-600 disabled:hover:bg-blue-600 text-white font-semibold text-sm sm:text-base whitespace-nowrap"
            aria-label="Analyze website"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
            ) : (
              <>
                <span>Analyze</span>
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
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
              <p className="text-sm font-medium text-gray-700">
                {loading ? 'Analyzing your website...' : 'Preparing comprehensive analysis...'}
              </p>
            </div>

            {/* Progress Skeleton */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="space-y-4">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 animate-pulse"></div>
                </div>

                {/* Content skeleton */}
                <div className="space-y-3">
                  <div className="h-3 w-full bg-gray-200 animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-gray-200 animate-pulse"></div>
                  <div className="h-3 w-4/6 bg-gray-200 animate-pulse"></div>
                </div>

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="h-2 w-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-blue-600 animate-progress-flow"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Multiple skeleton cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-gray-200 p-5">
                  <div className="space-y-3">
                    <div className="h-3 w-24 bg-gray-200 animate-pulse"></div>
                    <div className="h-3 w-full bg-gray-200 animate-pulse"></div>
                    <div className="h-3 w-3/4 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info text */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
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