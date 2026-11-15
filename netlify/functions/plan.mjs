// POST /api/plan  { session_id, audit }
// Checks the Stripe payment, then asks Claude to write the full paid plan.
// Needs in Netlify: ANTHROPIC_API_KEY, STRIPE_SECRET_KEY (a restricted key with read access to Checkout Sessions is enough)
// Optional: AUDIT_MODEL, PLAN_PRICE_PENCE (defaults to 25000)

export const config = { path: '/api/plan' };

const MODEL = process.env.AUDIT_MODEL || 'claude-sonnet-5-5';
const PRICE = Number(process.env.PLAN_PRICE_PENCE || 25000);
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
export const refFor = host => String(host || '').toLowerCase().replace(/^www\./, '').replace(/[^a-z0-9]+/g, '_').slice(0, 190);

const SYSTEM = `You write the paid marketing plan that follows a website audit on Jordan Smith's site. The buyer paid £250 for it, so it must be worth far more than that: specific, practical, ready to act on this week. Jordan is a Doncaster marketing consultant (Seven Studios video production, Scene coffee, The Don local media, custom CRMs, AI automation).

Rules:
- Use the audit you are given. Be specific to this business. Quote and rewrite their actual words where useful.
- British English. Plain, direct, warm. Short sentences. No jargon, no hype, no exclamation marks, no em dashes.
- Tasks must be things the owner or their team can do without Jordan. Name free or cheap tools where they help.
- Do not invent facts about the business beyond the audit. Where you need a fact, say what to fill in, in square brackets.`;

const TOOL = {
  name: 'plan', description: 'Return the full plan.',
  input_schema: {
    type: 'object',
    required: ['summary', 'headline', 'quick_wins', 'weeks', 'content', 'measure', 'tools'],
    properties: {
      summary: { type: 'string', description: 'Three or four sentences: where they are, where this plan gets them.' },
      headline: { type: 'object', required: ['current', 'options', 'cta'], properties: {
        current: { type: 'string' }, options: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'string', description: 'Headline plus a one-line subheading, separated by " / "' } },
        cta: { type: 'array', minItems: 2, maxItems: 3, items: { type: 'string', description: 'Button wording' } } } },
      quick_wins: { type: 'array', minItems: 5, maxItems: 6, items: { type: 'object', required: ['title', 'how', 'time'], properties: {
        title: { type: 'string' }, how: { type: 'string' }, time: { type: 'string', description: 'e.g. 20 minutes' } } } },
      weeks: { type: 'array', minItems: 4, maxItems: 4, items: { type: 'object', required: ['week', 'goal', 'tasks'], properties: {
        week: { type: 'string' }, goal: { type: 'string' }, tasks: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'string' } } } } },
      content: { type: 'array', minItems: 6, maxItems: 6, items: { type: 'object', required: ['idea', 'format'], properties: {
        idea: { type: 'string' }, format: { type: 'string', description: 'e.g. 30s Reel, carousel, email' } } } },
      measure: { type: 'array', minItems: 3, maxItems: 4, items: { type: 'object', required: ['metric', 'target'], properties: { metric: { type: 'string' }, target: { type: 'string' } } } },
      tools: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'object', required: ['name', 'for'], properties: { name: { type: 'string' }, for: { type: 'string' } } } }
    }
  }
};

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  if (!process.env.ANTHROPIC_API_KEY || !process.env.STRIPE_SECRET_KEY) return json({ error: 'not_configured' }, 503);

  let input;
  try { input = await req.json(); } catch { return json({ error: 'Bad request' }, 400); }
  const sid = String(input.session_id || '');
  const audit = input.audit || {};
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sid) || !audit.report || !audit.site) return json({ error: 'Missing payment or audit.' }, 400);

  // 1. check the payment with Stripe
  let session;
  try {
    const r = await fetch('https://api.stripe.com/v1/checkout/sessions/' + sid, {
      headers: { authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY }, signal: AbortSignal.timeout(8000) });
    session = await r.json();
    if (!r.ok) return json({ error: 'I couldn’t find that payment.' }, 402);
  } catch { return json({ error: 'Couldn’t check the payment. Refresh to try again.' }, 502); }
  if (session.payment_status !== 'paid' || session.amount_total < PRICE || session.currency !== 'gbp')
    return json({ error: 'That payment hasn’t gone through.' }, 402);
  if (session.client_reference_id && session.client_reference_id !== refFor(audit.site.host))
    return json({ error: 'That payment was for a different website.' }, 403);

  // 2. write the plan
  const slim = { site: audit.site.host, business: audit.report.business, score: audit.report.score, verdict: audit.report.verdict,
    categories: audit.report.categories, working: audit.report.working, weak: audit.report.weak, fix_first: audit.report.fix_first };
  try {
    const ai = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: AbortSignal.timeout(50_000),
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 3500, system: SYSTEM, tools: [TOOL], tool_choice: { type: 'auto' },
        messages: [{ role: 'user', content: 'Write the full plan from this audit and reply only by calling the plan tool:\n' + JSON.stringify(slim, null, 1) }] })
    });
    const out = await ai.json();
    const use = (out.content || []).find(c => c.type === 'tool_use');
    if (!ai.ok || !use) { console.error('anthropic', ai.status, JSON.stringify(out).slice(0, 500)); return json({ error: 'busy' }, 502); }
    const cd = session.customer_details || {};
    return json({ plan: use.input, buyer: { email: cd.email || '', name: cd.name || '' } });
  } catch (e) {
    console.error(e);
    return json({ error: 'busy' }, 504);
  }
};
