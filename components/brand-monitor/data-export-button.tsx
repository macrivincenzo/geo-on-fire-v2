'use client';

import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, ExternalLink, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface DataExportButtonProps {
  analysisId: string | null;
  brandName?: string;
  analysisData?: any; // Current analysis data if not saved yet
}

export function DataExportButton({ analysisId, brandName, analysisData }: DataExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format: 'json' | 'csv') => {
    // If we have analysisId, use the API endpoint
    if (analysisId) {
      setIsExporting(true);
      try {
        const response = await fetch(
          `/api/brand-monitor/export?analysisId=${analysisId}&format=${format}`
        );
        
        if (!response.ok) {
          throw new Error('Export failed');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : `brand-analysis-${analysisId}-${Date.now()}.${format}`;
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export data. Please try again.');
      } finally {
        setIsExporting(false);
      }
      return;
    }
    
    // If no analysisId but we have current analysis data, export directly
    if (analysisData) {
      setIsExporting(true);
      try {
        const { prepareExportData, convertToCSV, convertToJSON } = await import('@/lib/export-utils');
        
        const exportData = prepareExportData(
          analysisData,
          { id: '', name: brandName || 'Unknown Brand', url: '' },
          undefined
        );
        
        const content = format === 'csv' 
          ? convertToCSV(exportData)
          : convertToJSON(exportData);
        
        const blob = new Blob([content], { 
          type: format === 'csv' ? 'text/csv' : 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `brand-analysis-${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export data. Please try again.');
      } finally {
        setIsExporting(false);
      }
      return;
    }
    
    alert('No analysis data available to export');
  };
  
  const handleLookerStudio = () => {
    if (!analysisId) {
      alert('Looker Studio connection requires a saved analysis. Please save your analysis first.');
      return;
    }
    
    // Open Looker Studio connector URL
    const connectorUrl = `${window.location.origin}/api/brand-monitor/looker-studio?analysisId=${analysisId}`;
    window.open(
      `https://datastudio.google.com/datasources/create?connectorId=${encodeURIComponent(connectorUrl)}`,
      '_blank'
    );
  };
  
  // Show button if we have either analysisId or current analysis data
  if (!analysisId && !analysisData) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          className="gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export Data
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          className="gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('json')}
          disabled={isExporting}
          className="gap-2"
        >
          <FileJson className="h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLookerStudio}
          disabled={isExporting}
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Connect to Looker Studio
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
