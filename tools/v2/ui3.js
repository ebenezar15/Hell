// ===== v3 interactive layer (MindConnect-inspired): home, rail, stage rooms, story mode, word detective, living diagrams =====
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

// ---------- streak ----------
(() => {
  const day = d => d.toISOString().slice(0, 10), today = day(new Date()), y = day(new Date(Date.now() - 864e5));
  const st = S.streak || { last: null, n: 0 };
  if (st.last !== today) { st.n = st.last === y ? st.n + 1 : 1; st.last = today; }
  S.streak = st; save();
})();

// ---------- detail drawer ----------
function openDrawer(html, after) { $('#drawerBody').innerHTML = html; $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); $('#drawer').scrollTop = 0; if (after) after($('#drawerBody')); setTimeout(() => $('#drawerX').focus({ preventScroll: true }), 60); }
function closeDrawer() { $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); }
$('#drawerX').onclick = closeDrawer; $('#scrim').onclick = closeDrawer;
addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
function versePop(anchor, ref) {
  const key = normRef(ref), base = key.replace(/[-–]\d+$/, '');
  const roles = TOPICS.flatMap(t => t.verses.filter(v => normRef(v.ref).replace(/[-–]\d+$/, '') === base).map(v => ({ t, role: v.role })));
  const mentions = TOPICS.filter(t => !roles.some(r => r.t === t) && (t.points.some(p => (p.verses || []).some(x => normRef(x).replace(/[-–]\d+$/, '') === base)) || t.sections.some(s => (s.verses || []).some(x => normRef(x).replace(/[-–]\d+$/, '') === base))));
  const cites = (SCRIPT.refs[base] || []).length;
  openDrawer(`<div class="eyebrow">${T('Key verse')}</div><h3>${esc(vr(ref))}</h3>
    ${roles.map(r => `<button class="row2" data-open-topic="${r.t.id}"><b>${esc(r.t.title)}</b><span>${esc(r.role)}</span></button>`).join('')}
    ${mentions.map(t => `<button class="row2" data-open-topic="${t.id}"><b>${esc(t.title)}</b><span>${T('Also discussed here')}</span></button>`).join('')}
    ${cites ? `<p class="muted">${T('Cited {0} time(s) in the full text. See the Verses tab.', cites)}</p>` : ''}
    ${!roles.length && !mentions.length && !cites ? `<p class="muted">${T('Mentioned in this topic.')}</p>` : ''}`,
    body => $$('[data-open-topic]', body).forEach(b => b.onclick = () => { closeDrawer(); openTopic(b.dataset.openTopic); }));
}

// ---------- rail: numbered stage rooms ----------
function renderRail() {
  const box = $('#railStages'); if (!box) return;
  box.innerHTML = D.stages.map((s, i) => {
    const d = s.topics.filter(t => S.done[t.id]).length, f = d / s.topics.length;
    return `<button class="stg" data-room="${s.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${esc(s.title)}</span><svg class="pr" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="10" style="fill:none;stroke:var(--line);stroke-width:3"/><circle cx="13" cy="13" r="10" pathLength="1" style="fill:none;stroke:${stageColor(i)};stroke-width:3;stroke-dasharray:1;stroke-dashoffset:${(1 - f).toFixed(3)};transform:rotate(-90deg);transform-origin:13px 13px"/></svg></button>`;
  }).join('');
  $$('.stg', box).forEach(b => b.onclick = () => openStage(b.dataset.room));
  markRail();
}
function markRail() {
  const h = (location.hash || '').slice(1);
  const sid = view === 'stage' ? h.replace('stage-', '') : view === 'topic' && BYID[lastTopic] ? BYID[lastTopic].stage.id : null;
  $$('#railStages .stg').forEach(b => b.dataset.room === sid ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'));
}

// ---------- neural constellation (hero + story backgrounds) ----------
function neural(cv, opts = {}) {
  const ctx = cv.getContext('2d'); let w, h, nodes = [], pulses = [], raf = null;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const cols = () => [cssv('--accent') || '#e8b65a', cssv('--water') || '#5cc8b8', cssv('--violet') || '#a99bf0'];
  function size() { const r = cv.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(opts.max || 70, w * h / 9000)); nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2 })); }
  size();
  let C = cols(), line = cssv('--line') || '#23393d';
  function frame() {
    if (!cv.isConnected) { raf = null; return; }
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1; }
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 115) { ctx.globalAlpha = (1 - d / 115) * .6; ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if (Math.random() < .0011 && pulses.length < 28) pulses.push({ a, b, t: 0, c: C[Math.floor(Math.random() * C.length)] }); }
    }
    ctx.globalAlpha = 1;
    for (const n of nodes) { ctx.fillStyle = line; ctx.beginPath(); ctx.arc(n.x, n.y, 1.8, 0, 7); ctx.fill(); }
    pulses = pulses.filter(p => p.t <= 1);
    for (const p of pulses) { p.t += .018; const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t; ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
    raf = !REDUCE && !document.hidden ? requestAnimationFrame(frame) : null;
  }
  frame();
  return { recolor() { C = cols(); line = cssv('--line') || line; if (REDUCE) frame(); }, resize() { size(); if (!raf) frame(); } };
}

