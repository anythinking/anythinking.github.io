/* 유한차분 글의 그림들.
   그림 1: f = sin x 의 x0 에서 접선·전진 차분·중앙 차분 + h 에 대한 오차(로그 축, 실제 부동소수 계산).
   그림 2: 2계 차분(정적 SVG, 본문에 있음).
   그림 3: 막대 문제 상황과 얇은 토막의 열 균형(정적 SVG, 본문에 있음).
   그림 4: 막대 문제의 삼중대각 행렬.
   그림 5: 컴퓨터 속 기타줄 — 진짜 줄과 점으로 나눈 줄, 튕긴 세 모양, Δt 사진(정적).
   그림 6: 가운데 점 높이를 S = 1 · 0.9 · 1.05 에서 단계마다 따라간 세 칸(관성 + 끌림).
   그림 7: 1차원 파동 방정식 양해법(= 1차원 FDTD). 쿠랑 수 S 를 바꿔 안정·분산·폭발을 본다.
   그림 9: 수치 분산 — 파장당 점 수에 따른 속도 오차(로그)와 3차원 격자의 방향별 속도.
   그림 8: 1차원 Yee 격자(공간 × 시간)와 개구리 뜀 갱신. */
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
      // 목표값: x₀ 에서의 접선 기울기. 접선의 x₀ 근처를 짙게 칠해 「한 점의 기울기」를 보인다
      c += `<line x1="${f(lx(X0 - .3))}" y1="${f(ly(F(X0) - .3 * D))}" x2="${f(lx(X0 + .3))}" y2="${f(ly(F(X0) + .3 * D))}" style="stroke:var(--ink);stroke-width:3;stroke-linecap:round"/>`;
      c += `<text x="40" y="16" style="font-size:13px;font-weight:600">목표값: x₀에서의 기울기 f′(x₀) = ${f(D, 3)}</text>`;
      c += `<line x1="150" y1="${YL(0)}" x2="170" y2="${YL(0)}" style="stroke:var(--ink);stroke-width:3;stroke-linecap:round"/><text class="sm" x="176" y="${YL(0) + 4}">접선 = 진짜 기울기</text>`;
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

  /* ---------- 그림 4 ---------- */
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

  /* ---------- 그림 7 (시뮬레이션) ---------- */
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

  /* ---------- 그림 5 (컴퓨터 속 기타줄) ---------- */
  if ($('fd6')) {
    let g = '';
    const bead = (x, y, me) => `<circle cx="${f(x)}" cy="${f(y)}" r="${me ? 6.5 : 5}" fill="${me ? 'var(--warm)' : 'var(--ink)'}"/>`;
    const peg = (x, y) => `<rect x="${f(x - 3)}" y="${f(y - 9)}" width="6" height="18" fill="var(--muted)"/>`;
    // 점으로 나눈 줄 하나: 양 끝 고정, 점 n 개, 높이 함수 hf(j) (−1…1)
    function beadString(x0, x1, yc, amp, n, hf, opt = {}) {
      const dx = (x1 - x0) / (n + 1);
      let d = `M${f(x0)} ${f(yc)}`, b = '';
      for (let j = 1; j <= n; j++) {
        const x = x0 + j * dx, y = yc - amp * hf(j);
        d += ` L${f(x)} ${f(y)}`;
        b += bead(x, y, opt.me === j);
      }
      d += ` L${f(x1)} ${f(yc)}`;
      return `<line class="ln dim" x1="${f(x0)}" y1="${f(yc)}" x2="${f(x1)}" y2="${f(yc)}"/>` +
        `<path d="${d}" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>` + peg(x0, yc) + peg(x1, yc) + b;
    }

    // (a) 진짜 줄 → 점으로 나눈 줄
    g += `<text x="20" y="20" style="font-weight:600">(a) 진짜 줄 대신 점의 높이만 기억한다</text>`;
    {
      const yc = 82, amp = 34, L0 = 40, L1 = 280, R0 = 360, R1 = 600;
      let d = '';
      for (let i = 0; i <= 80; i++) { const x = L0 + (L1 - L0) * i / 80; d += (i ? 'L' : 'M') + f(x) + ' ' + f(yc - amp * Math.sin(Math.PI * i / 80)); }
      g += `<line class="ln dim" x1="${L0}" y1="${yc}" x2="${L1}" y2="${yc}"/><path d="${d}" style="fill:none;stroke:var(--ink);stroke-width:2"/>` + peg(L0, yc) + peg(L1, yc);
      g += `<text class="sm" x="${(L0 + L1) / 2}" y="${yc + 26}" text-anchor="middle">진짜 기타줄 — 매끈하게 이어짐</text>`;
      g += `<text x="320" y="${yc + 4}" text-anchor="middle" style="fill:var(--muted)">→</text>`;
      const n = 9, dx = (R1 - R0) / (n + 1);
      g += beadString(R0, R1, yc, amp, n, j => Math.sin(Math.PI * j / (n + 1)));
      g += `<line class="ln" x1="${f(R0 + 7 * dx)}" y1="${yc + 16}" x2="${f(R0 + 8 * dx)}" y2="${yc + 16}"/><line class="ln" x1="${f(R0 + 7 * dx)}" y1="${yc + 11}" x2="${f(R0 + 7 * dx)}" y2="${yc + 21}"/><line class="ln" x1="${f(R0 + 8 * dx)}" y1="${yc + 11}" x2="${f(R0 + 8 * dx)}" y2="${yc + 21}"/>`;
      g += `<text class="sm" x="${f(R0 + 7.5 * dx)}" y="${yc + 34}" text-anchor="middle">Δx</text>`;
      g += `<text class="sm" x="${f(R0 + 3 * dx)}" y="${yc + 26}" text-anchor="middle">컴퓨터 속 줄 — Δx마다 점 하나</text>`;
    }

    // (b) 튕긴 세 모양
    g += `<text x="20" y="150" style="font-weight:600">(b) 튕기는 모양 — 물결이 짧을수록 높은 음, 빨리 떤다</text>`;
    {
      const yc = 210, amp = 26, n = 9;
      [['낮은 음 · 활 하나', j => Math.sin(Math.PI * j / (n + 1)), '느리게 떤다'],
       ['높은 음 · 물결 셋', j => Math.sin(3 * Math.PI * j / (n + 1)), '빨리 떤다'],
       ['가장 짧은 물결 · 지그재그', j => (j % 2 ? 1 : -1), '가장 빨리 떤다']].forEach(([t, hf, sp], k) => {
        const x0 = 30 + k * 205, x1 = x0 + 180;
        g += beadString(x0, x1, yc, amp, n, hf);
        g += `<text class="sm" x="${(x0 + x1) / 2}" y="${yc + 50}" text-anchor="middle" style="fill:var(--ink)">${t}</text>`;
        g += `<text class="sm" x="${(x0 + x1) / 2}" y="${yc + 66}" text-anchor="middle">${sp}</text>`;
      });
    }

    // (c) Δt 마다 사진
    g += `<text x="20" y="306" style="font-weight:600">(c) 컴퓨터는 Δt마다 찍은 사진으로만 본다</text>`;
    {
      const yc = 362, amp = 20, n = 7, me = 4;
      ['직전', '지금', '다음'].forEach((t, k) => {
        const x0 = 50 + k * 205, x1 = x0 + 130, sgn = k === 1 ? 1 : -1;
        g += `<rect x="${x0 - 10}" y="${yc - 32}" width="${x1 - x0 + 20}" height="64" fill="none" stroke="var(--rule)"/>`;
        g += beadString(x0, x1, yc, amp, n, j => sgn * (j % 2 ? -1 : 1), { me });
        g += `<text class="sm" x="${(x0 + x1) / 2}" y="${yc - 38}" text-anchor="middle">${t} 사진</text>`;
        if (k < 2) g += `<text class="sm" x="${x1 + 37}" y="${yc + 4}" text-anchor="middle">Δt →</text>`;
      });
    }
    $('fd6-g').innerHTML = g;
  }

  /* ---------- 그림 6 (세 경우) ---------- */
  if ($('fd5')) {
    let g = '';
    // 아래: 세 경우. 단계 −1(직전) · 0(지금) · 1(다음) … 4
    const seq = S => { const b = 2 - 4 * S * S, a = [-1, 1]; for (let k = 0; k < 4; k++) a.push(b * a[a.length - 1] - a[a.length - 2]); return a; };
    const YMAX = 5, PY0 = 170, PY1 = 420, YC = (PY0 + PY1) / 2;
    [[1, '기본 상태 · S = 1', '−4', 'var(--probe)'], [0.9, 'S = 0.9', '−3.24', 'var(--probe)'], [1.05, 'S = 1.05', '−4.41', 'var(--warm)']].forEach(([S, title, pull, col], k) => {
      const x0 = 34 + k * 204, x1 = x0 + 186, a = seq(S), NT = a.length;
      const px = t => x0 + 16 + (x1 - x0 - 30) * (t + 1) / (NT - 1), py = v => YC - (PY1 - YC - 10) * v / YMAX;
      g += `<text x="${(x0 + x1) / 2}" y="${PY0 - 14}" text-anchor="middle">${title}</text>`;
      g += `<rect x="${x0}" y="${PY0}" width="${x1 - x0}" height="${PY1 - PY0}" fill="none" stroke="var(--rule)"/>`;
      g += `<line class="ln dim" x1="${x0}" y1="${f(py(0))}" x2="${x1}" y2="${f(py(0))}"/>`;
      [1, -1].forEach(v => { g += `<line x1="${x0}" y1="${f(py(v))}" x2="${x1}" y2="${f(py(v))}" style="stroke:var(--rule);stroke-dasharray:2 3"/>`; });
      if (k === 0) [3, 1, 0, -1].forEach(v => { g += `<text class="sm" x="${x0 - 4}" y="${f(py(v) + 4)}" text-anchor="end">${v > 0 ? '+' + v : v < 0 ? '−' + -v : 0}</text>`; });
      // 관성: 직전(−1)·지금(+1)을 이은 직선을 한 칸 늘린 +3
      g += `<line x1="${f(px(-1))}" y1="${f(py(-1))}" x2="${f(px(1))}" y2="${f(py(3))}" style="stroke:var(--muted);stroke-width:1.3;stroke-dasharray:4 3"/>`;
      g += `<circle cx="${f(px(1))}" cy="${f(py(3))}" r="4" fill="none" stroke="var(--muted)" stroke-width="1.5"/>`;
      g += `<text class="sm" x="${f(px(1))}" y="${f(py(3) - 9)}" text-anchor="middle">+3</text>`;
      g += `<text class="sm" x="${x0 + 8}" y="${PY0 + 18}">관성 +3 · <tspan style="fill:${col}">끌림 ${pull}</tspan></text>`;
      // 끌림: +3 에서 다음 높이까지
      const land = a[2];
      g += `<line x1="${f(px(1))}" y1="${f(py(3) + 5)}" x2="${f(px(1))}" y2="${f(py(land) - 7)}" style="stroke:${col};stroke-width:2"/>`;
      g += `<path d="M${f(px(1) - 4)} ${f(py(land) - 12)} L${f(px(1))} ${f(py(land) - 6)} L${f(px(1) + 4)} ${f(py(land) - 12)}" style="fill:none;stroke:${col};stroke-width:2"/>`;
      // 단계별 높이(직전·지금은 검은 점, 계산된 값은 색 점)
      let d = '';
      a.forEach((v, i) => { const vc = Math.max(-YMAX, Math.min(YMAX, v)); d += (i ? 'L' : 'M') + f(px(i - 1)) + ' ' + f(py(vc)); });
      g += `<path d="${d}" style="fill:none;stroke:${col};stroke-width:1.2;opacity:.45"/>`;
      a.forEach((v, i) => {
        const out = Math.abs(v) > YMAX, vc = Math.max(-YMAX, Math.min(YMAX, v));
        g += `<circle cx="${f(px(i - 1))}" cy="${f(py(vc))}" r="${i < 2 ? 3.5 : 4.5}" fill="${i < 2 ? 'var(--ink)' : col}"/>`;
        if (i === 0) g += `<text class="sm" x="${f(px(-1))}" y="${f(py(vc) + 17)}" text-anchor="middle">직전</text>`;
        if (i === 1) g += `<text class="sm" x="${f(px(0) - 6)}" y="${f(py(vc) - 8)}" text-anchor="end">지금</text>`;
        if (i >= 2) g += `<text class="sm" x="${f(px(i - 1))}" y="${f(py(vc) + (v > 0 ? -9 : 17))}" text-anchor="middle" style="fill:${col}">${i === 2 ? '다음 ' : ''}${out ? (v > 0 ? '↑' : '↓') : ''}${(v < 0 ? '−' : '+') + f(Math.abs(v), 2)}</text>`;
      });
    });
    $('fd5-g').innerHTML = g;
  }

  /* ---------- 그림 9 (수치 분산) ---------- */
  if ($('fd7')) {
    // 격자 위 물결이 실제보다 느린 비율. d = 진행 방향 단위벡터(성분 수 = 차원), N = 한 파장에 점 수
    const lag = (S, N, d) => {
      const k = 2 * Math.PI / N;
      let s = 0;
      for (const di of d) s += Math.sin(k * di / 2) ** 2;
      return 1 - 2 * Math.asin(S * Math.sqrt(s)) / (S * k);
    };
    const AX = [1, 0, 0], DG = [1, 1, 1].map(v => v / Math.sqrt(3)), D1 = [1];
    let g = '';

    // 왼쪽: 오차(%) vs 점 수, 로그-로그
    const X0 = 60, X1 = 300, Y0 = 240, Y1 = 34, N0 = 5, N1 = 40, E0 = -3, E1 = 1;
    const lx = N => X0 + (X1 - X0) * Math.log(N / N0) / Math.log(N1 / N0);
    const ly = e => Y0 - (Y0 - Y1) * (Math.log10(Math.max(e, 10 ** E0)) - E0) / (E1 - E0);
    g += `<text x="${(X0 + X1) / 2}" y="16" text-anchor="middle">한 파장에 찍은 점 수와 속도 오차</text>`;
    g += axes(X0, X1, Y0, Y1, '', '느린 정도 (%)');
    g += `<text class="sm" x="${X1}" y="${Y0 + 32}" text-anchor="end">한 파장에 점 →</text>`;
    [5, 10, 20, 40].forEach(N => { g += `<text class="sm" x="${f(lx(N))}" y="${Y0 + 15}" text-anchor="middle">${N}</text>`; });
    [-3, -2, -1, 0, 1].forEach(t => { g += `<text class="sm" x="${X0 - 5}" y="${f(ly(10 ** t) + 4)}" text-anchor="end">${['0.001', '0.01', '0.1', '1', '10'][t + 3]}</text>`; });
    const curves = [
      [1, AX, 0.5, 'var(--beam)', '3차원 축 · S = 0.5 (= 1차원 S = 0.5)', 0],
      [2, AX, 0.99 / Math.sqrt(3), 'var(--warm)', '3차원 축 · S = 0.57', 0],
      [3, DG, 0.5, 'var(--probe)', '3차원 대각선 · S = 0.5', 0],
      [4, D1, 0.99, 'var(--muted)', '1차원 · S = 0.99', 1]];
    curves.forEach(([, d, S, col, , dash]) => {
      let p = '';
      for (let i = 0; i <= 60; i++) { const N = N0 * (N1 / N0) ** (i / 60); p += (i ? 'L' : 'M') + f(lx(N)) + ' ' + f(ly(100 * lag(S, N, d))); }
      g += `<path d="${p}" style="fill:none;stroke:${col};stroke-width:2${dash ? ';stroke-dasharray:5 4' : ''}"/>`;
    });
    // 범례 대신 선 끝에 이름을 붙인다
    [[AX, 0.5, 'var(--beam)', '축 · S = 0.5', -6], [AX, 0.99 / Math.sqrt(3), 'var(--warm)', '축 · S = 0.57', 12], [DG, 0.5, 'var(--probe)', '대각선 · S = 0.5', 4], [D1, 0.99, 'var(--muted)', '1차원 · S = 0.99', 4]].forEach(([d, S, col, t, dy]) => {
      g += `<text class="sm" x="${f(lx(N1) + 4)}" y="${f(ly(100 * lag(S, N1, d)) + dy)}" style="fill:${col}">${t}</text>`;
    });

    // 오른쪽: 방향별 속도 (한 평면, N = 10, S = 0.5, 차이 20배 확대)
    const CX = 505, CY = 150, R = 95, AMP = 20, Np = 10, Sp = 0.5;
    g += `<text x="${CX}" y="16" text-anchor="middle">방향에 따른 격자 위 속도 (차이 20배)</text>`;
    g += `<circle cx="${CX}" cy="${CY}" r="${R}" style="fill:none;stroke:var(--muted);stroke-dasharray:4 4"/>`;
    g += `<line class="ln dim" x1="${CX - R - 18}" y1="${CY}" x2="${CX + R + 18}" y2="${CY}"/><line class="ln dim" x1="${CX}" y1="${CY - R - 18}" x2="${CX}" y2="${CY + R + 18}"/>`;
    let pp = '';
    for (let i = 0; i <= 180; i++) {
      const th = 2 * Math.PI * i / 180, d = [Math.cos(th), Math.sin(th), 0];
      const r = R * (1 - AMP * lag(Sp, Np, d));
      pp += (i ? 'L' : 'M') + f(CX + r * Math.cos(th)) + ' ' + f(CY - r * Math.sin(th));
    }
    g += `<path d="${pp}" style="fill:none;stroke:var(--beam);stroke-width:2"/>`;
    const rAx = R * (1 - AMP * lag(Sp, Np, [1, 0, 0])), dDg = [Math.SQRT1_2, Math.SQRT1_2, 0], rDg = R * (1 - AMP * lag(Sp, Np, dDg));
    g += `<text class="sm" x="${CX + R + 20}" y="${CY - 6}">x 축</text><text class="sm" x="${CX + 6}" y="${CY - R - 8}">y 축</text>`;
    g += `<circle cx="${f(CX + rAx)}" cy="${CY}" r="3.5" fill="var(--beam)"/><text class="sm" x="${f(CX + rAx - 6)}" y="${CY + 16}" text-anchor="end" style="fill:var(--beam)">축 방향 ${f(100 * lag(Sp, Np, [1, 0, 0]), 2)} % 느림</text>`;
    g += `<circle cx="${f(CX + rDg * Math.SQRT1_2)}" cy="${f(CY - rDg * Math.SQRT1_2)}" r="3.5" fill="var(--beam)"/><text class="sm" x="${f(CX + rDg * Math.SQRT1_2 - 8)}" y="${f(CY - rDg * Math.SQRT1_2 + 16)}" text-anchor="end" style="fill:var(--beam)">대각선 ${f(100 * lag(Sp, Np, dDg), 2)} % 느림</text>`;
    g += `<text class="sm" x="${f(CX - R * Math.SQRT1_2 - 6)}" y="${f(CY + R * Math.SQRT1_2 + 14)}" text-anchor="end">진짜 속도 c (점선)</text>`;
    g += `<text class="sm" x="${CX}" y="${CY + R + 34}" text-anchor="middle">한 파장에 10점 · S = 0.5</text>`;
    $('fd7-g').innerHTML = g;
  }

  /* ---------- 그림 8 ---------- */
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
