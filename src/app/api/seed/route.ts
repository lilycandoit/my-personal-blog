import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// ⚠️ SECURITY: Delete this file after first deployment!
// Or add authentication check to prevent public access

export async function POST(req: Request) {
  try {
    // Optional: Add a secret key check for security
    const body = await req.json();
    const { secret } = body;

    // Change this to a secret value and pass it in the request
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const email = 'admin@example.com';
    const password = 'password123'; // Change this after first login!

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      user: { email: user.email },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
