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
  Users
} from 'lucide-react';
import { AIResponse, CompetitorRanking } from '@/lib/types';
import { ActionItem, generateStrategicInsights } from '@/lib/strategic-insights';

interface BoostActionsTabProps {
  brandData: CompetitorRanking;
  competitors: CompetitorRanking[];
  responses: AIResponse[];
  brandName: string;
  analysisId: string | null;
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
  analysisId
}: BoostActionsTabProps) {
  // Generate action items from insights
  const insights = useMemo(() => {
    return generateStrategicInsights(brandData, competitors, responses, brandName);
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

  // Merge action items with their statuses - ensure default is 'todo'
  const actionsWithStatus: ActionWithStatus[] = useMemo(() => {
    return insights.actionItems.map(action => ({
      ...action,
      status: actionStatuses[action.id] || 'todo' as ActionStatus
    }));
  }, [insights.actionItems, actionStatuses]);

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
          
          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
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

  return (
    <div className="space-y-6 animate-fade-in">
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
    </div>
  );
}
