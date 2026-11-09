/* 소자 페이지: 소자 × 구조 표가 첫 화면. 행 = 소자(「빛에 무엇을 하나」 군), 열 = 구조(갈래 순). 고른 소자는 #<id> 로 남고 그 행이 펼쳐진다.
   옛 해시 #mx/<id> · #wall/<id> 도 같은 소자로 받는다. */
(function () {
  'use strict';
  const { h, mount, $, route } = A;
  const O = A.data('devices'), X = A.data('dev-extra'), OV = A.data('overview'), CP = A.data('compute'), IR = A.data('inst-refs') || {};
  if (!O || !X || !OV) return;

  const { DEV, BOM } = O;
  // 구조 표(overview.S)가 이름·갈래의 원천 — 여기 키는 전부 구조 id
  const SROW = Object.fromEntries(OV.S.map(s => [s.id, s]));
  const nm = s => (SROW[s] || {}).short || s;
  const href = s => /^[a-f]/.test(s) ? `compute.html#${s}` : 'compute.html';

  // 열: 갈래 순 → 그 안은 id 순. 갈래 없는 것(실물)은 맨 끝
  const PARA = ((CP && CP.PARA) || []);
  const cols = [];
  PARA.forEach(p => {
    const ids = OV.S.filter(s => s.para === p.id && BOM[s.id]).map(s => s.id).sort();
    if (ids.length) cols.push({ t: p.t, ids });
  });
  const rest = Object.keys(BOM).filter(id => !cols.some(c => c.ids.includes(id))).sort();
  if (rest.length) cols.push({ t: A.t('실물', 'Real build'), ids: rest });
  const allc = cols.flatMap(c => c.ids);
  const bom = Object.fromEntries(Object.entries(BOM).map(([sid, items]) => [sid, Object.fromEntries(items.map(it => [it.id, it]))]));
  const uses = Object.fromEntries(Object.keys(DEV).map(d => [d, allc.filter(sid => bom[sid][d])]));
  const nreq = allc.reduce((n, sid) => n + Object.values(bom[sid]).filter(it => it.k).length, 0);

  const st = { sel: null };
  const rowEls = {};

  function head() {
    const span = allc.length + cols.length + 2;
    const top = h('tr',
      h('th.dv-corner', { rowspan: 2 }, h('span', A.t('소자 ↓ · 구조 →', 'device ↓ · structure →'))),
      cols.flatMap(c => [h('th.dv-gh', { colspan: c.ids.length }, A.tr(c.t)), h('th.dv-gap')]),
      h('th.dv-cnth', { rowspan: 2 }, A.t('쓰임', 'uses')));
    const sec = h('tr', cols.flatMap(c => c.ids.map(id =>
      h('th.dv-col', { title: A.tr(nm(id)) }, h('a', { href: href(id) }, id.toUpperCase()))).concat([h('th.dv-gap')])));
    return [h('thead', top, sec), span];
  }

  function devRow(id) {
    const d = DEV[id], u = uses[id], how = X.HOW[id] || [];
    const makers = Object.entries(IR).filter(([, v]) => v.w.some(w => w.dev === id));
    const cells = cols.flatMap(c => c.ids.map(sid => {
      const it = bom[sid][id];
      const cls = it ? (it.k ? '.dv-k1' : '.dv-k0') : '';
      return h('td' + cls, { title: A.tr(nm(sid)) + (it ? ' — ' + it.r : A.t(' · 안 쓴다', ' · not used')), onclick: () => pick(id) }, h('i'));
    }).concat([h('td.dv-gap')]));
    const tr = h('tr.dv-dev' + (u.length ? '' : '.dv-zero'), { dataset: { id } },
      h('th', { scope: 'row', onclick: () => pick(id) },
        h('span.dv-n', d.n, d.term ? h('a.dv-term', { href: 'glossary.html#' + encodeURIComponent(d.term), title: A.t('용어집 정의', 'Definition in glossary'), onclick: e => e.stopPropagation() }, A.t('정의', 'def')) : null),
        h('span.dv-d', d.d),
        how.length ? h('span.dv-how', A.t('만드는 법 · ', 'How it is made · ') + how.join(' · ')) : null,
        makers.length ? h('span.dv-makers', h('span.dv-mlb', A.t('만드는 곳', 'Who makes it')), makers.map(([i, v]) => h('a.dv-mk', { href: 'institutions.html#' + i, onclick: e => e.stopPropagation() }, v.n))) : null,
        !u.length ? h('span.dv-zerobox', A.t(`${allc.length}개 구조 어디에도 안 들어간다 — 광학에서 중요해도 연산 회로에는 자리가 없다.`, `Used in none of the ${allc.length} structures — important in optics, no place in a computing circuit.`)) : null),
      cells, h('td.dv-cnt', u.length ? String(u.length) : '—'));
    rowEls[id] = tr;
    return tr;
  }

  function table() {
    const [thead, span] = head();
    const body = h('tbody', X.GROUPS.flatMap(g => {
      const ids = Object.keys(DEV).filter(id => DEV[id].g === g);
      return [h('tr.dv-grp', h('th', { colspan: span }, A.tr(g), h('span.n', String(ids.length)))), ids.map(devRow)];
    }));
    mount('#dv-table', thead, body);
  }

  function walls() {
    mount('#dv-walls', allc.filter(s => X.MISS[s]).map(s => h('div.dv-wcard',
      h('a.dv-wlink', { href: href(s) }, h('b', A.tr(nm(s))), h('span.dv-id', s.toUpperCase())),
      X.MISS[s].map(t => h('p', t.replace(/<[^>]+>/g, ''))))));
  }

  function mark() {
    Object.entries(rowEls).forEach(([id, tr]) => tr.classList.toggle('open', st.sel === id));
  }
  function pick(id) { route.go('', st.sel === id ? '' : id); }

  table(); walls();
  const used = Object.values(uses).filter(u => u.length).length;
  $('#dv-stat').textContent = A.t(`소자 ${Object.keys(DEV).length} · 쓰이는 소자 ${used} · 구조 ${allc.length} · 필수 칸 ${nreq}`, `${Object.keys(DEV).length} devices · ${used} in use · ${allc.length} structures · ${nreq} required cells`);

  let first = true;
  route.on(r => {
    const id = DEV[r.arg] ? r.arg : (DEV[r.raw] ? r.raw : null);
    st.sel = id;
    mark();
    document.title = (id ? DEV[id].n + ' · ' : '') + A.t('소자', 'Devices') + ' — ' + A.site;
    if (id && first && rowEls[id]) rowEls[id].scrollIntoView({ block: 'center' });
    first = false;
  });
})();
