"""Rebuild page text from hOCR, wrapping raised small numerals (endnote superscripts) as \x02N\x03."""
import os, re, sys, html, statistics
from html.parser import HTMLParser
ROOT = os.path.join(os.path.dirname(__file__), '..')

class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.pars = []; s.stack = []; s.word = None
    def handle_starttag(s, tag, a):
        a = dict(a); c = a.get('class', ''); t = a.get('title', '')
        s.stack.append(c)
        if c == 'ocr_par': s.pars.append([])
        elif c in ('ocr_line', 'ocr_caption', 'ocr_textfloat', 'ocr_header'):
            bb = list(map(int, re.search(r'bbox (\d+) (\d+) (\d+) (\d+)', t).groups()))
            bl = re.search(r'baseline ([-\d.]+) ([-\d]+)', t)
            base = bb[3] + (int(bl.group(2)) if bl else 0)
            if not s.pars: s.pars.append([])
            s.pars[-1].append(dict(bb=bb, base=base, words=[]))
        elif c == 'ocrx_word':
            bb = list(map(int, re.search(r'bbox (\d+) (\d+) (\d+) (\d+)', t).groups()))
            s.word = dict(bb=bb, text='')
            s.pars[-1][-1]['words'].append(s.word)
    def handle_endtag(s, tag):
        c = s.stack.pop() if s.stack else ''
        if c == 'ocrx_word': s.word = None
    def handle_data(s, d):
        if s.word is not None: s.word['text'] += d

def convert(path):
    p = P(); p.feed(open(path, encoding='utf-8').read())
    out = []
    for par in p.pars:
        lines = []
        for ln in par:
            ws = ln['words']
            if not ws: continue
            hs = [w['bb'][3] - w['bb'][1] for w in ws if re.search(r'[a-z]', w['text'])]
            med = statistics.median(hs) if hs else None
            toks = []
            for w in ws:
                t = w['text']; h = w['bb'][3] - w['bb'][1]
                m = re.fullmatch(r'(\d{1,3})([.,;:]?)', t)
                off = ln['base'] - w['bb'][3]
                prev = toks[-1] if toks else ''
                if (m and med and abs(off) >= 5 and prev and not re.fullmatch(r'[A-Z][a-z]+', prev)
                        and not re.search(r'\d$', prev)):
                    toks[-1] += '\x02' + m.group(1) + '\x03' + m.group(2)
                else:
                    toks.append(t)
            lines.append(' '.join(toks))
        if lines: out.append('\n'.join(lines))
    return '\n\n'.join(out) + '\n'

if __name__ == '__main__':
    n = 0
    for b in ('jew', 'hfd'):
        os.makedirs(os.path.join(ROOT, 'txt2', b), exist_ok=True)
        for f in sorted(os.listdir(os.path.join(ROOT, 'hocr', b))):
            t = convert(os.path.join(ROOT, 'hocr', b, f))
            n += t.count('\x02')
            open(os.path.join(ROOT, 'txt2', b, f.replace('.hocr', '.txt')), 'w').write(t)
        print(b, 'superscripts so far', n)
