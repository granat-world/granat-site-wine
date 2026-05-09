import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {
  PORT = 3000,
  GRANAT_API_BASE = 'https://granat-api.apps.cone.red',
  GRANAT_API_KEY,
  API_KEY_HEADER = 'X-API-Key',
  MAX_UPLOAD_MB = '50',
} = process.env;

if (!GRANAT_API_KEY) {
  console.error('FATAL: GRANAT_API_KEY env var is required');
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(MAX_UPLOAD_MB) * 1024 * 1024 },
});

const voiceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a minute.' },
});

// Status polling is cheap and happens once per second during a 25 s pipeline,
// so it needs its own much higher cap.
const statusLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 180,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many status checks. Please wait a minute.' },
});

app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Build the headers we forward to the upstream voice API. Forwarding the
// real client IP lets the upstream's per-IP rate limiter attribute requests
// to actual users instead of pooling everyone behind this proxy's single IP.
function upstreamHeaders(req, extra) {
  const clientIp = req.ip || req.socket?.remoteAddress || '';
  const fwd = req.headers['x-forwarded-for'];
  return {
    [API_KEY_HEADER]: GRANAT_API_KEY,
    'X-Forwarded-For': fwd ? `${fwd}, ${clientIp}` : clientIp,
    'X-Real-IP': clientIp,
    ...(extra || {}),
  };
}

app.post(
  '/api/voice/process',
  voiceLimiter,
  upload.single('audio'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'no file uploaded (expected field "audio")' });
    }

    const form = new FormData();
    form.append(
      'audio',
      new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/wav' }),
      req.file.originalname || 'voice.wav'
    );

    try {
      const upstream = await fetch(`${GRANAT_API_BASE}/api/v1/voice/process`, {
        method: 'POST',
        headers: upstreamHeaders(req),
        body: form,
      });
      const body = await upstream.text();
      res
        .status(upstream.status)
        .type(upstream.headers.get('content-type') || 'application/json')
        .send(body);
    } catch (err) {
      console.error('[proxy] /api/voice/process failed:', err);
      res.status(502).json({ error: 'upstream voice service unreachable' });
    }
  }
);

app.get('/api/voice/result/:jobId/audio', voiceLimiter, async (req, res) => {
  const { jobId } = req.params;
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(jobId)) {
    return res.status(400).json({ error: 'invalid jobId' });
  }

  try {
    const upstream = await fetch(
      `${GRANAT_API_BASE}/api/v1/voice/result/${encodeURIComponent(jobId)}/audio`,
      { headers: upstreamHeaders(req) }
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).send(text);
    }

    res.setHeader(
      'Content-Type',
      upstream.headers.get('content-type') || 'audio/wav'
    );
    const len = upstream.headers.get('content-length');
    if (len) res.setHeader('Content-Length', len);

    Readable.fromWeb(upstream.body).pipe(res);
  } catch (err) {
    console.error('[proxy] /api/voice/result failed:', err);
    res.status(502).json({ error: 'upstream voice service unreachable' });
  }
});

app.get('/api/voice/status/:jobId', statusLimiter, async (req, res) => {
  const { jobId } = req.params;
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(jobId)) {
    return res.status(400).json({ error: 'invalid jobId' });
  }

  try {
    const upstream = await fetch(
      `${GRANAT_API_BASE}/api/v1/voice/status/${encodeURIComponent(jobId)}`,
      { headers: upstreamHeaders(req) }
    );
    const body = await upstream.text();
    res
      .status(upstream.status)
      .type(upstream.headers.get('content-type') || 'application/json')
      .send(body);
  } catch (err) {
    console.error('[proxy] /api/voice/status failed:', err);
    res.status(502).json({ error: 'upstream voice service unreachable' });
  }
});

app.use(
  express.static(path.join(__dirname, 'public'), {
    index: 'index.html',
    extensions: ['html'],
    setHeaders: (res, filePath) => {
      // HTML must not be aggressively cached — the modal evolves; old cached
      // copies cause confusing UI mismatches during dev. Static images keep
      // a short cache so the page stays fast on repeat loads.
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    },
  })
);

app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`granat-future-site listening on :${PORT}`);
  console.log(`  upstream: ${GRANAT_API_BASE}`);
  console.log(`  upload limit: ${MAX_UPLOAD_MB}MB`);
});
