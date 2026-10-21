"""Turn per-page OCR text into structured book JSON (chapters -> blocks, endnotes)."""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from match import match, norm
from toc import JEW, HFD

OUT = os.path.join(os.path.dirname(__file__), 'books.json')

BOOKS = [
    dict(id='jew', toc=JEW, notes_from=365, epigraph=6,
         title='Hell', subtitle='A Jewish Perspective on a Christian Doctrine', year='2024',
         pdf='Hell-A-Jewish-Perspective-on-a-Christian-Doctrine.pdf'),
    dict(id='hfd', toc=HFD, notes_from=235, epigraph=6,
         title='Hellfire Deconstructed', subtitle='An In-Depth Study of the Bible Verses About Hell', year='2026',
         pdf='Hellfire-Deconstructed.pdf'),
]

def fix_ocr(s):
    s = re.sub(r'(?<![\w|])\|(?![\w|])', 'I', s)          # lone pipe is the pronoun I
    s = re.sub(r'\|(?=[a-z])', 'I', s)                       # |nvite -> Invite
    s = re.sub(r'\b[lI]\s?(?=(nvite|t is|n the)\b)', 'I', s)
    s = s.replace('¢ ', '• ').replace('« ', '• ').replace('* ', '• ', 1) if s.lstrip().startswith(('¢', '«')) else s
    s = re.sub(r'\bPart (I|Il|Ill|IV|\|)\b', lambda m: 'Part ' + {'Il': 'II', 'Ill': 'III', '|': 'I'}.get(m.group(1), m.group(1)), s)
    s = s.replace('—-', '—').replace(' ,', ',')
    return s

def paragraphs(page_text):
    out = []
    for chunk in re.split(r'\n\s*\n', page_text):
        lines = [l.rstrip() for l in chunk.split('\n') if l.strip()]
        if not lines:
            continue
        # drop cap: "hroughout ..." followed by "T distinct ..."
        if len(lines) > 1 and re.match(r'^[a-z]', lines[0]) and re.match(r'^[A-Z] \S', lines[1]):
            lines[0] = lines[1][0] + lines[0]
            lines[1] = lines[1][2:]
        text = ''
        for l in lines:
            l = l.strip()
            if text.endswith('-') and re.match(r'^[a-z]', l) and not text.endswith(' -'):
                text = text[:-1] + l
            elif text:
                text += ' ' + l
            else:
                text = l
        out.append(dict(text=fix_ocr(text), nlines=len(lines)))
    return out

CITE = re.compile(r'^(\d\s)?[A-Z][a-z]+( of [A-Z][a-z]+)?\.? ?\d+(:\s?\d+)?[\-–\d,:;. ]*(,? ?(NIV|NKJV|NRSV|ESV|NASB|KJV|NLT|CEV|YLT))?$')
ATTR = set(l.strip() for l in open(os.path.join(os.path.dirname(__file__), 'attr.txt')) if l.strip())
PART_WORDS = {'Part I', 'Part II', 'Part III', 'Part IV', 'The Theology of Hellfire', 'Hell in the Bible',
              'Hell: An Alternative View', 'Historical Background: How Did We Get Here?'}

VOCAB = set()

def dropcap(s):
    m = re.match(r'^([“"]?)([A-Z]) ([a-z]{2,})(.*)$', s, re.S)
    if m and (m.group(2) not in 'AI' or (m.group(2) + m.group(3)).lower() in VOCAB):
        return m.group(1) + m.group(2) + m.group(3) + m.group(4)
    return s

def tidy(blocks):
    out = []
    for b in blocks:
        b['s'] = s = dropcap(b['s'])
        if b['t'] == 'h' and (s in PART_WORDS or len(re.sub(r'[^A-Za-z]', '', s)) <= 3 and not re.search(r'\d', s)):
            continue
        if b['t'] in ('attr', 'cite') and out and out[-1]['t'] == 'p':
            out[-1]['t'] = 'q'
        out.append(b)
    return out

TERMINAL = re.compile(r'[.!?:;"”’)\]]\s*\d{0,3}$')

