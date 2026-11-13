/* sayohatga — motion engine. Hand-written, no libraries.
   One rAF scroll bus, springs, reveals, odometers, liquid nav, gestures.
   Tiers: full (default) · lite (weak phones / data saver) · none (reduced motion). */
(() => {
'use strict';
const doc = document.documentElement;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav_ = navigator, conn = nav_.connection || {};
const LITE = !RM && ((nav_.deviceMemory && nav_.deviceMemory <= 2) || (nav_.hardwareConcurrency && nav_.hardwareConcurrency <= 4) || conn.saveData);
const TIER = RM ? 'none' : LITE ? 'lite' : 'full';
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
doc.dataset.motion = TIER;
const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const buzz = ms => { try { if (TIER !== 'none' && nav_.vibrate) nav_.vibrate(ms); } catch (_) {} };

/* ---------- easing + tween + spring ---------- */
const ease = {
  out: t => 1 - Math.pow(1 - t, 4),
  expo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
};
function tween(dur, fn, e = ease.out){
  return new Promise(res => {
    if (TIER === 'none' || dur <= 0) { fn(1); res(); return; }
    const t0 = performance.now();
    const step = now => { const t = clamp((now - t0) / dur, 0, 1); fn(e(t)); t < 1 ? requestAnimationFrame(step) : res(); };
    requestAnimationFrame(step);
  });
}
/* damped spring toward target; calls set(x) each frame */
function spring(state, target, set, k = 210, c = 24){
  state.target = target;
  if (TIER === 'none') { state.x = target; state.v = 0; set(target); return; }
  if (state.running) return;
  state.running = true; let last = performance.now();
  const step = now => {
    const dt = Math.min(.032, (now - last) / 1000); last = now;
    const a = k * (state.target - state.x) - c * state.v;
    state.v += a * dt; state.x += state.v * dt; set(state.x);
    if (Math.abs(state.v) < .02 && Math.abs(state.target - state.x) < .05) { state.x = state.target; set(state.x); state.running = false; return; }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- one scroll bus for everything ---------- */
const subs = new Set(); let sy = scrollY, queued = false;
const frame = () => { queued = false; sy = scrollY; subs.forEach(f => f(sy)); };
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(frame); } }, {passive:true});
addEventListener('resize', () => requestAnimationFrame(frame), {passive:true});

/* ---------- living sky: real Tashkent time ---------- */
const HELLO = {dawn:'Xayrli tong', day:'Xayrli kun', dusk:'Xayrli kech', night:'Xayrli tun'};
function tod(){
  let h = 12;
  try { h = +new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Tashkent', hour:'numeric', hourCycle:'h23'}).format(new Date()); } catch (_) {}
  const t = h >= 5 && h < 9 ? 'dawn' : h >= 9 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'dusk' : 'night';
  if (doc.dataset.tod !== t) { doc.dataset.tod = t; qa('[data-hello]').forEach(el => el.textContent = HELLO[t]); }
}
tod(); setInterval(tod, 5 * 60 * 1000);

/* ---------- hero: depth parallax (scroll + pointer) ---------- */
function wireScene(scene){
  if (!scene || scene.dataset.wired) return; scene.dataset.wired = '1';
  qa('[data-hello]', scene).forEach(el => el.textContent = HELLO[doc.dataset.tod]);
  if (TIER !== 'full') return;
  const layers = qa('[data-depth]', scene).map(el => ({el, d:+el.dataset.depth}));
  const word = q('.pk-word', scene), plate = q('.pk-copy', scene);
  let px = 0, py = 0, tx = 0, ty = 0, raf = 0, h = scene.offsetHeight || 600;
  const paint = () => {
    raf = 0; px += (tx - px) * .08; py += (ty - py) * .08;
    const s = Math.min(sy, h);
    layers.forEach(({el, d}) => { el.style.transform = `translate3d(${(px * d * 22).toFixed(2)}px,${(s * d * .55 + py * d * 10).toFixed(2)}px,0)`; });
    if (word) word.style.transform = `translate3d(0,${(s * -.18).toFixed(1)}px,0)`;
    if (plate) plate.style.opacity = (1 - clamp(s / (h * .7), 0, 1) * .85).toFixed(3);
    if (Math.abs(tx - px) > .002 || Math.abs(ty - py) > .002) raf = requestAnimationFrame(paint);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(paint); };
  subs.add(y => { if (y < h + 40 && scene.offsetParent) kick(); });
  addEventListener('resize', () => { h = scene.offsetHeight || h; }, {passive:true});
  if (FINE) scene.addEventListener('pointermove', e => { const r = scene.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; kick(); });
  if (FINE) scene.addEventListener('pointerleave', () => { tx = ty = 0; kick(); });
  kick();
}
/* wordmark + copy entrance, played once the splash is gone */
function intro(scene){
  if (!scene || scene.classList.contains('lift')) return;
  requestAnimationFrame(() => scene.classList.add('lift'));
}

/* ---------- search: cycling destinations behind the input ---------- */
function wireSearch(){
  const inp = q('#q'), lay = q('#qCycle'); if (!inp || !lay || lay.dataset.wired) return; lay.dataset.wired = '1';
  const words = () => { const s = (window.__places && window.__places()) || []; return (s.length ? s : ['Chimyon', 'Zomin', 'Beldersoy', 'Chorvoq', 'Arslonbob']).slice(0, 8); };
  const sync = () => lay.classList.toggle('off', !!inp.value || document.activeElement === inp);
  ['input', 'focus', 'blur'].forEach(ev => inp.addEventListener(ev, sync)); sync();
  const slot = q('.qw', lay); let i = 0;
  const next = () => {
    const w = words(); if (!w.length || !slot) return; i = (i + 1) % w.length;
    if (TIER === 'none') { slot.textContent = w[i]; return; }
    slot.animate([{transform:'translateY(0)', opacity:1}, {transform:'translateY(-90%)', opacity:0}], {duration:260, easing:'cubic-bezier(.5,0,.75,0)'}).onfinish = () => {
      slot.textContent = w[i];
      slot.animate([{transform:'translateY(90%)', opacity:0}, {transform:'translateY(0)', opacity:1}], {duration:420, easing:'cubic-bezier(.16,1,.3,1)'});
    };
  };
  if (slot) slot.textContent = words()[0];
  setInterval(() => { if (!lay.classList.contains('off') && !document.hidden) next(); }, 2600);
}

/* ---------- altitude gauge: scroll = ascent to 3309 m ---------- */
function wireGauge(){
  const g = q('#altg'); if (!g) return;
  const val = q('.alt-v', g), bar = q('.alt-fill', g), pin = q('.alt-pin', g); let lastM = -1;
  subs.add(y => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const live = max > 240 && !document.body.classList.contains('booting');
    g.classList.toggle('on', live && y > 40);
    if (!live) return;
    const p = clamp(y / max, 0, 1), m = Math.round(p * 3309 / 10) * 10;
    bar.style.transform = `scaleY(${p.toFixed(4)})`; g.style.setProperty('--p', p.toFixed(4));
    if (pin) pin.style.transform = `translateY(${(p * 100).toFixed(2)}%)`;
    if (m !== lastM) { lastM = m; val.textContent = m.toLocaleString('ru-RU').replace(/\s/g, ' '); }
  });
}

/* ---------- reveals: one observer, staggered, re-armed for new content ---------- */
const REVEAL = '.card, .post, .g, .ticket, .mytour, .sec, .scene-empty, .rail, .kv, .needs, .gcard, .prow, .filters, .viewsw, .dprice, .ddesc, .cmt, .grid3 .cell, .ustats, .skel';
const io = new IntersectionObserver(es => {
  const batch = es.filter(e => e.isIntersecting).map(e => e.target).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left);
  batch.forEach((el, i) => { el.style.setProperty('--rv', Math.min(i, 6) * 70 + 'ms'); el.classList.add('seen'); io.unobserve(el); onSeen(el); });
}, {threshold:.08, rootMargin:'0px 0px -6% 0px'});
function arm(root){
  if (!root || !root.querySelectorAll) return;
  const list = (root.matches && root.matches(REVEAL) ? [root] : []).concat(qa(REVEAL, root));
  list.forEach(el => { if (el.dataset.arm) return; el.dataset.arm = '1'; if (TIER === 'none') { el.classList.add('seen'); onSeen(el); } else io.observe(el); });
  qa('.dtitle:not([data-split])', root).forEach(splitWords);
  qa('[data-dep]:not([data-cd])', root).forEach(countdown);
  qa('.card .photo', root).forEach(hold);
}
function onSeen(el){
  qa('.price, .ostats b, .ustats b', el).forEach(odometer);
}

