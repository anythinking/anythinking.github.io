/* 용어 페이지: 검색 · 접힌 줄 제목(층의 말 · 갈래의 말) · 고른 말의 풀이. 선택은 #<용어> 로 남는다 */
(function () {
  'use strict';
  const X = A.data('glossary'), OV = A.data('overview'), IR = A.data('inst-refs') || {};
  if (!X) return;
  const { h, mount, $ } = A;
  // 구조 이름은 구조 표에서 — 용어엔 sid 만 있다
  const SNAME = Object.fromEntries(((OV && OV.S) || []).map(s => [s.id, s.short]));
  const GL = (OV && OV.G) || {};
  // 분류 키: 층이 있으면 층, 없으면 첫 군(G:X). 층과 군은 데이터에서 따로 산다(layer · gs)
  X.forEach(o => { o.l = o.layer || 'G:' + (o.gs[0] || '?'); });

  const LN = { L0: '빛 자체', L1: '물리 효과', L2: '재료·플랫폼', L3: '소자', L4: '회로', L5: '아키텍처', L6: '시스템·산업', '비교': '층 밖 — 전자와 비교' };
  Object.keys(GL).forEach(g => { LN['G:' + g.toUpperCase()] = GL[g]; });
  const LQ = { L0: '무엇을 조절하고 무엇을 잴 수 있나', L1: '무엇을 걸면 빛이 어떻게 변하나', L2: '어떤 재료가 어떤 손잡이를 갖나', L3: '효과와 형상으로 무엇을 만드나', L4: '소자를 엮어 무슨 함수를 만드나', L5: '그 회로로 어떤 계산기를 짓나', L6: '누가 사고 어디서 돈이 나나', '비교': '광이 전자보다 나은 점 — L0 사실의 결과' };
  if (A.lang === 'en') {
    Object.assign(LN, { L0: 'Light itself', L1: 'Physical effects', L2: 'Materials · platforms', L3: 'Devices', L4: 'Circuits', L5: 'Architecture', L6: 'Systems · industry', '비교': 'Outside the layers — compared with electronics' });
    Object.assign(LQ, { L0: 'What can be tuned and what can be measured', L1: 'What you apply and how light changes', L2: 'Which material has which knob', L3: 'What effects and shapes can build', L4: 'What function devices make when combined', L5: 'What computer that circuit builds', L6: 'Who buys, and where the money comes from', '비교': 'Where light beats electronics — consequences of L0 facts' });
  }
  const LAYERS = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', '비교'];
  const GROUPS = Object.keys(GL).map(g => 'G:' + g.toUpperCase());
  const isG = l => l.startsWith('G:');
  const key = l => isG(l) ? l.slice(2) + A.t('군', '') : l;
  const plain = s => String(s || '').replace(/<[^>]+>/g, '').toLowerCase();
  const byT = new Map(X.map(o => [o.t, o]));

  const st = { q: '', sel: null };
  const open = new Set();   // 펼친 줄 — 주소엔 안 남긴다
  const qEl = $('#gl-q');

  function hits(q) {
    const n = (q == null ? st.q : q).trim().toLowerCase();
    return X.filter(o => !n || o.t.toLowerCase().includes(n) || A.tx(o.t).toLowerCase().includes(n) || plain(o.d).includes(n));
  }

  function row(L, hit, searching) {
    const g = hit.filter(o => o.l === L).sort((a, b) => a.t.localeCompare(b.t, 'ko'));
    const total = X.filter(o => o.l === L).length;
    if (!total || (searching && !g.length)) return null;
    const on = searching ? g.length > 0 : open.has(L);
    const code = h('span.gl-k' + (isG(L) ? '.g' : ''), /^L\d$/.test(L) ? { style: { color: 'var(--l' + L[1] + ')' } } : null, key(L));
    return h('section.gl-row' + (on ? '.open' : ''),
      h('button.gl-gh', { type: 'button', 'aria-expanded': String(on), onclick: () => { if (open.has(L)) open.delete(L); else open.add(L); renderList(); } },
        code, h('span.gl-t', LN[L]), h('span.gl-n', searching ? `${g.length} / ${total}` : String(total)),
        h('span.gl-q', LQ[L] || A.t('그 구조를 설명할 때 쓰는 말', 'Words used to explain that structure')), h('span.gl-tg', '▾')),
      on ? h('div.wrap.gl-body', g.map(o => {
        const gb = !isG(L) && o.gs.length ? o.gs.join('·') : '';
        const sel = st.sel === o.t;
        return h('a.chip' + (sel ? '.on' : ''), { href: A.route.href('', o.t), dataset: { t: o.t }, 'aria-current': sel ? 'true' : null,
          onclick: e => { e.preventDefault(); pick(o.t); } }, o.t, gb ? h('span.n', gb) : null);
      })) : null);
  }

  function renderList() {
    const searching = !!st.q.trim(), hit = hits();
    $('#gl-cnt').textContent = searching ? `${hit.length} / ${X.length}` + A.t('개', '') : `${X.length}` + A.t('개', ' terms');
    const a = LAYERS.map(L => row(L, hit, searching)).filter(Boolean), b = GROUPS.map(L => row(L, hit, searching)).filter(Boolean);
    mount('#gl-list',
      a.length ? [h('h2.gl-sec', A.t('층의 말', 'Words of the layers')), a] : null,
      b.length ? [h('h2.gl-sec', A.t('갈래의 말', 'Words of the families')), b] : null,
      a.length || b.length ? null : h('p.empty', A.t('찾는 말이 없다. 다른 낱말로 해보자.', 'No match. Try another word.')));
  }

  function renderPanel() {
    const o = st.sel && byT.get(st.sel), panel = $('#gl-panel');
    document.title = (o ? A.tx(o.t) + ' · ' : '') + A.t('용어', 'Glossary') + ' — ' + A.site;
    panel.hidden = !o;   // 풀이 칸은 말을 골랐을 때만
    if (!o) { mount(panel); return; }
    const where = (isG(o.l) ? o.l.slice(2) + A.t('군 · ', ' · ') + LN[o.l] : o.l + ' · ' + LN[o.l]) +
      (o.gs.length && !isG(o.l) ? A.t(' · ' + o.gs.join('·') + '군에서도 쓴다', ' · also used in family ' + o.gs.join('·')) : '');
    const hasRel = o.w && /^L|비교/.test(o.l);
    mount(panel, h('div.gl-sel',
      h('div.gl-top', h('span.gl-where', where), h('button.gl-close', { type: 'button', onclick: () => A.route.go('', '') }, A.t('닫기 ✕', 'Close ✕'))),
      h('h2', o.t),
      h('p.gl-def', { html: o.d }),
      o.im ? h('div.gl-fig', { html: o.im }) : null,
      o.x ? h('div.gl-box', h('span.lb', o.gs.length ? o.gs.join('·') + A.t('군에서는', ' family') : A.t('덧붙임', 'Note')), h('p.gl-x', { html: o.x })) : null,
      (() => { const m = Object.entries(IR).filter(([, v]) => v.w.some(w => w.term === o.t)); return m.length ? h('div.gl-box', h('span.lb', A.t('이 말을 다루는 곳', 'Who works on this')), h('div.gl-insts', m.map(([i, v]) => h('a.gl-inst', { href: 'institutions.html#' + i }, v.n)))) : null; })(),
      h('div.gl-links',
        hasRel ? h('a.gl-go', { href: 'layers.html#' + encodeURIComponent(o.t) }, h('span', A.t('층 관계도에서 사슬 보기', 'See the chain on the layer map')), h('span', A.t(`아래 ${o.dn} · 위 ${o.up}`, `below ${o.dn} · above ${o.up}`))) : null,
        o.sid ? h('a.gl-go', { href: /^[a-f]/.test(o.sid) ? 'compute.html#' + o.sid : 'devices.html#mx' }, h('span', A.t((SNAME[o.sid] || o.sid) + ' 열기', 'Open ' + A.tr(SNAME[o.sid] || o.sid))), h('span', o.sid.toUpperCase())) : null)));
  }

  function pick(t) {
    A.route.go('', t);
    if (A.narrow()) $('#gl-panel').scrollIntoView({ block: 'start' });
  }

  qEl.addEventListener('input', () => A.route.set({ q: qEl.value.trim() ? qEl.value : null }, { replace: true }));

  // 해시 → 화면. 용어에 '/'가 든 것(ADC/DAC 등)이 있어 접두어 없는 해시는 통째로 용어로 본다
  let first = true, lastQ = null;
  A.route.on(r => {
    const t = r.key === 'term' ? r.arg : r.raw;
    st.sel = byT.has(t) ? t : null;
    st.q = A.route.param(r, 'q', '');
    if (qEl.value !== st.q) qEl.value = st.q;
    if (st.sel) open.add(byT.get(st.sel).l);   // 고른 말의 줄은 펴 둔다
    if (st.q !== lastQ || st.sel) { lastQ = st.q; renderList(); }
    renderPanel();
    if (first && st.sel) {
      const c = A.$$('#gl-list .chip').find(c => c.dataset.t === st.sel);
      if (c && !A.narrow()) c.scrollIntoView({ block: 'center' });
    }
    first = false;
  });
})();
