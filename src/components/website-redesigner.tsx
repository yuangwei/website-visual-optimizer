'use client';

import { useState } from 'react';
import { URLInput } from './url-input';
import { PreviewPanel } from './preview-panel';
import { ChatInterface } from './chat-interface';
import { DownloadPanel } from './download-panel';
import { WebsiteData, RedesignedContent, ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';

export function WebsiteRedesigner() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [originalData, setOriginalData] = useState<WebsiteData | null>(null);
  const [redesignedContent, setRedesignedContent] = useState<RedesignedContent | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentUrl(url);

    // Add initial system message
    const initialMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: `🚀 Starting website redesign for: **${url}**\n\nI'll analyze the current design and create a modern, responsive version. This process includes:\n1. 🕷️ Website scraping\n2. 🔍 Design analysis\n3. ⚡ Code generation\n4. ✨ Modern styling`,
      timestamp: new Date(),
    };
    setChatMessages([initialMessage]);

    try {
      // Step 1: Scrape website
      const scrapeResponse = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const scrapeResult = await scrapeResponse.json();

      if (!scrapeResult.success) {
        throw new Error(scrapeResult.error || 'Failed to scrape website');
      }

      setOriginalData(scrapeResult.data);

      // Add scrape success message
      const scrapeMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `✅ Successfully scraped website: **${scrapeResult.data.title}**\n\nExtracted content including HTML structure, styles, and ${scrapeResult.data.images.length} images. Now generating modern design...`,
        timestamp: new Date(),
      };
      setChatMessages((prev: ChatMessage[]) => [...prev, scrapeMessage]);

      // Step 2: Generate redesign
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
        throw new Error(redesignResult.error || 'Failed to generate redesign');
      }

      setRedesignedContent(redesignResult.content);

      // Add completion message
      const completionMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `✨ **Modern Website Generated!**\n\nI've created a modern, responsive version of the website using:\n- ✅ Semantic HTML5\n- ✅ TailwindCSS styling\n- ✅ Modern JavaScript\n- ✅ Mobile-responsive design\n\nYou can now review the result and provide feedback for further improvements.`,
        timestamp: new Date(),
      };
      setChatMessages((prev: ChatMessage[]) => [...prev, completionMessage]);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);

      const errorChatMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `❌ **Error occurred**: ${errorMessage}\n\nPlease try again with a different URL or check if the website is accessible.`,
        timestamp: new Date(),
      };
      setChatMessages((prev: ChatMessage[]) => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatMessage = async (message: string) => {
    if (!originalData || !redesignedContent) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Add loading assistant message
    const loadingMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '📝 Thanks for the feedback! I\'ll incorporate your suggestions and regenerate the website...',
      timestamp: new Date(),
      isLoading: true,
    };

    setChatMessages((prev: ChatMessage[]) => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      // Generate new redesign with user feedback
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
        throw new Error(redesignResult.error || 'Failed to apply feedback');
      }

      setRedesignedContent(redesignResult.content);

      // Replace loading message with success message
      const successMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `✅ **Updated Design Applied!**\n\nI've incorporated your feedback and regenerated the website. The changes include your requested modifications while maintaining modern design principles.\n\nFeel free to provide more feedback for additional refinements!`,
        timestamp: new Date(),
      };

      setChatMessages((prev: ChatMessage[]) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = successMessage; // Replace loading message
        return newMessages;
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply feedback';

      const errorChatMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `❌ **Error applying feedback**: ${errorMessage}\n\nPlease try rephrasing your request or providing more specific details.`,
        timestamp: new Date(),
      };

      setChatMessages((prev: ChatMessage[]) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = errorChatMessage; // Replace loading message
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsLoading(false);
    setCurrentUrl('');
    setOriginalData(null);
    setRedesignedContent(null);
    setChatMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* URL Input Section */}
          <URLInput
            onSubmit={handleUrlSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          />

          {/* Preview Section */}
          <PreviewPanel
            originalData={originalData}
            redesignedContent={redesignedContent}
            isLoading={isLoading}
          />

          {/* Chat and Download Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChatInterface
              messages={chatMessages}
              onSendMessage={handleChatMessage}
              isLoading={isLoading}
              disabled={isLoading || !redesignedContent}
            />

            <DownloadPanel
              redesignedContent={redesignedContent}
              originalUrl={currentUrl}
              onReset={handleReset}
              disabled={isLoading}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="text-red-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-800 font-medium">Error: {error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 