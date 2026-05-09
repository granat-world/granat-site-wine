# Deploy — granat-future-site

> Timeweb Cloud App Platform · Node 20 · Express. Pattern matches the existing granat.world deploy.

## Prerequisites

- Push access to `CONE-RED/granat-future-site` on GitHub
- Access to the Timeweb Cloud account that hosts granat.world
- The voice-API key (`GRANAT_API_KEY`) — same one used by granat.world prod

## Step-by-step

### 1. Push the repo

```bash
cd ~/Desktop/granat-future-site
# Verify the remote points to CONE-RED/granat-future-site:
git remote -v
# Push:
git push -u origin main
```

### 2. Create the Timeweb app

1. Open Timeweb Cloud → Apps → **Create App**
2. Type: **Backend** → Node.js 20 (or 22)
3. **Source:** GitHub → select `CONE-RED/granat-future-site`, branch `main`
4. **Region:** Амстердам (closest to partner audiences in EU/Middle East)
5. **Build command:** `npm install`
6. **Start command:** `npm start`
7. **Auto-deploy:** ON (commits to `main` redeploy)

### 3. Set environment variables

In Timeweb's "Переменные окружения" panel, set:

| Variable | Value |
|---|---|
| `GRANAT_API_KEY` | (from granat.world's existing Timeweb config — same key) |
| `GRANAT_API_BASE` | `https://granat-api.apps.cone.red` |
| `API_KEY_HEADER` | `X-API-Key` |
| `PORT` | `3000` |
| `MAX_UPLOAD_MB` | `50` |

**Never commit these to the repo.** Timeweb injects them into `process.env` at runtime.

### 4. Bind the domain

1. Wait for first deploy to succeed (~2 min). Confirm `https://<timeweb-issued-url>/health` returns `{ok: true}`.
2. In Timeweb's "Домены" panel, point your chosen secondary Granat domain at this app.
3. Wait for SSL cert provisioning (~5 min).
4. Verify `https://<your-domain>/` loads the site and `https://<your-domain>/health` returns `{ok: true}`.

### 5. Smoke-test the voice demo

1. Open the site, scroll to Section 7 ("How It Works").
2. Click **Try it now**.
3. Allow mic permission, record 27 seconds (sing along with the guide).
4. Wait ~5–10 seconds for processing.
5. Confirm playback — you should hear yourself + 24 backing voices as a choir.

If the demo hangs at "Sending to the choir…", check Timeweb logs for the `[proxy]` lines and verify `GRANAT_API_KEY` is set correctly.

### 6. Share with Olga (Monday morning)

Send the working URL to Olga via the existing Telegram thread (or reply-thread to her last message). Original Claude (in the prior session) drafts the message; Dima sends.

## Rollback

If a deploy breaks: in Timeweb's "Деплои" panel, redeploy a previous successful build. Or:

```bash
git revert HEAD
git push origin main
```

## Local sanity check before pushing

```bash
cd ~/Desktop/granat-future-site
cp .env.example .env
# edit .env to set a real or dummy GRANAT_API_KEY
npm install
npm run dev
# open http://localhost:3000
# - verify all 12 sections render
# - verify EN/RU language toggle works
# - verify the demo modal opens (recording flow needs a real key in .env)
```

## Known issues / KNOWN_ISSUES.md

See [`KNOWN_ISSUES.md`](./KNOWN_ISSUES.md) for any items the build session left unresolved.
