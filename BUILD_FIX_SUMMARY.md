# Build Error Fix: Catch-all Route Routing Issue

## Problem
The build was failing with the error: `[Error: Catch-all must be the last part of the URL.]`

This error occurred because the Next.js App Router detected conflicting route configurations:
1. A catch-all route at `app/[...urlSegments]/page.tsx` 
2. Additional specific routes like `app/posts/` and `app/search/` at the same level
3. A separate home page at `app/page.tsx`

In Next.js, you cannot have a required catch-all route (`[...param]`) at the root level alongside other static routes because the catch-all would try to match everything, creating ambiguity.

## Solution
The fix involved converting the required catch-all route to an **optional catch-all route** and consolidating the home page logic:

### Changes Made

1. **Renamed the catch-all directory**: `app/[...urlSegments]` → `app/[[...urlSegments]]`
   - The double brackets `[[...urlSegments]]` make it an optional catch-all
   - This allows it to coexist with other routes like `/posts` and `/search`
   - It can now match both the root path `/` and nested paths like `/about`

2. **Updated the page logic** (`app/[[...urlSegments]]/page.tsx`):
   - Made `urlSegments` optional in the interface: `urlSegments?: string[]`
   - Added logic to handle the home page when `urlSegments` is empty or undefined
   - Updated `params` to be a Promise (Next.js 15 requirement): `params: Promise<PageParams>`
   - Modified `generateStaticParams` to include the home page with `urlSegments: undefined`

3. **Removed duplicate home page** (`app/page.tsx`):
   - The separate home page conflicted with the optional catch-all
   - The optional catch-all now handles both `/` (home) and other pages

4. **Removed OpenGraph image from catch-all route**:
   - Deleted `app/posts/[...urlSegments]/opengraph-image.tsx`
   - Next.js doesn't allow metadata files inside catch-all route directories
   - Created an API route instead: `app/api/og/route.tsx`
   - Updated post metadata to use the new API: `/api/og?filepath={filepath}`

## Technical Details

### Why Optional Catch-All?
- **Required catch-all** `[...param]`: Matches 1 or more segments, excludes root
- **Optional catch-all** `[[...param]]`: Matches 0 or more segments, includes root
- The optional catch-all can coexist with other routes because Next.js gives priority to more specific routes first

### Route Priority
With the optional catch-all in place, Next.js routes are evaluated in this order:
1. Static routes: `/posts`, `/search`
2. Dynamic routes: `/posts/[...urlSegments]`
3. Optional catch-all: `/[[...urlSegments]]` (catches everything else)

### Next.js 15 Changes
The code was also updated to handle Next.js 15's new async params:
- Before: `params: PageParams`
- After: `params: Promise<PageParams>` with `await params`

## Result
- ✅ Build error "Catch-all must be the last part of the URL" is resolved
- ✅ Home page works at `/`
- ✅ Static pages work at `/[page-name]`
- ✅ Posts work at `/posts/[post-name]`
- ✅ Search works at `/search`
- ✅ OpenGraph images work via API route

## Files Changed
- Deleted: `app/[...urlSegments]/` (renamed to optional catch-all)
- Deleted: `app/page.tsx` (consolidated into optional catch-all)
- Deleted: `app/posts/[...urlSegments]/opengraph-image.tsx` (replaced with API route)
- Added: `app/[[...urlSegments]]/page.tsx` (optional catch-all with home page logic)
- Added: `app/[[...urlSegments]]/client-page.tsx` (copied from original)
- Added: `app/api/og/route.tsx` (OpenGraph image API)
- Modified: `app/posts/[...urlSegments]/page.tsx` (updated OG image URL)
