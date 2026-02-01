import React from 'react';
import { ResultsTab } from '@/lib/brand-monitor-reducer';

interface BrandData {
  visibilityScore: number;
  sentimentScore: number;
  shareOfVoice: number;
  overallScore: number;
  averagePosition: number;
  weeklyChange?: number;
}

interface ResultsNavigationProps {
  activeTab: ResultsTab;
  onTabChange: (tab: ResultsTab) => void;
  onRestart: () => void;
  brandData?: BrandData;
  brandName?: string;
}

export function ResultsNavigation({
  activeTab,
  onTabChange,
  onRestart,
  brandData,
  brandName
}: ResultsNavigationProps) {
  const handleTabClick = (tab: ResultsTab) => {
    onTabChange(tab);
  };
  
  const btnBase = 'w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-none border-2 ';
  const btnActive = 'bg-blue-600 text-white border-blue-600 dark:border-blue-600';
  const btnInactive = 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';

  return (
    <nav className="w-80 flex-shrink-0 animate-fade-in flex flex-col h-[calc(100vh-8rem)] ml-[-2rem] sticky top-8" style={{ animationDelay: '0.3s' }}>
      
      <div className="w-full flex flex-col justify-between flex-1">
        
        {/* Navigation Tabs - at the top (front-page style: rounded-none, border-2) */}
        <div className="space-y-2">
        <button onClick={() => handleTabClick('insights')} className={btnBase + (activeTab === 'insights' ? btnActive : btnInactive)}>✨ Strategic Insights</button>
        <button onClick={() => handleTabClick('matrix')} className={btnBase + (activeTab === 'matrix' ? btnActive : btnInactive)}>Comparison Matrix</button>
        <button onClick={() => handleTabClick('prompts')} className={btnBase + (activeTab === 'prompts' ? btnActive : btnInactive)}>Prompts & Responses</button>
        <button onClick={() => handleTabClick('rankings')} className={btnBase + (activeTab === 'rankings' ? btnActive : btnInactive)}>Provider Rankings</button>
        <button onClick={() => handleTabClick('visibility')} className={btnBase + (activeTab === 'visibility' ? btnActive : btnInactive)}>Visibility Score</button>
        <button onClick={() => handleTabClick('sources')} className={btnBase + (activeTab === 'sources' ? btnActive : btnInactive)}>🔗 Source Tracker</button>
        <button onClick={() => handleTabClick('historical')} className={btnBase + (activeTab === 'historical' ? btnActive : btnInactive)}>📈 Historical Tracking</button>
        <button onClick={() => handleTabClick('domain-comparisons')} className={btnBase + (activeTab === 'domain-comparisons' ? btnActive : btnInactive)}>🌐 Domain Comparisons</button>
        <button onClick={() => handleTabClick('boostActions')} className={btnBase + (activeTab === 'boostActions' ? btnActive : btnInactive)}>🚀 Boost Actions</button>
        </div>
        
        {/* Analyze another website button - at the bottom */}
        <div className="pt-4 pb-8 border-t-2 border-gray-200 dark:border-gray-700">
          <button
            onClick={onRestart}
            className="w-full text-left px-4 py-3 text-sm font-medium transition-colors rounded-none border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Analyze another website
          </button>
        </div>
      </div>
    </nav>
  );
}