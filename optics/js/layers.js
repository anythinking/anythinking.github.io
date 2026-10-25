/* 층 페이지: 층별 칩 · 관계 사슬(위/아래) · 오른쪽 상세 패널. 선택한 용어는 #<용어> 로 해시에 남는다. */
(function () {
  'use strict';
  const D = A.data('layers');
  if (!D) return;
  const priv = A.hasPrivate('layers');
  const st = { sel: null, depth: 9, chain: false };

  // 데이터 속 HTML 을 페이지 클래스 체계로 맞춘다
  const ink = s => String(s || '')
    .replace(/<p style="margin:0(?: 0 8px)?">/g, '<p>')
    .replace(/<span style="color:var\(--ink-2\)">/g, '<span class="aside">');

  const LOF = {};
  D.L.forEach(l => l.items.forEach(c => { LOF[c.g] = l.id; }));

  // ── 관계 펼치기(원본 expand 그대로) ──
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

  // ── 층 목록(한 번만 그린다) ──
  const stack = A.$('#stack'), svg = A.$('#wires'), chips = {};
  D.L.forEach(l => {
    const eo = /eo/.test(l.cls), derived = /derived/.test(l.cls);
    const extra = A.h('div.lx-extra');
    if (priv && l.vault) {
      const pm = l.vault.match(/class="pill (\w+)">([^<]*)/) || [];
      extra.append(A.h('span.lx-cov' + (pm[1] ? '.' + pm[1] : ''), {}, pm[2] || ''),
        A.h('span.lx-src', {}, l.vault.replace(/^[\s\S]*?<br>/, '').replace(/<[^>]+>/g, '')));
    }
    const more = A.h('div.lx-more.lx-prose', { html: ink(l.more), hidden: true, id: 'more-' + l.id });
    const tog = A.h('button.lx-tog', { type: 'button', 'aria-expanded': 'false', 'aria-controls': more.id }, '▸ 펼치기');
    tog.onclick = () => {
      more.hidden = !more.hidden;
      tog.textContent = more.hidden ? '▸ 펼치기' : '▾ 접기';
      tog.setAttribute('aria-expanded', String(!more.hidden));
      wires();
    };
    extra.append(tog);
    const row = A.h('div.lx-chips');
    l.items.forEach(c => {
      const b = A.h('button.lx-chip', { type: 'button', dataset: { g: c.g } },
        c.tag ? c.lab.replace(c.tag, '').trim() : c.lab, A.h('span.t', {}, c.tag));
      b.onclick = () => select(st.sel === c.g ? null : c.g);
      chips[c.g] = { el: b, chain: c.chain };
      row.append(b);
    });
    stack.append(A.h('div.lx-layer' + (eo ? '.eo' : '') + (derived ? '.derived' : ''), { id: l.id },
      A.h('div.lx-lhead', {},
        A.h('div.lx-meta', {},
          A.h('div.lx-idrow', {}, A.h('span.lx-id', {}, l.id), A.h('span.lx-nm', {}, l.nm)),
          A.h('span.lx-q', {}, l.q), extra),
        row),
      more));
  });
  stack.append(svg); // 선은 맨 뒤(칩은 z-index 로 위)

  // 오른쪽 패널의 고정 글
  A.$('#chainBox').innerHTML = ink(D.chain);
  A.$('#eoBox').innerHTML = ink(D.eo);

  // ── 선 ──
  function wires() {
    const { dn, up } = rels(), R = stack.getBoundingClientRect(), seen = new Set();
    let h = '';
    for (const e of dn.concat(up)) {
      const k = e.from + '→' + e.to; if (seen.has(k)) continue; seen.add(k);
      const a0 = chips[e.from], b0 = chips[e.to]; if (!a0 || !b0) continue;
      const a = a0.el.getBoundingClientRect(), b = b0.el.getBoundingClientRect();
      const ax = a.left - R.left + a.width / 2, bx = b.left - R.left + b.width / 2, upw = b.top < a.top;
      const y1 = upw ? a.top - R.top : a.bottom - R.top, y2 = upw ? b.bottom - R.top : b.top - R.top, my = (y1 + y2) / 2;
      const op = [0, .9, .6, .38][Math.min(e.hop, 3)];
      h += `<path d="M${ax},${y1} C${ax},${my} ${bx},${my} ${bx},${y2}" style="stroke:var(--${e.dir === 'up' ? 'warm' : 'probe'})" stroke-width="${e.hop === 1 ? 2 : 1.4}" opacity="${op}"/>`;
    }
    if (svg._h !== h) { svg.innerHTML = h; svg._h = h; }
  }

  // ── 그리기 ──
  function render() {
    A.$$('.lx-depths .pill').forEach(b => {
      const on = +b.dataset.depth === st.depth;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
    });
    const cb = A.$('#chainBtn');
    cb.classList.toggle('on', st.chain); cb.setAttribute('aria-pressed', String(st.chain));
    A.$('#chainBox').hidden = !st.chain;

    const { dn, up } = rels(), hopDn = {}, hopUp = {};
    dn.forEach(e => { hopDn[e.to] = Math.min(hopDn[e.to] || 9, e.hop); });
    up.forEach(e => { hopUp[e.to] = Math.min(hopUp[e.to] || 9, e.hop); });
    for (const g in chips) {
      const { el, chain } = chips[g], isSel = st.sel === g, d = hopDn[g], u = hopUp[g];
      const cls = isSel ? 'sel' : d ? 'dn' : u ? 'up' : st.chain && chain ? 'ch' : st.sel ? 'dim' : '';
      el.className = 'lx-chip' + (cls ? ' ' + cls : '') + ((!isSel && (d > 2 || (!d && u > 2))) ? ' far' : '');
      el.setAttribute('aria-pressed', String(isSel));
    }

    A.$('#selBox').hidden = !st.sel;
    A.$('#introBox').hidden = !!st.sel;
    if (st.sel) {
      const sl = D.L.find(l => l.id === LOF[st.sel]);
      A.$('#selLayer').textContent = sl ? `${sl.id} · ${sl.nm}` : '';
      A.$('#selName').textContent = st.sel;
      A.$('#selGloss').innerHTML = ink(D.GLOSS[st.sel] || '풀이가 아직 없다.');
      const grp = (list, dir, sym, first) => {
        const by = {};
        list.forEach(e => { (by[e.hop] = by[e.hop] || []).push(e); });
        return Object.keys(by).map(Number).sort((a, b) => a - b).map(h => {
          const seen = new Set();
          return A.h('div.lx-rg.' + dir, {}, A.h('span', {}, h === 1 ? first : `${sym} ${h}단`),
            A.h('div.lx-rlist', {}, by[h].filter(e => { const k = e.from + e.to; if (seen.has(k)) return false; seen.add(k); return true; })
              .map(e => {
                const b = A.h('button.lx-rel', { type: 'button' },
                  A.h('span.lid', {}, LOF[e.to] || ''),
                  A.h('span.body', {}, A.h('span.to', {}, e.to, h > 1 ? A.h('span.via', {}, '← ' + e.from) : null),
                    A.h('span.why', {}, e.why)));
                b.onclick = () => select(e.to, true);
                return b;
              })));
        });
      };
      A.mount('#relGroups', grp(dn, 'dn', '↓', '↓ 아래에서 — 왜 그게 되나'), grp(up, 'up', '↑', '↑ 위로 — 그래서 무엇이 되나'));
    }
    wires();
  }

  // ── 상태 ↔ 해시 ──
  function select(g, fromPanel) {
    A.route.go('', g || '');
    // 좁은 화면에서는 패널이 본문 아래라, 패널에서 고른 용어의 칩을 보여 준다
    if (fromPanel && g && A.narrow() && chips[g]) chips[g].el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  A.route.on(r => {
    st.sel = r.key === '' && chips[r.arg] ? r.arg : null;
    st.depth = +A.route.param(r, 'depth', 9) || 9;
    st.chain = A.route.param(r, 'chain', '') === '1';
    render();
  });
  A.$$('.lx-depths .pill').forEach(b => { b.onclick = () => A.route.set({ depth: +b.dataset.depth === 9 ? null : b.dataset.depth }); });
  A.$('#chainBtn').onclick = () => A.route.set({ chain: st.chain ? null : '1' });
  A.$('#clearSel').onclick = () => select(null);
  window.addEventListener('resize', wires);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(wires);
})();
