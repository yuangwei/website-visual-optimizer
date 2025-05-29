'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ChatInterface } from '@/components/chat-interface';
import { WebsiteData, RedesignedContent, ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';
import { ArrowLeft, Eye, EyeOff, Download, MessageSquare } from 'lucide-react';
import Link from 'next/link';

// Tab component
interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; icon: React.ReactNode }[];
}

function Tabs({ activeTab, onTabChange, tabs }: TabsProps) {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// New site preview component
function NewSitePreview({ redesignedContent, isLoading }: { redesignedContent: RedesignedContent | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Generating modern design...</p>
        </div>
      </div>
    );
  }

  if (!redesignedContent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Eye className="mx-auto h-12 w-12 mb-3 opacity-50" />
          <p>The redesigned website will appear here after completion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Redesign</h3>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">✅ Responsive Design</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">✅ TailwindCSS</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">✅ Modern</span>
        </div>
      </div>
      <div className="flex-1 bg-white border rounded-lg overflow-hidden">
        <iframe
          srcDoc={redesignedContent.html}
          className="w-full h-full"
          title="Redesigned Website Preview"
        />
      </div>
    </div>
  );
}

// Old site preview component
function OldSitePreview({ originalData }: { originalData: WebsiteData | null }) {
  if (!originalData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <EyeOff className="mx-auto h-12 w-12 mb-3 opacity-50" />
          <p>Loading original website data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Original Website</h3>
        <p className="text-sm text-gray-600">{originalData.title}</p>
        <p className="text-xs text-gray-500 truncate">{originalData.url}</p>
      </div>
      <div className="flex-1 bg-gray-50 border rounded-lg overflow-hidden">
        <iframe
          src={originalData.url}
          className="w-full h-full"
          title="Original Website Preview"
        />
      </div>
    </div>
  );
}

// Download section component
function DownloadSection({ redesignedContent, originalUrl }: { redesignedContent: RedesignedContent | null; originalUrl: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    if (!redesignedContent) return;

    setIsDownloading(true);
    setDownloadComplete(false);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      alert('Download failed, please try again');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!redesignedContent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Download className="mx-auto h-12 w-12 mb-3 opacity-50" />
          <p>Code package will be available after redesign completion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Code Package</h3>
        <p className="text-sm text-gray-600">Get complete HTML, CSS, and JavaScript files</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
              <span className="text-orange-600 text-xs font-bold">H</span>
            </div>
            <div>
              <p className="font-medium text-sm">index.html</p>
              <p className="text-xs text-gray-600">Modern HTML5 structure</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">C</span>
            </div>
            <div>
              <p className="font-medium text-sm">styles.css</p>
              <p className="text-xs text-gray-600">Custom styles</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
              <span className="text-purple-600 text-xs font-bold">J</span>
            </div>
            <div>
              <p className="font-medium text-sm">script.js</p>
              <p className="text-xs text-gray-600">Modern JavaScript</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-600 text-xs font-bold">R</span>
            </div>
            <div>
              <p className="font-medium text-sm">README.md</p>
              <p className="text-xs text-gray-600">Usage instructions</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={isDownloading || downloadComplete}
        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
      >
        {isDownloading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            Preparing download...
          </span>
        ) : downloadComplete ? (
          '✅ Download Complete!'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Download Complete Package
          </span>
        )}
      </button>
    </div>
  );
}

// Main page component
function RedesignPageContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState<WebsiteData | null>(null);
  const [redesignedContent, setRedesignedContent] = useState<RedesignedContent | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState('new-site');

  const tabs = [
    { id: 'new-site', label: 'New Preview', icon: <Eye className="h-4 w-4" /> },
    { id: 'old-site', label: 'Original', icon: <EyeOff className="h-4 w-4" /> },
    { id: 'download', label: 'Download', icon: <Download className="h-4 w-4" /> },
  ];

  useEffect(() => {
    if (url) {
      handleUrlSubmit(url);
    }
  }, [url]);

  const handleUrlSubmit = async (submitUrl: string) => {
    setIsLoading(true);

    const initialMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: `🚀 Starting website analysis: **${submitUrl}**\n\nProcessing:\n1. 🕷️ Website content scraping\n2. 🔍 Design analysis\n3. ⚡ Code generation\n4. ✨ Modern styling application`,
      timestamp: new Date(),
    };
    setChatMessages([initialMessage]);

    try {
      // Scrape website
      const scrapeResponse = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submitUrl }),
      });

      const scrapeResult = await scrapeResponse.json();
      if (!scrapeResult.success) {
        throw new Error(scrapeResult.error);
      }

      setOriginalData(scrapeResult.data);

      const scrapeMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `✅ Website scraping completed: **${scrapeResult.data.title}**\n\nSuccessfully extracted HTML structure, styles, and ${scrapeResult.data.images.length} images. Generating modern design...`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, scrapeMessage]);

      // Generate redesign
      const redesignResponse = await fetch('/api/redesign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteData: scrapeResult.data,
          userFeedback: ''
        }),
      });

      const redesignResult = await redesignResponse.json();
      if (!redesignResult.success) {
        throw new Error(redesignResult.error);
      }

      setRedesignedContent(redesignResult.content);

      const completionMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `✨ **Modern redesign completed!**\n\nCreated a new website with the following features:\n- ✅ Semantic HTML5 structure\n- ✅ TailwindCSS responsive styling\n- ✅ Modern JavaScript interactions\n- ✅ Mobile optimization\n\nYou can view the results on the right or provide feedback for adjustments.`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, completionMessage]);

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `❌ **Processing error**: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check if the URL is correct or if the website is accessible.`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatMessage = async (message: string) => {
    if (!originalData || !redesignedContent) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '📝 Received your feedback, regenerating design...',
      timestamp: new Date(),
      isLoading: true,
    };

    setChatMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const redesignResponse = await fetch('/api/redesign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteData: originalData,
          userFeedback: message
        }),
      });

      const redesignResult = await redesignResponse.json();
      if (!redesignResult.success) {
        throw new Error(redesignResult.error);
      }

      setRedesignedContent(redesignResult.content);

      const successMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `✅ **Design updated!**\n\nAdjusted the design based on your feedback. Please check the new preview on the right.\n\nFeel free to provide more feedback for further adjustments!`,
        timestamp: new Date(),
      };

      setChatMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = successMessage;
        return newMessages;
      });

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `❌ **Failed to apply feedback**: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try rephrasing your requirements.`,
        timestamp: new Date(),
      };

      setChatMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = errorMessage;
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-900">AI Website Redesign Workspace</h1>
          </div>
          {url && (
            <div className="text-sm text-gray-600">
              Processing: <span className="font-medium">{url}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Chat */}
        <div className="w-1/2 border-r border-gray-200 bg-white">
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900">AI Design Assistant</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Chat with AI to optimize your website design</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleChatMessage}
                isLoading={isLoading}
                disabled={isLoading || !redesignedContent}
              />
            </div>
          </div>
        </div>

        {/* Right Content - Tabs */}
        <div className="w-1/2 bg-white">
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
            </div>
            <div className="flex-1 p-6 overflow-hidden">
              {activeTab === 'new-site' && (
                <NewSitePreview redesignedContent={redesignedContent} isLoading={isLoading} />
              )}
              {activeTab === 'old-site' && (
                <OldSitePreview originalData={originalData} />
              )}
              {activeTab === 'download' && (
                <DownloadSection redesignedContent={redesignedContent} originalUrl={url} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RedesignPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedesignPageContent />
    </Suspense>
  );
}