// ---------- home ----------
let homeNet = null, tickerT = null;
function renderHome() {
  const done = TOPICS.filter(t => S.done[t.id]).length, pct = done / TOPICS.length;
  const next = TOPICS.find(t => !S.done[t.id]) || TOPICS[0];
  const C = 2 * Math.PI * 70;
  const qs = ['philology', 'gehenna', 'eternal', 'lazarus', 'threeviews', 'wheattares'].map(id => BYID[id]).filter(Boolean);
  $('#v-home').innerHTML = `
  <div class="hero hero3"><canvas aria-hidden="true"></canvas>
    <div class="hero-copy"><div class="eyebrow">${T('An interactive journey · {0} topics · {1} stages', TOPICS.length, D.stages.length)}</div>
      <h1>${T('What does the Bible really say about hell?')}</h1>
      <p>${T('Follow the words, the history, the theology and every key verse through diagrams, maps, flip cards and quick quizzes. Each idea takes a few minutes.')}</p>
      <div class="actions"><button class="btn" id="cta">${ic('arrow')}<span>${done ? T('Continue: {0}', esc(next.title)) : T('Start the journey')}</span></button><button class="btn ghost" id="ctaStory">${ic('sun')}${T('Play as a story')}</button></div></div>
    <div class="hero-stats"><div class="ring" aria-label="${T('{0} of {1} topics explored', done, TOPICS.length)}"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="70" fill="none" style="stroke:var(--line)" stroke-width="12"/><circle cx="80" cy="80" r="70" fill="none" style="stroke:var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg><div class="lbl"><b>${Math.round(pct * 100)}%</b><span>${T('{0} of {1} topics', done, TOPICS.length)}</span></div></div>
      <div class="hstats"><div class="hstat"><b>${S.streak ? S.streak.n : 1}</b><span>${T('day streak')}</span></div><div class="hstat"><b>${fmt(S.xp)}</b><span>${T('points')}</span></div></div></div>
  </div>
  <div class="bigq">${qs.map(t => `<button data-open="${t.id}" style="--stage:${stageColor(t.si)}"><span class="tag3">${esc(t.stage.title)}</span><b>${esc(t.hook)}</b><span>${esc(t.title)}</span></button>`).join('')}</div>

  ${done ? `<div class="cont" style="--stage:${stageColor(next.si)}"><span class="ci">${ic(next.icon)}</span><div style="min-width:0"><div class="eyebrow" style="color:var(--stage)">${T('Up next')} · ${esc(next.stage.title)}</div><b style="font-size:1.1rem">${esc(next.title)}</b><p class="muted">${esc(next.hook)}</p></div><div class="acts"><button class="btn primary" data-open="${next.id}">${ic('arrow')}${T('Open')}</button><button class="btn" data-story="${next.id}">${ic('sun')}${T('Story')}</button></div></div>` : ''}

  <div class="section-head"><div><h2>${T('Your path')}</h2><p>${T('Nine rooms, one journey. The glowing dot shows how far you have come. Tap a room to enter it.')}</p></div></div>
  ${journeyPath()}

  <div class="section-head"><div><h2>${T('How four words became one')}</h2><p>${T('Watch Sheol, Hades, Gehenna and Tartarus flow through the Latin Bible into one English word.')}</p></div></div>
  ${wordFlow()}

  <div class="section-head"><div><h2>${T('By the numbers')}</h2><p>${T('Striking figures from across the journey. They change every few seconds.')}</p></div></div>
  <div class="ticker" id="ticker"></div>

  <div class="section-head"><div><h2>${T('Explore visually')}</h2><p>${T('Maps, timelines and flashcards for seeing the whole picture and studying it.')}</p></div></div>
  <div class="tiles">
    <button class="tile" data-goto="map" data-tab="concept"><span class="ti">${ic('globe')}</span><b>${T('Concept map')}</b><span>${T('Every topic as a connected web. Tap a dot to see its links.')}</span></button>
    <button class="tile" data-goto="map" data-tab="timeline"><span class="ti">${ic('hourglass')}</span><b>${T('History timeline')}</b><span>${T('From Sheol to the Reformation: every dated event, in order.')}</span></button>
    <button class="tile" data-goto="map" data-tab="bible"><span class="ti">${ic('scroll')}</span><b>${T('Bible heat map')}</b><span>${T('All 66 books, coloured by how often they are cited.')}</span></button>
    <button class="tile" data-goto="study"><span class="ti">${ic('bulb')}</span><b>${T('Flashcards')}</b><span>${T('Learn the terms, ideas and myths with spaced repetition.')}</span></button>
    <button class="tile" data-goto="quiz" data-qt="detective"><span class="ti">${ic('eye')}</span><b>${T('Word Detective')}</b><span>${T('Guess which original word hides behind "hell" in each verse.')}</span></button>
  </div>

  <div class="section-head"><div><h2>${T('One English word, four originals')}</h2><p>${T('Much of the confusion starts with translation. Tap each layer.')}</p></div><button class="btn" data-open="philology">${ic('book')}${T('Open the word study')}</button></div>
  <div class="panel">${illus('philology')}</div>

  <div class="section-head"><div><h2>${T('Badges')}</h2><p>${T('Finish every topic in a stage to earn its badge.')}</p></div></div>
  <div class="badges">${D.stages.map(s => { const b = badge(s); return `<div class="medal ${stageDone(s) ? 'on' : ''}"><span class="m" style="background:${stageColor(s.topics[0].si)}">${ic(b.icon)}</span><div><b>${esc(b.name)}</b><span>${esc(b.how)}</span></div></div>`; }).join('')}</div>

  <div class="section-head"><div><h2>${T('Myth or fact?')}</h2><p>${T('Common beliefs, checked against the text. Tap a card to flip it.')}</p></div><button class="btn" id="moreMyths">${ic('wave')}${T('Shuffle')}</button></div>
  <div class="flips" id="homeMyths"></div>

  <div class="section-head"><div><h2>${T('Tough questions')}</h2><p>${T('The hardest objections to this view, each with a short answer. Open one to read the full reply.')}</p></div><button class="btn" id="moreObj">${ic('wave')}${T('Shuffle')}</button></div>
  <div class="objs" id="homeObj"></div>`;
  homeNet = neural($('#v-home .hero canvas'));
  $('#cta').onclick = () => openTopic(next.id);
  $('#ctaStory').onclick = () => playStory(next);
  $$('#v-home [data-open]').forEach(b => b.onclick = () => openTopic(b.dataset.open));
  $$('#v-home [data-story]').forEach(b => b.onclick = () => playStory(BYID[b.dataset.story]));
  $$('#v-home [data-goto]').forEach(b => b.onclick = () => { if (b.dataset.tab) mapTab = b.dataset.tab; if (b.dataset.qt) quizTab = b.dataset.qt; go(b.dataset.goto); });
  $$('#v-home [data-room]').forEach(b => { const f = () => openStage(b.dataset.room); b.onclick = f; b.onkeydown = e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), f()); });
  bindIllus($('#v-home'));
  const shuffleMyths = () => { const all = TOPICS.flatMap(t => t.mythfact.map(m => ({ ...m, t }))); $('#homeMyths').innerHTML = flips(all.sort(() => Math.random() - .5).slice(0, 6), true); bindFlips($('#homeMyths')); };
  shuffleMyths(); $('#moreMyths').onclick = shuffleMyths;
  const shuffleObj = () => { const all = TOPICS.filter(t => t.kind === 'objection').flatMap(t => t.objections.map(o => ({ ...o, t }))); $('#homeObj').innerHTML = all.sort(() => Math.random() - .5).slice(0, 4).map(o => `<details class="obj"><summary><span class="kind ${o.kind}">${T(o.kind)}</span><span class="q">${esc(o.claim)}</span>${ic('arrow', 'ic chev')}</summary><div class="ob-body"><div class="resp"><b>${T('The answer')}</b>${esc(o.response)}</div><div class="foot2"><button class="chip" data-open="${o.t.id}">${ic('shield')}${esc(o.t.title)}</button></div></div></details>`).join(''); $$('#homeObj [data-open]').forEach(b => b.onclick = () => openTopic(b.dataset.open)); };
  shuffleObj(); $('#moreObj').onclick = shuffleObj;
  startTicker();
  observePlay($('#v-home'));
}
function journeyPath() {
  const n = D.stages.length, W = 640, rowH = 118, H = n * rowH + 30;
  const P = D.stages.map((s, i) => [i % 2 ? W - 120 : 120, 70 + i * rowH]);
  let d = `M${P[0][0]} ${P[0][1]}`;
  for (let i = 1; i < n; i++) d += ` C${P[i - 1][0]} ${P[i - 1][1] + 75} ${P[i][0]} ${P[i][1] - 75} ${P[i][0]} ${P[i][1]}`;
  const frac = TOPICS.filter(t => S.done[t.id]).length / TOPICS.length;
  let g = `<defs><linearGradient id="jpGrad" x1="0" y1="0" x2="0" y2="1">${D.stages.map((s, i) => `<stop offset="${(i / Math.max(1, n - 1)).toFixed(3)}" stop-color="${stageColor(i)}"/>`).join('')}</linearGradient></defs>
    <path id="jpPath" class="jp-base" d="${d}" pathLength="1"/><path class="jp-fill" d="${d}" pathLength="1" style="stroke-dashoffset:${(1 - frac).toFixed(4)}"/>`;
  D.stages.forEach((s, i) => {
    const [x, y] = P[i], left = i % 2 === 0, dn = s.topics.filter(t => S.done[t.id]).length, f = dn / s.topics.length;
    const lines = wrapText(s.title, 22).slice(0, 2), tx = left ? x + 58 : x - 58, anchor = left ? 'start' : 'end';
    g += `<g class="jp-node" data-room="${s.id}" tabindex="0" role="button" aria-label="${esc(s.title)}">
      <circle class="halo" cx="${x}" cy="${y}" r="40" style="fill:${stageColor(i)};opacity:.35"/>
      <g class="bg"><circle cx="${x}" cy="${y}" r="40" style="fill:${stageColor(i)}"/>
      <circle cx="${x}" cy="${y}" r="46" pathLength="1" style="fill:none;stroke:${stageColor(i)};stroke-width:5;stroke-opacity:.9;stroke-dasharray:1;stroke-dashoffset:${(1 - f).toFixed(3)};transform:rotate(-90deg);transform-box:fill-box;transform-origin:center"/>
      <svg x="${x - 18}" y="${y - 18}" width="36" height="36" viewBox="0 0 24 24" class="ic2"><use href="#ic-${s.icon}"/></svg></g>
      <text class="jp-sub" x="${tx}" y="${y - 26}" text-anchor="${anchor}">${esc(T('Room {0}', String(i + 1).padStart(2, '0')))} · ${dn}/${s.topics.length}</text>
      ${lines.map((l, j) => `<text class="jp-title" x="${tx}" y="${y + j * 23}" text-anchor="${anchor}">${esc(l)}</text>`).join('')}
      <text class="jp-sub" x="${tx}" y="${y + lines.length * 23 + 4}" text-anchor="${anchor}">${esc(wrapText(s.desc, 34)[0])}${wrapText(s.desc, 34).length > 1 ? '…' : ''}</text></g>`;
  });
  g += `<circle class="jp-dot" r="9" cx="${P[0][0]}" cy="${P[0][1]}">${REDUCE ? '' : `<animateMotion dur="2.6s" fill="freeze" calcMode="spline" keySplines=".3 0 .2 1" keyPoints="0;${Math.max(.001, frac).toFixed(4)}" keyTimes="0;1"><mpath href="#jpPath"/></animateMotion>`}</circle>`;
  if (REDUCE || !frac) g = g.replace(`cx="${P[0][0]}" cy="${P[0][1]}"`, `cx="${P[0][0]}" cy="${P[0][1]}"`);
  return `<div class="jpath"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T('Your path'))}">${g}</svg></div>`;
}
function wordFlow() {
  const src = [['Sheol', T('Hebrew · Old Testament'), 70, 'var(--accent)'], ['Hades', T('Greek · New Testament'), 145, 'var(--violet)'], ['Gehenna', T('Greek · from Hebrew'), 220, 'var(--bad)'], ['Tartarus', T('Greek · 2 Peter 2:4'), 295, 'var(--water)']];
  const mid = { Sheol: 105, Hades: 105, Gehenna: 220, Tartarus: 295 };
  const midW = [['infernus', 105], ['gehenna', 220], ['tartarus', 295]];
  let g = `<defs><linearGradient id="hellGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ef7a63"/><stop offset="1" stop-color="#e8b65a"/></linearGradient></defs>
    <text class="col" x="95" y="26" text-anchor="middle">${esc(T('ORIGINAL WORDS'))}</text><text class="col" x="455" y="26" text-anchor="middle">${esc(T('LATIN VULGATE · c. AD 400'))}</text><text class="col" x="790" y="26" text-anchor="middle">${esc(T('ENGLISH · KJV 1611'))}</text>`;
  src.forEach(([w, s, y, c], i) => {
    const my = mid[w], p1 = `M180 ${y} C 300 ${y} 300 ${my} 390 ${my}`, p2 = `M520 ${my} C 610 ${my} 620 182 700 182`;
    g += `<path id="wf1-${i}" class="lane" d="${p1}" style="stroke:${c}"/><path id="wf2-${i}" class="lane" d="${p2}" style="stroke:${c}"/>`;
    if (!REDUCE) for (let k = 0; k < 3; k++) g += `<circle r="4.5" style="fill:${c}"><animateMotion dur="3.6s" begin="${(i * .45 + k * 1.2).toFixed(2)}s" repeatCount="indefinite" path="${p1.replace('M', 'M')} L 520 ${my} ${p2.replace(/^M520 \d+/, '')}"/></circle>`;
    g += `<rect class="wbox" x="10" y="${y - 28}" width="170" height="56" rx="14" style="stroke:${c}"/><text class="wt" x="26" y="${y - 2}">${w}</text><text class="ws" x="26" y="${y + 17}">${esc(s)}</text>`;
  });
  midW.forEach(([w, y]) => { g += `<rect class="wbox" x="390" y="${y - 22}" width="130" height="44" rx="12"/><text class="wt" x="455" y="${y + 6}" text-anchor="middle" style="font-style:italic">${w}</text>`; });
  g += `<rect x="700" y="132" width="180" height="100" rx="22" class="hell"/><text x="790" y="194" text-anchor="middle" style="fill:#1a0d06;font:800 40px var(--font)">HELL</text>`;
  return `<div class="wflow"><svg viewBox="0 0 890 330" role="img" aria-label="${esc(T('How four words became one'))}">${g}</svg>
    <p class="cap">${T('Jerome’s Latin Bible mostly rendered Sheol and Hades as infernus, kept gehenna, and used tartarus in 2 Peter 2:4. The King James Version then put "hell" for all four: Sheol 31 times, Hades 10, Gehenna 12 and Tartarus once.')}</p></div>`;
}
function startTicker() {
  clearInterval(tickerT);
  const items = TOPICS.flatMap(t => t.visuals.filter(v => v.type === 'stats').flatMap(v => v.items.map(it => ({ ...it, t }))));
  if (!items.length || !$('#ticker')) return;
  items.sort(() => Math.random() - .5);
  let i = 0;
  const show = () => {
    const box = $('#ticker'); if (!box) { clearInterval(tickerT); return; }
    const it = items[i % items.length];
    box.innerHTML = `<div class="tbody"><div class="tv" data-count="${esc(it.value)}">${esc(it.value)}</div><div class="tl">${esc(it.label)}</div><div class="tt">${esc(it.t.title)}</div><div class="tdots">${items.slice(0, Math.min(12, items.length)).map((_, k) => `<i class="${k === i % Math.min(12, items.length) ? 'on' : ''}"></i>`).join('')}</div></div><button class="btn" data-open="${it.t.id}">${ic('arrow')}${T('Open')}</button>`;
    $('[data-open]', box).onclick = () => openTopic(it.t.id);
    countUp(box); i++;
  };
  show(); if (!REDUCE) tickerT = setInterval(show, 4500);
}

