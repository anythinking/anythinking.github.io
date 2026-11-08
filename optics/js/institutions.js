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
  const { h, mount, $ } = A;

  const C = [['all', '전체', [[-46, -128], [66, 158]]], ['uk', '영국', [[49.4, -7.8], [59.2, 2.6]]], ['de', '독일', [[46.8, 4.8], [55.6, 15.8]]], ['us', '미국·캐나다', [[23.5, -127], [52.5, -62]]],
    ['fr', '프랑스', [[41, -5.8], [51.8, 10.2]]], ['it', '이탈리아', [[35.8, 5.6], [47.8, 19.4]]], ['ch', '스위스', [[45.6, 5.5], [48.1, 10.9]]], ['eu2', '유럽 기타', [[35, -11.5], [70, 32]]],
    ['as', '아시아', [[-1, 96], [47, 148]]], ['au', '호주', [[-45, 110], [-9, 156]]]];
  if (A.lang === 'en') {
    const CN = { all: 'All', uk: 'UK', de: 'Germany', us: 'US · Canada', fr: 'France', it: 'Italy', ch: 'Switzerland', eu2: 'Rest of Europe', as: 'Asia', au: 'Australia' };
    C.forEach(c => { c[1] = CN[c[0]] || c[1]; });
  }
  const PN = U.PN || {};
  const EK = A.lang === 'en' ? { p: 'Co-authored papers', m: 'Moves · lineage', i: 'Agreements · joint operation', s: 'Spin-offs · acquisitions' } : { p: '논문 공저', m: '이동·계보', i: '협약·공동운영', s: '스핀오프·인수' };
  const stars = d => U.star ? (d.fit || '').split(U.star).length - 1 : 0;   // 개인판 UI.star
  const kc = k => 'k-' + (k in LBL || k === 'x' ? k : 'comp');
  const st = { cur: 'all', flt: 'all', sel: null };

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

  const inAxis = d => st.flt === 'all' || (d.t || []).includes(st.flt) || d.k === st.flt;

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
    mk[d.id] = L.circleMarker([d.lat, d.lon], { radius: 4 + (d.r || 6) * 0.75, className: 'in-m ' + kc(d.k) + (PRIV && stars(d) >= 3 ? ' s3' : '') })
      .bindTooltip(tip, { className: 'in-tip', direction: 'top', offset: [0, -6] })
      .on('click', () => pick(d.id)).addTo(map);
  });
  function restyle() {
    D.forEach(d => {
      const m = mk[d.id];
      const p = m.getElement();
      if (!p) return;
      p.classList.toggle('off', !((st.cur === 'all' || d.p === st.cur) && inAxis(d)));
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
  }

  /* 탭 */
  function drawTabs() {
    mount('#in-ctabs', C.map(([id, nm, b]) => A.pill([nm, h('span.n', String(id === 'all' ? D.length : D.filter(d => d.p === id).length))], st.cur === id, () =>
      A.route.go('', '', { params: { cur: id === 'all' ? null : id } }))));
    const keys = ['all'].concat(Object.keys(LBL).filter(k => D.some(d => d.k === k || (d.t || []).includes(k))));
    mount('#in-ftabs', keys.map(k => h('button.chip' + (st.flt === k ? '.on' : ''), { type: 'button', 'aria-pressed': st.flt === k ? 'true' : 'false',
      onclick: () => A.route.set({ flt: k === 'all' ? null : k }) }, k === 'all' ? null : h('span.in-dot.' + kc(k)), k === 'all' ? A.t('전체', 'All') : LBL[k])));
  }

  /* 지도 아래: 지역이 묶음(갈래 자리), 기관이 카드. 점 = 층 색(EO 는 고리) */
  const linkN = {};
  D.forEach(d => { linkN[d.id] = relsOf(d).length; });
  function card(d) {
    const first = (d.pi || [])[0];
    const ks = [d.k].concat((d.t || []).filter(t => t !== d.k));
    return h('a.in-card' + (inAxis(d) ? '' : '.dim'), { href: A.route.href('', d.id), onclick: e => { e.preventDefault(); pick(d.id); } },
      h('span.in-ch', PRIV && d.fit ? h('span.in-fit', d.fit) : null, h('b', d.n),
        h('span.in-dots', ks.map(k => h('i.in-dot.' + kc(k), { title: LBL[k] || k })))),
      h('span.in-meta', (d.city || '') + (MADE[d.id] ? A.t(` · 구조 ${MADE[d.id].length}`, ` · ${MADE[d.id].length} structures`) : '') + (linkN[d.id] ? A.t(` · 연결 ${linkN[d.id]}`, ` · ${linkN[d.id]} links`) : '')),
      first ? h('span.in-sub', first[0] + (FIELD[first[0]] ? ' · ' + FIELD[first[0]] : '')) : null);
  }
  function lanes() {
    const rows = C.slice(1).filter(([id]) => st.cur === 'all' || id === st.cur).map(([id, nm]) => {
      const items = D.filter(d => d.p === id).sort((a, b) => stars(b) - stars(a) || a.n.localeCompare(b.n, 'ko'));
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
  function railDetail(d) {
    const rels = relsOf(d);
    const c = C.find(x => x[0] === d.p);
    return [
      h('button.in-back', { type: 'button', onclick: clear }, A.t('← 목록', '← List')),
      h('div.in-col.in-g6',
        h('span.lb', (d.city || '') + ' · ' + (c ? c[1] : '')),
        h('h2', d.n),
        h('span.in-w', d.w || '', PRIV && d.fit ? h('span.in-fit', d.fit) : null)),
      noteBlock(d),
      h('div.in-tags', (d.t || []).map(t => h('span.in-tag', LBL[t] || t))),
      PRIV && d.why ? h('p.in-warn.why', { html: d.why }) : null,
      h('dl.in-dl', d.fab ? [h('dt', A.t('팹', 'Fab')), h('dd', { html: d.fab })] : null, PRIV && d.gate ? [h('dt', U.gate || ''), h('dd', { html: d.gate })] : null),
      MADE[d.id] ? h('div.in-col', h('span.lb', A.t(`여기서 나온 구조 ${MADE[d.id].length}개`, `${MADE[d.id].length} structures from here`)),
        h('div.in-made', MADE[d.id].map(s => h('a.in-mk', { href: 'compute.html#' + s.id }, h('b', A.tr(s.short)), h('span', s.id.toUpperCase()))))) : null,
      (d.pi || []).length ? h('div.in-col', h('span.lb', A.t(`PI ${d.pi.length}명`, `PIs (${d.pi.length})`)),
        h('ul.in-pis', d.pi.map(([n, t]) => { const f = FIELD[n]; return h('li', h('b', n, f ? h('span.in-field', { title: String(FIELDS[f] || '').replace(/<[^>]+>/g, '') }, f) : null), h('span', { html: t })); }))) : null,
      rels.length ? h('div.in-col', h('span.lb', A.t(`연결 ${rels.length}건 — 지도에 선으로 표시`, `${rels.length} links — drawn as lines on the map`)),
        h('div.in-rels', rels.map(({ e, me, ot, od }) => h('button.in-rel.e-' + (EK[e.k] ? e.k : 'p'), { type: 'button', onclick: od ? () => pick(od.id) : null },
          h('span.k', EK[e.k] || EK.p), h('br'), h('b', me.l), ' ↔ ', h('b', ot.l), ' ', h('span.muted', `(${ot.o})`), h('br'), e.t)))) : null
    ];
  }
  const NOTE_OF = {};
  if (NT) (function walk(n) {
    const iid = (NT.NOTE_INST || {})[n.id];
    if (iid) (NOTE_OF[iid] = NOTE_OF[iid] || []).push(n);
    (n.kids || []).forEach(walk);
  })(NT.NOTES || { kids: [] });

  const rail = $('#in-rail');
  function render() {
    drawTabs(); restyle(); lanes();
    const d = st.sel && D.find(x => x.id === st.sel);
    rail.hidden = !d;   // 오른쪽 칸은 기관을 골랐을 때만
    mount(rail, d ? railDetail(d) : []);
  }
  function pick(id) { A.route.go('', id); }
  function clear() { A.route.go('', ''); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && st.sel) clear(); });

  let first = true;
  A.route.on(r => {
    const d = D.find(x => x.id === r.raw) || null;
    const was = st.sel, wasCur = st.cur;
    st.sel = d ? d.id : null;
    st.cur = A.route.param(r, 'cur', 'all');
    st.flt = A.route.param(r, 'flt', 'all');
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
