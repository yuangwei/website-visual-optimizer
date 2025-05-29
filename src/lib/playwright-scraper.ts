import { chromium, Browser, Page } from 'playwright';
import UserAgent from 'user-agents';
import { WebsiteData, Asset } from '@/types';
import { isValidUrl, sanitizeHtml, extractTextContent } from './utils';

interface ScrapingOptions {
  timeout?: number;
  waitForSelector?: string;
  extractImages?: boolean;
  extractStyles?: boolean;
  extractScripts?: boolean;
}


export class PlaywrightScraper {
  private browser: Browser | null = null;
  private userAgent: UserAgent = new UserAgent();

  async init(): Promise<void> {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // TODO: Add a user agent that is not a bot

      });
    } catch (error) {
      console.error('Failed to launch browser:', error);
      throw new Error('Browser initialization failed');
    }
  }

  async scrapeWebsite(
    url: string,
    options: ScrapingOptions = {}
  ): Promise<WebsiteData> {
    if (!isValidUrl(url)) {
      throw new Error('Invalid URL provided');
    }

    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser!.newPage({
      userAgent: this.userAgent.toString()
    });

    try {
      // Set viewport and user agent
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      });

      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: options.timeout || 30000
      });

      // Wait for specific selector if provided
      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, { timeout: 10000 });
      }

      // Extract basic page information
      const title = await page.title();
      // TODO: Extract description from the page
      const description = '';

      // Get the full HTML content
      const originalHtml = await page.content();

      // Extract inline styles
      let originalCss = '';
      if (options.extractStyles !== false) {
        const styleElements = await page.$$eval('style', elements =>
          elements.map(el => el.textContent || '').join('\n')
        );
        const linkStyles = await page.$$eval('link[rel="stylesheet"]', elements =>
          elements.map(el => el.getAttribute('href') || '').filter(Boolean)
        );
        originalCss = styleElements + '\n' + linkStyles.join('\n');
      }

      // Extract inline scripts
      let originalJs = '';
      if (options.extractScripts !== false) {
        const scriptElements = await page.$$eval('script:not([src])', elements =>
          elements.map(el => el.textContent || '').join('\n')
        );
        originalJs = scriptElements;
      }

      // Extract images
      let images: string[] = [];
      if (options.extractImages !== false) {
        images = await page.$$eval('img', elements =>
          elements.map(img => img.src).filter(src => src && src.startsWith('http'))
        );
      }

      const websiteData: WebsiteData = {
        url,
        originalHtml: sanitizeHtml(originalHtml),
        originalCss,
        originalJs,
        title,
        description,
        images,
        timestamp: new Date(),
      };

      return websiteData;
    } catch (error) {
      console.error('Scraping error:', error);
      throw new Error(`Failed to scrape website: ${error}`);
    } finally {
      await page.close();
    }
  }

  async extractAssets(url: string): Promise<Asset[]> {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser!.newPage();
    const assets: Asset[] = [];

    try {
      await page.goto(url, { waitUntil: 'networkidle' });

      // Extract images
      const images = await page.$$eval('img', elements =>
        elements.map(img => ({
          src: img.src,
          alt: img.alt || '',
        })).filter(img => img.src.startsWith('http'))
      );

      for (const img of images) {
        assets.push({
          type: 'image',
          originalUrl: img.src,
          localPath: `images/${img.src.split('/').pop() || 'image.jpg'}`,
        });
      }

      // Extract CSS files
      const cssFiles = await page.$$eval('link[rel="stylesheet"]', elements =>
        elements.map(link => (link as HTMLLinkElement).href).filter(href => href.startsWith('http'))
      );

      for (const cssFile of cssFiles) {
        assets.push({
          type: 'other',
          originalUrl: cssFile,
          localPath: `css/${cssFile.split('/').pop() || 'style.css'}`,
        });
      }

      // Extract JS files
      const jsFiles = await page.$$eval('script[src]', elements =>
        elements.map(script => (script as HTMLScriptElement).src).filter(src => src.startsWith('http'))
      );

      for (const jsFile of jsFiles) {
        assets.push({
          type: 'other',
          originalUrl: jsFile,
          localPath: `js/${jsFile.split('/').pop() || 'script.js'}`,
        });
      }

      return assets;
    } catch (error) {
      console.error('Asset extraction error:', error);
      return assets;
    } finally {
      await page.close();
    }
  }

  async takeScreenshot(url: string): Promise<Uint8Array | null> {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser!.newPage();

    try {
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.goto(url, { waitUntil: 'networkidle' });

      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false,
      });

      return screenshot;
    } catch (error) {
      console.error('Screenshot error:', error);
      return null;
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Singleton instance
let scraperInstance: PlaywrightScraper | null = null;

export const getScraperInstance = (): PlaywrightScraper => {
  if (!scraperInstance) {
    scraperInstance = new PlaywrightScraper();
  }
  return scraperInstance;
};

export const cleanupScraper = async (): Promise<void> => {
  if (scraperInstance) {
    await scraperInstance.close();
    scraperInstance = null;
  }
}; 