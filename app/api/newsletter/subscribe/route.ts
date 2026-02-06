import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if already subscribed
    const redis = await getRedisClient();
    const existing = await redis.hGet('newsletter:subscribers', normalizedEmail);

    if (existing) {
      return NextResponse.json({ message: 'You are already subscribed', subscribed: false }, { status: 200 });
    }

    // Add subscriber
    await redis.hSet(
      'newsletter:subscribers',
      normalizedEmail,
      JSON.stringify({
        email: normalizedEmail,
        subscribedAt: new Date().toISOString(),
        active: true,
      })
    );

    return NextResponse.json({ message: 'Successfully subscribed to the newsletter!', subscribed: true }, { status: 201 });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const redis = await getRedisClient();
    const subscribers = await redis.hGetAll('newsletter:subscribers');
    const count = subscribers ? Object.keys(subscribers).length : 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
