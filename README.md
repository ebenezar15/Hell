# Beyond the Fire

A visual, interactive guide to what the Bible says about hell. It is built from two books in this repository:

- *Hell: A Jewish Perspective on a Christian Doctrine* (2024)
- *Hellfire Deconstructed* (2nd edition, 2026)

## Open it

`index.html` is one self-contained file that runs in any modern browser on phones, tablets and computers.

- **Download:** <https://github.com/ebenezar15/Hell/raw/main/index.html>, then open the file.
- **Host it:** turn on GitHub Pages (Settings → Pages → deploy from `main`, root folder) and share the link.

## What's inside

- **English and Tamil (தமிழ்)** in one app: switch with the EN / தமிழ் toggle at the top right. All topics, diagrams, illustrations, quizzes, objections and panels are translated; the full original text of the two books stays in English. Translations live in `tools/v2/ta/` (spec: `SPEC-translate.md`, glossary: `glossary_ta.json`).

- A 9-stage journey of 79 topics: The Words, How We Got Here, The Theology Behind Hellfire, The Verses One by One, The Parables Decoded, God's Character on Trial, An Alternative View, and Objections Answered.
- The Parables Decoded: 12 parables often cited for hell (wheat and weeds, dragnet, wedding feast, ten virgins, talents and minas, faithful and wicked servant, unforgiving servant, wicked tenants, barren fig tree, vine, rich fool, Luke 15), each with a "decode the parable" table of what each image meant to its first hearers. The wheat and weeds includes the reading of Matthew 13:40-42 from Redeeming God (Jeremy Myers).
- Four topics drawn from the Foundations Series videos "What The Hell" Parts 2-5 plus web research: The Three Views of Hell, How Often Does "Hell" Appear?, Hell in Second Temple Judaism, and Where Our Picture of Hell Came From, with a video panel on Lazarus and the rich man.
- How to Read a Parable, and two more passages: Isaiah 33:10-16 ("everlasting burnings") and James 3:6 (the tongue "set on fire by Gehenna").
- "Another perspective" panels on 20 topics, summarising Jeremy Myers' Redeeming God "What is Hell?" series with links to each article (`tools/v2/perspectives/`, spec in `SPEC-perspective.md`).
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

## Design and motion

- MindConnect-inspired interface: deep ink-teal palette (gold = Scripture, teal = restoration, coral = torment, violet = words), Gloock headings, IBM Plex Mono labels, a left rail of numbered rooms (top scroller on phones) and a slide-out detail drawer.
- Motion graphics: a living neural-network hero, an animated journey path, a "How four words became one" flow animation (Sheol, Hades, Gehenna, Tartarus through the Latin Vulgate into the KJV's "hell"), and a by-the-numbers ticker.
- Living diagrams: every flowchart, timeline, tree, comparison, scale, cycle, spectrum, verse card and mind map animates in when it comes into view, with a replay button; cycles and room maps have flowing connectors.
- Room pages for each of the 9 stages with an animated map of their topics.
- Story mode: play any topic as auto-advancing full-screen slides.
- Word Detective game: guess the original word behind "hell" in 31 KJV verses.

## Visual study tools

- A radial mind map at the top of every topic.
- Map: an interactive concept map of all topics and their links, a history timeline of every dated event, and a 66-book Bible heat map.
- Study: spaced-repetition flashcards built from terms, key ideas and myths.

## How it was made

`tools/` holds the pipeline. The scanned PDFs were OCR'd with Tesseract (`hocr2txt.py`, then `extract.py` → `books.json`). Each topic in `tools/v2/topics/` condenses its source chapters following `tools/v2/SPEC.md` and is checked by `validate.py`. `tools/v2/build.py` assembles `index.html`. Icons are from Lucide (ISC licence).

The Parables and Objections topics were researched online (`tools/v2/SPEC-research.md`, `validate_research.py`) and list their sources in the app. Summaries condense the books; the original PDFs remain the authoritative text.
