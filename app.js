/* sayohatga — Supabase bilan ishlaydigan versiya */
const SB_URL = 'https://idfkofehlsqvynoivadk.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZmtvZmVobHNxdnlub2l2YWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzMjcyMDQsImV4cCI6MjEwOTkwMzIwNH0.HyjnjKLvdzeEpDSAeYpJmdYdBfgNY_j6fyKw34MeasQ';
const BOT = 'https://t.me/sayohatga_uz_bot?start=kod';
const sb = window.supabase.createClient(SB_URL, SB_KEY, {auth:{persistSession:true, autoRefreshToken:true, storageKey:'sayohatga-auth'}});
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
document.documentElement.classList.add('anim');
const SITE = location.origin + location.pathname;
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ' + I18N.cur();
/* "2026-11-18" -> "18 noyabr" / "18 ноября" / "18 November" */
const dLong = d => { if (!d) return ''; const [, m, day] = d.split('-'); return `${+day} ${I18N.months()[+m - 1]}`; };
const dShort = dLong;
const ago = ts => { const s = (Date.now() - ts) / 1000; if (s < 60) return I18N.ago(0, 'now'); if (s < 3600) return I18N.ago(Math.floor(s / 60), 'm'); if (s < 86400) return I18N.ago(Math.floor(s / 3600), 'h'); return I18N.ago(Math.floor(s / 86400), 'd'); };
const isVideo = u => /\.(mp4|mov|webm|m4v)(\?|$)/i.test(String(u || ''));
const initials = n => String(n || '?').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
const logoPh = (cls = '') => `<div class="logoph ${cls}"><span>sayohat<b>ga</b></span></div>`;
const TZF = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Tashkent', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'});
const tz = iso => { const p = Object.fromEntries(TZF.formatToParts(new Date(iso)).map(x => [x.type, x.value])); return {d:`${p.year}-${p.month}-${p.day}`, t:`${p.hour}:${p.minute}`}; };
const COLS = ['#46C98B','#9FD4FF','#F2A65A','#FF8A7A','#C4A6FF','#FFC65C','#7FE3D0'];
const colFor = id => COLS[[...String(id)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % COLS.length];
const camIc = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
const cardIc = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></svg>';
const heartIc = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
const bigHeart = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:100%;height:100%"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
const cmtIc = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>';
const sendIc = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M21 3 3 10l7 3 3 7z"/><path d="M10 13l11-10"/></svg>';
const trashIc = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
const playIc = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>';
let tt; function toast(m){ $('#toastTxt').textContent = m; $('#toast').hidden = false; clearTimeout(tt); tt = setTimeout(() => $('#toast').hidden = true, 2600); }
const fail = (e, msg) => { console.error(e); toast(msg || (navigator.onLine ? 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.' : 'Internet aloqasi yo\'q.')); };
/* ---------- state (server data cached in memory) ---------- */
let S = {user:null, profiles:{}, tours:[], rentals:[], posts:[], likes:[], comments:{}, cart:[], loaded:false};
try { S.cart = JSON.parse(localStorage.getItem('sayohatga-cart') || '[]'); } catch (_) {}
const saveCart = () => { try { localStorage.setItem('sayohatga-cart', JSON.stringify(S.cart)); } catch (_) {} };
const isMine = o => !!(S.user && (o.ownerId || o.uid) === S.user.id);
function person(id){
const p = S.profiles[id];
if (!p) return {name:'Foydalanuvchi', col:colFor(id), avatar:null};
return {name:`${p.first_name} ${p.last_name === '-' ? '' : p.last_name}`.trim(), col:colFor(id), avatar:p.avatar_url};
}
const avHTML = (id, size = 36) => { const p = person(id); return `<span class="av" style="background:${p.col};width:${size}px;height:${size}px">${p.avatar ? `<img src="${esc(p.avatar)}" alt="">` : esc(initials(p.name))}</span>`; };
const keyType = {t:'tour', r:'rental', p:'post'};
/* map_query holds either plain text or {"q","lat","lng","addr"} JSON (no DB migration needed) */
function parseGeo(raw, name){
const s = String(raw || '');
if (s.startsWith('{')) { try { const o = JSON.parse(s); if (isFinite(o.lat) && isFinite(o.lng)) return {q:o.q || name, lat:+o.lat, lng:+o.lng, addr:o.addr || ''}; return {q:o.q || name, lat:null, lng:null, addr:''}; } catch (_) {} }
return {q:s || name, lat:null, lng:null, addr:''};
}
async function loadAll(){
const q = await Promise.all([
sb.from('tours').select('*').order('depart_at', {ascending:true}),
sb.rpc('tour_taken_all'),
sb.from('tour_cards').select('*'),
sb.from('rentals').select('*').order('created_at', {ascending:false}),
sb.from('posts').select('*').order('created_at', {ascending:false}).limit(100),
sb.from('likes').select('*'),
sb.from('comments').select('*').order('created_at', {ascending:true}).limit(2000),
sb.from('profiles').select('*'),
S.user ? sb.from('bookings').select('*') : Promise.resolve({data:[]})
]);
const bad = q.find(r => r.error); if (bad) throw bad.error;
const [tours, taken, cards, rentals, posts, likes, comments, profiles, bookings] = q.map(r => r.data || []);
S.profiles = Object.fromEntries(profiles.map(p => [p.id, p]));
if (S.user && S.profiles[S.user.id]) Object.assign(S.user, S.profiles[S.user.id]);
const tk = Object.fromEntries(taken.map(x => [x.tour_id, x.taken]));
const cm = Object.fromEntries(cards.map(x => [x.tour_id, x.card_masked]));
S.tours = tours.map(x => { const dep = tz(x.depart_at), ret = tz(x.return_at), geo = parseGeo(x.map_query, x.name); return {
id:x.id, ownerId:x.owner_id, card:cm[x.id] || '', name:x.name, place:x.place, q:geo.q, lat:geo.lat, lng:geo.lng, addr:geo.addr, lvl:x.level, p:x.price, cap:x.capacity, meet:x.meet_point,
depDate:dep.d, depTime:dep.t, retDate:ret.d, retTime:ret.t, desc:x.description, needs:x.needs || [], photos:x.photos || [], taken:tk[x.id] || 0,
participants: bookings.filter(b => b.tour_id === x.id && b.status !== 'cancelled' && (!S.user || b.user_id !== S.user.id)).map(b => ({uid:b.user_id, name:person(b.user_id).name, n:b.seats, m:b.pay_method, status:b.status, ts:Date.parse(b.created_at)})),
mine: S.user ? (bookings.find(b => b.tour_id === x.id && b.user_id === S.user.id && b.status !== 'cancelled') || null) : null }; });
S.rentals = rentals.map(x => ({id:x.id, ownerId:x.owner_id, name:x.name, p:x.price, where:x.pickup, desc:x.description || '', photos:x.photos || []}));
S.likes = likes;
S.posts = posts.map(x => ({id:x.id, uid:x.owner_id, place:x.place || '', cap:x.caption || '', src:x.photo_url, ts:Date.parse(x.created_at)}));
S.comments = {};
const pre = {tour:'t-', rental:'r-', post:'p-'};
comments.forEach(c => { const k = pre[c.target_type] + c.target_id; (S.comments[k] = S.comments[k] || []).push({id:c.id, uid:c.user_id, text:c.body, ts:Date.parse(c.created_at)}); });
S.cart = S.cart.filter(id => S.rentals.some(r => r.id === id)); saveCart();
S.loaded = true;
}
async function refresh(){ try { await loadAll(); rerender(); } catch (e) { fail(e); } }
/* ---------- reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target); e.target.querySelectorAll('[data-fill]').forEach(m => m.style.width = m.dataset.fill + '%'); }), {threshold:.12, rootMargin:'0px 0px -30px'});
const observe = root => { const els = root.querySelectorAll('.rv:not(.in)'); els.forEach((el, i) => { el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms'; io.observe(el); }); setTimeout(() => els.forEach(el => { if (el.offsetParent !== null && el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }), 900); };
/* ---------- tours ---------- */
const lvlCls = l => ({'Oson':'p-easy',"O'rtacha":'p-mid','Qiyin':'p-hard'}[l] || 'p-mid');
const tourThumb = t => t.photos.length ? `<img src="${esc(t.photos[0])}" alt="${esc(t.name)}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : logoPh();
let filter = 'all';
function tourCard(t){
const b = !!t.mine, own = isMine(t), g = person(t.ownerId);
return `<article class="card rv" data-open="t:${t.id}" tabindex="0" aria-label="${esc(t.name)} — batafsil">
<div class="photo">${tourThumb(t)}<span class="pill ${lvlCls(t.lvl)}">${esc(t.lvl)}</span>${t.photos.length > 1 ? `<span class="nph">${camIc}${t.photos.length}</span>` : ''}</div>
<div class="cbody">
<div class="row"><div style="min-width:0"><div class="name">${esc(t.name)}</div><div class="sub">${esc(t.place)}</div></div><div style="text-align:right"><div class="price">${fmt(t.p)}</div><div class="sub">1 kishi</div></div></div>
<div class="meta two"><div><span>KETISH</span><b>${dShort(t.depDate)}, ${t.depTime}</b></div><div><span>QAYTISH</span><b>${dShort(t.retDate)}, ${t.retTime}</b></div></div>
<div class="slots"><span>Joylar</span><div class="meter"><i data-fill="${Math.round(t.taken / t.cap * 100)}"></i></div><b style="color:var(--tx);font-variant-numeric:tabular-nums">${t.taken}/${t.cap}</b></div>
<div class="foot">${avHTML(t.ownerId)}<span class="who" style="min-width:0"><b>${esc(g.name)}</b><small>Gid</small></span>
${own ? `<button class="glow done" type="button" data-go="t:${t.id}">Sizning e'loningiz</button>` : `<button class="glow ${b ? 'done' : ''}" type="button" data-bookopen="${t.id}">${b ? 'Band qilindi ✓' : 'Band qilish'}</button>`}</div>
</div></article>`;
}
function renderTours(){
const q = $('#q').value.trim().toLowerCase();
const list = S.tours.filter(t => (filter === 'all' || t.lvl === filter) && (!q || (t.name + ' ' + t.place).toLowerCase().includes(q)));
$('#tours').innerHTML = !S.loaded ? `<p class="empty">Yuklanmoqda…</p>` : list.length ? list.map(tourCard).join('')
: S.tours.length ? `<p class="empty">Bunday sayohat topilmadi. Boshqa joy nomini yozib ko'ring.</p>` : `<p class="empty">Hali e'lon yo'q. Birinchi sayohatni pastdagi «+» tugmasi orqali joylang.</p>`;
observe($('#tours'));
if (homeView === 'map') renderHomeMap();
}
/* ---------- rentals ---------- */
const rentThumb = r => r.photos.length ? `<img src="${esc(r.photos[0])}" alt="${esc(r.name)}" loading="lazy">` : logoPh('md');
function renderGear(){
$('#gear').innerHTML = S.rentals.map(r => { const on = S.cart.includes(r.id), own = isMine(r); return `<div class="g rv" data-open="r:${r.id}" tabindex="0" aria-label="${esc(r.name)} — batafsil"><div class="gph">${rentThumb(r)}</div><div class="gb"><b>${esc(r.name)}</b><small class="own">${own ? 'Sizning jihozingiz' : esc(person(r.ownerId).name)}</small><div class="gr"><span>${fmt(r.p)}</span>${own ? '' : `<button class="add ${on ? 'on' : ''}" type="button" data-cart="${r.id}" aria-label="${esc(r.name)} — ijaraga olish" aria-pressed="${on}">${on ? '✓' : '+'}</button>`}</div></div></div>`; }).join('')
|| `<p class="empty" style="grid-column:1/-1">${S.loaded ? "Hali jihoz yo'q. «+» → Ijara orqali birinchi bo'lib joylang." : 'Yuklanmoqda…'}</p>`;
observe($('#gear'));
}
function toggleCart(id){
const r = S.rentals.find(x => x.id === id); if (!r || isMine(r)) return;
const i = S.cart.indexOf(id); i >= 0 ? S.cart.splice(i, 1) : S.cart.push(id); saveCart();
const bd = $('#cartBadge'); bd.textContent = S.cart.length; bd.hidden = !S.cart.length; bd.classList.remove('bump'); void bd.offsetWidth; bd.classList.add('bump');
toast(i < 0 ? r.name + ' ijaraga olindi — Bandlarim bo\'limida' : 'Ijaradan olib tashlandi');
rerender();
}
/* ---------- posts ---------- */
const likes = p => S.likes.filter(l => l.post_id === p.id).length;
const liked = p => !!(S.user && S.likes.some(l => l.post_id === p.id && l.user_id === S.user.id));
const ccount = key => (S.comments[key] || []).length;
const media = (p, grid) => isVideo(p.src)
? (grid ? `<video src="${esc(p.src)}#t=0.1" muted playsinline preload="metadata"></video><i class="vtag">${playIc}</i>` : `<video src="${esc(p.src)}#t=0.1" controls playsinline preload="metadata"></video>`)
: `<img src="${esc(p.src)}" alt="${esc(p.cap || p.place)}" loading="lazy">`;
function postCard(p){
const who = person(p.uid);
return `<article class="post rv" id="post-${p.id}">
<div class="ph">${avHTML(p.uid)}<span style="min-width:0"><b>${esc(who.name)}</b><small>${esc(p.place)} · ${ago(p.ts)}</small></span>${isMine(p) ? `<button class="xdel" type="button" data-delpost="${p.id}" aria-label="Rasmni o'chirish">${trashIc}</button>` : ''}</div>
<div class="pimg${isVideo(p.src) ? ' isvid' : ''}" data-tap="${p.id}">${media(p)}<span class="burst">${bigHeart}</span></div>
<div class="pact"><button type="button" class="${liked(p) ? 'liked' : ''}" data-like="${p.id}" aria-pressed="${liked(p)}" aria-label="Yoqdi">${heartIc}<span>${likes(p)}</span></button><button type="button" data-cmts="p-${p.id}" aria-label="Izohlar">${cmtIc}<span>${ccount('p-' + p.id)}</span></button><button type="button" data-share="p-${p.id}" aria-label="Ulashish">${sendIc}</button></div>
${p.cap ? `<p class="pcap"><b>${esc(who.name.split(' ')[0])}</b>${esc(p.cap)}</p>` : '<div style="height:12px"></div>'}
</article>`;
}
function renderFeed(){ $('#feed').innerHTML = S.posts.map(postCard).join('') || (S.loaded ? `<p class="empty">Hali lavha yo'q. Sayohatingizdan birinchi rasmni joylang.</p>` : ''); observe($('#feed')); }
let likeBusy = new Set();
async function setLike(id, val){
const p = S.posts.find(x => x.id === id); if (!p || !S.user || likeBusy.has(id)) return;
const was = liked(p), nv = val === undefined ? !was : val; if (nv === was) return;
likeBusy.add(id);
if (nv) S.likes.push({post_id:id, user_id:S.user.id}); else S.likes = S.likes.filter(l => !(l.post_id === id && l.user_id === S.user.id));
paintLike(p);
const { error } = nv ? await sb.from('likes').insert({post_id:id, user_id:S.user.id}) : await sb.from('likes').delete().eq('post_id', id).eq('user_id', S.user.id);
likeBusy.delete(id);
if (error) { if (nv) S.likes = S.likes.filter(l => !(l.post_id === id && l.user_id === S.user.id)); else S.likes.push({post_id:id, user_id:S.user.id}); paintLike(p); fail(error); }
}
function paintLike(p){ const nv = liked(p); $$(`[data-like="${p.id}"]`).forEach(b => { b.classList.toggle('liked', nv); b.setAttribute('aria-pressed', nv); b.querySelector('span').textContent = likes(p); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }); if (isMine(p)) renderProfile(); }
/* ---------- booked ---------- */
function renderBooked(){
const ts = S.tours.filter(t => t.mine), items = S.cart.map(id => S.rentals.find(r => r.id === id)).filter(Boolean);
if (!ts.length && !items.length) { $('#booked').innerHTML = `<p class="empty rv">Hali hech narsa band qilinmagan.</p>`; observe($('#booked')); return; }
const tickets = ts.map(t => { const bk = t.mine, g = person(t.ownerId); return `
<div class="ticket rv">
<span class="chip"><span class="live"></span>${bk.status === 'paid' ? "To'langan" : 'Band qilindi'} · ${bk.seats} kishi · ${fmt(t.p * bk.seats)} · ${esc(bk.pay_method)}</span>
<div class="big" data-go="t:${t.id}" style="cursor:pointer">${esc(t.name)}</div>
<div class="legs"><div><b>${t.depTime}</b><small>${dLong(t.depDate)} · ${esc(t.meet)}</small></div><span class="mid">→</span><div><b>${t.retTime}</b><small>${dLong(t.retDate)}</small></div></div>
<div class="foot">${avHTML(t.ownerId)}<span class="who"><b>${esc(g.name)}</b><small>Gidingiz</small></span><button class="glow done" type="button" data-cancel="${t.id}">Bekor qilish</button></div>
</div>`; }).join('');
const total = items.reduce((s, r) => s + r.p, 0);
const rent = items.length ? `
<div class="panel rv">
<div class="panel-bar">Ijaraga olingan jihozlar<span class="tag fin">${items.length} TA</span></div>
<div class="checks">${items.map(r => `<div class="ck done" style="cursor:pointer" data-open="r:${r.id}"><span class="box"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06100B" stroke-width="4"><path d="m5 12 5 5 9-10"/></svg></span>${esc(r.name)}<small>${fmt(r.p)}</small><button class="add on" type="button" data-cart="${r.id}" aria-label="${esc(r.name)} — olib tashlash" style="width:32px;height:32px;margin-left:4px">×</button></div>`).join('')}</div>
<div class="progress"><span>Jami, bir kun uchun</span><span style="flex:1"></span><b style="min-width:0">${fmt(total)}</b></div>
</div>` : '';
$('#booked').innerHTML = `<div style="display:flex;flex-direction:column;gap:16px">${tickets}${rent}</div>`;
observe($('#booked'));
}
/* ---------- profile ---------- */
function renderProfile(){
if (!S.user) return;
const u = S.user, nm = person(u.id).name || `${u.first_name || ''} ${u.last_name || ''}`;
$('#profName').textContent = nm;
$('#profAv').innerHTML = u.avatar_url ? `<img src="${esc(u.avatar_url)}" alt="Profil rasmi">` : esc(initials(nm));
const mine = S.tours.filter(isMine);
$('#myTours').innerHTML = mine.length ? mine.map(t => `<button type="button" class="mytour" data-go="t:${t.id}"><span class="thumb">${tourThumb(t)}</span><span style="min-width:0"><b>${esc(t.name)}</b><small>${t.taken} / ${t.cap} kishi band qildi · ${dShort(t.depDate)}</small></span><span style="margin-left:auto;color:var(--tx-3)">›</span></button>`).join('') : `<p class="sub">Hali e'lon joylamadingiz.</p>`;
const rents = S.rentals.filter(isMine);
$('#myRents').innerHTML = rents.length ? rents.map(r => `<button type="button" class="mytour" data-go="r:${r.id}"><span class="thumb">${r.photos.length ? `<img src="${esc(r.photos[0])}" alt="">` : logoPh('sm')}</span><span style="min-width:0"><b>${esc(r.name)}</b><small>${fmt(r.p)} / kun · ${esc(r.where)}</small></span><span style="margin-left:auto;color:var(--tx-3)">›</span></button>`).join('') : `<p class="sub">Hali jihoz joylamadingiz.</p>`;
const posts = S.posts.filter(isMine);
$('#myCount').textContent = posts.length ? posts.length + ' ta rasm' : '';
$('#myGrid').innerHTML = posts.length ? `<div class="grid3">${posts.map(p => `<div class="cell">${media(p, true)}<span>${heartIc.replace('width="24" height="24"', 'width="14" height="14"')}${likes(p)}</span></div>`).join('')}</div>`
: `<div class="empty-cta"><span>Hali rasm joylamadingiz.</span><button type="button" class="glow" data-act="photo" style="margin:0">Rasm joylash</button></div>`;
}
/* ---------- photos ---------- */
function shrink(f, max, cb){ const r = new FileReader(); r.onload = () => { const img = new Image(); img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', .82)); }; img.onerror = () => toast('Rasmni ochib bo\'lmadi'); img.src = r.result; }; r.readAsDataURL(f); }
async function upload(dataUrl){ return uploadBlob(await (await fetch(dataUrl)).blob(), 'jpg', 'image/jpeg'); }
async function uploadBlob(blob, ext, type){
const path = `${S.user.id}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
const { error } = await sb.storage.from('photos').upload(path, blob, {contentType:type, cacheControl:'31536000'});
if (error) throw error;
return sb.storage.from('photos').getPublicUrl(path).data.publicUrl;
}
function addPhotos(list, files, done){
const room = 10 - list.length;
if (room <= 0) { toast('10 tagacha rasm joylash mumkin'); return; }
const imgs = files.filter(f => f.type.startsWith('image/'));
if (!imgs.length) { toast('Rasm fayl tanlang'); return; }
if (imgs.length > room) toast(`Faqat yana ${room} ta rasm qo'shish mumkin`);
let left = Math.min(room, imgs.length);
imgs.slice(0, room).forEach(f => shrink(f, 1280, src => { list.push(src); if (--left === 0) done(); }));
}
const thumbsHTML = (photos, delAttr, inputId) => photos.map((src, k) => `<div class="th"><img src="${esc(src)}" alt="${k + 1}-rasm"><button class="del" type="button" ${delAttr}="${k}" aria-label="${k + 1}-rasmni o'chirish">×</button>${k ? '' : '<span class="main">Asosiy</span>'}</div>`).join('') + (photos.length < 10 ? `<label class="th addph" for="${inputId}">+<small>${photos.length} / 10</small></label>` : '');
function heroMedia(item, fallback){
const n = item.photos.length;
if (!n) return fallback;
return `<div class="slides" data-slides>${item.photos.map((src, k) => `<img src="${esc(src)}" alt="${esc(item.name)} — ${k + 1}-rasm" draggable="false">`).join('')}</div>${n > 1 ? `<div class="dots">${item.photos.map((_, k) => `<i class="${k ? '' : 'on'}"></i>`).join('')}</div><span class="count mono" data-slideno>1 / ${n}</span>` : ''}`;
}
function wireSlides(root){
const sl = root.querySelector('[data-slides]'); if (!sl) return;
const n = sl.children.length; if (n < 2) return;
sl.addEventListener('scroll', () => { const k = Math.round(sl.scrollLeft / sl.clientWidth); root.querySelector('[data-slideno]').textContent = (k + 1) + ' / ' + n; root.querySelectorAll('.dots i').forEach((d, x) => d.classList.toggle('on', x === k)); }, {passive:true});
}
const topBar = key => `<div class="dtop">
<button class="glassround" type="button" data-back aria-label="Orqaga"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
<div class="grp"><button type="button" data-share="${key}" aria-label="Ulashish">${sendIc}</button><button type="button" data-cmts="${key}" aria-label="Izohlar">${cmtIc}</button></div></div>`;
function cmtPreview(key){
const list = S.comments[key] || [];
return `<h2 class="dh">Izohlar <span class="sub">${list.length}</span></h2><div class="cpreview">${list.slice(-2).map(cmtHTML).join('') || '<p class="sub">Hali izoh yo\'q. Birinchi bo\'lib yozing.</p>'}<button type="button" class="cbtn" data-cmts="${key}">${cmtIc}${list.length > 2 ? 'Barcha izohlar' : 'Izoh yozish'}</button></div>`;
}
async function savePhotos(table, item, photos){
const { error } = await sb.from(table).update({photos}).eq('id', item.id);
if (error) { fail(error); return false; }
item.photos = photos; return true;
}
/* ---------- tour detail ---------- */
let cur = null, prevView = 'sayohat', qty = {};
function mapSvg(t){
return `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(t.name)} xaritada">
<rect width="400" height="240" fill="#0A1611"/>
<g fill="none" stroke="rgba(255,255,255,.05)" stroke-width="1.2"><path d="M220 20 C260 40 300 30 340 60 S400 90 420 80"/><path d="M200 50 C250 70 290 60 330 90 S400 120 420 115"/><path d="M190 85 C240 100 280 95 320 120 S400 150 420 150"/></g>
<path d="M-10 200 C60 170 110 210 170 175 S280 150 330 190 S400 200 420 185" fill="none" stroke="#173A5C" stroke-width="9" stroke-linecap="round"/>
<g fill="none" stroke="rgba(255,255,255,.13)" stroke-width="3" stroke-linecap="round"><path d="M0 225 L400 120"/><path d="M40 240 L120 0"/><path d="M180 240 L240 100"/></g>
<path class="route" d="M72 196 C120 160 150 170 190 130 S260 90 296 70" fill="none" stroke="#F2A65A" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="72" cy="196" r="7" fill="#46C98B" stroke="#0A1611" stroke-width="3"/>
<text x="86" y="216" fill="#F1F5F2" font-size="12" font-family="Onest,sans-serif" font-weight="600">${esc(t.meet)}</text>
<g class="pin"><path d="M296 72 C288 60 282 52 282 44 a14 14 0 0 1 28 0 c0 8 -6 16 -14 28z" fill="#F2A65A"/><circle cx="296" cy="44" r="5" fill="#0A1611"/></g>
<text x="296" y="98" text-anchor="middle" fill="#F1F5F2" font-size="12.5" font-family="Onest,sans-serif" font-weight="700">${esc(t.q)}</text></svg>`;
}
/* ---------- real map (Leaflet + OpenStreetMap) and automatic address lookup ---------- */
const pinIc = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex:none;color:var(--dawn)"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
const UZ_CENTER = [41.2, 66.0];
const hasMap = () => typeof window.L !== 'undefined';
if (window.L) L.Control.Attribution.prototype.options.prefix = '<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>';
const tileLayer = () => L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'});
const pinIcon = () => L.divIcon({className:'sgpin', html:'<span></span>', iconSize:[30, 40], iconAnchor:[15, 38], popupAnchor:[0, -34]});
const mapLinks = t => {
const ll = t.lat != null ? `${t.lat},${t.lng}` : null;
const y = ll ? `https://yandex.uz/maps/?pt=${t.lng},${t.lat}&z=14&l=map` : `https://yandex.uz/maps/?text=${encodeURIComponent(t.q + ', ' + t.place)}`;
const g = ll ? `https://www.google.com/maps/search/?api=1&query=${ll}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.q + ', ' + t.place)}`;
return `<a href="${y}" target="_blank" rel="noopener">Yandex xarita</a><a href="${g}" target="_blank" rel="noopener">Google Maps</a>`;
};
/* Nominatim: free OSM geocoder, max 1 request per second */
const geoCache = {}; let geoLast = 0;
async function geoFetch(url){
const gap = geoLast + 1100 - Date.now(); if (gap > 0) await new Promise(r => setTimeout(r, gap));
geoLast = Date.now();
const r = await fetch(url, {headers:{'Accept':'application/json'}}); if (!r.ok) throw new Error('geo ' + r.status); return r.json();
}
async function geocode(q){
q = String(q || '').trim(); if (q.length < 2) return null;
const k = I18N.lang + '|' + q.toLowerCase(); if (k in geoCache) return geoCache[k];
try {
const j = await geoFetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=uz&accept-language=${I18N.lang}&q=${encodeURIComponent(q)}`);
const x = j && j[0]; geoCache[k] = x ? {lat:+x.lat, lng:+x.lon, addr:x.display_name} : null;
} catch (e) { console.warn(e); return null; }
return geoCache[k];
}
async function reverseGeo(lat, lng){
try { const j = await geoFetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&accept-language=${I18N.lang}&lat=${lat}&lon=${lng}`); return (j && j.display_name) || ''; } catch (_) { return ''; }
}
/* tries several spellings of what the guide typed, most specific first */
async function smartGeocode(q, name, place){
const tries = [];
const add = s => { s = String(s || '').trim().replace(/\s+/g, ' '); if (s.length > 1 && !tries.some(x => x.toLowerCase() === s.toLowerCase())) tries.push(s); };
add(q && place ? q + ', ' + place : ''); add(q); add(name && place ? name + ', ' + place : ''); add(name);
add(String(name || '').replace(/(cho'qqisi|chuqqisi|sharsharasi|sharshara|ko'li|tog'i|darasi|sayohati|sayohat|safari|tur|yurish)/gi, ''));
add(place);
for (const s of tries.slice(0, 5)) { const g = await geocode(s); if (g) return g; }
return null;
}
let detailMap = null;
async function showTourMap(t){
const box = $('#tMap'); if (!box) return;
if (detailMap) { try { detailMap.remove(); } catch (_) {} detailMap = null; }
let g = t.lat != null ? {lat:t.lat, lng:t.lng, addr:t.addr} : null;
if (!g) g = await smartGeocode(t.q, t.name, t.place);
if (!cur || cur.item.id !== t.id || !document.body.contains(box)) return;
if (!g || !hasMap()) { box.innerHTML = mapSvg(t); if (!g) { const a = $('#tAddr'); a.hidden = false; a.querySelector('span').textContent = t.place; } return; }
box.innerHTML = '';
detailMap = L.map(box, {zoomControl:true, scrollWheelZoom:false, attributionControl:true}).setView([g.lat, g.lng], 13);
tileLayer().addTo(detailMap);
L.marker([g.lat, g.lng], {icon:pinIcon()}).addTo(detailMap);
if (!t.addr && g.addr) { const a = $('#tAddr'); a.hidden = false; a.querySelector('span').textContent = g.addr; }
if (t.lat == null) $('#tLinks').innerHTML = mapLinks({...t, lat:g.lat, lng:g.lng});
setTimeout(() => detailMap && detailMap.invalidateSize(), 200);
}
/* map of all trips on the home screen */
let homeMap = null, homeLayer = null, homeView = 'list';
async function renderHomeMap(){
const box = $('#toursMap'); if (!box || homeView !== 'map') return;
if (!hasMap()) { box.innerHTML = `<p class="empty">Xarita yuklanmadi. Internetni tekshiring.</p>`; return; }
if (!homeMap) { homeMap = L.map(box, {scrollWheelZoom:false}).setView(UZ_CENTER, 6); tileLayer().addTo(homeMap); homeLayer = L.layerGroup().addTo(homeMap); }
setTimeout(() => homeMap.invalidateSize(), 100);
homeLayer.clearLayers();
const pts = [];
for (const t of S.tours) {
let g = t.lat != null ? {lat:t.lat, lng:t.lng} : null;
if (!g) g = await smartGeocode(t.q, t.name, t.place);
if (!g || homeView !== 'map') continue;
pts.push([g.lat, g.lng]);
L.marker([g.lat, g.lng], {icon:pinIcon()}).addTo(homeLayer).bindPopup(`<div class="mpop"><b>${esc(t.name)}</b><span>${dLong(t.depDate)} · ${fmt(t.p)}</span><button type="button" data-go="t:${t.id}">${I18N.t('Ochish')}</button></div>`);
}
if (pts.length) homeMap.fitBounds(pts, {padding:[40, 40], maxZoom:11});
}
function setHomeView(v){
homeView = v;
$$('#viewSw button').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === v));
$('#tours').hidden = v === 'map'; $('#toursMap').hidden = v !== 'map';
if (v === 'map') renderHomeMap();
}
/* the picker inside the "E'lon joylash" form */
let formMap = null, formPin = null, geoPick = null, geoBusy = false;
function initFormMap(){
if (!hasMap()) { $('#eMap').hidden = true; return; }
if (!formMap) {
formMap = L.map('eMap', {scrollWheelZoom:false}).setView(UZ_CENTER, 6);
tileLayer().addTo(formMap);
formMap.on('click', e => placePin(e.latlng.lat, e.latlng.lng, true));
}
setTimeout(() => formMap.invalidateSize(), 250);
}
async function placePin(lat, lng, manual, addr){
if (!formMap) return;
if (!formPin) { formPin = L.marker([lat, lng], {icon:pinIcon(), draggable:true}).addTo(formMap); formPin.on('dragend', () => { const p = formPin.getLatLng(); placePin(p.lat, p.lng, true); }); }
else formPin.setLatLng([lat, lng]);
formMap.setView([lat, lng], Math.max(formMap.getZoom(), 13));
geoPick = {lat:+lat.toFixed(6), lng:+lng.toFixed(6), addr:addr || '', manual};
setGeoHint(addr || I18N.t('Manzil aniqlanmoqda…'), 'ok');
if (!addr) { const a = await reverseGeo(lat, lng); if (geoPick && geoPick.lat === +lat.toFixed(6)) { geoPick.addr = a; setGeoHint(a || I18N.t('Nuqta belgilandi'), 'ok'); } }
}
function setGeoHint(text, kind){ const h = $('#eAddr'); h.hidden = !text; h.className = 'addr ' + (kind || ''); h.innerHTML = text ? `${pinIc}<span></span>` : ''; if (text) h.querySelector('span').textContent = text; }
async function autoGeo(force){
if (geoBusy || (geoPick && geoPick.manual && !force)) return;
const v = id => $('#' + id).value.trim();
if (!v('eQ') && !v('eName') && !v('ePlace')) { if (force) setGeoHint(I18N.t('Avval joy nomini yozing.'), 'bad'); return; }
geoBusy = true; $('#eGeo').disabled = true; setGeoHint(I18N.t('Xaritadan qidirilmoqda…'), '');
const g = await smartGeocode(v('eQ'), v('eName'), v('ePlace'));
geoBusy = false; $('#eGeo').disabled = false;
if (g) placePin(g.lat, g.lng, false, g.addr);
else setGeoHint(I18N.t('Xaritadan topilmadi. Xaritani bosib, joyni o\'zingiz belgilang.'), 'bad');
}
function renderTour(){
const t = cur.item, free = t.cap - t.taken, own = isMine(t), g = person(t.ownerId), n = t.photos.length;
const collected = t.participants.reduce((s, x) => s + x.n * t.p, 0);
const key = 't-' + t.id, el = $('#v-detail');
el.innerHTML = `
<div class="dhero">${heroMedia(t, logoPh())}${topBar(key)}<span class="pill ${lvlCls(t.lvl)}">${esc(t.lvl)}</span></div>
<h1 class="dtitle">${esc(t.name)}</h1>
<div class="dprice">${fmt(t.p)}<span>1 kishi uchun</span></div>
${own ? `
<div class="own">
<div class="own-h"><span class="kicker">Sizning e'loningiz</span><span class="sub" style="font-size:12px">Bu bo'limni faqat siz ko'rasiz</span></div>
<div class="ostats"><div><b>${t.taken}<small> / ${t.cap}</small></b><span>kishi band qildi</span></div><div><b>${fmt(collected)}</b><span>jami summa</span></div></div>
<div class="cardline">${cardIc}Pul tushadigan karta: <b>${esc(t.card)}</b></div>
<h3 class="dh" style="font-size:16px">Rasmlar <span class="sub">${n} / 10</span></h3>
<div class="thumbs">${thumbsHTML(t.photos, 'data-delph', 'tFile')}</div>
<input id="tFile" type="file" accept="image/*" multiple hidden>
<h3 class="dh" style="font-size:16px">Band qilganlar ro'yxati</h3>
<div class="plist">${t.participants.length ? t.participants.map(x => `<div class="prow">${avHTML(x.uid, 34)}<span style="min-width:0"><b>${esc(x.name)}</b><small>${esc(x.m)} · ${ago(x.ts)}</small></span><span class="pn">${x.n} kishi<small>${fmt(x.n * t.p)}</small></span></div>`).join('') : '<p class="sub">Hali hech kim band qilmagan.</p>'}</div>
<button type="button" class="danger" data-deltour="${t.id}">${trashIc}E'lonni o'chirish</button>
</div>` : ''}
<p class="ddesc">${esc(t.desc)}</p>
<div class="kv">
<div><span>Ketish</span><b>${dLong(t.depDate)}, ${t.depTime}</b></div>
<div><span>Qaytish</span><b>${dLong(t.retDate)}, ${t.retTime}</b></div>
<div><span>Yig'ilish joyi</span><b>${esc(t.meet)}</b></div>
<div><span>Qiyinlik</span><b>${esc(t.lvl)}</b></div>
<div><span>Band qilingan</span><b>${t.taken} kishi · ${Math.max(0, free)} ta joy bo'sh</b></div>
</div>
${t.needs.length ? `<h2 class="dh">Nimalar kerak</h2><div class="needs">${t.needs.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
<h2 class="dh">Joylashuv</h2>
<div class="loc-line"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 3 3 10.5l7.5 3 3 7.5z"/></svg>${esc(t.place)}</div>
<div class="map" id="tMap"><div class="maploading">Xarita yuklanmoqda…</div></div>
<p class="addr" id="tAddr"${t.addr ? '' : ' hidden'}>${pinIc}<span>${esc(t.addr)}</span></p>
<div class="maplinks" id="tLinks">${mapLinks(t)}</div>
<h2 class="dh">Gid</h2>
<div class="gcard">${avHTML(t.ownerId, 48)}<span><b>${esc(g.name)}</b><small>Gid</small></span></div>
${cmtPreview(key)}
<div style="height:20px"></div>`;
wireSlides(el);
showTourMap(t);
if (own) {
$('#tFile').onchange = e => { const list = t.photos.slice(); addPhotos(list, [...(e.target.files || [])], async () => {
toast('Rasmlar yuklanmoqda…');
try { const fresh = list.slice(t.photos.length); const urls = []; for (const d of fresh) urls.push(await upload(d)); if (await savePhotos('tours', t, t.photos.concat(urls))) { renderTour(); renderTours(); toast('Rasm qo\'shildi'); } } catch (er) { fail(er); }
}); e.target.value = ''; };
el.querySelectorAll('[data-delph]').forEach(b => b.onclick = async () => { const list = t.photos.slice(); list.splice(+b.dataset.delph, 1); if (await savePhotos('tours', t, list)) { renderTour(); renderTours(); toast('Rasm o\'chirildi'); } });
}
updateBuy();
}
function updateBuy(){
const bar = $('#buybar');
if (!cur || isMine(cur.item)) { bar.hidden = true; return; }
bar.hidden = false;
if (cur.kind === 'r') { $('.stepper').style.display = 'none'; const on = S.cart.includes(cur.item.id), b = $('#buyBtn'); b.classList.toggle('done', on); b.innerHTML = on ? 'Ijaraga olindi ✓ <small>· olib tashlash</small>' : `Ijaraga olish <small>· ${fmt(cur.item.p)} / kun</small>`; return; }
const t = cur.item; $('.stepper').style.display = '';
const n = qty[t.id] || 1, bk = t.mine, free = t.cap - t.taken;
$('#qVal').textContent = bk ? bk.seats : n;
$('.stepper').style.visibility = bk ? 'hidden' : '';
const btn = $('#buyBtn'); btn.classList.toggle('done', !!bk);
btn.innerHTML = bk ? 'Band qilindi ✓ <small>· ko\'rish</small>' : free <= 0 ? 'Joylar tugagan' : `Joy band qilish <small>· ${fmt(t.p * n)}</small>`;
}
/* ---------- rental detail ---------- */
function renderRental(){
const r = cur.item, own = isMine(r), g = person(r.ownerId), key = 'r-' + r.id, el = $('#v-rent');
el.innerHTML = `
<div class="dhero">${heroMedia(r, logoPh())}${topBar(key)}</div>
<h1 class="dtitle">${esc(r.name)}</h1>
<div class="dprice">${fmt(r.p)}<span>bir kun uchun</span></div>
${own ? `
<div class="own">
<div class="own-h"><span class="kicker">Sizning jihozingiz</span><span class="sub" style="font-size:12px">Faqat siz ko'rasiz</span></div>
<h3 class="dh" style="font-size:16px">Rasmlar <span class="sub">${r.photos.length} / 10</span></h3>
<div class="thumbs">${thumbsHTML(r.photos, 'data-delrph', 'rdFile')}</div>
<input id="rdFile" type="file" accept="image/*" multiple hidden>
<button type="button" class="danger" data-delrent="${r.id}">${trashIc}E'lonni o'chirish</button>
</div>` : ''}
${r.desc ? `<p class="ddesc">${esc(r.desc)}</p>` : ''}
<div class="kv"><div><span>Qayerdan olinadi</span><b>${esc(r.where)}</b></div><div><span>Narx</span><b>${fmt(r.p)} / kun</b></div></div>
<h2 class="dh">Egasi</h2>
<div class="gcard">${avHTML(r.ownerId, 48)}<span><b>${esc(g.name)}</b><small>${own ? 'Siz' : 'Ijaraga beruvchi'}</small></span></div>
${cmtPreview(key)}
<div style="height:20px"></div>`;
wireSlides(el);
if (own) {
$('#rdFile').onchange = e => { const list = r.photos.slice(); addPhotos(list, [...(e.target.files || [])], async () => {
toast('Rasmlar yuklanmoqda…');
try { const fresh = list.slice(r.photos.length); const urls = []; for (const d of fresh) urls.push(await upload(d)); if (await savePhotos('rentals', r, r.photos.concat(urls))) { renderRental(); renderGear(); toast('Rasm qo\'shildi'); } } catch (er) { fail(er); }
}); e.target.value = ''; };
el.querySelectorAll('[data-delrph]').forEach(b => b.onclick = async () => { const list = r.photos.slice(); list.splice(+b.dataset.delrph, 1); if (await savePhotos('rentals', r, list)) { renderRental(); renderGear(); toast('Rasm o\'chirildi'); } });
}
updateBuy();
}
/* ---------- navigation ---------- */
const views = ['sayohat', 'ijara', 'band', 'profil'];
function hideAll(){ [...views, 'detail', 'rent'].forEach(x => { const s = $('#v-' + x); s.hidden = true; s.style.display = ''; }); }
function setHash(h){ try { if (h) { if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h); } else if (location.hash) history.replaceState(null, '', location.pathname + location.search); } catch (_) {} }
function show(v){
closeSheet(); hideAll(); cur = null;
const s = $('#v-' + v); s.hidden = false; s.style.display = 'flex';
document.body.classList.remove('detail'); $('#buybar').hidden = true;
$$('.pill-nav [data-v]').forEach(b => b.dataset.v === v ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'));
rerender(); observe(s); setHash('');
window.scrollTo({top:0});
}
function openItem(ref){
const [kind, id] = ref.split(':');
const item = kind === 't' ? S.tours.find(x => x.id === id) : S.rentals.find(x => x.id === id);
if (!item) { toast('Bu e\'lon topilmadi yoki o\'chirilgan'); return false; }
const vis = views.find(v => !$('#v-' + v).hidden); if (vis) prevView = vis;
closeSheet(); hideAll();
cur = {kind, item};
if (kind === 't' && !qty[id]) qty[id] = 1;
const s = $(kind === 't' ? '#v-detail' : '#v-rent'); s.hidden = false; s.style.display = 'flex';
document.body.classList.add('detail');
kind === 't' ? renderTour() : renderRental();
setHash((kind === 't' ? 't-' : 'r-') + id);
window.scrollTo({top:0});
return true;
}
function rerender(){
renderTours(); renderGear(); renderFeed(); renderBooked(); renderProfile();
const bd = $('#cartBadge'); bd.textContent = S.cart.length; bd.hidden = !S.cart.length;
if (cur) { const fresh = (cur.kind === 't' ? S.tours : S.rentals).find(x => x.id === cur.item.id); if (fresh) { cur.item = fresh; cur.kind === 't' ? renderTour() : renderRental(); } else show(prevView); }
}
function route(){
const h = location.hash.slice(1); let m;
if ((m = h.match(/^t-(.+)$/))) return openItem('t:' + m[1]);
if ((m = h.match(/^r-(.+)$/))) return openItem('r:' + m[1]);
if ((m = h.match(/^p-(.+)$/))) { const el = $('#post-' + m[1]); if (el) { el.scrollIntoView({block:'center'}); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1800); } else toast('Bu rasm topilmadi'); }
}
window.addEventListener('hashchange', () => { if (S.user) route(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.user && S.loaded) refresh(); });
/* ---------- sheets ---------- */
const plus = $('#plus');
const SHEETS = ['#sheet', '#compose', '#newTour', '#newRent', '#pay', '#cmts', '#share', '#ask', '#langSheet'];
/* while a form is open the bottom menu is hidden, so it can never cover the submit button */
function openSheet(id){ SHEETS.forEach(s => $(s).hidden = s !== id); $('#scrim').hidden = false; $('#buybar').hidden = true; document.body.classList.add('sheet-open'); plus.classList.add('open'); plus.setAttribute('aria-expanded', 'true'); $(id).scrollTop = 0; }
function closeSheet(){ SHEETS.forEach(s => $(s).hidden = true); $('#scrim').hidden = true; document.body.classList.remove('sheet-open'); plus.classList.remove('open'); plus.setAttribute('aria-expanded', 'false'); if (cur) updateBuy(); }
SHEETS.forEach(s => { const b = document.createElement('button'); b.type = 'button'; b.className = 'xclose'; b.setAttribute('aria-label', 'Yopish'); b.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'; b.addEventListener('click', closeSheet); $(s).prepend(b); });
plus.addEventListener('click', () => SHEETS.some(s => !$(s).hidden) ? closeSheet() : openSheet('#sheet'));
$('#scrim').addEventListener('click', closeSheet);
let askCb = null;
function ask(title, text, cb){ $('#askTitle').textContent = title; $('#askText').textContent = text; askCb = cb; openSheet('#ask'); }
$('#askNo').onclick = closeSheet;
$('#askYes').onclick = () => { const f = askCb; askCb = null; closeSheet(); if (f) f(); };
const busy = (btn, on, label) => { if (!btn) return; if (on) { btn.dataset.label = btn.innerHTML; btn.disabled = true; btn.innerHTML = `<span class="spin"></span> ${label || 'Kuting…'}`; } else { btn.disabled = false; if (btn.dataset.label) btn.innerHTML = btn.dataset.label; } };
/* comments */
let cmtKey = null;
function cmtHTML(c){ const p = person(c.uid), mineC = S.user && c.uid === S.user.id; return `<div class="cmt">${avHTML(c.uid, 32)}<div class="bubble"><b>${esc(p.name)}</b><small>${ago(c.ts)}</small><p>${esc(c.text)}</p></div>${mineC ? `<button class="x" type="button" data-delcmt="${c.id}" aria-label="Izohni o'chirish">×</button>` : ''}</div>`; }
function openCmts(key){ cmtKey = key; renderCmts(); openSheet('#cmts'); setTimeout(() => $('#cmtIn').focus(), 100); }
function renderCmts(){ const list = S.comments[cmtKey] || []; $('#cmtTitle').textContent = `Izohlar (${list.length})`; $('#cmtList').innerHTML = list.map(cmtHTML).join('') || '<p class="sub">Hali izoh yo\'q. Birinchi bo\'lib yozing.</p>'; $('#cmtList').scrollTop = 1e6; }
$('#cmtForm').addEventListener('submit', async e => {
e.preventDefault(); const v = $('#cmtIn').value.trim(); if (!v || !cmtKey) return;
const [k, ...rest] = cmtKey.split('-'), target = rest.join('-');
const btn = e.target.querySelector('button'); btn.disabled = true;
const { data, error } = await sb.from('comments').insert({target_type:keyType[k], target_id:target, user_id:S.user.id, body:v}).select().single();
btn.disabled = false;
if (error) { fail(error); return; }
(S.comments[cmtKey] = S.comments[cmtKey] || []).push({id:data.id, uid:S.user.id, text:v, ts:Date.parse(data.created_at)});
$('#cmtIn').value = ''; renderCmts(); refreshCounts();
});
$('#cmtList').addEventListener('click', async e => {
const b = e.target.closest('[data-delcmt]'); if (!b) return;
const { error } = await sb.from('comments').delete().eq('id', b.dataset.delcmt);
if (error) { fail(error); return; }
S.comments[cmtKey] = (S.comments[cmtKey] || []).filter(c => c.id !== b.dataset.delcmt); renderCmts(); refreshCounts();
});
function refreshCounts(){ $$('[data-cmts^="p-"] span').forEach(s => { s.textContent = ccount(s.parentElement.dataset.cmts); }); if (cur) cur.kind === 't' ? renderTour() : renderRental(); }
/* share */
function openShare(key){
const url = SITE + '#' + key, id = key.slice(2);
const what = key[0] === 't' ? (S.tours.find(x => x.id === id) || {}).name : key[0] === 'r' ? (S.rentals.find(x => x.id === id) || {}).name : ((S.posts.find(x => x.id === id) || {}).place || 'Rasm');
$('#shareWhat').textContent = what || '';
$('#shareUrl').value = url;
const text = `${what || ''} — sayohatga`;
$('#shareTg').href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
$('#shareWa').href = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
$('#shareNote').hidden = true;
openSheet('#share');
if (navigator.share) { navigator.share({title:'sayohatga', text, url}).then(closeSheet).catch(() => {}); }
}
$('#shareCopy').addEventListener('click', () => { const inp = $('#shareUrl'); const fb = () => { inp.focus(); inp.select(); toast('Havolani belgilab, nusxalang'); }; try { navigator.clipboard.writeText(inp.value).then(() => toast('Havola nusxalandi'), fb); } catch (_) { fb(); } });
/* ---------- booking ---------- */
let payMethod = null;
function openPay(){
if (!cur || cur.kind !== 't') return;
const t = cur.item; if (isMine(t) || t.mine) return;
const free = t.cap - t.taken; if (free <= 0) { toast('Bu sayohatda bo\'sh joy qolmagan'); return; }
if ((qty[t.id] || 1) > free) qty[t.id] = free;
const k = qty[t.id] || 1, g = person(t.ownerId);
payMethod = null; $$('.mt').forEach(m => m.setAttribute('aria-checked', 'false'));
$('#paySum').innerHTML = `<div class="r"><span>Sayohat</span><b style="text-align:right">${esc(t.name)}</b></div><div class="r"><span>Ketish</span><b>${dLong(t.depDate)}, ${t.depTime}</b></div><div class="r"><span>${k} kishi × ${fmt(t.p)}</span><b>${fmt(t.p * k)}</b></div><div class="r tot"><span>Jami</span><b>${fmt(t.p * k)}</b></div>`;
$('#payTo').innerHTML = `${cardIc}Gid: <b>${esc(g.name)}${t.card ? ' · ' + esc(t.card) : ''}</b>`;
$('#payErr').hidden = true; $('#payBody').hidden = false; $('#payOk').hidden = true;
const pb = $('#payBtn'); pb.disabled = false; pb.innerHTML = `Band qilish · ${fmt(t.p * k)}`;
openSheet('#pay');
}
$$('.mt').forEach(m => m.addEventListener('click', () => { payMethod = m.dataset.m; $$('.mt').forEach(x => x.setAttribute('aria-checked', x === m)); $('#payErr').hidden = true; }));
$('#payBtn').addEventListener('click', async () => {
if (!cur || cur.kind !== 't') return;
if (!payMethod) { $('#payErr').hidden = false; return; }
const t = cur.item, k = qty[t.id] || 1, pb = $('#payBtn');
busy(pb, true, 'Band qilinmoqda…');
const { error } = await sb.from('bookings').insert({tour_id:t.id, user_id:S.user.id, seats:k, pay_method:payMethod});
busy(pb, false);
if (error) { fail(error, /joy/i.test(error.message) ? 'Bo\'sh joy yetarli emas' : null); return; }
$('#payBody').hidden = true; $('#payOk').hidden = false;
$('#payOkTxt').textContent = `${k} kishilik joy band qilindi. Gid ro'yxatida ko'rinasiz. To'lov tizimlari ulangach, to'lov shu yerdan amalga oshiriladi.`;
await refresh(); await wait(1600); closeSheet();
});
function cancelBooking(id){
const t = S.tours.find(x => x.id === id); if (!t || !t.mine) return;
ask('Band qilishni bekor qilasizmi?', 'Siz gidning ro\'yxatidan o\'chirilasiz.', async () => {
const { error } = await sb.from('bookings').delete().eq('id', t.mine.id);
if (error) { fail(error); return; }
await refresh(); toast('Band bekor qilindi');
});
}
$('#qMinus').addEventListener('click', () => { if (!cur || cur.kind !== 't') return; const id = cur.item.id; if ((qty[id] || 1) > 1) { qty[id]--; updateBuy(); } else toast('Kamida 1 kishi'); });
$('#qPlus').addEventListener('click', () => { if (!cur || cur.kind !== 't') return; const t = cur.item, max = t.cap - t.taken; if ((qty[t.id] || 1) < max) { qty[t.id] = (qty[t.id] || 1) + 1; updateBuy(); } else toast('Faqat ' + max + ' ta bo\'sh joy bor'); });
$('#buyBtn').addEventListener('click', () => {
if (!cur) return;
if (cur.kind === 'r') { toggleCart(cur.item.id); return; }
if (cur.item.mine) { show('band'); return; }
openPay();
});
/* ---------- new listing ---------- */
let draft = [];
function openNewTour(){
const d = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
if (!$('#eDepDate').value) $('#eDepDate').value = d;
if (!$('#eRetDate').value) $('#eRetDate').value = d;
draft = []; $('#eThumbs').innerHTML = thumbsHTML(draft, 'data-ddel', 'eFile'); $('#eErr').hidden = true;
geoPick = null; if (formPin) { formPin.remove(); formPin = null; } setGeoHint('');
openSheet('#newTour'); paintDates(); initFormMap();
}
/* date fields show "18 noyabr" instead of the phone's 18.11.26 format */
function paintDates(){ ['eDepDate', 'eRetDate'].forEach(id => { const i = $('#' + id), sp = $('#' + id + 'Show'); if (sp) sp.textContent = i.value ? dLong(i.value) + ' ' + i.value.slice(0, 4) : I18N.t('Sanani tanlang'); }); }
['eDepDate', 'eRetDate'].forEach(id => { ['input', 'change'].forEach(ev => $('#' + id).addEventListener(ev, () => { if (id === 'eDepDate' && $('#eRetDate').value < $('#eDepDate').value) $('#eRetDate').value = $('#eDepDate').value; paintDates(); })); });
$('#eGeo').addEventListener('click', () => autoGeo(true));
['eQ', 'eName', 'ePlace'].forEach(id => $('#' + id).addEventListener('change', () => { if (id === 'eQ' && geoPick) geoPick.manual = false; autoGeo(); }));
$('#eFile').addEventListener('change', e => { addPhotos(draft, [...(e.target.files || [])], () => $('#eThumbs').innerHTML = thumbsHTML(draft, 'data-ddel', 'eFile')); e.target.value = ''; });
$('#eThumbs').addEventListener('click', e => { const b = e.target.closest('[data-ddel]'); if (!b) return; draft.splice(+b.dataset.ddel, 1); $('#eThumbs').innerHTML = thumbsHTML(draft, 'data-ddel', 'eFile'); });
$('#eCard').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
document.addEventListener('input', e => { if (e.target.classList) e.target.classList.remove('bad'); });
function showErr(sel, errs){ const el = $(sel); el.innerHTML = errs.map(x => `<span style="display:block">${esc(x)}</span>`).join(''); el.hidden = false; }
function validate(form, req){
const v = id => $('#' + id).value.trim();
form.querySelectorAll('.bad').forEach(x => x.classList.remove('bad'));
const missing = req.filter(([id]) => !v(id)); missing.forEach(([id]) => $('#' + id).classList.add('bad'));
return {v, errs: missing.length ? ['To\'ldiring: ' + missing.map(m => m[1]).join(', ') + '.'] : []};
}
$('#tourForm').addEventListener('submit', async e => {
e.preventDefault();
const {v, errs} = validate(e.target, [['eName','sayohat nomi'],['ePlace','joy'],['eDesc','tavsif'],['eDepDate','ketish sanasi'],['eDepTime','ketish vaqti'],['eRetDate','qaytish sanasi'],['eRetTime','qaytish vaqti'],['eMeet',"yig'ilish joyi"],['ePrice','narx'],['eCap','necha kishi'],['eHolder','karta egasi']]);
const card = v('eCard').replace(/\D/g, '');
if (card.length !== 16) { $('#eCard').classList.add('bad'); errs.push('Karta raqami 16 ta raqam bo\'lishi kerak.'); }
if (v('eDepDate') && v('eDepTime') && v('eRetDate') && v('eRetTime') && (v('eRetDate') + v('eRetTime')) <= (v('eDepDate') + v('eDepTime'))) { $('#eRetDate').classList.add('bad'); $('#eRetTime').classList.add('bad'); errs.push('Qaytish vaqti ketishdan keyin bo\'lishi kerak.'); }
if (v('ePrice') && +v('ePrice') < 1000) { $('#ePrice').classList.add('bad'); errs.push('Narx kamida 1 000 so\'m bo\'lsin.'); }
if (v('eCap') && (+v('eCap') < 1 || +v('eCap') > 60)) { $('#eCap').classList.add('bad'); errs.push('Guruh 1–60 kishi bo\'lishi mumkin.'); }
if (errs.length) { showErr('#eErr', errs); const f = e.target.querySelector('.bad'); if (f) f.focus(); return; }
const btn = e.target.querySelector('button[type=submit]'); busy(btn, true, 'Joylanmoqda…');
try {
if (!geoPick) { const g = await Promise.race([smartGeocode(v('eQ'), v('eName'), v('ePlace')), new Promise(r => setTimeout(() => r(null), 6000))]); if (g) geoPick = {lat:g.lat, lng:g.lng, addr:g.addr}; }
const mq = geoPick ? JSON.stringify({q:v('eQ') || v('eName'), lat:geoPick.lat, lng:geoPick.lng, addr:geoPick.addr || ''}) : (v('eQ') || null);
const photos = []; for (const d of draft) photos.push(await upload(d));
const { data, error } = await sb.from('tours').insert({owner_id:S.user.id, name:v('eName'), place:v('ePlace'), map_query:mq, description:v('eDesc'), level:$('#eLvl').value,
price:Math.round(+v('ePrice')), capacity:Math.round(+v('eCap')), meet_point:v('eMeet'), depart_at:`${v('eDepDate')}T${v('eDepTime')}:00+05:00`, return_at:`${v('eRetDate')}T${v('eRetTime')}:00+05:00`,
needs:v('eNeeds') ? v('eNeeds').split(',').map(x => x.trim()).filter(Boolean) : [], photos}).select().single();
if (error) throw error;
const { error: e2 } = await sb.from('tour_payouts').insert({tour_id:data.id, card_number:card, card_holder:v('eHolder')});
if (e2) throw e2;
e.target.reset(); draft = []; geoPick = null; closeSheet(); await refresh(); openItem('t:' + data.id); toast('E\'lon joylandi');
} catch (er) { fail(er); } finally { busy(btn, false); }
});
/* ---------- new rental ---------- */
let rdraft = [];
function openNewRent(){ rdraft = []; $('#rThumbs').innerHTML = thumbsHTML(rdraft, 'data-rdel', 'rFile'); $('#rErr').hidden = true; openSheet('#newRent'); }
$('#rFile').addEventListener('change', e => { addPhotos(rdraft, [...(e.target.files || [])], () => $('#rThumbs').innerHTML = thumbsHTML(rdraft, 'data-rdel', 'rFile')); e.target.value = ''; });
$('#rThumbs').addEventListener('click', e => { const b = e.target.closest('[data-rdel]'); if (!b) return; rdraft.splice(+b.dataset.rdel, 1); $('#rThumbs').innerHTML = thumbsHTML(rdraft, 'data-rdel', 'rFile'); });
$('#rentForm').addEventListener('submit', async e => {
e.preventDefault();
const {v, errs} = validate(e.target, [['rName','jihoz nomi'],['rPrice','narx'],['rWhere','qayerdan olinishi']]);
if (v('rPrice') && +v('rPrice') < 1000) { $('#rPrice').classList.add('bad'); errs.push('Narx kamida 1 000 so\'m bo\'lsin.'); }
if (errs.length) { showErr('#rErr', errs); return; }
const btn = e.target.querySelector('button[type=submit]'); busy(btn, true, 'Joylanmoqda…');
try {
const photos = []; for (const d of rdraft) photos.push(await upload(d));
const { data, error } = await sb.from('rentals').insert({owner_id:S.user.id, name:v('rName'), price:Math.round(+v('rPrice')), pickup:v('rWhere'), description:v('rDesc') || null, photos}).select().single();
if (error) throw error;
e.target.reset(); rdraft = []; closeSheet(); await refresh(); openItem('r:' + data.id); toast('Jihoz joylandi');
} catch (er) { fail(er); } finally { busy(btn, false); }
});
/* ---------- new post ---------- */
let pending = null;
const MAX_VIDEO = 50 * 1024 * 1024;
function clearVid(){ const v = $('#pVid'); if (v.src) { try { URL.revokeObjectURL(v.src); } catch (_) {} } v.removeAttribute('src'); v.hidden = true; }
function openCompose(){ pending = null; $('#postForm').reset(); $('#pPrev').hidden = true; clearVid(); $('#dropHint').hidden = false; $('#pErr').hidden = true; openSheet('#compose'); }
$('#pFile').addEventListener('change', e => { const f = e.target.files && e.target.files[0]; if (!f) return; $('#pErr').hidden = true;
const vid = f.type.startsWith('video/') || /\.(mp4|mov|webm|m4v)$/i.test(f.name);
if (vid) {
if (f.size > MAX_VIDEO) { $('#pErr').textContent = 'Video 50 MB dan katta. Qisqaroq video tanlang.'; $('#pErr').hidden = false; e.target.value = ''; return; }
clearVid(); pending = {video:f}; const v = $('#pVid'); v.src = URL.createObjectURL(f); v.hidden = false; $('#pPrev').hidden = true; $('#dropHint').hidden = true; return;
}
if (!f.type.startsWith('image/')) { $('#pErr').textContent = 'Rasm yoki video tanlang.'; $('#pErr').hidden = false; return; }
shrink(f, 1280, src => { clearVid(); pending = src; $('#pPrev').src = src; $('#pPrev').hidden = false; $('#dropHint').hidden = true; }); });
$('#postForm').addEventListener('submit', async e => {
e.preventDefault();
if (!pending) { $('#pErr').textContent = 'Avval rasm yoki video tanlang.'; $('#pErr').hidden = false; return; }
const btn = e.target.querySelector('button[type=submit]'); busy(btn, true, pending.video ? 'Video yuklanmoqda…' : 'Joylanmoqda…');
try {
let url;
if (pending.video) { const f = pending.video, ext = ((f.name.match(/\.(mp4|mov|webm|m4v)$/i) || [])[1] || (f.type.includes('webm') ? 'webm' : f.type.includes('quicktime') ? 'mov' : 'mp4')).toLowerCase(); url = await uploadBlob(f, ext, f.type || 'video/mp4'); }
else url = await upload(pending);
const { data, error } = await sb.from('posts').insert({owner_id:S.user.id, photo_url:url, place:$('#pPlace').value.trim() || null, caption:$('#pCap').value.trim() || null}).select().single();
if (error) throw error;
clearVid(); closeSheet(); await refresh(); show('sayohat'); setTimeout(() => { const el = $('#post-' + data.id); if (el) el.scrollIntoView({behavior:reduce ? 'auto' : 'smooth', block:'center'}); }, 150); toast('Rasm joylandi');
} catch (er) { fail(er); } finally { busy(btn, false); }
});
/* ---------- profile photo ---------- */
$('#avFile').addEventListener('change', e => { const f = e.target.files && e.target.files[0]; if (!f) return; if (!f.type.startsWith('image/')) { toast('Rasm fayl tanlang'); return; } shrink(f, 400, async src => {
try { const url = await upload(src); const { error } = await sb.from('profiles').update({avatar_url:url}).eq('id', S.user.id); if (error) throw error; S.user.avatar_url = url; if (S.profiles[S.user.id]) S.profiles[S.user.id].avatar_url = url; rerender(); toast('Profil rasmi yangilandi'); } catch (er) { fail(er); }
}); e.target.value = ''; });
/* ---------- global clicks ---------- */
let lastTap = {id:null, t:0};
document.addEventListener('click', e => {
const t = e.target;
if (t.closest('[data-back]')) { show(prevView); return; }
const go = t.closest('[data-go]'); if (go) { openItem(go.dataset.go); return; }
const cart = t.closest('[data-cart]'); if (cart) { e.stopPropagation(); toggleCart(cart.dataset.cart); return; }
const op = t.closest('[data-open]'); if (op && !t.closest('button')) { openItem(op.dataset.open); return; }
const bo = t.closest('[data-bookopen]'); if (bo) { if (openItem('t:' + bo.dataset.bookopen) && !cur.item.mine) openPay(); return; }
const cx = t.closest('[data-cancel]'); if (cx) { cancelBooking(cx.dataset.cancel); return; }
const lk = t.closest('[data-like]'); if (lk) { setLike(lk.dataset.like); return; }
const cm = t.closest('[data-cmts]'); if (cm) { openCmts(cm.dataset.cmts); return; }
const sh = t.closest('[data-share]'); if (sh) { openShare(sh.dataset.share); return; }
const dp = t.closest('[data-delpost]'); if (dp) { ask('Rasmni o\'chirasizmi?', 'Uni qayta tiklab bo\'lmaydi.', async () => { const { error } = await sb.from('posts').delete().eq('id', dp.dataset.delpost); if (error) return fail(error); await refresh(); toast('Rasm o\'chirildi'); }); return; }
const dt = t.closest('[data-deltour]'); if (dt) { ask('E\'lonni o\'chirasizmi?', 'E\'lon va band qilganlar ro\'yxati butunlay o\'chadi.', async () => { const { error } = await sb.from('tours').delete().eq('id', dt.dataset.deltour); if (error) return fail(error); await refresh(); show('profil'); toast('E\'lon o\'chirildi'); }); return; }
const dr = t.closest('[data-delrent]'); if (dr) { ask('Jihozni o\'chirasizmi?', 'E\'lon butunlay o\'chadi.', async () => { const { error } = await sb.from('rentals').delete().eq('id', dr.dataset.delrent); if (error) return fail(error); await refresh(); show('profil'); toast('Jihoz o\'chirildi'); }); return; }
const tp = t.closest('[data-tap]');
if (tp) { const id = tp.dataset.tap, now = Date.now(); if (lastTap.id === id && now - lastTap.t < 350) { setLike(id, true); const bu = tp.querySelector('.burst'); bu.classList.remove('go'); void bu.offsetWidth; bu.classList.add('go'); lastTap = {id:null, t:0}; } else lastTap = {id, t:now}; return; }
const a = t.closest('[data-act]'); if (!a) return;
e.preventDefault();
const act = a.dataset.act;
if (act === 'photo') openCompose();
else if (act === 'elon') openNewTour();
else if (act === 'ijara') openNewRent();
else if (act === 'lang') openLang();
else if (act === 'help') toast('Favqulodda holatda 112 raqamiga qo\'ng\'iroq qiling');
else if (act === 'logout') ask('Akkauntdan chiqasizmi?', 'Qayta kirish uchun Telegram botdan yangi kod olasiz.', async () => { await sb.auth.signOut(); S.user = null; showAuth(); });
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-open]')) openItem(e.target.dataset.open); if (e.key === 'Escape') closeSheet(); });
$$('.pill-nav [data-v]').forEach(b => b.addEventListener('click', () => show(b.dataset.v)));
$('#filters').addEventListener('click', e => { const c = e.target.closest('button'); if (!c) return; filter = c.dataset.f; $$('#filters button').forEach(x => x.setAttribute('aria-pressed', x === c)); renderTours(); });
$('#q').addEventListener('input', renderTours);
$('#viewSw').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) setHomeView(b.dataset.view); });
/* ---------- language ---------- */
function paintLangPicks(){ $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === I18N.lang)); }
function openLang(){ paintLangPicks(); openSheet('#langSheet'); }
document.addEventListener('click', e => { const b = e.target.closest('[data-lang]'); if (!b) return; I18N.set(b.dataset.lang); paintLangPicks(); rerender(); paintDates(); if (!$('#langSheet').hidden) setTimeout(closeSheet, 250); });
paintLangPicks();
$('#sform').addEventListener('submit', e => { e.preventDefault(); renderTours(); });
$('#bell').addEventListener('click', () => toast('Hozircha yangi bildirishnoma yo\'q'));
/* ---------- registration via Telegram bot code ---------- */
let pendingUser = null;
function showAuth(){ closeSheet(); $('#auth').hidden = false; $('#authStep1').hidden = false; $('#authStep2').hidden = true; $('#aErr1').hidden = true; document.body.classList.add('booting'); setTimeout(() => $('#aFirst').focus(), 50); }
$('#aPhone').addEventListener('input', e => { const d = e.target.value.replace(/\D/g, '').slice(0, 9); e.target.value = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' '); $('#aPhoneBox').classList.remove('bad'); });
$('#authStep1').addEventListener('submit', e => {
e.preventDefault();
const first = $('#aFirst').value.trim(), last = $('#aLast').value.trim(), phone = $('#aPhone').value.replace(/\D/g, '');
const errs = [];
$('#aFirst').classList.toggle('bad', first.length < 2); $('#aLast').classList.toggle('bad', last.length < 2); $('#aPhoneBox').classList.toggle('bad', phone.length !== 9);
if (first.length < 2) errs.push('ismingizni'); if (last.length < 2) errs.push('familiyangizni'); if (phone.length !== 9) errs.push('9 xonali telefon raqamingizni');
if (errs.length) { $('#aErr1').textContent = 'Iltimos, ' + errs.join(', ') + ' kiriting.'; $('#aErr1').hidden = false; return; }
pendingUser = {first, last, phone};
$('#aSentTo').textContent = `+998 ${$('#aPhone').value} uchun kodni Telegram botimizdan oling: botni oching, Start'ni bosing va «Raqamni ulashish» tugmasi orqali shu raqamni yuboring.`;
$('#aCode').value = ''; $('#aErr2').hidden = true;
$('#authStep1').hidden = true; $('#authStep2').hidden = false;
});
$('#aCode').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); $('#aErr2').hidden = true; });
const AUTH_ERR = {no_code:'Avval Telegram botdan kod oling. Botga shu raqam bilan ro\'yxatdan o\'tgan Telegram akkauntidan kiring.', expired:'Kod muddati tugadi. Botdan yangi kod oling.', too_many_tries:'Kod ko\'p marta noto\'g\'ri kiritildi. Botdan yangi kod oling.', bad_input:'Telefon raqam yoki kod noto\'g\'ri.'};
$('#authStep2').addEventListener('submit', async e => {
e.preventDefault();
const c = $('#aCode').value;
if (c.length !== 4) { $('#aErr2').textContent = '4 xonali kodni kiriting.'; $('#aErr2').hidden = false; return; }
const btn = e.target.querySelector('button[type=submit]'); busy(btn, true, 'Tekshirilmoqda…');
try {
const r = await fetch(SB_URL + '/functions/v1/telegram-auth', {method:'POST', headers:{'Content-Type':'application/json', apikey:SB_KEY, Authorization:'Bearer ' + SB_KEY}, body:JSON.stringify({phone:'+998' + pendingUser.phone, code:c, first_name:pendingUser.first, last_name:pendingUser.last})});
const j = await r.json().catch(() => ({}));
if (!j.ok) { $('#aErr2').textContent = j.error === 'wrong_code' ? `Kod noto'g'ri. Yana ${j.tries_left} ta urinish qoldi.` : (AUTH_ERR[j.error] || 'Kirib bo\'lmadi. Birozdan keyin qayta urinib ko\'ring.'); $('#aErr2').hidden = false; return; }
const { error } = await sb.auth.setSession({access_token:j.access_token, refresh_token:j.refresh_token});
if (error) throw error;
await startSession(j.user_id);
$('#auth').hidden = true; document.body.classList.remove('booting');
show('sayohat'); toast(`Xush kelibsiz, ${pendingUser.first}!`);
if (location.hash) route();
} catch (er) { $('#aErr2').textContent = navigator.onLine ? 'Server bilan bog\'lanib bo\'lmadi. Qayta urinib ko\'ring.' : 'Internet aloqasi yo\'q.'; $('#aErr2').hidden = false; console.error(er); }
finally { busy(btn, false); }
});
$('#aBack').addEventListener('click', () => { $('#authStep2').hidden = true; $('#authStep1').hidden = false; });
$('#aResend').addEventListener('click', () => window.open(BOT, '_blank', 'noopener'));
async function startSession(id){ S.user = {id}; await loadAll(); rerender(); }
/* ---------- hero spark ---------- */
(function spark(){ const p = $('#ridgePath'), c = $('#spark'); if (!p || reduce) { if (c) c.remove(); return; } const len = p.getTotalLength(), t0 = performance.now(); const step = now => { const pt = p.getPointAtLength(len * (((now - t0) % 5200) / 5200)); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); requestAnimationFrame(step); }; requestAnimationFrame(step); })();
/* ---------- boot ---------- */
const boot = $('#boot'); let bootDone = false, dataReady = false;
document.body.classList.add('booting');
function afterBoot(){
if (!bootDone || !dataReady) return;
boot.classList.add('done');
if (!S.user) showAuth();
else { document.body.classList.remove('booting'); observe($('#v-sayohat')); if (location.hash) route(); }
}
function endBoot(){ if (bootDone) return; bootDone = true; afterBoot(); }
$('#skip').addEventListener('click', endBoot);
setTimeout(endBoot, reduce ? 0 : 2800);
rerender();
(async () => {
try {
const { data: { session } } = await sb.auth.getSession();
if (session) await startSession(session.user.id); else { await loadAll(); rerender(); }
} catch (e) { console.error(e); toast(navigator.onLine ? 'Server bilan bog\'lanib bo\'lmadi' : 'Internet aloqasi yo\'q'); }
dataReady = true; afterBoot();
})();
sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') { S.user = null; } });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
