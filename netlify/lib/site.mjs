// Shared helpers for the audit functions: safe fetching, fact extraction, a website basics score.
import { lookup } from 'node:dns/promises';
import net from 'node:net';

export const UA = 'Mozilla/5.0 (compatible; JordanSmithAudit/1.1; +https://smithjordan.netlify.app)';
const MAX_HTML = 1_500_000;

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

const hits = new Map();
// light per-instance throttle: n requests per hour per visitor, per function
export function throttled(req, key, n) {
  const ip = (req.headers.get('x-nf-client-connection-ip') || 'x') + key;
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 3_600_000);
  if (list.length >= n) return true;
  list.push(now); hits.set(ip, list); return false;
}
export function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(req.url).host; } catch { return false; }
}

function privateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const l = ip.toLowerCase();
  return l === '::1' || l === '::' || l.startsWith('fc') || l.startsWith('fd') || l.startsWith('fe80') || (l.startsWith('::ffff:') && privateIp(l.slice(7)));
}

export async function safeUrl(raw) {
  let u;
  try { u = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://' + raw); } catch { return null; }
  if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) return null;
  if (u.port && !['80', '443'].includes(u.port)) return null;
  if (!u.hostname.includes('.') || /\.(local|internal|localhost)$/i.test(u.hostname)) return null;
  try {
    const addrs = await lookup(u.hostname, { all: true });
    if (!addrs.length || addrs.some(a => privateIp(a.address))) return null;
  } catch { return null; }
  return u;
}

export async function get(url, ms, method = 'GET') {
  let cur = url;
  for (let i = 0; i < 4; i++) {
    const r = await fetch(cur, { method, redirect: 'manual', headers: { 'user-agent': UA, accept: 'text/html,*/*' }, signal: AbortSignal.timeout(ms) });
    if (r.status >= 300 && r.status < 400 && r.headers.get('location')) {
      const next = await safeUrl(new URL(r.headers.get('location'), cur).href);
      if (!next) throw new Error('blocked redirect');
      cur = next; continue;
    }
    return { r, final: new URL(cur) };
  }
  throw new Error('too many redirects');
}

export async function readCapped(r) {
  const reader = r.body.getReader(); const chunks = []; let n = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value); n += value.length;
    if (n > MAX_HTML) { reader.cancel(); break; }
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

