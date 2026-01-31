'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  BarChart3,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

interface HistoricalTrackingTabProps {
  analysisId: string | null;
  brandName: string;
  brandUrl?: string; // Optional: for tracking by URL instead of analysis ID
}

interface Snapshot {
  id: string;
  visibilityScore: number | null;
  sentimentScore: number | null;
  shareOfVoice: number | null;
  averagePosition: number | null;
  rank: number | null;
  snapshotDate: string | Date;
}

interface Trends {
  visibilityScore: { current: number; previous: number; change: number; trend: 'up' | 'down' | 'stable' };
  sentimentScore: { current: number; previous: number; change: number; trend: 'up' | 'down' | 'stable' };
  shareOfVoice: { current: number; previous: number; change: number; trend: 'up' | 'down' | 'stable' };
  rank: { current: number | null; previous: number | null; change: number | null; trend: 'up' | 'down' | 'stable' };
}

type DateRange = '7d' | '30d' | '90d' | 'all' | 'custom';

export function HistoricalTrackingTab({ analysisId, brandName, brandUrl }: HistoricalTrackingTabProps) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [trends, setTrends] = useState<Trends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Debug log
  useEffect(() => {
    console.log('[Historical Tracking] Component mounted:', { analysisId, brandName, brandUrl });
  }, []);

  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    let start: Date;
    
    switch (dateRange) {
      case '7d':
        start = subDays(end, 7);
        break;
      case '30d':
        start = subDays(end, 30);
        break;
      case '90d':
        start = subDays(end, 90);
        break;
      case 'custom':
        start = customStartDate ? parseISO(customStartDate) : subDays(end, 30);
        end = customEndDate ? parseISO(customEndDate) : new Date();
        break;
      default:
        start = new Date(0); // All time
    }
    
    return { startDate: start, endDate: end };
  }, [dateRange, customStartDate, customEndDate]);

  // Fetch historical data
  useEffect(() => {
    if (!analysisId && !brandUrl) {
      setLoading(false);
      return;
    }

    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          ...(analysisId ? { analysisId } : {}),
          ...(brandUrl ? { url: brandUrl } : {}),
          ...(dateRange !== 'all' && {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          }),
        });

        const response = await fetch(`/api/brand-monitor/historical?${params}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch historical data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setSnapshots(data.snapshots || []);
        setTrends(data.trends || null);
      } catch (error: any) {
        console.error('Error fetching historical data:', error);
        setError(error?.message || 'Failed to load historical data');
        // Set empty snapshots on error so UI can show appropriate message
        setSnapshots([]);
        setTrends(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [analysisId, brandUrl, startDate, endDate, dateRange]);

  // Format data for charts
  const chartData = useMemo(() => {
    return snapshots
      .map(snapshot => ({
        date: format(new Date(snapshot.snapshotDate), 'MMM dd'),
        fullDate: format(new Date(snapshot.snapshotDate), 'yyyy-MM-dd'),
        visibility: snapshot.visibilityScore ?? 0,
        sentiment: snapshot.sentimentScore ?? 0,
        shareOfVoice: snapshot.shareOfVoice ?? 0,
        rank: snapshot.rank ?? null,
        averagePosition: snapshot.averagePosition ?? null,
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [snapshots]);

  const TrendIndicator = ({ trend, change, isRank = false }: { trend: 'up' | 'down' | 'stable'; change: number | null; isRank?: boolean }) => {
    if (change === null || change === 0) {
      return <Minus className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
    }

    // For rank, lower is better (inverse logic)
    const isPositive = isRank ? change > 0 : change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className="flex items-center gap-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className={`text-sm font-medium ${color}`}>
          {isPositive ? '+' : ''}{change}{isRank ? '' : '%'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading historical data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Tracking</CardTitle>
          <CardDescription>Track your brand metrics over time</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please check the console for more details or try refreshing the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisId && !brandUrl) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No analysis selected. Run an analysis to see historical tracking.</p>
        </CardContent>
      </Card>
    );
  }

  if (snapshots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Tracking</CardTitle>
          <CardDescription>Track your brand metrics over time</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center">
          <Activity className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No historical data yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Run more analyses to start tracking trends. Each analysis creates a snapshot of your metrics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Picker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historical Tracking</CardTitle>
              <CardDescription>
                Track {brandName}'s performance metrics over time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
                <option value="custom">Custom range</option>
              </select>
              {dateRange === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Trend Indicators */}
      {trends && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Visibility Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{trends.visibilityScore.current}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Previous: {trends.visibilityScore.previous}%
                  </p>
                </div>
                <TrendIndicator 
                  trend={trends.visibilityScore.trend} 
                  change={trends.visibilityScore.change} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sentiment Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{trends.sentimentScore.current}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Previous: {trends.sentimentScore.previous}%
                  </p>
                </div>
                <TrendIndicator 
                  trend={trends.sentimentScore.trend} 
                  change={trends.sentimentScore.change} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Share of Voice</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{trends.shareOfVoice.current}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Previous: {trends.shareOfVoice.previous}%
                  </p>
                </div>
                <TrendIndicator 
                  trend={trends.shareOfVoice.trend} 
                  change={trends.shareOfVoice.change} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rank</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {trends.rank.current ? `#${trends.rank.current}` : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {trends.rank.previous ? `Previous: #${trends.rank.previous}` : 'No previous data'}
                  </p>
                </div>
                <TrendIndicator 
                  trend={trends.rank.trend} 
                  change={trends.rank.change} 
                  isRank={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Visibility Score Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Visibility Score Over Time
          </CardTitle>
          <CardDescription>
            Track how often AI recommends your brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="visibilityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
                label={{ value: 'Visibility %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="visibility" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="url(#visibilityGradient)"
                name="Visibility Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sentiment & Share of Voice Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Sentiment Score Over Time
            </CardTitle>
            <CardDescription>
              Track brand sentiment in AI responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Sentiment Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Share of Voice Over Time
            </CardTitle>
            <CardDescription>
              Your brand's share compared to competitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="shareOfVoice" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  name="Share of Voice"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Chart */}
      {chartData.some(d => d.rank !== null) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Ranking Over Time
            </CardTitle>
            <CardDescription>
              Your position in competitive rankings (lower is better)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.filter(d => d.rank !== null)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  reversed
                  label={{ value: 'Rank (1 = best)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `#${value}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="rank" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  name="Rank"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Snapshot Summary</CardTitle>
          <CardDescription>
            {snapshots.length} snapshot{snapshots.length !== 1 ? 's' : ''} in selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {Math.max(...snapshots.map(s => s.visibilityScore ?? 0))}%
              </p>
              <p className="text-sm text-gray-600">Peak Visibility</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {Math.max(...snapshots.map(s => s.sentimentScore ?? 0))}%
              </p>
              <p className="text-sm text-gray-600">Peak Sentiment</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {Math.max(...snapshots.map(s => s.shareOfVoice ?? 0))}%
              </p>
              <p className="text-sm text-gray-600">Peak Share of Voice</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {Math.min(...snapshots.filter(s => s.rank !== null).map(s => s.rank ?? 999))}
              </p>
              <p className="text-sm text-gray-600">Best Rank</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

