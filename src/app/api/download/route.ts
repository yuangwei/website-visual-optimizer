import { NextRequest, NextResponse } from 'next/server';
import { executeTool } from '@/lib/mcp-tools';

export async function POST(request: NextRequest) {
  try {
    const { content, metadata } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const { zipData, filename } = await executeTool('create_zip', {
      content,
      metadata
    });

    return NextResponse.json({
      success: true,
      downloadUrl: `data:application/zip;base64,${zipData}`,
      filename,
    });
  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Download preparation failed'
      },
      { status: 500 }
    );
  }
} 