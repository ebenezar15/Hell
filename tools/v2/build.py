"""Assemble Beyond the Fire: topic JSON + full book text + inline icons -> one self-contained HTML file."""
import json, os, re, sys
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(D))
from topics import STAGES

LUCIDE = os.environ.get('LUCIDE', os.path.join(D, 'icons', 'svg'))
ALIAS = {'fire': 'flame-kindling', 'flame': 'flame', 'scroll': 'scroll', 'book': 'book-open', 'cross': 'cross', 'scale': 'scale',
         'heart': 'heart', 'skull': 'skull', 'bones': 'bone', 'infinity': 'infinity', 'clock': 'clock', 'chain': 'link', 'key': 'key',
         'door': 'door-open', 'gate': 'fence', 'valley': 'mountain', 'worm': 'worm', 'eye': 'eye', 'crown': 'crown', 'people': 'users',
         'person': 'user', 'question': 'circle-help', 'bulb': 'lightbulb', 'water': 'droplet', 'tree': 'tree-pine', 'seed': 'sprout',
         'shield': 'shield', 'hourglass': 'hourglass', 'sun': 'sun', 'moon': 'moon', 'cloud': 'cloud', 'mountain': 'mountain',
         'temple': 'landmark', 'globe': 'globe', 'sword': 'sword', 'hand': 'hand', 'dove': 'bird', 'star': 'star', 'lock': 'lock',
         'unlock': 'lock-open', 'path': 'route', 'compass': 'compass', 'mask': 'drama', 'mirror': 'scan-face', 'child': 'baby',
         'father': 'user-round', 'bread': 'sandwich', 'wheat': 'wheat', 'coin': 'coins', 'ladder': 'milestone', 'wave': 'waves',
         'speech': 'message-circle', 'ear': 'ear', 'alert': 'triangle-alert', 'check': 'circle-check', 'cross-x': 'circle-x',
         'arrow': 'arrow-right', 'puzzle': 'puzzle', 'lamp': 'lamp', 'sheep': None}
SHEEP = '<path d="M7 9a3 3 0 0 1 5-2 3 3 0 0 1 5 1 3 3 0 0 1 1 5 3 3 0 0 1-3 3H8a3 3 0 0 1-2-5 3 3 0 0 1 1-2z"/><path d="M9 16v4M15 16v4"/><circle cx="5" cy="11" r="2"/>'
syms = []
for k, f in ALIAS.items():
    if f is None:
        inner = SHEEP
    else:
        svg = open(os.path.join(LUCIDE, f + '.svg')).read()
        inner = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S).group(1).strip()
        inner = re.sub(r'\s*\n\s*', '', inner)
    syms.append(f'<symbol id="ic-{k}" viewBox="0 0 24 24">{inner}</symbol>')
icons = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(syms) + '</svg>'

books_raw = {b['id']: b for b in json.load(open(os.path.join(os.path.dirname(D), 'books.json')))}
SHORT = {'jew': 'Book A · Hell: A Jewish Perspective', 'hfd': 'Book B · Hellfire Deconstructed'}
books = {}
for bid, b in books_raw.items():
    chs = []
    for c in b['chapters']:
        blocks = [] if c['title'].startswith('Also by') else c['blocks']
        out = []
        for x in blocks:
            s = re.sub(r'(Dr\.\s*)?Eitan Bar', lambda m: 'The author' if x['t'] == 'attr' else 'the author', x['s'])
            out.append(dict(t=x['t'], s=s, pg=x['pg']))
        chs.append(dict(title='Other books' if c['title'].startswith('Also by') else c['title'], num=c['num'], pages=c['pages'], blocks=out,
                        words=sum(len(re.sub(r'\x00\d+\x01', '', x['s']).split()) for x in out)))
    notes = {k: v.replace('Eitan Bar', 'the author') for k, v in b['notes'].items()}
    books[bid] = dict(title=b['title'], subtitle=b['subtitle'], short=SHORT[bid], pdf=b['pdf'], pages=b['pages'], chapters=chs, notes=notes)

