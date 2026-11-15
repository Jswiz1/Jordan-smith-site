// POST /api/audit  { url: "yourbusiness.co.uk" }
// Fetches the page, pulls out the facts, asks Claude for a teardown, returns JSON.
// Needs one environment variable in Netlify: ANTHROPIC_API_KEY
// Optional: AUDIT_MODEL (defaults to claude-sonnet-5-5)

import { json, throttled, sameOrigin, safeUrl, get, readCapped, facts, basics } from '../lib/site.mjs';

export const config = { path: '/api/audit' };

const MODEL = process.env.AUDIT_MODEL || 'claude-sonnet-5-5';

const SYSTEM = `You are the website audit engine on Jordan Smith's site. Jordan is a Doncaster marketing consultant and co-founder of Seven Studios (video and podcast production), Scene (coffee), The Don (local media, 50k audience in a year) and Don Card. He led marketing at Jonny From Donny (£4m in a year, a trailer with 2M+ views), builds websites, custom CRMs (one replaced a £200+ a month system) and AI automations, and has Dyno-Rod (FTSE 100) as a retainer client.

His services: Strategy, Content, Video production, Web, AI automation, AI workflows, Project management, Claude business support.
His offers:
- diag: Diagnostic, £1,500 one-off. One day inside the business, one day turning it into a plan. For businesses that need clarity before spending.
- build: Build, £3,500 a month. He finds the weak points, sets the plan, builds and hands it over. For businesses that know it's broken and need it fixed.
- md: Marketing Director, £1,500 a month. Weekly calls, advice, a non-exec seat. For businesses with people doing the work but no senior lead.

Audit the homepage you are given. Rules:
- Base every point on the evidence supplied. You cannot see the design or images, only the HTML facts and text, so never comment on colours, photos or layout you cannot see.
- Be specific to this business: quote their actual headline, CTA wording or missing pieces. No generic advice that would fit any site.
- British English. Plain, direct, warm, a little blunt. Short sentences. No jargon, no hype words, no exclamation marks, no em dashes.
- Score honestly. Most small business sites land between 35 and 70.
- "support" is how Jordan personally would help, in first person ("I'd..."), concrete and tied to a weak point, drawing on his real experience where it fits.
- If the page is empty, blocked or is a holding page, say so plainly and score low.
- "hero" is your rewrite of the top of their homepage. Never invent numbers, ratings, awards or years. The proof line must come from something true on the page, or be a plain trust line with no figures.
- "film" is three short videos Seven Studios would shoot for them, specific to what they sell and who buys it.
- "trade" is what a local customer would type into Google to find them, 1-3 words, e.g. "coffee shop", "wedding photographer", "plumber". "town" is the town or city they serve, from the page; empty if national or unclear.`;

