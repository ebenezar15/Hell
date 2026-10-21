"""Inject books.json into the template, producing the artifact page and a standalone HTML file."""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
data = json.load(open(os.path.join(D, 'books.json')))
js = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
page = open(os.path.join(D, 'template.html')).read().replace('__DATA__', js)
open(os.path.join(D, 'artifact.html'), 'w').write(page)
head, rest = page.split('<style>', 1)
standalone = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
              '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
              + head + '<style>\n:root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }\n'
              'body { margin: 0; }\n[hidden] { display: none !important; }\nimg { max-width: 100%; }\n'
              + rest.replace('</style>', '</style>\n</head>\n<body>', 1) + '\n</body>\n</html>\n')
open(os.path.join(D, 'index.html'), 'w').write(standalone)
print('artifact.html', os.path.getsize(os.path.join(D, 'artifact.html')), 'index.html', os.path.getsize(os.path.join(D, 'index.html')))
