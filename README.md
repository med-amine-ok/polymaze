# POLYMAZE 2026

A cinematic landing page for the POLYMAZE 2026 robotics championship, built with TanStack Start + Vite.

## Scripts

- `npm run dev` - Start the local dev server
- `npm run build` - Build client + server bundles
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## Deployment (Vercel)

This project uses a Vercel Node function to proxy requests to the TanStack Start server bundle:

- API handler: `api/index.ts`
- Routes: `vercel.json` rewrites all requests to `/api/index`

After pushing to GitHub, trigger a Vercel deploy from the dashboard.

## Notes

- The Vite config in `vite.config.ts` disables the Cloudflare plugin on Vercel and selects the Vercel preset.
- Static assets are served from `public/` and are emitted into `dist/client/` during build.
