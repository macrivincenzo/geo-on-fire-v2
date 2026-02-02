'use client';

import { Info } from 'lucide-react';

const DISCLAIMER_TEXT = 'Metrics and recommendations are based on AI responses and may vary between runs. Impact estimates are illustrative, not guaranteed.';

interface AnalysisDisclaimerProps {
  /** Optional compact variant for inline use */
  variant?: 'default' | 'compact';
  className?: string;
}

export function AnalysisDisclaimer({ variant = 'default', className = '' }: AnalysisDisclaimerProps) {
  if (variant === 'compact') {
    return (
      <p
        className={`flex items-center gap-1.5 text-xs text-gray-500 ${className}`}
        role="note"
        aria-label="Analysis disclaimer"
      >
        <Info className="w-3.5 h-3.5 flex-shrink-0" />
        {DISCLAIMER_TEXT}
      </p>
    );
  }

  return (
    <div
      className={`flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 ${className}`}
      role="note"
      aria-label="Analysis disclaimer"
    >
      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
      <p>{DISCLAIMER_TEXT}</p>
    </div>
  );
}
