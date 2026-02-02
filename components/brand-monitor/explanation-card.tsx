'use client';

import React, { useState } from 'react';
import { HelpCircle, X, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

interface ExplanationCardProps {
  title: string;
  whatItMeans: string;
  whyItMatters: string;
  whatToDo?: string;
  icon?: React.ReactNode;
  variant?: 'info' | 'success' | 'warning';
}

export function ExplanationCard({
  title,
  whatItMeans,
  whyItMatters,
  whatToDo,
  icon,
  variant = 'info'
}: ExplanationCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const variantStyles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-800'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
      textColor: 'text-amber-800'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} ${styles.border} border-2 rounded-none p-4 mb-4 transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`${styles.iconBg} ${styles.iconColor} p-2 rounded-none`}>
            {icon || <HelpCircle className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold ${styles.titleColor} mb-2 flex items-center gap-2`}>
              {title}
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white/50">
                💡 Simple Explanation
              </span>
            </h4>
            
            {isExpanded && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div>
                  <p className={`text-sm font-medium ${styles.titleColor} mb-1`}>
                    🤔 What does this mean?
                  </p>
                  <p className={`text-sm ${styles.textColor}`}>
                    {whatItMeans}
                  </p>
                </div>
                
                <div>
                  <p className={`text-sm font-medium ${styles.titleColor} mb-1`}>
                    ⭐ Why does this matter?
                  </p>
                  <p className={`text-sm ${styles.textColor}`}>
                    {whyItMatters}
                  </p>
                </div>
                
                {whatToDo && (
                  <div>
                    <p className={`text-sm font-medium ${styles.titleColor} mb-1`}>
                      🚀 What can you do about it?
                    </p>
                    <p className={`text-sm ${styles.textColor}`}>
                      {whatToDo}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`${styles.iconColor} hover:opacity-70 transition-opacity p-1`}
        >
          {isExpanded ? (
            <X className="w-4 h-4" />
          ) : (
            <HelpCircle className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

// Pre-built explanation cards for each section
export function VisibilityScoreExplanation({ score, rank }: { score: number; rank: number }) {
  const isGood = score >= 50;
  const isOkay = score >= 25 && score < 50;
  
  let whatToDo = '';
  if (score === 0) {
    whatToDo = "Don't worry! This is common for smaller brands. Focus on creating more content about your products, getting mentioned on other websites, and building your online presence. The more you're talked about online, the more AI will learn about you!";
  } else if (score < 25) {
    whatToDo = "You're on the map! Keep creating great content, get reviews and mentions from customers, and partner with other websites in your industry. Every mention helps AI learn about your brand.";
  } else if (score < 50) {
    whatToDo = "Good progress! Continue what you're doing. Consider creating comparison guides, getting featured in industry articles, and expanding your content to cover more topics related to your business.";
  } else {
    whatToDo = "Amazing job! Your brand is visible to AI. Keep maintaining your presence and consider expanding into new keywords and topics to grow even more.";
  }

  return (
    <ExplanationCard
      title="Understanding Your Visibility Score"
      icon={<Lightbulb className="w-5 h-5" />}
      variant={isGood ? 'success' : isOkay ? 'warning' : 'info'}
      whatItMeans={`Your visibility score is ${score}%. Think of it like a popularity contest - when someone asks an AI robot "What's the best product in your industry?", how often does the robot mention YOUR brand? A score of ${score}% means you appear ${score === 0 ? 'not at all' : score < 25 ? 'rarely' : score < 50 ? 'sometimes' : 'often'} in AI recommendations. You're currently ranked #${rank} among your competitors.`}
      whyItMatters="More and more people are asking AI chatbots (like ChatGPT) for advice instead of Googling. If AI doesn't know about your brand, you're invisible to millions of potential customers! It's like having a store that doesn't show up on the map - people can't find you even if they're looking."
      whatToDo={whatToDo}
    />
  );
}

export function ProviderRankingsExplanation({ brandName }: { brandName: string }) {
  return (
    <ExplanationCard
      title="Understanding Provider Rankings"
      icon={<TrendingUp className="w-5 h-5" />}
      variant="info"
      whatItMeans={`Different AI robots (like ChatGPT, Claude, Google's AI) each have their own "brain" and give different answers. This table shows how each AI robot ranks ${brandName} compared to competitors. Each provider's visibility score is calculated separately based only on that provider's responses. Think of it like asking different teachers the same question - each might have a slightly different favorite answer!`}
      whyItMatters="Knowing which AI mentions you more helps you understand where you're doing well and where you need to improve. If one AI knows about you but another doesn't, you know where to focus your efforts. The overall visibility score (shown in other tabs) is an average across all providers. It's like knowing which friend to ask for a recommendation!"
      whatToDo="Look for patterns! If you rank low on all providers, focus on general visibility. If you rank high on some but low on others, research what content those specific AI providers trained on and create more of that type of content. Compare your per-provider scores to identify opportunities."
    />
  );
}

export function ComparisonMatrixExplanation() {
  return (
    <ExplanationCard
      title="Understanding the Comparison Matrix"
      icon={<AlertCircle className="w-5 h-5" />}
      variant="info"
      whatItMeans="This colorful grid shows ALL your competitors side by side across ALL AI providers. Darker orange = higher visibility score. It's like a report card showing everyone's grades in each subject! Each row is a company, each column is an AI provider."
      whyItMatters="This bird's-eye view helps you spot patterns quickly. You can see at a glance who's winning in the AI visibility race and where everyone stands. Maybe your competitor is crushing it on ChatGPT but invisible on Google's AI - that's valuable information!"
      whatToDo="Find the empty spots! If a big competitor has low scores somewhere, that's your opportunity to beat them. Focus your content and marketing efforts on the AI providers where you have the best chance to stand out."
    />
  );
}

export function PromptsResponsesExplanation() {
  return (
    <ExplanationCard
      title="Understanding Prompts & Responses"
      icon={<HelpCircle className="w-5 h-5" />}
      variant="info"
      whatItMeans="These are the actual questions we asked the AI robots and the exact answers they gave. It's like reading the transcript of interviews - you can see word-for-word what each AI said about your brand and competitors. A green badge means the AI mentioned your brand!"
      whyItMatters="This is the raw data! You can see exactly HOW the AI talks about your brand. Is it mentioned first? Last? Not at all? Is the description accurate? This helps you understand not just IF you're mentioned, but HOW you're being represented to potential customers."
      whatToDo="Read the responses carefully. If your brand isn't mentioned, think about why. If it IS mentioned but described incorrectly, you may need to update your website content. The AI learns from public information, so improve what's publicly available about your brand!"
    />
  );
}

