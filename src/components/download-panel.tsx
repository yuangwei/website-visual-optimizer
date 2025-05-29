'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RedesignedContent } from '@/types';
import { Download, FileText, Code, Palette, Loader2, CheckCircle, RotateCcw } from 'lucide-react';

interface DownloadPanelProps {
  redesignedContent: RedesignedContent | null;
  originalUrl?: string;
  onReset: () => void;
  disabled?: boolean;
}

export function DownloadPanel({
  redesignedContent,
  originalUrl,
  onReset,
  disabled = false
}: DownloadPanelProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    if (!redesignedContent) return;

    setIsDownloading(true);
    setDownloadComplete(false);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: redesignedContent,
          metadata: {
            sourceUrl: originalUrl,
            generatedAt: new Date().toISOString(),
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadComplete(true);
        setTimeout(() => setDownloadComplete(false), 3000);
      } else {
        throw new Error(result.error || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!redesignedContent) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Download className="mx-auto h-12 w-12 mb-3 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Download Package</h3>
          <p>Complete the website redesign to download your modern code package</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Download className="h-8 w-8 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Ready to Download</h3>
          </div>
          <p className="text-gray-600">
            Your modern website redesign is complete and ready for download
          </p>
        </div>

        {/* Package Contents */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            Package Contents
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-sm">index.html</p>
                <p className="text-xs text-gray-600">Modern HTML5 structure</p>
              </div>
              <Badge variant="outline" className="ml-auto text-green-600 border-green-200">
                ✓
              </Badge>
            </div>

            {redesignedContent.css && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Palette className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">styles.css</p>
                  <p className="text-xs text-gray-600">Custom styling</p>
                </div>
                <Badge variant="outline" className="ml-auto text-green-600 border-green-200">
                  ✓
                </Badge>
              </div>
            )}

            {redesignedContent.js && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Code className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">script.js</p>
                  <p className="text-xs text-gray-600">Modern JavaScript</p>
                </div>
                <Badge variant="outline" className="ml-auto text-green-600 border-green-200">
                  ✓
                </Badge>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-sm">README.md</p>
                <p className="text-xs text-gray-600">Setup instructions</p>
              </div>
              <Badge variant="outline" className="ml-auto text-green-600 border-green-200">
                ✓
              </Badge>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            Features Included
          </h4>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              📱 Responsive Design
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              🎨 TailwindCSS
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              ♿ Accessible
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              🚀 SEO Optimized
            </Badge>
            <Badge variant="outline" className="text-pink-600 border-pink-200">
              ⚡ Fast Loading
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleDownload}
            disabled={disabled || isDownloading}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing Download...
              </>
            ) : downloadComplete ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Downloaded Successfully!
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download ZIP Package
              </>
            )}
          </Button>

          <Button
            onClick={onReset}
            disabled={disabled || isDownloading}
            variant="outline"
            className="sm:w-auto px-6 h-12 border-gray-300"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>

        {/* Usage Instructions */}
        <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="font-medium text-blue-900 mb-2">Quick Start:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Extract the downloaded ZIP file</li>
            <li>Open index.html in your browser to preview</li>
            <li>Upload files to your web server for production</li>
            <li>Ensure TailwindCSS CDN is accessible</li>
          </ol>
        </div>
      </div>
    </Card>
  );
} 