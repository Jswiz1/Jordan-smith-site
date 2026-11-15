// POST /api/market  { host, trade, town, score }
// 1. What people actually type into Google for their trade and town (Google autocomplete).
// 2. Searches "<trade> <town>" on the web, finds where they show up, and picks the top three local rivals.
// 3. Scores each rival's homepage on the same 14 website basics as the audit.
// Needs ANTHROPIC_API_KEY (for web search; web search must be allowed in the Claude Console).

import { json, throttled, sameOrigin, siteFacts, basics } from '../lib/site.mjs';

export const config = { path: '/api/market' };

const MODEL = process.env.AUDIT_MODEL || 'claude-sonnet-5-5';
const SKIP = /(^|\.)(google|bing|yahoo|duckduckgo|facebook|instagram|tiktok|youtube|x|twitter|linkedin|pinterest|reddit|wikipedia|tripadvisor|yelp|yell|thomsonlocal|freeindex|cylex|scoot|192|hotfrog|checkatrade|mybuilder|ratedpeople|trustatrader|trustpilot|nextdoor|gumtree|amazon|ebay|etsy|apple|opentable|deliveroo|ubereats|just-eat|justeat|booking|airbnb|expedia|hotels|timeout|squaremeal|theguardian|bbc|dailymail|independent|telegraph|thetimes|gov|nhs|companieshouse|find-and-update|endole|bark|treatwell|fresha|booksy|groupon|wowcher|visitengland|visit[a-z]+|indeed|glassdoor|reed|totaljobs|rightmove|zoopla|autotrader|carwow|doncasterfreepress|yorkshirepost|examinerlive|thestar|instagr)\.[a-z.]+$/i;

const clean = s => String(s || '').replace(/[^\p{L}\p{N} &'-]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 40);
const rootOf = h => h.replace(/^www\./, '').toLowerCase();

async function suggestions(trade, town) {
  const seeds = town
    ? [`${trade} ${town}`, `best ${trade} ${town}`, `${trade} near me`, `${trade} in ${town}`, `${town} ${trade}`]
    : [`${trade}`, `best ${trade}`, `${trade} near me`, `${trade} uk`];
  const out = [];
  await Promise.all(seeds.map(async (q, i) => {
    try {
      const r = await fetch('https://suggestqueries.google.com/complete/search?client=firefox&hl=en-GB&gl=gb&q=' + encodeURIComponent(q), { signal: AbortSignal.timeout(4000) });
      const d = JSON.parse(await r.text());
      (d[1] || []).forEach((s, j) => out.push({ s: String(s).toLowerCase(), rank: i * 20 + j }));
    } catch {}
  }));
  const seen = new Set();
  return out.sort((a, b) => a.rank - b.rank).map(x => x.s).filter(s => s.length < 60 && !seen.has(s) && seen.add(s)).slice(0, 14);
}

async function webSearch(query, town) {
  const tool = { type: 'web_search_20250305', name: 'web_search', max_uses: 1 };
  if (town) tool.user_location = { type: 'approximate', city: town, country: 'GB' };
  else tool.user_location = { type: 'approximate', country: 'GB' };
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', signal: AbortSignal.timeout(35_000),
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 300, tools: [tool],
      messages: [{ role: 'user', content: `Use web search once for exactly this query, then reply "done": ${query}` }] })
  });
  const d = await r.json();
  if (!r.ok) { console.error('websearch', r.status, JSON.stringify(d).slice(0, 400)); throw new Error('search failed'); }
  const results = [];
  for (const b of d.content || []) if (b.type === 'web_search_tool_result' && Array.isArray(b.content))
    for (const x of b.content) if (x.type === 'web_search_result' && x.url) results.push({ url: x.url, title: x.title || '' });
  return results;
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403);
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503);
  if (throttled(req, 'market', 8)) return json({ error: 'slow down' }, 429);
  let input;
  try { input = await req.json(); } catch { return json({ error: 'Bad request' }, 400); }
  const host = rootOf(String(input.host || ''));
  const trade = clean(input.trade).toLowerCase(), town = clean(input.town);
  if (!host || !trade) return json({ error: 'missing' }, 400);
  const query = (trade + (town ? ' ' + town : '')).toLowerCase();

  const [terms, results] = await Promise.all([
    suggestions(trade, town.toLowerCase()),
    webSearch(query, town).catch(() => null)
  ]);

  let position = null, rivals = [];
  if (results) {
    const seen = new Set();
    const ordered = [];
    results.forEach(r => { try { const h = rootOf(new URL(r.url).hostname); if (!seen.has(h)) { seen.add(h); ordered.push({ h, r }); } } catch {} });
    const idx = ordered.findIndex(o => o.h === host || o.h.endsWith('.' + host));
    position = idx >= 0 ? idx + 1 : null;
    const picks = ordered.filter(o => o.h !== host && !o.h.endsWith('.' + host) && !SKIP.test(o.h)).slice(0, 5);
    const scored = await Promise.all(picks.map(async o => {
      try {
        const f = await siteFacts('https://' + o.h + '/', 6000);
        const b = basics(f);
        const name = (f.brand.site_name || o.r.title.split(/\s[|\-–—:]\s/)[0] || o.h).trim().slice(0, 40);
        return { name, host: o.h, score: b.score, missing: b.checks.filter(c => !c.ok).map(c => c.name).slice(0, 3) };
      } catch { return null; }
    }));
    rivals = scored.filter(Boolean).slice(0, 3);
  }
  return json({ query, position, searched: !!results, rivals, terms });
};
