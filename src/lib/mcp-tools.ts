import { MCPTool, WebsiteData, RedesignedContent, Asset } from '@/types';
import { getScraperInstance } from './playwright-scraper';
import { createOpenRouterClient } from './openrouter-client';
import JSZip from 'jszip';

// Helper function to create OpenRouter client with API key
const getOpenRouterClient = () => {
  // @ts-ignore
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }
  return createOpenRouterClient(apiKey);
};

// Helper function to clean markdown code blocks and unwanted formatting
const cleanCodeResponse = (content: string): string => {
  if (!content) return '';

  return content
    // Remove markdown code block markers
    .replace(/```(?:html|css|javascript|js|typescript|ts|xml)?\s*\n?/gi, '')
    .replace(/```\s*$/gm, '')
    // Remove any "I cannot" or error messages at the beginning
    .replace(/^.*?I cannot.*?\n*/gi, '')
    .replace(/^.*?I'm sorry.*?\n*/gi, '')
    .replace(/^.*?cannot provide.*?\n*/gi, '')
    // Remove leading/trailing whitespace and normalize line breaks
    .trim()
    // Fix any broken HTML that might result from overly aggressive cleaning
    // @ts-ignore
    .replace(/^[^<]*(<.*>)/s, '$1') // Remove any text before the first HTML tag
    // @ts-ignore
    .replace(/(<\/[^>]*>)[^<]*$/s, '$1'); // Remove any text after the last closing tag
};

export const scrapeWebsiteTool: MCPTool = {
  name: 'scrape_website',
  description: 'Scrape a website to extract HTML, CSS, and other content',
  inputSchema: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'The URL to scrape' },
      options: {
        type: 'object',
        properties: {
          timeout: { type: 'number', description: 'Timeout in milliseconds' },
          extractImages: { type: 'boolean', description: 'Whether to extract images' },
          extractStyles: { type: 'boolean', description: 'Whether to extract styles' },
          extractScripts: { type: 'boolean', description: 'Whether to extract scripts' },
        }
      }
    },
    required: ['url']
  },
  execute: async (params: { url: string; options?: any }): Promise<WebsiteData> => {
    const scraper = getScraperInstance();
    return await scraper.scrapeWebsite(params.url, params.options || {});
  }
};

export const analyzeDesignTool: MCPTool = {
  name: 'analyze_design',
  description: 'Analyze website content and generate design recommendations',
  inputSchema: {
    type: 'object',
    properties: {
      websiteData: {
        type: 'object',
        description: 'The scraped website data to analyze'
      },
      requirements: {
        type: 'string',
        description: 'Specific design requirements or preferences'
      }
    },
    required: ['websiteData']
  },
  execute: async (params: { websiteData: WebsiteData; requirements?: string }): Promise<string> => {
    const client = getOpenRouterClient();

    const analysisPrompt = `
Analyze this website content and provide modern design recommendations:

Title: ${params.websiteData.title}
Description: ${params.websiteData.description}
URL: ${params.websiteData.url}

Original HTML structure analysis needed.
${params.requirements ? `User requirements: ${params.requirements}` : ''}

Provide:
1. Current design assessment
2. Modern design recommendations
3. Color scheme suggestions
4. Layout improvements
5. Typography recommendations
6. User experience enhancements

Focus on making it look modern, clean, and professional while maintaining functionality.
`;

    const messages = [
      { role: 'system', content: 'You are an expert web designer specializing in modern, clean, and user-friendly interfaces.' },
      { role: 'user', content: analysisPrompt }
    ];

    return await client.generateResponse(messages);
  }
};

export const generateHtmlTool: MCPTool = {
  name: 'generate_html',
  description: 'Generate modern HTML based on analysis and requirements',
  inputSchema: {
    type: 'object',
    properties: {
      originalData: { type: 'object', description: 'Original website data' },
      designAnalysis: { type: 'string', description: 'Design analysis and recommendations' },
      userFeedback: { type: 'string', description: 'User feedback for improvements' }
    },
    required: ['originalData', 'designAnalysis']
  },
  execute: async (params: {
    originalData: WebsiteData;
    designAnalysis: string;
    userFeedback?: string
  }): Promise<string> => {
    const client = getOpenRouterClient();

    const htmlPrompt = `
Generate modern HTML5 code based on this analysis:

Original Title: ${params.originalData.title}
Design Analysis: ${params.designAnalysis}
${params.userFeedback ? `User Feedback: ${params.userFeedback}` : ''}

Requirements:
1. Use semantic HTML5 elements
2. Include proper meta tags
3. Use TailwindCSS classes for styling
4. Make it responsive (mobile-first)
5. Include accessibility features
6. Modern, clean layout
7. Preserve original functionality
8. Add proper heading structure

Generate complete HTML document with:
- DOCTYPE and proper structure
- TailwindCSS CDN link
- Responsive viewport meta tag
- Modern design elements
- Clean typography
- Good color contrast
- Professional appearance

Return only clean HTML code without any formatting markers.
`;

    const messages = [
      { role: 'system', content: 'You are an expert frontend developer specializing in modern HTML5 and TailwindCSS. Return only valid HTML code.' },
      { role: 'user', content: htmlPrompt }
    ];

    const response = await client.generateResponse(messages);
    return cleanCodeResponse(response);
  }
};

