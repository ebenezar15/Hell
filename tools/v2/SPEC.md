# Topic card spec

You turn one topic's source text (from one or two books on the biblical doctrine of hell) into a JSON file
that a visual, interactive explainer app renders. Readers will NOT read the book; this JSON must carry
every argument, example, verse, term and important detail of the source, in short, plain, vivid language.

Rules
- Faithful: present the books' arguments as the books make them ("The book argues…" is not needed; state the view
  directly as the explainer's content). Never invent facts, verses, quotes, dates or numbers absent from the source.
- Never mention the author's name. Say "the author" only if unavoidable.
- When two sources cover the same chapter, merge them; include details that appear in only one.
- Short: every text field is plain sentences, no markdown, no HTML. Respect the word limits.
- Coverage: `sections` must cover the whole source in order. Every `##` heading in the source gets a section
  (headings that are just a quoted person's name are attributions, not sections). Long stretches without
  headings get their own sections too. Missing an argument is the worst failure.
- Quotes must be copied exactly from the source (you may trim with "…"). Max 45 words each.
- Verse references use full book names: "Matthew 25:46", "1 Peter 3:19-20".
- `icon` values must come from this list:
  fire, flame, scroll, book, cross, scale, sheep, heart, skull, bones, infinity, clock, chain, key, door, gate,
  valley, worm, eye, crown, people, person, question, bulb, water, tree, seed, shield, hourglass, sun, moon,
  cloud, mountain, temple, globe, sword, hand, dove, star, lock, unlock, path, compass, mask, mirror, child,
  father, bread, wheat, coin, ladder, wave, speech, ear, alert, check, cross-x, arrow, puzzle, lamp

JSON shape (write exactly these keys; arrays may be shorter where noted)
{
  "id": "<topic id>",
  "title": "<topic title as given>",
  "hook": "A provocative one-line question this topic answers (max 16 words)",
  "tldr": "The answer in 2-3 plain sentences (max 60 words)",
  "big_idea": "The single takeaway, max 14 words",
  "points": [ {"icon": "...", "title": "max 7 words", "text": "max 40 words", "verses": ["Book 1:2"]} ],   // 4-7 key points
  "sections": [ {"h": "section heading", "icon": "...", "summary": "max 70 words, every claim, example and detail of that part", "verses": [...], "src": "jew:20"} ],   // complete, in source order
  "visuals": [ VISUAL, VISUAL ],          // 2-3 diagrams that genuinely explain this topic; pick the best-fitting types
  "mythfact": [ {"myth": "common belief, max 18 words", "fact": "what the source shows, max 35 words"} ],   // 2-4
  "terms": [ {"term": "...", "meaning": "max 25 words"} ],      // words/concepts defined in the source, 0-6
  "quotes": [ {"text": "exact quote", "who": "speaker or source as named in the text, or 'The book'"} ],   // 1-3 striking lines
  "verses": [ {"ref": "Matthew 25:46", "role": "max 20 words: how the topic reads this verse"} ],   // the key verses discussed, up to 10
  "quiz": [ {"q": "question", "options": ["a","b","c"], "answer": 0, "why": "max 30 words"} ],   // 3 questions, answer = index
  "reflect": "One open question for the reader to think about (max 22 words)"
}

VISUAL types (choose what explains best; each needs "type" and "title"; optional "caption" max 25 words)
- {"type":"flow","title":"...","steps":[{"label":"max 6 words","note":"max 18 words"}]}            3-7 steps, a process or chain of reasoning
- {"type":"compare","title":"...","left":{"label":"...","items":["max 14 words"]},"right":{"label":"...","items":[...]}}   two views side by side, 3-6 items each, items aligned row by row
- {"type":"timeline","title":"...","events":[{"date":"e.g. 354-430 AD","label":"max 6 words","note":"max 18 words"}]}   3-8 events, chronological
- {"type":"tree","title":"...","root":"max 5 words","children":[{"label":"max 5 words","note":"max 14 words","children":[{"label":"...","note":"..."}]}]}   a hierarchy / classification, 2-5 children
- {"type":"cycle","title":"...","steps":[{"label":"max 5 words","note":"max 14 words"}]}   3-6 steps that loop
- {"type":"scale","title":"...","left":{"label":"...","items":["max 8 words"]},"right":{"label":"...","items":[...]},"tilt":"left|right|even"}   weighing two things (justice, proportion)
- {"type":"spectrum","title":"...","left":"label","right":"label","marks":[{"pos":0-100,"label":"max 5 words","note":"max 16 words"}]}   positions on a range
- {"type":"stats","title":"...","items":[{"value":"e.g. 12","label":"max 10 words"}]}   2-4 striking numbers from the source
- {"type":"decision","title":"...","question":"max 12 words","yes":{"label":"...","note":"max 20 words"},"no":{"label":"...","note":"..."}}   a fork in logic
- {"type":"words","title":"...","items":[{"word":"Sheol","lang":"Hebrew","literal":"max 6 words","meaning":"max 22 words"}]}   original-language word studies
- {"type":"verse","title":"...","ref":"Matthew 25:46","text":"exact verse text as quoted in the source","notes":[{"phrase":"exact phrase from the verse text","note":"max 22 words"}]}   annotated close reading of a key verse

Write the file with the Write tool to OUT_DIR/<id>.json, then run:
  python3 VALIDATE <path>
and fix every problem it reports until it prints OK.
