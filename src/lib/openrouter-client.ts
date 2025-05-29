import { OpenRouterConfig } from '@/types';
import axios, { AxiosResponse } from 'axios';

export class OpenRouterClient {
  private config: OpenRouterConfig;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor(config: OpenRouterConfig) {
    this.config = config;
  }

  async generateResponse(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          stream: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
            'X-Title': 'Website Visual Optimizer Agent',
          },
        }
      );

      const content = response.data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      return content;
    } catch (error: any) {
      console.error('OpenRouter API error:', error.response?.data || error.message);

      // Try fallback model if available
      if (this.config.fallbackModel && this.config.model !== this.config.fallbackModel) {
        const fallbackConfig = { ...this.config, model: this.config.fallbackModel };
        const fallbackClient = new OpenRouterClient(fallbackConfig);
        return await fallbackClient.generateResponse(messages);
      }

      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async streamResponse(
    messages: Array<{ role: string; content: string }>,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          'X-Title': 'Website Visual Optimizer Agent',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignore parsing errors for malformed chunks
            }
          }
        }
      }
    } catch (error: any) {
      console.error('OpenRouter streaming error:', error);
      throw new Error(`Failed to stream response: ${error.message}`);
    }
  }
}

// Default configuration - only use server-side environment variables
export const getDefaultConfig = (): OpenRouterConfig => ({
  apiKey: '', // Will be set from server-side
  model: 'meta-llama/llama-3.1-8b-instruct:free',
  fallbackModel: 'gpt-4o-mini',
  maxTokens: 4000,
  temperature: 0.7,
});

export const createOpenRouterClient = (apiKey?: string): OpenRouterClient => {
  const config = getDefaultConfig();
  if (apiKey) {
    config.apiKey = apiKey;
  }
  return new OpenRouterClient(config);
}; 