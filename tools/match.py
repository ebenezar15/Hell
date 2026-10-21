import sys, os, re, difflib
sys.path.insert(0, os.path.dirname(__file__))
from toc import JEW, HFD
T = os.path.join(os.path.dirname(__file__), '..', os.environ.get('TXT', 'txt'))
def norm(s): return re.sub(r'[^a-z0-9]', '', s.lower().replace('|','i'))
def pages(b):
    fs = sorted(os.listdir(os.path.join(T, b)))
    return [open(os.path.join(T, b, f)).read() for f in fs]
def head(txt, n=3):
    ls = [l.strip() for l in txt.splitlines() if l.strip()]
    return ls[:n]
def match(b, toc, start):
    ps = pages(b); res = []; i = start
    for part, title in toc:
        nt = norm(title); best = None
        for j in range(i, len(ps)):
            h = head(ps[j], 3)
            for k in range(1, len(h)+1):
                cand = norm(' '.join(h[:k]))
                r = difflib.SequenceMatcher(None, nt, cand).ratio()
                if r > 0.85: best = j; break
            if best is not None: break
        res.append((part, title, best))
        if best is not None: i = best + 1
    return res, ps
if __name__ == '__main__':
    for b, toc, st in (('jew', JEW, 5), ('hfd', HFD, 5)):
        res, ps = match(b, toc, st)
        print('==', b, len(ps))
        for r in res: print(r[2]+1 if r[2] is not None else None, r[0], r[1])
