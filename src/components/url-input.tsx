'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { isValidUrl } from '@/lib/utils';
import { Loader2, Globe, AlertCircle } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function URLInput({ onSubmit, isLoading = false, disabled = false }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setError('');
    onSubmit(url);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="text-center mb-6">
        <Globe className="mx-auto h-12 w-12 text-blue-600 mb-3" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Website Visual Optimizer Agent
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform any outdated website into a modern, responsive design using AI.
          Simply enter a URL and watch as our agent creates a beautiful, professional redesign.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={handleUrlChange}
              disabled={disabled || isLoading}
              className={`h-12 text-lg ${error ? 'border-red-300 focus:border-red-500' : ''}`}
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={disabled || isLoading || !url.trim()}
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Redesign Website'
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Modern, responsive design</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>TailwindCSS styling</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>AI-powered optimization</span>
        </div>
      </div>
    </Card>
  );
} 