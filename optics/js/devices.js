/* 소자 페이지: 보기 3개(소자별 · 소자 × 구조 · 없는 칸) + 오른쪽 상세 패널.
   해시: #<id> = 소자별, #mx/<id> = 소자 × 구조, #wall/<id> = 없는 칸. 비면 eom. */
(function () {
  'use strict';
  const { h, mount, $, route } = A;
  const O = A.data('devices'), X = A.data('dev-extra');
  if (!O || !X) return;

  const { DEV, BOM, ST, GN } = O;
  const VIEWS = [['chips', A.t('소자별', 'By device')], ['mx', A.t('소자 × 구조', 'Device × structure')], ['wall', A.t('없는 칸', 'Missing cells')]];
  const DEFAULT = 'eom';

  // 구조 순서·쓰임 (한 번만 계산)
  const ORDER = Object.keys(ST).filter(s => BOM[s]);
  const usesOf = {};
  ORDER.forEach(s => BOM[s].forEach(it => { (usesOf[it.id] = usesOf[it.id] || []).push({ s, it }); }));
  const uses = id => usesOf[id] || [];
  const used = new Set(Object.keys(usesOf));
  const sid = s => { const t = ST[s]; return t ? (t[0] + t[1]).toUpperCase() : ''; };
  const href = s => { const t = ST[s]; return t && /[a-f]/.test(t[0]) ? `compute.html#${t[0]}${t[1]}` : 'compute.html'; };

  let prev = null;
  const cols = ORDER.map(s => { const g = ST[s][0], sep = prev !== null && prev !== g; prev = g; return { s, id: sid(s), sep }; });

  const st = { view: 'chips', sel: DEFAULT };
  let first = true;

  const keyOf = v => (v === 'chips' ? '' : v);
  const pick = id => route.go(keyOf(st.view), id);
  const setView = v => route.go(keyOf(v), st.sel);

  function renderBar() {
    mount('#dv-views', VIEWS.map(([k, l]) => A.pill(l, st.view === k, () => setView(k))));
    $('#dv-stat').textContent = A.t(`소자 ${Object.keys(DEV).length}개 · 실제로 쓰이는 소자 ${used.size}개 · 구조 ${ORDER.length}개`, `${Object.keys(DEV).length} devices · ${used.size} actually used · ${ORDER.length} structures`);
  }

  function renderChips() {
    mount('#dv-groups', X.GROUPS.map(g => h('div.dv-grp',
      h('span.dv-gname', A.tr(g)),
      h('div.wrap.dv-gitems', Object.keys(DEV).filter(id => DEV[id].g === g).map(id => {
        const n = uses(id).length, on = st.sel === id;
        const b = h('button.chip.dv-chip', { type: 'button', onclick: () => pick(id), 'aria-pressed': on ? 'true' : 'false' },
          DEV[id].n, h('span.n', String(n)));
        if (on) b.classList.add('on'); else if (!n) b.classList.add('dv-zero');
        return b;
      })))));
  }

  function renderMx() {
    const head = h('tr', h('th.dv-corner'), cols.map(c =>
      h('th.dv-col' + (c.sep ? '.dv-sep' : ''), { title: A.tr(c.s), scope: 'col' }, c.id)));
    const rows = Object.keys(DEV).filter(id => used.has(id)).map(id => {
      const on = st.sel === id, go = () => pick(id);
      return h('tr' + (on ? '.on' : ''),
        h('th.dv-rowh', { scope: 'row', onclick: go }, DEV[id].n),
        ORDER.map((s, i) => {
          const it = BOM[s].find(x => x.id === id);
          const cls = 'td' + (it ? (it.k ? '.dv-k1' : '.dv-k0') : '') + (cols[i].sep ? '.dv-sep' : '');
          return h(cls, { onclick: go, title: DEV[id].n + ' — ' + A.tr(s) + (it ? ': ' + it.r : A.t(' : 안 쓰인다', ': not used')) });
        }));
    });
    mount('#dv-table', h('thead', head), h('tbody', rows));
  }

  function renderWall() {
    mount('#dv-walls', Object.keys(X.MISS).map(s => h('div.dv-wcard',
      h('a.dv-wlink', { href: href(s) }, h('b', A.tr(s)), h('span.dv-id', sid(s) + ' →')),
      X.MISS[s].map(t => h('p', t.replace(/<[^>]+>/g, '')))
    )));
  }

  function renderSide() {
    const D = DEV[st.sel], side = $('#dv-side');
    if (!D) return mount(side);
    const u = uses(st.sel);
    const out = [
      h('div.dv-head', h('span.dv-lb', A.tr(D.g)), h('h2', D.n), h('p.dv-d', D.d)),
      h('div.dv-blk', h('span.dv-lb', A.t('무엇으로 만드나', 'What it is made of')),
        h('div.wrap', (X.HOW[st.sel] || []).map(t => h('span.dv-how', t)))),
    ];
    if (!u.length) {
      out.push(h('p.dv-zerobox', h('b', A.t(`${ORDER.length}개 구조 어디에도 안 들어간다.`, `Used in none of the ${ORDER.length} structures.`)), A.t(' 광학에서 중요한 소자여도 연산 회로에는 자리가 없다는 뜻이다.', ' However important it is in optics, it has no place in a computing circuit.')));
    } else {
      const miss = Object.keys(GN).filter(g => !u.some(x => ST[x.s][0] === g)).map(g => A.tr(GN[g]));
      out.push(h('div.dv-blk',
        h('span.dv-lb', A.t(`이 소자를 쓰는 구조 ${u.length}개`, `${u.length} structures use this device`)),
        h('div.dv-uses', u.map(({ s, it }) => h('a.dv-use', { href: href(s) },
          h('span.dv-ut',
            h('b', A.tr(s)),
            h('span.dv-k' + (it.k ? '.req' : ''), it.k ? A.t('필수', 'required') : A.t('선택', 'optional')),
            h('span.dv-id', sid(s) + ' →')),
          h('span.dv-r', it.r)))),
        miss.length ? h('p.dv-miss', h('b', miss.join(' · ')), A.t(' 에는 안 쓰인다.', ' — not used here.')) : null));
    }
    mount(side, out);
  }

  route.on(r => {
    const v = r.key === 'mx' || r.key === 'wall' ? r.key : 'chips';
    const sel = DEV[r.arg] ? r.arg : (r.arg ? st.sel : DEFAULT);
    const moved = !first && sel !== st.sel;
    st.view = v; st.sel = sel;
    VIEWS.forEach(([k]) => { $('#dv-' + k).hidden = k !== v; });
    renderBar(); renderSide();
    if (v === 'chips') renderChips(); else if (v === 'mx') renderMx(); else renderWall();
    // 좁은 화면에선 상세가 본문 아래에 있으니, 다른 소자를 고르면 그리로 내려 보낸다
    if (moved && A.narrow()) $('#dv-side').scrollIntoView({ behavior: 'smooth', block: 'start' });
    first = false;
  });
})();