def classify(p):
    t = p['text']
    if p['nlines'] == 1 and len(t) < 60 and CITE.match(t):
        return 'cite'
    if p['nlines'] == 1 and len(t) < 80 and not TERMINAL.search(t) and re.match(r'^[A-Z"“‘\'(0-9]', t):
        words = t.split()
        caps = sum(1 for w in words if w[:1].isupper() or not w[:1].isalpha())
        if CITE.match(t):
            return 'cite'
        if t in ATTR:
            return 'attr'
        if caps / max(len(words), 1) >= 0.6 or len(words) <= 4:
            return 'h'
    if re.match(r'^[•\-–]\s', t):
        return 'li'
    return 'p'

def parse_notes(pages):
    """Endnotes are numbered 1..N in order; OCR sometimes clips or misreads the numbers,
    so a new entry is accepted when its number plausibly matches the next expected one."""
    text = fix_ocr('\n\n'.join(pages))
    notes = {}
    expect = 1
    cur = None
    for raw in re.split(r'\n\s*\n|\n(?=\d{1,3}[.,]\s)', text):
        raw = ' '.join(l.strip() for l in raw.split('\n') if l.strip())
        if not raw:
            continue
        m = re.match(r'^(\d{1,3})[.,]\s*(.*)$', raw)
        n = int(m.group(1)) if m else None
        if m and (expect <= n <= expect + 8 or (n < expect and str(expect).endswith(str(n)))):
            cur = n if n >= expect else expect
            notes[cur] = m.group(2)
            expect = cur + 1
        elif cur is not None and len(raw) > 3:
            notes[cur] += ' ' + raw
    return notes

NOTE_REF = re.compile(r'(?<=[.!?"”’)])\s?(\d{1,3})(?=\s|$)')
CONFUSE = {'9': '0', '0': '9', '2': '0', '7': '1', '1': '7', '8': '3', '3': '8'}

def near(n, expect):
    """Return the endnote number an OCR'd superscript most plausibly stands for, or None."""
    if n == expect:
        return n
    s = str(n)
    for cand in range(expect, expect + 3):
        c = str(cand)
        if len(c) == len(s) and sum(x != y for x, y in zip(s, c)) == 1:
            i = next(k for k in range(len(s)) if s[k] != c[k])
            if CONFUSE.get(s[i]) == c[i] or CONFUSE.get(c[i]) == s[i]:
                return cand
    if expect < n <= expect + 6:
        return n
    if len(s) == len(str(expect)):
        return expect
    return None

def lis(vals):
    """Indices of a longest strictly increasing subsequence."""
    import bisect
    tails, tidx, prev = [], [], [None] * len(vals)
    for i, v in enumerate(vals):
        k = bisect.bisect_left(tails, v)
        if k == len(tails): tails.append(v); tidx.append(i)
        else: tails[k] = v; tidx[k] = i
        prev[i] = tidx[k - 1] if k else None
    out, i = [], tidx[-1] if tidx else None
    while i is not None: out.append(i); i = prev[i]
    return out[::-1]

def confusable(raw, cand):
    s, c = str(raw), str(cand)
    if len(s) != len(c): return False
    diff = [k for k in range(len(s)) if s[k] != c[k]]
    return len(diff) == 1 and (CONFUSE.get(s[diff[0]]) == c[diff[0]] or CONFUSE.get(c[diff[0]]) == s[diff[0]])

def link_notes(blocks, notes):
    """Superscripts arrive in reading order. Anchor on the longest increasing run of OCR'd values,
    then fill the gaps between anchors where the count of markers agrees with the numbering."""
    top = max(notes) + 2
    vals = []
    for b in blocks:
        vals += [int(x) for x in re.findall(r'\u0002(\d+)\u0003', b['s'])]
    ok = [i for i, v in enumerate(vals) if 1 <= v <= top]
    anchors = [ok[k] for k in lis([vals[i] for i in ok])]
    assign = {i: vals[i] for i in anchors}
    bounds = [(-1, 0)] + [(i, vals[i]) for i in anchors] + [(len(vals), top + 1)]
    for (i, vi), (j, vj) in zip(bounds, bounds[1:]):
        mids = list(range(i + 1, j))
        if not mids: continue
        if j - i == vj - vi:
            for k in mids: assign[k] = vi + (k - i)
        else:
            lo = vi
            for k in mids:
                c = next((c for c in range(lo + 1, vj) if confusable(vals[k], c)), None)
                if c: assign[k] = c; lo = c
    it = iter(range(len(vals)))
    def sub(m):
        k = next(it)
        return '\u0000%d\u0001' % assign[k] if k in assign else ''
    for b in blocks:
        b['s'] = re.sub(r'\u0002(\d+)\u0003', sub, b['s'])
    got = sorted(set(assign.values()))
    print('  linked', len(assign), 'of', len(vals), 'markers; numbers never linked:', [n for n in range(1, max(notes) + 1) if n not in got])
    return max(got) if got else 0

