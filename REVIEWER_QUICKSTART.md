# granat-site-wine — Reviewer Quickstart

> **Out of scope for Phase 1 independent code review.**
> This repository is a **Cone Red Phase 1 supporting deliverable**, delivered to the Customer as-is at the close of Phase 1. It is **not** one of the two in-scope repositories. Master review guide: [`granat-world/GRANAT/REVIEW_GUIDE.md`](https://github.com/granat-world/GRANAT/blob/main/REVIEW_GUIDE.md).
>
> This quickstart is provided so that a curious reviewer can run the project locally if they want — not because review is expected.

---

## 1. What this repository is

A single-page partner-facing narrative site with an embedded voice-to-choir demo, in the **wine-brown** visual direction (working name "CC" from the May 2026 design pipeline). Its sibling `granat-site-indigo` carries the same content in a periwinkle-indigo palette; the two deploy independently so stakeholders can A/B the visual direction. Palette: wine `#1A0F0C` ground · pomegranate-juice `#A4123F` · sun-warmed honey `#E8B66A`.

## 2. Requirements

| Tool | Version |
|---|---|
| Node.js | ≥ 18 (LTS) |
| npm | ≥ 10 |
| Browser | any modern |

**Time to running:** ~1–2 minutes

## 3. Clone and run

```bash
git clone https://github.com/granat-world/granat-site-wine.git
cd granat-site-wine
cp .env.example .env
# Optional: set GRANAT_API_KEY in .env if you want the embedded voice demo
#          (Section 7) to call the upstream Granat voice API. Without it,
#          the page renders and animations work, but the voice demo fails.
npm install
npm run dev
# Open http://localhost:3000
```

The Express server serves the static site **and** proxies the voice-API calls (so the API key never reaches the browser).

## 4. What to look at

- **`public/index.html`** — single-page wine site (mobile-optimised)
- **`public/future.html`** — voice-fingerprint explainer landing
- **`public/policy.html`** — privacy
- **`server.js`** — Express static server + voice-API proxy + rate limiting (10 req/min/IP)
- **`DEPLOY.md`** — Timeweb App Platform deployment

## 5. Stack overview

- Node.js + Express
- `express-rate-limit` (rate limiting)
- `multer` (multipart upload handling)
- Static single-page site in `public/`

## 6. License

Proprietary. © 2026 Granat Music Artistic Talent Contracting L.L.C S.O.C. See `LICENSE`.

---

**For the actual Phase 1 review pack**, see [`granat-world/GRANAT/REVIEW_GUIDE.md`](https://github.com/granat-world/GRANAT/blob/main/REVIEW_GUIDE.md) — the master guide covering the in-scope repositories (`GRANAT` + `reactjs-miniapp-granat`), their SBOMs, security audits, and the 14 048-line platform documentation pack.