export const generateCssTool: MCPTool = {
  name: 'generate_css',
  description: 'Generate additional CSS for custom styling',
  inputSchema: {
    type: 'object',
    properties: {
      html: { type: 'string', description: 'The generated HTML' },
      customRequirements: { type: 'string', description: 'Custom CSS requirements' }
    },
    required: ['html']
  },
  execute: async (params: { html: string; customRequirements?: string }): Promise<string> => {
    const client = getOpenRouterClient();

    const cssPrompt = `
Generate additional CSS for this HTML:

${params.html.substring(0, 2000)}...

${params.customRequirements ? `Custom requirements: ${params.customRequirements}` : ''}

Focus on:
1. Custom animations and transitions
2. Advanced styling not covered by TailwindCSS
3. Modern visual effects
4. Smooth interactions
5. Custom components styling
6. Print styles
7. Dark mode support (optional)

Return only clean CSS code without any formatting markers.
`;

    const messages = [
      { role: 'system', content: 'You are an expert CSS developer specializing in modern styling and animations. Return only valid CSS code.' },
      { role: 'user', content: cssPrompt }
    ];

    const response = await client.generateResponse(messages);
    return cleanCodeResponse(response);
  }
};

export const generateJsTool: MCPTool = {
  name: 'generate_js',
  description: 'Generate JavaScript for interactivity and functionality',
  inputSchema: {
    type: 'object',
    properties: {
      html: { type: 'string', description: 'The generated HTML' },
      functionalityRequirements: { type: 'string', description: 'Required functionality' }
    },
    required: ['html']
  },
  execute: async (params: { html: string; functionalityRequirements?: string }): Promise<string> => {
    const client = getOpenRouterClient();

    const jsPrompt = `
Generate JavaScript for this HTML:

${params.html.substring(0, 2000)}...

${params.functionalityRequirements ? `Functionality requirements: ${params.functionalityRequirements}` : ''}

Focus on:
1. Modern vanilla JavaScript (ES6+)
2. Smooth animations and interactions
3. Form handling and validation
4. Mobile-friendly touch interactions
5. Performance optimization
6. Accessibility enhancements
7. Progressive enhancement

Include:
- Event listeners for interactive elements
- Smooth scrolling navigation
- Form validation (if forms exist)
- Mobile menu functionality
- Loading states
- Error handling

Return only clean JavaScript code without any formatting markers.
`;

    const messages = [
      { role: 'system', content: 'You are an expert JavaScript developer specializing in modern vanilla JavaScript and web APIs. Return only valid JavaScript code.' },
      { role: 'user', content: jsPrompt }
    ];

    const response = await client.generateResponse(messages);
    return cleanCodeResponse(response);
  }
};

export const createZipTool: MCPTool = {
  name: 'create_zip',
  description: 'Create a ZIP file with all generated code and assets',
  inputSchema: {
    type: 'object',
    properties: {
      content: { type: 'object', description: 'Redesigned content object' },
      metadata: { type: 'object', description: 'Project metadata' }
    },
    required: ['content']
  },
  execute: async (params: {
    content: RedesignedContent;
    metadata?: any
  }): Promise<{ zipData: string; filename: string }> => {
    const zip = new JSZip();

    // Clean all content before adding to zip
    const cleanHtml = cleanCodeResponse(params.content.html);
    const cleanCss = cleanCodeResponse(params.content.css);
    const cleanJs = cleanCodeResponse(params.content.js);

    // Add HTML file
    zip.file('index.html', cleanHtml);

    // Add CSS file if exists and not empty
    if (cleanCss && cleanCss.trim()) {
      zip.file('styles.css', cleanCss);
    }

    // Add JavaScript file if exists and not empty
    if (cleanJs && cleanJs.trim()) {
      zip.file('script.js', cleanJs);
    }

    // Add README file
    const readme = `# Redesigned Website

Generated by Website Visual Optimizer Agent
${params.metadata ? `Original URL: ${params.metadata.sourceUrl}` : ''}
Generated at: ${new Date().toISOString()}

## Files Included

- index.html - Main HTML file
${cleanCss && cleanCss.trim() ? '- styles.css - Custom CSS styles' : ''}
${cleanJs && cleanJs.trim() ? '- script.js - JavaScript functionality' : ''}
${params.content.assets.length > 0 ? '- assets/ - Static assets (images, etc.)' : ''}

## Usage

1. Open index.html in a web browser
2. Upload to your web server
3. Ensure TailwindCSS CDN is accessible

## Notes

This website was generated using AI and may require minor adjustments for production use.
Please test thoroughly before deploying to production.
`;

    zip.file('README.md', readme);

    // Add assets if any
    if (params.content.assets && params.content.assets.length > 0) {
      const assetsFolder = zip.folder('assets');
      for (const asset of params.content.assets) {
        if (asset.content) {
          assetsFolder?.file(asset.localPath, asset.content);
        }
      }
    }

    // Generate ZIP
    const zipData = await zip.generateAsync({ type: 'base64' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `redesigned-website-${timestamp}.zip`;

    return { zipData, filename };
  }
};

// Export all tools as a collection
export const mcpTools: MCPTool[] = [
  scrapeWebsiteTool,
  analyzeDesignTool,
  generateHtmlTool,
  generateCssTool,
  generateJsTool,
  createZipTool,
];

// Tool execution helper
export const executeTool = async (toolName: string, params: any): Promise<any> => {
  const tool = mcpTools.find(t => t.name === toolName);
  if (!tool) {
    throw new Error(`Tool ${toolName} not found`);
  }

  return await tool.execute(params);
};