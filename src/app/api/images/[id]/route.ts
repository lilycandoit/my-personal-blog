import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Find the image
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete from Vercel Blob
    try {
      await del(image.url);
    } catch (error) {
      console.error('Error deleting from Blob storage:', error);
      // Continue with DB deletion even if Blob deletion fails
    }

    // Delete from database
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
