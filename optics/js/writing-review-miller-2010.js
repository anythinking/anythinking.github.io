/* 2절 기준 여섯 개: 세로 탭. 위·아래 화살표로도 옮겨 다닌다 */
(function () {
  'use strict';
  document.querySelectorAll('.wr-vt').forEach(box => {
    const tabs = Array.from(box.querySelectorAll('[role=tab]'));
    function show(t) {
      tabs.forEach(b => {
        const on = b === t;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
      });
    }
    tabs.forEach((b, i) => {
      b.addEventListener('click', () => show(b));
      b.addEventListener('keydown', e => {
        const d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const nb = tabs[(i + d + tabs.length) % tabs.length];
        nb.focus(); show(nb);
      });
    });
    show(tabs[0]);
  });
})();

/* 그림 2: 같은 비트열을 긴 선(30 cm)과 짧은 선(1 mm)에 보낸다.
   두 선 모두 V(x,t) = 보낸 전압(t − x/v) 하나의 식이고, 다른 것은 끝까지 가는 시간뿐이다 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!$('m2-play')) return;
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BITS = [1, 0, 1, 1, 0, 1, 0, 0], TB = 0.4, TR = 0.1, LOOP = 16, SEC_PER_NS = 3, N = 60;
  const lanes = [{ id: 'ml', y: 70, T: 1.5 }, { id: 'ms', y: 190, T: 0.007 }];
  const smooth = u => u * u * (3 - 2 * u);
  function drive(t) {
    if (t < 0) return 0;
    const k = Math.floor(t / TB), n = BITS.length;
    const prev = k > 0 ? BITS[(k - 1) % n] : 0, cur = BITS[k % n], u = (t - k * TB) / TR;
    return u < 1 ? prev + (cur - prev) * smooth(u) : cur;
  }
  lanes.forEach(L => {
    const g = $(L.id + '-cells');
    L.cells = [];
    for (let i = 0; i < N; i++) {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', 76 + i * 8); r.setAttribute('y', L.y - 9);
      r.setAttribute('width', 8); r.setAttribute('height', 18);
      r.setAttribute('style', 'fill:var(--warm)');
      g.appendChild(r); L.cells.push(r);
    }
  });
  let t = 0, playing = !reduce, last = 0, raf = null;
  function draw() {
    $('m2-t').textContent = 't = ' + t.toFixed(2) + ' ns';
    lanes.forEach(L => {
      L.cells.forEach((r, i) => r.setAttribute('fill-opacity', (0.06 + 0.9 * drive(t - (i + 0.5) / N * L.T)).toFixed(3)));
      $(L.id + '-vs').textContent = drive(t).toFixed(2) + ' V';
      $(L.id + '-vr').textContent = drive(t - L.T).toFixed(2) + ' V';
    });
  }
  function tick(now) {
    if (last) t = (t + (now - last) / 1000 / SEC_PER_NS) % LOOP;
    last = now; draw();
    raf = playing ? requestAnimationFrame(tick) : null;
  }
  $('m2-play').addEventListener('click', () => {
    playing = !playing;
    $('m2-play').textContent = playing ? '멈추기' : '재생';
    if (playing) { last = 0; raf = requestAnimationFrame(tick); }
  });
  $('m2-reset').addEventListener('click', () => { t = 0; last = 0; draw(); });
  if (reduce) { t = 1.9; $('m2-play').textContent = '재생'; draw(); }
  else raf = requestAnimationFrame(tick);
})();
