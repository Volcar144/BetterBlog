// @ts-ignore - nodemailer doesn't have full TypeScript support
import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL || 'noreply@example.com',
    to,
    subject,
    html,
  });
}

export async function sendBulkEmails(recipients: string[], subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  for (const email of recipients) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || 'noreply@example.com',
        to: email,
        subject,
        html,
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
  }
}

export function generateNewsletterHTML(
  blogTitle: string,
  posts: Array<{
    title: string;
    excerpt?: string;
    url: string;
    date: string;
    author?: string;
  }>
): string {
  const postsHTML = posts
    .map(
      (post, index) => `
    <tr>
      <td style="padding: 30px 20px; border-bottom: 1px solid #f0f0f0;">
        <table width="100%" style="margin: 0; padding: 0;">
          <tr>
            <td style="padding: 0; vertical-align: top;">
              <span style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-bottom: 8px;">
                Post ${index + 1}
              </span>
              <h2 style="margin: 8px 0; font-size: 22px; font-weight: 700; color: #1a1a1a; line-height: 1.3;">
                <a href="${post.url}" style="color: #0d9488; text-decoration: none; border-bottom: 2px solid transparent; transition: border-color 0.3s;">
                  ${post.title}
                </a>
              </h2>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 13px; font-weight: 500;">
                <span style="color: #0d9488;">📅</span> ${new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                ${post.author ? `<span style="margin-left: 12px;"><span style="color: #0d9488;">✍️</span> ${post.author}</span>` : ''}
              </p>
              ${
                post.excerpt
                  ? `
              <p style="margin: 12px 0 0 0; color: #555; font-size: 14px; line-height: 1.6; max-width: 500px;">
                ${post.excerpt.substring(0, 150)}${post.excerpt.length > 150 ? '...' : ''}
              </p>
              `
                  : ''
              }
              <a href="${post.url}" style="display: inline-block; margin-top: 12px; color: #0d9488; text-decoration: none; font-weight: 600; font-size: 14px;">
                Read more →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <title>${blogTitle} - Weekly Digest</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      a { color: #0d9488; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; color: #333; background: linear-gradient(135deg, #f8f9fa 0%, #f0f0f0 100%);">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 0 20px rgba(0,0,0,0.08);">
      <!-- Hero Section -->
      <div style="background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); padding: 50px 30px; text-align: center; border-bottom: 4px solid #0d9488;">
        <div style="max-width: 500px; margin: 0 auto;">
          <h1 style="margin: 0 0 10px 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
            ${blogTitle}
          </h1>
          <p style="margin: 0; color: #cffafe; font-size: 15px; font-weight: 500; opacity: 0.95;">
            ✨ Your Weekly Digest
          </p>
        </div>
      </div>

      <!-- Intro Section -->
      <div style="padding: 30px 30px 20px 30px; background-color: #fafbfc; border-bottom: 1px solid #f0f0f0;">
        <p style="margin: 0; color: #555; font-size: 15px; line-height: 1.6;">
          Hi there! 👋 Here are this week's <strong>newest posts</strong> from ${blogTitle}. Keep reading to stay updated.
        </p>
      </div>

      <!-- Posts Section -->
      <table width="100%" style="border-collapse: collapse; margin: 0; padding: 0;">
        ${postsHTML}
      </table>

      <!-- CTA Section -->
      <div style="padding: 40px 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #f0f0f0;">
        <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
          Want to read more? Visit our blog for all the latest content.
        </p>
        <a href="${process.env.BLOG_URL || 'https://example.com'}" style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3); transition: transform 0.2s, box-shadow 0.2s;">
          Explore the Blog
        </a>
      </div>

      <!-- Footer -->
      <div style="padding: 30px; text-align: center; background-color: #f0f0f0; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0 0 15px 0; color: #888; font-size: 13px;">
          © ${new Date().getFullYear()} ${blogTitle}. All rights reserved.
        </p>
        <div style="margin: 0; padding: 0;">
          <a href="${process.env.BLOG_URL || 'https://example.com'}" style="color: #0d9488; text-decoration: none; font-size: 13px; margin: 0 12px;">
            Visit Blog
          </a>
          <span style="color: #ddd;">•</span>
          <a href="${process.env.BLOG_URL || 'https://example.com'}/api/newsletter/unsubscribe?email=*|EMAIL|*" style="color: #0d9488; text-decoration: none; font-size: 13px; margin: 0 12px;">
            Unsubscribe
          </a>
          <span style="color: #ddd;">•</span>
          <a href="${process.env.BLOG_URL || 'https://example.com'}/preferences" style="color: #0d9488; text-decoration: none; font-size: 13px; margin: 0 12px;">
            Preferences
          </a>
        </div>
        <p style="margin: 15px 0 0 0; color: #aaa; font-size: 12px;">
          You're receiving this because you subscribed to ${blogTitle} newsletter.
        </p>
      </div>
    </div>
  </body>
</html>
  `;
}
