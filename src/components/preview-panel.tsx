'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WebsiteData, RedesignedContent } from '@/types';
import { Eye, Code, Smartphone, Monitor } from 'lucide-react';

interface PreviewPanelProps {
  originalData: WebsiteData | null;
  redesignedContent: RedesignedContent | null;
  isLoading?: boolean;
}

export function PreviewPanel({ originalData, redesignedContent, isLoading = false }: PreviewPanelProps) {
  if (!originalData && !redesignedContent) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <Eye className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Original Website</h3>
            <p>Enter a URL to see the original website here</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <Code className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Redesigned Website</h3>
            <p>The modern redesign will appear here</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Original Website Panel */}
      <Card className="flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Original Website</h3>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Legacy Design
            </Badge>
          </div>
          {originalData && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">{originalData.title}</p>
              <p className="truncate">{originalData.url}</p>
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          {originalData ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Monitor className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">Original Website Preview</p>
                  <p className="text-xs mt-1">Scraped: {originalData.images.length} images</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <p className="text-gray-600 truncate">{originalData.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Images:</span>
                  <p className="text-gray-600">{originalData.images.length} found</p>
                </div>
              </div>

              {originalData.description && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-600 mt-1">{originalData.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No original data available</p>
            </div>
          )}
        </div>
      </Card>

      {/* Redesigned Website Panel */}
      <Card className="flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Redesigned Website</h3>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Modern Design
            </Badge>
          </div>
          {redesignedContent && (
            <div className="mt-2 text-sm text-gray-600">
              <p>AI-generated modern design</p>
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center">
                <div className="text-center text-blue-600">
                  <div className="animate-spin mx-auto h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full mb-2"></div>
                  <p className="text-sm font-medium">Generating modern design...</p>
                  <p className="text-xs mt-1">This may take a moment</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-blue-100 rounded animate-pulse"></div>
                <div className="h-4 bg-blue-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-blue-100 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ) : redesignedContent ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-solid border-green-300 flex items-center justify-center">
                <div className="text-center text-green-700">
                  <Smartphone className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm font-medium">Modern Website Preview</p>
                  <p className="text-xs mt-1">Responsive & Optimized</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">HTML:</span>
                  <p className="text-green-600">✓ Generated</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">CSS:</span>
                  <p className="text-green-600">✓ TailwindCSS</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">JavaScript:</span>
                  <p className="text-green-600">✓ Modern ES6+</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Assets:</span>
                  <p className="text-green-600">✓ {redesignedContent.assets.length} files</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Responsive
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Accessible
                </Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  SEO Optimized
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Code className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Redesigned version will appear here</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 