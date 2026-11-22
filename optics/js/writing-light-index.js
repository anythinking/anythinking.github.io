/* 「빛은 어떻게 물질의 굴절률을 바꿀까?」의 움직이는 그림 넷.
   모두 화면에 보일 때만 돈다(IntersectionObserver + visibilitychange). 움직임 줄이기 설정이면 한 장면만 그린다. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const f = (n, d = 1) => (+n).toFixed(d);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 공통: 보일 때만 frame(dt)를 부른다. 멈추기 단추(id)도 여기서 묶는다.
  function loop(id, btnId, frame) {
    const el = $(id), btn = $(btnId);
    if (!el) return;
    let seen = false, want = !reduce, run = false, last = null;
    const tick = ts => {
      if (!run) { last = null; return; }
      const dt = last === null ? 0 : Math.min(ts - last, 50) / 1000;
      last = ts; frame(dt);
      requestAnimationFrame(tick);
    };
    const sync = () => { const go = want && seen && !document.hidden; if (go !== run) { run = go; if (go) requestAnimationFrame(tick); } };
    const label = () => { if (btn) { btn.textContent = want ? '멈추기' : '재생'; btn.setAttribute('aria-pressed', String(!want)); } };
    if (btn) btn.addEventListener('click', () => { want = !want; label(); sync(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { seen = es[0].isIntersecting; sync(); }, { rootMargin: '100px' }).observe(el);
    else seen = true;
    document.addEventListener('visibilitychange', sync);
    label(); frame(0);
    return { redraw: () => { if (!run) frame(0); } };
  }

  /* 그림 1·7: 빛의 전기장이 전하를 흔들고, 다시 나온 빛이 원래 빛에 더해진다.
     묶인 전자(그림 1)는 전기장과 반대쪽으로 밀리고 나가는 빛이 늦어진다(굴절률 ↑).
     자유 전자(그림 7)는 전기장과 같은 쪽으로 움직이고 나가는 빛이 앞당겨진다(굴절률 ↓).
     화살표는 원자 자리(AX)의 전기장 값이라, 들어오는 파동을 AX까지 그리면 화살표 끝이 늘 파동 위에 놓인다. */
  function atomFig(id, free) {
    const G = $(id + '-g');
    if (!G) return;
    const K = 2 * Math.PI / 120, W = 2 * Math.PI * 0.55, A = 38, Y0 = 118, AX = 320, D = free ? -0.8 : 0.8;
    let t = 0.4;
    // d > 0 이면 늦게 도착한 파동(마루가 왼쪽으로 밀림)
    const field = (x, d) => Math.sin(K * x - W * t + d);
    const wave = (x0, x1, d) => {
      let p = '';
      for (let x = x0; x <= x1; x += 3) p += (x === x0 ? 'M' : 'L') + x + ' ' + f(Y0 - A * field(x, d));
      return p;
    };
    loop(id, id + '-p', dt => {
      t += dt;
      const e = field(AX, 0), tip = Y0 - A * e;
      let s = '';
      s += `<line class="ln dim" x1="20" y1="${Y0}" x2="620" y2="${Y0}"/>`;
      s += `<text class="sm" x="20" y="24">들어오는 빛 (전기장)</text>`;
      s += `<path class="light" style="stroke-width:2.2" d="${wave(20, AX, 0)}"/>`;
      if (free) {
        s += `<circle cx="${AX}" cy="${f(Y0 - 14 * e)}" r="7" style="fill:var(--ui)"/>`;
      } else {
        s += `<ellipse cx="${AX}" cy="${f(Y0 + 16 * e)}" rx="26" ry="30" style="fill:var(--ui);opacity:.28"/>`;
        s += `<circle cx="${AX}" cy="${Y0}" r="4" style="fill:var(--ink)"/>`;
      }
      // 원자 자리의 전기장 화살표
      if (Math.abs(e) > 0.08) {
        const dir = e > 0 ? -1 : 1;
        s += `<line class="light" style="stroke-width:2.6" x1="${AX}" y1="${Y0}" x2="${AX}" y2="${f(tip - dir * 6)}"/>`;
        s += `<path style="fill:var(--beam)" d="M${AX - 6} ${f(tip - dir * 8)} L${AX} ${f(tip)} L${AX + 6} ${f(tip - dir * 8)} Z"/>`;
      }
      s += `<circle cx="${AX}" cy="${f(tip)}" r="3" style="fill:var(--beam)"/>`;
      s += `<text class="sm" x="${AX}" y="182" text-anchor="middle">${free ? '자유 전자' : '원자'}</text>`;
      s += `<text class="sm" x="${AX}" y="198" text-anchor="middle">${free ? '전기장과 같은 쪽으로 흔들린다' : '전자구름이 전기장과 반대쪽으로'}</text>`;
      // 나가는 빛: 점선은 물질이 없었을 때, 실선은 실제
      s += `<path class="ln" style="stroke-dasharray:5 4" d="${wave(350, 620, 0)}"/>`;
      s += `<path class="light hl" d="${wave(380, 620, D)}"/>`;
      s += `<text class="sm" x="620" y="24" text-anchor="end">- - 물질이 없었다면</text>`;
      s += `<text class="hlt" x="620" y="210" text-anchor="end">${free ? '— 실제: 위상이 앞섬 → 굴절률 ↓' : '— 실제: 위상이 늦음 → 느려 보임 (굴절률)'}</text>`;
      G.innerHTML = s;
    });
  }
  atomFig('li1', false);
  atomFig('li1b', true);

  /* 그림 5: 링 단면의 열 확산. 열전도율 상대값만 반영한 개념 계산(실리콘 ≫ 산화막 ≫ 공기).
     위 끝(멀리 있는 공기)과 아래 끝(기판 바닥)은 실온으로 고정. */
  (function () {
    const G = $('li3-g');
    if (!G) return;
    const NX = 40, NY = 18, C = 7, PY = 50, PX = [24, 336];
    const KM = { si: 1, ox: 0.05, air: 0.003 }, CM = { si: 1, ox: 1, air: 0.05 };
    const core = (i, j) => (j === 6 || j === 7) && ((i >= 8 && i <= 11) || (i >= 28 && i <= 31));
    function mat(p, i, j) {
      if (j <= 5) return 'air';
      if (j <= 7) return core(i, j) ? 'si' : 'air';
      if (j <= 11) return p === 0 || i <= 3 || i >= 36 ? 'ox' : 'air';
      return 'si';
    }
    const P = [0, 1].map(p => {
      const m = [], T = new Float64Array(NX * NY), N = new Float64Array(NX * NY);
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) m.push(mat(p, i, j));
      return { m, T, N };
    });
    const kk = (a, b) => { const x = KM[a], y = KM[b]; return 2 * x * y / (x + y); };
    const DT = 0.2, Q = 0.02, STEPS = 24;
    function step(on) {
      for (const pn of P) {
        const { m, T, N } = pn;
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const n = j * NX + i;
          if (j === 0 || j === NY - 1) { N[n] = 0; continue; }
          let s = 0;
          if (i > 0) s += kk(m[n], m[n - 1]) * (T[n - 1] - T[n]);
          if (i < NX - 1) s += kk(m[n], m[n + 1]) * (T[n + 1] - T[n]);
          s += kk(m[n], m[n - NX]) * (T[n - NX] - T[n]);
          s += kk(m[n], m[n + NX]) * (T[n + NX] - T[n]);
          N[n] = T[n] + DT * (s / CM[m[n]] + (on && core(i, j) ? Q : 0));
        }
        pn.T.set(N);
      }
    }
    const coreT = pn => { let s = 0, c = 0; for (let j = 6; j <= 7; j++) for (let i = 0; i < NX; i++) if (core(i, j)) { s += pn.T[j * NX + i]; c++; } return s / c; };

    // 고정된 부분(재료 칠·이름)은 한 번만 만든다
    const COL = { si: 'fill:var(--muted);opacity:.32', ox: 'fill:var(--probetint)', air: 'fill:none' };
    let base = '';
    const TITLE = ['열이 잘 빠지는 링 — 산화막 위', '열이 갇힌 링 — 밑을 파냄'];
    const SUB = ['덜 데워짐 · 빨리 식음', '많이 데워짐 · 천천히 식음'];
    P.forEach((pn, p) => {
      const x0 = PX[p];
      base += `<text x="${x0 + NX * C / 2}" y="18" text-anchor="middle">${TITLE[p]}</text>`;
      base += `<text class="${p ? 'hlt' : 'sm'}" x="${x0 + NX * C / 2}" y="38" text-anchor="middle">${SUB[p]}</text>`;
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
        const mm = pn.m[j * NX + i];
        if (mm !== 'air') base += `<rect x="${x0 + i * C}" y="${PY + j * C}" width="${C}" height="${C}" style="${COL[mm]}"/>`;
      }
      base += `<rect x="${x0}" y="${PY}" width="${NX * C}" height="${NY * C}" style="fill:none;stroke:var(--rule)"/>`;
      base += `<text class="sm" x="${x0 + 4}" y="${PY + 14}">공기</text>`;
      base += `<text class="sm" x="${x0 + 4}" y="${PY + 12 * C + 16}">실리콘 기판 — 열이 빠지는 곳</text>`;
      base += `<text class="sm" x="${x0 + NX * C / 2}" y="${PY + 10 * C + 4}" text-anchor="middle">${p === 0 ? '산화막' : '공기층'}</text>`;
    });
    // 히트맵 칸
    let heat = '';
    P.forEach((pn, p) => {
      for (let j = 1; j < NY - 1; j++) for (let i = 0; i < NX; i++)
        heat += `<rect id="li3-h${p}-${j * NX + i}" x="${PX[p] + i * C}" y="${PY + j * C}" width="${C}" height="${C}" style="fill:var(--warm)" fill-opacity="0"/>`;
    });
    let cores = '';
    P.forEach((pn, p) => [8, 28].forEach(i => { cores += `<rect class="li3-core" x="${PX[p] + i * C}" y="${PY + 6 * C}" width="${4 * C}" height="${2 * C}" style="fill:none;stroke:var(--ink);stroke-width:1.2"/>`; }));
    G.innerHTML = base + `<g>${heat}</g>` + cores + '<g id="li3-dyn"></g>';
    const cells = P.map((pn, p) => { const a = []; for (let n = 0; n < NX * NY; n++) a.push(document.getElementById(`li3-h${p}-${n}`)); return a; });
    const dyn = $('li3-dyn'), read = $('li3-read'), lb = $('li3-l');

    let mode = 'auto', t = 0, hist = [];
    const MODES = { auto: '빛 켜고 끄기 — 자동', on: '빛 — 켜 둠', off: '빛 — 꺼 둠' };
    lb.addEventListener('click', () => { mode = mode === 'auto' ? 'on' : mode === 'on' ? 'off' : 'auto'; lb.textContent = MODES[mode]; });
    const SCALE = 4, WIN = 14, PER = 11;
    if (reduce) { for (let k = 0; k < 4000; k++) step(true); }

    loop('li3', 'li3-p', dt => {
      t += dt;
      const on = mode === 'on' || (mode === 'auto' && (t % PER) < 6) || (reduce && mode !== 'off');
      const n = dt > 0 ? STEPS : 0;
      for (let k = 0; k < n; k++) step(on);
      P.forEach((pn, p) => { for (let j = 1; j < NY - 1; j++) for (let i = 0; i < NX; i++) { const q = j * NX + i, el = cells[p][q]; if (el) el.setAttribute('fill-opacity', f(Math.min(1, Math.max(0, pn.T[q]) / SCALE), 2)); } });
      const ta = coreT(P[0]), tb = coreT(P[1]);
      if (dt > 0) { hist.push([t, ta, tb, on]); while (hist.length && hist[0][0] < t - WIN) hist.shift(); }

      // 시간 기록: 두 링의 온도
      const x0 = 24, x1 = 616, y0 = 290, y1 = 200, tm = Math.max(SCALE * 2.5, ...hist.map(h => h[2]));
      const tx = q => x0 + (q - (t - WIN)) / WIN * (x1 - x0), ty = v => y0 - Math.min(v, tm) / tm * (y0 - y1);
      let d = '';
      let segA = null;
      const band = (a, b) => `<rect x="${f(tx(a))}" y="${y1}" width="${f(tx(b) - tx(a))}" height="${y0 - y1}" style="fill:var(--beam);opacity:.08"/>`;
      hist.forEach((h, i) => { if (h[3] && segA === null) segA = h[0]; if (!h[3] && segA !== null) { d += band(segA, h[0]); segA = null; } });
      if (segA !== null && hist.length) d += band(segA, hist[hist.length - 1][0]);
      d += `<line class="ln" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/><line class="ln" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/>`;
      if (hist.length > 1) {
        d += `<path class="light" style="stroke-width:2" d="${hist.map((h, i) => (i ? 'L' : 'M') + f(tx(h[0])) + ' ' + f(ty(h[1]))).join('')}"/>`;
        d += `<path class="light hl" d="${hist.map((h, i) => (i ? 'L' : 'M') + f(tx(h[0])) + ' ' + f(ty(h[2]))).join('')}"/>`;
      }
      d += `<text class="sm" x="${x0 + 6}" y="${y1 + 2}">링 온도 상승 (옅은 붉은 띠 = 빛 켜짐)</text>`;
      d += `<text x="380" y="${y1 + 2}" style="fill:var(--beam)">— 산화막 위</text><text class="hlt" x="470" y="${y1 + 2}">— 띄운 링</text>`;
      P.forEach((pn, p) => [8, 28].forEach(i => { d += `<rect x="${PX[p] + i * C - 1}" y="${PY + 6 * C - 1}" width="${4 * C + 2}" height="${2 * C + 2}" style="fill:none;stroke:var(--beam);stroke-width:2;opacity:${on ? .9 : 0}"/>`; }));
      dyn.innerHTML = d;
      read.textContent = (on ? '빛 켜짐' : '빛 꺼짐') + (ta > 0.3 ? ` · 이 개념 계산에서 띄운 링이 ${f(tb / ta, 1)}배 더 데워짐` : '');
    });
  })();

  /* 그림 6: 실리콘 두 광자 흡수 → 전자·정공 → 굴절률 ↓ · 흡수 ↑ */
  (function () {
    const G = $('li4-g');
    if (!G) return;
    const si = $('li4-i'), drain = $('li4-d');
    const CB = [40, 90], VB = [210, 250], PH = 86, XL = 130, XR = 350;
    let ev = [], car = [], pin = false, acc = 0, sm = 0;
    const tauN = 4, tauP = 0.5, V = 90;
    drain.addEventListener('click', () => { pin = !pin; drain.setAttribute('aria-pressed', String(pin)); });
    const out = () => { $('li4-io').textContent = f(+si.value, 2); };
    const L = loop('li4', 'li4-p', dt => {
      const I = +si.value;
      out();
      // 생기는 빈도 ∝ 세기² (광자 둘이 동시에 있어야 하므로)
      acc += dt * 3.2 * I * I;
      while (acc >= 1) { acc -= 1; ev.push({ x: XL + 12 + Math.random() * (XR - XL - 24), a: 0 }); }
      ev.forEach(e => { const was = e.a; e.a += dt; if (was < 0.6 && e.a >= 0.6) { car.push({ x: e.x, k: 'e', t: 0 }, { x: e.x, k: 'h', t: 0 }); } });
      ev = ev.filter(e => e.a < 1.2);
      car.forEach(c => { c.t += dt; if (pin) c.x += (c.k === 'e' ? V : -V) * dt; });
      const tau = pin ? tauP : tauN;
      car = car.filter(c => c.x > 32 && c.x < 358 && Math.random() > dt / tau);
      sm += (car.length / 2 - sm) * Math.min(1, dt * 3);

      let s = '';
      s += `<rect x="30" y="${CB[0]}" width="330" height="${CB[1] - CB[0]}" style="fill:var(--probetint);opacity:.6"/>`;
      s += `<rect x="30" y="${VB[0]}" width="330" height="${VB[1] - VB[0]}" style="fill:var(--muted);opacity:.22"/>`;
      s += `<text x="195" y="14" text-anchor="middle">실리콘(Si) 도파로 안</text>`;
      s += `<text class="sm" x="34" y="${CB[0] - 6}">전도대</text><text class="sm" x="34" y="${VB[1] + 16}">가전자대</text>`;
      s += `<line class="ln dim" x1="22" y1="${CB[1]}" x2="22" y2="${VB[0]}"/><text class="sm" x="26" y="${(CB[1] + VB[0]) / 2 + 4}" style="writing-mode:initial">1.12 eV</text>`;
      // 광자 하나로는 못 넘는다
      s += `<line class="light" style="stroke-dasharray:4 3" x1="96" y1="${VB[0]}" x2="96" y2="${VB[0] - PH}"/>`;
      s += `<text class="sm" x="104" y="${VB[0] - PH + 4}">광자 하나</text><text class="sm" x="104" y="${VB[0] - PH + 18}">0.80 eV — 못 넘음</text>`;
      // 두 광자 흡수 사건
      ev.forEach(e => {
        const a = e.a, op = a < 0.8 ? 1 : Math.max(0, 1 - (a - 0.8) / 0.4);
        const h1 = Math.min(1, a / 0.3) * PH, h2 = Math.max(0, Math.min(1, (a - 0.3) / 0.3)) * PH;
        s += `<line class="light hl" style="opacity:${f(op, 2)}" x1="${f(e.x)}" y1="${VB[0]}" x2="${f(e.x)}" y2="${f(VB[0] - h1)}"/>`;
        if (h2 > 0) s += `<line class="light hl" style="opacity:${f(op, 2)}" x1="${f(e.x)}" y1="${f(VB[0] - PH)}" x2="${f(e.x)}" y2="${f(VB[0] - PH - h2)}"/>`;
        s += `<circle cx="${f(e.x)}" cy="${f(VB[0] - PH)}" r="2.5" style="fill:var(--warm);opacity:${f(op * (a < 0.6 ? 1 : 0.4), 2)}"/>`;
      });
      car.forEach(c => {
        // 전자는 남는 에너지(0.48 eV)만큼 위에서 생겨 열을 내주며 바닥으로 가라앉는다
        const sink = Math.min(1, c.t / 0.6), ey = (VB[0] - 2 * PH + 4) + sink * (CB[1] - 12 - (VB[0] - 2 * PH + 4));
        if (c.k === 'e' && sink < 1) { let w = ''; for (let k = 0; k <= 16; k++) w += (k ? 'L' : 'M') + f(c.x + 8 + k * 1.5) + ' ' + f(ey + 4 * Math.sin(k * 1.4)); s += `<path class="ln" style="stroke:var(--warm);opacity:${f(1 - sink, 2)}" d="${w}"/><text class="sm" x="${f(c.x + 36)}" y="${f(ey + 4)}" style="opacity:${f(1 - sink, 2)}">열</text>`; }
        s += c.k === 'e' ? `<circle cx="${f(c.x)}" cy="${f(ey)}" r="4.5" style="fill:var(--ink)"/>`
                        : `<circle cx="${f(c.x)}" cy="${VB[0] + 16}" r="4.5" style="fill:var(--bg);stroke:var(--ink);stroke-width:1.4"/>`;
      });
      if (pin) {
        s += `<text class="hlt" x="44" y="${CB[1] + 24}">p</text><text class="hlt" x="344" y="${CB[1] + 24}" text-anchor="end">n</text>`;
        s += `<text class="sm" x="196" y="${CB[1] + 24}" text-anchor="middle">← 정공 · 전기장 · 전자 →</text>`;
      }
      s += `<text class="sm" x="200" y="290" text-anchor="middle">●전자 ○정공 · 노란 화살표 둘 = 광자 둘 (합 1.60 eV)</text>`;
      // 오른쪽: 상대 크기 막대
      const v = Math.min(1, sm / 14);
      const bar = (y, lab, val, cls) => `<text class="sm" x="400" y="${y}">${lab}</text><rect x="400" y="${y + 8}" width="210" height="16" style="fill:none;stroke:var(--rule)"/><rect x="400" y="${y + 8}" width="${f(210 * val)}" height="16" style="${cls}"/>`;
      s += `<text x="400" y="36">그 순간의 효과 (상대 크기)</text>`;
      s += bar(70, `자유 전하 쌍 ${Math.round(car.length / 2)}개`, v, 'fill:var(--muted);opacity:.6');
      s += bar(130, '굴절률 감소 (−Δn) → 공진 짧은 쪽', v, 'fill:var(--beam);opacity:.8');
      s += bar(190, '흡수 증가 (+Δα) → 손실', v, 'fill:var(--warm)');
      s += `<text class="sm" x="400" y="250">생기는 빈도 ∝ 세기² · 사라지는 시간 = 수명</text>`;
      s += `<text class="sm" x="400" y="268">${pin ? 'p-i-n: 전기장이 쓸어 내 수명이 짧다' : '수명 동안 쌓인다 (실리콘 립 도파로 수십 ns)'}</text>`;
      G.innerHTML = s;
    });
    si.addEventListener('input', () => { out(); if (L) L.redraw(); });
  })();

  /* 그림 9: 흡수할 자리 24개가 차는 모습과 α/α₀ = 1/(1+I/Isat) */
  (function () {
    const G = $('li5-g');
    if (!G) return;
    const si = $('li5-i'), N = 24, TAU = 1.2, AL = 2.3;
    const full = new Array(N).fill(false);
    const out = () => { $('li5-io').textContent = f(+si.value, 2); };
    const gx = x => 430 + x / 8 * 185, gy = a => 220 - a * 170;
    let curve = '';
    for (let i = 0; i <= 160; i++) { const x = 8 * i / 160; curve += (i ? 'L' : 'M') + f(gx(x)) + ' ' + f(gy(1 / (1 + x))); }
    let frac = 1;
    const L = loop('li5', 'li5-p', dt => {
      const I = +si.value;
      out();
      if (dt === 0 && reduce) { const k = Math.round(N * I / (1 + I)); full.fill(false); for (let i = 0; i < k; i++) full[(i * 7) % N] = true; }
      for (let i = 0; i < N; i++) {
        if (full[i]) { if (Math.random() < 1 - Math.exp(-dt / TAU)) full[i] = false; }
        else if (Math.random() < 1 - Math.exp(-I * dt / TAU)) full[i] = true;
      }
      const empty = full.filter(x => !x).length;
      frac += (empty / N - frac) * Math.min(1, dt * 4 || 1);
      const Tr = Math.exp(-AL * frac);
      let s = '';
      s += `<text class="sm" x="20" y="40">들어오는 빛</text>`;
      s += `<line class="light" style="stroke-width:${f(2 + I * 1.2)}" x1="20" y1="130" x2="112" y2="130"/>`;
      s += `<rect x="116" y="50" width="196" height="160" rx="6" style="fill:none;stroke:var(--rule)"/>`;
      s += `<text class="sm" x="214" y="42" text-anchor="middle">흡수할 자리 (위 준위)</text>`;
      for (let i = 0; i < N; i++) {
        const c = i % 6, r = Math.floor(i / 6), x = 126 + c * 31, y = 62 + r * 36;
        s += full[i] ? `<rect x="${x}" y="${y}" width="22" height="22" rx="3" style="fill:var(--warm)"/><circle cx="${x + 11}" cy="${y + 11}" r="3.5" style="fill:var(--ink)"/>`
                     : `<rect x="${x}" y="${y}" width="22" height="22" rx="3" style="fill:var(--bg);stroke:var(--muted)"/>`;
      }
      s += `<line class="light hl" style="stroke-width:${f(Math.max(0.6, (2 + I * 1.2) * Tr))}" x1="316" y1="130" x2="396" y2="130"/>`;
      s += `<text class="sm" x="316" y="116">나가는 빛</text><text class="hlt" x="316" y="156">투과 ${f(Tr * 100, 0)}%</text>`;
      s += `<text class="sm" x="214" y="232" text-anchor="middle">빈 자리 ${empty}/${N} — 빈 자리만 광자를 받는다</text>`;
      // 오른쪽 그래프
      s += `<line class="ln" x1="430" y1="220" x2="615" y2="220"/><line class="ln" x1="430" y1="220" x2="430" y2="40"/>`;
      s += `<text class="sm" x="436" y="44">흡수 α / α₀</text><text class="sm" x="615" y="240" text-anchor="end">세기 I / I_sat →</text>`;
      s += `<text class="sm" x="424" y="${gy(1) + 4}" text-anchor="end">1</text><text class="sm" x="424" y="${gy(0.5) + 4}" text-anchor="end">½</text><text class="sm" x="${gx(1)}" y="236" text-anchor="middle">1</text>`;
      s += `<line class="ln dim" style="stroke-dasharray:3 4" x1="430" y1="${gy(0.5)}" x2="${gx(1)}" y2="${gy(0.5)}"/><line class="ln dim" style="stroke-dasharray:3 4" x1="${gx(1)}" y1="220" x2="${gx(1)}" y2="${gy(0.5)}"/>`;
      s += `<path class="light" style="stroke-width:2.4" d="${curve}"/>`;
      s += `<circle cx="${f(gx(I))}" cy="${f(gy(1 / (1 + I)))}" r="6" style="fill:var(--warm)"/>`;
      G.innerHTML = s;
    });
    si.addEventListener('input', () => { out(); if (L) L.redraw(); });
  })();
})();