/* ---------- odometer: digits roll into place ---------- */
function odometer(el){
  if (!el || el.dataset.od || TIER === 'none') return;
  const node = [...el.childNodes].find(n => n.nodeType === 3 && /\d/.test(n.nodeValue)); if (!node) return;
  el.dataset.od = '1'; const txt = node.nodeValue, wrap = document.createElement('span');
  wrap.className = 'od'; wrap.setAttribute('aria-label', txt.trim());
  let k = 0;
  wrap.innerHTML = [...txt].map(ch => /\d/.test(ch) ? `<span class="odc" aria-hidden="true" style="--d:${+ch};--k:${k++}"><span>0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9</span></span>` : `<span aria-hidden="true">${ch === ' ' ? '&nbsp;' : ch.replace(/[<&]/g, '')}</span>`).join('');
  node.replaceWith(wrap);
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('rolled')));
}
/* little bump for numbers that change in place (seat stepper, totals) */
function bumpOnChange(el){
  if (!el || el.dataset.bump) return; el.dataset.bump = '1';
  new MutationObserver(() => { if (TIER !== 'none') el.animate([{transform:'translateY(55%)', opacity:0, filter:'blur(2px)'}, {transform:'none', opacity:1, filter:'none'}], {duration:320, easing:'cubic-bezier(.16,1,.3,1)'}); }).observe(el, {childList:true, characterData:true, subtree:true});
}

