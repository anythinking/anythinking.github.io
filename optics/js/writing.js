/* 글 목록: 기초 · 시뮬레이션 · 논문 리뷰 · 단권화 탭. 주소 #sim 처럼 탭을 바로 열 수 있다 */
(function () {
  'use strict';
  const btns = Array.from(document.querySelectorAll('.wr-tabs [data-tab]'));
  if (!btns.length) return;
  const ids = btns.map(b => b.dataset.tab);
  btns.forEach(b => {
    const n = document.querySelectorAll('#' + b.dataset.tab + ' .wr-list > li').length;
    b.querySelector('.n').textContent = n;
  });
  function show(id) {
    if (ids.indexOf(id) < 0) id = ids[0];
    btns.forEach(b => {
      const on = b.dataset.tab === id;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.dataset.tab).hidden = !on;
    });
  }
  const R = window.A && A.route;
  btns.forEach((b, i) => {
    b.addEventListener('click', () => R ? R.go('', b.dataset.tab, { replace: true }) : show(b.dataset.tab));
    b.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const nb = btns[(i + d + btns.length) % btns.length];
      nb.focus(); nb.click();
    });
  });
  if (R) R.on(r => show(r.arg)); else show(location.hash.slice(1));
})();
