/* 유한차분 글의 그림들.
   그림 1: f = sin x 의 x0 에서 접선·전진 차분·중앙 차분 + h 에 대한 오차(로그 축, 실제 부동소수 계산).
   그림 2: 막대 문제의 삼중대각 행렬.
   그림 3: 1차원 파동 방정식 양해법(= 1차원 FDTD). 쿠랑 수 S 를 바꿔 안정·분산·폭발을 본다.
   그림 4: 1차원 Yee 격자(공간 × 시간)와 개구리 뜀 갱신. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const f = (n, d = 1) => (+n).toFixed(d);
  const ex = v => v === 0 ? '0' : v.toExponential(1).replace('e', '×10^').replace(/\^\+?(-?\d+)/, (m, p) => sup(p));
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function sup(s) { return String(s).split('').map(c => SUP[c] || c).join(''); }
  function axes(x0, x1, y0, y1, xl, yl) {
    return `<line class="ln" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/><line class="ln" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/>` +
      `<text class="sm" x="${x1}" y="${y0 + 20}" text-anchor="end">${xl}</text><text class="sm" x="${x0 + 6}" y="${y1 + 8}">${yl}</text>`;
  }

  /* ---------- 그림 1 ---------- */
  if ($('fd1')) {
    const L = $('fd1-l'), R = $('fd1-r'), sh = $('fd1-h');
    const X0 = 1.2, F = Math.sin, D = Math.cos(X0);
    const XA = -0.5, XB = 2.4, YA = -0.7, YB = 1.25;
    const YL = k => 200 + 16 * k;
    const lx = x => 40 + (x - XA) / (XB - XA) * 260, ly = y => 250 - (y - YA) / (YB - YA) * 215;
    const fwd = h => (F(X0 + h) - F(X0)) / h, cen = h => (F(X0 + h) - F(X0 - h)) / (2 * h);
    // 오른쪽: log10 h ∈ [-6, 0], log10 err ∈ [-16, 0]
    const rx = s => 370 + (s + 6) / 6 * 245, ry = e => 250 - (Math.log10(Math.max(e, 1e-17)) + 16) / 16 * 215;
    function line(x1, y1, slope, cls) {
      // 왼쪽 판 범위 안에서 기울기 slope 직선을 그린다
      const a = XA, b = XB, ya = y1 + slope * (a - x1), yb = y1 + slope * (b - x1);
      return `<line class="${cls}" x1="${f(lx(a))}" y1="${f(ly(ya))}" x2="${f(lx(b))}" y2="${f(ly(yb))}"/>`;
    }
    // 오차 곡선은 h 에 무관하니 한 번만 만든다
    let curves = '';
    [['fwd', fwd, 'mk-beam'], ['cen', cen, 'mk-warm']].forEach(([, g, cls]) => {
      let p = '';
      for (let i = 0; i <= 240; i++) { const s = -6 + 6 * i / 240, e = Math.abs(g(10 ** s) - D); p += (i ? 'L' : 'M') + f(rx(s)) + ' ' + f(ry(e)); }
      curves += `<path class="${cls}" d="${p}"/>`;
    });
    function draw() {
      const s = +sh.value, h = 10 ** s;
      $('fd1-ho').textContent = h >= 0.01 ? f(h, 2) : ex(h);
      let c = `<clipPath id="fd1-c"><rect x="40" y="35" width="260" height="215"/></clipPath>`;
      c += axes(40, 300, 250, 30, 'x →', 'f(x) = sin x');
      let p = '';
      for (let i = 0; i <= 200; i++) { const x = XA + (XB - XA) * i / 200; p += (i ? 'L' : 'M') + f(lx(x)) + ' ' + f(ly(F(x))); }
      c += `<g clip-path="url(#fd1-c)"><path class="br" d="${p}"/>`;
      // 연장선은 옅게, 실제로 쓴 두 점 사이 구간(할선)은 굵게
      c += line(X0, F(X0), D, 'mk-ink').replace('/>', ' style="stroke-dasharray:5 4"/>');
      c += line(X0, F(X0), fwd(h), 'mk-beam').replace('/>', ' opacity=".35"/>');
      c += line(X0 - h, F(X0 - h), cen(h), 'mk-warm').replace('/>', ' opacity=".35"/>');
      const seg = (xa, xb, col, dy) => `<line x1="${f(lx(xa))}" y1="${f(ly(F(xa)) + dy)}" x2="${f(lx(xb))}" y2="${f(ly(F(xb)) + dy)}" style="stroke:${col};stroke-width:3.5;stroke-linecap:round"/>`;
      c += seg(X0, X0 + h, 'var(--beam)', 0) + seg(X0 - h, X0 + h, 'var(--warm)', 0) + '</g>';
      c += `<circle cx="${f(lx(X0))}" cy="${f(ly(F(X0)))}" r="5" fill="var(--ink)"/>`;
      [[X0 - h, 'var(--warm)', 'x₀−h'], [X0 + h, 'var(--beam)', 'x₀+h']].forEach(([x, col, t]) => {
        if (x > XA && x < XB) {
          c += `<circle cx="${f(lx(x))}" cy="${f(ly(F(x)))}" r="5" fill="${col}"/>`;
          if (h > 0.12) c += `<text class="sm" x="${f(lx(x))}" y="${f(ly(F(x)) + 20)}" text-anchor="middle">${t}</text>`;
        }
      });
      c += `<text class="sm" x="${f(lx(X0))}" y="${f(ly(F(X0)) + 20)}" text-anchor="middle">x₀</text>`;
      c += `<line x1="150" y1="${YL(0)}" x2="170" y2="${YL(0)}" class="mk-ink" style="stroke-dasharray:5 4"/><text class="sm" x="176" y="${YL(0) + 4}">접선 = 진짜 기울기</text>`;
      c += `<line x1="150" y1="${YL(1)}" x2="170" y2="${YL(1)}" style="stroke:var(--beam);stroke-width:3.5"/><text class="sm" x="176" y="${YL(1) + 4}">전진: x₀ → x₀+h</text>`;
      c += `<line x1="150" y1="${YL(2)}" x2="170" y2="${YL(2)}" style="stroke:var(--warm);stroke-width:3.5"/><text class="sm" x="176" y="${YL(2) + 4}">중앙: x₀−h → x₀+h</text>`;
      L.innerHTML = c;

      let r = axes(370, 615, 250, 30, '', '오차(로그)') + `<text class="sm" x="615" y="286" text-anchor="end">간격 h (로그) →</text>`;
      [-6, -4, -2, 0].forEach(t => { r += `<text class="sm" x="${f(rx(t))}" y="266" text-anchor="middle">10${sup(t)}</text>`; });
      [-16, -12, -8, -4, 0].forEach(t => { r += `<text class="sm" x="365" y="${f(ry(10 ** t) + 4)}" text-anchor="end">10${sup(t)}</text>`; });
      r += curves;
      r += `<text class="sm" x="${f(rx(-3.2))}" y="${f(ry(3e-4) - 12)}" style="fill:var(--beam)">기울기 1</text>`;
      r += `<text class="sm" x="${f(rx(-2.3))}" y="${f(ry(1e-6) + 22)}" style="fill:var(--warm)">기울기 2</text>`;
      r += `<line class="ln dim" x1="${f(rx(s))}" y1="30" x2="${f(rx(s))}" y2="250"/>`;
      const ef = Math.abs(fwd(h) - D), ec = Math.abs(cen(h) - D);
      r += `<circle cx="${f(rx(s))}" cy="${f(ry(ef))}" r="4" fill="var(--beam)"/><circle cx="${f(rx(s))}" cy="${f(ry(ec))}" r="4" fill="var(--warm)"/>`;
      R.innerHTML = r;
      $('fd1-read').textContent = `기울기 — 진짜 ${f(D, 3)} · 전진 ${f(fwd(h), 3)} · 중앙 ${f(cen(h), 3)}  |  오차 — 전진 ${ex(ef)} · 중앙 ${ex(ec)}`;
    }
    sh.addEventListener('input', draw);
    draw();
  }

  /* ---------- 그림 2 ---------- */
  if ($('fd2-m')) {
    let m = '';
    const x0 = 418, y0 = 62, c = 28;
    for (let k = 0; k < 5; k++) m += `<text class="sm" x="${x0 + k * c + c / 2}" y="${y0 - 8}" text-anchor="middle">T${'₁₂₃₄₅'[k]}</text>`;
    for (let r = 0; r < 5; r++) {
      m += `<text class="sm" x="${x0 - 8}" y="${y0 + r * c + 18}" text-anchor="end">점 ${r + 1} 식</text>`;
      for (let k = 0; k < 5; k++) {
        const v = r === k ? '−2' : Math.abs(r - k) === 1 ? '1' : '0';
        const on = v !== '0', hl = r === 2 && on;
        m += `<rect x="${x0 + k * c}" y="${y0 + r * c}" width="${c}" height="${c}" ${on ? `class="cell${hl ? ' hl' : ''}"` : 'fill="none" stroke="var(--rule)"'}/>`;
        m += `<text ${hl ? 'class="hlt"' : on ? '' : 'class="sm" opacity=".45"'} x="${x0 + k * c + c / 2}" y="${y0 + r * c + 18}" text-anchor="middle">${v}</text>`;
      }
      m += `<text class="sm" x="${x0 + 5 * c + 8}" y="${y0 + r * c + 18}">= −h²q/k</text>`;
    }
    $('fd2-m').innerHTML = m;
  }

  /* ---------- 그림 3 ---------- */
  if ($('fd3')) {
    const G = $('fd3-g'), ss = $('fd3-s'), run = $('fd3-run');
    const N = 241, X0 = 30, X1 = 610, YC = 140, AMP = 90;
    let u, up, n, S, timer = null, dead = false;
    const px = i => X0 + (X1 - X0) * i / (N - 1);
    function reset() {
      S = +ss.value; n = 0; dead = false;
      up = new Float64Array(N); u = new Float64Array(N);
      const c = (N - 1) / 2, w = 1.5;
      for (let i = 1; i < N - 1; i++) up[i] = Math.exp(-((i - c) ** 2) / (2 * w * w));
      // 정지 상태에서 출발: 첫 단계는 u¹ = u⁰ + S²/2 · (이웃 차분)
      for (let i = 1; i < N - 1; i++) u[i] = up[i] + 0.5 * S * S * (up[i + 1] - 2 * up[i] + up[i - 1]);
      n = 1;
      $('fd3-so').textContent = f(S, 2);
      draw();
    }
    function step() {
      const nx = new Float64Array(N), s2 = S * S;
      for (let i = 1; i < N - 1; i++) nx[i] = 2 * u[i] - up[i] + s2 * (u[i + 1] - 2 * u[i] + u[i - 1]);
      up = u; u = nx; n++;
    }
    function draw() {
      let mx = 0;
      for (let i = 0; i < N; i++) mx = Math.max(mx, Math.abs(u[i]));
      let g = `<line class="ln dim" x1="${X0}" y1="${YC}" x2="${X1}" y2="${YC}"/>`;
      g += `<line class="ln" x1="${X0}" y1="30" x2="${X0}" y2="250"/><line class="ln" x1="${X1}" y1="30" x2="${X1}" y2="250"/>`;
      g += `<text class="sm" x="${X0 + 4}" y="26">고정 끝</text><text class="sm" x="${X1 - 4}" y="26" text-anchor="end">고정 끝</text>`;
      let p = '';
      for (let i = 0; i < N; i++) {
        const y = Math.max(22, Math.min(258, YC - AMP * u[i]));
        p += (i ? 'L' : 'M') + f(px(i)) + ' ' + f(y);
      }
      g += `<path class="light${mx > 1.5 ? ' hl' : ''}" d="${p}"/>`;
      G.innerHTML = g;
      if (mx > 1e6) dead = true;
      $('fd3-read').textContent = `단계 ${n} · 최대 |u| = ${mx < 1000 ? f(mx, 3) : ex(mx)}` + (dead ? ' · 폭발' : S > 1 ? ' · S > 1' : '');
    }
    function stop() { if (timer) cancelAnimationFrame(timer); timer = null; run.setAttribute('aria-pressed', 'false'); run.textContent = '재생'; }
    function loop() {
      step(); draw();
      if (dead || n > 2000) { stop(); return; }
      timer = requestAnimationFrame(loop);
    }
    run.addEventListener('click', () => {
      if (timer) { stop(); return; }
      if (dead || n > 2000) reset();
      run.setAttribute('aria-pressed', 'true'); run.textContent = '멈춤';
      timer = requestAnimationFrame(loop);
    });
    $('fd3-reset').addEventListener('click', () => { stop(); reset(); });
    ss.addEventListener('input', () => { const was = !!timer; stop(); reset(); if (was) run.click(); });
    reset();
  }

  /* ---------- 그림 4 ---------- */
  if ($('fd4-g')) {
    const ex0 = 110, dx = 90, rows = { 0: 236, 0.5: 190, 1: 144, 1.5: 98, 2: 52 };
    const X = i => ex0 + i * dx;
    let g = `<defs><marker id="fd4-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--probe)"/></marker></defs>`;
    g += `<text class="sm" x="636" y="262" text-anchor="end">공간 x →</text><text class="sm" x="16" y="30">시간 t ↑</text>`;
    const lab = { 0: 'n', 0.5: 'n+½', 1: 'n+1', 1.5: 'n+1½', 2: 'n+2' };
    Object.keys(rows).forEach(k => {
      g += `<line class="ln dim" x1="${X(0) - 20}" y1="${rows[k]}" x2="${X(5) + 20}" y2="${rows[k]}"/>`;
      g += `<text class="sm" x="${X(0) - 30}" y="${rows[k] + 4}" text-anchor="end">${lab[k]}</text>`;
    });
    function arrow(x1, y1, x2, y2) {
      const t = 0.78, ax = x1 + (x2 - x1) * 0.12, ay = y1 + (y2 - y1) * 0.12;
      return `<line style="stroke:var(--probe);stroke-width:2" x1="${f(ax)}" y1="${f(ay)}" x2="${f(x1 + (x2 - x1) * t)}" y2="${f(y1 + (y2 - y1) * t)}" marker-end="url(#fd4-a)"/>`;
    }
    // 강조: E(3, n+2) ← H(2.5, n+1½), H(3.5, n+1½) · H(1.5, n+½) ← E(1, n), E(2, n)
    g += arrow(X(2.5), rows[1.5], X(3), rows[2]) + arrow(X(3.5), rows[1.5], X(3), rows[2]);
    g += arrow(X(1), rows[0], X(1.5), rows[0.5]) + arrow(X(2), rows[0], X(1.5), rows[0.5]);
    [0, 1, 2].forEach(t => { for (let i = 0; i <= 5; i++) g += `<circle cx="${X(i)}" cy="${rows[t]}" r="7" fill="var(--beam)"/>`; });
    [0.5, 1.5].forEach(t => { for (let i = 0; i < 5; i++) g += `<rect x="${X(i + 0.5) - 6.5}" y="${rows[t] - 6.5}" width="13" height="13" fill="var(--warm)"/>`; });
    for (let i = 0; i <= 5; i++) g += `<text class="sm" x="${X(i)}" y="262" text-anchor="middle">${i ? 'i+' + i : 'i'}</text>`;
    g += `<circle cx="${X(0) + 380}" cy="18" r="6" fill="var(--beam)"/><text class="sm" x="${X(0) + 392}" y="22">E (정수 칸·정수 시각)</text>`;
    g += `<rect x="${X(0) + 194}" y="12" width="12" height="12" fill="var(--warm)"/><text class="sm" x="${X(0) + 212}" y="22">H (반 칸·반 시각)</text>`;
    $('fd4-g').innerHTML = g;
  }
})();
