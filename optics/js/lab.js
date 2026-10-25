/* 옛 실험실 주소(lab.html#프리셋?키=값)를 구조 페이지 A-05 의 깊게 보기로 넘긴다 — 공유된 링크가 살아 있게 */
(function () {
  'use strict';
  const r = A.route.get(), ps = new URLSearchParams();
  Object.keys(r.params).forEach(k => ps.set(k, r.params[k]));
  ps.set('deep', '1');
  if (r.arg && r.arg !== 'feldmann2021') ps.set('pre', r.arg);
  location.replace('compute.html#a5?' + ps.toString());
})();
