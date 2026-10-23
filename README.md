# Beyond the Fire

A visual, interactive guide to what the Bible says about hell. It is built from two books in this repository:

- *Hell: A Jewish Perspective on a Christian Doctrine* (2024)
- *Hellfire Deconstructed* (2nd edition, 2026)

## Open it

`index.html` is one self-contained file that runs in any modern browser on phones, tablets and computers.

- **Download:** <https://github.com/ebenezar15/Hell/raw/main/index.html>, then open the file.
- **Host it:** turn on GitHub Pages (Settings → Pages → deploy from `main`, root folder) and share the link.

## What's inside

- A 9-stage journey of 72 topics: The Words, How We Got Here, The Theology Behind Hellfire, The Verses One by One, The Parables Decoded, God's Character on Trial, An Alternative View, and Objections Answered.
- The Parables Decoded: 12 parables often cited for hell (wheat and weeds, dragnet, wedding feast, ten virgins, talents and minas, faithful and wicked servant, unforgiving servant, wicked tenants, barren fig tree, vine, rich fool, Luke 15), each with a "decode the parable" table of what each image meant to its first hearers. The wheat and weeds includes the reading of Matthew 13:40-42 from Redeeming God (Jeremy Myers).
- Objections Answered: 8 topics and about 60 objections (scriptural, cultural, historical, philosophical and pastoral), each stated in its strongest form and then answered, with sources from both sides.
- Each topic gives:
  - a 30-second answer and key-idea cards
  - diagrams: flowcharts, timelines, comparisons, trees, cycles, balance scales, spectrums and annotated verses
  - a step-by-step walk through every part of the chapter
  - myth-or-fact flip cards, key terms, quotes and key verses
  - a 3-question quiz and a reflection prompt
- Interactive illustrations: the four words translated "hell", maps of Jerusalem's Valley of Hinnom, the early theological schools and the Dead Sea, the refiner's fire, Sheol, the sheep and goats, Lazarus, and the narrow gate.
- The full original text of every chapter is included in each topic, with page numbers and endnotes, so nothing is lost.
- Other tools:
  - **Challenge:** quiz rounds
  - **Glossary**
  - **Verse explorer:** every Bible reference, linked to the topics that discuss it
  - **Search:** across the topics and the full text
- Points and badges, read-aloud, nine colour schemes and adjustable text, set in Avenir Next.

## How it was made

`tools/` holds the pipeline. The scanned PDFs were OCR'd with Tesseract (`hocr2txt.py`, then `extract.py` → `books.json`). Each topic in `tools/v2/topics/` condenses its source chapters following `tools/v2/SPEC.md` and is checked by `validate.py`. `tools/v2/build.py` assembles `index.html`. Icons are from Lucide (ISC licence).

The Parables and Objections topics were researched online (`tools/v2/SPEC-research.md`, `validate_research.py`) and list their sources in the app. Summaries condense the books; the original PDFs remain the authoritative text.
