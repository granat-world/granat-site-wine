# granat-site-wine

Granat partner-facing site — **wine-brown variant** (working name "CC", from the May 2026 Claude design pipeline).

Palette: wine `#1A0F0C` ground · pomegranate-juice `#A4123F` · sun-warmed honey `#E8B66A`. Single-page narrative with embedded voice-to-choir demo (Section 7).

## Run locally

```
npm install
cp .env.example .env       # set GRANAT_API_KEY
npm run dev                # or: npm start
```

Default port: 3000.

## Deploy

Same pattern as `granat-future-site` — Timeweb App Platform, Express static server with voice-API proxy. See `DEPLOY.md`.

## Companion repo

`granat-site-indigo` — periwinkle indigo (TMA-aligned) variant of the same content. Both repos are deployable independently to separate domains so stakeholders can A/B compare visual direction before publishing decision.

## Structure

```
public/
  index.html       # the brown CC single-page site (mobile-optimized: 27 @media rules)
  future.html      # voice fingerprint explainer landing
  policy.html      # privacy
  guide.mp3        # voice-demo guide audio
  assets/          # imagery
  favicon.*        # favicons + apple-touch-icon + PWA icons
server.js          # Express static + voice proxy + rate limiting
```
