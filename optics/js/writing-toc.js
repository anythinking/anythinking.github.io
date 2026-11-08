/* 글 본문의 차례: 넓은 화면에서 왼쪽 여백에 h2 목록을 띄운다(1240px 이상, CSS 가 숨김/표시를 정한다). 좁으면 안 만든다. */
(function () {
  'use strict';
  const doc = document.querySelector('.doc');
  if (!doc) return;
  const hs = Array.from(doc.querySelectorAll('h2')).filter(h => !h.classList.contains('wr-cat') && h.textContent.trim());
  if (hs.length < 3) return;
  const main = doc.closest('main') || document.scrollingElement;
  const toc = document.createElement('nav');
  toc.className = 'wr-toc'; toc.setAttribute('aria-label', '차례');
  const links = hs.map((h, i) => {
    if (!h.id) h.id = 's' + (i + 1);
    const a = document.createElement('a');
    a.href = '#' + h.id; a.textContent = h.textContent.trim();
    a.addEventListener('click', e => { e.preventDefault(); h.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
    toc.appendChild(a);
    return a;
  });
  document.body.appendChild(toc);
  // 지금 보는 절 — 스크롤 위치보다 위에 있는 마지막 제목
  let raf = 0;
  function mark() {
    raf = 0;
    const top = main.getBoundingClientRect ? main.getBoundingClientRect().top + 80 : 80;
    let cur = 0;
    hs.forEach((h, i) => { if (h.getBoundingClientRect().top <= top) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  }
  (main === document.scrollingElement ? window : main).addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(mark); }, { passive: true });
  mark();
})();
