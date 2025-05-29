'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { isValidUrl } from '@/lib/utils';
import { Loader2, Globe, AlertCircle, Sparkles, Zap, Code, Palette } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
    setIsLoading(true);

    // Navigate to redesign page with URL parameter
    router.push(`/redesign?url=${encodeURIComponent(url)}`);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (error) {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="pt-20 pb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Website Visual
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Optimizer Agent
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Transform any outdated website into a modern, responsive design using AI technology.
                Simply enter a URL and watch our intelligent agent create beautiful, professional redesigns.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-center">Automatically analyze website structure and design, generating modern improvement suggestions</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Modern Tech Stack</h3>
                <p className="text-gray-600 text-center">Using the latest HTML5, TailwindCSS, and modern JavaScript technologies</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Interactive Optimization</h3>
                <p className="text-gray-600 text-center">Multi-round design adjustments and optimization through conversational interface</p>
              </div>
            </div>

            {/* URL Input Form */}
            <Card className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <Globe className="mx-auto h-12 w-12 text-blue-600 mb-3" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Start Your Website Transformation
                  </h2>
                  <p className="text-gray-600">
                    Enter any website URL and let AI create a modern design for you
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Input
                      type="url"
                      placeholder="Enter website URL (e.g., https://example.com)"
                      value={url}
                      onChange={handleUrlChange}
                      disabled={isLoading}
                      className={`h-14 text-lg px-6 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200'}`}
                    />
                    {error && (
                      <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Starting AI Redesign...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        Start AI Redesign
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Example URLs */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3 text-center">Or try these example websites:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'https://google.com',
                    'https://berkshirehathaway.com',
                    'https://motherfuckingwebsite.com'
                  ].map((exampleUrl) => (
                    <button
                      key={exampleUrl}
                      onClick={() => setUrl(exampleUrl)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800 transition-colors"
                      disabled={isLoading}
                    >
                      {exampleUrl}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-8 text-center">
          <p className="text-gray-500 text-sm">
            AI-Powered Website Visual Optimization Tool • Modern Design • Responsive Layout
          </p>
        </div>
      </div>
    </div>
  );
}