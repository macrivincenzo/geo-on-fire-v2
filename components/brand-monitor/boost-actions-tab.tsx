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
  'todo': 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700',
  'in-progress': 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
  'done': 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
};

const PRIORITY_COLORS = {
  'high': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'low': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
};

const EFFORT_COLORS = {
  'easy': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'hard': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
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
        setExecutionResults(prev => ({
          ...prev,
          [action.id]: result
        }));
        // Don't auto-move - let user control workflow
        // User can manually move to "In Progress" when they're ready to work on it
      } else {
        alert(`Action execution failed: ${result.error || result.message}`);
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
            <CategoryIcon className="w-5 h-5 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                {action.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
            {action.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
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
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">💡 Impact:</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{action.impact}</p>
            </div>
          )}

          {/* Execution Results - Compact View */}
          {executionResults[action.id] && (
            <div className="pt-2 border-t border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <p className="text-xs font-medium text-green-700 dark:text-green-300">
                    Content Generated Successfully
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingResults(action.id);
                  }}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3 h-3" />
                  View Results
                </button>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">{executionResults[action.id].message}</p>
              
              {/* Quick preview of generated content count */}
              {executionResults[action.id].generatedContent && 
               executionResults[action.id].generatedContent.length > 0 && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ✨ {executionResults[action.id].generatedContent.length} piece(s) of content ready to use
                </p>
              )}
              {executionResults[action.id].data && (
                <div className="space-y-2">
                  {/* Display insights/recommendations if available */}
                  {executionResults[action.id].data.insights && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Key Insights:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.insights.slice(0, 3).map((insight: string, idx: number) => (
                          <li key={idx}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {executionResults[action.id].data.recommendations && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Recommendations:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {executionResults[action.id].data.contentPlan && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Content Plan:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.contentPlan.slice(0, 3).map((item: any, idx: number) => (
                          <li key={idx}>{item.title} ({item.priority})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {executionResults[action.id].data.improvementPlan && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Improvement Plan:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.improvementPlan.slice(0, 3).map((item: any, idx: number) => (
                          <li key={idx}>{item.action} - {item.impact}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {executionResults[action.id].data.checklist && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Technical Checklist:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                        {executionResults[action.id].data.checklist.slice(0, 3).map((item: any, idx: number) => (
                          <li key={idx}>{item.item} ({item.priority})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* Generated Content */}
                  {executionResults[action.id].generatedContent && 
                   executionResults[action.id].generatedContent.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-300 dark:border-green-700">
                      <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">
                        ✨ Generated Content (Ready to Use):
                      </p>
                      <div className="space-y-2">
                        {executionResults[action.id].generatedContent.map((content: any, idx: number) => {
                          const contentId = `${action.id}-content-${idx}`;
                          const isCopied = copiedContent.has(contentId);
                          
                          return (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded p-3 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {content.title}
                                  </h4>
                                  <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                                      {content.type}
                                    </span>
                                    <span>{content.wordCount} words</span>
                                    {content.readyToPublish && (
                                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-300">
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
                                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
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
                                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                    title="Download content"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              {content.metaDescription && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">
                                  {content.metaDescription}
                                </p>
                              )}
                              <details className="mt-2">
                                <summary className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                  View Content ({content.wordCount} words)
                                </summary>
                                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                                  <pre className="text-xs whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 max-h-60 overflow-auto">
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
                    <summary className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                      View Full Details
                    </summary>
                    <pre className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-40">
                      {JSON.stringify(executionResults[action.id].data, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            {/* Execute Button */}
            <button
              onClick={() => handleExecuteAction(action)}
              disabled={executingActions.has(action.id)}
              className="flex-1 text-xs px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded transition-all flex items-center justify-center gap-1 font-medium shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              {executingActions.has(action.id) ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Executing...
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
                className="flex-1 text-xs px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Circle className="w-3 h-3" />
                To Do
              </button>
            )}
            {action.status !== 'in-progress' && (
              <button
                onClick={() => handleStatusChange(action.id, 'in-progress')}
                className="flex-1 text-xs px-3 py-1.5 bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Clock className="w-3 h-3" />
                In Progress
              </button>
            )}
            {action.status !== 'done' && (
              <button
                onClick={() => handleStatusChange(action.id, 'done')}
                className="flex-1 text-xs px-3 py-1.5 bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700 rounded transition-colors flex items-center justify-center gap-1"
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
        <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${
          status === 'todo' 
            ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
            : status === 'in-progress'
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
            : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
        }`}>
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${
              status === 'todo' 
                ? 'text-gray-600 dark:text-gray-400'
                : status === 'in-progress'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-green-600 dark:text-green-400'
            }`} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <Badge className={
            status === 'todo'
              ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              : status === 'in-progress'
              ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-300'
              : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-300'
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
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
              <CardContent className="pt-6 text-center text-gray-400 dark:text-gray-600">
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
      <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 border-0 shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              LET US IMPROVE, FIX, ACT ON YOUR AI VISIBILITY
            </h2>
            <p className="text-white/90 text-sm md:text-base mb-2">
              Click "Execute" on any action below and we'll generate <strong className="text-white">finished, ready-to-publish content</strong> for you.
            </p>
            <p className="text-white/80 text-xs md:text-sm">
              ✨ Get complete blog posts, comparison pages, FAQs, landing pages, and more - all optimized for SEO and ready to use. 
              No placeholders, no TODOs - just finished content you can copy, download, and publish immediately.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-300 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Actions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCount}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-300 dark:border-gray-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">To Do</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{todoCount}</p>
              </div>
              <Circle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-300 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{inProgressCount}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-300 dark:border-green-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{doneCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Overall Progress</CardTitle>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completionRate}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
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

      {/* Results Modal */}
      {viewingResults && executionResults[viewingResults] && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingResults(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Generated Content & Results
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {executionResults[viewingResults].message}
                </p>
              </div>
              <button
                onClick={() => setViewingResults(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Generated Content Section */}
              {executionResults[viewingResults].generatedContent && 
               executionResults[viewingResults].generatedContent.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generated Content ({executionResults[viewingResults].generatedContent.length} pieces)
                  </h3>
                  <div className="space-y-4">
                    {executionResults[viewingResults].generatedContent.map((content: any, idx: number) => {
                      const contentId = `${viewingResults}-content-${idx}`;
                      const isCopied = copiedContent.has(contentId);
                      
                      return (
                        <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                {content.title}
                              </h4>
                              <div className="flex flex-wrap gap-2 text-sm">
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  {content.type}
                                </Badge>
                                <span className="text-gray-600 dark:text-gray-400">{content.wordCount} words</span>
                                {content.readyToPublish && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    Ready to Publish
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
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
                                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    Copy
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
                                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          </div>
                          
                          {content.metaDescription && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic border-l-4 border-blue-500 pl-3">
                              {content.metaDescription}
                            </p>
                          )}
                          
                          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                            <pre className="text-sm whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 max-h-96 overflow-auto">
                              {content.content}
                            </pre>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Additional Data Section */}
              {executionResults[viewingResults].data && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Additional Insights</h3>
                  <div className="space-y-4">
                    {executionResults[viewingResults].data.insights && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Insights</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {executionResults[viewingResults].data.insights.map((insight: string, idx: number) => (
                            <li key={idx}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {executionResults[viewingResults].data.recommendations && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {executionResults[viewingResults].data.recommendations.map((rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
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
