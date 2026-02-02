'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  TrendingUp,
  Target,
  Zap,
  AlertTriangle,
  FileText,
  Users,
  Play,
  Loader2,
  Download,
  Copy,
  Check,
  Eye,
  X
} from 'lucide-react';
import { AIResponse, CompetitorRanking } from '@/lib/types';
import { ActionItem, generateStrategicInsights } from '@/lib/strategic-insights';
import { useCustomer, useRefreshCustomer } from '@/hooks/useAutumnCustomer';
import { CREDITS_PER_ACTION } from '@/config/constants';
import { useBuyCredits } from '@/hooks/useBuyCredits';
import { AnalysisDisclaimer } from '@/components/analysis-disclaimer';

interface BoostActionsTabProps {
  brandData: CompetitorRanking;
  competitors: CompetitorRanking[];
  responses: AIResponse[];
  brandName: string;
  analysisId: string | null;
  brandUrl?: string;
}

type ActionStatus = 'todo' | 'in-progress' | 'done';

interface ActionWithStatus extends ActionItem {
  status: ActionStatus;
}

const STATUS_COLORS = {
  'todo': 'bg-gray-100 border-gray-300',
  'in-progress': 'bg-blue-50 border-blue-300',
  'done': 'bg-green-50 border-green-300'
};

const PRIORITY_COLORS = {
  'high': 'bg-red-100 text-red-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'low': 'bg-gray-100 text-gray-800'
};

const EFFORT_COLORS = {
  'easy': 'bg-green-100 text-green-800',
  'medium': 'bg-blue-100 text-blue-800',
  'hard': 'bg-purple-100 text-purple-800'
};

const CATEGORY_ICONS = {
  'visibility': TrendingUp,
  'sentiment': AlertTriangle,
  'competitive': Users,
  'content': FileText,
  'technical': Zap
};