/* ---------- titles: words rise from a mask ---------- */
function splitWords(el){
  el.dataset.split = '1'; if (TIER === 'none') return;
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute('aria-label', el.textContent.trim());
  el.innerHTML = words.map((w, i) => `<span class="wd" aria-hidden="true"><span style="--i:${i}">${w.replace(/[<&]/g, c => c === '<' ? '&lt;' : '&amp;')}</span></span>`).join(' ');
}

/* ---------- press & hold a trip photo: slow Ken Burns drift ---------- */
function hold(ph){
  if (ph.dataset.hold) return; ph.dataset.hold = '1';
  let t = 0; const on = () => { t = setTimeout(() => ph.classList.add('hold'), 180); }, off = () => { clearTimeout(t); ph.classList.remove('hold'); };
  ph.addEventListener('pointerdown', on); ['pointerup', 'pointercancel', 'pointerleave'].forEach(e => ph.addEventListener(e, off));
}

/* ---------- countdown on tickets (flip digits) ---------- */
const cds = new Set();
function countdown(el){
  el.dataset.cd = '1'; cds.add(el); paintCd(el);
}
function paintCd(el){
  if (!el.isConnected) { cds.delete(el); return; }
  const ms = new Date(el.dataset.dep).getTime() - Date.now();
  if (!(ms > 0)) { el.hidden = true; return; }
  el.hidden = false;
  const d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
  [['d', d], ['h', h], ['m', m]].forEach(([k, v]) => {
    const c = q(`[data-u="${k}"]`, el); if (!c) return; const s = String(v).padStart(2, '0');
    if (c.textContent !== s) { if (c.textContent && TIER !== 'none') c.animate([{transform:'rotateX(-90deg)', opacity:.2}, {transform:'rotateX(0)', opacity:1}], {duration:420, easing:'cubic-bezier(.16,1,.3,1)'}); c.textContent = s; }
  });
}
setInterval(() => cds.forEach(paintCd), 15000);

/* ---------- liquid trail marker in the bottom bar / rail ---------- */
function wireNav(){
  const bar = q('.pill-nav'); if (!bar || q('.navmark', bar)) return;
  const mk = document.createElement('i'); mk.className = 'navmark'; mk.setAttribute('aria-hidden', 'true'); bar.appendChild(mk);
  const A = {x:0, v:0}, B = {x:0, v:0}; let vertical = false, first = true;
  const paint = () => {
    const a = Math.min(A.x, B.x), b = Math.max(A.x, B.x);
    mk.style.transform = vertical ? `translate3d(0,${a}px,0)` : `translate3d(${a}px,0,0)`;
    mk.style[vertical ? 'height' : 'width'] = Math.max(6, b - a) + 'px';
    mk.style[vertical ? 'width' : 'height'] = '';
  };
  const place = () => {
    const btn = q('[data-v][aria-current="page"]', bar); mk.style.opacity = btn ? 1 : 0; if (!btn) return;
    vertical = getComputedStyle(bar).flexDirection === 'column'; mk.classList.toggle('v', vertical);
    const br = bar.getBoundingClientRect(), r = btn.getBoundingClientRect();
    const size = 26, s0 = vertical ? r.top - br.top + (r.height - size) / 2 : r.left - br.left + (r.width - size) / 2, s1 = s0 + size;
    if (first || TIER === 'none') { first = false; A.x = s0; B.x = s1; A.v = B.v = 0; paint(); return; }
    const goingFwd = s0 > Math.min(A.x, B.x);
    spring(goingFwd ? B : A, goingFwd ? s1 : s0, paint, 260, 26);   /* leading edge: quick */
    spring(goingFwd ? A : B, goingFwd ? s0 : s1, paint, 120, 20);   /* trailing edge: lags — the stretch */
  };
  new MutationObserver(place).observe(bar, {subtree:true, attributes:true, attributeFilter:['aria-current']});
  addEventListener('resize', () => { first = true; place(); }, {passive:true});
  requestAnimationFrame(place);
}

