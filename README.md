# The Hell Library

An interactive reader for two books by Eitan Bar:

- *Hell: A Jewish Perspective on a Christian Doctrine* (2024)
- *Hellfire Deconstructed* (2nd edition, 2026)

## Open it

`index.html` is a single self-contained file holding the full text of both books. It works on phones, tablets and computers in any modern browser.

- **Download:** <https://github.com/ebenezar15/Hell/raw/main/index.html> then open the file in a browser.
- **Host it:** turn on GitHub Pages (Settings → Pages → deploy from `main`, root) and share the resulting link.

## Features

- Full text of both books, chapter by chapter, with original PDF page numbers
- Endnotes open in place when you tap the small numbers
- Search across both books, with exact-phrase search
- Theme map showing where Sheol, Hades, Gehenna, Tartarus and other ideas appear
- Scripture index of every Bible reference the books cite
- Highlights, bookmarks and reading progress (saved in your browser)
- Read-aloud using the device's voice
- Nine colour schemes, adjustable text size and line spacing
- Typeset in Avenir Next (Nunito Sans is used on devices without Avenir Next)

## How it was made

The PDFs are scanned images, so the text was produced with OCR (Tesseract). The scripts in `tools/` rebuild `index.html`:

1. Render pages: `pdftoppm -r 150 -gray <pdf> img/<book>/p`
2. OCR with word boxes: `tesseract <page> hocr/<book>/<page> hocr`
3. `python3 tools/hocr2txt.py` → page text with endnote superscripts marked
4. `TXT=txt2 python3 tools/extract.py` → `books.json` (chapters, headings, quotes, endnotes)
5. `python3 tools/build.py` → `index.html`

OCR can misread a word or an endnote number here and there; the original PDFs remain the authoritative text.