def build(book):
    res, pages = match(book['id'], book['toc'], 5)
    VOCAB.update(w.lower() for pg in pages for w in re.findall(r'[A-Za-z]{3,}', pg))
    starts = [(r[0], r[1], r[2]) for r in res if r[1] != 'Endnotes']
    starts = [(p, t, (book['epigraph'] - 1) if t == 'Epigraph' else s) for p, t, s in starts]
    body_end = book['notes_from'] - 1  # 0-based exclusive
    chapters = []
    num = 0
    numbered = set()
    for part, title, s in starts:
        is_num = title not in ('Epigraph', 'Introduction', 'Preface', 'Conclusion', 'A Final Word',
                               'Also by Eitan Bar', 'The Doctrines Behind the ECT Theology') or \
                 (book['id'] == 'hfd' and title in ('Conclusion',))
        if book['id'] == 'jew' and title == 'Conclusion':
            is_num = True
        if book['id'] == 'hfd' and title == 'Understanding Biblical Genres':
            is_num = False
        if is_num:
            num += 1
        chapters.append(dict(part=part, title=title, num=num if is_num else None, start=s))
    for i, c in enumerate(chapters):
        end = chapters[i + 1]['start'] if i + 1 < len(chapters) else body_end
        blocks = []
        for pg in range(c['start'], end):
            paras = paragraphs(pages[pg])
            for k, p in enumerate(paras):
                t = classify(p)
                s = p['text']
                # drop the chapter title (and Part heading) printed on the opening page
                if pg == c['start'] and k < 3 and (norm(s) in norm(c['title']) or norm(c['title']) in norm(s)
                                                   or re.match(r'^Part [IV]+$', s)
                                                   or (c['part'] and norm(s) in norm(c['part']))):
                    continue
                if (blocks and k == 0 and t == 'p' and blocks[-1]['t'] in ('p', 'li')
                        and not re.search(r'[.!?"”:]\s*(\d{1,3})?$', blocks[-1]['s'])
                        and re.match(r'^[A-Za-z(,;"“‘]', s)):
                    prev = blocks[-1]
                    if prev['s'].endswith('-'):
                        prev['s'] = prev['s'][:-1] + s
                    else:
                        prev['s'] += ' ' + s
                    prev.setdefault('pb', []).append([len(prev['s']) - len(s), pg + 1])
                    continue
                if t == 'p' and blocks and blocks[-1]['t'] in ('p', 'li') and re.match(r'^[a-z]', s):
                    blocks[-1]['s'] += ' ' + s
                    continue
                blocks.append(dict(t=t, s=s, pg=pg + 1))
        c['blocks'] = tidy(blocks)
        c['pages'] = [c['start'] + 1, end]
        del c['start']
    notes = parse_notes(pages[book['notes_from'] - 1:])
    all_blocks = [b for c in chapters for b in c['blocks']]
    last = link_notes(all_blocks, notes)
    for b in all_blocks:
        b.pop('pb', None)
    chapters.append(dict(part='', title='Endnotes', num=None, pages=[book['notes_from'], len(pages)],
                         blocks=[dict(t='note', s='%d. %s' % (k, v), pg=book['notes_from']) for k, v in sorted(notes.items())]))
    words = sum(len(b['s'].split()) for b in all_blocks)
    print(book['id'], 'chapters', len(chapters), 'notes', len(notes), 'linked up to', last, 'words', words)
    return dict(id=book['id'], title=book['title'], subtitle=book['subtitle'], author='Eitan Bar',
                year=book['year'], pdf=book['pdf'], pages=len(pages), words=words,
                chapters=chapters, notes={str(k): v for k, v in notes.items()})

if __name__ == '__main__':
    data = [build(b) for b in BOOKS]
    json.dump(data, open(OUT, 'w'), ensure_ascii=False)
    print('wrote', OUT, os.path.getsize(OUT))
