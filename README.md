# granat-site-wine

> Granat partner-facing site — wine-brown variant. Part of the Granat platform; maintained by Cone Red Engineering.

A single-page narrative site with an embedded voice-to-choir demo, in the wine-brown visual direction (working name "CC", from the May 2026 design pipeline). Its companion `granat-site-indigo` carries the same content in a periwinkle-indigo, TMA-aligned palette; the two deploy independently so stakeholders can A/B the visual direction.

Palette: wine `#1A0F0C` ground · pomegranate-juice `#A4123F` · sun-warmed honey `#E8B66A`.

## Stack

- Node.js + Express (static server with voice-API proxy)
- `express-rate-limit`, `multer`
- Static single-page site in `public/`

## Getting started

```bash
npm install
cp .env.example .env        # set GRANAT_API_KEY
npm run dev                 # http://localhost:3000
```

## Configuration

| Variable | Purpose |
|---|---|
| `GRANAT_API_KEY` | Upstream voice-API key (injected server-side for the Section 7 demo) |
| `GRANAT_API_BASE` | Upstream voice-API base URL |

## Deployment

Timeweb App Platform — Express static server with the voice-API proxy pattern. See `DEPLOY.md`.

## Repository layout

```
public/
  index.html      wine single-page site (mobile-optimised)
  future.html     voice-fingerprint explainer landing
  policy.html     privacy
  guide.mp3       voice-demo guide audio
  assets/         imagery
  favicon.*       favicons + PWA icons
server.js         Express static + voice proxy + rate limiting
```

## License

Proprietary. © 2026 Granat Music Artistic Talent Contracting L.L.C S.O.C. All rights reserved. See [LICENSE](./LICENSE).