PERSP = {}
for f in sorted(os.listdir(os.path.join(D, 'perspectives'))) if os.path.isdir(os.path.join(D, 'perspectives')) else []:
    for k, v in json.load(open(os.path.join(D, 'perspectives', f))).items():
        PERSP.setdefault(k, []).extend(v)
STAGE_ICON = {'parables': 'seed', 'objections': 'shield', 'start': 'compass', 'words': 'speech', 'history': 'hourglass', 'theology': 'puzzle', 'verses': 'scroll', 'character': 'scale', 'alternative': 'dove'}
stages = []
for st in STAGES:
    sid, title, desc, tops = st[:4]
    extras = st[4] if len(st) > 4 else []
    ts = []
    for tid, ttitle, srcs in tops:
        path = os.path.join(D, 'topics', tid + '.json')
        if not os.path.exists(path):
            print('  missing topic', tid); continue
        t = json.load(open(path))
        t['title'] = ttitle
        t['srcs'] = [list(s) for s in srcs]
        t['icon'] = t['points'][0]['icon'] if t['points'] else 'book'
        t['perspectives'] = PERSP.get(tid, [])
        ts.append(t)
    if not ts:
        continue
    stages.append(dict(id=sid, title=title, desc=desc, icon=STAGE_ICON[sid], topics=ts, extras=extras))

TA_DIR = os.path.join(D, 'ta')
ta = {'ui': json.load(open(os.path.join(D, 'ui_ta.json'))), 'bible': json.load(open(os.path.join(D, 'glossary_ta.json')))['bible_books'],
      'topics': {}, 'persp': {}, 'titles': {}, 'stages': {}, 'books': {}, 'illus': {}}
if os.path.isdir(TA_DIR):
    ids = {t['id'] for s in stages for t in s['topics']}
    for f in sorted(os.listdir(os.path.join(TA_DIR, 'topics'))):
        tid = f[:-5]
        if tid in ids:
            ta['topics'][tid] = json.load(open(os.path.join(TA_DIR, 'topics', f)))
    for f in sorted(os.listdir(TA_DIR)):
        if f.startswith('persp_') and f.endswith('.json'):
            for k, v in json.load(open(os.path.join(TA_DIR, f))).items():
                ta['persp'].setdefault(k, []).extend(v)
    st = os.path.join(TA_DIR, 'stages_ta.json')
    if os.path.exists(st):
        st = json.load(open(st)); ta['titles'] = st.get('topics', {}); ta['stages'] = st.get('stages', {}); ta['books'] = st.get('books', {})
    il = os.path.join(TA_DIR, 'illustrations_ta.json')
    if os.path.exists(il):
        ta['illus'] = json.load(open(il))
    missing = sorted(ids - set(ta['topics']))
    print('  tamil topics', len(ta['topics']), 'missing', missing)
data = dict(stages=stages, books=books, iconAlias={k: 1 for k in ALIAS}, ta=ta)
js = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
assert 'Eitan' not in js, 'author name leaked'
illus = open(os.path.join(D, 'illustrations.js')).read()
page = open(os.path.join(D, 'template.html')).read().replace('__ICONS__', icons).replace('__ILLUS__', illus.replace('</script', '<\\/script')).replace('__DATA__', js)
out = os.environ.get('OUT', D)
open(os.path.join(out, 'artifact.html'), 'w').write(page)
head, rest = page.split('<style>', 1)
standalone = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
              '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
              + head + '<style>\n:root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }\n'
              'body { margin: 0; }\n[hidden] { display: none !important; }\nimg { max-width: 100%; }\n'
              + rest.replace('</style>', '</style>\n</head>\n<body>', 1) + '\n</body>\n</html>\n')
open(os.path.join(out, 'index.html'), 'w').write(standalone)
print('built', sum(len(s['topics']) for s in stages), 'topics;', len(page) // 1024, 'KB')