// ---------- stage rooms ----------
function openStage(id) {
  const si = D.stages.findIndex(s => s.id === id); if (si < 0) return;
  const s = D.stages[si];
  show('stage', 'stage-' + id); markRail();
  const root = $('#v-stage'); root.style.setProperty('--stage', stageColor(si));
  const prev = D.stages[si - 1], next = D.stages[si + 1];
  root.innerHTML = `<header class="room-head"><span class="eyebrow">${T('Room {0}', String(si + 1).padStart(2, '0'))} · ${s.topics.filter(t => S.done[t.id]).length}/${s.topics.length}</span><h1>${esc(s.title)}</h1><p class="lede">${esc(s.desc)}</p>
      <div class="meta-row"><button class="btn primary" data-open="${(s.topics.find(t => !S.done[t.id]) || s.topics[0]).id}">${ic('arrow')}${T('Start this room')}</button><button class="chip story-btn" data-story="${s.topics[0].id}">${ic('sun')}${T('Play as a story')}</button></div></header>
    <div class="rmap">${roomMap(s, si)}</div>
    <div class="section-head"><div><h2>${T('Topics in this room')}</h2></div></div>
    <div class="rcards">${s.topics.map((t, k) => `<button class="rcard" data-open="${t.id}"><span class="n">${String(k + 1).padStart(2, '0')}</span><b>${esc(t.title)}</b><span>${esc(t.hook)}</span>${S.done[t.id] ? `<span class="done">${ic('check')}</span>` : ''}</button>`).join('')}</div>
    ${(s.extras || []).filter(r => BYID[r]).length ? `<div class="section-head"><div><h2>${T('Connected topics')}</h2></div></div><div class="stones">${s.extras.filter(r => BYID[r]).map(r => `<button class="stone extra" data-open="${r}"><span class="si">${ic('chain')}</span>${esc(BYID[r].title)}</button>`).join('')}</div>` : ''}
    <nav class="pager">${prev ? `<button class="btn" data-room="${prev.id}">← ${esc(prev.title)}</button>` : '<span></span>'}${next ? `<button class="btn primary" data-room="${next.id}">${esc(next.title)} →</button>` : `<button class="btn primary" data-goto="quiz">${T('Take the final challenge →')}</button>`}</nav>`;
  $$('[data-open]', root).forEach(b => b.onclick = () => openTopic(b.dataset.open));
  $$('[data-story]', root).forEach(b => b.onclick = () => playStory(BYID[b.dataset.story], s.topics));
  $$('[data-room]', root).forEach(b => b.onclick = () => openStage(b.dataset.room));
  $$('[data-goto]', root).forEach(b => b.onclick = () => go(b.dataset.goto));
  $$('.rn', root).forEach(n => { const f = () => openTopic(n.dataset.open2); n.onclick = f; n.onkeydown = e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), f()); });
  observePlay(root);
}
function roomMap(s, si) {
  const n = s.topics.length, big = n > 9, W = 900, rows = Math.ceil(n / 2);
  const H = big ? 170 + rows * 78 : 520, cx = W / 2, cy = big ? 78 : H / 2, rx = 330, ry = H / 2 - 70;
  const col = stageColor(si);
  let g = '';
  const pos = s.topics.map((t, i) => big ? [i % 2 ? 680 : 220, 175 + Math.floor(i / 2) * 78] : (a => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)])(-Math.PI / 2 + i * 2 * Math.PI / n));
  if (big) g += `<path class="flow-dash" d="M${cx} ${cy + 70} L${cx} ${pos[n - 1][1]}" style="fill:none;stroke:${col};stroke-opacity:.55;stroke-width:3"/>`;
  pos.forEach(([x, y], i) => { const d = big ? `M${cx} ${y} C${cx} ${y} ${(cx + x) / 2} ${y} ${x + (i % 2 ? -95 : 95)} ${y}` : `M${cx} ${cy} Q${((cx + x) / 2).toFixed(1)} ${cy} ${x.toFixed(1)} ${y.toFixed(1)}`; g += `<path class="mm-edge flow-dash" d="${d}" style="fill:none;stroke:${col};stroke-opacity:.6;stroke-width:2;--i:${i}"/>`; });
  s.topics.forEach((t, i) => {
    const [x, y] = pos[i], lines = wrapText(t.title, big ? 24 : 20).slice(0, 2), w = big ? 230 : 190, h = 28 + lines.length * 17, dn = S.done[t.id];
    g += `<g class="rn mm-node" data-open2="${t.id}" tabindex="0" role="button" aria-label="${esc(t.title)}" style="--i:${i}"><rect x="${(x - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w}" height="${h}" rx="14" style="${dn ? `stroke:${col}` : ''}"/>
      <circle cx="${(x - w / 2 + 2).toFixed(1)}" cy="${(y - h / 2 + 2).toFixed(1)}" r="11" style="fill:${dn ? cssv('--good') || col : col}"/><text x="${(x - w / 2 + 2).toFixed(1)}" y="${(y - h / 2 + 6).toFixed(1)}" text-anchor="middle" style="fill:#fff;font:800 11px var(--font)">${dn ? '✓' : i + 1}</text>
      ${lines.map((l, j) => `<text x="${x.toFixed(1)}" y="${(y - (lines.length - 1) * 8.5 + j * 17 + 5).toFixed(1)}" text-anchor="middle" style="fill:var(--ink);font:700 13px var(--font)">${esc(l)}</text>`).join('')}</g>`;
  });
  const tl = wrapText(s.title, 16).slice(0, 3);
  g += `<circle class="halo" cx="${cx}" cy="${cy}" r="${big ? 64 : 78}" style="fill:${col};opacity:.4"/><circle class="mm-center" cx="${cx}" cy="${cy}" r="${big ? 64 : 78}" style="fill:${col}"/>${tl.map((l, j) => `<text x="${cx}" y="${cy - (tl.length - 1) * 10 + j * 20 + 6}" text-anchor="middle" style="fill:#fff;font:800 16px var(--font)">${esc(l)}</text>`).join('')}`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(s.title)}">${g}</svg>`;
}