/* ---------- magnetic pull (desktop) ---------- */
function magnet(el){
  if (!FINE || TIER !== 'full' || !el || el.dataset.mag) return; el.dataset.mag = '1';
  el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 8}px,${((e.clientY - r.top) / r.height - .5) * 6}px)`; });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
}

/* ---------- heart burst particles + haptics ---------- */
function particles(host){
  if (TIER !== 'full') return;
  const n = 9;
  for (let i = 0; i < n; i++){
    const p = document.createElement('i'); p.className = 'spark';
    const a = (i / n) * Math.PI * 2 + Math.random() * .4, d = 70 + Math.random() * 50;
    p.style.setProperty('--x', Math.cos(a) * d + 'px'); p.style.setProperty('--y', Math.sin(a) * d + 'px'); p.style.setProperty('--s', (.5 + Math.random() * .7).toFixed(2));
    host.appendChild(p); setTimeout(() => p.remove(), 900);
  }
}

/* ---------- lightbox: drag down to dismiss ---------- */
function wireLightbox(lb){
  if (!lb || lb.dataset.drag || lb.hidden) return; const sc = q('.lbs', lb); if (!sc) return; lb.dataset.drag = '1';
  let y0 = 0, x0 = 0, dy = 0, mode = '', id = null;
  sc.addEventListener('pointerdown', e => { id = e.pointerId; y0 = e.clientY; x0 = e.clientX; dy = 0; mode = ''; });
  sc.addEventListener('pointermove', e => {
    if (e.pointerId !== id) return; const ddx = e.clientX - x0, ddy = e.clientY - y0;
    if (!mode && Math.hypot(ddx, ddy) > 10) mode = Math.abs(ddy) > Math.abs(ddx) * 1.2 ? 'v' : 'h';
    if (mode !== 'v') return; dy = ddy; const k = clamp(Math.abs(dy) / 400, 0, 1);
    sc.style.transform = `translate3d(0,${dy}px,0) scale(${1 - k * .12})`; lb.style.backgroundColor = `rgba(5,8,6,${1 - k * .85})`;
  });
  const end = () => {
    if (mode !== 'v') { mode = ''; return; } mode = '';
    if (Math.abs(dy) > 120) { const dir = Math.sign(dy); tween(220, t => { sc.style.transform = `translate3d(0,${dy + dir * 300 * t}px,0) scale(${.9 - t * .1})`; lb.style.opacity = 1 - t; }).then(() => { sc.style.transform = ''; lb.style.opacity = ''; lb.style.backgroundColor = ''; delete lb.dataset.drag; if (window.closeLightbox) window.closeLightbox(); }); }
    else { const from = dy, st = {x:from, v:0}; spring(st, 0, x => { sc.style.transform = `translate3d(0,${x}px,0) scale(${1 - clamp(Math.abs(x) / 400, 0, 1) * .12})`; lb.style.backgroundColor = `rgba(5,8,6,${1 - clamp(Math.abs(x) / 400, 0, 1) * .85})`; }, 300, 28); }
    dy = 0;
  };
  sc.addEventListener('pointerup', end); sc.addEventListener('pointercancel', end);
}

/* ---------- bottom sheets: drag the handle down to close ---------- */
function wireSheet(sh){
  if (!sh || sh.dataset.drag || sh.id === 'roll') return; sh.dataset.drag = '1';
  let y0 = 0, dy = 0, on = false, t0 = 0;
  const start = e => { if (matchMedia('(min-width: 1024px)').matches) return; const r = sh.getBoundingClientRect(); if (e.clientY - r.top > 64 || sh.scrollTop > 0 || e.target.closest('input,textarea,select,button,a')) return; on = true; y0 = e.clientY; dy = 0; t0 = performance.now(); sh.setPointerCapture(e.pointerId); sh.style.transition = 'none'; };
  sh.addEventListener('pointerdown', start);
  sh.addEventListener('pointermove', e => { if (!on) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translate3d(0,${dy}px,0)`; });
  const end = () => { if (!on) return; on = false; const v = dy / Math.max(1, performance.now() - t0);
    if (dy > 110 || v > .7) { tween(200, t => { sh.style.transform = `translate3d(0,${dy + (innerHeight - dy) * t}px,0)`; }).then(() => { sh.style.transform = ''; sh.style.transition = ''; if (window.closeSheet) window.closeSheet(); }); }
    else { const st = {x:dy, v:0}; spring(st, 0, x => { sh.style.transform = `translate3d(0,${x}px,0)`; }, 320, 28); setTimeout(() => { sh.style.transition = ''; }, 500); } };
  sh.addEventListener('pointerup', end); sh.addEventListener('pointercancel', end);
}

