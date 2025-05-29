export interface WebsiteData {
  url: string;
  originalHtml: string;
  originalCss: string;
  originalJs: string;
  title: string;
  description: string;
  images: string[];
  timestamp: Date;
}

export interface RedesignedContent {
  html: string;
  css: string;
  js: string;
  assets: Asset[];
  preview?: string;
}

export interface Asset {
  type: 'image' | 'font' | 'icon' | 'other';
  originalUrl: string;
  localPath: string;
  content?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface AgentState {
  url: string;
  originalData: WebsiteData | null;
  redesignedContent: RedesignedContent | null;
  chatMessages: ChatMessage[];
  userFeedback: string[];
  iterationCount: number;
  isProcessing: boolean;
  error?: string;
}

export interface CodeBundle {
  html: string;
  css: string;
  js: string;
  assets: Asset[];
  metadata: {
    title: string;
    description: string;
    generatedAt: Date;
    sourceUrl: string;
  };
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  fallbackModel?: string;
  maxTokens: number;
  temperature: number;
}

export interface ScrapeResult {
  success: boolean;
  data?: WebsiteData;
  error?: string;
}

export interface RedesignResult {
  success: boolean;
  content?: RedesignedContent;
  error?: string;
}

export interface DownloadResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
} 