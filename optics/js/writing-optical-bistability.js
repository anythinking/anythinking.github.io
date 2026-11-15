/* 그림 3: 쌍안정을 그래프로 풀기.
   Y = X / (1 + (Δ − Y)²) — 왼쪽은 직선 Y/X 와 로런츠 봉우리의 교점, 오른쪽은 X 에 대한 Y 의 S자 곡선.
   지금 상태는 직전 상태에서 가장 가까운 안정한 해를 따라간다(그래서 올릴 때와 내릴 때 가지가 갈린다). */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!$('b3')) return;
  const L = $('b3-l'), R = $('b3-r'), sx = $('b3-x'), sd = $('b3-d');
  const YMAX = 7, XMAX = 10, LMAX = 1.15;
  // 왼쪽 판: 가로 Y(0~7), 세로 봉우리 값(0~1.15) · 오른쪽 판: 가로 X(0~10), 세로 Y(0~7)
  const lx = y => 50 + y / YMAX * 240, ly = v => 250 - v / LMAX * 205;
  const rx = x => 370 + x / XMAX * 245, ry = y => 250 - y / YMAX * 205;
  const f = (n, d = 1) => (+n).toFixed(d);
  const lor = (y, D) => 1 / (1 + (D - y) * (D - y));
  const Xof = (y, D) => y * (1 + (D - y) * (D - y));
  const dX = (y, D) => 3 * y * y - 4 * D * y + 1 + D * D;

  function roots(X, D) {
    const g = y => Xof(y, D) - X, out = [];
    const N = 700, top = 12;
    let a = 0, ga = g(0);
    if (ga === 0) out.push(0);
    for (let i = 1; i <= N; i++) {
      const b = top * i / N, gb = g(b);
      if (ga < 0 !== gb < 0) {
        let lo = a, hi = b;
        for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; (g(lo) < 0 !== g(m) < 0) ? hi = m : lo = m; }
        out.push((lo + hi) / 2);
      }
      a = b; ga = gb;
    }
    return out;
  }

  let cur = null, anim = null, lastX = 0;

  function pick(X, D) {
    const rs = roots(X, D), st = rs.filter(y => dX(y, D) > 0);
    const pool = st.length ? st : rs;
    if (cur === null) cur = pool[0];
    else cur = pool.reduce((p, y) => Math.abs(y - cur) < Math.abs(p - cur) ? y : p, pool[0]);
    return rs;
  }

  function axes(x0, x1, y0, y1, xl, yl) {
    return `<line class="ln" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/><line class="ln" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/>` +
      `<text class="sm" x="${x1}" y="${y0 + 20}" text-anchor="end">${xl}</text><text class="sm" x="${x0 + 6}" y="${y1 + 8}">${yl}</text>`;
  }

  function draw() {
    const X = +sx.value, D = +sd.value;
    const rs = pick(X, D);
    $('b3-xo').textContent = f(X, 2);
    $('b3-do').textContent = f(D, 1);

    // 왼쪽: 봉우리와 직선
    let p = '';
    for (let i = 0; i <= 280; i++) { const y = YMAX * i / 280; p += (i ? 'L' : 'M') + f(lx(y)) + ' ' + f(ly(lor(y, D))); }
    let s = axes(50, 290, 250, 30, '안쪽 빛 Y →', '세기 비');
    s += `<text x="170" y="18" text-anchor="middle">교점 = 가능한 상태</text>`;
    s += `<path class="light" style="stroke-width:2.4" d="${p}"/>`;
    s += `<text class="sm" x="${f(Math.min(lx(D) + 8, 286))}" y="${f(ly(1) - 6)}">공진기 (봉우리)</text>`;
    // 직선 Y/X — 판 위쪽에서 자른다
    const yEnd = X > 0 ? Math.min(YMAX, LMAX * X) : 0;
    s += `<line class="ln hl" style="stroke-width:2" x1="${lx(0)}" y1="${ly(0)}" x2="${f(lx(yEnd))}" y2="${f(X > 0 ? ly(yEnd / X) : ly(LMAX))}"/>`;
    s += `<text class="hlt" x="${f(Math.min(lx(yEnd), 282))}" y="${f(Math.max((X > 0 ? ly(yEnd / X) : ly(LMAX)) - 8, 40))}" text-anchor="end">입력 (기울기 1/X)</text>`;
    rs.forEach(y => {
      const stable = dX(y, D) > 0, isCur = Math.abs(y - cur) < 1e-6;
      s += `<circle cx="${f(lx(y))}" cy="${f(ly(lor(y, D)))}" r="${isCur ? 6.5 : 5}" ${stable ? (isCur ? 'style="fill:var(--warm)"' : 'class="nd" style="fill:var(--ink)"') : 'class="nd" style="stroke-dasharray:2 2"'}/>`;
    });
    L.innerHTML = s;

    // 오른쪽: S자 곡선 — 불안정 가지는 점선
    let t = axes(370, 615, 250, 30, '입력 X →', '안쪽 빛 Y');
    t += `<text x="492" y="18" text-anchor="middle">입력에 대한 상태</text>`;
    let seg = '', segSt = null;
    const flush = () => { if (seg) t += `<path class="light" style="stroke-width:2.4${segSt ? '' : ';stroke-dasharray:5 4;opacity:.7'}" d="${seg}"/>`; seg = ''; };
    for (let i = 0; i <= 560; i++) {
      const y = YMAX * i / 560, x = Xof(y, D);
      if (x > XMAX) { flush(); segSt = null; continue; }
      const st = dX(y, D) > 0;
      if (st !== segSt) { const last = seg; flush(); segSt = st; if (last) seg = last.replace(/.*([ML][^ML]*)$/, '$1').replace(/^L/, 'M'); }
      seg += (seg ? 'L' : 'M') + f(rx(x)) + ' ' + f(ry(y));
    }
    flush();
    // 문턱 표시 (Δ > √3 일 때만)
    let th = '';
    if (D * D > 3) {
      const ya = (2 * D - Math.sqrt(D * D - 3)) / 3, yb = (2 * D + Math.sqrt(D * D - 3)) / 3;
      const xa = Xof(ya, D), xb = Xof(yb, D);
      if (xa <= XMAX) t += `<line class="ln dim" style="stroke-dasharray:3 4" x1="${f(rx(xa))}" y1="250" x2="${f(rx(xa))}" y2="40"/><text class="sm" x="${f(rx(xa))}" y="266" text-anchor="middle">↑${f(xa, 2)}</text>`;
      t += `<line class="ln dim" style="stroke-dasharray:3 4" x1="${f(rx(xb))}" y1="250" x2="${f(rx(xb))}" y2="40"/><text class="sm" x="${f(rx(xb))}" y="282" text-anchor="middle">↓${f(xb, 2)}</text>`;
      th = ` · 올릴 때 문턱 X = ${f(xa, 2)}, 내릴 때 문턱 X = ${f(xb, 2)}`;
    } else th = ' · Δ ≤ √3 — 고리가 없다';
    t += `<line class="ln" style="opacity:.5" x1="${f(rx(X))}" y1="250" x2="${f(rx(X))}" y2="40"/>`;
    t += `<circle cx="${f(rx(X))}" cy="${f(ry(Math.min(cur, YMAX)))}" r="6.5" style="fill:var(--warm)"/>`;
    R.innerHTML = t;

    const nst = rs.filter(y => dX(y, D) > 0).length;
    $('b3-read').textContent = `안정한 상태 ${nst}개 · 지금 Y = ${f(cur, 2)}` + th;
  }

  function stop() { if (anim) cancelAnimationFrame(anim); anim = null; $('b3-up').disabled = $('b3-dn').disabled = false; }
  function sweep(to) {
    stop();
    $('b3-up').disabled = $('b3-dn').disabled = true;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let last = null;
    const step = ts => {
      if (last === null) last = ts;
      const dt = Math.min(ts - last, 50) / 1000; last = ts;
      const x = +sx.value, d = to - x, mv = (reduce ? 20 : 1.6) * dt;
      // 작은 걸음으로 나눠야 가지를 놓치지 않는다
      const n = Math.max(1, Math.ceil(Math.min(Math.abs(d), mv) / 0.02));
      for (let i = 0; i < n; i++) { sx.value = x + Math.sign(d) * Math.min(Math.abs(d), mv) * (i + 1) / n; pick(+sx.value, +sd.value); }
      lastX = +sx.value; draw();
      if (Math.abs(to - +sx.value) < 1e-9) { stop(); return; }
      anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }

  // 손으로 끌 때도 작은 걸음으로 따라간다
  lastX = +sx.value;
  sx.addEventListener('input', () => {
    stop();
    const x = +sx.value, n = Math.max(1, Math.ceil(Math.abs(x - lastX) / 0.02));
    for (let i = 1; i <= n; i++) pick(lastX + (x - lastX) * i / n, +sd.value);
    lastX = x; draw();
  });
  sd.addEventListener('input', () => { stop(); draw(); });
  $('b3-up').addEventListener('click', () => sweep(XMAX));
  $('b3-dn').addEventListener('click', () => sweep(0));
  draw();
})();
