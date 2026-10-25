/* 용어 페이지: 검색 · 층 필터 · 종류 필터 · 선택한 말의 풀이. 선택은 #<용어> 로 남는다 */
(function () {
  'use strict';
  const X = A.data('glossary');
  if (!X) return;
  const { h, pill, mount, $ } = A;

  const LN = { L0: '빛 자체', L1: '물리 효과', L2: '재료·플랫폼', L3: '소자', L4: '회로', L5: '아키텍처', L6: '시스템·산업', '비교': '층 밖 — 전자와 비교', '기타': '그 밖',
    'G:A': '행렬곱', 'G:B': '신경망 모델', 'G:C': '최적화', 'G:D': '디지털 전광 논리', 'G:E': '센서·이미징', 'G:F': '양자·신호처리', 'G:M': '메시 심화' };
  const LQ = { L0: '무엇을 조절하고 무엇을 잴 수 있나', L1: '무엇을 걸면 빛이 어떻게 변하나', L2: '어떤 재료가 어떤 손잡이를 갖나', L3: '효과와 형상으로 무엇을 만드나', L4: '소자를 엮어 무슨 함수를 만드나', L5: '그 회로로 어떤 계산기를 짓나', L6: '누가 사고 어디서 돈이 나나', '비교': '광이 전자보다 나은 점 — L0 사실의 결과', '기타': '기관·분야 쪽 용어 — 층에 안 걸린다' };
  const ORDER = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', '비교', '기타', 'G:A', 'G:B', 'G:C', 'G:D', 'G:E', 'G:F', 'G:M'];
  const KS = [['all', '전체'], ['입자', '입자'], ['관계', '관계'], ['미분류', '미분류']];

  const isG = l => l.startsWith('G:');
  const key = l => isG(l) ? l.slice(2) + '군' : l === '기타' ? '—' : l;
  const kind = o => o.c || '미분류';
  const plain = s => String(s || '').replace(/<[^>]+>/g, '').toLowerCase();
  const byT = new Map(X.map(o => [o.t, o]));

  const st = { q: '', only: 'all', kind: 'all', sel: null };
  const qEl = $('#gl-q');

  function hits(s) {
    s = s || st;
    const n = s.q.trim().toLowerCase();
    return X.filter(o => (s.only === 'all' || o.l === s.only) && (s.kind === 'all' || kind(o) === s.kind) &&
      (!n || o.t.toLowerCase().includes(n) || plain(o.d).includes(n)));
  }

  function renderFilters() {
    const have = ORDER.filter(L => X.some(o => o.l === L));
    mount('#gl-layers', [{ k: '', l: '전체', id: 'all' }].concat(have.map(L => ({ k: key(L), l: LN[L], id: L }))).map(f =>
      pill([f.k ? h('span.k', f.k) : null, f.l].filter(Boolean), st.only === f.id, () => view({ only: f.id }))));
    mount('#gl-kinds', h('span.gl-kl', 'KIND'), KS.map(([id, l]) => {
      const n = id === 'all' ? X.length : X.filter(o => kind(o) === id).length;
      return pill([l, ' ', h('span.n', String(n))], st.kind === id, () => view({ kind: id }));
    }));
  }

  function renderList() {
    const hit = hits();
    const filtered = st.q.trim() || st.only !== 'all' || st.kind !== 'all';
    $('#gl-cnt').textContent = filtered ? `${hit.length} / ${X.length}개` : `${X.length}개`;
    const rows = ORDER.map(L => {
      const g = hit.filter(o => o.l === L).sort((a, b) => a.t.localeCompare(b.t, 'ko'));
      if (!g.length) return null;
      const kc = isG(L) ? '.g' : /^L[345]$/.test(L) ? '.p' : '';
      return h('div.row',
        h('div.gl-head',
          h('div', h('span.gl-k' + kc, key(L)), h('span.gl-t', LN[L]), h('span.gl-n', String(g.length))),
          h('span.gl-q', LQ[L] || '그 구조를 설명할 때 쓰는 말')),
        h('div.wrap', g.map(o => {
          const gb = !isG(L) && o.gs.length ? o.gs.join('·') : '';
          const on = st.sel === o.t;
          return h('a.chip' + (on ? '.on' : ''), { href: A.route.href('', o.t), dataset: { t: o.t }, 'aria-current': on ? 'true' : null,
            onclick: e => { e.preventDefault(); pick(o.t); } }, o.t, gb ? h('span.n', gb) : null);
        })));
    }).filter(Boolean);
    mount('#gl-list', rows.length ? rows : h('p.empty', '찾는 말이 없다. 다른 낱말로 해보거나 층 필터를 풀어보자.'));
  }

  function markSel() {
    A.$$('#gl-list .chip').forEach(c => {
      const on = c.dataset.t === st.sel;
      c.classList.toggle('on', on);
      if (on) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
    });
  }

  function renderPanel() {
    const o = st.sel && byT.get(st.sel);
    document.title = (o ? o.t + ' · ' : '') + '용어 — 광 연산 지도와 실험실';
    if (!o) {
      mount('#gl-panel', h('div.gl-intro',
        h('span.gl-where', `용어 정리 · ${X.length}개`),
        h('h2', '이 페이지가 쓰는 말'),
        h('p.sub', '층이 붙은 용어는 층 관계도로 건너뛰어 그 말이 어디서 와서 어디로 가는지 사슬로 볼 수 있다. 군이 붙은 용어는 그 구조를 설명할 때 쓰는 말이다.'),
        h('p.note', '왼쪽에서 말을 누르면 풀이가 여기 열린다.')));
      return;
    }
    const where = kind(o) + ' · ' + (isG(o.l) ? o.l.slice(2) + '군 · ' + LN[o.l] : o.l === '기타' ? '그 밖' : o.l + ' · ' + LN[o.l]) +
      (o.gs.length && !isG(o.l) ? ' · ' + o.gs.join('·') + '군에서도 쓴다' : '');
    const hasRel = o.w && /^L|비교/.test(o.l);
    mount('#gl-panel', h('div.gl-sel',
      h('div.gl-top', h('span.gl-where', where), h('button.gl-close', { type: 'button', onclick: () => A.route.go('', '') }, '닫기 ✕')),
      h('h2', o.t),
      h('p.gl-def', { html: o.d }),
      o.im ? h('div.gl-fig', { html: o.im }) : null,
      o.x ? h('div.gl-box', h('span.lb', o.gs.length ? o.gs.join('·') + '군에서는' : '덧붙임'), h('p.gl-x', { html: o.x })) : null,
      h('div.gl-links',
        hasRel ? h('a.gl-go', { href: 'layers.html#' + encodeURIComponent(o.t) }, h('span', '층 관계도에서 사슬 보기'), h('span', `아래 ${o.dn} · 위 ${o.up} →`)) : null,
        o.sid ? h('a.gl-go', { href: 'compute.html#' + o.sid }, h('span', o.s + ' 열기'), h('span', o.sid.toUpperCase() + ' →')) : null)));
  }

  function pick(t) {
    A.route.go('', t);
    if (A.narrow()) $('#gl-panel').scrollIntoView({ block: 'start' });
  }

  // 보기 상태 바꾸기. 바뀐 필터에서 열린 말이 목록에서 빠지면 그 말도 닫는다 — 목록과 풀이가 엇갈리지 않게
  function view(patch, opt) {
    const next = Object.assign({}, st, patch);
    const keep = !st.sel || hits(next).some(o => o.t === st.sel);
    const params = { q: next.q.trim() ? next.q : null, only: next.only === 'all' ? null : next.only, kind: next.kind === 'all' ? null : next.kind };
    if (keep) A.route.set(params, opt);
    else A.route.go('', '', Object.assign({ params }, opt));
  }

  qEl.addEventListener('input', () => view({ q: qEl.value }, { replace: true }));

  // 해시 → 화면 전부. 용어에 '/'가 든 것(ADC/DAC 등)이 있어 접두어 없는 해시는 통째로 용어로 본다
  let first = true, lastView = null;
  A.route.on(r => {
    const t = r.key === 'term' ? r.arg : r.raw;
    st.sel = byT.has(t) ? t : null;
    st.q = A.route.param(r, 'q', '');
    st.only = A.route.param(r, 'only', 'all');
    st.kind = A.route.param(r, 'kind', 'all');
    if (qEl.value !== st.q) qEl.value = st.q;
    const v = [st.q, st.only, st.kind].join('\u0000');
    if (v !== lastView) { lastView = v; renderFilters(); renderList(); }
    markSel();
    renderPanel();
    if (first && st.sel) {
      const c = A.$$('#gl-list .chip').find(c => c.dataset.t === st.sel);
      if (c && !A.narrow()) c.scrollIntoView({ block: 'center' });
    }
    first = false;
  });

})();
