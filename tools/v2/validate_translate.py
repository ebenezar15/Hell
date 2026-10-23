import json, sys, re
en, ta = json.load(open(sys.argv[1])), json.load(open(sys.argv[2]))
KEEP = {'id', 'url', 'icon', 'kind', 'type', 'src', 'related', 'pos', 'answer', 'tilt', 'verses', 'ref', 'who'}
TAMIL = re.compile(r'[஀-௿]')
errs = []
def walk(a, b, path, parent=''):
    if isinstance(a, dict):
        if not isinstance(b, dict): errs.append(f'{path}: expected object'); return
        if set(a) != set(b): errs.append(f'{path}: keys differ: missing {set(a)-set(b)} extra {set(b)-set(a)}')
        for k in a:
            if k not in b: continue
            keep = k in KEEP or (parent in ('sources',) and k == 'title') or (parent == 'perspective' and k == 'title')
            if keep:
                if a[k] != b[k]: errs.append(f'{path}.{k}: must be unchanged')
            else:
                walk(a[k], b[k], f'{path}.{k}', k)
    elif isinstance(a, list):
        if not isinstance(b, list) or len(a) != len(b): errs.append(f'{path}: list length differs'); return
        for i, (x, y) in enumerate(zip(a, b)): walk(x, y, f'{path}[{i}]', parent)
    elif isinstance(a, str):
        if not isinstance(b, str): errs.append(f'{path}: expected string'); return
        if len(a.split()) >= 3 and not TAMIL.search(b): errs.append(f'{path}: not translated: {b[:50]}')
    elif a != b: errs.append(f'{path}: non-text value changed')
# perspective files are {topic: [panels]}; mark their title as kept
if isinstance(en, dict) and all(isinstance(v, list) for v in en.values()) and 'hook' not in en:
    for k in en:
        for i, (x, y) in enumerate(zip(en[k], ta.get(k, []))): walk(x, y, f'{k}[{i}]', 'perspective')
        if len(en[k]) != len(ta.get(k, [])): errs.append(f'{k}: panel count differs')
else:
    walk(en, ta, '$')
    for i, v in enumerate(en.get('visuals', [])):
        if v.get('type') == 'verse':
            tv = ta['visuals'][i]
            for n in tv.get('notes', []):
                if n.get('phrase', '') not in tv.get('text', ''): errs.append(f'visuals[{i}]: phrase not in text: {n.get("phrase","")[:40]}')
if 'Eitan' in json.dumps(ta, ensure_ascii=False): errs.append('author name appears')
print('\n'.join(errs[:40]) if errs else 'OK')
