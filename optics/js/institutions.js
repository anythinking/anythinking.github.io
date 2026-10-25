/* 기관 지도: Leaflet 지도 · 지역 탭 · 축 필터 · 기관 목록/상세. 고른 기관은 #<기관 id> 로 남는다 */
(function () {
  'use strict';
  const I = A.data('inst');
  if (!I) return;
  const D = I.D, LBL = I.LBL, U = I.UI || {};
  const PRIV = A.hasPrivate('inst');
  const NT = A.hasPrivate('notes') ? A.data('notes') : null;   // 노트 연결(개인판만)
  const { h, mount, $ } = A;

  const C = [['all', '전체', [[-46, -128], [66, 158]]], ['uk', '영국', [[49.4, -7.8], [59.2, 2.6]]], ['de', '독일', [[46.8, 4.8], [55.6, 15.8]]], ['us', '미국·캐나다', [[23.5, -127], [52.5, -62]]],
    ['fr', '프랑스', [[41, -5.8], [51.8, 10.2]]], ['it', '이탈리아', [[35.8, 5.6], [47.8, 19.4]]], ['ch', '스위스', [[45.6, 5.5], [48.1, 10.9]]], ['eu2', '유럽 기타', [[35, -11.5], [70, 32]]],
    ['as', '아시아', [[-1, 96], [47, 148]]], ['au', '호주', [[-45, 110], [-9, 156]]]];
  const PN = U.PN || {};
  const EK = { p: '논문 공저', m: '이동·계보', i: '협약·공동운영', s: '스핀오프·인수' };
  const stars = d => U.star ? (d.fit || '').split(U.star).length - 1 : 0;   // 개인판 UI.star
  const kc = k => 'k-' + (k in LBL || k === 'x' ? k : 'comp');
  const st = { cur: 'all', flt: 'all', sel: null, okind: 'all' };

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

  /* 대학 / 연구소 / 회사 — 한 칸에 둘이 섞인 이름(「KAIST · ETRI」)은 양쪽 다 해당된다 */
  const CO_W = ['Inc', 'Ltd', 'LLC', 'GmbH', 'Corp', 'Technologies', 'Lightmatter', 'HyperLight', 'Lumentum', 'Infinera',
    'Intel', 'IBM', 'Nokia', 'Samsung', 'TSMC', 'GlobalFoundries', 'AMF', 'Tower', 'Cisco', 'Ayar', 'Celestial', 'Salience',
    'Luxtelligence', 'Lightium', 'Q.ANT', 'Xanadu', 'PsiQuantum', 'OpenLight', 'SiFotonics', 'Nexus', 'Lightelligence',
    'Lumai', 'Oriole', 'NVIDIA', 'Nvidia', 'Broadcom', 'Marvell', 'Coherent', 'Rockley', 'Scintil', 'iPronics', 'Akhetonics',
    'AMO', 'HPE', 'Jabil', '住友', 'Furukawa', '파운드리', 'Foundry', 'Semiconductor'];
  const LAB_W = ['Fraunhofer', '프라운호퍼', 'Max Planck', '막스플랑크', 'CNRS', 'CEA', 'AIST', 'NIST', 'NICT', 'ETRI', 'KIST',
    'A*STAR', 'IHP', 'VTT', 'TNO', 'imec', 'IMEC', 'SINTEF', 'CSIRO', 'Tyndall', 'ICFO', 'Paul Scherrer', 'PETRA', 'NTT',
    'Sandia', 'Lincoln Lab', 'NRC', 'RIKEN', 'Riken', '연구소', '연구원', 'LETI', 'FBH', 'HHI', 'IPMS', 'IOF', 'MPI', 'Q-APP', 'IME'];
  const UNI_W = ['University', 'Universit', 'Univ', '대학', 'College', 'Institute of Technology', 'ETH', 'EPFL', 'EPF',
    'KAIST', 'MIT', 'TU ', 'TU-', 'Politec', 'Polytech', 'UQ', 'SUTD', 'NUS', 'NTU', 'KTH', 'DTU', 'Carleton', 'Boulder',
    'Ghent', 'Imperial', 'Caltech', 'Stanford', 'Harvard', 'Tsinghua', 'POSTECH', 'Waterloo', 'Toronto', 'Sydney'];
  function orgKind(d) {
    const t = (d.n || '') + ' ' + (d.w || '') + ' ' + (d.city || '');
    const has = ws => ws.some(k => t.indexOf(k) >= 0);
    const co = has(CO_W), lab = has(LAB_W), uni = has(UNI_W);
    // 아무 단서도 없으면 대학 — 도시 이름만 적힌 칸이 대부분 대학이다
    return { uni: uni || (!co && !lab), lab, co };
  }
  const KIND_OK = (d, k) => k === 'all' || !!orgKind(d)[k];
  const inAxis = d => st.flt === 'all' || (d.t || []).includes(st.flt) || d.k === st.flt;

  /* 지도 */
  const mapEl = $('#in-map');
  mount('#in-mapnote', String(U.mapnote || '').replace('{n}', D.length));
  const map = L.map(mapEl, { zoomControl: true, worldCopyJump: true, minZoom: 2, zoomSnap: 0.5, zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false }).setView([30, 20], 2);
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
      if (!KIND_OK(d, st.okind)) { if (map.hasLayer(m)) map.removeLayer(m); return; }
      if (!map.hasLayer(m)) m.addTo(map);
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
      onclick: () => A.route.set({ flt: k === 'all' ? null : k }) }, k === 'all' ? null : h('span.in-dot.' + kc(k)), k === 'all' ? '전체' : LBL[k])));
  }

  /* 오른쪽 */
  function railList() {
    const list = D.filter(d => st.cur === 'all' || d.p === st.cur).filter(d => KIND_OK(d, st.okind))
      .sort((a, b) => stars(b) - stars(a) || a.n.localeCompare(b.n, 'ko'));
    const c = C.find(x => x[0] === st.cur);
    return [
      h('div.in-col', h('h2', U.title || ''), h('p.sub', U.intro || '')),
      st.cur !== 'all' ? h('p.sub', h('b', c[1]), ' — ' + (PN[st.cur] || '')) : null,
      U.warn ? h('p.in-warn', { html: U.warn }) : null,
      h('div.in-col.in-g6',
        h('div.in-lhead',
          h('span.lb', `기관 ${list.length}곳${list.length !== D.length ? ` / ${D.length}` : ''}` + (PRIV ? U.sort || '' : '')),
          h('span.in-ok', [['all', '전체'], ['uni', '대학'], ['lab', '연구소'], ['co', '회사']].map(([v, l]) =>
            A.pill(l, st.okind === v, () => A.route.set({ okind: v === 'all' ? null : v }))))),
        h('div.in-list' + (PRIV ? '.fit' : ''), list.map(d => h('a.in-row' + (inAxis(d) ? '' : '.dim'), { href: A.route.href('', d.id), onclick: e => { e.preventDefault(); pick(d.id); } },
          PRIV ? h('span.f', d.fit || '') : null,
          h('span.n', h('span.in-dot.' + kc(d.k)), d.n),
          h('span.ct', d.city || '')))))
    ];
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
      h('button.in-back', { type: 'button', onclick: clear }, '← 목록'),
      h('div.in-col.in-g6',
        h('span.lb', (d.city || '') + ' · ' + (c ? c[1] : '')),
        h('h2', d.n),
        h('span.in-w', d.w || '', PRIV && d.fit ? h('span.in-fit', d.fit) : null)),
      noteBlock(d),
      h('div.in-tags', (d.t || []).map(t => h('span.in-tag', LBL[t] || t))),
      PRIV && d.why ? h('p.in-warn.why', { html: d.why }) : null,
      h('dl.in-dl', d.fab ? [h('dt', '팹'), h('dd', { html: d.fab })] : null, PRIV && d.gate ? [h('dt', U.gate || ''), h('dd', { html: d.gate })] : null),
      (d.pi || []).length ? h('div.in-col', h('span.lb', `PI ${d.pi.length}명`),
        h('ul.in-pis', d.pi.map(([n, t]) => h('li', h('b', n), h('span', { html: t }))))) : null,
      rels.length ? h('div.in-col', h('span.lb', `연결 ${rels.length}건 — 지도에 선으로 표시`),
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
    drawTabs(); restyle();
    const d = st.sel && D.find(x => x.id === st.sel);
    mount(rail, d ? railDetail(d) : railList());
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
    st.okind = A.route.param(r, 'okind', 'all');
    if (!C.some(c => c[0] === st.cur)) st.cur = 'all';
    // 지역이 바뀌었고 기관을 고르지 않았으면 그 지역으로 맞춘다(뒤로가기에서도 같게)
    if (st.cur !== wasCur && !d) { const b = C.find(c => c[0] === st.cur)[2]; if (first) setTimeout(() => fitTo(b, { padding: [20, 20] }), 200); else fitTo(b, { padding: [20, 20] }); }
    document.title = (d ? d.n + ' · ' : '') + '기관 지도 — 광 연산 지도와 실험실';
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
