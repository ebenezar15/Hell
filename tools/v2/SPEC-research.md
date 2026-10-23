# Research topic spec (parables & objections)

These topics are NOT drawn from the two books. You research them on the web with the WebSearch tool
(the only web tool that works here; WebFetch and curl are blocked). Use mode "extended" for most searches.
Run many searches (10+ per topic): the parable's Jewish/cultural background, Greek terms, Old Testament echoes,
first-century history, scholarly and popular commentary on BOTH sides, and the specific objections.

The app presents the view that the parables usually cited for eternal conscious torment (ECT) do not teach it,
and explains their original meaning. Present that view clearly and persuasively, but honestly:
- Never invent facts, quotes, statistics, dates, Greek meanings or citations. If unsure, leave it out.
- Attribute interpretations ("Jeremy Myers (Redeeming God) reads the weeds as…", "N.T. Wright argues…").
  Where readers who reject ECT disagree among themselves (purifying fire / restoration, annihilation /
  conditional immortality, AD 70 judgment readings), say so and show the options.
- State each objection in its strongest form (steelman) before answering it. No straw men of the other side.
- Quotes: ONLY Bible verses (label the translation, e.g. "Matthew 13:42 (NIV)") or wording you saw verbatim in a
  search result. Keep each under 45 words. When unsure of exact wording, paraphrase in a point instead.
- Every `sources` URL must be one you actually saw in your WebSearch results. 4-10 sources per topic, mixing
  viewpoints where possible (include at least one traditional/ECT-leaning source the objections come from).
- Never mention the name of the author of the two books in this repo (Eitan Bar).

JSON shape: everything in SPEC.md (same keys and limits; `sections[].src` must be "web"), PLUS:
  "kind": "parable" | "objection",
  "related": ["existing topic ids from this list that connect: philology gehenna eternal sheepgoats darkness lazarus
              unquenchable narrow awayfromme fearwhom destruction lakeoffire jude tartarus early late augustine
              infinite justice hellfirejustice wrath everyknee freewill evangelizing nofear testcharacter lovefear"],
  "sources": [ {"title": "...", "url": "https://...", "note": "max 20 words: what this source contributes / its stance"} ],
  "objections": [ {"claim": "objection as its holders put it, max 25 words",
                   "kind": "scriptural" | "cultural" | "historical" | "philosophical" | "pastoral",
                   "strongest": "the best version of the objection, max 45 words",
                   "response": "the answer, max 100 words, with reasoning and evidence",
                   "verses": ["..."], "sources": ["urls from your sources list"]} ],
     // parable topics: 2-4 objections specific to that parable; objection topics: 5-9
  For kind "parable" also:
  "parable": {"ref": "Matthew 13:24-30, 36-43", "audience": "who Jesus was speaking to, max 20 words",
              "setting": "historical/literary setting, max 45 words",
              "decoder": [ {"symbol": "the weeds", "traditional": "how ECT readers take it, max 16 words",
                            "original": "the original-context meaning, max 30 words"} ]   // 3-8 rows
             }
Visuals: 2-3 from SPEC.md types. `verse` visual text must be a real translation's wording (label the
translation in "ref", e.g. "Matthew 13:42 (NIV)").

Write OUT_DIR/<id>.json and run: python3 VALIDATE OUT_DIR/<id>.json  — fix until OK.
