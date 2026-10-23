# "Another perspective" panels (Redeeming God series)

Source articles are local text files in ARTICLES_DIR (one per article; line 2 is "URL: ..."). They are by
Jeremy Myers (Redeeming God). Read each assigned article IN FULL before writing.

Write a JSON object mapping existing app topic ids to a list of perspective panels:
{
  "<topic id>": [
    {
      "who": "Jeremy Myers (Redeeming God)",
      "title": "the article's title, as on its first line",
      "url": "the article's URL exactly as on its line 2",
      "summary": "max 90 words: the article's core reading of the passage, attributed (\"Myers argues…\")",
      "points": ["3-7 distinct arguments, examples, word studies or historical details from the article, max 32 words each"],
      "differs": "optional, max 40 words: where this reading differs from the topic's existing explanation (if it does)",
      "quote": {"text": "optional: a striking line copied EXACTLY from the article, max 40 words"}
    }
  ]
}
Rules
- Faithful to the article; add nothing it does not say. Skip his book/course advertisements.
- Never mention the name Eitan Bar (author of the app's other books).
- Plain sentences, no markdown/HTML. Verse references in full book names.
- Read the existing topic file (TOPICS_DIR/<id>.json) so the panel adds to it instead of repeating it, and so
  `differs` is accurate.
Validate with: python3 VALIDATE <your output json> ARTICLES_DIR   — fix until it prints OK.
