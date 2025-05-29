import { NextRequest, NextResponse } from 'next/server';
import { executeTool } from '@/lib/mcp-tools';

export async function POST(request: NextRequest) {
  try {
    const { websiteData, userFeedback } = await request.json();

    if (!websiteData) {
      return NextResponse.json(
        { success: false, error: 'Website data is required' },
        { status: 400 }
      );
    }

    // Step 1: Analyze design
    const designAnalysis = await executeTool('analyze_design', {
      websiteData,
      requirements: userFeedback || ''
    });

    // Step 2: Generate HTML
    const html = await executeTool('generate_html', {
      originalData: websiteData,
      designAnalysis,
      userFeedback
    });

    // Step 3: Generate CSS
    const css = await executeTool('generate_css', {
      html,
      customRequirements: userFeedback
    });

    // Step 4: Generate JavaScript
    const js = await executeTool('generate_js', {
      html,
      functionalityRequirements: userFeedback
    });

    // Create redesigned content
    const redesignedContent = {
      html,
      css,
      js,
      assets: websiteData.images?.map((img: string) => ({
        type: 'image' as const,
        originalUrl: img,
        localPath: `images/${img.split('/').pop() || 'image.jpg'}`
      })) || [],
    };

    return NextResponse.json({
      success: true,
      content: redesignedContent,
      analysis: designAnalysis,
    });
  } catch (error) {
    console.error('Redesign API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Redesign failed'
      },
      { status: 500 }
    );
  }
}
