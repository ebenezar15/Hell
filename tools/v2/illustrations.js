// Hand-drawn SVG illustrations keyed by topic id. Colours come from theme classes (.i-*) defined in the page CSS.
// Each entry: { title, caption, svg, hotspots?: [{ id, label, text }] } — elements with data-hot="<id>" become tappable.
window.ILLUSTRATIONS = {
  philology: {
    title: 'Where each word "lives"',
    caption: 'Three words describe the unseen realm below. Gehenna is different: a real valley you can walk through in Jerusalem today. Tap a layer.',
    hotspots: [
      { id: 'gehenna', label: 'Gehenna', text: 'Greek form of the Hebrew Gey Hinnom, the Valley of Hinnom beside Jerusalem. A real place of shame and burning, used by Jesus as a metaphor.' },
      { id: 'sheol', label: 'Sheol', text: 'Hebrew word for the realm of the dead, often translated "the grave" or "the pit" (Genesis 37:35; Psalm 16:10). Not associated with punishment or reward.' },
      { id: 'hades', label: 'Hades', text: 'Greek equivalent of Sheol. The Septuagint uses Hades to translate Sheol. A temporary holding place for the dead, not a place of torment or bliss.' },
      { id: 'tartarus', label: 'Tartarus', text: 'Used in 2 Peter 2:4: the angels that sinned were cast into tartarus, "into chains of darkness, to be reserved unto judgment".' },
    ],
    svg: `<svg viewBox="0 0 640 400" role="img" aria-label="Cross-section of the ancient picture: Jerusalem on the surface with the Valley of Hinnom beside it, Sheol and Hades below, Tartarus deepest">
      <defs><linearGradient id="ugrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="i-stop-a"/><stop offset="1" class="i-stop-b"/></linearGradient></defs>
      <rect x="0" y="0" width="640" height="120" class="i-sky"/>
      <circle cx="560" cy="44" r="18" class="i-sun"/>
      <path d="M0 120 L640 120 L640 400 L0 400 Z" fill="url(#ugrad)"/>
      <g data-hot="gehenna" class="hot"><path d="M300 120 C330 120 340 158 380 158 C420 158 430 120 460 120 Z" class="i-valley"/>
        <path d="M352 150 q6 -14 12 0 q6 -18 12 0 q6 -12 12 0" class="i-flame-s"/>
        <text x="380" y="190" class="i-lbl" text-anchor="middle">Gehenna</text><text x="380" y="206" class="i-sub" text-anchor="middle">Valley of Hinnom (on earth)</text></g>
      <g class="i-city"><rect x="120" y="78" width="150" height="42" rx="2"/><rect x="132" y="60" width="18" height="20"/><rect x="236" y="60" width="18" height="20"/><path d="M172 78 l23 -24 l23 24 z"/></g>
      <text x="195" y="108" class="i-lbl i-on-city" text-anchor="middle">Jerusalem</text>
      <g data-hot="sheol" class="hot"><rect x="40" y="226" width="560" height="64" rx="32" class="i-layer1"/>
        <text x="72" y="264" class="i-lbl">Sheol</text><text x="138" y="264" class="i-sub">Hebrew · the grave, realm of all the dead</text>
        <g class="i-bone" transform="translate(470 248)"><circle cx="0" cy="8" r="8"/><rect x="10" y="5" width="70" height="6" rx="3"/><circle cx="86" cy="4" r="4"/><circle cx="86" cy="12" r="4"/></g></g>
      <g data-hot="hades" class="hot"><rect x="70" y="296" width="500" height="44" rx="22" class="i-layer2"/>
        <text x="100" y="324" class="i-lbl">Hades</text><text x="166" y="324" class="i-sub">Greek name for the same realm</text></g>
      <g data-hot="tartarus" class="hot"><rect x="160" y="348" width="320" height="40" rx="20" class="i-layer3"/>
        <text x="320" y="373" class="i-lbl i-on-dark" text-anchor="middle">Tartarus · angels held for judgment</text></g>
    </svg>`
  },
  gehenna: {
    title: 'Jerusalem and the Valley of Hinnom',
    caption: 'Schematic map, not to scale. Gehenna was a real valley outside the city walls: once a site of child sacrifice, later linked with the city dump and its fires.',
    hotspots: [
      { id: 'hinnom', label: 'Valley of Hinnom', text: 'Gey Hinnom, "Gehenna". Site of Topheth, where children were sacrificed by fire (2 Kings 23:10; Jeremiah 19:6). A symbol of shame and judgment.' },
      { id: 'kidron', label: 'Kidron Valley', text: 'The Kidron Valley encompasses the Valley of Hinnom. An Early Roman (1st century CE) city dump has been excavated in the Kidron area.' },
      { id: 'temple', label: 'Temple Mount', text: 'The heart of the city. Gehenna lay just outside its walls, within sight of the people Jesus addressed.' },
      { id: 'olives', label: 'Mount of Olives', text: 'Across the Kidron Valley to the east.' },
    ],
    svg: `<svg viewBox="0 0 640 420" role="img" aria-label="Schematic map of ancient Jerusalem with the Hinnom Valley curving around the west and south and the Kidron Valley to the east">
      <rect width="640" height="420" class="i-land"/>
      <g data-hot="hinnom" class="hot"><path d="M150 40 C140 140 150 250 210 320 C260 370 340 380 420 352" class="i-river-w"/><path d="M150 40 C140 140 150 250 210 320 C260 370 340 380 420 352" class="i-river"/>
        <text x="96" y="210" class="i-lbl" transform="rotate(-80 96 210)">Valley of Hinnom · Gehenna</text>
        <g transform="translate(250 352)"><path d="M0 0 q6 -16 12 0 q6 -20 12 0 q6 -14 12 0" class="i-flame-s"/></g>
        <text x="236" y="392" class="i-sub">Topheth · refuse fires</text></g>
      <g data-hot="kidron" class="hot"><path d="M470 40 C462 140 450 260 420 352" class="i-river-w"/><path d="M470 40 C462 140 450 260 420 352" class="i-river"/>
        <text x="492" y="170" class="i-lbl" transform="rotate(84 492 170)">Kidron Valley</text></g>
      <path d="M200 90 L410 80 L420 250 L360 300 L230 290 L196 200 Z" class="i-wall"/>
      <text x="250" y="140" class="i-lbl">Jerusalem</text>
      <g data-hot="temple" class="hot"><rect x="340" y="110" width="58" height="46" rx="4" class="i-temple"/><text x="369" y="172" class="i-sub" text-anchor="middle">Temple Mount</text></g>
      <g data-hot="olives" class="hot"><path d="M520 300 l40 -70 l40 70 z" class="i-hill"/><text x="560" y="320" class="i-sub" text-anchor="middle">Mount of Olives</text></g>
      <g transform="translate(590 40)" class="i-compass"><circle r="16"/><path d="M0 -12 L5 4 L0 0 L-5 4 Z"/><text y="-22" text-anchor="middle" class="i-sub">N</text></g>
    </svg>`
  },
  early: {
    title: 'The six early schools of theology',
    caption: 'In the first centuries, the major teaching centres disagreed about hell. Only one taught eternal conscious torment. Tap a city.',
    hotspots: [
      { id: 'alex', label: 'Alexandria (2nd c.)', text: 'Taught that punishment is temporary and purifying, ending in restoration.' },
      { id: 'anti', label: 'Antioch (3rd c.)', text: 'Literal, historical reading of Scripture; also taught restoration.' },
      { id: 'caes', label: 'Caesarea (3rd c.)', text: 'Influenced by Origen; taught restoration.' },
      { id: 'edes', label: 'Eastern Syria (4th c.)', text: 'Syriac tradition: divine punishment is temporary and aimed at correction.' },
      { id: 'asia', label: 'Asia Minor (3rd c.)', text: 'Taught annihilationism: the wicked are ultimately destroyed, not tormented forever.' },
      { id: 'hippo', label: 'Hippo (late 4th–5th c.)', text: 'Augustine’s school in North Africa: the only one that taught eternal conscious torment.' },
    ],
    svg: `<svg viewBox="0 0 640 380" role="img" aria-label="Map of the Mediterranean showing six early theological schools coloured by their view of hell">
      <rect width="640" height="380" class="i-land"/>
      <path d="M0 190 C40 170 80 200 120 196 C150 192 170 210 200 214 C240 220 250 200 290 206 C320 210 330 186 360 182 C380 160 410 190 440 176 C470 162 500 170 530 160 C560 156 580 172 600 190 L610 230 C590 262 560 268 540 290 C510 300 470 296 430 300 C400 304 360 296 330 282 C300 272 270 284 240 290 C200 296 170 272 130 270 C90 268 60 252 20 250 L0 246 Z" class="i-sea"/>
      <text x="300" y="250" class="i-sea-lbl" text-anchor="middle">Mediterranean Sea</text>
      <g data-hot="hippo" class="hot"><circle cx="170" cy="282" r="10" class="i-dot-ect"/><text x="170" y="310" class="i-lbl" text-anchor="middle">Hippo</text></g>
      <g data-hot="alex" class="hot"><circle cx="500" cy="308" r="10" class="i-dot-res"/><text x="500" y="336" class="i-lbl" text-anchor="middle">Alexandria</text></g>
      <g data-hot="caes" class="hot"><circle cx="580" cy="262" r="10" class="i-dot-res"/><text x="560" y="292" class="i-lbl" text-anchor="middle">Caesarea</text></g>
      <g data-hot="anti" class="hot"><circle cx="590" cy="178" r="10" class="i-dot-res"/><text x="578" y="160" class="i-lbl" text-anchor="middle">Antioch</text></g>
      <g data-hot="edes" class="hot"><circle cx="612" cy="120" r="10" class="i-dot-res"/><text x="604" y="102" class="i-lbl" text-anchor="end">Eastern Syria</text></g>
      <g data-hot="asia" class="hot"><circle cx="470" cy="140" r="10" class="i-dot-ann"/><text x="470" y="122" class="i-lbl" text-anchor="middle">Asia Minor</text></g>
      <g class="i-legend" transform="translate(20 24)"><circle cx="8" cy="8" r="7" class="i-dot-res"/><text x="22" y="13" class="i-sub">Restoration (4 schools)</text>
        <circle cx="8" cy="32" r="7" class="i-dot-ann"/><text x="22" y="37" class="i-sub">Annihilation (1)</text>
        <circle cx="8" cy="56" r="7" class="i-dot-ect"/><text x="22" y="61" class="i-sub">Eternal torment (1)</text></g>
    </svg>`
  },
  lakeoffire: {
    title: 'A lake of "fire and sulfur" you can visit',
    caption: 'The Dead Sea: the lowest point on earth, rich in sulfur, visited for healing. Fire and sulfur were also used to refine gold. The book reads the lake of fire as purification.',
    hotspots: [
      { id: 'dead', label: 'Dead Sea', text: 'The lowest point on Earth\u2019s surface. Its mineral-rich waters, with sulfur, are known for healing and purifying; bathing there can feel like dipping in fire.' },
      { id: 'sodom', label: 'Sodom & Gomorrah', text: 'The Lord rained "sulfur and fire" on them (Genesis 19:24). Yet Ezekiel 16:53-55 promises God will restore the fortunes of Sodom.' },
      { id: 'jordan', label: 'Jordan River', text: 'Flows south from the Sea of Galilee into the Dead Sea.' },
      { id: 'jer', label: 'Jerusalem', text: 'West of the Dead Sea, in the hills of Judea.' },
    ],
    svg: `<svg viewBox="0 0 640 400" role="img" aria-label="Map showing the Sea of Galilee, the Jordan River flowing to the Dead Sea, Jerusalem to the west and Sodom to the south">
      <rect width="640" height="400" class="i-land"/>
      <ellipse cx="360" cy="46" rx="22" ry="30" class="i-sea"/><text x="392" y="50" class="i-sub">Sea of Galilee</text>
      <g data-hot="jordan" class="hot"><path d="M360 76 C350 110 372 140 356 170 C344 196 366 214 360 240" class="i-river-w"/><path d="M360 76 C350 110 372 140 356 170 C344 196 366 214 360 240" class="i-river"/><text x="376" y="160" class="i-sub">Jordan River</text></g>
      <g data-hot="dead" class="hot"><path d="M352 240 C334 260 336 320 346 350 C352 372 372 372 376 350 C384 316 386 262 368 240 Z" class="i-deadsea"/>
        <text x="400" y="300" class="i-lbl">Dead Sea</text><text x="400" y="318" class="i-sub">sulfur, salt, no life</text></g>
      <g data-hot="sodom" class="hot"><g transform="translate(330 378)"><path d="M0 0 q6 -16 12 0 q6 -20 12 0 q6 -14 12 0" class="i-flame-s"/></g><text x="300" y="396" class="i-sub" text-anchor="end">Sodom &amp; Gomorrah</text></g>
      <g data-hot="jer" class="hot"><circle cx="250" cy="262" r="9" class="i-dot-ect"/><text x="236" y="266" class="i-lbl" text-anchor="end">Jerusalem</text></g>
      <path d="M40 360 C120 330 200 350 250 300" class="i-dash"/>
    </svg>`
  },
  unquenchable: {
    title: 'The refiner’s fire',
    caption: 'In Scripture, fire often purifies: metal is heated until the dross rises and is removed. "He will sit as a refiner and purifier of silver" (Malachi 3:3).',
    hotspots: [
      { id: 'dross', label: 'Dross', text: 'Impurities rise to the surface and are skimmed away: the sin is destroyed, not the person.' },
      { id: 'silver', label: 'Pure silver', text: 'What remains after refining. Fire tests and cleanses; it does not exist to torture.' },
      { id: 'fire', label: 'The fire', text: 'Unquenchable fire "will not stop until it fully completes its task". It burns what it is meant to burn.' },
    ],
    svg: `<svg viewBox="0 0 640 360" role="img" aria-label="A crucible over a fire: dross rising off the top, pure silver below">
      <rect width="640" height="360" class="i-land"/>
      <g data-hot="fire" class="hot"><path d="M220 330 C230 280 260 300 262 262 C290 300 300 270 312 240 C330 290 350 270 356 250 C370 290 400 290 420 330 Z" class="i-fire"/><path d="M262 330 C270 300 290 310 300 284 C312 310 330 300 340 290 C350 312 368 316 376 330 Z" class="i-fire2"/><text x="440" y="320" class="i-lbl">The fire</text></g>
      <path d="M200 120 L440 120 L410 250 L230 250 Z" class="i-crucible"/>
      <g data-hot="silver" class="hot"><path d="M222 190 L418 190 L410 240 L232 240 Z" class="i-silver"/><text x="320" y="222" class="i-lbl i-on-silver" text-anchor="middle">pure silver</text></g>
      <g data-hot="dross" class="hot"><path d="M210 150 C240 140 260 160 290 150 C320 140 350 160 380 150 C400 144 420 152 430 150 L426 168 L214 168 Z" class="i-dross"/>
        <circle cx="260" cy="110" r="6" class="i-dross"/><circle cx="300" cy="92" r="4" class="i-dross"/><circle cx="350" cy="104" r="5" class="i-dross"/><circle cx="390" cy="84" r="3" class="i-dross"/>
        <text x="460" y="150" class="i-lbl">Dross rises</text><path d="M456 146 L434 156" class="i-dash"/></g>
    </svg>`
  },
  torah: {
    title: 'What the Torah says happens at death',
    caption: 'In the Torah, the dead "go down to Sheol", the realm of the dead. In Judaism, Sheol is where all souls rest until judgment day, not a place of torment.',
    hotspots: [
      { id: 'grave', label: 'Sheol', text: 'Jacob said, "I shall go down to Sheol to my son, mourning" (Genesis 37:34-35). Sheol simply means the realm of the dead, like a grave.' },
      { id: 'life', label: 'Blessings and curses', text: 'The Torah’s blessings are earthly: barns, flocks, the land (Deuteronomy 28). Its penalties, too, concern this life.' },
    ],
    svg: `<svg viewBox="0 0 640 340" role="img" aria-label="A resting skeleton in a grave beneath the ground, with a field and tree above">
      <rect width="640" height="140" class="i-sky"/><rect y="140" width="640" height="200" class="i-soil"/>
      <g data-hot="life" class="hot"><path d="M60 140 C120 110 180 130 240 120 L240 140 Z" class="i-hill"/><g transform="translate(520 60)"><rect x="-6" y="40" width="12" height="40" class="i-trunk"/><circle r="40" cy="30" class="i-leaf"/></g>
        <text x="40" y="40" class="i-lbl">This life: blessing or curse</text></g>
      <g data-hot="grave" class="hot"><rect x="150" y="200" width="340" height="96" rx="48" class="i-layer1"/>
        <g class="i-bone" transform="translate(200 246)">
          <circle cx="0" cy="0" r="16"/><circle cx="-5" cy="-3" r="3.4" class="i-hole"/><circle cx="6" cy="-3" r="3.4" class="i-hole"/>
          <rect x="18" y="-3" width="150" height="6" rx="3"/>
          <rect x="40" y="-16" width="4" height="32" rx="2"/><rect x="56" y="-18" width="4" height="36" rx="2"/><rect x="72" y="-18" width="4" height="36" rx="2"/><rect x="88" y="-16" width="4" height="32" rx="2"/>
          <path d="M168 0 L230 -16 M168 0 L230 16" stroke-width="6" stroke-linecap="round" class="i-bone-s"/>
          <path d="M60 -6 L110 -30 M60 6 L110 30" stroke-width="5" stroke-linecap="round" class="i-bone-s"/>
        </g>
        <text x="320" y="320" class="i-lbl" text-anchor="middle">Sheol: rest, silence, the grave</text></g>
    </svg>`
  },
  lazarus: {
    title: 'The great chasm in the parable',
    caption: 'A parable for a Jewish audience, full of symbolic names and images. It is read as a story with a message, not a literal map of the afterlife.',
    hotspots: [
      { id: 'abraham', label: 'Abraham’s side', text: 'Lazarus, the poor man, is comforted. His Hebrew name, Eleazar, means "God\u2019s Help" and recalls Abraham\u2019s steward Eleazar (Genesis 15:2-3).' },
      { id: 'gulf', label: 'The great chasm', text: 'A fixed gulf separates the two. The parable reverses their fortunes in life.' },
      { id: 'rich', label: 'The rich man in Hades', text: 'He is in BASANOS: usually translated "torment", but the word means a touchstone, a test.' },
    ],
    svg: `<svg viewBox="0 0 640 320" role="img" aria-label="Two cliffs separated by a deep chasm: Lazarus with Abraham on one side, the rich man on the other">
      <rect width="640" height="320" class="i-sky"/>
      <g data-hot="abraham" class="hot"><path d="M0 120 L250 120 L270 320 L0 320 Z" class="i-cliff"/><circle cx="150" cy="96" r="14" class="i-person"/><rect x="138" y="108" width="24" height="12" class="i-person"/><circle cx="190" cy="100" r="10" class="i-person"/>
        <text x="40" y="160" class="i-lbl">Abraham’s side</text><text x="40" y="178" class="i-sub">Lazarus comforted</text></g>
      <g data-hot="gulf" class="hot"><path d="M250 120 L390 120 L370 320 L270 320 Z" class="i-gulf"/><text x="320" y="300" class="i-lbl i-on-dark" text-anchor="middle">great chasm</text></g>
      <g data-hot="rich" class="hot"><path d="M390 120 L640 120 L640 320 L370 320 Z" class="i-cliff2"/><circle cx="470" cy="100" r="12" class="i-person"/>
        <g transform="translate(500 120)"><path d="M0 0 q6 -16 12 0 q6 -20 12 0 q6 -14 12 0" class="i-flame-s"/></g>
        <text x="430" y="160" class="i-lbl">The rich man</text><text x="430" y="178" class="i-sub">in Hades, thirsting</text></g>
    </svg>`
  },
  narrow: {
    title: 'Two roads, two gates',
    caption: 'The two-paths image is a familiar Jewish theme (Deuteronomy 30:19; Psalm 1:6): God’s way leads to blessing in life, the way of wickedness to destructive consequences.',
    hotspots: [
      { id: 'narrowg', label: 'Narrow gate', text: '"Small is the gate and narrow the road that leads to life, and only a few find it" (Matthew 7:14).' },
      { id: 'wideg', label: 'Wide gate', text: '"Wide is the gate and broad is the road that leads to destruction" (Matthew 7:13).' },
    ],
    svg: `<svg viewBox="0 0 640 320" role="img" aria-label="A wide road leading to a wide gate and a narrow path leading to a small gate">
      <rect width="640" height="320" class="i-land"/>
      <g data-hot="wideg" class="hot"><path d="M40 320 L260 320 L230 120 L90 120 Z" class="i-road"/><rect x="80" y="70" width="160" height="56" rx="6" class="i-gate"/><text x="160" y="104" class="i-lbl i-on-dark" text-anchor="middle">wide gate</text><text x="160" y="58" class="i-sub" text-anchor="middle">destruction</text></g>
      <g data-hot="narrowg" class="hot"><path d="M470 320 L500 320 L492 120 L478 120 Z" class="i-path"/><rect x="466" y="80" width="38" height="46" rx="6" class="i-gate-n"/><text x="485" y="60" class="i-sub" text-anchor="middle">life</text><text x="530" y="200" class="i-lbl">narrow road</text></g>
    </svg>`
  },
  sheepgoats: {
    title: 'Sheep and goats: judging the nations',
    caption: 'The nations are judged by how they treated "the least of these" (Matthew 25:40). The Greek word for punishment, kolasis, carried the sense of correction.',
    hotspots: [
      { id: 'sheep', label: 'Sheep', text: 'Those who fed the hungry, welcomed strangers, clothed the naked and visited the sick and imprisoned.' },
      { id: 'goats', label: 'Goats', text: 'Those who failed to care for the least. Their punishment is kolasis, a word originally used for corrective, remedial punishment.' },
    ],
    svg: `<svg viewBox="0 0 640 300" role="img" aria-label="A throne in the centre with a flock of sheep on the right and goats on the left">
      <rect width="640" height="300" class="i-land"/>
      <g transform="translate(320 120)"><rect x="-30" y="-50" width="60" height="80" rx="8" class="i-temple"/><path d="M-22 -60 l10 -16 l12 12 l12 -12 l10 16 z" class="i-sun"/></g>
      <g data-hot="sheep" class="hot">${[0,1,2,3,4].map(i => `<g transform="translate(${430 + (i % 3) * 56} ${150 + Math.floor(i / 3) * 60})"><ellipse rx="22" ry="15" class="i-wool"/><circle cx="20" cy="-6" r="8" class="i-face"/><rect x="-14" y="10" width="4" height="14" class="i-face"/><rect x="8" y="10" width="4" height="14" class="i-face"/></g>`).join('')}<text x="490" y="280" class="i-lbl" text-anchor="middle">sheep · right</text></g>
      <g data-hot="goats" class="hot">${[0,1,2,3,4].map(i => `<g transform="translate(${100 + (i % 3) * 56} ${150 + Math.floor(i / 3) * 60})"><ellipse rx="20" ry="13" class="i-goat"/><circle cx="-18" cy="-8" r="7" class="i-goat"/><path d="M-20 -14 l-6 -12 M-15 -14 l2 -12" class="i-horn"/><rect x="-12" y="9" width="4" height="14" class="i-goat"/><rect x="8" y="9" width="4" height="14" class="i-goat"/></g>`).join('')}<text x="160" y="280" class="i-lbl" text-anchor="middle">goats · left</text></g>
    </svg>`
  },
};
