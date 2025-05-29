import { NextRequest, NextResponse } from 'next/server';
import { getScraperInstance } from '@/lib/playwright-scraper';
import { isValidUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { url, options = {} } = await request.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const scraper = getScraperInstance();
    const websiteData = await scraper.scrapeWebsite(url, options);

    return NextResponse.json({
      success: true,
      data: websiteData,
    });
  } catch (error) {
    console.error('Scraping API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Scraping failed'
      },
      { status: 500 }
    );
  }
} 