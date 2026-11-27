/* 구조 페이지: 군 A~F 탭 · 목차(축 3종으로 묶기) · 구조별 그림과 손잡이 · 부품표 마커 · 오른쪽 설명.
   선택은 #a1 … #f4 로 남고(다른 페이지가 이 해시로 링크한다), 뒤로가기로 되돌아온다.
   A군은 render(S) 순수 모델, B~F군은 옛 장(html+run)의 실물 요소를 떼어 붙인다 — structures/<g>.js */
(function () {
  'use strict';
  const { h, mount, $ } = A;
  const stage = $('#cmp-stage'), side = $('#cmp-side');
  const D = A.data('devices'), X = A.data('dev-extra') || {}, OV = A.data('overview'), CP = A.data('compute');
  const CMP = window.CMP || { groups: {} };
  // 개인판 문구 되돌리기: 공개 문장 → 원문 (content/private/compute.json 의 TXT)
  const TX = (CP && CP.TXT) || {}, UI = (CP && CP.UI) || {};
  CMP.tx = s => Object.keys(TX).reduce((r, k) => r.split(k).join(TX[k]), s);
  if (!D) { mount(stage, h('p.empty.cmp-pad', A.t('데이터 로드 실패 — 구조 데이터를 읽지 못했다.', 'Failed to load — could not read the structure data.'))); return; }

  const HASH = /^([a-f])(\d+)$/;
  // 군 라벨은 구조 표(overview.G) 한 곳에서 — 그림 페이지가 있는 a~f 만 탭이 된다
  const GL = (OV && OV.G) || {};
  const GROUPS = Object.keys(GL).filter(g => HASH.test(g + '1')).map(g => [g, g.toUpperCase(), g.toUpperCase() + ' · ' + GL[g]]);
  // 실험실이 있는 구조 → 붙일 부품과 기본 프리셋
  const LABS = { a5: { mod: 'PCMLab', def: 'feldmann2021' }, a2: { mod: 'RingLab', def: 'tait2017' } };
  const LAB = Object.fromEntries(Object.entries(LABS).map(([k, v]) => [k, v.def]));
  // 「깊게 보기」가 주소에 쓰는 키 — 기본 보기로 돌아갈 때 함께 지운다
  const LABKEYS = ['deep', 'pre', 'm', 'n', 'dc', 'cx', 'mat', 'len', 'lv', 'src', 'p', 'er', 'nep', 'bw', 'view', 'seed',
    'sp', 'R', 'k2', 'loss', 'ng', 'tune', 'eta', 'xt', 'fab', 'cal'];
  let lab = null, labFor = null, lastR = null;
  const BOM = k => (D.BOM && D.BOM[k]) || [];
  const SS = OV ? OV.S.filter(s => HASH.test(s.id)) : [];
  const SROW = Object.fromEntries(((OV && OV.S) || []).map(s => [s.id, s]));
  const DEV = id => (D.DEV && D.DEV[id]) || { n: id, d: '' };
  // 이 구조가 쓰는 소자 중 그림(해부도)이 있는 것 — 소자 카드와 같은 그림으로 간다
  const figRow = sid => {
    const figs = BOM(sid).flatMap(it => (DEV(it.id).fig || []).map(f => [it.id, f]));
    if (!figs.length) return null;
    return h('div.cmp-figtop', h('b', A.t('해부도 — 실제 장치로 보기', 'Anatomy — see the real device')),
      h('span.cmp-figs', figs.map(([, f]) => h('a.cmp-fig', { href: A.root + f.h, target: '_blank', rel: 'noopener', title: f.s || '' }, f.n))));
  };
  const PRIV = A.hasPrivate('compute');

  const st = { grp: 'o', sel: {}, vals: {}, pane: {}, marks: true, dev: null, devNum: 0, info: false };

  // ── 그림 팔레트: 그림판은 다크 모드에서도 밝은 종이라 옛 코드의 색 질의엔 밝은 값을 준다 ──
  const PAL = { beam: '#D62A1F', probe: '#2457E6', warm: '#D1A017', wall: '#6B5B4E', panel: '#FFFFFF', ink: '#16233A', muted: '#55657F', rule: '#D5DCE8', grid: '#E9EEF5', bg: '#F8F9FB' };
  const CS = { getPropertyValue: k => ' ' + (PAL[String(k).replace(/^--/, '')] || '#000') };
  const gcs = () => CS;

  // ── 가로로 나란한 그림을 위·아래로 쌓는다 (넓은 그림이 높이에 눌려 작아지지 않게) ──
  // 쌓기는 칸이 좁을 때만 — 쌓은 쪽이 화면에 실제로 더 크게(면적 1.3배 이상) 그려질 때만 쌓는다 (stackOn)
  const STACK = {
    // 옛 장 그림은 2026-11 구조 그림 재작업(광원→센서 사이클, 880 폭)으로 모두 새로 그려 쌓기 규격이 없다.
    // 새로 넣을 때: 'id': { rects: [[x, y, w, h], …], rows } (캔버스) 또는 { parts: [fn, …] } (SVG)
  };
  function room() {   // 그림이 쓸 수 있는 폭·높이 (fitW 와 같은 셈)
    const b = $('.cmp-figbox', stage), top = b ? b.getBoundingClientRect().top : 190, ih = window.innerHeight || 800;
    return { bw: b ? b.clientWidth - (A.narrow() ? 32 : 96) : 480, ah: A.narrow() ? ih * 0.8 : Math.max(200, ih - top - 140) };
  }
  function stackOn(fw, fh, L) {
    if (!L) return false;
    const { bw, ah } = room(), area = (w, hh) => { const k = Math.min(Math.min(1000, bw) / w, ah / hh); return k * k * w * hh; };
    return area(L.W, L.H) > 1.3 * area(fw, fh);
  }
  function layout(rects, spec) {
    const rows = spec.rows || rects.map((_, i) => [i]), max = spec.max || 1.4, gap = 10;
    const rw = rows.map(r => r.reduce((s, i) => s + rects[i][2], 0) + gap * (r.length - 1));
    const W = Math.max(...rw); let oy = 0; const map = [];
    rows.forEach((r, k) => {
      const s = Math.min(max, W / rw[k]); let ox = (W - rw[k] * s) / 2, rh = 0;
      r.forEach(i => { const [x, y, w, hh] = rects[i]; map[i] = { x, y, w, h: hh, ox, oy, s }; ox += (w + gap) * s; rh = Math.max(rh, hh * s); });
      oy += rh + gap;
    });
    return { W, H: oy - gap, map };
  }
  function mapPoint(L, x, y) {
    if (!L) return [x, y];
    let best = null, bd = 1e9;
    L.map.forEach(m => { if (!m) return; const dx = Math.max(m.x - x, 0, x - m.x - m.w), dy = Math.max(m.y - y, 0, y - m.y - m.h), d = dx + dy; if (d < bd) { bd = d; best = m; } });
    return best ? [best.ox + (x - best.x) * best.s, best.oy + (y - best.y) * best.s] : [x, y];
  }
  function stackSvg(el, spec) {
    if (!el.viewBox) return null;
    const kids = [...el.children];
    if (kids.length && kids.every(k => k.hasAttribute('data-stk'))) return el._stk;
    kids.filter(k => k.hasAttribute('data-stk')).forEach(g => { while (g.firstChild) el.insertBefore(g.firstChild, g); g.remove(); });
    if (!el._vb0) { const v = el.viewBox.baseVal; el._vb0 = [v.x, v.y, v.width, v.height]; }
    el.setAttribute('viewBox', el._vb0.join(' '));
    const items = [...el.children], n = spec.parts.length;
    items.forEach((c, i) => { c._o = i; });
    const buckets = Array.from({ length: n }, () => []), box = Array(n).fill(null);
    items.forEach(c => {
      let b = null; try { b = c.getBBox(); } catch (e) { /* 그려지지 않은 요소 */ }
      let i = n - 1;
      if (b && (b.width || b.height)) {
        const cx = b.x + b.width / 2, cy = b.y + b.height / 2; i = spec.parts.findIndex(f => f(cx, cy, c, b)); if (i < 0) i = n - 1;
        const r = box[i]; box[i] = r ? [Math.min(r[0], b.x), Math.min(r[1], b.y), Math.max(r[2], b.x + b.width), Math.max(r[3], b.y + b.height)] : [b.x, b.y, b.x + b.width, b.y + b.height];
      }
      buckets[i].push(c);
    });
    const pad = 6, rects = box.map(r => r ? [r[0] - pad, r[1] - pad, r[2] - r[0] + 2 * pad, r[3] - r[1] + 2 * pad] : [0, 0, 1, 1]);
    const L = layout(rects, spec), NS = 'http://www.w3.org/2000/svg';
    buckets.forEach((list, i) => {
      const m = L.map[i]; if (!m) return;
      const g = document.createElementNS(NS, 'g'); g.setAttribute('data-stk', i);
      g.setAttribute('transform', `translate(${m.ox.toFixed(1)} ${m.oy.toFixed(1)}) scale(${m.s.toFixed(3)}) translate(${-m.x} ${-m.y})`);
      list.forEach(c => g.appendChild(c)); el.appendChild(g);
    });
    el.setAttribute('viewBox', `0 0 ${L.W.toFixed(1)} ${L.H.toFixed(1)}`);
    el._stk = L; el._stkL = L; return L;
  }
  function unstackSvg(el) {   // 쌓은 묶음을 풀고 원래 순서·viewBox 로
    const gs = [...el.children].filter(k => k.hasAttribute('data-stk'));
    if (!gs.length) { el._stk = null; return; }
    const kids = gs.flatMap(g => [...g.childNodes]).sort((a, b) => (a._o || 0) - (b._o || 0));
    gs.forEach(g => g.remove());
    kids.forEach(c => el.appendChild(c));
    if (el._vb0) el.setAttribute('viewBox', el._vb0.join(' '));
    el._stk = null;
  }
  const canvasLayout = spec => spec._L || (spec._L = layout(spec.rects, Object.assign({}, spec, { max: 1 })));
  function blit(src, dst, spec, k) {
    k = k || 1;
    const L = canvasLayout(spec), W = Math.round(L.W * k), H = Math.round(L.H * k);
    if (dst.width !== W) dst.width = W; if (dst.height !== H) dst.height = H;
    const c = dst.getContext('2d'); c.clearRect(0, 0, W, H);
    spec.rects.forEach(([x, y, w, hh], i) => { const m = L.map[i]; c.drawImage(src, x * k, y * k, w * k, hh * k, m.ox * k, m.oy * k, w * m.s * k, hh * m.s * k); });
    return L;
  }

  // ── B~F군: 옛 장을 페이지 밖 요소 트리로 한 번 만들고, 고른 구조의 실물 요소를 떼어 붙인다 ──
  const out = [];            // 지금 페이지에 붙어 있는 실물 요소 {el, p, n}
  function take(el, host) {  // el 을 host 로 옮기고 원래 자리를 기억한다
    if (!el || !host) return;
    if (!out.some(o => o.el === el)) out.push({ el, p: el.parentNode, n: el.nextSibling });
    host.appendChild(el);
  }
  function giveBack() {      // 붙인 순서의 반대로 제자리에 돌려놓는다 (다음에 그 트리에서 다시 찾을 수 있게)
    while (out.length) {
      const { el, p, n } = out.pop();
      if (n && n.parentNode === p) p.insertBefore(el, n); else p.appendChild(el);
    }
  }
  const txt = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  function boot(g) {
    const L = CMP.groups[g];
    if (!L || !L.html) return null;
    if (L.list) return L;
    const root = document.createElement('div');
    root.innerHTML = CMP.tx(L.html);
    const sec = root.firstElementChild;
    // run 이 보는 document: 그 장의 트리 + 지금 페이지에 떼어 붙인 조각만 찾는다
    const scope = () => [root].concat(out.map(o => o.el).filter(el => !root.contains(el)));
    const qsa = sel => {
      sel = sel.replace(/^#sec-\w\s+/, '');
      const r = [];
      scope().forEach(n => { if (n !== root && n.matches(sel)) r.push(n); r.push(...n.querySelectorAll(sel)); });
      return r;
    };
    const live = () => st.grp === g;    // 그 군을 보고 있을 때만 「보인다」 — 옛 코드의 애니메이션이 숨으면 멈춘다
    const SEC = { querySelectorAll: qsa, querySelector: s => qsa(s)[0] || null, scrollIntoView() {}, hidden: false,
      get isConnected() { return live(); }, get offsetParent() { return live() ? document.body : null; } };
    const doc = { getElementById: id => id === sec.id ? SEC : qsa('#' + CSS.escape(id))[0] || null,
      querySelectorAll: qsa, querySelector: s => qsa(s)[0] || null, body: document.body };
    const MOD = {};
    try { L.run(doc, gcs, MOD); if (MOD[g]) MOD[g].init(); } catch (e) { console.warn('구조 ' + g, e); }
    L.root = sec;
    L.list = entries(g, sec);
    return L;
  }

  function entries(g, sec) {
    const tabNames = {};
    sec.querySelectorAll('[id$="-tabs"] button[data-s]').forEach(b => {
      const n = b.querySelector('.n'); tabNames[b.dataset.s] = txt(b).replace(n ? txt(n) : '', '').trim();
    });
    return [...sec.querySelectorAll('.card.sec')].map((card, idx) => {
      const sNum = String(idx + 1), id = card.id.replace(/^(\w)-s/, '$1');
      const h2 = card.querySelector('h2');
      if (card.classList.contains('close')) {
        return { id, num: '', tab: tabNames[sNum] || A.t('겹쳐 보면', 'Side by side'), title: txt(h2), text: true, legacy: true, group: g,
          body: [...card.querySelectorAll(':scope > p')].map(p => p.innerHTML), figEl: card.querySelector('svg.f, canvas.f') };
      }
      const num = txt(card.querySelector('.num'));
      const steps = [...card.querySelectorAll('.wstep')];
      const panes = [...card.querySelectorAll('.split')].map((sp, i) => {
        const fig = sp.querySelector('.fig svg, .fig canvas');
        const step = sp.closest('.wstep');
        let hd = '', prev = sp.previousElementSibling;
        while (prev && !hd) { if (prev.matches('h3')) hd = txt(prev); if (prev.matches('.split')) break; prev = prev.previousElementSibling; }
        const intro = step ? step.querySelector('.wtext') : (sp.previousElementSibling && sp.previousElementSibling.matches('p.wtext, p.sub') ? sp.previousElementSibling : null);
        const wi = step ? steps.indexOf(step) + 1 : 0;
        const ctl = sp.children[1];
        return { fig, ctl, read: ctl && ctl.querySelector('.read'), note: ctl && ctl.querySelector('.note'), intro: intro ? intro.innerHTML : '',
          wbtn: wi ? card.querySelector('[data-w="' + wi + '"]') : null,
          label: step ? (i === 0 ? A.t('실험', 'Try it') : String(wi)) : (hd || (i === 0 ? A.t('실험', 'Try it') : String(i + 1))), step: !!step };
      });
      const walkHead = card.querySelector('.walkhead h3');
      return { id, num, tab: tabNames[sNum] || txt(h2), title: txt(h2), legacy: true, group: g,
        idea: (card.querySelector('.idea') || {}).innerHTML || '', panes, walkTitle: walkHead ? txt(walkHead) : '' };
    });
  }

  function group(g) {
    const G = CMP.groups[g];
    if (!G) return null;
    if (g === 'a') return G.list ? G : null;
    const L = boot(g);
    return L && L.list ? L : null;
  }
  function entry() {
    if (st.grp === 'o') return null;
    const G = group(st.grp); if (!G) return null;
    return G.list.find(e => e.id === st.sel[st.grp]) || G.list[0];
  }
  const paneOf = E => E.panes ? E.panes[Math.min(st.pane[E.id] || 0, E.panes.length - 1)] : null;
  const valsOf = E => {
    if (st.vals[E.id]) return st.vals[E.id];
    const d = E.init ? E.init() : {};
    (E.controls || []).forEach(c => { if (c.k) d[c.k] = c.def; });
    return d;
  };

  // ── 공통 조각 ─────────────────────────────────────────
  const opt = (label, on, onclick, extra) => {
    const b = h('button.cmp-opt', Object.assign({ type: 'button', onclick, 'aria-pressed': on ? 'true' : 'false' }, extra || {}), label);
    if (on) b.classList.add('on');
    return b;
  };
  const html = (spec, s) => h(spec, { html: s });

  // ── 윗줄: 목차 + 군 · 축 · 구조 탭 ─────────────────────
  function renderBar() {
    mount('#cmp-groups',
      h('button.cmp-g.cmp-gov' + (st.grp === 'o' ? '.on' : ''), { type: 'button', title: A.t(`광 연산의 종류 — 구조 ${SS.length}개`, `Kinds of optical computing — ${SS.length} structures`),
        'aria-pressed': String(st.grp === 'o'), onclick: () => A.route.go('', '') }, A.t('목차', 'Overview')),
      GROUPS.map(([id, l, name]) => {
        const has = !!CMP.groups[id], on = st.grp === id;
        return h('button.cmp-g' + (on ? '.on' : ''), { type: 'button', title: has ? name : name + A.t(' (준비 중)', ' (coming soon)'), disabled: !has, 'aria-pressed': String(on),
          onclick: () => go(id) }, l);
      }));
    const G = st.grp === 'o' ? null : group(st.grp), E = entry();
    mount('#cmp-tabs', G ? G.list.map(e => A.pill([e.num ? h('span.k', e.num) : null, A.tr(e.tab)].filter(Boolean), E && e.id === E.id,
      () => A.route.go('', e.id), { class: 'pill cmp-tab' })) : []);
  }
  // 군을 고르면 그 군에서 마지막으로 본 구조(없으면 첫 구조)로 간다. 옛 장은 그 군을 실제로 열 때 부팅한다
  const go = g => A.route.go('', st.sel[g] || g + '1');

  // ── 종류 목차: 갈래마다 「X의 종류」. 카드 = 픽토그램(붉은 자리 = 가중치가 사는 곳) + 이름 + 속성 ──
  const SV = { g: [A.t('살아남았다', 'Survived'), 'probe'], m: [A.t('논쟁 중', 'Debated'), 'warm'], t: [A.t('태동', 'Emerging'), 'warm'] };
  const CV = { y: A.t('있음', 'yes'), p: A.t('조각', 'partial'), n: A.t('없음', 'none') };
  const VC = { '휘발': 'var(--warm)', '비휘발': 'var(--probe)', '해당없음': 'var(--link)' };
  const PIC = A.data('pictograms') || {};
  const INST = A.data('inst-names') || {};   // 기관 id → 이름 (구조 표의 inst 가 가리킨다)
  const IR = A.data('inst-refs') || {};        // 기관 → 하는 일의 참조 (work)
  const instsOf = id => { const a = ((SROW[id] || {}).inst || []).slice(); Object.entries(IR).forEach(([i, v]) => { if (v.w.some(w => w.struct === id) && !a.includes(i)) a.push(i); }); return a; };
  const code = s => `${s.group.toUpperCase()}-${s.id.slice(1).padStart(2, '0')}`;
  const pict = s => h('span.cmp-pic', { html: PIC[s.id] ? `<svg viewBox="0 0 80 50" aria-hidden="true">${PIC[s.id]}</svg>` : '' });
  // ── 목차 기본 = 원리 × 차원 격자. 가로 = 빛의 물리가 직접 하는 수학, 세로 = 빛이 퍼지는 차원 ──
  const PRL = (OV && OV.PRL) || {}, DIML = (OV && OV.DIML) || {}, EXI = (OV && OV.EX) || [];
  const PRL_EN = { LIN: 'Linear transform', DYN: 'Temporal dynamics', OPT: 'Optimization', LOG: 'Logic', MOV: 'Moving data', QNT: 'Quantum' };
  const DIML_EN = { '2D': ['In-plane — 2D', 'flows inside on-chip waveguides'], '3D': ['Surface-normal — 3D', 'passes through plates into free space'], '1T': ['One line + time', 'fibre and delay loops; parallelism from time'], MX: ['Mixed by segment', '2D on chip, fibre or free space between'] };
  // 차원 머리 그림: 빛이 칩·판에 대해 퍼지는 모양 (빨강 = 빛)
  const DPIC = {
    '2D': '<path class="pl" d="M6 22 L20 10 L60 10 L46 22 Z"/><path class="lt" d="M14 18 L52 14"/><path class="lt" d="M48 12 l4 2 -4 3"/>',
    '3D': '<rect class="pl" x="11" y="5" width="6" height="20" rx="1"/><rect class="pl" x="27" y="5" width="6" height="20" rx="1"/><rect class="pl" x="43" y="5" width="6" height="20" rx="1"/><path class="lt" d="M2 15 H60"/><path class="lt" d="M56 12 l4 3 -4 3"/>',
    '1T': '<ellipse cx="32" cy="15" rx="22" ry="10"/><circle class="dot" cx="12" cy="12" r="2.2"/><circle class="dot" cx="24" cy="5.6" r="2.2"/><circle class="dot" cx="40" cy="5.6" r="2.2"/><circle class="dot" cx="52" cy="12" r="2.2"/><circle class="dot" cx="44" cy="23.5" r="2.2"/>',
    'MX': '<path class="pl" d="M2 20 L10 12 L22 12 L14 20 Z"/><path class="pl" d="M42 20 L50 12 L62 12 L54 20 Z"/><path class="lt" d="M18 16 C26 4 36 28 46 16"/>',
  };
  // 행 = 연산 원리, 열 = 차원. 원리마다 자기 높이를 가져서 카드가 적은 원리는 행이 얇다(선형 변환이 많다는 것이 행 두께로 보인다)
  function gridView() {
    const PK = Object.keys(PRL), DK = Object.keys(DIML);
    const card = pk => s => h('button.cmp-gxit.pr-' + pk, { type: 'button', title: (s.desc || '') + (s.dimnote ? ' — ' + s.dimnote : ''), onclick: () => A.route.go('', s.id) },
      pict(s),
      h('span.cmp-gxbody',
        h('span.cmp-gxname', A.tr(s.short), h('span.cmp-gxcode', code(s) + (s.pre ? ' ▲' : '') + (s.dimnote ? ' ?' : ''))),
        h('span.cmp-ovsub', h('i', { style: { background: VC[s.vol] || 'var(--faint)' } }), `${A.tr(s.weight)} · ${A.tr(s.vol)}${s.vol === '비휘발' ? ' ◆' : ''}`)));
    const exCard = pk => e => h('span.cmp-gxit.ex.pr-' + pk, { title: A.lang === 'en' ? e.en : e.d },
      e.pic ? h('span.cmp-pic', { html: `<svg viewBox="0 0 80 50" aria-hidden="true">${e.pic}</svg>` }) : h('span.cmp-pic.cmp-picnone', A.t('그림 없음', 'no figure')),
      h('span.cmp-gxbody', h('span.cmp-gxname', A.lang === 'en' ? e.en : e.n, h('span.cmp-gxcode', A.t('새', 'new')))));
    const rows = PK.map(pk => {
      const n = SS.filter(s => s.pr === pk).length + EXI.filter(e => e.pr === pk).length;
      return [
        h('div.cmp-gxrh.pr-' + pk, h('b', A.t(PRL[pk], PRL_EN[pk])), h('small', A.t(`${n}개`, `${n}`))),
        DK.map(dk => {
          const ss = SS.filter(s => s.pr === pk && s.dim === dk), ex = EXI.filter(e => e.pr === pk && e.dim === dk);
          if (!ss.length && !ex.length) return h('div.cmp-gxc.empty', A.t('빈칸', 'empty'));
          return h('div.cmp-gxc', ss.map(card(pk)), ex.map(exCard(pk)));
        })];
    });
    return h('div.cmp-gxwrap', h('div.cmp-gx.cmp-gxT', h('div'),
      DK.map(dk => h('div.cmp-gxch', DPIC[dk] ? h('span.cmp-gxpic', { html: `<svg viewBox="0 0 64 30" aria-hidden="true">${DPIC[dk]}</svg>` }) : null,
        h('span.cmp-gxct', h('b', A.t(DIML[dk][0], DIML_EN[dk][0])), h('small', A.t(DIML[dk][1], DIML_EN[dk][1]))))), rows));
  }
  const gridRead = () => h('div.cmp-read',
    h('p', h('b', A.t('센서 안·ADC 앞 계산(▲)은 4개 중 3개가 3D 열에 있다.', 'Three of the four in-sensor or pre-ADC designs (▲) sit in the 3D column.')), A.t(' 카메라 입력은 처음부터 면에 수직으로 오는 영상이라서다. 입력이 처음부터 빛인 응용을 노리라는 McMahon의 제안과 겹치지만, 그 제안이 3D 구조에만 해당하는 건 아니다.', ' Camera input already arrives as an image normal to the surface. This overlaps with McMahon’s advice to target applications whose input is already light, though that advice is not limited to 3D designs.')),
    h('p', h('b', A.t('되먹임 구조는 「한 줄 + 시간」을 자주 쓴다.', 'Feedback designs often use “one line + time”.')), A.t(' 지연 루프 리저버와 코히런트 이징 머신이 그렇다 — 광섬유 고리가 긴 지연을 싸게 주기 때문이다. 다만 시간 동역학·최적화 전체는 네 열에 고루 퍼져 있다.', ' The delay-loop reservoir and the coherent Ising machine do — a fibre loop gives a long delay cheaply. Temporal dynamics and optimization as a whole, though, spread across all four columns.')),
    h('p', h('b', A.t('2D 열은 선형 변환과 데이터 이동이 대부분이다(16개 중 10개).', 'The 2D column is mostly linear transforms and data movement (10 of 16).')), A.t(' 실리콘 포토닉스 공정이 계산용과 연결용 소자 블록을 함께 제공하는 경우가 많다.', ' Silicon-photonics processes often offer device blocks for both computing and interconnects.')),
    h('p', h('b', A.t('같은 원리가 열을 바꿔 다시 나온다.', 'The same principle reappears in another column.')), A.t(' 회절판(3D)은 칩 위 슬롯 줄(2D)로 옮겨 갔다. S-SEED(3D)와 회절판은 자유공간에서 층을 건너가는 배치가 닮았지만, 소자 원리와 비선형은 전혀 다르다. 열 사이 이동이 따로 자란 분야를 잇는 자리다. 빈칸은 「없다」가 아니라 「아직 확인하지 않았다」이다.', ' Diffractive plates (3D) moved on chip as slot rows (2D). S-SEED (3D) and diffractive plates share a free-space layer-to-layer layout, but their device physics and nonlinearity are entirely different. Moving between columns is where separately grown fields connect. Empty cells mean “not yet checked”, not “nothing there”.')));
  function renderOverview() {
    if (!OV) { mount(stage, h('p.empty.cmp-pad', A.t('데이터 로드 실패 — 목차 데이터를 읽지 못했다.', 'Failed to load — could not read the overview data.'))); mount(side); return; }
    const para = (CP && CP.PARA) || [];
    const rows = para.map(p => {
      const items = SS.map(s => ({ s })).filter(o => o.s.para === p.id);
      if (!items.length) return null;
      const sv = SV[p.sv], cv = CV[p.cv];
      // 이 갈래를 하는 기관 — 구조별 어디서(inst ∪ work.struct) 와 work 의 para 참조를 합친다
      const insts = new Set(); items.forEach(({ s }) => instsOf(s.id).forEach(i => insts.add(i)));
      Object.entries(IR).forEach(([i, v]) => { if (v.w.some(w => w.para === p.id)) insts.add(i); });
      return h('div.cmp-ovrow', { id: 'kind-' + p.id },
        h('div.cmp-ovhead',
          h('div', h('span.cmp-ovt', p.id === 'etc' ? p.t : A.t(p.t + '의 종류', p.t)), h('span.cmp-ovn', items.length + A.t('개', '')),
            insts.size ? h('a.cmp-ovinst', { href: 'institutions.html#?kind=' + p.id, title: A.t('기관 지도에서 이 종류만 보기', 'Only this kind on the institutions map') }, A.t(`기관 ${insts.size}곳`, `${insts.size} institutions`)) : null),
          sv || cv ? h('div.cmp-ovtags',
            sv ? h('span.cmp-sv.' + sv[1], sv[0]) : null,
            cv ? h('span.cmp-cv.' + p.cv, h('i'), (UI.cv || '') + cv) : null) : null,
          h('span.cmp-ovd', p.d)),
        h('div.cmp-ovitems', items.map(({ s }) => h('button.cmp-ovit', {
          type: 'button', title: s.desc, onclick: () => A.route.go('', s.id) },
          pict(s),
          h('span.cmp-ovbody',
            h('span.cmp-ovname', A.tr(s.short), h('span.cmp-ovcode', code(s))),
            h('span.cmp-ovsub', h('i', { style: { background: VC[s.vol] || 'var(--faint)' } }),
              `${A.tr(s.weight)} · ${A.tr(s.vol)}${s.vol === '비휘발' ? ' ◆' : ''}`))))));
    });
    // 주장은 목록 아래 본문으로 — 제목은 「X의 종류」라는 이름이고, 왜 그렇게 갈리는지는 여기서 말한다
    const n = SS.length;
    const read = h('div.cmp-read',
      h('p', h('b', A.t('가중치를 어디에 두느냐가 설계를 가른다.', 'Where you put the weights decides the design.')), A.t(' 위상에 두면 임의 행렬이 되지만 소자가 N²로 늘고 히터를 계속 켜둬야 한다. 파장에 두면 합산이 공짜가 되지만 온도에 묶인다. 공간에 두면 전파가 연산을 대신 해주지만 바꾸려면 다시 찍어야 한다. 재료의 상태에 두면 꺼도 남지만 쓰기가 느리다.', ' In phase, you get an arbitrary matrix, but devices grow as N² and the heaters must stay on. In wavelength, summation comes for free, but you are tied to temperature. In space, propagation does the computing for you, but changing it means fabricating again. In the state of a material, the values survive power-off, but writing is slow.')),
      h('p', h('b', A.t('끄면 남는 건 여섯 개뿐이다(◆).', 'Only six survive power-off (◆).')), A.t(` ${n}개 중 전원을 끊어도 값이 남는 건 여섯 개뿐이고, 그중 넷은 바꾸려면 다시 찍어야 하는 쪽이다. 쓰기가 되는 비휘발은 사실상 PCM 계열 둘이다. 리뷰들이 다음 승부처로 가중치 저장·업데이트를 꼽는 이유가 이 숫자에 있다.`, ` Of the ${n}, only six keep their values when the power is cut, and four of those can only be changed by fabricating again. Rewritable non-volatile weights are in practice the two PCM designs. This number is why reviews name weight storage and updating as the next battleground.`)),
      h('p', h('b', A.t('그리고 절반은 연산이 아니라 읽기에서 갈린다.', 'And half the battle is decided in readout, not computation.')), A.t(' 검출기는 세기만 읽으니 부호가 사라지고, 되찾으려면 기준 빛을 같이 때려야 한다. 아무리 좋은 행렬곱도 읽는 방식이 음수를 버리면 쓸 수 없다.', ' A detector reads only intensity, so the sign is lost; getting it back means mixing in a reference beam. However good the matrix multiply, it is useless if the readout throws away negative values.')));
    // 첫 화면 맨 위 — 만든 사람·먼저 볼 구조·먼저 읽을 글로 가는 길만 둔다
    const who = h('div.cmp-who',
      h('p.cmp-wholinks',
        h('a', { href: 'about.html' }, A.t('만든 사람', 'About the author')),
        h('a', { href: '#a5' }, A.t('먼저 볼 구조 — PCM 크로스바', 'Start here — PCM crossbar')),
        h('a', { href: 'writing-matrix-crossbar.html' }, A.t('먼저 읽을 글 — 신경망이 어떻게 크로스바로 표현될까?', 'Read first — How can a neural network be expressed as a crossbar?'))));
    // 갈래의 역사 — 시간 × 무엇을 계산하나 (그림은 scripts/branches_svg.py 가 만든다)
    const hist = h('figure.cmp-hist',
      h('a', { href: A.root + 'img/compute/' + (A.lang === 'en' ? 'branches-en.svg' : 'branches.svg'), target: '_blank', rel: 'noopener', title: A.t('크게 보기', 'Open full size') },
        h('img', { src: A.root + 'img/compute/' + (A.lang === 'en' ? 'branches-en.svg' : 'branches.svg'), loading: 'lazy',
          alt: A.t('광 연산의 갈래를 1960년부터 2026년까지 시간축에 그린 그림. 위 두 줄(디지털 논리, 데이터 이동)은 Miller 2010이 다룬 범위이고, 아래 네 줄(행렬곱, 시간 동역학, 최적화, 센서·ADC 앞 계산)은 그 잣대를 그대로 대기 어려운 아날로그 연산이다.',
            'Branches of optical computing on a timeline from 1960 to 2026. The top two rows (digital logic, moving data) are what Miller 2010 covered; the four rows below (matrix multiply, temporal dynamics, optimization, in-sensor or pre-ADC computing) are analog computing to which that yardstick does not directly apply.') })),
      h('figcaption', A.t('갈래는 언제 갈라졌나. Miller 2010의 잣대는 논리 소자의 기준이라 위 두 줄에 맞춰져 있다 — 아래 네 줄(아날로그 연산)은 1960년대부터 있었지만 2010년 이후 크게 늘었다. ', 'When did the branches split? Miller 2010\'s yardstick is a test for logic devices, so it fits the top two rows — the four below (analog computing) date back to the 1960s but grew sharply after 2010. '),
        h('a', { href: A.root + 'writing-review-miller-2010.html' }, A.t('Miller 2010 글 읽기', 'Read the Miller 2010 piece (Korean)'))));
    const kindMode = !!st.ovk;
    const sw = h('div.cmp-ovsw',
      opt(A.t('원리 × 차원', 'Principle × dimension'), !kindMode, () => A.route.set({ ov: null })),
      opt(A.t('산업 지형 (기존 갈래)', 'Industry map (branches)'), kindMode, () => A.route.set({ ov: 'kind' })),
      h('span.cmp-glegend', kindMode ? A.t('갈래 = 시장·커뮤니티 기준. 기관 지도와 이어진다.', 'Branches follow markets and communities; linked to the institutions map.')
        : A.t('카드를 누르면 그 구조로 · 붉은 자리 = 가중치가 사는 곳 · ▲ 센서 안·ADC 앞 · ◆ 비휘발 · 새 = 아직 구조 페이지 없음 · ? 차원 확인 필요', 'Click a card to open it · red = where the weights live · ▲ in-sensor or pre-ADC · ◆ non-volatile · new = no structure page yet · ? dimension to check')));
    mount(stage, h('div.cmp-ov', who, sw, kindMode ? [rows, read] : [gridView(), gridRead()], hist));
  }
  // ── 그림 크기: 남은 높이에 맞춘 폭 (넓은 화면). 좁은 화면은 칸 폭 그대로 ──
  function fitW(fw, fh) {
    const b = $('.cmp-figbox', stage), top = b ? b.getBoundingClientRect().top : 190, ih = window.innerHeight || 800;
    const avail = Math.max(200, ih - top - 140), boxW = b ? b.clientWidth - 96 : 480;
    const fit = avail * fw / fh;
    return Math.round(fh > fw ? Math.min(boxW, fit) : Math.max(Math.min(380, boxW), Math.min(1000, boxW, fit)));
  }

  // ── 부품표 마커 ───────────────────────────────────────
  // 그림 위 % 좌표에 번호를 찍는다. 쌓아 올린 그림이면 좌표도 같이 옮기고, 글자와 서로를 피한다
  function markers(E, FS, figId, wrap) {
    const items = BOM(E.id), mk = E.mk || {};
    const remap = p => { if (!FS || !FS.L) return p; const q = mapPoint(FS.L, p[0] * FS.ow / 100, p[1] * FS.oh / 100); return [q[0] / FS.w * 100, q[1] / FS.h * 100]; };
    let n = 0; const list = [];
    items.forEach(it => {
      const fix = mk[it.id] || {}, p0 = fix.p || it.p;
      if (!p0) return; const num = ++n;
      if (figId !== undefined && (it.pf ? it.pf.slice(1) !== figId : figId !== '__main__')) return;
      const pts = [p0, fix.p2 || (fix.p ? null : it.p2)].filter(Boolean).map(remap);
      list.push({ id: it.id, pts, num, lab: it.lab || DEV(it.id).n, name: DEV(it.id).n });
    });
    const R = (wrap.querySelector(':scope > .cmp-marks') || wrap).getBoundingClientRect(), px = R.width || 800, ph = R.height || px * 0.5;
    const svg = wrap.querySelector(':scope > svg');
    const obs = svg && R.width ? [...svg.querySelectorAll('text')].map(t => { const b = t.getBoundingClientRect(); return b.width ? [(b.left - R.left) / R.width * 100, (b.top - R.top) / R.height * 100, (b.right - R.left) / R.width * 100, (b.bottom - R.top) / R.height * 100] : null; }).filter(Boolean) : [];
    const rx = 13 / px * 100, ry = 13 / ph * 100, placed = [];
    const hit = (x, y) => obs.some(r => x + rx > r[0] && x - rx < r[2] && y + ry > r[1] && y - ry < r[3]) || placed.some(([a, b]) => Math.abs(a - x) < rx * 1.9 && Math.abs(b - y) < ry * 1.9);
    const D8 = [[0, 0], [0, -1], [0, 1], [1, 0], [-1, 0], [1, -1], [-1, -1], [1, 1], [-1, 1]];
    list.forEach(m => {
      m.anchors = m.pts.map(([x0, y0]) => {
        let best = [x0, y0];
        outer: for (const k of [0, 1.6, 2.6, 3.8, 5.2]) for (const [dx, dy] of D8) { if (!k && (dx || dy)) continue; const x = x0 + dx * k * rx, y = y0 + dy * k * ry; if (k && (x < 2 || x > 98 || y < 2 || y > 98)) continue; if (!hit(x, y)) { best = [x, y]; break outer; } }
        placed.push(best);
        return best;
      });
    });
    return list;
  }
  function legend(E, onIds, paneLabel) {
    let n = 0; const mk = E.mk || {};
    return BOM(E.id).filter(it => it.p || (mk[it.id] || {}).p).map(it => {
      const num = ++n, here = onIds.has(it.id), d = DEV(it.id);
      const pane = it.pf && E.panes ? E.panes.find(p => p.fig && '#' + p.fig.id === it.pf) : null;
      return { id: it.id, num, lab: it.lab || d.n, hint: d.n, where: here ? '' : (pane ? paneLabel(pane) : ''), here };
    });
  }
  function openDev(id, num) { st.dev = id; st.devNum = num; paintMarks(); renderDev(); renderShelf(); }
  function closeDev() { st.dev = null; paintMarks(); renderDev(); renderShelf(); }

  // ── 구조 화면 ─────────────────────────────────────────
  let cur = null;   // 지금 그린 구조의 그림 상태 {E, wrap, fig, FS, figId, legendIds, paneLabel, mo}
  let blitJob = null, raf = 0, seen = false;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { seen = es.some(e => e.isIntersecting); loop(); }) : null;
  function loop() {   // 옛 캔버스를 쌓은 그림으로 옮겨 그리는 고리 — 그림이 화면에 보일 때만 돈다
    if (!blitJob || !seen || raf) return;
    raf = requestAnimationFrame(function tick() {
      raf = 0;
      if (!blitJob || !seen) return;
      blit(blitJob.src, blitJob.dst, blitJob.spec);
      raf = requestAnimationFrame(tick);
    });
  }
  function stopFig() {
    if (cur && cur.mo) cur.mo.disconnect();
    if (io) io.disconnect();
    if (raf) cancelAnimationFrame(raf);
    raf = 0; blitJob = null; seen = false; cur = null;
  }

  function figSize(el, stk) {
    const spec = STACK[el.id];
    if (spec && spec.rects && stk) { const L = canvasLayout(spec); return { w: L.W, h: L.H, L, ow: el.width, oh: el.height }; }
    const vb = el.viewBox && el.viewBox.baseVal, w = vb && vb.width ? vb.width : (+el.getAttribute('width') || 880), hh = vb && vb.height ? vb.height : (+el.getAttribute('height') || 300);
    if (spec && el._stk) return { w, h: hh, L: el._stk, ow: el._vb0[2], oh: el._vb0[3] };
    return { w, h: hh, L: null };
  }

  function render() {
    stopFig();
    giveBack();
    closeLab();
    renderBar();
    stage.classList.toggle('cmp-ovstage', st.grp === 'o');
    side.hidden = st.grp === 'o';
    if (st.grp === 'o') { mount(side); renderOverview(); return; }
    const E = entry();
    if (!E) {
      mount(stage, h('p.empty.cmp-pad', A.t('데이터 로드 실패 — 이 군의 구조 모듈을 읽지 못했다.', 'Failed to load — could not read the structure module for this family.')));
      mount(side); return;
    }
    document.title = (E.title ? A.tr(E.title) + ' · ' : '') + A.t('종류', 'Kinds') + ' — ' + A.site;
    if (st.deep && LABS[E.id] && window[LABS[E.id].mod]) { renderLab(E); return; }
    if (E.text) renderText(E); else renderFig(E);
  }

  // ── 깊게 보기: 실험실 부품을 그림·패널 자리에 붙인다 ──
  function closeLab() { if (lab) { lab.destroy(); lab = null; labFor = null; } stage.classList.remove('cmp-labstage'); }
  function renderLab(E) {
    const id = E.id, def = LAB[id];
    const main = h('div.cmp-lab'), sd = h('div.cmp-labside');
    stage.classList.add('cmp-labstage');
    mount(stage, main); mount(side, sd);
    const off = Object.fromEntries(LABKEYS.map(k => [k, null]));
    lab = window[LABS[id].mod].mount(main, sd, {
      state: r => ({ pre: A.route.param(r, 'pre', def), params: r.params }),
      set: (patch, opt) => A.route.set(patch, opt),
      preset: (pid, reset) => A.route.set(Object.assign({}, reset, { pre: pid === def ? null : pid })),
      href: s => {
        const [pid, qs] = s.split('?'), ps = new URLSearchParams(qs || '');
        ps.set('deep', '1'); if (pid !== def) ps.set('pre', pid);
        return '#' + id + '?' + ps.toString();
      },
      back: () => A.route.set(off),
    });
    labFor = lab ? id : null;
    if (lab) { lab.update(lastR || A.route.get()); document.title = A.tr(E.title) + ' · ' + A.t('깊게 보기', 'Deep view') + ' — ' + A.site; }
  }

  function renderText(E) {
    const G = group(st.grp), figHost = h('div.cmp-figwrap.cmp-textfig');
    mount(stage, h('div.cmp-text',
      h('h2', A.tr(E.title)),
      E.legacy ? figHost : null,
      h('div.cmp-body', (E.body || []).map(p => html('p', p)))));
    if (E.figEl) take(E.figEl, figHost); else figHost.remove();
    mount(side, h('p.note', A.t(`${G.name}의 구조를 한자리에 겹쳐 본 요약이다. 위 탭에서 구조를 고르면 그림과 손잡이로 돌아간다.`, `A summary laying the structures of ${G.name} on top of each other. Pick a structure in the tabs above to go back to its figure and controls.`)));
  }

  function renderFig(E) {
    const G = group(st.grp), legacy = !!E.legacy;
    const p = legacy ? paneOf(E) : null, pi = legacy ? E.panes.indexOf(p) : 0;
    const wrap = h('div.cmp-figwrap'), marks = h('div.cmp-marks'), leg = h('div.cmp-legend');
    const label = h('span.cmp-figlabel');
    const markBtn = h('button.cmp-opt.cmp-markbtn', { type: 'button', onclick: () => { st.marks = !st.marks; paintMarks(); } }, A.t('자리 표시', 'Show parts'));
    const box = h('div.cmp-figbox', label, markBtn, wrap, leg);
    mount(stage, box, h('div#cmp-shelf'));
    cur = { E, wrap, marks, leg, label, markBtn };

    let fig, FS, figId;
    if (legacy) {
      fig = p.fig;
      const spec = fig && STACK[fig.id];
      const isCv = fig && fig.tagName.toLowerCase() === 'canvas';
      if (isCv && spec && spec.rects) cur.stkTest = () => stackOn(fig.width, fig.height, canvasLayout(spec));
      cur.stk = !!(cur.stkTest && cur.stkTest());
      if (isCv && cur.stk) {
        if (!fig._proxy) fig._proxy = h('canvas', { 'aria-label': fig.getAttribute('aria-label') || E.title, role: 'img' });
        wrap.appendChild(fig._proxy);
        blit(fig, fig._proxy, spec);
        blitJob = { src: fig, dst: fig._proxy, spec };
        if (io) io.observe(fig._proxy); else { seen = true; loop(); }
      } else if (fig) {
        take(fig, wrap);
        if (spec && spec.parts) {
          const L = stackSvg(fig, spec);
          cur.stkTest = () => !!fig._stkL && stackOn(fig._vb0[2], fig._vb0[3], fig._stkL);
          cur.stk = !!L && cur.stkTest();
          if (!cur.stk) unstackSvg(fig);
        }
      }
      FS = fig ? figSize(fig, cur.stk) : { w: 880, h: 300, L: null };
      const own = BOM(E.id).some(i => i.pf && fig && i.pf.slice(1) === fig.id);
      figId = fig ? (pi === 0 && !E.panes[0].step && !own ? '__main__' : fig.id) : '__main__';
      label.textContent = `FIG ${st.grp.toUpperCase()}·${E.num}` + (p.step ? A.t(` — ${p.label}단계`, ` — step ${p.label}`) : '') + ` — ${fig ? (fig.getAttribute('aria-label') || A.tr(E.title)) : A.tr(E.title)}`;
      cur.paneLabel = q => q.step ? A.t(q.label + '단계', 'Step ' + q.label) : q.label;
      // 옛 코드가 그림을 다시 그리면 쌓기·마커를 다시 맞춘다
      if (fig && fig.tagName.toLowerCase() === 'svg') {
        let pend = 0;
        const mo = new MutationObserver(() => {
          if (pend) return;
          pend = requestAnimationFrame(() => {
            pend = 0;
            if (!cur || cur.mo !== mo) return;
            mo.disconnect();
            if (spec && spec.parts && cur.stk) stackSvg(fig, spec);
            cur.FS = figSize(fig, cur.stk);
            mo.observe(fig, { childList: true, subtree: true, characterData: true });
            paintMarks();
          });
        });
        mo.observe(fig, { childList: true, subtree: true, characterData: true });
        cur.mo = mo;
      }
    } else {
      if (E.stack) cur.stkTest = () => stackOn(E.fig.w, E.fig.h, canvasLayout(E.stack));
      cur.stk = !!(cur.stkTest && cur.stkTest());
      const SL = cur.stk ? canvasLayout(E.stack) : null;
      const fw = SL ? Math.round(SL.W) : E.fig.w, fh = SL ? Math.round(SL.H) : E.fig.h;
      if (E.fig.type === 'svg') {
        fig = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        fig.setAttribute('viewBox', `0 0 ${fw} ${fh}`);
        fig.setAttribute('role', 'img'); fig.setAttribute('aria-label', E.label);
      } else fig = h('canvas', { width: fw, height: fh, role: 'img', 'aria-label': E.label });
      wrap.appendChild(fig);
      FS = SL ? { w: fw, h: fh, L: SL, ow: E.fig.w, oh: E.fig.h } : { w: fw, h: fh, L: null };
      label.textContent = `FIG ${st.grp.toUpperCase()}·${E.num} — ${E.label}`;
      cur.paneLabel = () => '';
    }
    wrap.appendChild(marks);
    Object.assign(cur, { fig, FS, figId });
    sizeFig();

    renderSide(E, G, p, pi);
    if (!legacy) refreshA();
    requestAnimationFrame(() => { if (cur && cur.E === E) { sizeFig(); paintMarks(); } });
  }

  function sizeFig() {
    if (!cur || !cur.FS) return;
    const w = A.narrow() ? null : fitW(cur.FS.w, cur.FS.h) + 'px';
    cur.wrap.style.maxWidth = w || '';
    cur.leg.style.maxWidth = w || '';
  }

  function paintMarks() {
    if (!cur) return;
    const { E, wrap, marks, leg, FS, figId } = cur;
    const list = markers(E, FS, E.legacy ? figId : undefined, wrap);
    const items = BOM(E.id);
    const onIds = E.legacy
      ? new Set(list.map(m => (items.filter(i => i.p)[m.num - 1] || {}).id).filter(Boolean))
      : new Set(items.map(i => i.id));
    const lg = legend(E, onIds, cur.paneLabel);
    cur.hasMarks = list.length > 0;
    cur.markBtn.hidden = !list.length;
    cur.markBtn.classList.toggle('on', st.marks);
    cur.markBtn.setAttribute('aria-pressed', String(st.marks));
    mount(marks, st.marks ? list.flatMap(m => m.anchors.map(([x, y]) => h('button.cmp-mk' + (st.dev === m.id ? '.on' : ''), {
      type: 'button', title: m.name + ' — ' + m.lab, 'aria-label': m.name + ' — ' + m.lab,
      style: { left: x + '%', top: y + '%' }, onclick: () => openDev(m.id, m.num) }, String(m.num)))) : []);
    const showLeg = E.legacy ? lg.length > 0 : list.length > 0;
    leg.hidden = !showLeg;
    mount(leg, showLeg ? lg.map(m => h('button.cmp-lg' + (st.dev === m.id ? '.on' : m.here ? '.here' : ''), { type: 'button', title: m.hint, onclick: () => openDev(m.id, m.num) },
      h('span.cmp-lgn', String(m.num)), h('span', m.lab), m.where ? h('span.cmp-lgw', m.where) : null)) : []);
    cur.legendCount = lg.length;
    const hint = $('#cmp-devhint');
    if (hint) hint.hidden = !!st.dev || !(E.legacy ? lg.length : list.length);
  }

  // ── 오른쪽 패널 ───────────────────────────────────────
  function renderSide(E, G, p, pi) {
    const legacy = !!E.legacy;
    const idea = legacy ? html('p.cmp-idea', E.idea) : h('p.cmp-idea', E.idea.map(([t, k]) => k ? h('b.k', t) : t));
    const head = h('div.cmp-head',
      h('button.cmp-ttl', { type: 'button', 'aria-expanded': String(st.info), onclick: () => { st.info = !st.info; ideaBox.hidden = !st.info; tl.textContent = st.info ? A.t('접기 ▴', 'Hide ▴') : A.t('설명 ▾', 'About ▾'); head.firstChild.setAttribute('aria-expanded', String(st.info)); } },
        h('span.cmp-num', E.num), h('span.cmp-title', A.tr(E.title)), h('span.cmp-tl', st.info ? A.t('접기 ▴', 'Hide ▴') : A.t('설명 ▾', 'About ▾'))));
    const ideaBox = h('div.cmp-ideabox', idea), tl = head.querySelector('.cmp-tl');
    ideaBox.hidden = !st.info;
    head.appendChild(ideaBox);

    let panes = null, intro = null;
    if (legacy && E.panes.length > 1) {
      const wt = (E.walkTitle && p.step) || (!/^[①-⑳]/.test(p.label) && E.walkTitle) ? E.walkTitle : (/^[①-⑳]/.test(p.label) ? p.label : (E.walkTitle || A.t('단계', 'Steps')));
      panes = h('div.cmp-panes', h('span.lb', wt), h('div.wrap', E.panes.map((q, i) => opt(
        /^[①-⑳]/.test(q.label) ? q.label.slice(0, 1) : (q.label.length > 8 ? String(i + 1) : q.label), i === pi,
        () => { if (q.wbtn) q.wbtn.click(); st.pane[E.id] = i; render(); }, { title: q.label }))));
    }
    if (legacy && p.intro) intro = html('p.cmp-intro', p.intro);

    const ctl = h('div.cmp-ctl'), stats = h('div.cmp-stats'), read = h('div.cmp-read');
    // 논문 목록은 패널 맨 아래라 멀다 — 위에 바로가기를 둔다
    const papers = A.papers(E.id, LAB[E.id] ? pid => '#' + E.id + '?deep=1' + (pid === LAB[E.id] ? '' : '&pre=' + pid) : null);
    const toPapers = papers ? h('button.cmp-topapers', { type: 'button', onclick: () => papers.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
      A.t(`관련 논문 ${papers.querySelectorAll('.paper').length}편 ↓`, `Related papers (${papers.querySelectorAll('.paper').length}) ↓`)) : null;
    const foot = h('div.cmp-foot',
      h('div', h('span.lb', A.t('어디서', 'Where')), h('span', (SROW[E.id] || {}).where || '',
        instsOf(E.id).length ? h('span.cmp-insts', instsOf(E.id).map(i => h('a.cmp-inst', { href: 'institutions.html#' + i }, INST[i] || i))) : null)),
      h('div', h('span.lb', A.t('벽', 'Wall')), h('span.cmp-wall', (SROW[E.id] || {}).wall || '')),
      papers,
      h('div.cmp-note'));
    const deep = LAB[E.id] ? h('button.cmp-deep', { type: 'button', onclick: () => A.route.set({ deep: '1' }) },
      h('b', A.t('깊게 보기', 'Deep view')), h('span', A.t('논문 프리셋으로 재료·광원·검출기를 바꿔 돌려 본다 · 3D', 'Swap materials, sources and detectors with paper presets and run it · 3D'))) : null;
    mount(side, h('div.cmp-main-side', head, deep, figRow(E.id), toPapers, panes, intro, ctl, stats, read, h('div#cmp-dev')), foot);
    stats.hidden = true;

    if (legacy) {
      if (p.ctl) take(p.ctl, ctl);
      if (p.read) take(p.read, read);
      if (p.note) take(p.note, $('.cmp-note', foot));
    } else {
      buildControlsA(E, ctl);
      if (E.note) $('.cmp-note', foot).appendChild(html('p.note', E.note));
    }
    renderDev();
    renderShelf();
  }

  function renderDev() {
    const box = $('#cmp-dev'); if (!box) return;
    if (!st.dev) {
      mount(box, h('p.note#cmp-devhint', { hidden: !(cur && (cur.E.legacy ? cur.legendCount : cur.hasMarks)) }, A.t('그림의 번호를 누르면 그 소자 설명이 여기에 뜬다.', 'Click a number in the figure to show that device here.')));
      return;
    }
    const d = DEV(st.dev), it = cur ? BOM(cur.E.id).find(x => x.id === st.dev) : null, how = ((X.HOW || {})[st.dev]) || [];
    mount(box, h('div.cmp-devbox',
      h('div.cmp-devhead', h('span.cmp-devn', String(st.devNum || '·')), h('span.cmp-devt', d.n),
        h('button.cmp-x', { type: 'button', 'aria-label': A.t('닫기', 'Close'), onclick: closeDev }, '×')),
      it ? h('p.cmp-devr', it.r) : null,
      h('div.cmp-devd', d.d || ''),
      how.length ? h('p.cmp-devh', A.t('만드는 법 · ', 'How it is made · ') + how.join(' · ')) : null,
      it && it.w ? h('p.cmp-devw', '↳ ' + it.w) : null));
  }

  // ── 부품 선반: 그림 아래, 부품을 「빛에 무엇을 하나」 순으로. 누르면 그림의 자리와 설명이 열린다 ──
  const GORD = X.GROUPS || [];
  function renderShelf() {
    const box = $('#cmp-shelf'); if (!box || !cur) return;
    const E = cur.E, items = BOM(E.id), miss = ((X.MISS || {})[E.id]) || [];
    const lines = Array.isArray(miss) ? miss : [miss];
    if (!items.length && !lines.length) { mount(box); return; }
    let n = 0; const num = {};
    items.forEach(it => { if (it.p) num[it.id] = String(++n); });
    const order = items.slice().sort((a, b) => GORD.indexOf(DEV(a.id).g) - GORD.indexOf(DEV(b.id).g));
    const must = items.filter(i => i.k).length;
    mount(box,
      h('span.lb', A.t(`부품 ${items.length} · 필수 ${must}`, `${items.length} parts · ${must} required`)),
      order.map(it => h('button.cmp-part' + (it.k ? '.must' : '') + (st.dev === it.id ? '.on' : ''), {
        type: 'button', title: it.r || '', onclick: () => (st.dev === it.id ? closeDev() : openDev(it.id, num[it.id] ? +num[it.id] : 0)) },
        num[it.id] ? h('b', num[it.id]) : null, DEV(it.id).n, it.n ? h('i', it.n) : null)),
      lines.length ? h('p.cmp-shelfmiss', h('span', A.t('없는 것 — ', 'Missing — ')),
        lines.map(t => String(t).replace(/<b>(.*?)<\/b>\s*/g, '$1 — ').replace(/<[^>]+>/g, '')).join(' ')) : null);
  }

  // ── A군: 손잡이 · 그림 · 읽기 ─────────────────────────
  function setter(E) {
    return patch => {
      st.vals[E.id] = Object.assign({}, valsOf(E), patch);
      if (cur && cur.E === E) refreshA();
    };
  }
  function buildControlsA(E, ctl) {
    const set = setter(E);
    cur.ctlA = (E.controls || []).map(c => {
      if (c.type === 'range') {
        const val = h('span.cmp-val');
        const inp = h('input', { type: 'range', min: c.min, max: c.max, step: c.step, oninput: e => set({ [c.k]: +e.target.value }), style: { accentColor: c.warm ? 'var(--warm)' : 'var(--beam)' } });
        const el = h('label.cmp-range' + (c.sep ? '.sep' : '') + (c.warm ? '.warm' : ''), h('span', c.label), inp, val);
        ctl.appendChild(el);
        return S => { if (+inp.value !== S[c.k]) inp.value = S[c.k]; val.textContent = c.fmt ? c.fmt(S[c.k]) : String(S[c.k]); };
      }
      if (c.type === 'seg') {
        const btns = c.opts.map(([v, l]) => opt(l, false, () => set({ [c.k]: v })));
        ctl.appendChild(h('div.cmp-segrow', h('span.cmp-seglb', c.label), btns));
        return S => btns.forEach((b, i) => { const on = S[c.k] === c.opts[i][0]; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
      }
      const b = opt('', false, () => c.act(valsOf(E), set));
      ctl.appendChild(b);
      return S => { const on = c.on ? !!c.on(S) : false; b.textContent = c.label(S); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); };
    });
  }
  function refreshA() {
    if (!cur || cur.E.legacy) return;
    const E = cur.E, S = valsOf(E), o = E.render(S), fig = cur.fig;
    (cur.ctlA || []).forEach(f => f(S));
    if (E.fig.type === 'svg' && o.svg != null) { fig.innerHTML = o.svg; if (E.bind) E.bind(fig, S, setter(E)); }
    if (E.fig.type === 'canvas' && o.draw) {
      if (cur.stk) {
        const off = cur.off || (cur.off = document.createElement('canvas')), k = Math.min(3, Math.max(2, window.devicePixelRatio || 2));
        off.width = E.fig.w * k; off.height = E.fig.h * k;
        const cx = off.getContext('2d'); cx.setTransform(k, 0, 0, k, 0, 0);
        o.draw(cx, E.fig.w, E.fig.h); blit(off, fig, E.stack, k);
      } else o.draw(fig.getContext('2d'), fig.width, fig.height);
    }
    const stats = $('.cmp-stats', side);
    if (stats) {
      stats.hidden = !(o.stats || []).length;
      mount(stats, (o.stats || []).map(s => { const [v, ...u] = String(s.v).split(' '); return h('div', h('span.cmp-sl', s.l), h('span.cmp-sv2', h('b', { style: { color: s.c || '' } }, v), h('span', u.join(' ')))); }));
    }
    const read = $('.cmp-read', side);
    if (read) read.innerHTML = o.read || '';
    if (cur.hasMarks !== undefined) paintMarks();
  }

  // ── 입력 ─────────────────────────────────────────────
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && st.dev) closeDev(); });
  let rs = 0;
  window.addEventListener('resize', () => {
    if (rs) return;
    rs = requestAnimationFrame(() => {
      rs = 0;
      if (cur && cur.stkTest && cur.stkTest() !== cur.stk) { render(); return; }
      sizeFig(); requestAnimationFrame(paintMarks);
    });
  });

  A.route.on(r => {
    lastR = r;
    // #kind/<갈래> — 목차의 그 갈래 행으로(기관 페이지의 종류 칩이 온다)
    if (r.key === 'kind') {
      st.grp = 'o'; st.ovk = true; st.dev = null; st.deep = false; render();
      const el = document.getElementById('kind-' + r.arg);
      if (el) { el.classList.add('cmp-ovhl'); el.scrollIntoView({ block: 'start' }); }
      return;
    }
    const m = HASH.exec(r.raw);
    st.deep = A.route.param(r, 'deep', '') === '1';
    // 실험실이 없는 구조로 옮기면 깊게 보기 키를 걷어 낸다(다시 돌아왔을 때 저절로 열리지 않게)
    if (LABKEYS.some(k => r.params[k] != null) && !(st.deep && m && LAB[m[1] + m[2]])) { A.route.set(Object.fromEntries(LABKEYS.map(k => [k, null])), { replace: true }); return; }
    if (lab && st.deep && m && labFor === m[1] + m[2]) { lab.update(r); return; }
    if (m) { st.grp = m[1]; st.sel[m[1]] = m[1] + m[2]; } else st.grp = 'o';
    st.ovk = A.route.param(r, 'ov', '') === 'kind';
    st.dev = null;
    render();
    if (A.narrow()) window.scrollTo(0, 0);
  });
})();
