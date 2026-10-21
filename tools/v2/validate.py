import json, sys, re
ICONS = set("fire flame scroll book cross scale sheep heart skull bones infinity clock chain key door gate valley worm eye crown people person question bulb water tree seed shield hourglass sun moon cloud mountain temple globe sword hand dove star lock unlock path compass mask mirror child father bread wheat coin ladder wave speech ear alert check cross-x arrow puzzle lamp".split())
VT = {'flow','compare','timeline','tree','cycle','scale','spectrum','stats','decision','words','verse'}
errs = []
def W(s, n, where):
    if not isinstance(s, str) or not s.strip(): errs.append(f'{where}: missing text'); return
    if len(s.split()) > n * 1.25: errs.append(f'{where}: {len(s.split())} words (limit {n})')
    if 'Eitan' in s: errs.append(f'{where}: mentions the author name')
p = sys.argv[1]
try: d = json.load(open(p))
except Exception as e: print('INVALID JSON', e); sys.exit(1)
for k in ['id','title','hook','tldr','big_idea','points','sections','visuals','mythfact','terms','quotes','verses','quiz','reflect']:
    if k not in d: errs.append('missing key ' + k)
W(d.get('hook'),16,'hook'); W(d.get('tldr'),60,'tldr'); W(d.get('big_idea'),14,'big_idea'); W(d.get('reflect'),22,'reflect')
if not 4 <= len(d.get('points',[])) <= 7: errs.append('points must be 4-7')
for i,x in enumerate(d.get('points',[])):
    W(x.get('title'),7,f'points[{i}].title'); W(x.get('text'),40,f'points[{i}].text')
    if x.get('icon') not in ICONS: errs.append(f'points[{i}].icon invalid: {x.get("icon")}')
if len(d.get('sections',[])) < 2: errs.append('sections too few')
for i,x in enumerate(d.get('sections',[])):
    W(x.get('h'),12,f'sections[{i}].h'); W(x.get('summary'),70,f'sections[{i}].summary')
    if x.get('icon') not in ICONS: errs.append(f'sections[{i}].icon invalid: {x.get("icon")}')
    if not re.match(r'^(jew|hfd):\d+$', str(x.get('src',''))): errs.append(f'sections[{i}].src must be like jew:20')
if not 2 <= len(d.get('visuals',[])) <= 3: errs.append('visuals must be 2-3')
for i,v in enumerate(d.get('visuals',[])):
    t = v.get('type')
    if t not in VT: errs.append(f'visuals[{i}] bad type {t}'); continue
    if not v.get('title'): errs.append(f'visuals[{i}] needs title')
    need = {'flow':['steps'],'compare':['left','right'],'timeline':['events'],'tree':['root','children'],'cycle':['steps'],
            'scale':['left','right','tilt'],'spectrum':['left','right','marks'],'stats':['items'],'decision':['question','yes','no'],
            'words':['items'],'verse':['ref','text','notes']}[t]
    for k in need:
        if k not in v: errs.append(f'visuals[{i}] ({t}) missing {k}')
    if t == 'verse':
        for n in v.get('notes',[]):
            if n.get('phrase','') not in v.get('text',''): errs.append(f'visuals[{i}] verse note phrase not found in text: {n.get("phrase")}')
    if t == 'spectrum':
        for m in v.get('marks',[]):
            if not isinstance(m.get('pos'),(int,float)) or not 0 <= m['pos'] <= 100: errs.append(f'visuals[{i}] spectrum pos must be 0-100')
    if t == 'scale' and v.get('tilt') not in ('left','right','even'): errs.append(f'visuals[{i}] tilt must be left/right/even')
for i,x in enumerate(d.get('mythfact',[])): W(x.get('myth'),18,f'mythfact[{i}].myth'); W(x.get('fact'),35,f'mythfact[{i}].fact')
for i,x in enumerate(d.get('quiz',[])):
    if not isinstance(x.get('answer'),int) or not 0 <= x['answer'] < len(x.get('options',[])): errs.append(f'quiz[{i}] answer index invalid')
    W(x.get('why'),30,f'quiz[{i}].why')
if len(d.get('quiz',[])) != 3: errs.append('quiz must have 3 questions')
for i,x in enumerate(d.get('quotes',[])):
    W(x.get('text'),45,f'quotes[{i}].text')
import os
src = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src', os.path.basename(p).replace('.json', '.txt'))
if os.path.exists(src):
    norm = lambda t: re.sub(r'[^a-z0-9]', '', t.lower())
    S = norm(open(src).read())
    for i, x in enumerate(d.get('quotes', [])):
        for part in re.split(r'…|\.\.\.', x.get('text', '')):
            if len(norm(part)) > 12 and norm(part) not in S: errs.append(f'quotes[{i}] not found verbatim in source: {part[:60]}')
txt = json.dumps(d)
if 'Eitan' in txt: errs.append('author name appears somewhere')
print('\n'.join(errs) if errs else 'OK')
