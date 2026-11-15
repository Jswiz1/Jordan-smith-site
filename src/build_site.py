"""Build the Netlify-ready site from index.html.

Usage: python3 build_site.py https://yourdomain.co.uk
Lives in src/ of the repo. Rebuilds ../public/ (the site Netlify serves).
Netlify functions live in ../netlify/ and are not touched here.
"""
import html, json, os, re, shutil, sys
from PIL import Image

SRC = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(SRC)
OUT = os.path.join(REPO, 'public')
DOMAIN = (sys.argv[1] if len(sys.argv) > 1 else 'https://YOUR-DOMAIN').rstrip('/')
src = open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
# the contact address is whatever the page's own email link uses
EMAIL = re.search(r'mailto:([^"?&]+)', src).group(1)

# ---- project data, read straight from the page ----
a = src.index('var P = [') + 8
b = src.index('\n  ];', a) + 4
import subprocess
P = json.loads(subprocess.run(['node', '-e', 'process.stdout.write(JSON.stringify(eval("("+require("fs").readFileSync(0,"utf8")+")")))'],
                              input=src[a:b].strip().rstrip(';'), capture_output=True, text=True, check=True).stdout)

# ---- strip the artifact-only head bits and wrap as a real document ----
head_end = src.index('<div class="loader"')
head, body = src[:head_end], src[head_end:]
head = re.sub(r'<title>.*?</title>\n', '', head)
head = re.sub(r'<meta name="claude:viewport-fit-sides"[^>]*>\n', '', head)
head = re.sub(r'<meta name="description"[^>]*>\n', '', head)
head = re.sub(r'<meta (property|name)="(og|twitter):[^"]*"[^>]*>\n', '', head)

# a case page opens its project on load
body = body.replace(
    "  var h = (location.hash||'').slice(1);",
    "  var h = window.__OPEN || (location.hash||'').slice(1);")

def esc(s): return html.escape(s, quote=True)

def meta_block(title, desc, path, image='og.jpg', extra_ld=None):
    url = DOMAIN + path
    ld = [{
        '@context': 'https://schema.org', '@type': 'Person', 'name': 'Jordan Smith',
        'jobTitle': 'Co-founder & Creative Director', 'url': DOMAIN + '/', 'email': 'mailto:' + EMAIL,
        'image': DOMAIN + '/portrait.jpg',
        'address': {'@type': 'PostalAddress', 'addressLocality': 'Doncaster', 'addressCountry': 'GB'},
        'worksFor': [
            {'@type': 'Organization', 'name': 'Seven Studios', 'url': 'https://sevenstudios.co.uk'},
            {'@type': 'Organization', 'name': 'Scene', 'url': 'https://drinkscene.co.uk'},
            {'@type': 'Organization', 'name': 'The Don', 'url': 'https://wearethedon.co.uk'},
            {'@type': 'Organization', 'name': 'Don Card', 'url': 'https://doncard.co.uk'}],
        'knowsAbout': ['Marketing strategy', 'Content', 'Video production', 'Web design',
                       'AI automation', 'CRM systems', 'Project management', 'Brand identity']}]
    if extra_ld: ld.append(extra_ld)
    return (
        '<!doctype html>\n<html lang="en-GB">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f'<title>{esc(title)}</title>\n'
        f'<meta name="description" content="{esc(desc)}">\n'
        f'<link rel="canonical" href="{url}">\n'
        '<base href="/">\n'
        '<meta name="robots" content="index, follow">\n'
        '<meta property="og:type" content="website">\n'
        '<meta property="og:site_name" content="Jordan Smith">\n'
        f'<meta property="og:url" content="{url}">\n'
        f'<meta property="og:title" content="{esc(title)}">\n'
        f'<meta property="og:description" content="{esc(desc)}">\n'
        f'<meta property="og:image" content="{DOMAIN}/{image}">\n'
        '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
        '<meta property="og:locale" content="en_GB">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'
        '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n'
        + ''.join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>\n' for x in ld))

HOME_TITLE = 'Jordan Smith · Marketing consultant & creative director, Doncaster'
HOME_DESC = ('Marketing consultancy, video production, websites, custom CRMs and AI automation from Doncaster. '
             'Co-founder of Seven Studios, Scene, The Don and Don Card.')
service = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', 'name': 'Jordan Smith · Marketing consultancy',
    'url': DOMAIN + '/', 'email': EMAIL, 'image': DOMAIN + '/og.jpg', 'areaServed': 'GB',
    'address': {'@type': 'PostalAddress', 'addressLocality': 'Doncaster', 'addressCountry': 'GB'},
    'makesOffer': [
        {'@type': 'Offer', 'name': 'Diagnostic', 'price': '1500', 'priceCurrency': 'GBP',
         'description': 'Two days: one inside your business, one turning it into a plan for your marketing, systems and flow.'},
        {'@type': 'Offer', 'name': 'Build', 'price': '3500', 'priceCurrency': 'GBP',
         'priceSpecification': {'@type': 'UnitPriceSpecification', 'price': '3500', 'priceCurrency': 'GBP', 'unitText': 'MONTH'},
         'description': 'Find the weak points, set the plan, then build and hand it over to your team.'},
        {'@type': 'Offer', 'name': 'Marketing Director', 'price': '1500', 'priceCurrency': 'GBP',
         'priceSpecification': {'@type': 'UnitPriceSpecification', 'price': '1500', 'priceCurrency': 'GBP', 'unitText': 'MONTH'},
         'description': 'Freelance marketing director: weekly calls, support and advice, and a non-executive seat on your marketing team.'}]}

