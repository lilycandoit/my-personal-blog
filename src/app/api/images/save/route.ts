import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url, filename, size, mimeType, width, height } = body;

    // Validate required fields
    if (!url || !filename) {
      return NextResponse.json(
        { error: 'Missing required fields: url and filename' },
        { status: 400 }
      );
    }

    // Save to database
    const image = await prisma.image.create({
      data: {
        url,
        filename,
        size: size || 0,
        mimeType: mimeType || 'image/jpeg',
        width: width || null,
        height: height || null,
      },
    });

    return NextResponse.json({
      success: true,
      image: {
        id: image.id,
        url: image.url,
        filename: image.filename,
        size: image.size,
        width: image.width,
        height: image.height,
      },
    });
  } catch (error) {
    console.error('Save image error:', error);
    return NextResponse.json(
      { error: 'Failed to save image metadata' },
      { status: 500 }
    );
  }
}
