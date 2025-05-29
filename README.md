# Website Visual Optimizer Agent

A powerful AI-driven application that transforms outdated websites into modern, responsive designs using LangGraph.js, MCP (Model Context Protocol), TailwindCSS, Next.js 15, and Playwright.

## Features

- 🕷️ **Intelligent Web Scraping**: Automatically extract HTML, CSS, and content from any website using Playwright
- 🎨 **AI-Powered Redesign**: Generate modern, responsive designs using OpenRouter's cost-effective language models
- 💬 **Interactive Chat Interface**: Provide feedback and iterate on designs through natural language conversation
- 📱 **Responsive Design**: All generated websites are mobile-first and fully responsive
- 📦 **One-Click Download**: Get complete code packages including HTML, CSS, JavaScript, and assets
- ⚡ **Modern Tech Stack**: Built with Next.js 15, TailwindCSS, and shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS 4.0, shadcn/ui components
- **AI Integration**: LangGraph.js, OpenRouter API
- **Web Scraping**: Playwright
- **Package Management**: pnpm
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- OpenRouter API key (sign up at [openrouter.ai](https://openrouter.ai))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd website-visual-optimizer-agent
```

2. Install dependencies:
```bash
pnpm install
```

3. Install Playwright browsers:
```bash
pnpm playwright install
```

4. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenRouter API key:
```bash
OPENROUTER_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Start the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter a Website URL**: Input any website URL you want to redesign
2. **Watch the Magic**: The AI agent will:
   - Scrape the website content
   - Analyze the current design
   - Generate a modern redesign
3. **Provide Feedback**: Use the chat interface to request specific changes
4. **Download Your Code**: Get a complete ZIP package with all files

## Environment Variables

Create a `.env.local` file with:

```bash
# Required: OpenRouter API key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Application URL (for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Playwright settings
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_TIMEOUT=30000
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── scrape/        # Web scraping endpoint
│   │   ├── redesign/      # Design generation endpoint
│   │   └── download/      # File download endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── url-input.tsx     # URL input component
│   ├── preview-panel.tsx # Website preview panels
│   ├── chat-interface.tsx # Chat interface
│   ├── download-panel.tsx # Download management
│   └── website-redesigner.tsx # Main app component
├── lib/                  # Utility libraries
│   ├── utils.ts          # Common utilities
│   ├── openrouter-client.ts # OpenRouter API client
│   ├── playwright-scraper.ts # Web scraping logic
│   ├── mcp-tools.ts      # MCP tool definitions
│   └── langgraph-agent.ts # Agent workflow (simplified)
└── types/                # TypeScript type definitions
    └── index.ts
```

## API Endpoints

- `POST /api/scrape` - Scrape website content
- `POST /api/redesign` - Generate modern redesign
- `POST /api/download` - Create downloadable ZIP package

## Cost Optimization

The application uses cost-effective AI models:
- Primary: `meta-llama/llama-3.1-8b-instruct:free` (free tier)
- Fallback: `gpt-4o-mini` (low cost)
- Estimated monthly cost: < $20 for moderate usage

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application is compatible with any Node.js hosting platform that supports Next.js 15.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review the technical design document in `doc/technical-design.md`

---

**Note**: This application requires an OpenRouter API key. Free tier usage is available for testing, with upgrade options for production use.