const strip = s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const all = (re, s) => [...s.matchAll(re)].map(m => strip(m[1])).filter(Boolean);
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i')); return m ? m[1] : ''; };
const meta = (html, key) => {
  const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]*>`, 'i'));
  return m ? strip(attr(m[0], 'content')) : '';
};
const abs = (u, base) => { try { return u ? new URL(u.trim(), base).href : ''; } catch { return ''; } };

// the brand colour: theme-color, else the most used saturated colour in the page's own CSS
function brandColour(html) {
  const tc = meta(html, 'theme-color');
  if (/^#[0-9a-f]{6}$/i.test(tc)) return tc;
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join(' ') + ' ' +
    [...html.matchAll(/style=["']([^"']+)["']/gi)].map(m => m[1]).join(' ');
  const count = {};
  for (const m of css.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi)) {
    let h = m[1].toLowerCase(); if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx - mn < 40 || mx < 50) continue; // skip greys, black, white
    count[h] = (count[h] || 0) + 1;
  }
  const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  return top ? '#' + top[0] : '';
}

export function facts(html, finalUrl, ms, bytes) {
  const host = finalUrl.hostname;
  const base = finalUrl.href;
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>|<svg[\s\S]*?<\/svg>/gi, ' ');
  const links = [...html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const has = re => re.test(html);
  const social = ['instagram.com', 'tiktok.com', 'facebook.com', 'linkedin.com', 'youtube.com', 'x.com', 'twitter.com']
    .filter(d => links.some(l => l[1].includes(d)));
  const platform = [['Shopify', /cdn\.shopify|Shopify\.theme/], ['WordPress', /wp-content|wp-includes/], ['Wix', /wixstatic|_wix/], ['Squarespace', /squarespace/],
    ['Webflow', /webflow/], ['Framer', /framer(usercontent)?\.com/], ['GoDaddy', /godaddy|wsimg/]].filter(([, re]) => has(re)).map(([n]) => n);
  const booking = [['Calendly', /calendly/], ['Acuity', /acuityscheduling/], ['Fresha', /fresha/], ['OpenTable', /opentable/], ['ResDiary', /resdiary/],
    ['SevenRooms', /sevenrooms/], ['Booksy', /booksy/], ['Treatwell', /treatwell/], ['Square', /squareup|square\.site/], ['Cal.com', /cal\.com\//]].filter(([, re]) => has(re)).map(([n]) => n);
  const tracking = [['Google Analytics', /gtag\(|google-analytics|googletagmanager\.com\/gtag/], ['Google Tag Manager', /googletagmanager\.com\/gtm/],
    ['Meta Pixel', /connect\.facebook\.net|fbq\(/], ['TikTok Pixel', /analytics\.tiktok/], ['Hotjar', /hotjar/], ['Klaviyo', /klaviyo/], ['Mailchimp', /mailchimp|list-manage/]]
    .filter(([, re]) => has(re)).map(([n]) => n);
  const ctas = [...new Set([...html.matchAll(/<(?:button|a)\b[^>]*>([\s\S]{1,120}?)<\/(?:button|a)>/gi)].map(m => strip(m[1]))
    .filter(t => t && t.length < 40 && /book|buy|shop|order|call|contact|quote|enquir|get|start|join|sign|reserve|subscribe|visit|try/i.test(t)))].slice(0, 12);
  const schema = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map(m => m[1]);
  const logoTag = imgs.find(t => /logo/i.test(attr(t, 'src') + attr(t, 'alt') + attr(t, 'class') + attr(t, 'id')));
  const logo = abs(logoTag && (attr(logoTag, 'src') || attr(logoTag, 'data-src')), base) ||
    abs(attr((html.match(/<link[^>]+rel=["']apple-touch-icon[^>]*>/i) || [''])[0], 'href'), base);
  const bigImg = imgs.map(t => attr(t, 'src') || attr(t, 'data-src')).find(s => s && !/logo|icon|sprite|\.svg/i.test(s));
  return {
    url: finalUrl.href, https: finalUrl.protocol === 'https:', load_ms: ms, html_kb: Math.round(bytes / 1024),
    title: strip((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || ''),
    meta_description: meta(html, 'description'),
    og_title: meta(html, 'og:title'), og_image: !!meta(html, 'og:image'),
    viewport: has(/<meta[^>]+name=["']viewport/i), lang: (html.match(/<html[^>]*lang=["']([^"']+)/i) || [])[1] || '',
    canonical: has(/rel=["']canonical/i), favicon: has(/rel=["'][^"']*icon/i),
    h1: all(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, html).slice(0, 4),
    h2: all(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, html).slice(0, 14),
    h3_count: (html.match(/<h3\b/gi) || []).length,
    images: imgs.length, images_missing_alt: imgs.filter(i => !/\balt=["'][^"']+/i.test(i)).length,
    links_internal: links.filter(l => l[1].startsWith('/') || l[1].includes(host)).length,
    links_external: links.filter(l => /^https?:/.test(l[1]) && !l[1].includes(host)).length,
    phone_link: has(/href=["']tel:/i), email_link: has(/href=["']mailto:/i), forms: (html.match(/<form\b/gi) || []).length,
    video: has(/<video\b|youtube\.com\/embed|player\.vimeo/i), reviews_widget: has(/trustpilot|reviews\.io|google.*reviews|feefo|elfsight/i),
    social_links: social, platform, booking, tracking, schema_types: [...new Set(schema)].slice(0, 10),
    cookie_banner: has(/cookiebot|onetrust|cookieyes|termly|cookie-consent|iubenda/i),
    cta_texts: ctas,
    brand: { logo, image: abs(meta(html, 'og:image'), base) || abs(bigImg, base), colour: brandColour(html), site_name: meta(html, 'og:site_name') },
    visible_text: strip(body).slice(0, 9000)
  };
}

// 14 website basics, 100 points. Same yardstick for them and their rivals.
export function basics(f) {
  const altOk = f.images ? (f.images - f.images_missing_alt) / f.images >= 0.8 : true;
  const checks = [
    ['Secure (HTTPS)', 10, f.https],
    ['Loads fast', 10, f.load_ms < 1500, f.load_ms < 3000 ? 5 : 0],
    ['Clear page title', 8, !!f.title && f.title.length <= 65],
    ['Search description', 8, !!f.meta_description],
    ['One main headline', 8, f.h1.length === 1],
    ['Works on mobile', 8, f.viewport],
    ['Call to action', 10, f.cta_texts.length > 0],
    ['Easy to contact', 6, f.phone_link || f.email_link],
    ['Social links', 6, f.social_links.length >= 2],
    ['Structured data', 6, f.schema_types.length > 0],
    ['Share image', 6, f.og_image],
    ['Image descriptions', 6, altOk],
    ['Analytics', 4, f.tracking.length > 0],
    ['Sitemap', 4, !!f.sitemap]
  ];
  let score = 0;
  const list = checks.map(([name, pts, ok, partial]) => { const got = ok ? pts : (partial || 0); score += got; return { name, ok: !!ok }; });
  return { score, checks: list };
}

// fetch a homepage and extract facts (used for rivals; the main audit does the same inline)
export async function siteFacts(raw, ms = 7000) {
  const target = await safeUrl(raw);
  if (!target) throw new Error('bad url');
  const t0 = Date.now();
  const { r, final } = await get(target.href, ms);
  if (!(r.headers.get('content-type') || '').includes('html')) throw new Error('not html');
  const html = await readCapped(r);
  const f = facts(html, final, Date.now() - t0, html.length);
  try { const sm = await get(new URL('/sitemap.xml', final).href, 2000); f.sitemap = sm.r.ok; } catch { f.sitemap = false; }
  return f;
}
