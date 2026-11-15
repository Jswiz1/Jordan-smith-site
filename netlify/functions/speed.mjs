// POST /api/speed  { url }
// Google's own mobile speed test (PageSpeed Insights) plus a phone screenshot of the homepage.
// Optional env: PSI_API_KEY (free from Google Cloud; raises the daily limit)

import { json, throttled, sameOrigin, safeUrl } from '../lib/site.mjs';

export const config = { path: '/api/speed' };

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403);
  if (throttled(req, 'speed', 10)) return json({ error: 'slow down' }, 429);
  let input;
  try { input = await req.json(); } catch { return json({ error: 'Bad request' }, 400); }
  const target = await safeUrl(String(input.url || '').slice(0, 300));
  if (!target) return json({ error: 'bad url' }, 400);

  const q = new URLSearchParams({ url: target.href, strategy: 'mobile', category: 'performance' });
  if (process.env.PSI_API_KEY) q.set('key', process.env.PSI_API_KEY);
  try {
    const r = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' + q, { signal: AbortSignal.timeout(45_000) });
    const d = await r.json();
    if (!r.ok || !d.lighthouseResult) { console.error('psi', r.status, JSON.stringify(d).slice(0, 300)); return json({ error: 'unavailable' }, 502); }
    const lh = d.lighthouseResult, a = lh.audits || {};
    const num = k => (a[k] && typeof a[k].numericValue === 'number') ? a[k].numericValue : null;
    const shot = a['final-screenshot'] && a['final-screenshot'].details && a['final-screenshot'].details.data;
    return json({
      score: Math.round((lh.categories.performance.score || 0) * 100),
      lcp_s: num('largest-contentful-paint') != null ? +(num('largest-contentful-paint') / 1000).toFixed(1) : null,
      fcp_s: num('first-contentful-paint') != null ? +(num('first-contentful-paint') / 1000).toFixed(1) : null,
      cls: num('cumulative-layout-shift') != null ? +num('cumulative-layout-shift').toFixed(2) : null,
      weight_kb: num('total-byte-weight') != null ? Math.round(num('total-byte-weight') / 1024) : null,
      screenshot: typeof shot === 'string' && shot.startsWith('data:image/') ? shot : null
    });
  } catch (e) {
    console.error(e);
    return json({ error: 'timeout' }, 504);
  }
};
