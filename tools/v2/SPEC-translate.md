# Tamil translation spec

Translate app content JSON from English into Tamil for Tamil-speaking Christian readers.

Output: the SAME JSON structure, same keys, same list lengths and order. Translate only human-readable text.
Keep these EXACTLY as in the English file (do not translate): id, url, icon, kind, type, src, related, pos,
answer, tilt, every `verses` array, every `ref` field, `sources[].title`, `sources[].url`, perspective `title`,
perspective `url`, `who`.
Everything else that is prose (titles, hook, tldr, points, summaries, notes, labels, decoder rows, objections,
quiz questions/options/why, terms, quotes, captions, timeline dates like "70 AD" -> "கி.பி. 70") is translated.

Style
- Clear, natural, modern Tamil that an ordinary church member understands. Not word-for-word; keep meaning,
  nuance and every detail. Do not add, drop or soften claims. Keep the length roughly similar.
- Use Tamil numerals as Arabic digits (1, 2, 3). Use "கி.பி." / "கி.மு." for AD/BC.
- Bible quotations: if you know the Tamil Union (O.V.) wording, use it; otherwise translate faithfully.
- Greek/Hebrew words: keep transliterated in Tamil script with the Latin form in brackets the first time in a
  topic, e.g. "கொலாசிஸ் (kolasis)". Personal names in Tamil script (Augustine -> அகஸ்டின்).
- In a `verse` visual, every notes[].phrase must appear exactly inside that visual's translated `text`.
- Never mention the name Eitan Bar.

Use the shared glossary GLOSSARY (tools/v2/glossary_ta.json) for every term it lists, so all topics agree.

Workflow per file: read the English topic file, write the Tamil file to OUT_DIR/<id>.json (UTF-8, ensure_ascii
false), then run: python3 VALIDATE <english file> <tamil file>   and fix until it prints OK.
Writing tip: build the JSON with a small Python script (json.dump(..., ensure_ascii=False, indent=1)) to avoid
quoting mistakes.