// ---------- living diagrams: play entrance animation when first seen ----------
const playIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('play'); playIO.unobserve(e.target); } }), { threshold: .2 }) : null;
function observePlay(root) { if (!playIO) return; $$('.viz, .mm-wrap, .rmap, .illus, .tl-axis', root).forEach(el => playIO.observe(el)); }
document.addEventListener('click', e => { const b = e.target.closest('[data-replay]'); if (!b) return; const v = b.closest('.viz'); v.classList.remove('play'); void v.offsetWidth; v.classList.add('play'); });

// ---------- story mode ----------
let story = null;
function playStory(t, playlist) {
  if (!t) return;
  closeStory();
  const list = playlist || TOPICS;
  const sc = stageColor(t.si), slides = [];
  const auto = [];
  slides.push(`<div class="sl"><div class="sl-kicker">${T('Stage {0}', t.si + 1)} · ${esc(t.stage.title)}</div><div class="sl-icon">${ic(t.icon)}</div><h2>${esc(t.title)}</h2><p>${esc(t.hook)}</p></div>`); auto.push(6);
  slides.push(`<div class="sl"><div class="sl-kicker">${T('The answer in 30 seconds')}</div><p style="font-size:clamp(1.15rem,3vw,1.5rem)">${esc(t.tldr)}</p><div class="sl-big">${ic('bulb')}${esc(t.big_idea)}</div></div>`); auto.push(Math.min(16, 5 + t.tldr.split(' ').length * .28));
  t.points.forEach((p, i) => { slides.push(`<div class="sl"><div class="sl-num">${i + 1} / ${t.points.length}</div><div class="sl-icon">${ic(p.icon)}</div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><div class="vs" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">${vchips(p.verses)}</div></div>`); auto.push(Math.min(14, 4 + p.text.split(' ').length * .25)); });
  if (t.visuals[0]) { slides.push(`<div class="sl sl-light">${viz(t.visuals[0], 0)}</div>`); auto.push(0); }
  if (t.mythfact[0]) { slides.push(`<div class="sl"><div class="sl-kicker">${T('Myth or fact?')}</div><div class="sl-light" style="width:min(420px,100%)"><div class="flips">${flips([t.mythfact[0]])}</div></div></div>`); auto.push(0); }
  if (t.quiz[0]) { slides.push(`<div class="sl"><div class="sl-kicker">${T('Check yourself')}</div><div class="sl-light">${qcard(t.quiz[0], 0, (S.quiz[t.id] || {})[0])}</div></div>`); auto.push(0); }
  const nx = list[list.indexOf(t) + 1];
  slides.push(`<div class="sl"><div class="sl-icon">${ic('check')}</div><h3>${T('Story complete')}</h3><p>${T('Open the full topic for the diagrams, every section, the objections and the original text.')}</p><div class="st-foot"><button class="btn primary" data-act="open">${ic('book')}${T('Open full topic')}</button>${nx ? `<button class="btn" data-act="next">${ic('arrow')}${T('Next story: {0}', esc(nx.title))}</button>` : ''}</div></div>`); auto.push(0);
  const el = document.createElement('div'); el.className = 'story'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', t.title); el.style.setProperty('--stage', sc);
  el.innerHTML = `<canvas aria-hidden="true"></canvas><div class="st-top"><div class="st-bars">${slides.map(() => '<i><b></b></i>').join('')}</div><div class="st-head"><span class="t">${esc(t.title)}</span><span class="bts"><button class="st-btn" data-act="pause" aria-label="${esc(T('Pause'))}">II</button><button class="st-btn" data-act="close" aria-label="${esc(T('Close'))}">✕</button></span></div></div>
    <div class="st-stage"><button class="st-zone l" aria-label="${esc(T('Previous'))}"></button><div class="st-slot" style="width:100%;display:grid;place-items:center;max-height:100%"></div><button class="st-zone r" aria-label="${esc(T('Next'))}"></button></div>
    <div class="st-foot"><button class="btn" data-act="prev">← ${T('Back')}</button><button class="btn primary" data-act="fwd">${T('Next')} →</button></div>`;
  document.body.appendChild(el); document.body.classList.add('story-open');
  const net = neural($('canvas', el), { max: 50 });
  story = { el, i: 0, slides, auto, paused: false, t0: 0, raf: null, t, net, list };
  const bars = $$('.st-bars i b', el);
  const go2 = i => {
    if (i < 0) i = 0; if (i >= slides.length) { closeStory(); return; }
    story.i = i; story.t0 = performance.now();
    bars.forEach((b, k) => b.style.width = k < i ? '100%' : '0%');
    const slot = $('.st-slot', el); slot.innerHTML = slides[i];
    const v = $('.viz', slot); if (v) { bindViz(slot, [t.visuals[0]]); v.classList.add('play'); }
    bindFlips(slot); bindQuiz(slot, t); countUp(slot);
    $$('[data-act="open"]', slot).forEach(b => b.onclick = () => { closeStory(); openTopic(t.id); });
    $$('[data-act="next"]', slot).forEach(b => b.onclick = () => playStory(nx, list));
    if (i === slides.length - 1 && !S.seen[t.id]) { S.seen[t.id] = 1; save(); addXP(5); }
  };
  const tick = now => {
    if (!story || story.el !== el) return;
    const dur = story.auto[story.i] * 1000;
    if (dur && !story.paused && !REDUCE) { const p = Math.min(1, (now - story.t0) / dur); bars[story.i].style.width = (p * 100) + '%'; if (p >= 1) go2(story.i + 1); }
    else if (!dur) bars[story.i].style.width = '100%';
    story.raf = requestAnimationFrame(tick);
  };
  el.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); const z = e.target.closest('.st-zone');
    if (z) { go2(story.i + (z.classList.contains('r') ? 1 : -1)); return; }
    if (!a) return;
    const act = a.dataset.act;
    if (act === 'close') closeStory();
    if (act === 'pause') { story.paused = !story.paused; a.textContent = story.paused ? '▶' : 'II'; if (!story.paused) story.t0 = performance.now() - (parseFloat(bars[story.i].style.width) || 0) / 100 * story.auto[story.i] * 1000; }
    if (act === 'prev') go2(story.i - 1);
    if (act === 'fwd') go2(story.i + 1);
  });
  let sx = null; el.addEventListener('pointerdown', e => { sx = e.clientX; }); el.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 60 && !e.target.closest('.flip,.opt,button')) go2(story.i + (e.clientX < sx ? 1 : -1)); sx = null; });
  go2(0); story.raf = requestAnimationFrame(tick);
  setTimeout(() => $('[data-act="fwd"]', el).focus({ preventScroll: true }), 50);
}
function closeStory() { if (!story) return; cancelAnimationFrame(story.raf); story.el.remove(); story = null; document.body.classList.remove('story-open'); }
addEventListener('keydown', e => { if (!story) return; if (e.key === 'Escape') closeStory(); if (e.key === 'ArrowRight') $('[data-act="fwd"]', story.el).click(); if (e.key === 'ArrowLeft') $('[data-act="prev"]', story.el).click(); if (e.key === ' ') { e.preventDefault(); $('[data-act="pause"]', story.el).click(); } });

