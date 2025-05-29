# Website Visual Optimization Agent - Technical Design Document

## Project Overview
Build an intelligent website redesign agent that can automatically fetch legacy website content and use AI to redesign it into a modern interface, supporting multi-round interactive optimization and code download.

## Technology Stack
- **Frontend Framework**: Next.js 15 (App Router)
- **Styling System**: TailwindCSS + shadcn-ui
- **AI Agent Framework**: LangGraph.js
- **Tool Protocol**: MCP (Model Context Protocol)
- **Automation Testing**: Playwright
- **LLM Provider**: OpenRouter (using cost-effective models like gpt-4o-mini)
- **Package Manager**: pnpm

## System Architecture

### 1. Frontend Architecture
```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main page
│   ├── api/                      # API routes
│   │   ├── scrape/route.ts       # Web scraping API
│   │   ├── redesign/route.ts     # Redesign API
│   │   ├── chat/route.ts         # Chat API
│   │   └── download/route.ts     # Download API
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # Components directory
│   ├── ui/                       # shadcn-ui components
│   ├── website-redesigner.tsx    # Main redesigner component
│   ├── url-input.tsx            # URL input component
│   ├── preview-panel.tsx        # Preview panel
│   ├── chat-interface.tsx       # Chat interface
│   └── download-panel.tsx       # Download panel
├── lib/                         # Utility libraries
│   ├── utils.ts                 # Common utilities
│   ├── langgraph-agent.ts       # LangGraph Agent
│   ├── mcp-tools.ts             # MCP tool definitions
│   ├── openrouter-client.ts     # OpenRouter client
│   └── playwright-scraper.ts    # Playwright web scraper
└── types/                       # TypeScript type definitions
    └── index.ts
```

### 2. Agent Workflow (LangGraph)
Build ReAct Agent using LangGraph with the following nodes:
1. **WebScraper Node**: Use Playwright to scrape web HTML
2. **ContentAnalyzer Node**: Analyze web structure and content
3. **DesignGenerator Node**: Generate modern designs
4. **ChatHandler Node**: Handle user feedback and optimization requests
5. **CodeGenerator Node**: Generate final code files

### 3. MCP Tool Integration
Define the following MCP tools:
- `scrape_website`: Scrape website content
- `analyze_design`: Analyze design requirements
- `generate_html`: Generate HTML code
- `generate_css`: Generate CSS styles
- `generate_js`: Generate JavaScript code
- `create_zip`: Create download package

### 4. Data Flow
```
User Input URL → Playwright Scraping → LLM Content Analysis → Generate Modern Design → 
User Feedback → Multi-round Optimization → Generate Final Code → Create Download Package
```

## Core Feature Modules

### 1. Web Scraping Module (`playwright-scraper.ts`)
- Use Playwright headless browser
- Extract HTML structure, styles, and scripts
- Handle dynamic content loading
- Save static resource references

### 2. AI Redesign Module (`langgraph-agent.ts`)
- Integrate OpenRouter API
- Use cost-effective models like `meta-llama/llama-3.1-8b-instruct:free`
- Implement ReAct pattern: Reasoning → Acting → Observing
- Support multi-round conversation optimization

### 3. Code Generation Module
- Generate modern HTML5 structure
- Use TailwindCSS class names
- Generate responsive design
- Optimize performance and SEO

### 4. Download Management Module
- Create ZIP files containing HTML/CSS/JS
- Handle static resources
- Provide download link management

## UI/UX Design

### Main Interface Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Website Visual Optimizer Agent                             │
├─────────────────────────────────────────────────────────────┤
│  [URL Input Field]                    [Analyze Button]      │
├─────────────────┬───────────────────────────────────────────┤
│   Original      │           Redesigned                     │
│   Website       │           Preview                        │
│   Preview       │                                          │
│                 │                                          │
├─────────────────┼───────────────────────────────────────────┤
│   Chat Interface                                           │
│   [User messages and Agent responses]                      │
│   [Input field for feedback]                              │
├─────────────────────────────────────────────────────────────┤
│   [Download ZIP] [Reset] [Share]                           │
└─────────────────────────────────────────────────────────────┘
```

### Component Design
1. **URL Input Component**: Support URL validation and loading states
2. **Dual Panel Preview**: Original vs redesigned comparison
3. **Chat Interface**: ChatGPT-like interactive experience
4. **Progress Indicator**: Show processing status
5. **Download Management**: One-click ZIP download

## Technical Implementation Details

### 1. OpenRouter Integration
```typescript
// Cost-effective model configuration
const MODEL_CONFIG = {
  model: "meta-llama/llama-3.1-8b-instruct:free", // Free model
  fallback: "gpt-4o-mini", // Backup paid model
  max_tokens: 4000,
  temperature: 0.7
}
```

### 2. Playwright Configuration
```typescript
// Headless browser configuration
const BROWSER_CONFIG = {
  headless: true,
  viewport: { width: 1920, height: 1080 },
  timeout: 30000,
  waitForSelector: 'body'
}
```

### 3. LangGraph Workflow
```typescript
// Agent state definition
interface AgentState {
  url: string;
  originalHtml: string;
  redesignedHtml: string;
  userFeedback: string[];
  iterationCount: number;
  finalCode: CodeBundle;
}
```

## Performance Optimization

1. **Code Splitting**: Use Next.js dynamic imports
2. **Caching Strategy**: Redis cache for scraping results
3. **Streaming Response**: Support SSE real-time updates
4. **Image Optimization**: Next.js Image component
5. **Concurrent Processing**: Handle multiple URLs simultaneously

## Security Considerations

1. **URL Validation**: Prevent malicious URL injection
2. **Content Filtering**: Filter sensitive content
3. **Rate Limiting**: Prevent API abuse
4. **CORS Configuration**: Secure cross-origin settings

## Deployment Strategy

1. **Development Environment**: Local Next.js development server
2. **Production Environment**: Vercel deployment + Edge functions
3. **Database**: Use Vercel KV for session data storage
4. **Monitoring**: Vercel Analytics + custom logging

## Expected Costs

1. **OpenRouter API**: Mainly use free models, backup paid models ~$0.01/1K tokens
2. **Vercel Deployment**: Free tier sufficient
3. **Total Cost**: Estimated < $20/month

---

**Confirmation Points**:
1. Is the technology stack selection appropriate?
2. Does the Agent workflow design meet requirements?
3. Does the UI/UX layout match expectations?
4. Are performance and cost considerations reasonable? 