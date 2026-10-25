/* PCM 크로스바 실험실 — 어디에나 붙이는 부품. 지금은 구조 페이지 A-05 의 「깊게 보기」가 쓴다.
   계산은 PCM(pcm-engine.js), 여기는 화면만. 상태는 io 가 주소와 잇는다:
   io = { state(r)→{pre, params}, set(patch, opt), preset(id, reset), href('프리셋?키=값'), back() }
   손잡이는 공유할 대상이라 주소에 넣되 기록은 남기지 않는다(replace). 프리셋·보기 전환만 기록을 남긴다 */
(function () {
  'use strict';
  const { h, mount } = A;
  const SKEL = `
    <div class="lb-top"><span class="lb">실험실 · PCM 크로스바 — 논문 프리셋</span><div class="lb-presets" id="lb-presets" role="group" aria-label="프리셋"></div></div>
    <details class="lb-guide" id="lb-guide" open><summary>설명서 — 이 실험실 읽는 법</summary><div id="lb-guide-body"></div></details>
    <div class="lb-viewbar"><div class="lb-views" id="lb-views" role="group" aria-label="보기"></div>
      <button type="button" class="pill" id="lb-reseed">새 가중치·입력</button><span class="mono lb-hint" id="lb-hint"></span></div>
    <div class="lb-figbox"><svg id="lb-2d" class="lb-2d" role="img" aria-label="크로스바 회로도"></svg><div id="lb-3d" class="lb-3d" hidden></div></div>
    <div class="lb-legend" id="lb-legend"></div>
    <div class="lb-knobhead"><span class="lb">손잡이</span><button type="button" class="pill on" id="lb-helptg" aria-pressed="true">설명 보기</button></div>
    <div class="lb-knobs" id="lb-knobs"></div>
    <p class="note lb-assume" id="lb-assume"></p>`;

  function mountLab(main, sideEl, io) {
    const D = A.data('lab-pcm');
    if (!D || !window.PCM) { mount(main, h('p.empty', '데이터 로드 실패: ' + (D ? 'pcm-engine.js' : 'lab-pcm.json'))); return null; }
    const P = window.PCM;
    main.innerHTML = SKEL;
    const q = s => main.querySelector(s), $ = q;
    let alive = true;
    const MAT = Object.fromEntries(D.MAT.map(m => [m.id, m]));
    const PRE = Object.fromEntries(D.PRESET.map(p => [p.id, p]));
    const DEF = D.PRESET[0].id;

    // 손잡이 — [키, 이름, 단위, 최소, 최대, 간격] · 선택형은 opts
    const KN = [
      ['토폴로지', [['m', '입력 행', '개', 2, 16, 1], ['n', '출력 열', '개', 2, 16, 1], ['dc', '결합기 손실', 'dB/개', 0, 0.5, 0.01], ['cx', '교차 손실', 'dB/개', 0, 0.5, 0.01]]],
      ['재료', [['mat', '상변화 재료', '', D.MAT.map(m => [m.id, m.n])], ['len', '셀 길이', 'µm', 0.5, 20, 0.5], ['lv', '구분 단계', '개', 2, 64, 1]]],
      ['광원', [['src', '종류', '', D.SRC.map(s => [s.id, s.n])], ['p', '채널당 출력', 'mW', 0.1, 20, 0.1], ['er', '변조기 소광비', 'dB', 5, 40, 1]]],
      ['검출기', [['nep', '잡음등가전력', 'pW/√Hz', 0.1, 100, 0.1], ['bw', '대역폭', 'GHz', 0.1, 20, 0.1]]],
    ];
    const ALLK = KN.flatMap(g => g[1].map(k => k[0]));
    const NUM = new Set(KN.flatMap(g => g[1].filter(k => !Array.isArray(k[3])).map(k => k[0])));

    let st = { pre: DEF, cfg: { ...PRE[DEF].set }, view: '2d', seed: 1 };
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    const f = (v, d) => (+v).toFixed(d == null ? 2 : d);

    // ── 주소 → 상태 ──
    function fromRoute(r) {
      const s0 = io.state(r), pre = PRE[s0.pre] ? s0.pre : DEF, cfg = { ...PRE[pre].set };
      ALLK.forEach(k => { const v = s0.params[k]; if (v != null) cfg[k] = NUM.has(k) ? +v : v; });
      if (!MAT[cfg.mat]) cfg.mat = PRE[pre].set.mat;
      return { pre, cfg, view: s0.params.view === '3d' ? '3d' : '2d', seed: +s0.params.seed || 1 };
    }
    const setK = (k, v) => io.set({ [k]: String(v) === String(PRE[st.pre].set[k]) ? null : v }, { replace: true });
    const reset = Object.fromEntries(ALLK.concat('seed').map(k => [k, null]));

    const HP = D.HELP || {};
    const help = k => HP.knob && HP.knob[k] ? h('span.lb-kh', HP.knob[k]) : null;
    function buildGuide() {
      const g = $('#lb-guide-body');
      if (!g || !HP.what) { const d = $('#lb-guide'); if (d) d.hidden = true; return; }
      mount(g,
        h('p.lb-gwhat', HP.what),
        h('div.lb-gcols',
          h('div', h('span.lb', '결과 읽는 법'), h('dl.lb-gdl', (HP.read || []).map(([t, d]) => [h('dt', t), h('dd', d)]))),
          h('div', h('span.lb', '해 볼 것 — 누르면 그 설정으로 바뀐다'),
            h('div.lb-gtry', (HP.try || []).map(([t, d, href]) => h('a.lb-try', { href: io.href(href) }, h('b', t), h('span', d)))))));
    }
    // 손잡이 설명은 화면 편의일 뿐이라 주소에 넣지 않는다
    const helpTg = $('#lb-helptg');
    helpTg.onclick = () => {
      const on = helpTg.getAttribute('aria-pressed') !== 'true';
      helpTg.setAttribute('aria-pressed', String(on)); helpTg.classList.toggle('on', on);
      helpTg.textContent = on ? '설명 보기' : '설명 숨김';
      $('#lb-knobs').classList.toggle('nohelp', !on);
    };

    // ── 손잡이: 한 번 만들고 값만 고친다(끌고 있는 슬라이더를 다시 그리면 손에서 놓친다) ──
    const knobEls = {};
    function buildKnobs() {
      mount(q('#lb-knobs'), KN.map(([g, ks]) => h('section.lb-grp', h('span.lb', g), ks.map(k => {
        const [key, name, unit] = k;
        if (Array.isArray(k[3])) {
          const box = h('div.lb-opts', { role: 'group', 'aria-label': name });
          knobEls[key] = { box, opts: k[3] };
          return h('div.lb-k', h('span.lb-kn', name), box, help(key));
        }
        const [, , , mn, mx, step] = k;
        const inp = h('input', { type: 'range', min: mn, max: mx, step, 'aria-label': name });
        const out = h('span.mono.lb-kv');
        inp.oninput = () => { out.textContent = inp.value + ' ' + unit; setK(key, +inp.value); };
        knobEls[key] = { inp, out, unit };
        return h('label.lb-k', h('span.lb-kn', name), inp, out, help(key));
      }))));
    }
    function syncKnobs() {
      Object.entries(knobEls).forEach(([k, e]) => {
        const v = st.cfg[k], dflt = PRE[st.pre].set[k];
        if (e.inp) {
          if (document.activeElement !== e.inp) e.inp.value = v;
          e.out.textContent = v + ' ' + e.unit;
          e.inp.closest('.lb-k').classList.toggle('mod', String(v) !== String(dflt));
        } else {
          mount(e.box, e.opts.map(([id, nm]) => A.pill(nm, v === id, () => setK(k, id), { class: 'pill lb-opt' })));
          e.box.closest('.lb-k').classList.toggle('mod', v !== dflt);
        }
      });
    }

    // ── 표본 하나(그림용) ──
    function sample() {
      const r = P.rng(st.seed * 7919), { m, n } = st.cfg;
      const W = Array.from({ length: m }, () => Array.from({ length: n }, () => r()));
      const x = Array.from({ length: m }, () => r());
      return { W, x, out: P.forward(st.cfg, MAT[st.cfg.mat], W, x, P.rng(st.seed * 104729)) };
    }
    const rowColor = (i, m) => st.cfg.src === 'single' ? css('--beam') : `hsl(${Math.round(i * 300 / Math.max(1, m - 1) + 200) % 360}, 62%, 48%)`;

    // ── 2D 회로도: 입력부 → 행렬부 → 출력부 ──
    function draw2d(S) {
      const { m, n, lv, len } = st.cfg, mat = MAT[st.cfg.mat], single = st.cfg.src === 'single';
      const W = 680, H = 500, L = 176, T = 52, Rr = 20, B = 132;
      const sx = (W - L - Rr) / n, sy = (H - T - B) / m, cs = Math.max(5, Math.min(sx, sy) * 0.42);
      const X = j => L + sx * (j + 0.5), Y = i => T + sy * (i + 0.5), yb = H - B;
      const zone = (x, y, w, hh, t) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6" fill="none" stroke="var(--rule)" stroke-dasharray="4 3"/><text x="${x + 8}" y="${y + 14}" class="lb-t lb-zt">${t}</text>`;
      let g = zone(4, T - 40, L - 16, yb - T + 50, '입력부') + zone(L - 6, T - 40, W - L - Rr + 14, yb - T + 50, '행렬부 — PCM 크로스바') + zone(L - 6, yb + 16, W - L - Rr + 14, B - 22, '출력부 — 검출기');
      // 광원 → (분파) → 행마다 변조기
      const sy0 = (T + yb) / 2;
      g += `<rect x="14" y="${f(sy0 - 22, 1)}" width="34" height="44" rx="5" fill="var(--panel)" stroke="var(--ink)" stroke-width=".8"/><text x="31" y="${f(sy0 + 4, 1)}" text-anchor="middle" class="lb-t">${single ? '레이저' : '콤'}</text>`;
      for (let i = 0; i < m; i++) {
        const c = rowColor(i, m), wv = 0.8 + 3.2 * S.x[i];
        g += `<path d="M48 ${f(sy0, 1)} C 70 ${f(sy0, 1)} 70 ${f(Y(i), 1)} 92 ${f(Y(i), 1)}" stroke="${c}" stroke-width="1" stroke-opacity=".6" fill="none"/>`;
        g += `<rect x="92" y="${f(Y(i) - 7, 1)}" width="22" height="14" rx="3" fill="var(--panel)" stroke="${c}" stroke-width="1"/>`;
        g += `<path d="M114 ${Y(i)} H${W - Rr}" stroke="${c}" stroke-width="${f(wv, 1)}" stroke-opacity=".8" fill="none"/>`;
        if (m <= 10) g += `<text x="140" y="${f(Y(i) - 6, 1)}" text-anchor="middle" class="lb-t">x${i + 1} ${f(S.x[i])}</text>`;
      }
      g += `<text x="60" y="${T - 6}" class="lb-t lb-tm">${single ? '한 파장을 나눔' : '파장별로 나눔'} → 변조기</text>`;
      for (let j = 0; j < n; j++) g += `<path d="M${X(j)} ${T} V${yb + 24}" stroke="var(--rule)" stroke-width="1.6" fill="none"/>`;
      // 교차점마다: 결합기가 행에서 빛을 떼어 굽은 도파로로 꺾고, 셀을 지나 열에 합친다(개념도 — 8×8 이하에서만 그린다)
      const tap = m <= 8 && n <= 8, r = Math.min(sx, sy) * 0.34;
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
        if (tap) g += `<path d="M${f(X(j) - r * 1.6, 1)} ${f(Y(i), 1)} C ${f(X(j) - r * 0.4, 1)} ${f(Y(i), 1)} ${f(X(j), 1)} ${f(Y(i) + r * 0.2, 1)} ${f(X(j), 1)} ${f(Y(i) + r * 1.4, 1)}" stroke="${rowColor(i, m)}" stroke-width=".9" stroke-opacity=".55" fill="none"/>`;
        const wq = P.quant(S.W[i][j], lv), c = P.cOfT(mat, len, P.weightT(mat, len, wq));
        g += `<rect x="${f(X(j) - cs / 2, 1)}" y="${f(Y(i) - cs / 2, 1)}" width="${f(cs, 1)}" height="${f(cs, 1)}" rx="2" fill="var(--wall)" fill-opacity="${f(0.08 + 0.85 * c)}" stroke="var(--wall)" stroke-width=".8"><title>w = ${f(wq)} · 결정화 ${f(c * 100, 0)}%</title></rect>`;
      }
      const by = yb + 36, bh = 56, bw = Math.min(26, sx * 0.55);
      // 막대는 열 가운데 가장 큰 값에 맞춘다(결과는 1/m 로 정규화돼 작다)
      const top = Math.max(0.05, ...S.out.ideal, ...S.out.est) * 1.1;
      for (let j = 0; j < n; j++) {
        const id = Math.max(0, S.out.ideal[j]) / top, es = Math.max(0, Math.min(1, S.out.est[j] / top));
        g += `<rect x="${f(X(j) - bw / 2, 1)}" y="${by}" width="${f(bw, 1)}" height="${bh}" rx="2" fill="var(--panel)" stroke="var(--rule)"/>`;
        g += `<rect x="${f(X(j) - bw / 2 + 2, 1)}" y="${f(by + bh - bh * es, 1)}" width="${f(bw - 4, 1)}" height="${f(bh * es, 1)}" fill="var(--beam)" fill-opacity=".75"/>`;
        g += `<path d="M${f(X(j) - bw / 2 - 3, 1)} ${f(by + bh - bh * id, 1)} h${f(bw + 6, 1)}" stroke="var(--ink)" stroke-width="1.6"/>`;
        if (n <= 10) g += `<text x="${X(j)}" y="${by + bh + 14}" text-anchor="middle" class="lb-t">y${j + 1}</text>`;
      }
      g += `<text x="${L + 2}" y="${H - 4}" class="lb-t lb-tm">막대 = 광학 결과 · 가로선 = 이상값 Σx·w/m</text>`;
      const svg = $('#lb-2d');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = g;
    }

    // ── 3D 배치 (three.js, 처음 열 때만 불러온다) ──
    let T3 = null;
    async function draw3d(S) {
      const box = $('#lb-3d');
      if (!T3) {
        box.textContent = '3D 불러오는 중…';
        try {
          const [THREE, OC] = await Promise.all([import('../../vendor/three/three.module.min.js'), import('../../vendor/three/OrbitControls.js')]);
          box.textContent = '';
          const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
          box.appendChild(r.domElement);
          const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
          const ctl = new OC.OrbitControls(cam, r.domElement);
          ctl.enableDamping = true;
          scene.add(new THREE.AmbientLight(0xffffff, 0.75));
          const dl = new THREE.DirectionalLight(0xffffff, 0.9); dl.position.set(4, 10, 6); scene.add(dl);
          T3 = { THREE, r, scene, cam, ctl, grp: null, key: '' };
          const size = () => { const w = box.clientWidth || 600, hh = Math.max(320, Math.min(520, w * 0.62)); r.setSize(w, hh); cam.aspect = w / hh; cam.updateProjectionMatrix(); };
          T3.ro = new ResizeObserver(size); T3.ro.observe(box); size();
          const loop = () => { if (!alive) return; if (!box.hidden) { ctl.update(); r.render(scene, cam); } requestAnimationFrame(loop); };
          loop();
        } catch (e) { box.textContent = '3D 를 불러오지 못했다: ' + e.message; return; }
      }
      const { THREE, scene, cam, ctl } = T3, { m, n, lv, len } = st.cfg, mat = MAT[st.cfg.mat];
      if (T3.grp) { scene.remove(T3.grp); T3.grp.traverse(o => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose(); }); }
      const grp = new THREE.Group(), col = v => new THREE.Color(v);
      const sub = new THREE.Mesh(new THREE.BoxGeometry(n + 5.4, 0.25, m + 1.6), new THREE.MeshStandardMaterial({ color: col(css('--grid') || '#ECE8DF') }));
      sub.position.set(-1.5, -0.18, 0); grp.add(sub);
      // 입력부: 광원(콤이면 고리 공진기) → 행마다 변조기
      const x0 = -n / 2 - 0.9, src = st.cfg.src === 'single'
        ? new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.7), new THREE.MeshStandardMaterial({ color: col(css('--beam') || '#C9472F') }))
        : new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 12, 40), new THREE.MeshStandardMaterial({ color: col(css('--probe') || '#2C7A86'), emissive: col(css('--probe') || '#2C7A86'), emissiveIntensity: 0.4 }));
      if (st.cfg.src !== 'single') src.rotation.x = Math.PI / 2;
      src.position.set(x0 - 2.2, 0.1, 0); grp.add(src);
      const X = j => j - (n - 1) / 2, Z = i => i - (m - 1) / 2;
      for (let i = 0; i < m; i++) {
        const c = col(rowColor(i, m));
        const wg = new THREE.Mesh(new THREE.BoxGeometry(n + 1.6, 0.07, 0.12), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.15 + 0.85 * S.x[i] }));
        wg.position.set(0.2, 0, Z(i)); grp.add(wg);
        const md = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.3), new THREE.MeshStandardMaterial({ color: c }));
        md.position.set(x0, 0.06, Z(i)); grp.add(md);
        const fan = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.04, 0.05), new THREE.MeshStandardMaterial({ color: c }));
        fan.position.set(x0 - 1.15, 0, Z(i) / 2); fan.rotation.y = Math.atan2(Z(i) / 2, 1.9); grp.add(fan);
      }
      for (let j = 0; j < n; j++) {
        const wg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, m + 0.9), new THREE.MeshStandardMaterial({ color: col(css('--muted') || '#6B675E') }));
        wg.position.set(X(j), 0, 0.25); grp.add(wg);
        const es = Math.max(0.02, Math.min(1.2, S.out.est[j]));
        const pd = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2 + es * 1.4, 0.5), new THREE.MeshStandardMaterial({ color: col(css('--beam') || '#C9472F') }));
        pd.position.set(X(j), (0.2 + es * 1.4) / 2, (m + 0.9) / 2 + 0.6); grp.add(pd);
      }
      const am = col(css('--panel') || '#FBFAF7'), cr = col(css('--wall') || '#8A5A2B');
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
        const c = P.cOfT(mat, len, P.weightT(mat, len, P.quant(S.W[i][j], lv)));
        const cell = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.1, 0.36), new THREE.MeshStandardMaterial({ color: am.clone().lerp(cr, c), roughness: 0.5 }));
        cell.position.set(X(j), 0.08, Z(i)); grp.add(cell);
      }
      scene.add(grp); T3.grp = grp;
      const key = m + 'x' + n;
      if (T3.key !== key) { const s = Math.max(m, n); cam.position.set(s * 0.9, s * 1.05, s * 1.25); ctl.target.set(0, 0, 0.4); T3.key = key; }
    }

    // ── 오른쪽: 논문이 하려던 것 · 결과 ──
    function side(S) {
      const pre = PRE[st.pre], mat = MAT[st.cfg.mat], cfg = st.cfg;
      const trials = Math.max(100, Math.min(600, Math.round(24000 / (cfg.m * cfg.n))));
      const pr = P.precision(cfg, mat, trials, st.seed), B = P.budget(cfg, mat), R = P.range(mat, cfg.len);
      const fs = P.fullScale(cfg, mat) * 1e3, noise = cfg.nep * 1e-12 * Math.sqrt(cfg.bw * 1e9) * 1e6;
      const snr = noise > 0 ? fs / noise : Infinity;
      const warn = [];
      if (cfg.src === 'single') warn.push('한 파장을 나눠 쓰면 열에서 합칠 때 경로 위상이 달라 서로 간섭한다. 세기가 아니라 진폭이 더해져 결과가 무작위로 흔들린다 — 콤을 쓰는 이유다.');
      if (R.contrast < 0.15) warn.push(`가중치 폭이 좁다 — 비정질과 결정의 투과율 차이가 ${f(R.contrast * 100, 1)}%뿐이다. 흡수로 가중치를 거는 구조에는 손실이 큰 재료가 맞다.`);
      if (snr < 200) warn.push(`검출기에 닿는 세기가 잡음 바닥의 ${f(snr, 0)}배뿐이다. 행렬이 커질수록 1/(m·n) 로 나눠져 어두워진다.`);
      const rows = [['분배 1/(m·n)', B.fan], ['결합기', B.dc], ['교차', B.cx], ['셀(비정질)', B.pcm]];
      const mx = Math.max(1, B.total);
      const hist = histo(pr.errs, Math.max(0.02, 4 * pr.sigma));
      mount(sideEl,
        h('div', h('span.lb', pre.id === 'lowloss' ? '가정 실험' : '프리셋 · 논문'), h('h2', pre.n), h('p.sub', pre.cite)),
        h('div.det.lb-goal', h('span.lb', '논문이 하려던 것'), h('p', pre.goal), h('ul.lb-facts', pre.facts.map(x => h('li', x)))),
        h('div.lb-res',
          h('div.lb-big', h('b.mono', f(pr.bits, 1)), h('span', ' bit'), pre.report && pre.report.bits ? h('span.lb-rep', ` · 논문 보고 ${pre.report.bits} bit`) : null),
          h('p.note', `무작위 입력·가중치 ${trials}회 × 열 ${cfg.n}개의 오차 표준편차 σ = ${f(pr.sigma, 4)} → log₂(1/4σ)`),
          h('div.lb-hist', { html: hist })),
        warn.length ? h('div.warnbox.lb-warn', warn.map(w => h('p', w))) : null,
        h('div.lb-sec', h('span.lb', `손실 예산 — 최악 경로 ${f(B.total, 1)} dB`),
          rows.map(([k, v]) => h('div.lb-row', h('span', k), h('i', h('b', { style: { width: Math.max(1, v / mx * 100) + '%' } })), h('span.mono', f(v, 2) + ' dB')))),
        h('div.lb-sec', h('span.lb', `재료 — ${mat.n}`),
          h('p.lb-kvs', h('span', `셀 ${cfg.len} µm: 비정질 T = ${f(R.Ta, 3)} · 결정 T = ${f(R.Tc, 3)}`), h('span', `가중치 폭 ${f(R.contrast * 100, 1)}% (${f(R.contrastDb, 2)} dB)`)),
          h('p.note', mat.note + ' — ' + mat.src)),
        h('div.lb-sec', h('span.lb', '검출기'),
          h('p.lb-kvs', h('span', `최대 신호 ${f(fs, 2)} µW (${f(10 * Math.log10(fs / 1000), 1)} dBm)`), h('span', `잡음 바닥 ${f(noise, 4)} µW · 비 ${isFinite(snr) ? f(snr, 0) : '∞'}`))),
        A.papers('a5', pid => io.href(pid)));
    }
    function histo(errs, span) {
      const N = 31, bins = new Array(N).fill(0);
      errs.forEach(e => { const k = Math.floor((e + span) / (2 * span) * N); if (k >= 0 && k < N) bins[k]++; });
      const top = Math.max(1, ...bins), W = 300, H = 70;
      let s = `<svg viewBox="0 0 ${W} ${H + 16}" role="img" aria-label="오차 분포">`;
      bins.forEach((b, k) => { const bh = b / top * H; s += `<rect x="${f(k * W / N + 1, 1)}" y="${f(H - bh, 1)}" width="${f(W / N - 2, 1)}" height="${f(bh, 1)}" fill="var(--probe)" fill-opacity=".7"/>`; });
      s += `<path d="M${W / 2} 0 V${H}" stroke="var(--ink)" stroke-dasharray="2 2"/>`;
      s += `<text x="0" y="${H + 13}" class="lb-t">−${f(span, 3)}</text><text x="${W / 2}" y="${H + 13}" text-anchor="middle" class="lb-t">오차 0</text><text x="${W}" y="${H + 13}" text-anchor="end" class="lb-t">+${f(span, 3)}</text></svg>`;
      return s;
    }

    // ── 그리기 ──
    function render() {
      mount(q('#lb-presets'), D.PRESET.map(p => A.pill(p.n, st.pre === p.id, () => io.preset(p.id, reset), { class: 'pill lb-pre' })));
      mount(q('#lb-views'), [['2d', '2D 회로도'], ['3d', '3D 배치']].map(([v, l]) => A.pill(l, st.view === v, () => io.set({ view: v === '2d' ? null : v }))));
      const mod = ALLK.filter(k => String(st.cfg[k]) !== String(PRE[st.pre].set[k])).length;
      $('#lb-hint').textContent = mod ? `프리셋에서 ${mod}개 바꿈` : '프리셋 그대로';
      syncKnobs();
      const S = sample();
      $('#lb-2d').style.display = st.view === '2d' ? '' : 'none';   // SVG 요소는 hidden 속성이 듣지 않는다
      $('#lb-3d').hidden = st.view !== '3d';
      if (st.view === '2d') draw2d(S); else draw3d(S);
      mount(q('#lb-legend'), st.view === '3d' ? h('span', '왼쪽 = 입력부(광원·변조기) · 가운데 = 행렬부 · 앞 = 출력부(검출기) · 끌어서 돌리기'): null, h('span', h('i.lb-sw.am'), '비정질 — 밝다(가중치 큼)'), h('span', h('i.lb-sw.cr'), '결정 — 어둡다(가중치 작음)'), h('span', `가중치 ${st.cfg.lv}단계로 양자화`));
      side(S);
    }

    $('#lb-assume').textContent = D.ASSUME + ' 모형의 범위와 근사는 손실·투과율·잡음의 해석식까지다 — 장(field) 풀이는 하지 않는다.';
    $('#lb-reseed').onclick = () => io.set({ seed: st.seed + 1 });
    buildGuide();
    buildKnobs();
    if (io.back) q('.lb-top').appendChild(h('button.pill.lb-back', { type: 'button', onclick: io.back }, '← 기본 보기로'));
    const mq = window.matchMedia('(prefers-color-scheme: dark)'), onScheme = () => render();
    mq.addEventListener('change', onScheme);
    return {
      update(r) { st = fromRoute(r); render(); },
      destroy() {
        alive = false; mq.removeEventListener('change', onScheme);
        if (T3) { T3.ro && T3.ro.disconnect(); T3.r.dispose(); T3 = null; }
        mount(main); mount(sideEl);
      },
    };
  }
  window.PCMLab = { mount: mountLab };
})();
