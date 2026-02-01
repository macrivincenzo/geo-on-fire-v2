'use client';

import { BrandMonitor, clearBrandMonitorDraft, BRAND_MONITOR_DRAFT_KEY } from '@/components/brand-monitor/brand-monitor';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { useCustomer, useRefreshCustomer } from '@/hooks/useAutumnCustomer';
import { useBrandAnalyses, useBrandAnalysis, useDeleteBrandAnalysis } from '@/hooks/useBrandAnalyses';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useSession } from '@/lib/auth-client';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

// Separate component that uses Autumn hooks
function BrandMonitorContent({ session }: { session: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customer, isLoading, error } = useCustomer({
    skip: !session
  });
  const refreshCustomer = useRefreshCustomer();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);
  // Read draft synchronously on first client render so refresh keeps user on company/competitors step (no flash of empty form)
  const [initialDraft, setInitialDraft] = useState<{ url: string; company: any; identifiedCompetitors: any[] } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(BRAND_MONITOR_DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Queries and mutations
  const { data: analyses, isLoading: analysesLoading } = useBrandAnalyses();
  const { data: currentAnalysis } = useBrandAnalysis(selectedAnalysisId);

  // URL is source of truth: on load and when user uses back/forward, restore selection from URL
  useEffect(() => {
    const id = searchParams.get('analysis');
    setSelectedAnalysisId(id || null);
  }, [searchParams]);

  // When an analysis is selected, clear draft. When none selected, (re)read draft so we can restore after refresh.
  useEffect(() => {
    if (selectedAnalysisId !== null) {
      setInitialDraft(null);
      return;
    }
    if (typeof window === 'undefined') return;
    try {
      const raw = sessionStorage.getItem(BRAND_MONITOR_DRAFT_KEY);
      setInitialDraft(raw ? JSON.parse(raw) : null);
    } catch {
      setInitialDraft(null);
    }
  }, [selectedAnalysisId]);

  const setSelectedAndUpdateUrl = (id: string | null) => {
    setSelectedAnalysisId(id);
    const url = id ? `/brand-monitor?analysis=${encodeURIComponent(id)}` : '/brand-monitor';
    router.replace(url);
  };
  const deleteAnalysis = useDeleteBrandAnalysis();
  
  // Get credits from customer data
  const messageUsage = customer?.features?.messages;
  const credits = messageUsage ? (messageUsage.balance || 0) : 0;

  useEffect(() => {
    // If there's an auth error, redirect to login
    if (error?.code === 'UNAUTHORIZED' || error?.code === 'AUTH_ERROR') {
      router.push('/login?from=/brand-monitor');
    }
  }, [error, router]);

  const handleCreditsUpdate = async () => {
    // Use the global refresh to update customer data everywhere
    await refreshCustomer();
  };
  
  const handleDeleteAnalysis = async (analysisId: string) => {
    setAnalysisToDelete(analysisId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (analysisToDelete) {
      await deleteAnalysis.mutateAsync(analysisToDelete);
      if (selectedAnalysisId === analysisToDelete) {
        setSelectedAndUpdateUrl(null);
      }
      setAnalysisToDelete(null);
    }
  };
  
  const handleNewAnalysis = () => {
    clearBrandMonitorDraft();
    setInitialDraft(null); // so BrandMonitor resets instead of restoring
    setSelectedAndUpdateUrl(null);
  };

  const showingAnalysis = !!selectedAnalysisId;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero: full only when not viewing an analysis; compact when viewing results */}
      {!showingAnalysis ? (
        <section className="relative pt-24 sm:pt-32 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-block mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 rounded-none border border-blue-200 dark:border-blue-800">
                  Track ChatGPT, Claude, Perplexity & Gemini
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                AI Brand
                <br />
                <span className="text-blue-600 dark:text-blue-300">Visibility Monitor</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                Track how AI models rank your brand against competitors. Get actionable insights in 60 seconds.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="pt-20 sm:pt-24 pb-3 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              <span className="text-blue-600 dark:text-blue-300">Visibility Monitor</span>
            </h1>
          </div>
        </section>
      )}

      <div className="flex relative min-h-screen">
        {/* Sidebar Toggle Button - higher when viewing analysis (no big hero) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed z-20 p-2.5 sm:p-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all rounded-none ${
            showingAnalysis ? 'top-24 sm:top-28' : 'top-72 sm:top-80'
          } ${sidebarOpen ? 'left-80 sm:left-[21rem]' : 'left-4'}`}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Sidebar - Clean Minimal */}
        <div className={`${sidebarOpen ? 'w-80 border-r-2 border-gray-200 dark:border-gray-700' : 'w-0'} bg-white dark:bg-gray-800 overflow-hidden flex flex-col transition-all duration-200 fixed left-0 top-0 h-screen z-10`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 mt-16">
            <Button
              onClick={handleNewAnalysis}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-none border-2 border-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>

          <div className="overflow-y-auto flex-1 pb-6">
            {analysesLoading ? (
              <div className="p-4 text-center text-gray-500">Loading analyses...</div>
            ) : analyses?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No analyses yet</div>
            ) : (
              <div className="space-y-1 p-2">
                {analyses?.map((analysis) => (
                  <div
                    key={analysis.id}
                    className={`p-3 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedAnalysisId === analysis.id ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' : ''
                    }`}
                    onClick={() => setSelectedAndUpdateUrl(analysis.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {analysis.companyName || 'Untitled Analysis'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {analysis.url}
                        </p>
                        <p className="text-xs text-gray-400">
                          {analysis.createdAt && format(new Date(analysis.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAnalysis(analysis.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-200 min-w-0 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
          <div className="px-4 sm:px-6 lg:px-8 pt-2 pb-24">
            <BrandMonitor
              creditsAvailable={credits}
              onCreditsUpdate={handleCreditsUpdate}
              selectedAnalysis={selectedAnalysisId ? currentAnalysis : null}
              initialDraft={initialDraft}
              onSaveAnalysis={(analysis) => {
                clearBrandMonitorDraft();
                if (analysis?.id) setSelectedAndUpdateUrl(analysis.id);
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer will be placed here by layout.tsx - it will scroll naturally */}
      
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Analysis"
        description="Are you sure you want to delete this analysis? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        isLoading={deleteAnalysis.isPending}
      />
    </div>
  );
}

export default function BrandMonitorPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login?from=/brand-monitor');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return <BrandMonitorContent session={session} />;
}