/* 기관 지도: Leaflet 지도 · 지역 탭 · 축 필터 · 기관 목록/상세. 고른 기관은 #<기관 id> 로 남는다 */
(function () {
  'use strict';
  const I = A.data('inst'), OV = A.data('overview');
  if (!I) return;
  // 구조 표의 inst 참조를 뒤집어 기관 → 구조 (구조 이름은 구조 표에서)
  const MADE = {};
  ((OV && OV.S) || []).forEach(s => (s.inst || []).forEach(i => { (MADE[i] = MADE[i] || []).push(s); }));
  const D = I.D, LBL = I.LBL, U = I.UI || {};
  // 연구자 → 분야 이름, 분야 이름 → 한 줄 풀이(옛 용어집 「기타」)
  const FIELD = I.FIELD || {}, FIELDS = I.FIELDS || {};
  const PRIV = A.hasPrivate('inst');
  const NT = A.hasPrivate('notes') ? A.data('notes') : null;   // 노트 연결(개인판만)
  const PS = A.hasPrivate('pi') ? A.data('pi') : null;          // PI 현직·모집(개인판만)
  // 기관 PI 한 줄(이름 칸)에 들어 있는 pi.json 사람들
  const piStat = (d, nm) => ((PS && PS[d.id]) || []).filter(q => q.name && nm.toLowerCase().includes(q.name.split(/[\s(]/).filter(Boolean).slice(-1)[0].toLowerCase()));
  const recruits = d => ((PS && PS[d.id]) || []).some(q => q.recruiting === '예');
  const LB = A.data('inst-labs'), LI = (LB && LB.I) || {};
  const GB = A.data('inst-groups'), GI = (GB && GB.G) || {};       // 컨소시엄·포럼 회원·참여기관(scripts/inst_groups.py)
  const GOF = {};                                                  // 지도 기관 → 그 기관이 든 컨소시엄들
  Object.entries(GI).forEach(([g, x]) => x.mem.forEach(m => { if (m.to) (GOF[m.to] = GOF[m.to] || []).push(g); }));       // 기관별 연구실(OpenAlex, scripts/inst_labs.py)
  const SBAD = { '이동': 'mv', '은퇴·명예': 'rt', '휴직·겸직': 'lv', '창업': 'mv', '신규부임': 'nw', '미확인': 'uk' };
  const { h, mount, $ } = A;

  const C = [['all', '전체', [[-46, -128], [66, 158]]], ['uk', '영국', [[49.4, -7.8], [59.2, 2.6]]], ['de', '독일', [[46.8, 4.8], [55.6, 15.8]]], ['us', '미국', [[23.5, -127], [50, -64]]], ['ca', '캐나다', [[41.5, -130], [56, -60]]],
    ['fr', '프랑스', [[41, -5.8], [51.8, 10.2]]], ['it', '이탈리아', [[35.8, 5.6], [47.8, 19.4]]], ['ch', '스위스', [[45.6, 5.5], [48.1, 10.9]]], ['eu2', '유럽 기타', [[35, -11.5], [70, 32]]],
    ['as', '아시아', [[-1, 96], [47, 148]]], ['au', '호주', [[-45, 110], [-9, 156]]], ['etc', '그 밖', [[-46, -128], [66, 158]]]];
  if (A.lang === 'en') {
    const CN = { all: 'All', uk: 'UK', de: 'Germany', us: 'US', ca: 'Canada', fr: 'France', it: 'Italy', ch: 'Switzerland', eu2: 'Rest of Europe', as: 'Asia', au: 'Australia', etc: 'Elsewhere' };
    C.forEach(c => { c[1] = CN[c[0]] || c[1]; });
  }
  const PN = U.PN || {};
  const EK = A.lang === 'en' ? { p: 'Co-authored papers', m: 'Moves · lineage', i: 'Agreements · joint operation', s: 'Spin-offs · acquisitions' } : { p: '논문 공저', m: '이동·계보', i: '협약·공동운영', s: '스핀오프·인수' };
  const stars = d => U.star ? (d.fit || '').split(U.star).length - 1 : 0;   // 개인판 UI.star
  const kc = k => 'k-' + (k in LBL || k === 'x' ? k : 'comp');
  // 층 — work 에서. 점·마커 색은 층 색(EO 는 고리). work 가 없는 기관만 옛 축(k)으로
  const LAYERS = ['L2', 'L3', 'L4', 'L5', 'L6', 'EO'];
  const LN = A.lang === 'en' ? { L2: 'Materials · process', L3: 'Devices', L4: 'Structures', L5: 'Computers', L6: 'Industry', EO: 'EO co-integration' }
    : { L2: '재료·공정', L3: '소자', L4: '구조', L5: '계산기', L6: '산업', EO: 'EO 공동집적' };
  const layersOf = d => LAYERS.filter(l => (d.work || []).some(w => w.l === l));
  const lcls = d => (d.work && d.work.length) ? 'l-' + d.work[0].l : kc(d.k);
  const DEVN = A.data('dev-names') || {}, PARAN = A.data('para-names') || {}, PSH = A.data('para-short') || {};
  // 종류(갈래) 태그 — work 의 para 참조, struct 참조→그 구조의 갈래, 구조 표의 inst 역참조. 순서는 갈래 표 순
  const KINDS = Object.keys(PSH).filter(k => k !== 'etc');
  const SPARA = {}; (((OV && OV.S) || [])).forEach(s => { SPARA[s.id] = s.para; });
  const kindsOf = d => {
    const set = new Set();
    (d.work || []).forEach(w => { const r = w.ref || {}; if (r.para) set.add(r.para); if (r.struct && SPARA[r.struct]) set.add(SPARA[r.struct]); });
    (MADE[d.id] || []).forEach(s => { if (s.para) set.add(s.para); });
    return KINDS.filter(k => set.has(k));
  };
  const st = { cur: 'all', flt: 'all', sel: null, q: '', rec: false, auto: false };
  const store = (k, v) => { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
  st.auto = !!store('in-autoln');
  let cart = PRIV ? (store('in-cart') || []) : [];

  /* 사람(관계도 노드) → 기관 */
  const instOfNode = {};
  I.NODES.forEach(n => {
    const ln = n.l.toLowerCase();
    let d = D.find(x => (x.pi || []).some(([nm]) => nm.toLowerCase().includes(ln)));
    if (!d) { const tok = n.o.split(/[\s·→(]/)[0]; d = D.find(x => x.n.includes(tok) || (x.city || '').includes(tok)); }
    if (d) instOfNode[n.id] = d;
  });
  const nodeById = Object.fromEntries(I.NODES.map(n => [n.id, n]));
  const relsOf = d => I.EDGES.filter(e => instOfNode[e.a] === d || instOfNode[e.b] === d).map(e => {
    const mine = instOfNode[e.a] === d ? e.a : e.b, other = mine === e.a ? e.b : e.a;
    return { e, me: nodeById[mine], ot: nodeById[other], od: instOfNode[other] };
  });

  const inAxis = d => (st.flt === 'all' || (d.work || []).some(w => w.l === st.flt)) && (st.kind === 'all' || kindsOf(d).includes(st.kind))
    && (st.ax === 'all' || d.k === st.ax || (d.t || []).includes(st.ax));

  const fold1 = s => String(s || '').toLowerCase();
  const SEARCH = {};
  D.forEach(d => { SEARCH[d.id] = fold1([d.n, d.w, d.city].concat((d.pi || []).map(p => p[0]), ((LI[d.id] || {}).labs || []).map(L => L.pi)).join(' ')); });
  const match = d => inAxis(d) && (!st.rec || recruits(d)) && (!st.q || SEARCH[d.id].includes(fold1(st.q)));
  const inRegion = d => st.cur === 'all' || d.p === st.cur;

  /* 지도 */
  const mapEl = $('#in-map');
  mount('#in-mapnote', String(U.mapnote || '').replace('{n}', D.length) + A.t(' · 확대는 +− 또는 ⌘+휠', ' · zoom with +− or ⌘+wheel'));
  // 휠은 페이지 스크롤에 양보한다(지도가 본문 위에 있어 휠이 지도에 먹히면 아래로 못 내려간다). 확대는 +− · 더블클릭 · ⌘/Ctrl+휠
  const map = L.map(mapEl, { zoomControl: true, worldCopyJump: true, minZoom: 2, zoomSnap: 0.5, zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false, scrollWheelZoom: false }).setView([30, 20], 2);
  mapEl.addEventListener('wheel', e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); map.scrollWheelZoom.enable(); setTimeout(() => map.scrollWheelZoom.disable(), 400); } }, { passive: false });
  const sized = () => mapEl.clientWidth > 0 && mapEl.clientHeight > 0;
  let pendingFit = [C[0][2], {}];
  const fitTo = (b, o) => { if (!sized()) { pendingFit = [b, o]; return; } map.invalidateSize(); map.fitBounds(b, o); };
  new ResizeObserver(() => { if (!sized()) return; map.invalidateSize(); if (pendingFit) { const [b, o] = pendingFit; pendingFit = null; map.fitBounds(b, o); } }).observe(mapEl);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' }).addTo(map);
  L.control.scale({ imperial: false, maxWidth: 140 }).addTo(map);
  const linkLayer = L.layerGroup().addTo(map);
  const mk = {};
  D.forEach(d => {
    const tip = A.esc(d.n) + (PRIV && d.fit ? ` <span class="in-fit">${A.esc(d.fit)}</span>` : '');
    mk[d.id] = L.circleMarker([d.lat, d.lon], { radius: 4 + (d.r || 6) * 0.75, className: 'in-m ' + lcls(d) + (PRIV && stars(d) >= 3 ? ' s3' : '') })
      .bindTooltip(tip, { className: 'in-tip', direction: 'top', offset: [0, -6] })
      .on('click', () => pick(d.id)).addTo(map);
  });
  function restyle() {
    D.forEach(d => {
      const m = mk[d.id];
      const p = m.getElement();
      if (!p) return;
      p.classList.toggle('off', !(inRegion(d) && match(d)));
      p.classList.toggle('sel', st.sel === d.id);
      if (st.sel === d.id) m.bringToFront();
    });
  }
  function drawLinks(d) {
    linkLayer.clearLayers();
    $('#in-legend').hidden = !d;
    if (!d) return;
    relsOf(d).forEach(({ e, od }) => {
      if (!od || od === d) return;
      L.polyline([[d.lat, d.lon], [od.lat, od.lon]], { weight: 2.4, className: 'in-e e-' + (EK[e.k] ? e.k : 'p') }).addTo(linkLayer);
    });
    $('#in-legend').classList.toggle('auto', st.auto);
    // OpenAlex 공저 — 손으로 확인한 연결과 겹치지 않는 것만 얇게(「자동 연결선 보기」를 켰을 때)
    const hand = new Set(relsOf(d).map(r => r.od && r.od.id));
    (st.auto ? (LI[d.id] || {}).links || [] : []).forEach(l => {
      const od = D.find(x => x.id === l.to);
      if (!od || hand.has(od.id)) return;
      L.polyline([[d.lat, d.lon], [od.lat, od.lon]], { weight: 1 + Math.min(l.n, 6) * 0.4, className: 'in-e e-oa' })
        .bindTooltip(A.esc(od.n) + A.t(` · 공저 ${l.n}편`, ` · ${l.n} co-authored`), { className: 'in-tip', sticky: true })
        .on('click', () => pick(od.id)).addTo(linkLayer);
    });
    // 회원·참여 — 컨소시엄을 고르면 회원들로, 회원을 고르면 든 컨소시엄들로
    const grp = GI[d.id] ? GI[d.id].mem.filter(m => m.to).map(m => m.to) : st.auto ? (GOF[d.id] || []) : [];
    grp.forEach(id => {
      const od = D.find(x => x.id === id);
      if (!od || hand.has(od.id)) return;
      L.polyline([[d.lat, d.lon], [od.lat, od.lon]], { weight: 1.2, className: 'in-e e-grp' })
        .bindTooltip(A.esc(od.n) + A.t(' · 회원·참여', ' · member'), { className: 'in-tip', sticky: true })
        .on('click', () => pick(od.id)).addTo(linkLayer);
    });
  }

  /* 탭 */
  function drawTabs() {
    mount('#in-ctabs', C.map(([id, nm, b]) => A.pill([nm, h('span.n', String(id === 'all' ? D.length : D.filter(d => d.p === id).length))], st.cur === id, () =>
      A.route.go('', '', { params: { cur: id === 'all' ? null : id } }))));
    const keys = ['all'].concat(LAYERS.filter(l => l !== 'EO' && D.some(d => (d.work || []).some(w => w.l === l))));
    mount('#in-ftabs', keys.map(k => h('button.chip' + (st.flt === k ? '.on' : ''), { type: 'button', 'aria-pressed': st.flt === k ? 'true' : 'false',
      onclick: () => A.route.set({ flt: k === 'all' ? null : k }) }, k === 'all' ? null : h('span.in-dot.l-' + k), k === 'all' ? A.t('전체', 'All') : (k === 'EO' ? LN.EO : k + ' ' + LN[k]))));
    const an = {}; D.forEach(d => new Set([d.k].concat(d.t || [])).forEach(k => { if (k in LBL) an[k] = (an[k] || 0) + 1; }));
    mount('#in-atabs', ['all'].concat(Object.keys(LBL).filter(k => an[k])).map(k => h('button.chip' + (st.ax === k ? '.on' : ''), { type: 'button', 'aria-pressed': st.ax === k ? 'true' : 'false',
      onclick: () => A.route.set({ ax: k === 'all' ? null : k }) }, k === 'all' ? A.t('전체', 'All') : LBL[k], k === 'all' ? null : h('span.n', String(an[k])))));
    const kn = {}; D.forEach(d => kindsOf(d).forEach(k => { kn[k] = (kn[k] || 0) + 1; }));
    mount('#in-ktabs', ['all'].concat(KINDS.filter(k => kn[k])).map(k => h('button.chip' + (st.kind === k ? '.on' : ''), { type: 'button', 'aria-pressed': st.kind === k ? 'true' : 'false',
      onclick: () => A.route.set({ kind: k === 'all' ? null : k }) }, k === 'all' ? A.t('전체', 'All') : PSH[k], k === 'all' ? null : h('span.n', String(kn[k])))));
  }

  /* 지도 아래: 지역이 묶음(갈래 자리), 기관이 카드. 점 = 층 색(EO 는 고리) */
  const linkN = {};
  D.forEach(d => { linkN[d.id] = relsOf(d).length; });
  function card(d) {
    const first = (d.pi || [])[0];
    const ls = layersOf(d), ks = ls.length ? [] : [d.k].concat((d.t || []).filter(t => t !== d.k));
    return h('a.in-card' + (match(d) ? '' : '.dim'), { href: A.route.href('', d.id), onclick: e => { e.preventDefault(); pick(d.id); } },
      h('span.in-ch', PRIV && d.fit ? h('span.in-fit', d.fit) : null, h('b', d.n),
        (d.t || []).includes('ind') ? h('span.in-badge.co', A.t('기업', 'Company')) : null,
        recruits(d) ? h('span.in-badge.rc', A.t('모집', 'Hiring')) : null,
        h('span.in-dots', ls.map(l => h('i.in-dot.l-' + l, { title: l === 'EO' ? LN.EO : l + ' ' + LN[l] })), ks.map(k => h('i.in-dot.' + kc(k), { title: LBL[k] || k })))),
      h('span.in-meta', (d.city || '') + (MADE[d.id] ? A.t(` · 구조 ${MADE[d.id].length}`, ` · ${MADE[d.id].length} structures`) : '') + (linkN[d.id] ? A.t(` · 연결 ${linkN[d.id]}`, ` · ${linkN[d.id]} links`) : '')),
      kindsOf(d).length ? h('span.in-kinds', kindsOf(d).map(k => h('span.in-kd' + (st.kind === k ? '.on' : ''), PSH[k]))) : null,
      first ? h('span.in-sub', first[0] + (FIELD[first[0]] ? ' · ' + FIELD[first[0]] : '')) : null);
  }
  function lanes() {
    const rows = C.slice(1).filter(([id]) => st.cur === 'all' || id === st.cur).map(([id, nm]) => {
      const items = D.filter(d => d.p === id && (!PRIV || match(d))).sort((a, b) => stars(b) - stars(a) || a.n.localeCompare(b.n, 'ko'));
      if (!items.length) return null;
      return h('section.in-lane', h('header', h('h2', nm, h('span.n', String(items.length))), PN[id] ? h('p.in-pn', PN[id]) : null),
        h('div.in-cards', items.map(card)));
    });
    // 주장·주의는 목록 아래 본문으로
    mount('#in-lanes', rows, h('div.in-read',
      U.warn ? h('p', { html: U.warn }) : null,
      h('p', h('b', A.t(`연결 ${I.EDGES.length}건은 근거가 확인된 것만이다.`, `The ${I.EDGES.length} links are confirmed ones only.`)),
        A.t(' 논문 공저 · 이동과 계보 · 협약과 공동운영 · 스핀오프와 인수 네 가지이고, 기관을 고르면 지도에 선으로 그린다.', ' Four kinds — co-authored papers, moves and lineage, agreements and joint operation, spin-offs and acquisitions — drawn as lines on the map when an institution is selected.'))));
  }
  function noteBlock(d) {
    const NB = U.note;
    if (!NT || !NB) return null;
    const ns = NOTE_OF[d.id];
    if (!ns) return h('div.in-nonote', h('span.lb', NB.label), NB.empty);
    return h('div.in-notes', h('span.lb', NB.label), ns.map(n => {
      const home = n.home in (NT.HOME || {}) ? n.home : 'none';
      return h('a.in-note', { href: NB.href + n.id },
        h('span', h('b', n.t), ' ', h('span.in-home.h-' + home, (NT.HOME || {})[home] || ''), n.move ? h('span.in-move', ' ⚠') : null),
        h('span.in-path', n.path),
        n[NB.judge] ? h('span.in-judge', n[NB.judge]) : null);
    }));
  }
  const lastTok = n => (String(n).split('(')[0].trim().split(/[\s-]+/).slice(-1)[0] || '').toLowerCase();   // 「Errando-Herranz」 = 「Errando Herranz」
  // 손으로 조사한 PI 와 논문으로 묶은 연구실(마지막 저자)을 한 사람 목록으로 — 이름 끝 낱말·첫 글자가 같으면 같은 사람
  function people(d) {
    const labs = ((LI[d.id] || {}).labs || []).slice(), used = new Set(), out = [];
    (d.pi || []).forEach(([nm, t]) => {
      const L = labs.find(L => !used.has(L.id) && lastTok(L.pi) === lastTok(nm) && L.pi[0].toLowerCase() === nm.trim()[0].toLowerCase());
      if (L) used.add(L.id);
      out.push({ nm, t, L });
    });
    labs.filter(L => !used.has(L.id)).sort((a, b) => b.n - a.n).forEach(L => out.push({ nm: null, t: null, L }));
    return out;
  }
  const recentOf = d => { const x = LI[d.id] || {}; return Math.max(0, ...(x.labs || []).map(L => (L.r || {}).y || 0), ...(x.aff ? (x.p || []).map(p => p.y) : [])); };
  const paper = (tag, p, old) => h('span.pa', h('span.tg' + (old ? '.old' : ''), tag), p.doi ? h('a', { href: 'https://doi.org/' + p.doi, target: '_blank', rel: 'noopener' }, p.t) : h('span', p.t));
  function person(d, { nm, t, L }) {
    const ss = nm ? piStat(d, nm) : [], f = nm && FIELD[nm];
    const top = L && L.p && L.p[0];
    return h('div.in-pp',
      h('span.nm', h('b', nm || L.pi), f ? h('span.in-field', { title: String(FIELDS[f] || '').replace(/<[^>]+>/g, '') }, f) : null,
        nm ? h('span.in-badge.hd', A.t('손 조사', 'curated')) : null, L ? h('span.in-badge.au', A.t('논문으로 묶음', 'from papers')) : null,
        ss.map(q => [q.status && q.status !== '현직' ? h('span.in-badge.s-' + (SBAD[q.status] || 'uk'), { title: q.detail || '' }, (ss.length > 1 ? q.name.split(' ').slice(-1)[0] + ' ' : '') + q.status) : null,
          q.recruiting === '예' ? h('span.in-badge.rc', { title: q.detail || '' }, A.t('모집 중', 'Recruiting')) : null]),
        L ? h('a.in-oa', { href: 'https://openalex.org/' + L.id, target: '_blank', rel: 'noopener' }, 'OpenAlex') : null),
      t ? h('span.ds', { html: t }) : null,
      L ? h('span.st', A.t(`분야 논문 ${L.n}편 · 피인용 ${L.c.toLocaleString()} · 함께 쓴 사람 ${L.nm}명`, `${L.n} papers · ${L.c.toLocaleString()} cites · ${L.nm} co-authors`)) : null,
      L && L.r ? paper(A.t('최근 ', 'Latest ') + L.r.y, L.r) : null,
      top && (!L.r || top.doi !== L.r.doi || top.t !== L.r.t) ? paper(A.t(`대표 ${top.y} · 피인용 ${top.c}`, `Top ${top.y} · ${top.c} cites`), top, true) : null,
      L && L.mem.length ? h('span.mm', L.mem.slice(0, 5).map(([n, k]) => `${n} (${k})`).join(', ')) : null);
  }
  function peopleBlock(d) {
    const ppl = people(d);
    if (!ppl.length) return null;
    const head = ppl.filter(p => p.nm || (p.L && p.L.n >= 2)).slice(0, 8), rest = ppl.filter(p => !head.includes(p));
    return h('div.in-col', h('span.lb', A.t(`그룹장 ${ppl.length}명 — 손으로 조사한 PI와 논문으로 묶은 연구실`, `${ppl.length} group leaders — curated PIs and paper-derived labs`)),
      h('div.in-ppl', head.map(p => person(d, p))),
      rest.length ? h('details.in-fold', h('summary', A.t(`논문 1편짜리 그룹 ${rest.length}곳 더`, `${rest.length} more one-paper groups`)), h('div.in-ppl', rest.map(p => person(d, p)))) : null,
      LI[d.id] ? h('p.in-pinote', A.t(`OpenAlex ${LB.META.since}년 이후 포토닉스 논문 기준 · 연구실 = 마지막 저자(그룹장) · 「최근」은 가장 새 논문, 「대표」는 피인용 1위`, `OpenAlex since ${LB.META.since} · lab = last author · "latest" = newest, "top" = most cited`)
        + (PS ? A.t(' · 배지 없음 = 현직 확인 또는 조사 기록 없음 · 「모집 중」은 연구실 페이지에 문구가 있을 때만', ' · no badge = in post or not checked') : '')) : null);
  }
  const fold = (title, meta, body, open) => body ? h('details.in-fold', open ? { open: true } : {}, h('summary', title, meta ? h('span.muted', meta) : null), body) : null;
  function railDetail(d) {
    const rels = relsOf(d);
    const c = C.find(x => x[0] === d.p), x = LI[d.id];
    const ppl = people(d), mine = (PS && PS[d.id]) || [];
    const recN = mine.filter(q => q.recruiting === '예').length, curN = mine.filter(q => q.status === '현직').length;
    const yr = recentOf(d), sp = rels.filter(r => r.e.k === 's');
    const cell = (k, v, sm) => h('div', h('div.k', k), h('div.v', String(v), sm ? h('small', ' ' + sm) : null));
    const inCart = cart.includes(d.id);
    const workBody = [
      (d.work || []).length ? h('div.in-col', h('span.lb', A.t('층 · 무엇 · 우리 표의 자리 · 근거', 'Layer · what · where it sits · source')),
        h('div.in-work', d.work.map(w => {
          const r = w.ref || {};
          const link = r.struct ? ['compute.html#' + r.struct, A.tr((((OV && OV.S) || []).find(x => x.id === r.struct) || {}).short || r.struct)] : r.dev ? ['devices.html#' + r.dev, DEVN[r.dev] || r.dev]
            : r.term ? ['glossary.html#' + encodeURIComponent(r.term), r.term] : r.para ? ['compute.html', PARAN[r.para] || r.para] : null;
          const yr = (String(w.src || '').match(/\((\d{4})[^)]*\)\s*$/) || [])[1], url = String(w.src || '').replace(/\s*\([^)]*\)\s*$/, '');
          return h('div.in-wk', h('span.in-wl.l-' + w.l, w.l), h('span.in-ww', w.what,
            link ? h('a.in-wr', { href: link[0] }, link[1]) : null,
            w.who ? h('span.in-wwho', w.who) : null,
            url ? h('a.in-wsrc', { href: url, target: '_blank', rel: 'noopener' }, A.t('근거', 'source') + (yr ? ' ' + yr : '')) : null));
        }))) : null,
      kindsOf(d).length ? h('div.in-col', h('span.lb', A.t('종류', 'Kinds')),
        h('div.in-kinds.big', kindsOf(d).map(k => h('a.in-kd', { href: 'compute.html#kind/' + k, title: PARAN[k] || k }, PARAN[k] || PSH[k])))) : null,
      h('div.in-tags', (d.t || []).map(t => h('span.in-tag', LBL[t] || t))),
      d.fab ? h('dl.in-dl', h('dt', A.t('팹', 'Fab')), h('dd', { html: d.fab })) : null,
      MADE[d.id] ? h('div.in-col', h('span.lb', A.t(`여기서 나온 구조 ${MADE[d.id].length}개`, `${MADE[d.id].length} structures from here`)),
        h('div.in-made', MADE[d.id].map(s => h('a.in-mk', { href: 'compute.html#' + s.id }, h('b', A.tr(s.short)), h('span', s.id.toUpperCase()))))) : null];
    const oaRel = x && !x.aff && x.links.length ? h('div.in-rels', x.links.map(l => { const od = D.find(y => y.id === l.to); return od ? h('button.in-rel.e-oa', { type: 'button', onclick: () => pick(od.id) },
      h('b', od.n), ' ', h('span.muted', A.t(`공저 ${l.n}편`, `${l.n} co-authored`)), l.ex ? [h('br'), h('span.muted', `${l.ex.y} · ${l.ex.t}`)] : null) : null; })) : null;
    return [
      h('button.in-back', { type: 'button', onclick: clear }, A.t('← 목록', '← List')),
      h('div.in-hd',
        h('div.in-col.in-g6',
          h('span.lb', (d.city || '') + ' · ' + (c ? c[1] : '')),
          h('h2', d.n),
          h('span.in-w', d.w || '', PRIV && d.fit ? h('span.in-fit', d.fit) : null)),
        PRIV ? h('button.in-add', { type: 'button', 'aria-pressed': inCart ? 'true' : 'false', onclick: () => toggleCart(d.id) }, inCart ? A.t('담음', 'Added') : A.t('후보에 담기', 'Shortlist')) : null),
      GI[d.id] ? null : h('div.in-sum',
        cell(A.t('그룹장', 'Group leaders'), ppl.length, PS ? A.t(`현직 확인 ${curN}`, `${curN} confirmed`) : ''),
        PS ? cell(A.t('모집', 'Recruiting'), recN, A.t('명 확인', 'confirmed')) : cell(A.t('분야 논문', 'Papers'), x ? (x.tot || x.nw) : 0, A.t('편', '')),
        cell(A.t('최근 논문', 'Latest paper'), yr || '—'),
        cell(A.t('회사 연결', 'Company links'), sp.length, sp.map(r => (r.od && r.od !== d ? r.od.n : r.ot.l)).join(', '))),
      noteBlock(d),
      PRIV && d.why ? h('p.in-warn.why', { html: d.why }) : null,
      PRIV && d.gate ? h('dl.in-dl', h('dt', U.gate || ''), h('dd', { html: d.gate })) : null,
      GI[d.id] ? grpBlock(d) : null,
      peopleBlock(d),
      x && x.aff ? labBlock(d) : null,
      rels.length ? h('div.in-col', h('span.lb', A.t(`사람 사이 연결 ${rels.length}건 — 근거 확인, 지도에 선`, `${rels.length} confirmed links — lines on the map`)),
        h('div.in-rels', rels.map(({ e, me, ot, od }) => h('button.in-rel.e-' + (EK[e.k] ? e.k : 'p'), { type: 'button', onclick: od ? () => pick(od.id) : null },
          h('span.k', EK[e.k] || EK.p), h('br'), h('b', me.l), ' ↔ ', h('b', ot.l), ' ', h('span.muted', `(${ot.o})`), h('br'), e.t)))) : null,
      fold(A.t('하는 일 · 층 · 종류 · 구조', 'What they do · layers · kinds'), A.t(`${(d.work || []).length}건`, `${(d.work || []).length}`), workBody, !ppl.length && !GI[d.id]),
      (d.note || []).length ? fold(A.t('참고', 'Notes'), '', h('ul.in-notes2', d.note.map(t => h('li', { html: t })))) : null,
      oaRel ? fold(A.t('논문을 함께 쓴 지도 기관', 'Co-authoring institutions'), A.t(`자동 · ${x.links.length}곳`, `automatic · ${x.links.length}`), oaRel) : null,
      GI[d.id] ? null : (GOF[d.id] ? fold(A.t('회원·참여한 컨소시엄·포럼', 'Consortia & forums'), A.t(`${GOF[d.id].length}곳`, String(GOF[d.id].length)), grpBlock(d)) : null)
    ];
  }

  /* 후보 — 개인판에서 최대 3곳을 담아 나란히 본다(이 브라우저에만 저장) */
  function toggleCart(id) { cart = cart.includes(id) ? cart.filter(x => x !== id) : cart.concat(id).slice(-3); store('in-cart', cart); render(); }
  function tray() {
    if (!PRIV) return;
    const ds = cart.map(id => D.find(d => d.id === id)).filter(Boolean);
    $('#in-tray').hidden = !ds.length; document.body.classList.toggle('in-hastray', !!ds.length);
    mount('#in-trayn', A.t(`후보 ${ds.length}곳 — `, `${ds.length} shortlisted — `) + ds.map(d => d.n).join(' · '));
  }
  function compare() {
    const ds = cart.map(id => D.find(d => d.id === id)).filter(Boolean);
    const row = (k, f) => h('tr', h('th', k), ds.map(d => h('td', f(d))));
    mount('#in-cmpt', h('table',
      h('tr', h('th', ''), ds.map(d => h('td', h('a', { href: A.route.href('', d.id), onclick: e => { e.preventDefault(); $('#in-cmp').hidden = true; pick(d.id); } }, h('b', d.n)), h('br'), h('span.muted', d.city || '')))),
      row(A.t('그룹장', 'Group leaders'), d => people(d).slice(0, 4).map(p => [p.nm || p.L.pi, piStat(d, p.nm || p.L.pi).some(q => q.recruiting === '예') ? [' ', h('span.in-badge.rc', A.t('모집', 'Hiring'))] : null, h('br')])),
      row(A.t('모집', 'Recruiting'), d => recruits(d) ? A.t('확인', 'yes') : A.t('미확인', 'unknown')),
      row(A.t('최근 논문', 'Latest paper'), d => String(recentOf(d) || '—')),
      row(A.t('분야 논문', 'Papers'), d => String((LI[d.id] || {}).tot || '—')),
      row(A.t('EO 하는 일', 'EO work'), d => (d.work || []).filter(w => w.l === 'EO').map(w => [w.what, h('br')])),
      row(A.t('회사 연결', 'Company links'), d => relsOf(d).filter(r => r.e.k === 's').map(r => r.od && r.od !== d ? r.od.n : r.ot.l).join(', ') || '—'),
      PRIV ? row(U.gate || A.t('문턱', 'Bar'), d => d.gate ? h('span', { html: d.gate }) : '—') : null));
    $('#in-cmp').hidden = false;
  }

  /* 회원·참여 — 컨소시엄이면 참여기관 명단, 회원이면 든 컨소시엄 */
  const ROLE = { coordinator: ['주관', 'coordinator'], participant: ['참여', 'participant'], associatedPartner: ['협력', 'associated'], thirdParty: ['제3자', 'third party'] };
  function grpBlock(d) {
    const g = GI[d.id], mine = GOF[d.id] || [];
    if (g) {
      const on = g.mem.filter(m => m.to), off = g.mem.filter(m => !m.to);
      return h('div.in-col',
        h('span.lb', A.t(`회원·참여 ${g.mem.length}곳 중 지도 기관 ${on.length}곳 — 지도에 파선`, `${g.mem.length} members, ${on.length} on this map — dashed lines`)),
        h('div.in-rels', on.map(m => { const od = D.find(y => y.id === m.to); return od ? h('button.in-rel.e-grp', { type: 'button', onclick: () => pick(od.id) },
          h('b', od.n), m.role && ROLE[m.role] ? [' ', h('span.muted', A.t(ROLE[m.role][0], ROLE[m.role][1]))] : null) : null; })),
        off.length ? h('div', off.map(m => h('span.in-grpo', m.nm + (m.role && ROLE[m.role] ? ` (${A.t(ROLE[m.role][0], ROLE[m.role][1])})` : '')))) : null,
        h('p.in-pinote', A.t('출처 ', 'Source '), g.src.map((s, i) => [i ? ' · ' : '', h('a', { href: s.u, target: '_blank', rel: 'noopener' }, s.t)]),
          A.t(` · 명단에 이름이 나온 지도 기관만 이었다(${GB.META.date})`, ` · only map institutions named in the roster`)));
    }
    if (!mine.length) return null;
    return h('div.in-col', h('span.lb', A.t('회원·참여한 컨소시엄·포럼', 'Consortia & forums')),
      h('div.in-rels', mine.map(id => { const od = D.find(y => y.id === id); return od ? h('button.in-rel.e-grp', { type: 'button', onclick: () => pick(od.id) }, h('b', od.n)) : null; })));
  }

  /* 연구실 — 이 기관 분야 논문을 마지막 저자(그룹장) 기준으로 묶은 것. 점 = 연구실, 선 = 연구실 사이 공저 */
  function labGraph(labs) {
    const W = 340, H = 220, N = labs.map((L, i) => {
      const a = 2 * Math.PI * i / labs.length;
      return { L, x: W / 2 + 80 * Math.cos(a), y: H / 2 + 70 * Math.sin(a), r: 7 + 5 * Math.sqrt(L.n) };
    });
    const idx = Object.fromEntries(labs.map((L, i) => [L.id, i]));
    const E = [];
    labs.forEach((L, i) => Object.entries(L.lk || {}).forEach(([o, k]) => { const j = idx[o]; if (j !== undefined && j > i) E.push([i, j, k]); else if (j !== undefined && j < i && !(labs[j].lk || {})[L.id]) E.push([j, i, k]); }));
    for (let it = 0; it < 300; it++) {           // 작은 힘 배치: 밀어내기 + 선 당기기 + 가운데로
      N.forEach((a, i) => N.forEach((b, j) => {
        if (j <= i) return;
        let dx = b.x - a.x, dy = b.y - a.y, dd = Math.hypot(dx, dy) || 0.1, min = a.r + b.r + 26;
        const f = dd < min ? (min - dd) / dd * 0.5 : 600 / (dd * dd);
        a.x -= dx * f; a.y -= dy * f; b.x += dx * f; b.y += dy * f;
      }));
      E.forEach(([i, j]) => { const a = N[i], b = N[j], dx = b.x - a.x, dy = b.y - a.y, dd = Math.hypot(dx, dy) || 1, f = (dd - 70) / dd * 0.05;
        a.x += dx * f; a.y += dy * f; b.x -= dx * f; b.y -= dy * f; });
      N.forEach(n => { n.x += (W / 2 - n.x) * 0.02; n.y += (H / 2 - n.y) * 0.03;
        n.x = Math.max(n.r + 4, Math.min(W - n.r - 60, n.x)); n.y = Math.max(n.r + 4, Math.min(H - n.r - 4, n.y)); });
    }
    const last = L => A.esc(L.pi.split(' ').slice(-1)[0]);
    return `<svg viewBox="0 0 ${W} ${H}" class="in-labsvg" role="img">` +
      E.map(([i, j, k]) => `<line x1="${N[i].x}" y1="${N[i].y}" x2="${N[j].x}" y2="${N[j].y}" stroke-width="${Math.min(1 + k, 5)}"/>`).join('') +
      N.map((n, i) => `<g class="in-lab${n.L.cur ? ' cur' : ''}" data-lab="${i}" transform="translate(${n.x.toFixed(1)},${n.y.toFixed(1)})">` +
        `<circle r="${n.r.toFixed(1)}"><title>${A.esc(n.L.pi)} · ${n.L.n}</title></circle><text x="${(n.r + 3).toFixed(1)}" y="4">${last(n.L)}</text></g>`).join('') + '</svg>';
  }
  function labBlock(d) {
    const x = LI[d.id];
    if (!x) return null;
    const note = A.t(`OpenAlex ${LB.META.since}년 이후 · 포토닉스 검색어에 걸린 이 기관 논문 ${x.tot.toLocaleString()}편 중 피인용 상위 ${x.nw}편 · 연구실 = 마지막 저자(그룹장) 기준 · 점 크기 = 논문 수 · 진한 점 = 위 PI 목록에 있는 사람`,
      `OpenAlex since ${LB.META.since} · top ${x.nw} cited of ${x.tot.toLocaleString()} photonics-matching papers · lab = last author (group leader) · size = papers · dark = listed PI above`);
    const relBlock = () => x.links.length ? h('div.in-col', h('span.lb', A.t(`논문을 함께 쓴 지도 기관 — 지도에 얇은 선`, `Co-authoring institutions on this map — thin lines`)),
      h('div.in-rels', x.links.map(l => { const od = D.find(y => y.id === l.to); return od ? h('button.in-rel.e-oa', { type: 'button', onclick: () => pick(od.id) },
        h('b', od.n), ' ', h('span.muted', A.t(`공저 ${l.n}편`, `${l.n} co-authored`)), l.ex ? [h('br'), h('span.muted', `${l.ex.y} · ${l.ex.t}`)] : null) : null; }))) : null;
    if (x.aff) return h('div.in-col.in-labs',
      h('span.lb', A.t(`논문 ${x.nw}편 — 저자 소속란에 「${x.aff}」`, `${x.nw} papers — "${x.aff}" in author affiliations`)),
      h('div.in-labc',
        h('b', A.t('이 회사 소속 저자', 'Authors here')),
        h('span.in-mem', x.au.map(([n, k]) => `${n} (${k})`).join(', ')),
        x.part.length ? [h('b', A.t('함께 쓴 연구실 — 마지막 저자', 'Partner labs — last author')),
          h('span.in-mem', x.part.map(([n, i, k]) => `${n} · ${i} (${k})`).join(', '))] : null,
        h('ul.in-labp', x.p.map(p => h('li', `${p.y} · `, p.doi ? h('a', { href: 'https://doi.org/' + p.doi, target: '_blank', rel: 'noopener' }, p.t) : p.t,
          h('span.muted', A.t(` · 피인용 ${p.c}`, ` · ${p.c} cites`)))))),
      relBlock(),
      h('p.in-pinote', A.t(`OpenAlex에 기관으로 등록되지 않아, ${LB.META.since}년 이후 포토닉스 논문 중 저자 소속란에 이 이름이 적힌 것을 모았다 · 대학·연구소 소속 문구는 뺐다 · 연구실로 묶기엔 적어서 저자와 함께 쓴 연구실만 보인다`,
        `Not an OpenAlex institution — papers since ${LB.META.since} whose author affiliation names it · too few to group into labs`)));
    if (!x.labs.length) return h('div.in-col', h('span.lb', A.t('연구실', 'Labs')), h('p.in-pinote', A.t('분야 논문에서 이 기관 소속 그룹장을 찾지 못했다.', 'No group leader at this institution in the matched papers.')));
    const pickLab = i => {
      document.querySelectorAll('.in-labc').forEach((c, k) => c.classList.toggle('on', k === i));
      document.querySelectorAll('.in-lab').forEach((g, k) => g.classList.toggle('on', k === i));
      const c = document.querySelectorAll('.in-labc')[i]; if (c) c.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    return h('div.in-col.in-labs',
      h('span.lb', A.t(`연구실 ${x.labs.length}곳 — 논문으로 묶은 그룹`, `${x.labs.length} labs — grouped from papers`)),
      h('div.in-labg', { html: labGraph(x.labs), onclick: e => { const g = e.target.closest('[data-lab]'); if (g) pickLab(+g.dataset.lab); } }),
      h('div.in-labl', x.labs.map((L, i) => h('div.in-labc', { onclick: () => pickLab(i) },
        h('b', L.pi, L.cur ? h('span.in-badge.cu', A.t('PI 목록', 'listed PI')) : null,
          h('a.in-oa', { href: 'https://openalex.org/' + L.id, target: '_blank', rel: 'noopener', onclick: e => e.stopPropagation() }, 'OpenAlex')),
        h('span.in-meta', A.t(`분야 논문 ${L.n}편 · 피인용 ${L.c.toLocaleString()} · 함께 쓴 같은 기관 사람 ${L.nm}명`, `${L.n} papers · ${L.c.toLocaleString()} citations · ${L.nm} co-authors here`)),
        L.mem.length ? h('span.in-mem', L.mem.map(([n, k]) => `${n} (${k})`).join(', ')) : null,
        h('ul.in-labp', L.p.map(p => h('li', `${p.y} · `, p.doi ? h('a', { href: 'https://doi.org/' + p.doi, target: '_blank', rel: 'noopener', onclick: e => e.stopPropagation() }, p.t) : p.t,
          h('span.muted', A.t(` · 피인용 ${p.c}`, ` · ${p.c} cites`)))))))),
      relBlock(),
      h('p.in-pinote', note));
  }
  const NOTE_OF = {};
  if (NT) (function walk(n) {
    const iid = (NT.NOTE_INST || {})[n.id];
    if (iid) (NOTE_OF[iid] = NOTE_OF[iid] || []).push(n);
    (n.kids || []).forEach(walk);
  })(NT.NOTES || { kids: [] });

  const rail = $('#in-rail');
  function result() {
    const any = st.cur !== 'all' || st.flt !== 'all' || st.ax !== 'all' || st.kind !== 'all' || st.q || st.rec;
    if (!any) { mount('#in-result', []); return; }
    const n = D.filter(d => inRegion(d) && match(d)).length;
    const tags = [st.cur !== 'all' && (C.find(c => c[0] === st.cur) || [])[1], st.ax !== 'all' && LBL[st.ax], st.flt !== 'all' && st.flt + ' ' + (LN[st.flt] || ''),
      st.kind !== 'all' && PSH[st.kind], st.rec && A.t('모집 확인', 'recruiting'), st.q && `“${st.q}”`].filter(Boolean);
    mount('#in-result', h('b', A.t(`${n}곳`, `${n}`)), h('span', tags.join(' · ')),
      PRIV ? null : h('span', A.t('해당 없는 곳은 지도에서 흐리게', 'others are dimmed')),
      h('button', { type: 'button', onclick: () => { st.q = ''; st.rec = false; $('#in-q').value = ''; $('#in-rec').checked = false; A.route.go('', st.sel || '', { params: { cur: null, flt: null, ax: null, kind: null } }); } }, A.t('필터 모두 해제', 'Clear filters')));
  }
  function render() {
    drawTabs(); restyle(); lanes(); result(); tray();
    const d = st.sel && D.find(x => x.id === st.sel);
    rail.hidden = !d;   // 오른쪽 칸은 기관을 골랐을 때만
    mount(rail, d ? railDetail(d) : []);
  }
  function pick(id) { A.route.go('', id); }
  $('#in-q').addEventListener('input', e => { st.q = e.target.value.trim(); restyle(); lanes(); result(); });
  if (PS) { $('#in-reclab').hidden = false; $('#in-rec').addEventListener('change', e => { st.rec = e.target.checked; restyle(); lanes(); result(); }); }
  $('#in-more').addEventListener('click', e => { const adv = $('#in-adv'); adv.hidden = !adv.hidden; e.currentTarget.setAttribute('aria-expanded', String(!adv.hidden)); });
  const autoEl = $('#in-autoln'); autoEl.checked = st.auto;
  L.DomEvent.disableClickPropagation($('#in-legend'));
  autoEl.addEventListener('change', e => { st.auto = e.target.checked; store('in-autoln', st.auto); drawLinks(st.sel && D.find(x => x.id === st.sel)); });
  if (PRIV) {
    $('#in-cmpbtn').addEventListener('click', compare);
    $('#in-clr').addEventListener('click', () => { cart = []; store('in-cart', cart); render(); });
    $('#in-cmpx').addEventListener('click', () => { $('#in-cmp').hidden = true; });
    $('#in-cmp').addEventListener('click', e => { if (e.target.id === 'in-cmp') e.target.hidden = true; });
  }
  function clear() { A.route.go('', ''); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('#in-cmp').hidden) { $('#in-cmp').hidden = true; return; } if (st.sel) clear(); } });

  let first = true;
  A.route.on(r => {
    const d = D.find(x => x.id === r.raw) || null;
    const was = st.sel, wasCur = st.cur;
    st.sel = d ? d.id : null;
    st.cur = A.route.param(r, 'cur', 'all');
    st.flt = A.route.param(r, 'flt', 'all');
    st.kind = A.route.param(r, 'kind', 'all');
    st.ax = A.route.param(r, 'ax', 'all');
    if (!C.some(c => c[0] === st.cur)) st.cur = 'all';
    // 지역이 바뀌었고 기관을 고르지 않았으면 그 지역으로 맞춘다(뒤로가기에서도 같게)
    if (st.cur !== wasCur && !d) { const b = C.find(c => c[0] === st.cur)[2]; if (first) setTimeout(() => fitTo(b, { padding: [20, 20] }), 200); else fitTo(b, { padding: [20, 20] }); }
    document.title = (d ? d.n + ' · ' : '') + A.t('기관', 'Institutions') + ' — ' + A.site;
    drawLinks(d);
    render();
    if (d && d.id !== was) {
      // 고른 기관으로 이동만 한다 — 줌아웃하지 않는다
      const go = () => { map.invalidateSize(); map.panTo([d.lat, d.lon]); };
      if (first) setTimeout(go, 200); else go();
      rail.scrollTop = 0;
      if (!first && A.narrow()) rail.scrollIntoView({ block: 'start' });
    }
    first = false;
  });
})();