if os.path.exists(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)

def write(path, text):
    full = os.path.join(OUT, path.lstrip('/'))
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, 'w', encoding='utf-8').write(text)

write('index.html', meta_block(HOME_TITLE, HOME_DESC, '/', extra_ld=service) + head + '</head>\n<body>\n' + body + '\n</body>\n</html>\n')

urls = ['/']
for p in P:
    path = '/work/' if p['id'] == 'work' else f'/work/{p["id"]}/'
    if p.get('collection'):
        desc = 'Selected work by Jordan Smith: ' + ', '.join(c['k'] for c in p['collection']) + '.'
    else:
        desc = f'{p["line"]} {p.get("brief", "")}'.strip()
    desc = (desc[:155].rsplit(' ', 1)[0] + '…') if len(desc) > 158 else desc
    title = f'{p["title"]} · Jordan Smith'
    ld = {'@context': 'https://schema.org', '@type': 'CreativeWork', 'name': p['title'], 'description': desc,
          'creator': {'@type': 'Person', 'name': 'Jordan Smith'}, 'url': DOMAIN + path}
    if p.get('img'): ld['image'] = DOMAIN + '/' + p['img']
    page = (meta_block(title, desc, path, extra_ld=ld) + head
            + f'<script>window.__OPEN = {json.dumps(p["id"])};</script>\n</head>\n<body>\n' + body + '\n</body>\n</html>\n')
    write(path + 'index.html', page)
    urls.append(path)

# ---- assets ----
for f in os.listdir(SRC):
    if f.lower().endswith(('.jpg', '.png')) and f != 'build_site.py':
        shutil.copy2(os.path.join(SRC, f), os.path.join(OUT, f))
shutil.copytree(os.path.join(SRC, 'crm'), os.path.join(OUT, 'crm'))

write('favicon.svg', "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='#0A0A0A'/>"
      "<text x='32' y='42' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-weight='700' font-size='28' fill='#FAFAFA' letter-spacing='-1'>JS</text></svg>")
from PIL import ImageDraw, ImageFont
ic = Image.new('RGB', (180, 180), (10, 10, 10)); d = ImageDraw.Draw(ic)
try: fnt = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-SemiBold.otf', 80)
except Exception: fnt = ImageFont.load_default()
d.text((90, 92), 'JS', font=fnt, fill=(250, 250, 250), anchor='mm'); ic.save(os.path.join(OUT, 'apple-touch-icon.png'))

write('robots.txt', f'User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n')
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      + ''.join(f'  <url><loc>{DOMAIN}{u}</loc><changefreq>monthly</changefreq><priority>{"1.0" if u == "/" else "0.8"}</priority></url>\n' for u in urls)
      + '</urlset>\n')
write('_headers', '''/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/crm/*
  Cache-Control: public, max-age=31536000, immutable
''')
write('_redirects', '/*  /index.html  404\n')
for d in ('css', 'js', 'media'):
    if os.path.isdir(os.path.join(SRC, d)): shutil.copytree(os.path.join(SRC, d), os.path.join(OUT, d))
print(f'Built {len(urls)} pages for {DOMAIN} into {OUT}')
