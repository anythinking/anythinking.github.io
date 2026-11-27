/* 층 페이지: 공통 골격 격자(빛 만들기·싣기·계산·비선형·읽기·잇기 × L3~L0) + 위층(L4~L6) + 장치 경로 + 관계 사슬.
   주소: #<용어> = 용어 선택, ?dev=<장치> = 장치 경로, ?depth= · ?chain=1 = 보기 상태 */
(function () {
  'use strict';
  const D = A.data('layers');
  const GLOSS = Object.fromEntries((A.data('glossary') || []).map(o => [o.t, o.d]));
  if (!D || !D.SK) return;
  const SK = D.SK;
  const priv = A.hasPrivate('layers');
  const st = { sel: null, dev: null, depth: 9, chain: false, station: 'prep' };

  const ink = s => String(s || '')
    .replace(/<p style="margin:0(?: 0 8px)?">/g, '<p>')
    .replace(/<span style="color:var\(--ink-2\)">/g, '<span class="aside">');

  const LOF = {}, LAY = {};
  D.L.forEach(l => { LAY[l.id] = l; l.items.forEach(c => { LOF[c.g] = l.id; }); });

  function expand(term, dir) {
    const out = [], seen = new Set([term]);
    let front = [term];
    for (let h = 1; h <= st.depth && front.length; h++) {
      const next = [];
      for (const n of front) for (const r of D.REL) {
        const m = dir === 'dn' ? (r[1] === n ? r[0] : null) : (r[0] === n ? r[1] : null);
        if (m === null) continue;
        out.push({ hop: h, from: n, to: m, why: r[2], dir });
        if (!seen.has(m)) { seen.add(m); next.push(m); }
      }
      front = next;
    }
    return out;
  }
  const rels = () => st.sel ? { dn: expand(st.sel, 'dn'), up: expand(st.sel, 'up') } : { dn: [], up: [] };

  // 같은 용어가 여러 칸에 나오므로 용어 → 칩 목록
  const chips = {};
  function chip(g) {
    const it = (LAY[LOF[g]] || { items: [] }).items.find(c => c.g === g) || { lab: g };
    const b = A.h('button.lx-chip', { type: 'button', dataset: { g } }, it.tag ? it.lab.replace(it.tag, '').trim() : it.lab, it.tag ? A.h('span.t', {}, it.tag) : null);
    b.onclick = () => select(st.sel === g ? null : g);
    (chips[g] = chips[g] || []).push(b);
    return b;
  }
  const lc = id => /^L\d$/.test(id) ? '--lc:var(--l' + id[1] + ')' : null;
  const SLOT = Object.fromEntries(SK.slots.map(s => [s.id, s]));

  // ── 위층: L6 · L5 · L4 (골격을 엮은 것) ──
  const upper = A.$('#upper');
  ['L6', 'L5', 'L4'].forEach(id => {
    const l = LAY[id];
    upper.append(A.h('div.sk-urow', { style: lc(id), dataset: { l: id } },
      A.h('div.sk-ulab', {}, A.h('span.sk-lid', {}, id), A.h('span.sk-lnm', {}, l.nm), A.h('span.sk-lq', {}, l.t || '')),
      A.h('div.sk-chips', {}, l.items.map(c => chip(c.g)))));
  });

  // ── 골격 격자: 머리 띠(빛의 길) + L3~L0 행 ──
  const grid = A.$('#grid');
  grid.append(A.h('div.sk-corner', {}, A.t('골격', 'Skeleton')));
  SK.slots.forEach(s => grid.append(A.h('div.sk-head' + (s.aux ? '.aux' : ''), { dataset: { s: s.id } },
    s.eo ? A.h('span.sk-eo', { title: s.eo }, '◆') : null,
    A.h('b', {}, s.nm), A.h('span.sk-job', {}, s.job),
    A.h('span.sk-state', { id: 'state-' + s.id }))));
  ['L3', 'L2', 'L1', 'L0'].forEach(id => {
    const l = LAY[id];
    grid.append(A.h('div.sk-rlab', { style: lc(id) }, A.h('span.sk-lid', {}, id), A.h('span.sk-lnm', {}, l.nm)));
    SK.slots.forEach(s => grid.append(A.h('div.sk-cell' + (s.aux ? '.aux' : ''), { style: lc(id), dataset: { s: s.id, l: id } },
      ((SK.grid[s.id] || {})[id] || []).map(chip))));
  });

  // ── 칸 고르기: 좁은 화면에서는 칸 하나씩 본다 ──
  const stations = A.$('#stations');
  SK.slots.forEach(s => {
    const b = A.h('button.sk-st' + (s.aux ? '.aux' : ''), { type: 'button', role: 'tab', dataset: { s: s.id } }, s.eo ? A.h('span.sk-eo2', {}, '◆') : null, s.nm);
    b.onclick = () => { st.station = s.id; render(); };
    stations.append(b);
  });

  // ── 왜 광인가(비교 행) ──
  const cmp = D.L.find(l => l.id === '비교');
  if (cmp) A.$('#compare').append(A.h('div.sk-chips', {}, cmp.items.map(c => chip(c.g))));

  // ── 장치 고르기 ──
  const devs = A.$('#devs');
  const devBtn = (id, label) => {
    const b = A.h('button.pill', { type: 'button', dataset: { d: id || '' } }, label);
    b.onclick = () => A.route.set({ dev: st.dev === id ? null : id });
    devs.append(b);
  };
  devBtn(null, A.t('전체 키워드', 'All keywords'));
  Object.keys(SK.dev).forEach(id => devBtn(id, SK.dev[id].t));

  A.$('#chainBox').innerHTML = ink(D.chain);
  A.$('#eoBox').innerHTML = ink(D.eo);

  // ── 관계 선 ──
  const stage = A.$('#skStage'), svg = A.$('#wires');
  function wires() {
    const { dn, up } = rels(), R = stage.getBoundingClientRect(), seen = new Set();
    let h = '';
    const first = g => (chips[g] || [])[0];
    for (const e of dn.concat(up)) {
      const k = e.from + '→' + e.to; if (seen.has(k)) continue; seen.add(k);
      const a0 = first(e.from), b0 = first(e.to); if (!a0 || !b0) continue;
      const a = a0.getBoundingClientRect(), b = b0.getBoundingClientRect();
      if (!a.width || !b.width) continue;
      const ax = a.left - R.left + a.width / 2, bx = b.left - R.left + b.width / 2, upw = b.top < a.top;
      const y1 = upw ? a.top - R.top : a.bottom - R.top, y2 = upw ? b.bottom - R.top : b.top - R.top, my = (y1 + y2) / 2;
      const op = [0, .85, .5, .3][Math.min(e.hop, 3)];
      h += `<path d="M${ax},${y1} C${ax},${my} ${bx},${my} ${bx},${y2}" style="stroke:var(--${e.dir === 'up' ? 'warm' : 'probe'})" stroke-width="${e.hop === 1 ? 2 : 1.3}" opacity="${op}"/>`;
    }
    svg.setAttribute('width', stage.scrollWidth); svg.setAttribute('height', stage.scrollHeight);
    if (svg._h !== h) { svg.innerHTML = h; svg._h = h; }
  }

  // ── 그리기 ──
  function render() {
    A.$$('.lx-depths .pill').forEach(b => { const on = +b.dataset.depth === st.depth; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    const cb = A.$('#chainBtn'); cb.classList.toggle('on', st.chain); cb.setAttribute('aria-pressed', String(st.chain));
    A.$('#chainBox').hidden = !st.chain;
    A.$$('#devs .pill').forEach(b => { const on = (b.dataset.d || null) === st.dev; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });

    // 장치 경로
    const dv = st.dev && SK.dev[st.dev];
    const onPath = new Set();
    document.body.classList.toggle('sk-dev', !!dv);
    A.$$('.sk-cell .sk-q').forEach(e => e.remove());
    SK.slots.forEach(s => {
      const box = A.$('#state-' + s.id);
      const p = dv && dv.p[s.id];
      box.className = 'sk-state' + (p ? ' ' + p[0] : '');
      box.textContent = p ? (p[1] || '') : '';
      A.$$(`.sk-head[data-s="${s.id}"], .sk-cell[data-s="${s.id}"]`).forEach(e => e.classList.toggle('sk-off', !!p && p[0] !== 'ok' && !Object.keys(p[2] || {}).length));
      if (p) Object.entries(p[2] || {}).forEach(([L, g]) => {
        if (g === '?') { const c = A.$(`.sk-cell[data-s="${s.id}"][data-l="${L}"]`); if (c) c.append(A.h('span.sk-q', {}, A.t('미확인', 'unverified'))); return; }
        onPath.add(s.id + '|' + L + '|' + g);
      });
    });
    if (dv) (dv.up || []).forEach(([, g]) => onPath.add('up|' + g));
    grid.dataset.station = st.station;
    A.$$('#stations .sk-st').forEach(b => {
      const on = b.dataset.s === st.station, p = dv && dv.p[b.dataset.s];
      b.setAttribute('aria-selected', String(on)); b.classList.toggle('on', on);
      b.classList.toggle('sk-used', !!p && p[0] === 'ok'); b.classList.toggle('sk-unused', !!p && p[0] !== 'ok');
    });
    const dc = A.$('#devCard');
    dc.hidden = !dv;
    if (dv) {
      A.$('#devSay').textContent = dv.say;
      A.mount('#devWhy', dv.why.map(([a, b]) => A.h('li', {}, A.h('span.k', {}, a), A.h('span', { html: b }))));
    }

    // 칩 상태: 용어 선택(관계) > 장치 경로 > 기본
    const { dn, up } = rels(), hopDn = {}, hopUp = {};
    dn.forEach(e => { hopDn[e.to] = Math.min(hopDn[e.to] || 9, e.hop); });
    up.forEach(e => { hopUp[e.to] = Math.min(hopUp[e.to] || 9, e.hop); });
    const CH = new Set(SK.chain || []);
    for (const g in chips) chips[g].forEach(el => {
      const cell = el.closest('.sk-cell'), inUp = el.closest('#upper');
      const path = dv && (cell ? onPath.has(cell.dataset.s + '|' + cell.dataset.l + '|' + g) : inUp ? onPath.has('up|' + g) : false);
      const isSel = st.sel === g, d = hopDn[g], u = hopUp[g];
      let cls = isSel ? 'sel' : d ? 'dn' : u ? 'up' : st.chain && CH.has(g) ? 'ch' : '';
      if (!cls && path) cls = 'path';
      if (!cls && (st.sel || dv)) cls = 'dim';
      el.className = 'lx-chip' + (cls ? ' ' + cls : '') + (path && cls !== 'path' ? ' onpath' : '') + ((chips[g].length > 1) ? ' multi' : '');
      el.setAttribute('aria-pressed', String(isSel));
    });

    A.$('#selBox').hidden = !st.sel;
    A.$('#introBox').hidden = !!st.sel;
    if (st.sel) {
      const sl = LAY[LOF[st.sel]];
      A.$('#selLayer').textContent = sl ? `${sl.id} · ${sl.nm}` : '';
      A.$('#selName').textContent = st.sel;
      const where = SK.slots.filter(s => Object.values(SK.grid[s.id] || {}).some(a => a.includes(st.sel))).map(s => s.nm);
      A.$('#selWhere').textContent = where.length ? A.t('골격 칸: ', 'Skeleton: ') + where.join(' · ') : '';
      A.$('#selGloss').innerHTML = ink(GLOSS[st.sel] || A.t('풀이가 아직 없다.', 'No explanation yet.'));
      const grp = (list, dir, sym, firstLab) => {
        const by = {};
        list.forEach(e => { (by[e.hop] = by[e.hop] || []).push(e); });
        return Object.keys(by).map(Number).sort((a, b) => a - b).map(h => {
          const seen = new Set();
          return A.h('div.lx-rg.' + dir, {}, A.h('span', {}, h === 1 ? firstLab : A.t(`${sym} ${h}단`, `${sym} ${h} steps`)),
            A.h('div.lx-rlist', {}, by[h].filter(e => { const k = e.from + e.to; if (seen.has(k)) return false; seen.add(k); return true; })
              .map(e => {
                const b = A.h('button.lx-rel', { type: 'button' }, A.h('span.lid', {}, LOF[e.to] || ''),
                  A.h('span.body', {}, A.h('span.to', {}, e.to, h > 1 ? A.h('span.via', {}, '← ' + e.from) : null), A.h('span.why', {}, e.why)));
                b.onclick = () => select(e.to, true);
                return b;
              })));
        });
      };
      A.mount('#relGroups', grp(dn, 'dn', '↓', A.t('↓ 아래에서 — 왜 그게 되나', '↓ From below — why it works')), grp(up, 'up', '↑', A.t('↑ 위로 — 그래서 무엇이 되나', '↑ Upward — what it becomes')));
    }
    requestAnimationFrame(wires);
  }

  function select(g, fromPanel) {
    // 좁은 화면: 고른 키워드가 있는 칸으로 옮겨 둔다(바닥 시트 뒤에서도 보이게)
    if (g && A.narrow()) { const c = (chips[g] || []).map(e => e.closest('.sk-cell')).find(Boolean); if (c) st.station = c.dataset.s; }
    A.route.go('', g || '');
    if (fromPanel && g && A.narrow() && chips[g]) chips[g][0].scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  A.route.on(r => {
    st.sel = r.key === '' && chips[r.arg] ? r.arg : null;
    st.depth = +A.route.param(r, 'depth', 9) || 9;
    st.chain = A.route.param(r, 'chain', '') === '1';
    const d = A.route.param(r, 'dev', '');
    st.dev = SK.dev[d] ? d : null;
    render();
  });
  A.$$('.lx-depths .pill').forEach(b => { b.onclick = () => A.route.set({ depth: +b.dataset.depth === 9 ? null : b.dataset.depth }); });
  A.$('#chainBtn').onclick = () => A.route.set({ chain: st.chain ? null : '1' });
  A.$('#clearSel').onclick = () => select(null);
  A.$('#gridWrap').addEventListener('scroll', () => requestAnimationFrame(wires), { passive: true });
  window.addEventListener('resize', wires);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(wires);
  if (priv) document.body.classList.add('sk-priv');
})();
