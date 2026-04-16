# 7 Sisters Tea Co.

Premium, minimal D2C storefront for Assam tea and spices. Built with Next.js App Router, Tailwind, Framer Motion, and Supabase-ready data plumbing.

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Framer Motion
- Zustand (cart)
- Supabase (Auth + DB + Storage, free tier optimized)
- Vercel (free tier ready)

## Getting Started
1. Install dependencies
```
npm install
```

2. Add environment variables
```
cp .env.example .env.local
```
Fill in the Supabase values when ready.
Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to your official WhatsApp number for pre-book confirmations.
Set `ADMIN_PASSCODE` to protect the internal admin dashboard.

3. Run the dev server
```
npm run dev
```

## Supabase Setup (Schema Overview)
Use the Supabase SQL editor and run:
`/Users/mehmuddelowar/Documents/Tea/supabase/schema.sql`
`/Users/mehmuddelowar/Documents/Tea/supabase/prebook.sql`

This creates:
- `categories`
- `products` (includes variants + images in JSONB)
- `customers`
- `orders`
- `order_items`
- `prebook_requests`

RLS guidance:
- Public read for catalog tables where `is_active = true`
- Inserts allowed for `customers`, `orders`, `order_items`
- All other access is blocked for anon/auth users (service role bypasses RLS for admin operations)

## PWA
- Installable via manifest at `/manifest.webmanifest`
- Service worker: `public/sw.js`
- Offline fallback: `/offline`

Replace the placeholder icons in `public/icons` with final brand assets when ready.

## Deployment (Vercel + Supabase)
1. Push repo to GitHub
2. Import to Vercel
3. Add environment variables from `.env.example`
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain
5. Deploy

## Project Structure
- `app/` routes (App Router)
- `components/` UI + sections + product + cart
- `lib/` data, SEO helpers, Supabase client
- `store/` Zustand cart store
- `public/` icons, SVGs, service worker

## Notes
- Product data currently lives in `lib/products/catalog.ts` and is mirrored in Supabase via the SQL seed.
- The app now fetches from Supabase when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set; otherwise it falls back to the local catalog.
- Cart state is localStorage-based for guests. Authenticated persistence can be added later.
- Prebooking uses `SUPABASE_SERVICE_ROLE_KEY` on the server action to insert into `prebook_requests`.
- Admin dashboard is available at `/admin` and requires the passcode cookie.
