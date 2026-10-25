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
  if (!D) { mount(stage, h('p.empty.cmp-pad', '데이터 로드 실패 — 구조 데이터를 읽지 못했다.')); return; }

  const GROUPS = [['a', 'A', 'A · 행렬곱'], ['b', 'B', 'B · 신경망'], ['c', 'C', 'C · 최적화'], ['d', 'D', 'D · 논리'], ['e', 'E', 'E · 변환 앞'], ['f', 'F', 'F · 양자·신호']];
  const HASH = /^([a-f])(\d+)$/;
  const LAB = { a5: 'feldmann2021' };   // 실험실이 있는 구조 → 그 실험실의 기본 프리셋
  // 「깊게 보기」가 주소에 쓰는 키 — 기본 보기로 돌아갈 때 함께 지운다
  const LABKEYS = ['deep', 'pre', 'm', 'n', 'dc', 'cx', 'mat', 'len', 'lv', 'src', 'p', 'er', 'nep', 'bw', 'view', 'seed'];
  let lab = null, labFor = null, lastR = null;
  const BOM = k => (D.BOM && D.BOM[k]) || [];
  const DEV = id => (D.DEV && D.DEV[id]) || { n: id, d: '' };
  const PRIV = A.hasPrivate('compute');

  const st = { grp: 'o', sel: {}, ovAxis: 'para', ovHov: -1, vals: {}, pane: {}, marks: true, dev: null, devNum: 0, info: false, bomOpen: false };

  // ── 그림 팔레트: 그림판은 다크 모드에서도 밝은 종이라 옛 코드의 색 질의엔 밝은 값을 준다 ──
  const PAL = { beam: '#C9472F', probe: '#2C7A86', warm: '#B7791F', wall: '#8A5A2B', panel: '#FBFAF7', ink: '#1C1B18', muted: '#6B675E', rule: '#D9D4C9', grid: '#ECE8DF', bg: '#F2F0EB' };
  const CS = { getPropertyValue: k => ' ' + (PAL[String(k).replace(/^--/, '')] || '#000') };
  const gcs = () => CS;

  // ── 가로로 나란한 그림을 위·아래로 쌓는다 (넓은 그림이 높이에 눌려 작아지지 않게) ──
  const STACK = {
    'c-f2': { parts: [(x, y) => y < 104 || x < 140, (x, y) => y < 232, () => true], max: 1.7 },
    'd-f5': { parts: [(x, y, c, b) => b.y + b.height <= 56 && !(c.tagName === 'text' && b.x >= 28 && b.x < 44), () => true] },
    'd-f6': { parts: [(x, y, c, b) => b.height < 40 && b.y >= 26 && b.y + b.height <= 80 && (x < 165 || (c.tagName === 'text' && x > 190)), () => true] },
    'e-f2': { rects: [[0, 0, 555, 320], [545, 0, 335, 320]] },
    'e-f3': { rects: [[0, 0, 295, 300], [295, 0, 302, 300], [597, 0, 283, 300]], rows: [[0, 1], [2]] },
    'e-f4': { rects: [[0, 0, 440, 340], [440, 0, 440, 340]] },
    'b-f1': { rects: [[0, 0, 330, 360], [345, 0, 535, 360]] },
    'b-f4': { rects: [[0, 0, 285, 330], [290, 0, 590, 330]] }
  };
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
    const items = [...el.children], n = spec.parts.length, buckets = Array.from({ length: n }, () => []), box = Array(n).fill(null);
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
    el._stk = L; return L;
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
    const ST = D.ST || {};
    const tabNames = {};
    sec.querySelectorAll('[id$="-tabs"] button[data-s]').forEach(b => {
      const n = b.querySelector('.n'); tabNames[b.dataset.s] = txt(b).replace(n ? txt(n) : '', '').trim();
    });
    return [...sec.querySelectorAll('.card.sec')].map((card, idx) => {
      const sNum = String(idx + 1), id = card.id.replace(/^(\w)-s/, '$1');
      const h2 = card.querySelector('h2');
      if (card.classList.contains('close')) {
        return { id, num: '', tab: tabNames[sNum] || '겹쳐 보면', title: txt(h2), text: true, legacy: true, group: g,
          body: [...card.querySelectorAll(':scope > p')].map(p => p.innerHTML), figEl: card.querySelector('svg.f, canvas.f') };
      }
      const num = txt(card.querySelector('.num'));
      const chips = [...card.querySelectorAll('.head .chip')];
      const key = Object.keys(ST).find(k => ST[k][0] === g && String(ST[k][1]) === String(+num)) || '';
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
          label: step ? (i === 0 ? '실험' : String(wi)) : (hd || (i === 0 ? '실험' : String(i + 1))), step: !!step };
      });
      const walkHead = card.querySelector('.walkhead h3');
      return { id, num, tab: tabNames[sNum] || txt(h2), title: txt(h2), legacy: true, group: g, key,
        who: (CP && CP.WHO && CP.WHO[id]) || txt(chips.find(c => !c.classList.contains('wall'))), wall: txt(chips.find(c => c.classList.contains('wall'))),
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
      h('button.cmp-g.cmp-gov' + (st.grp === 'o' ? '.on' : ''), { type: 'button', title: OV ? `구조 ${OV.S.length}개를 축으로 묶어 보기` : '축으로 묶어 보기',
        'aria-pressed': String(st.grp === 'o'), onclick: () => A.route.go('', '') }, '목차'),
      GROUPS.map(([id, l, name]) => {
        const has = !!CMP.groups[id], on = st.grp === id;
        return h('button.cmp-g' + (on ? '.on' : ''), { type: 'button', title: has ? name : name + ' (준비 중)', disabled: !has, 'aria-pressed': String(on),
          onclick: () => go(id) }, l);
      }));
    const axes = $('#cmp-axes');
    axes.hidden = st.grp !== 'o';
    if (st.grp === 'o') {
      mount(axes, h('span.lb', '묶는 축'),
        [['para', '패러다임 — 어느 갈래에 시간을 쓸까'], ['weight', '가중치가 어디에 있나'], ['vol', '끄면 사라지나']]
          .filter(([k]) => k === 'para' ? CP : OV && OV.H[k])
          .map(([k, l]) => A.pill(l, st.ovAxis === k, () => A.route.set({ axis: k === 'para' ? null : k }), { class: 'pill cmp-axis' })));
    }
    const G = st.grp === 'o' ? null : group(st.grp), E = entry();
    mount('#cmp-tabs', G ? G.list.map(e => A.pill([e.num ? h('span.k', e.num) : null, e.tab].filter(Boolean), E && e.id === E.id,
      () => A.route.go('', e.id), { class: 'pill cmp-tab' })) : []);
  }
  // 군을 고르면 그 군에서 마지막으로 본 구조(없으면 첫 구조)로 간다. 옛 장은 그 군을 실제로 열 때 부팅한다
  const go = g => A.route.go('', st.sel[g] || g + '1');

  // ── 목차 ─────────────────────────────────────────────
  const SV = { g: ['살아남았다', 'probe'], m: ['논쟁 중', 'warm'], t: ['태동', 'warm'] };
  const CV = { y: '있음', p: '조각', n: '없음' };
  const VC = { '휘발': 'var(--warm)', '비휘발': 'var(--probe)', '해당없음': 'var(--link)' };
  const code = s => `${s[1].toUpperCase()}-${String(s[2]).padStart(2, '0')}`;
  function renderOverview() {
    if (!OV) { mount(stage, h('p.empty.cmp-pad', '데이터 로드 실패 — 목차 데이터를 읽지 못했다.')); mount(side); return; }
    const para = (CP && CP.PARA) || [];
    if (st.ovAxis === 'para' && !para.length) st.ovAxis = 'weight';
    const P = st.ovAxis === 'para';
    const ax = P ? { ord: para.map((_, i) => i), t: para.map(p => p.t), d: para.map(p => p.d) } : OV.H[st.ovAxis];
    const key = s => st.ovAxis === 'weight' ? s[3] : st.ovAxis === 'vol' ? s[4] : para.findIndex(p => p.ids.includes(s[1] + s[2]));
    const rows = ax.ord.map(k => {
      const items = OV.S.map((s, i) => ({ s, i })).filter(o => key(o.s) === k);
      if (!items.length) return null;
      const pp = P ? para[k] : null, sv = pp && SV[pp.sv], cv = pp && CV[pp.cv];
      return h('div.cmp-ovrow',
        h('div.cmp-ovhead',
          h('div', h('span.cmp-ovt', ax.t[k]), h('span.cmp-ovn' + (st.ovAxis === 'vol' && k === '비휘발' ? '.hl' : ''), items.length + '개')),
          h('span.cmp-ovd', ax.d[k]),
          sv || cv ? h('div.cmp-ovtags',
            sv ? h('span.cmp-sv.' + sv[1], sv[0]) : null,
            cv ? h('span.cmp-cv.' + pp.cv, h('i'), (UI.cv || '') + cv) : null) : null),
        h('div.cmp-ovitems', items.map(({ s, i }) => h('button.cmp-ovit' + (st.ovHov === i ? '.hov' : ''), {
          type: 'button', dataset: { i: String(i) },
          onclick: () => A.route.go('', s[1] + s[2]),
          onmouseenter: () => hover(i), onfocus: () => hover(i) },
          h('span.cmp-ovname', s[0]),
          h('span.cmp-ovsub', h('i', { style: { background: VC[s[4]] || 'var(--faint)' } }),
            `${code(s)} · ${st.ovAxis === 'weight' ? s[4] : s[3]}`)))));
    });
    // 올리기는 미리보기일 뿐 — 목록 밖으로 나가면 요약을 거둔다
    mount(stage, h('div.cmp-ov', { onmouseleave: () => hover(-1) }, rows));
    renderOvSide();
  }
  function hover(i) {
    if (st.ovHov === i) return;
    st.ovHov = i;
    A.$$('.cmp-ovit', stage).forEach(b => b.classList.toggle('hov', +b.dataset.i === i));
    renderOvSide();
  }
  function renderOvSide() {
    const s = OV.S[st.ovHov], n = OV.S.length;
    mount(side,
      h('div.det.cmp-ovbox', s ? [
        h('span.cmp-meta', `${code(s)} · 가중치는 ${s[3]} · ${s[4]}`),
        h('h3', s[0]), h('p', s[5]), h('p.cmp-who', s[6]), h('p.cmp-wallbox', '벽 — ' + s[7])
      ] : [
        h('span.cmp-meta', `목차 · 구조 ${n}`),
        h('h3', `같은 ${n}개를 가로로 자른다`),
        h('p.sub', 'A~F가 무엇을 푸는지로 묶은 것이라면, 여기서는 가중치가 어디 있는지와 끄면 남는지로 다시 묶는다. 블록에 올리면 요약, 누르면 그 구조가 열린다.')
      ]),
      h('div.cmp-ovprose',
        h('p', h('b', '가중치를 어디에 두느냐가 설계를 가른다.'), ' 위상에 두면 임의 행렬이 되지만 소자가 N²로 늘고 히터를 계속 켜둬야 한다. 파장에 두면 합산이 공짜가 되지만 온도에 묶인다. 공간에 두면 전파가 연산을 대신 해주지만 바꾸려면 다시 찍어야 한다. 재료의 상태에 두면 꺼도 남지만 쓰기가 느리다.'),
        h('p', h('b', '그래서 「끄면 사라지나」가 따로 있는 축이다.'), ` ${n}개 중 전원을 끊어도 값이 남는 건 여섯 개뿐이고, 그중 넷은 바꾸려면 다시 찍어야 하는 쪽이다. 쓰기가 되는 비휘발은 사실상 PCM 계열 둘이다. 리뷰들이 다음 승부처로 가중치 저장·업데이트를 꼽는 이유가 이 숫자에 있다.`),
        h('p', h('b', '그리고 절반은 연산이 아니라 읽기에서 갈린다.'), ' 검출기는 세기만 읽으니 부호가 사라지고, 되찾으려면 기준 빛을 같이 때려야 한다. 아무리 좋은 행렬곱도 읽는 방식이 음수를 버리면 쓸 수 없다.')));
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
    const items = BOM(E.key), mk = E.mk || {};
    const remap = p => { if (!FS || !FS.L) return p; const q = mapPoint(FS.L, p[0] * FS.ow / 100, p[1] * FS.oh / 100); return [q[0] / FS.w * 100, q[1] / FS.h * 100]; };
    let n = 0; const list = [];
    items.forEach(it => {
      const fix = mk[it.id] || {}, p0 = fix.p || it.p;
      if (!p0) return; const num = ++n;
      if (figId !== undefined && (it.pf ? it.pf.slice(1) !== figId : figId !== '__main__')) return;
      const pts = [p0, fix.p2 || (fix.p ? null : it.p2)].filter(Boolean).map(remap);
      list.push({ id: it.id, pts, num, lab: it.lab || DEV(it.id).n, name: DEV(it.id).n });
    });
    const R = wrap.getBoundingClientRect(), px = R.width || 800, ph = R.height || px * 0.5;
    const svg = wrap.querySelector(':scope > svg');
    const obs = svg && R.width ? [...svg.querySelectorAll('text')].map(t => { const b = t.getBoundingClientRect(); return b.width ? [(b.left - R.left) / R.width * 100, (b.top - R.top) / R.height * 100, (b.right - R.left) / R.width * 100, (b.bottom - R.top) / R.height * 100] : null; }).filter(Boolean) : [];
    const rx = 13 / px * 100, ry = 13 / ph * 100, placed = [];
    const hit = (x, y) => obs.some(r => x + rx > r[0] && x - rx < r[2] && y + ry > r[1] && y - ry < r[3]) || placed.some(([a, b]) => Math.abs(a - x) < rx * 1.9 && Math.abs(b - y) < ry * 1.9);
    const D8 = [[0, 0], [0, -1], [0, 1], [1, 0], [-1, 0], [1, -1], [-1, -1], [1, 1], [-1, 1]];
    list.forEach(m => {
      m.anchors = m.pts.map(([x0, y0]) => {
        let best = [x0, y0];
        outer: for (const k of [0, 1.6, 2.6, 3.8, 5.2]) for (const [dx, dy] of D8) { if (!k && (dx || dy)) continue; const x = x0 + dx * k * rx, y = y0 + dy * k * ry; if (!hit(x, y)) { best = [x, y]; break outer; } }
        placed.push(best);
        return best;
      });
    });
    return list;
  }
  function legend(E, onIds, paneLabel) {
    let n = 0; const mk = E.mk || {};
    return BOM(E.key).filter(it => it.p || (mk[it.id] || {}).p).map(it => {
      const num = ++n, here = onIds.has(it.id), d = DEV(it.id);
      const pane = it.pf && E.panes ? E.panes.find(p => p.fig && '#' + p.fig.id === it.pf) : null;
      return { id: it.id, num, lab: it.lab || d.n, hint: d.n, where: here ? '' : (pane ? paneLabel(pane) : ''), here };
    });
  }
  function openDev(id, num) { st.dev = id; st.devNum = num; paintMarks(); renderDev(); }

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

  function figSize(el) {
    const spec = STACK[el.id];
    if (spec && spec.rects) { const L = canvasLayout(spec); return { w: L.W, h: L.H, L, ow: el.width, oh: el.height }; }
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
    if (st.grp === 'o') { renderOverview(); return; }
    const E = entry();
    if (!E) {
      mount(stage, h('p.empty.cmp-pad', '데이터 로드 실패 — 이 군의 구조 모듈을 읽지 못했다.'));
      mount(side); return;
    }
    document.title = (E.title ? E.title + ' · ' : '') + '구조 — 광 연산 지도와 실험실';
    if (st.deep && LAB[E.id] && window.PCMLab) { renderLab(E); return; }
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
    lab = window.PCMLab.mount(main, sd, {
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
    if (lab) { lab.update(lastR || A.route.get()); document.title = E.title + ' · 깊게 보기 — 광 연산 지도와 실험실'; }
  }

  function renderText(E) {
    const G = group(st.grp), figHost = h('div.cmp-figwrap.cmp-textfig');
    mount(stage, h('div.cmp-text',
      h('h2', E.title),
      E.legacy ? figHost : null,
      h('div.cmp-body', (E.body || []).map(p => html('p', p)))));
    if (E.figEl) take(E.figEl, figHost); else figHost.remove();
    mount(side, h('p.note', `${G.name}의 구조를 한자리에 겹쳐 본 요약이다. 위 탭에서 구조를 고르면 그림과 손잡이로 돌아간다.`));
  }

  function renderFig(E) {
    const G = group(st.grp), legacy = !!E.legacy;
    const p = legacy ? paneOf(E) : null, pi = legacy ? E.panes.indexOf(p) : 0;
    const wrap = h('div.cmp-figwrap'), marks = h('div.cmp-marks'), leg = h('div.cmp-legend');
    const label = h('span.cmp-figlabel');
    const markBtn = h('button.cmp-opt.cmp-markbtn', { type: 'button', onclick: () => { st.marks = !st.marks; paintMarks(); } }, '자리 표시');
    const box = h('div.cmp-figbox', label, markBtn, wrap, leg);
    mount(stage, box);
    cur = { E, wrap, marks, leg, label, markBtn };

    let fig, FS, figId;
    if (legacy) {
      fig = p.fig;
      const spec = fig && STACK[fig.id];
      if (fig && fig.tagName.toLowerCase() === 'canvas' && spec && spec.rects) {
        if (!fig._proxy) fig._proxy = h('canvas', { 'aria-label': fig.getAttribute('aria-label') || E.title, role: 'img' });
        wrap.appendChild(fig._proxy);
        blit(fig, fig._proxy, spec);
        blitJob = { src: fig, dst: fig._proxy, spec };
        if (io) io.observe(fig._proxy); else { seen = true; loop(); }
      } else if (fig) {
        take(fig, wrap);
        if (spec && spec.parts) stackSvg(fig, spec);
      }
      FS = fig ? figSize(fig) : { w: 880, h: 300, L: null };
      const own = BOM(E.key).some(i => i.pf && fig && i.pf.slice(1) === fig.id);
      figId = fig ? (pi === 0 && !E.panes[0].step && !own ? '__main__' : fig.id) : '__main__';
      label.textContent = `FIG ${st.grp.toUpperCase()}·${E.num}` + (p.step ? ` — ${p.label}단계` : '') + ` — ${fig ? (fig.getAttribute('aria-label') || E.title) : E.title}`;
      cur.paneLabel = q => q.step ? q.label + '단계' : q.label;
      // 옛 코드가 그림을 다시 그리면 쌓기·마커를 다시 맞춘다
      if (fig && fig.tagName.toLowerCase() === 'svg') {
        let pend = 0;
        const mo = new MutationObserver(() => {
          if (pend) return;
          pend = requestAnimationFrame(() => {
            pend = 0;
            if (!cur || cur.mo !== mo) return;
            mo.disconnect();
            if (spec && spec.parts) stackSvg(fig, spec);
            cur.FS = figSize(fig);
            mo.observe(fig, { childList: true, subtree: true, characterData: true });
            paintMarks();
          });
        });
        mo.observe(fig, { childList: true, subtree: true, characterData: true });
        cur.mo = mo;
      }
    } else {
      const SL = E.stack ? canvasLayout(E.stack) : null;
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
    const items = BOM(E.key);
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
      h('button.cmp-ttl', { type: 'button', 'aria-expanded': String(st.info), onclick: () => { st.info = !st.info; ideaBox.hidden = !st.info; tl.textContent = st.info ? '접기 ▴' : '설명 ▾'; head.firstChild.setAttribute('aria-expanded', String(st.info)); } },
        h('span.cmp-num', E.num), h('span.cmp-title', E.title), h('span.cmp-tl', st.info ? '접기 ▴' : '설명 ▾')));
    const ideaBox = h('div.cmp-ideabox', idea), tl = head.querySelector('.cmp-tl');
    ideaBox.hidden = !st.info;
    head.appendChild(ideaBox);

    let panes = null, intro = null;
    if (legacy && E.panes.length > 1) {
      const wt = (E.walkTitle && p.step) || (!/^[①-⑳]/.test(p.label) && E.walkTitle) ? E.walkTitle : (/^[①-⑳]/.test(p.label) ? p.label : (E.walkTitle || '단계'));
      panes = h('div.cmp-panes', h('span.lb', wt), h('div.wrap', E.panes.map((q, i) => opt(
        /^[①-⑳]/.test(q.label) ? q.label.slice(0, 1) : (q.label.length > 8 ? String(i + 1) : q.label), i === pi,
        () => { if (q.wbtn) q.wbtn.click(); st.pane[E.id] = i; render(); }, { title: q.label }))));
    }
    if (legacy && p.intro) intro = html('p.cmp-intro', p.intro);

    const ctl = h('div.cmp-ctl'), stats = h('div.cmp-stats'), read = h('div.cmp-read');
    const foot = h('div.cmp-foot',
      h('div', h('span.lb', '어디서'), h('span', (CP && CP.WHO && CP.WHO[E.id]) || E.who)),
      h('div', h('span.lb', '벽'), h('span.cmp-wall', E.wall)),
      A.papers(E.id, LAB[E.id] ? pid => '#' + E.id + '?deep=1' + (pid === LAB[E.id] ? '' : '&pre=' + pid) : null),
      h('div.cmp-note'));
    const deep = LAB[E.id] ? h('button.cmp-deep', { type: 'button', onclick: () => A.route.set({ deep: '1' }) },
      h('b', '깊게 보기 →'), h('span', '논문 프리셋으로 재료·광원·검출기를 바꿔 돌려 본다 · 3D')) : null;
    mount(side, h('div.cmp-main-side', head, deep, panes, intro, ctl, stats, read, h('div#cmp-dev'), h('div#cmp-bom')), foot);
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
    renderBom();
  }

  function renderDev() {
    const box = $('#cmp-dev'); if (!box) return;
    if (!st.dev) {
      mount(box, h('p.note#cmp-devhint', { hidden: !(cur && (cur.E.legacy ? cur.legendCount : cur.hasMarks)) }, '그림의 번호를 누르면 그 소자 설명이 여기에 뜬다.'));
      return;
    }
    const d = DEV(st.dev);
    mount(box, h('div.cmp-devbox',
      h('div.cmp-devhead', h('span.cmp-devn', String(st.devNum || '·')), h('span.cmp-devt', d.n),
        h('button.cmp-x', { type: 'button', 'aria-label': '닫기', onclick: () => { st.dev = null; paintMarks(); renderDev(); } }, '×')),
      h('div.cmp-devd', d.d || '')));
  }

  function renderBom() {
    const box = $('#cmp-bom'); if (!box || !cur) return;
    const E = cur.E, key = E.key, items = BOM(key), miss = ((X.MISS || {})[key]) || [];
    const lines = Array.isArray(miss) ? miss : [miss];
    if (!items.length && !lines.length) { mount(box); return; }
    const must = items.filter(i => i.k).length;
    let n = 0;
    const rows = items.map(it => {
      const dv = DEV(it.id), how = ((X.HOW || {})[it.id]) || dv.how || [];
      const num = it.p ? String(++n) : '·';
      return h('div.cmp-bomrow',
        h('span.cmp-bomn' + (it.p ? '.p' : ''), num),
        h('div',
          h('div.cmp-bomtop',
            h('button.cmp-bomnm', { type: 'button', onclick: () => openDev(it.id, it.p ? +num : 0) }, dv.n),
            h('span.cmp-bomk' + (it.k ? '.must' : ''), it.k ? '필수' : '선택'),
            it.n ? h('span.cmp-bomq', it.n) : null),
          h('p.cmp-bomr', it.r || ''),
          h('p.cmp-bomd', dv.d || ''),
          how.length ? h('p.cmp-bomh', '만드는 법 · ' + how.join(' · ')) : null,
          it.w ? h('p.cmp-bomw', '↳ ' + it.w) : null));
    });
    mount(box, h('div.cmp-bom',
      h('button.cmp-bomtg', { type: 'button', 'aria-expanded': String(st.bomOpen), onclick: () => { st.bomOpen = !st.bomOpen; renderBom(); } },
        '부품표 — 소자 ' + items.length + '종 · 필수 ' + must + '종 ' + (st.bomOpen ? '▴' : '▾')),
      st.bomOpen ? h('div.cmp-bombody',
        lines.length ? h('div.cmp-miss', h('span', '무엇이 없나 — 이 구조의 벽'),
          lines.map(t => h('p', String(t).replace(/<b>(.*?)<\/b>\s*/g, '$1 — ').replace(/<[^>]+>/g, '')))) : null,
        rows) : null));
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
      if (E.stack) {
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && st.dev) { st.dev = null; paintMarks(); renderDev(); } });
  let rs = 0;
  window.addEventListener('resize', () => {
    if (rs) return;
    rs = requestAnimationFrame(() => { rs = 0; sizeFig(); requestAnimationFrame(paintMarks); });
  });

  A.route.on(r => {
    lastR = r;
    const m = HASH.exec(r.raw);
    st.deep = A.route.param(r, 'deep', '') === '1';
    // 실험실이 없는 구조로 옮기면 깊게 보기 키를 걷어 낸다(다시 돌아왔을 때 저절로 열리지 않게)
    if (LABKEYS.some(k => r.params[k] != null) && !(st.deep && m && LAB[m[1] + m[2]])) { A.route.set(Object.fromEntries(LABKEYS.map(k => [k, null])), { replace: true }); return; }
    if (lab && st.deep && m && labFor === m[1] + m[2]) { lab.update(r); return; }
    if (m) { st.grp = m[1]; st.sel[m[1]] = m[1] + m[2]; } else st.grp = 'o';
    const ax = A.route.param(r, 'axis', 'para');
    if (ax !== st.ovAxis) { st.ovAxis = ax; st.ovHov = -1; }
    st.dev = null;
    render();
    if (A.narrow()) window.scrollTo(0, 0);
  });
})();