// ---------- word detective ----------
let quizTab = 'rounds';
const DETECTIVE = [
  ...['Deuteronomy 32:22', 'Job 26:6', 'Psalm 9:17', 'Psalm 16:10', 'Psalm 139:8', 'Proverbs 9:18', 'Isaiah 14:9', 'Jonah 2:2'].map(r => [r, 'Sheol']),
  ...['Matthew 11:23', 'Matthew 16:18', 'Luke 10:15', 'Luke 16:23', 'Acts 2:27', 'Acts 2:31', 'Revelation 1:18', 'Revelation 6:8', 'Revelation 20:13', 'Revelation 20:14'].map(r => [r, 'Hades']),
  ...['Matthew 5:22', 'Matthew 5:29', 'Matthew 5:30', 'Matthew 10:28', 'Matthew 18:9', 'Matthew 23:15', 'Matthew 23:33', 'Mark 9:43', 'Mark 9:45', 'Mark 9:47', 'Luke 12:5', 'James 3:6'].map(r => [r, 'Gehenna']),
  ['2 Peter 2:4', 'Tartarus'],
];
const WORDINFO = {
  Sheol: ['Hebrew', 'The Hebrew word for the grave, the realm of all the dead, good and bad alike. The King James Version renders it "hell" 31 times and "grave" 31 times.'],
  Hades: ['Greek', 'The Greek name for the realm of the dead, used by the Septuagint to translate Sheol. The King James Version renders it "hell" 10 times.'],
  Gehenna: ['Greek from Hebrew', 'The Valley of Hinnom outside Jerusalem, a real place of shame that Jesus used as an image of judgment. It appears 12 times in the New Testament.'],
  Tartarus: ['Greek', 'In Greek thought the deepest prison. Used once, as a verb, in 2 Peter 2:4 for the angels who sinned.'],
};
let det = null;
function renderDetective(box) {
  det = { qs: DETECTIVE.slice().sort(() => Math.random() - .5).slice(0, 10), i: 0, right: 0, res: [] };
  stepDetective(box);
}
function stepDetective(box) {
  const meter = `<div class="gd-meter">${det.qs.map((_, k) => `<i class="${det.res[k] === true ? 'ok' : det.res[k] === false ? 'no' : k === det.i ? 'cur' : ''}"></i>`).join('')}</div>`;
  if (det.i >= det.qs.length) {
    box.innerHTML = `<div class="gd">${meter}<div class="gd-card"><div class="prompt">${T('Round complete')}</div><div class="ref">${det.right} / ${det.qs.length}</div><div class="prompt">${T('In every one of these verses the King James Version prints the single word "hell".')}</div></div><button class="btn primary" id="gdAgain" style="justify-self:center">${ic('wave')}${T('Play again')}</button></div>`;
    $('#gdAgain').onclick = () => renderDetective(box); return;
  }
  const [ref, ans] = det.qs[det.i];
  box.innerHTML = `<div class="gd">${meter}<div class="gd-card"><div class="prompt">${T('Verse {0} of {1}', det.i + 1, det.qs.length)}</div><div class="ref">${esc(vr(ref))}</div><div class="prompt">${T('English Bibles (KJV) say "hell" here. Which original word is behind it?')}</div></div>
    <div class="gd-opts">${Object.keys(WORDINFO).map(w => `<button class="gd-opt" data-w="${w}">${w}<small>${T(WORDINFO[w][0])}</small></button>`).join('')}</div><div id="gdWhy"></div></div>`;
  $$('.gd-opt', box).forEach(b => b.onclick = () => {
    const ok = b.dataset.w === ans; det.res[det.i] = ok; if (ok) { det.right++; addXP(3, b); }
    $$('.gd-opt', box).forEach(x => { x.disabled = true; if (x.dataset.w === ans) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
    $('#gdWhy').innerHTML = `<div class="gd-why"><b>${ok ? T('Correct!') : T('Not quite.')} ${esc(vr(ref))} → ${ans}.</b> ${T(WORDINFO[ans][1])}</div><div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap"><button class="btn primary" id="gdNext">${det.i + 1 < det.qs.length ? T('Next question') : T('See result')}</button><button class="btn" data-verse="${esc(ref)}">${ic('scroll')}${T('Where is it discussed?')}</button></div>`;
    $('#gdNext').onclick = () => { det.i++; stepDetective(box); };
  });
}
function renderQuiz() {
  if (quizTab === 'detective') {
    $('#v-quiz').innerHTML = `${quizTabs()}<div class="section-head" style="margin-top:0"><div><h2>${T('Word Detective')}</h2><p>${T('Ten verses where English Bibles say "hell". Spot the original word: Sheol, Hades, Gehenna or Tartarus.')}</p></div></div><div id="gdBox"></div>`;
    bindQuizTabs(); renderDetective($('#gdBox')); return;
  }
  renderQuizRounds();
  $('#v-quiz').insertAdjacentHTML('afterbegin', quizTabs()); bindQuizTabs();
}
function quizTabs() { return `<div class="maptabs">${[['rounds', 'Quiz rounds', 'puzzle'], ['detective', 'Word Detective', 'eye']].map(([id, l, i]) => `<button class="chip" data-qtab="${id}" aria-pressed="${quizTab === id}">${ic(i)}${T(l)}</button>`).join('')}</div>`; }
function bindQuizTabs() { $$('#v-quiz [data-qtab]').forEach(b => b.onclick = () => { quizTab = b.dataset.qtab; renderQuiz(); }); }