export function BoostActionsTab({
  brandData,
  competitors,
  responses,
  brandName,
  analysisId,
  brandUrl
}: BoostActionsTabProps) {
  // Get user's credit balance
  const { customer, refetch } = useCustomer();
  const refreshCustomer = useRefreshCustomer();
  const { openBuyCredits } = useBuyCredits();
  const messageUsage = customer?.features?.messages;
  const remainingCredits = messageUsage ? (messageUsage.balance || 0) : 0;
  
  // Generate action items from insights
  const insights = useMemo(() => {
    if (!brandData || !brandName) {
      return {
        actionItems: [],
        overallHealth: 'needs-work' as const,
        healthScore: 0,
        summary: '',
        brandQuotes: [],
        competitorQuotes: new Map(),
        competitiveGaps: [],
        biggestThreat: null,
        biggestOpportunity: null,
        quickWins: [],
        strategicPriorities: [],
        contentSuggestions: [],
        missingTopics: [],
        providerInsights: [],
        bestProvider: null,
        worstProvider: null,
        visibilityTrend: 'stable' as const,
        sentimentTrend: 'stable' as const,
        competitivePosition: 'niche' as const
      };
    }
    try {
      return generateStrategicInsights(brandData, competitors || [], responses || [], brandName);
    } catch (error) {
      console.error('Error generating strategic insights:', error);
      return {
        actionItems: [],
        overallHealth: 'needs-work' as const,
        healthScore: 0,
        summary: 'Error generating insights',
        brandQuotes: [],
        competitorQuotes: new Map(),
        competitiveGaps: [],
        biggestThreat: null,
        biggestOpportunity: null,
        quickWins: [],
        strategicPriorities: [],
        contentSuggestions: [],
        missingTopics: [],
        providerInsights: [],
        bestProvider: null,
        worstProvider: null,
        visibilityTrend: 'stable' as const,
        sentimentTrend: 'stable' as const,
        competitivePosition: 'niche' as const
      };
    }
  }, [brandData, competitors, responses, brandName]);

  // Load saved statuses from localStorage
  const [actionStatuses, setActionStatuses] = useState<Record<string, ActionStatus>>({});
  
  useEffect(() => {
    if (analysisId) {
      const saved = localStorage.getItem(`boostActions_${analysisId}`);
      if (saved) {
        try {
          setActionStatuses(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load saved action statuses:', e);
        }
      }
    }
  }, [analysisId]);

  // Save statuses to localStorage
  const updateActionStatus = (actionId: string, status: ActionStatus) => {
    const newStatuses = { ...actionStatuses, [actionId]: status };
    setActionStatuses(newStatuses);
    if (analysisId) {
      localStorage.setItem(`boostActions_${analysisId}`, JSON.stringify(newStatuses));
    }
  };

  // Track executing actions
  const [executingActions, setExecutingActions] = useState<Set<string>>(new Set());
  const [executionResults, setExecutionResults] = useState<Record<string, any>>({});
  const [copiedContent, setCopiedContent] = useState<Set<string>>(new Set());
  const [viewingResults, setViewingResults] = useState<string | null>(null);

  // Execute action
  const handleExecuteAction = async (action: ActionWithStatus) => {
    if (executingActions.has(action.id)) return;

    setExecutingActions(prev => new Set(prev).add(action.id));
    
    try {
      const response = await fetch('/api/brand-monitor/execute-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          brandName,
          brandData,
          competitors,
          responses,
          brandUrl: brandUrl || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log(`[Boost Actions] Execution successful for ${action.id}:`, {
          hasGeneratedContent: !!result.generatedContent,
          contentCount: result.generatedContent?.length || 0,
          hasData: !!result.data
        });
        setExecutionResults(prev => ({
          ...prev,
          [action.id]: result
        }));
        
        // Refresh customer data to update credit balance
        if (result.remainingCredits !== undefined) {
          await refreshCustomer();
        }
        
        // Don't auto-move - let user control workflow
        // User can manually move to "In Progress" when they're ready to work on it
      } else {
        // Handle insufficient credits error
        if (response.status === 402 && result.error === 'Insufficient credits') {
          openBuyCredits();
        } else {
          alert(`Action execution failed: ${result.error || result.message}`);
        }
      }
    } catch (error) {
      console.error('Error executing action:', error);
      alert('Failed to execute action. Please try again.');
    } finally {
      setExecutingActions(prev => {
        const next = new Set(prev);
        next.delete(action.id);
        return next;
      });
    }
  };

  // Merge action items with their statuses - ensure default is 'todo'
  const actionsWithStatus: ActionWithStatus[] = useMemo(() => {
    if (!insights || !insights.actionItems || !Array.isArray(insights.actionItems)) {
      return [];
    }
    return insights.actionItems.map(action => ({
      ...action,
      status: actionStatuses[action.id] || 'todo' as ActionStatus
    }));
  }, [insights, actionStatuses]);

  // Group actions by status
  const actionsByStatus = useMemo(() => {
    const grouped: Record<ActionStatus, ActionWithStatus[]> = {
      'todo': [],
      'in-progress': [],
      'done': []
    };
    
    actionsWithStatus.forEach(action => {
      grouped[action.status].push(action);
    });
    
    // Sort by priority (high first) and then by effort (easy first)
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    const effortOrder = { 'easy': 0, 'medium': 1, 'hard': 2 };
    
    Object.keys(grouped).forEach(status => {
      grouped[status as ActionStatus].sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return effortOrder[a.effort] - effortOrder[b.effort];
      });
    });
    
    return grouped;
  }, [actionsWithStatus]);

  const handleStatusChange = (actionId: string, newStatus: ActionStatus) => {
    updateActionStatus(actionId, newStatus);
  };

  const getCategoryIcon = (category: ActionItem['category']) => {
    const Icon = CATEGORY_ICONS[category] || Target;
    return <Icon className="w-4 h-4" />;
  };

  const ActionCard = ({ action }: { action: ActionWithStatus }) => {
    const CategoryIcon = CATEGORY_ICONS[action.category] || Target;
    
    const handleCardClick = () => {
      // Cycle through statuses: todo -> in-progress -> done -> todo
      const statusCycle: ActionStatus[] = ['todo', 'in-progress', 'done'];
      const currentIndex = statusCycle.indexOf(action.status);
      const nextIndex = (currentIndex + 1) % statusCycle.length;
      handleStatusChange(action.id, statusCycle[nextIndex]);
    };
    
    return (
      <Card 
        onClick={handleCardClick}
        className={`${STATUS_COLORS[action.status]} border-2 transition-all hover:shadow-lg cursor-pointer active:scale-[0.98]`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start gap-2">
            <CategoryIcon className="w-5 h-5 mt-0.5 text-gray-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2">
                {action.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-gray-600 line-clamp-3">
            {action.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
              AI-generated suggestion
            </Badge>
            <Badge className={PRIORITY_COLORS[action.priority]}>
              {action.priority.toUpperCase()}
            </Badge>
            <Badge className={EFFORT_COLORS[action.effort]}>
              {action.effort === 'easy' ? 'Quick Win' : action.effort === 'medium' ? 'Medium Effort' : 'High Effort'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {action.category}
            </Badge>
          </div>
          
          {action.impact && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-1">💡 Impact:</p>
              <p className="text-xs text-gray-600">{action.impact}</p>
            </div>
          )}

          {/* Execution Results - Compact View */}
          {executionResults[action.id] && (
            <div className="pt-2 border-t-2 border-green-300 bg-green-50 rounded-none p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <p className="text-xs font-medium text-green-700">
                    Content Generated Successfully
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingResults(action.id);
                  }}
                  className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-none border border-blue-600 flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3 h-3" />
                  View Results
                </button>
              </div>
              <p className="text-xs text-gray-700 mb-2">{executionResults[action.id].message}</p>
              
              {/* Quick preview of generated content count */}
              {executionResults[action.id].generatedContent && 
               executionResults[action.id].generatedContent.length > 0 && (
<p className="text-xs text-gray-600">
                ✨ {executionResults[action.id].generatedContent.length} piece(s) of content ready to use
              </p>
              )}
              {executionResults[action.id].data && (
                <div className="space-y-2">
                  {/* Display insights/recommendations if available */}
                  {executionResults[action.id].data.insights && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Key Insights:</p>
                      <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.insights.slice(0, 3).map((insight: string, idx: number) => (
                          <li key={idx}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {executionResults[action.id].data.recommendations && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Recommendations:</p>
                      <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {executionResults[action.id].data.contentPlan && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Content Plan:</p>
                      <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.contentPlan.slice(0, 3).map((item: any, idx: number) => (
                          <li key={idx}>{item.title} ({item.priority})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {executionResults[action.id].data.improvementPlan && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Improvement Plan:</p>
                      <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.improvementPlan.slice(0, 3).map((item: any, idx: number) => (
                          <li key={idx}>{item.action} - {item.impact}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {executionResults[action.id].data.checklist && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Technical Checklist:</p>
                      <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.checklist.slice(0, 3).map((item: any, idx: number) => (
                          <li key={idx}>{item.item} ({item.priority})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Generated Content */}
                  {executionResults[action.id].generatedContent && 
                   executionResults[action.id].generatedContent.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-300">
                      <p className="text-xs font-medium text-green-700 mb-2">
                        ✨ Generated Content (Ready to Use):
                      </p>
                      <div className="space-y-2">
                        {executionResults[action.id].generatedContent.map((content: any, idx: number) => {
                          const contentId = `${action.id}-content-${idx}`;
                          const isCopied = copiedContent.has(contentId);
                          
                          return (
                            <div key={idx} className="bg-white rounded-none p-3 border-2 border-gray-200">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="text-xs font-semibold text-gray-900 mb-1">
                                    {content.title}
                                  </h4>
                                  <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                                    <span className="px-2 py-0.5 bg-blue-100 rounded-none border border-blue-200">
                                      {content.type}
                                    </span>
                                    <span>{content.wordCount} words</span>
                                    {content.readyToPublish && (
                                      <span className="px-2 py-0.5 bg-green-100 rounded-none border border-green-200 text-green-700">
                                        Ready
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1 ml-2">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(content.content);
                                      setCopiedContent(prev => new Set(prev).add(contentId));
                                      setTimeout(() => {
                                        setCopiedContent(prev => {
                                          const next = new Set(prev);
                                          next.delete(contentId);
                                          return next;
                                        });
                                      }, 2000);
                                    }}
                                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-none transition-colors"
                                    title="Copy content"
                                  >
                                    {isCopied ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      const blob = new Blob([content.content], { type: 'text/plain' });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                    }}
                                    className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-none transition-colors"
                                    title="Download as TXT"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        const { jsPDF } = await import('jspdf');
                                        const doc = new jsPDF({
                                          orientation: 'portrait',
                                          unit: 'mm',
                                          format: 'a4'
                                        });

                                        doc.setFont('helvetica', 'normal');
                                        doc.setFontSize(16);
                                        
                                        const title = content.title;
                                        const titleLines = doc.splitTextToSize(title, 180);
                                        doc.text(titleLines, 20, 20);
                                        
                                        let yPos = 30;
                                        if (content.metaDescription) {
                                          doc.setFontSize(10);
                                          doc.setTextColor(100, 100, 100);
                                          const metaLines = doc.splitTextToSize(`Meta: ${content.metaDescription}`, 180);
                                          doc.text(metaLines, 20, yPos);
                                          yPos += metaLines.length * 5 + 5;
                                        }
                                        
                                        doc.setFontSize(11);
                                        doc.setTextColor(0, 0, 0);
                                        const contentLines = doc.splitTextToSize(content.content, 180);
                                        
                                        let pageHeight = doc.internal.pageSize.height;
                                        let margin = 20;
                                        let lineHeight = 6;
                                        
                                        for (let i = 0; i < contentLines.length; i++) {
                                          if (yPos + lineHeight > pageHeight - margin) {
                                            doc.addPage();
                                            yPos = margin;
                                          }
                                          doc.text(contentLines[i], 20, yPos);
                                          yPos += lineHeight;
                                        }
                                        
                                        const pageCount = doc.internal.pages.length - 1;
                                        for (let i = 1; i <= pageCount; i++) {
                                          doc.setPage(i);
                                          doc.setFontSize(8);
                                          doc.setTextColor(150, 150, 150);
                                          doc.text(
                                            `Page ${i} of ${pageCount} - Generated by AI Brand Track`,
                                            105,
                                            pageHeight - 10,
                                            { align: 'center' }
                                          );
                                        }
                                        
                                        doc.save(`${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
                                      } catch (error) {
                                        console.error('Error generating PDF:', error);
                                        alert('Failed to generate PDF. Please try downloading as TXT instead.');
                                      }
                                    }}
                                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-none transition-colors"
                                    title="Download as PDF"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              {content.metaDescription && (
                                <p className="text-xs text-gray-600 mb-2 italic">
                                  {content.metaDescription}
                                </p>
                              )}
                              <details className="mt-2">
                                <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                                  View Content ({content.wordCount} words)
                                </summary>
                                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                                  <pre className="text-xs whitespace-pre-wrap font-sans text-gray-700 max-h-60 overflow-auto">
                                    {content.content}
                                  </pre>
                                </div>
                              </details>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Full details toggle */}
                  <details className="mt-2">
                    <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                      View Full Details
                    </summary>
                    <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                      {JSON.stringify(executionResults[action.id].data, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}
          
          {/* Credit Cost Display */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-1">
              <span className="font-medium">Generate Content</span> • <span className="font-semibold text-purple-600">{CREDITS_PER_ACTION} credits</span> • You have <span className="font-semibold text-blue-600">{remainingCredits}</span>
            </p>
          </div>
          
          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            {/* Execute Button */}
            <button
              onClick={() => handleExecuteAction(action)}
              disabled={executingActions.has(action.id) || remainingCredits < CREDITS_PER_ACTION}
              className="flex-1 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-none border-2 border-blue-600 hover:border-blue-700 disabled:border-gray-400 transition-all flex items-center justify-center gap-1 font-medium disabled:cursor-not-allowed"
            >
              {executingActions.has(action.id) ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Executing...
                </>
              ) : remainingCredits < CREDITS_PER_ACTION ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  Insufficient Credits
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Execute
                </>
              )}
            </button>
            {action.status !== 'todo' && (
              <button
                onClick={() => handleStatusChange(action.id, 'todo')}
                className="flex-1 text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Circle className="w-3 h-3" />
                To Do
              </button>
            )}
            {action.status !== 'in-progress' && (
              <button
                onClick={() => handleStatusChange(action.id, 'in-progress')}
                className="flex-1 text-xs px-3 py-1.5 bg-blue-200 hover:bg-blue-300 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Clock className="w-3 h-3" />
                In Progress
              </button>
            )}
            {action.status !== 'done' && (
              <button
                onClick={() => handleStatusChange(action.id, 'done')}
                className="flex-1 text-xs px-3 py-1.5 bg-green-200 hover:bg-green-300 rounded transition-colors flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                Done
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const KanbanColumn = ({ 
    status, 
    title, 
    icon: Icon, 
    count, 
    actions 
  }: { 
    status: ActionStatus;
    title: string;
    icon: React.ElementType;
    count: number;
    actions: ActionWithStatus[];
  }) => {
    return (
      <div className="space-y-4">
        <div className={`flex items-center justify-between p-4 rounded-none border-2 ${
          status === 'todo' 
            ? 'bg-gray-100 border-gray-300'
            : status === 'in-progress'
            ? 'bg-blue-50 border-blue-300'
            : 'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${
              status === 'todo' 
                ? 'text-gray-600'
                : status === 'in-progress'
                ? 'text-blue-600'
                : 'text-green-600'
            }`} />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <Badge className={
            status === 'todo'
              ? 'bg-gray-200 text-gray-800'
              : status === 'in-progress'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-green-200 text-green-800'
          }>
            {count}
          </Badge>
        </div>
        
        <div className="space-y-4 min-h-[400px]">
          {actions.length > 0 ? (
            actions.map(action => (
              <ActionCard key={action.id} action={action} />
            ))
          ) : (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="pt-6 text-center text-gray-400">
                <Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {status === 'todo' ? 'No actions to do' : 
                   status === 'in-progress' ? 'No actions in progress' : 
                   'No completed actions'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const todoCount = actionsByStatus['todo'].length;
  const inProgressCount = actionsByStatus['in-progress'].length;
  const doneCount = actionsByStatus['done'].length;
  const totalCount = actionsWithStatus.length;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Safety check: if no brand data, show message
  if (!brandData || !brandName) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No brand data available. Please run an analysis first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sales Message Banner */}
      <Card className="rounded-none border-2 border-blue-200 bg-blue-50 shadow-sm">
        <CardContent className="pt-6 pb-6">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Improve, fix, and act on your AI visibility
            </h2>
            <p className="text-gray-700 text-sm md:text-base mb-2">
              Click &quot;Execute&quot; on any action below and we&apos;ll generate <strong className="text-gray-900">finished, ready-to-publish content</strong> for you.
            </p>
            <div className="mb-4">
              <AnalysisDisclaimer variant="compact" />
            </div>
            <p className="text-gray-600 text-xs md:text-sm">
              Blog posts, comparison pages, FAQs, landing pages, and more — optimized for SEO. No placeholders — just finished content you can copy, download, and publish.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Header Stats - front-page style: rounded-none, border-2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-none border-2 border-gray-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Actions</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-none border-2 border-gray-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-gray-900">{todoCount}</p>
              </div>
              <Circle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-none border-2 border-gray-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-none border-2 border-gray-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{doneCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="rounded-none border-2 border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Overall Progress</CardTitle>
            <span className="text-2xl font-bold text-blue-600">{completionRate}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-none h-4 overflow-hidden">
            <div 
              className="bg-blue-600 h-4 rounded-none transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${completionRate}%` }}
            >
              {completionRate > 10 && (
                <span className="text-xs font-semibold text-white">{completionRate}%</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KanbanColumn
          status="todo"
          title="To Do"
          icon={Circle}
          count={todoCount}
          actions={actionsByStatus['todo']}
        />
        
        <KanbanColumn
          status="in-progress"
          title="In Progress"
          icon={Clock}
          count={inProgressCount}
          actions={actionsByStatus['in-progress']}
        />
        
        <KanbanColumn
          status="done"
          title="Done"
          icon={CheckCircle2}
          count={doneCount}
          actions={actionsByStatus['done']}
        />
      </div>

      {/* Results Modal - Premium Design */}
      {viewingResults && executionResults[viewingResults] && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setViewingResults(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    ✨ Generated Content Ready to Use
                  </h2>
                  <p className="text-sm text-white/90">
                    {executionResults[viewingResults].message}
                  </p>
                </div>
                <button
                  onClick={() => setViewingResults(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50">
              {/* Generated Content Section - SHOW FIRST AND PROMINENTLY */}
              {executionResults[viewingResults].generatedContent && 
               executionResults[viewingResults].generatedContent.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      Your Generated Content
                    </h3>
                    <p className="text-gray-600">
                      {executionResults[viewingResults].generatedContent.length} piece{executionResults[viewingResults].generatedContent.length !== 1 ? 's' : ''} of finished, ready-to-publish content
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {executionResults[viewingResults].generatedContent.map((content: any, idx: number) => {
                      const contentId = `${viewingResults}-content-${idx}`;
                      const isCopied = copiedContent.has(contentId);
                      
                      return (
                        <div key={idx} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                          {/* Content Header */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-3">
                                  {content.title}
                                </h4>
                                <div className="flex flex-wrap gap-3 items-center">
                                  <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-medium">
                                    {content.type}
                                  </Badge>
                                  <span className="text-sm font-medium text-gray-600">
                                    📝 {content.wordCount.toLocaleString()} words
                                  </span>
                                  {content.readyToPublish && (
                                    <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-medium">
                                      ✅ Ready to Publish
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-3 ml-6">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(content.content);
                                    setCopiedContent(prev => new Set(prev).add(contentId));
                                    setTimeout(() => {
                                      setCopiedContent(prev => {
                                        const next = new Set(prev);
                                        next.delete(contentId);
                                        return next;
                                      });
                                    }, 2000);
                                  }}
                                  className={`px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                                    isCopied 
                                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                                  }`}
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-5 h-5" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-5 h-5" />
                                      Copy All
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    const blob = new Blob([content.content], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                  }}
                                  className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                                >
                                  <Download className="w-5 h-5" />
                                  Download TXT
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      const { jsPDF } = await import('jspdf');
                                      const doc = new jsPDF({
                                        orientation: 'portrait',
                                        unit: 'mm',
                                        format: 'a4'
                                      });

                                      // Set font
                                      doc.setFont('helvetica', 'normal');
                                      doc.setFontSize(16);
                                      
                                      // Title
                                      const title = content.title;
                                      const titleLines = doc.splitTextToSize(title, 180);
                                      doc.text(titleLines, 20, 20);
                                      
                                      // Meta description if available
                                      let yPos = 30;
                                      if (content.metaDescription) {
                                        doc.setFontSize(10);
                                        doc.setTextColor(100, 100, 100);
                                        const metaLines = doc.splitTextToSize(`Meta: ${content.metaDescription}`, 180);
                                        doc.text(metaLines, 20, yPos);
                                        yPos += metaLines.length * 5 + 5;
                                      }
                                      
                                      // Content
                                      doc.setFontSize(11);
                                      doc.setTextColor(0, 0, 0);
                                      const contentLines = doc.splitTextToSize(content.content, 180);
                                      
                                      let pageHeight = doc.internal.pageSize.height;
                                      let margin = 20;
                                      let lineHeight = 6;
                                      
                                      for (let i = 0; i < contentLines.length; i++) {
                                        if (yPos + lineHeight > pageHeight - margin) {
                                          doc.addPage();
                                          yPos = margin;
                                        }
                                        doc.text(contentLines[i], 20, yPos);
                                        yPos += lineHeight;
                                      }
                                      
                                      // Footer
                                      const pageCount = doc.internal.pages.length - 1;
                                      for (let i = 1; i <= pageCount; i++) {
                                        doc.setPage(i);
                                        doc.setFontSize(8);
                                        doc.setTextColor(150, 150, 150);
                                        doc.text(
                                          `Page ${i} of ${pageCount} - Generated by AI Brand Track`,
                                          105,
                                          pageHeight - 10,
                                          { align: 'center' }
                                        );
                                      }
                                      
                                      // Save
                                      doc.save(`${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
                                    } catch (error) {
                                      console.error('Error generating PDF:', error);
                                      alert('Failed to generate PDF. Please try downloading as TXT instead.');
                                    }
                                  }}
                                  className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                                >
                                  <FileText className="w-5 h-5" />
                                  Download PDF
                                </button>
                              </div>
                            </div>
                            
                            {content.metaDescription && (
                              <div className="mt-4 p-4 bg-white/60 rounded-lg border-l-4 border-blue-600">
                                <p className="text-sm font-medium text-gray-700">
                                  <span className="font-bold">Meta Description:</span> {content.metaDescription}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Content Body */}
                          <div className="p-6">
                            <div className="prose prose-sm max-w-none">
                              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-gray-800 max-h-[500px] overflow-auto">
                                  {content.content}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Content Generated Yet
                  </h3>
                  <p className="text-gray-600">
                    Content generation may still be in progress or encountered an issue.
                  </p>
                </div>
              )}

              {/* Additional Insights Section - Secondary */}
              {executionResults[viewingResults].data && (
                <div className="mt-8 pt-8 border-t-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Additional Insights & Recommendations</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {executionResults[viewingResults].data.insights && executionResults[viewingResults].data.insights.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Key Insights
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-700">
                          {executionResults[viewingResults].data.insights.map((insight: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {executionResults[viewingResults].data.recommendations && executionResults[viewingResults].data.recommendations.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-500" />
                          Recommendations
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-700">
                          {executionResults[viewingResults].data.recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
