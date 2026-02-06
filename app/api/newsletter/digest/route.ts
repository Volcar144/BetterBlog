import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';
import client from '@/tina/__generated__/client';
import { sendBulkEmails, generateNewsletterHTML } from '@/lib/email-service';

async function getRecentPosts(since: Date) {
  try {
    let posts = await client.queries.postConnection();
    const allPosts = posts;

    if (!allPosts.data.postConnection.edges) {
      return [];
    }

    while (posts.data?.postConnection.pageInfo.hasNextPage) {
      posts = await client.queries.postConnection({
        after: posts.data.postConnection.pageInfo.endCursor,
      });

      if (!posts.data.postConnection.edges) break;

      allPosts.data.postConnection.edges.push(...posts.data.postConnection.edges);
    }

    const recentPosts = allPosts.data.postConnection.edges
      .filter((edge) => {
        if (!edge?.node) return false;
        if ((edge.node as any).draft) return false;

        const postDate = edge.node.date ? new Date(edge.node.date) : null;
        if (!postDate) return false;

        return postDate >= since;
      })
      .map((edge) => ({
        title: edge?.node?.title || 'Untitled',
        excerpt: edge?.node?.excerpt ? (typeof edge.node.excerpt === 'string' ? edge.node.excerpt : '') : '',
        url: `${process.env.BLOG_URL || 'https://example.com'}/posts/${edge?.node?._sys.breadcrumbs.join('/')}`,
        date: edge?.node?.date || new Date().toISOString(),
        author: edge?.node?.author?.name || undefined,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return recentPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function getActiveSubscribers() {
  try {
    const redis = await getRedisClient();
    const subscribers = await redis.hGetAll('newsletter:subscribers');
    if (!subscribers || Object.keys(subscribers).length === 0) return [];

    return Object.values(subscribers)
      .map((item) => {
        try {
          const parsed = JSON.parse(item as string);
          return parsed.active ? parsed.email : null;
        } catch {
          return null;
        }
      })
      .filter((email) => email !== null);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
}

async function getLastDigestTime(): Promise<Date | null> {
  try {
    const redis = await getRedisClient();
    const lastTime = await redis.get('newsletter:last-digest-time');
    if (!lastTime) return null;
    return new Date(lastTime);
  } catch {
    return null;
  }
}

async function updateLastDigestTime() {
  try {
    const redis = await getRedisClient();
    await redis.set('newsletter:last-digest-time', new Date().toISOString());
  } catch (error) {
    console.error('Error updating last digest time:', error);
  }
}

export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const lastDigestTime = await getLastDigestTime();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const since = lastDigestTime || oneWeekAgo;

    // Get recent posts
    const recentPosts = await getRecentPosts(since);

    // Check if enough posts
    if (recentPosts.length < 3) {
      return NextResponse.json(
        {
          message: `Not enough posts (${recentPosts.length}). Need at least 3.`,
          postCount: recentPosts.length,
          sent: false,
        },
        { status: 200 }
      );
    }

    // Get subscribers
    const subscribers = await getActiveSubscribers();

    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers to send to', sent: false }, { status: 200 });
    }

    // Generate email
    const blogTitle = process.env.BLOG_TITLE || 'My Blog';
    const emailHTML = generateNewsletterHTML(blogTitle, recentPosts);

    // Send emails
    await sendBulkEmails(subscribers, `${blogTitle} - Weekly Digest (${recentPosts.length} new posts)`, emailHTML);

    // Update last digest time
    await updateLastDigestTime();

    return NextResponse.json(
      {
        message: 'Digest sent successfully',
        recipientCount: subscribers.length,
        postCount: recentPosts.length,
        sent: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending digest:', error);
    return NextResponse.json({ error: 'An error occurred while sending the digest' }, { status: 500 });
  }
}