const TOOL = {
  name: 'report',
  description: 'Return the website audit.',
  input_schema: {
    type: 'object',
    required: ['business', 'score', 'verdict', 'categories', 'working', 'weak', 'fix_first', 'support', 'offer', 'offer_reason', 'plan'],
    properties: {
      business: { type: 'object', required: ['name', 'what', 'trade', 'town'], properties: { name: { type: 'string' }, what: { type: 'string', description: 'What they do, under 12 words' },
        trade: { type: 'string' }, town: { type: 'string' } } },
      hero: { type: 'object', required: ['headline', 'sub', 'cta', 'cta2', 'proof'], properties: {
        headline: { type: 'string', description: 'Under 8 words' }, sub: { type: 'string', description: 'Under 18 words' },
        cta: { type: 'string', description: 'Main button, 2-4 words' }, cta2: { type: 'string', description: 'Second button, 2-4 words' },
        proof: { type: 'string', description: 'Short trust line, no invented figures' } } },
      film: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'object', required: ['title', 'idea', 'format'], properties: {
        title: { type: 'string', description: 'Under 6 words' }, idea: { type: 'string', description: 'One or two sentences' }, format: { type: 'string', description: 'e.g. 30s Reel, 2-minute brand film, podcast series' } } } },
      score: { type: 'integer', minimum: 0, maximum: 100 },
      verdict: { type: 'string', description: 'One or two sentences, the honest headline.' },
      categories: {
        type: 'array', minItems: 6, maxItems: 6,
        items: { type: 'object', required: ['name', 'score', 'note'], properties: {
          name: { type: 'string', enum: ['First impression', 'Message', 'Conversion', 'Trust', 'Search', 'Tech'] },
          score: { type: 'integer', minimum: 0, maximum: 10 }, note: { type: 'string', description: 'Under 14 words' } } }
      },
      working: { type: 'array', minItems: 2, maxItems: 3, items: { type: 'string' } },
      weak: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'object', required: ['title', 'detail', 'impact'], properties: {
        title: { type: 'string' }, detail: { type: 'string' }, impact: { type: 'string', enum: ['High', 'Medium', 'Low'] } } } },
      fix_first: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'object', required: ['title', 'how'], properties: { title: { type: 'string' }, how: { type: 'string' } } } },
      support: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'object', required: ['service', 'title', 'detail'], properties: {
        service: { type: 'string', enum: ['Strategy', 'Content', 'Video production', 'Web', 'AI automation', 'AI workflows', 'Project management', 'Claude business support'] },
        title: { type: 'string' }, detail: { type: 'string', description: "First person, what I'd do, 1-2 sentences" } } } },
      offer: { type: 'string', enum: ['diag', 'build', 'md'] },
      offer_reason: { type: 'string', description: 'One sentence, why this offer fits them' },
      plan: { type: 'array', minItems: 4, maxItems: 4, items: { type: 'object', required: ['week', 'focus'], properties: { week: { type: 'string' }, focus: { type: 'string' } } } }
    }
  }
};

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503);

  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403);
  if (throttled(req, 'audit', 8)) return json({ error: 'Too many audits from you this hour. Try again later.' }, 429);

  let input;
  try { input = await req.json(); } catch { return json({ error: 'Bad request' }, 400); }
  const target = await safeUrl(String(input.url || '').trim().slice(0, 300));
  if (!target) return json({ error: 'That doesn’t look like a public website address.' }, 400);

  let f;
  try {
    const t0 = Date.now();
    const { r, final } = await get(target.href, 9000);
    if (!(r.headers.get('content-type') || '').includes('html')) return json({ error: 'That address didn’t return a web page.' }, 422);
    const html = await readCapped(r);
    f = facts(html, final, Date.now() - t0, html.length);
    f.status = r.status;
    try { const sm = await get(new URL('/sitemap.xml', final).href, 2500); f.sitemap = sm.r.ok; } catch { f.sitemap = false; }
  } catch (e) {
    return json({ error: 'I couldn’t reach that site. Check the address and try again.' }, 422);
  }

  try {
    const slim = { ...f }; delete slim.brand;
    const ai = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: AbortSignal.timeout(50_000),
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL, max_tokens: 3500, system: SYSTEM, tools: [TOOL], tool_choice: { type: 'auto' },
        messages: [{ role: 'user', content: 'Audit this homepage and reply only by calling the report tool. Facts extracted from the HTML:\n' + JSON.stringify(slim, null, 1) }]
      })
    });
    const out = await ai.json();
    const use = (out.content || []).find(c => c.type === 'tool_use');
    if (!ai.ok || !use) { console.error('anthropic', ai.status, JSON.stringify(out).slice(0, 500)); return json({ error: 'The audit engine is busy. Try again in a minute.' }, 502); }
    return json({ site: { url: f.url, host: new URL(f.url).hostname, title: f.title }, facts: {
      https: f.https, load_ms: f.load_ms, html_kb: f.html_kb, platform: f.platform, booking: f.booking, tracking: f.tracking, social: f.social_links },
      brand: f.brand, basics: basics(f),
      report: use.input });
  } catch (e) {
    console.error(e);
    return json({ error: 'The audit took too long. Try again in a minute.' }, 504);
  }
};
