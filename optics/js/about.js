/* 소개 페이지: 이메일 주소는 크롤러가 바로 긁지 못하게 화면에서 조립한다 */
(function () {
  'use strict';
  const a = A.$('#ab-mail'), btn = A.$('#ab-copy');
  if (!a) return;
  const addr = a.dataset.u + '@' + a.dataset.d;
  a.textContent = addr;
  a.href = 'mailto:' + addr;
  if (!navigator.clipboard) return;
  btn.hidden = false;
  btn.onclick = () => navigator.clipboard.writeText(addr).then(() => {
    btn.textContent = A.t('복사했습니다', 'Copied');
    setTimeout(() => { btn.textContent = A.t('주소 복사', 'Copy address'); }, 1600);
  });
})();
