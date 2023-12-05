/**
 * This is a Vercel Middleware, which:
 * - is triggered for all `/users/:username` routes
 * - extracts `username` from the URL
 * - generates a proper Profile OG Image URL
 * - reads the contents of `dist/_empty.html`
 * - replaces default meta Image URL with Profile OG Image URL
 * - serves the result as an HTML response
 * - passes request down the stack and returns if unable to extract `username`
 *
 * Related Docs:
 * - https://vercel.com/docs/functions/edge-middleware
 * - https://nodejs.org/api/esm.html#importmeta
 * - https://vercel.com/docs/functions/edge-functions/vercel-edge-package#next
 */

import { next } from '@vercel/edge';

export const config = {
  matcher: '/users/:path*',
};

export default async function middleware(request) {
  // Parse the username from the request URL
  const username = request.url.match(/\/users\/([^/?]+)/)[1];

  // Skip the request if username is missing
  if (!username) {
    // Log an error to the console
    console.error('Unable to parse username from the URL:', request.url);

    // Pass the request down the stack for processing and return
    return next(request);
  }

  // Generate a proper OG Image URL for the username's Profile
  const profileImageUrl = `https://og.codecrafters.io/api/user_profile/${username}.png`;

  // Determine URL for reading local `/dist/_empty.html`
  const indexFileURL = new URL('./dist/_empty.html', import.meta.url);

  // Read contents of `/dist/_empty.html`
  const indexFileText = await fetch(indexFileURL).then((res) => res.text());

  // Replace the default image URL with a Profile image URL
  const responseText = indexFileText.replace(/https:\/\/codecrafters\.io\/images\/og-index\.jpg/g, profileImageUrl);

  // Serve the result as HTML
  return new Response(responseText, { headers: { 'Content-Type': 'text/html' } });
}
