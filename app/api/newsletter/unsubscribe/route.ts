import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Get current subscriber
    const redis = await getRedisClient();
    const current = await redis.hGet('newsletter:subscribers', normalizedEmail);

    if (current) {
      const data = JSON.parse(current);
      // Update to inactive
      await redis.hSet(
        'newsletter:subscribers',
        normalizedEmail,
        JSON.stringify({
          ...data,
          active: false,
          unsubscribedAt: new Date().toISOString(),
        })
      );
    }

    return NextResponse.json({ message: 'Successfully unsubscribed from the newsletter' }, { status: 200 });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'An error occurred while unsubscribing' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return new Response('Email is required', { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Get current subscriber
    const redis = await getRedisClient();
    const current = await redis.hGet('newsletter:subscribers', normalizedEmail);

    if (current) {
      const data = JSON.parse(current);
      // Update to inactive
      await redis.hSet(
        'newsletter:subscribers',
        normalizedEmail,
        JSON.stringify({
          ...data,
          active: false,
          unsubscribedAt: new Date().toISOString(),
        })
      );
    }

    // Return HTML confirmation page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unsubscribed</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
            .container { max-width: 600px; margin: 100px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
            h1 { color: #0d9488; margin: 0 0 10px 0; }
            p { color: #666; line-height: 1.6; }
            a { color: #0d9488; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Unsubscribed</h1>
            <p>You have been successfully unsubscribed from our newsletter.</p>
            <p>We're sorry to see you go, but you can always <a href="${process.env.BLOG_URL || 'https://example.com'}">visit our blog</a> anytime.</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response('An error occurred', { status: 500 });
  }
}
