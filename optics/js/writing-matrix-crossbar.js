/* 글 「신경망 → 크로스바」 그림 6: w₁₁ 슬라이더로 직렬 탭과 분배기 구조의 y₂를 비교 */
(function () {
  'use strict';
  const rng = document.getElementById('f6-w');
  if (!rng) return;
  const K = 12, B = 0.7;
  const $ = id => document.getElementById(id);
  const sw = (id, w) => { $(id).style.strokeWidth = Math.max(w, 0); };
  const f = v => v.toFixed(2);
  function draw() {
    const w = +rng.value, rest = 1 - w;
    $('f6-wo').textContent = f(w);
    sw('f6-s-y1', K * w); sw('f6-s-mid', K * rest); sw('f6-s-y2', K * rest * B); sw('f6-s-rest', K * rest * (1 - B));
    $('f6-s-y1t').textContent = 'y₁ ' + f(w);
    $('f6-s-y2t').textContent = 'y₂ ' + f(rest * B);
    sw('f6-p-y1', K / 2 * w);
    $('f6-p-a1').textContent = '× ' + f(w);
    $('f6-p-y1t').textContent = 'y₁ ' + f(w / 2);
  }
  let timer = null, dir = 1;
  const btn = $('f6-play');
  function stop() { clearInterval(timer); timer = null; btn.textContent = '자동으로 움직이기'; }
  btn.addEventListener('click', () => {
    if (timer) return stop();
    btn.textContent = '멈추기';
    timer = setInterval(() => {
      let v = +rng.value + dir * 0.01;
      if (v >= 0.99) { v = 0.99; dir = -1; } else if (v <= 0.01) { v = 0.01; dir = 1; }
      rng.value = v; draw();
    }, 40);
  });
  rng.addEventListener('input', () => { if (timer) stop(); draw(); });
  draw();
})();
