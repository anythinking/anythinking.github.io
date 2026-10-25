/* 광학 전체 지도 — 갈래 선택(#g5) · 판단 보기(#judge/g5, 개인판만) */
(function () {
  'use strict';
  const D = A.data('optics');
  if (!D) return;
  const h = A.h, PRIV = A.hasPrivate('optics');
  const TREE = D.TREE || [], MAX = 96, DEF = 4;
  const STAR = D.STAR || {}, J = D.JTXT || {};
  const COVN = { y: '있음', p: '조각', n: '없음' };
  const canHover = window.matchMedia('(hover: hover)');

  // "계산광학 58 · 천문 68" → [{n, c}] (숫자 없는 문자열은 메모)
  function parse(s) {
    return /\d/.test(s) ? s.split(' · ').map(x => { const m = x.match(/^(.*?)\s+(\d+)$/); return m ? { n: m[1], c: +m[2] } : null; }).filter(Boolean) : [];
  }

  let st = { i: DEF, judge: false };
  let pv = -1;   // 마우스를 올린 갈래 — 미리보기일 뿐 선택(주소)은 바꾸지 않는다
  function fromRoute(r) {
    const judge = PRIV && (r.key === 'judge' || (r.key === '' && r.arg === 'judge'));
    const arg = r.key === 'judge' || r.key === '' ? r.arg : '';
    const i = TREE.findIndex(t => t.id === arg);
    return { i: i >= 0 ? i : DEF, judge };
  }
  // 기본 갈래는 해시 없음 / "#judge" — 그 밖은 "#g3" · "#judge/g3"
  function nav(next, replace) {
    const id = next.i === DEF ? '' : TREE[next.i].id;
    if (next.judge) id ? A.route.go('judge', id, { replace }) : A.route.go('', 'judge', { replace });
    else A.route.go('', id, { replace });
  }

  // ── 갈래 ──
  function branch(t, i) {
    const f = parse(t.fields), on = st.i === i;
    const chips = f.map(x => {
      const S = st.judge ? STAR[x.n] : null, s = S ? S[0] : 0;
      const cls = 'span.op-f' + (s === 3 ? '.s3' : '') + (st.judge && !S ? '.off' : st.judge && s === 1 ? '.dim' : '');
      return h(cls, { style: { minWidth: Math.round(48 + x.c / MAX * 60) + 'px' } },
        x.n, h('span.c', null, String(x.c)), S ? h('span.s', null, A.stars(s)) : null);
    });
    const el = h('div.op-br' + (on ? '.on' : ''), {
      role: 'listitem', tabindex: '0', 'aria-current': on ? 'true' : null, dataset: { i: String(i) },
      onclick: () => nav({ i, judge: st.judge }, false),
      onmouseenter: () => { if (canHover.matches && !A.narrow()) preview(i); },
      onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav({ i, judge: st.judge }, false); } },
    },
      h('div.op-meta', null, h('span.op-meet', null, t.meet), h('span.op-ph', null, t.ph), h('span.op-lang', null, '언어 · ' + t.lang)),
      h('div.op-body', null,
        h('div.op-fields', null, chips, f.length ? null : h('span.op-note', null, t.fields)),
        t.foot ? h('span.op-fp', null, h('i'), h('span', null, (D.UI && D.UI.foot || '') + t.foot)) : null));
    return el;
  }

  // ── 요약 카드(오른쪽 패널, 좁은 화면에선 선택 갈래 밑) ──
  function card() {
    const k = pv >= 0 ? pv : st.i, peek = k !== st.i;
    const T = TREE[k], F = parse(T.fields), tot = F.reduce((a, b) => a + b.c, 0);
    return h('div.det.op-cur' + (peek ? '.peek' : ''), { 'aria-live': 'polite' },
      h('span.lb', null, `갈래 ${k + 1} / ${TREE.length}` + (tot ? ` · ${tot}명` : '') + (peek ? ' · 미리보기 — 누르면 고정' : '')),
      h('h3', null, T.meet),
      h('p', null, T.ph + ' ', h('span.muted', null, '— 필요한 언어는 ' + T.lang)),
      F.length ? h('div.op-cur-fs', null, F.map(x => h('div.op-cur-f', null,
        h('span', null, x.n, h('i', { style: { width: Math.round(x.c / MAX * 100) + '%' } })),
        h('span.mono', null, String(x.c))))) : null,
      F.length ? null : h('p.op-cnote', null, T.fields),
      T.foot ? h('p.op-cfoot', null, (D.UI && D.UI.foot || '') + T.foot) : null);
  }

  function strata() {
    return (D.STRATA || []).map((s, k) => h('div.op-st.k' + k, null,
      h('div.op-st-row', null,
        h('div.op-st-n', null, h('b', null, s.n), h('span', null, s.k)),
        h('div.op-st-t', null, h('b', null, s.what), h('span', null, s.d))),
      st.judge && k === 2 ? h('div.op-rungs', null,
        (D.RUNG || []).map((r, i) => h('div.op-rung', { style: { marginLeft: `min(${i * 14}px, ${i * 2}%)` } },
          h('span', null, h('b', null, r.n), h('span.mono', null, '빛 = ' + r.light)),
          h('span.op-rung-d', null, h('span', null, r.d),
            r.cov ? h('span.op-cov', null, h('i.' + r.cov), r.c) : null))),
        J.hidden ? h('span.op-hidden', null, J.hidden) : null) : null));
  }

  function judgeBox() {
    if (!st.judge || !D.JL) return null;
    return h('div.op-jbox', null,
      h('span.lb', null, J.head || ''),
      h('p', { html: J.p || '' }),
      h('div.op-jl', null, D.JL.map(j => h('div.op-jr' + (j.s === 1 ? '.low' : ''), null,
        h('span.s', null, A.stars(j.s)),
        h('span', null, h('b', null, j.n), ' ', h('span.muted', null, `· 커버리지 ${COVN[j.cov]} — ${j.d}`))))),
      J.foot ? h('span.op-jfoot', null, J.foot) : null);
  }

  function preview(i) {
    if (pv === i) return;
    pv = i;
    A.$$('#op-tree .op-br').forEach(el => el.classList.toggle('pv', +el.dataset.i === pv && pv !== st.i));
    if (!A.narrow()) A.mount('#op-cur-home', card());
  }

  function render(next) {
    st = next;
    pv = -1;
    const tree = A.$('#op-tree');
    tree.onmouseleave = () => preview(-1);
    A.mount(tree, TREE.map(branch));
    const c = card();
    if (A.narrow()) {
      tree.children[st.i].after(c);
      A.mount('#op-cur-home');
    } else A.mount('#op-cur-home', c);
    A.mount('#op-strata', strata());
    A.mount('#op-judge', judgeBox());
    if (PRIV && J.btn) {
      A.mount('#op-judge-slot', h('button.op-jbtn', {
        type: 'button', 'aria-pressed': st.judge ? 'true' : 'false',
        onclick: () => nav({ i: st.i, judge: !st.judge }, true),
      }, J.btn));
    }
    if (D.NL) {
      A.mount('#op-nl', h('span.lb', null, '비선형이 떠받치는 구조'),
        h('div.op-nl', null, D.NL.map(x => h('a', { href: 'compute.html#' + encodeURIComponent(x.id) }, x.n + ' →'))));
    }
  }

  A.route.on(r => render(fromRoute(r)));
  window.matchMedia('(max-width: 899.98px)').addEventListener('change', () => render(st));
})();
