import json, sys, os, re
p, adir = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
arts = {}
for f in os.listdir(adir):
    if f.endswith('.txt'):
        t = open(os.path.join(adir, f)).read(); u = t.split('\n')[1].replace('URL: ', '').strip(); arts[u] = t
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
known = {f[:-5] for f in os.listdir(os.path.join(here, 'topics')) if f.endswith('.json')}
errs = []
def W(s, n, w):
    if not isinstance(s, str) or not s.strip(): errs.append(f'{w}: missing'); return
    if len(s.split()) > n * 1.2: errs.append(f'{w}: {len(s.split())} words (limit {n})')
d = json.load(open(p))
for tid, lst in d.items():
    if tid not in known and tid not in ('readparables', 'isaiah33', 'james36'): errs.append(f'unknown topic id {tid}')
    for i, x in enumerate(lst):
        w = f'{tid}[{i}]'
        if x.get('url') not in arts: errs.append(f'{w}: url not one of the local articles: {x.get("url")}'); continue
        if not arts[x['url']].startswith(x.get('title', '#')): errs.append(f'{w}: title must match the article first line')
        W(x.get('summary'), 90, w + '.summary')
        pts = x.get('points', [])
        if not 3 <= len(pts) <= 7: errs.append(f'{w}: points must be 3-7')
        for k, pt in enumerate(pts): W(pt, 32, f'{w}.points[{k}]')
        if x.get('differs'): W(x['differs'], 40, w + '.differs')
        q = (x.get('quote') or {}).get('text')
        if q:
            W(q, 40, w + '.quote')
            for part in re.split(r'…|\.\.\.', q):
                if len(norm(part)) > 10 and norm(part) not in norm(arts[x['url']]): errs.append(f'{w}: quote not verbatim in article: {part[:50]}')
if 'Eitan' in json.dumps(d): errs.append('author name appears')
print('\n'.join(errs) if errs else 'OK')
