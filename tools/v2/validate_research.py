import json, sys, re, subprocess, os
p = sys.argv[1]
here = os.path.dirname(os.path.abspath(__file__))
base = subprocess.run([sys.executable, os.path.join(here, 'validate.py'), p], capture_output=True, text=True).stdout.strip()
errs = [] if base == 'OK' else [l for l in base.splitlines() if 'not found verbatim' not in l and 'src must be like' not in l]
d = json.load(open(p))
def W(s, n, where):
    if not isinstance(s, str) or not s.strip(): errs.append(f'{where}: missing'); return
    if len(s.split()) > n * 1.25: errs.append(f'{where}: {len(s.split())} words (limit {n})')
k = d.get('kind')
if k not in ('parable', 'objection', 'passage'): errs.append('kind must be parable, objection or passage')
for i, s in enumerate(d.get('sections', [])):
    if s.get('src') != 'web': errs.append(f'sections[{i}].src must be "web"')
src = d.get('sources', [])
if not 4 <= len(src) <= 10: errs.append('sources must be 4-10')
urls = set()
for i, s in enumerate(src):
    if not re.match(r'^https?://\S+\.\S+', s.get('url', '')): errs.append(f'sources[{i}].url invalid')
    urls.add(s.get('url')); W(s.get('title'), 25, f'sources[{i}].title'); W(s.get('note'), 20, f'sources[{i}].note')
ob = d.get('objections', [])
lo, hi = (2, 4) if k in ('parable', 'passage') else (5, 9)
if not lo <= len(ob) <= hi: errs.append(f'objections must be {lo}-{hi}')
for i, o in enumerate(ob):
    W(o.get('claim'), 25, f'objections[{i}].claim'); W(o.get('strongest'), 45, f'objections[{i}].strongest'); W(o.get('response'), 100, f'objections[{i}].response')
    if o.get('kind') not in ('scriptural', 'cultural', 'historical', 'philosophical', 'pastoral'): errs.append(f'objections[{i}].kind invalid')
    for u in o.get('sources', []):
        if u not in urls: errs.append(f'objections[{i}] cites a url not in sources: {u}')
if k == 'parable':
    pb = d.get('parable') or {}
    W(pb.get('ref'), 12, 'parable.ref'); W(pb.get('audience'), 20, 'parable.audience'); W(pb.get('setting'), 45, 'parable.setting')
    dec = pb.get('decoder', [])
    if not 3 <= len(dec) <= 8: errs.append('parable.decoder must have 3-8 rows')
    for i, r in enumerate(dec): W(r.get('symbol'), 8, f'decoder[{i}].symbol'); W(r.get('traditional'), 16, f'decoder[{i}].traditional'); W(r.get('original'), 30, f'decoder[{i}].original')
known = set('philology gehenna eternal sheepgoats darkness lazarus unquenchable narrow awayfromme fearwhom destruction lakeoffire jude tartarus early late augustine infinite justice hellfirejustice wrath everyknee freewill evangelizing nofear testcharacter lovefear'.split())
for r in d.get('related', []):
    if r not in known: errs.append(f'related id unknown: {r}')
if 'Eitan' in json.dumps(d): errs.append('author name appears')
print('\n'.join(errs) if errs else 'OK')