/* ---------- FLIP: list items glide to their new places after filtering ---------- */
function flip(container, render){
  if (!container || TIER === 'none') { render(); return; }
  const key = el => el.dataset.open || el.id;
  const before = new Map(qa(':scope > [data-open]', container).map(el => [key(el), el.getBoundingClientRect()]));
  render();
  qa(':scope > [data-open]', container).forEach((el, i) => {
    const b = before.get(key(el)), a = el.getBoundingClientRect();
    el.classList.add('seen'); el.dataset.arm = '1';
    if (b) { const dx = b.left - a.left, dy = b.top - a.top; if (dx || dy) el.animate([{transform:`translate(${dx}px,${dy}px)`}, {transform:'none'}], {duration:520, easing:'cubic-bezier(.16,1,.3,1)'}); }
    else el.animate([{opacity:0, transform:'translateY(18px) scale(.98)'}, {opacity:1, transform:'none'}], {duration:480, delay:i * 40, easing:'cubic-bezier(.16,1,.3,1)', fill:'backwards'});
  });
}

/* ---------- ticket tears away on cancel ---------- */
function tear(el){
  if (!el || TIER === 'none') return Promise.resolve();
  el.classList.add('tearing'); buzz(12);
  return new Promise(r => setTimeout(r, 620));
}

/* ---------- code cells on sign-up ---------- */
function wireCode(){
  const inp = q('#aCode'), box = q('#cells'); if (!inp || !box || box.dataset.wired) return; box.dataset.wired = '1';
  const cells = qa('.c', box);
  const paint = () => { const v = inp.value.replace(/\D/g, '').slice(0, 4); if (inp.value !== v) inp.value = v; cells.forEach((c, i) => { const was = c.textContent; c.textContent = v[i] || ''; c.classList.toggle('f', !!v[i]); c.classList.toggle('cur', i === Math.min(v.length, 3) && document.activeElement === inp); if (v[i] && !was && TIER !== 'none') c.animate([{transform:'scale(.82)'}, {transform:'scale(1.06)'}, {transform:'scale(1)'}], {duration:280, easing:'ease-out'}); }); box.classList.remove('no'); };
  ['input', 'focus', 'blur'].forEach(ev => inp.addEventListener(ev, paint)); paint();
  const err = q('#aErr2'); if (err) new MutationObserver(() => { if (!err.hidden) { box.classList.remove('no'); void box.offsetWidth; box.classList.add('no'); buzz([10, 40, 10]); } }).observe(err, {attributes:true, attributeFilter:['hidden']});
}

/* ---------- watch the DOM: arm anything new ---------- */
let pend = new Set(), sched = false;
new MutationObserver(ms => {
  ms.forEach(m => {
    m.addedNodes.forEach(n => { if (n.nodeType === 1) pend.add(n); });
    if (m.type === 'attributes') {
      const t = m.target;
      if (t.classList && t.classList.contains('burst') && t.classList.contains('go')) { particles(t.parentElement); buzz(15); }
      if (t.id === 'lightbox' && !t.hidden) setTimeout(() => wireLightbox(t), 30);
      if (t.classList && t.classList.contains('sheet') && !t.hidden) wireSheet(t);
      if (t === document.body && !t.classList.contains('booting')) intro(q('.peak'));
      if (t.id === 'auth' && !t.hidden) { intro(q('.auth-art')); wireScene(q('.auth-art')); wireCode(); }
    }
  });
  if (!sched) { sched = true; requestAnimationFrame(() => { sched = false; pend.forEach(arm); pend.clear(); }); }
}).observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class', 'hidden']});

/* ---------- boot ---------- */
function init(){
  wireScene(q('.peak')); wireSearch(); wireGauge(); wireNav(); wireCode();
  magnet(q('.peak .go')); magnet(q('#plus'));
  bumpOnChange(q('#qVal')); qa('.sheet').forEach(s => { if (!s.hidden) wireSheet(s); });
  arm(document.body); frame();
  if (!document.body.classList.contains('booting')) intro(q('.peak'));
  const au = q('#auth'); if (au && !au.hidden) { intro(q('.auth-art')); wireScene(q('.auth-art')); }
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

window.Motion = {tier:TIER, tween, spring, flip, tear, odometer, buzz, arm};
})();
