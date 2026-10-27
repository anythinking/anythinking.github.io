/* 링 가중치 뱅크 실험실 — 구조 페이지 A-02 의 「깊게 보기」가 붙이는 부품. 계산은 RING(ring-engine.js), 여기는 화면만.
   io 규약은 PCM 실험실과 같다: { state(r)→{pre, params}, set(patch, opt), preset(id, reset), href('프리셋?키=값'), back() } */
(function () {
  'use strict';
  const { h, mount } = A;
  const SKEL = `
    <div class="lb-top"><span class="lb">실험실 · 링 가중치 뱅크 — 논문 프리셋</span><div class="lb-presets" id="lb-presets" role="group" aria-label="프리셋"></div></div>
    <details class="lb-guide" id="lb-guide" open><summary>설명서 — 이 실험실 읽는 법</summary><div id="lb-guide-body"></div></details>
    <div class="lb-viewbar"><div class="lb-views" id="lb-views" role="group" aria-label="보기"></div>
      <button type="button" class="pill" id="lb-reseed">새 가중치·입력</button><span class="mono lb-hint" id="lb-hint"></span></div>
    <div class="lb-figbox"><svg id="lb-2d" class="lb-2d" role="img" aria-label="링 가중치 뱅크 회로도"></svg><div id="lb-3d" class="lb-3d" hidden></div></div>
    <div class="lb-figbox lb-specbox"><span class="lb">스펙트럼 — 뱅크 1 의 through · drop</span><svg id="lb-spec" class="lb-2d" role="img" aria-label="뱅크 1 스펙트럼"></svg></div>
    <div class="lb-legend" id="lb-legend"></div>
    <div class="lb-knobhead"><span class="lb">손잡이</span><button type="button" class="pill on" id="lb-helptg" aria-pressed="true">설명 보기</button></div>
    <div class="lb-knobs" id="lb-knobs"></div>
    <p class="note lb-assume" id="lb-assume"></p>`;

  function mountLab(main, sideEl, io) {
    const D = A.data('lab-ring');
    if (!D || !window.RING) { mount(main, h('p.empty', '데이터 로드 실패: ' + (D ? 'ring-engine.js' : 'lab-ring.json'))); return null; }
    const G = window.RING;
    main.innerHTML = SKEL;
    const q = s => main.querySelector(s);
    let alive = true;
    const PRE = Object.fromEntries(D.PRESET.map(p => [p.id, p]));
    const DEF = D.PRESET[0].id;

    // 손잡이 — [키, 이름, 단위, 최소, 최대, 간격] · 선택형은 opts
    const KN = [
      ['토폴로지', [['m', '입력(파장) 수', '개', 2, 16, 1], ['n', '출력(뱅크) 수', '개', 1, 8, 1], ['sp', '채널 간격', 'nm', 0.2, 4, 0.05]]],
      ['링', [['R', '반지름', 'µm', 3, 60, 0.5], ['k2', '결합 비율', '', 0.005, 0.3, 0.005], ['loss', '손실', 'dB/cm', 0.5, 30, 0.5], ['ng', '군굴절률', '', 3, 4.6, 0.05]]],
      ['튜닝', [['tune', '방식', '', [['heater', '히터'], ['pcm', 'PCM']]], ['eta', '히터 효율', 'nm/mW', 0.05, 1, 0.01], ['xt', '열 누화', '%', 0, 20, 0.5],
        ['fab', '제작 편차', 'nm', 0, 2, 0.05], ['cal', '편차 보정', '', [[1, '켬'], [0, '끔']]], ['lv', '구분 단계(PCM)', '개', 2, 64, 1]]],
      ['광원 · 검출', [['src', '입력', '', [['comb', '콤 + 링 변조기'], ['lasers', '레이저 + 다중화']]], ['p', '채널당 출력', 'mW', 0.1, 20, 0.1],
        ['nep', '잡음등가전력', 'pW/√Hz', 0.1, 100, 0.1], ['bw', '대역폭', 'GHz', 0.1, 20, 0.1]]],
    ];
    const ALLK = KN.flatMap(g => g[1].map(k => k[0]));
    const NUM = new Set(KN.flatMap(g => g[1].filter(k => !Array.isArray(k[3])).map(k => k[0])).concat('cal'));

    let st = { pre: DEF, cfg: { ...PRE[DEF].set, lam: 1550 }, view: '2d', seed: 1 };
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    const f = (v, d) => (+v).toFixed(d == null ? 2 : d);

    // ── 주소 → 상태 ──
    function fromRoute(r) {
      const s0 = io.state(r), pre = PRE[s0.pre] ? s0.pre : DEF, cfg = { ...PRE[pre].set, lam: 1550 };
      ALLK.forEach(k => { const v = s0.params[k]; if (v != null) cfg[k] = NUM.has(k) ? +v : v; });
      return { pre, cfg, view: s0.params.view === '3d' ? '3d' : '2d', seed: +s0.params.seed || 1 };
    }
    const setK = (k, v) => io.set({ [k]: String(v) === String(PRE[st.pre].set[k]) ? null : v }, { replace: true });
    const reset = Object.fromEntries(ALLK.concat('seed').map(k => [k, null]));

    // ── 설명서 · 손잡이 (PCM 실험실과 같은 틀) ──
    const HP = D.HELP || {};
    const help = k => HP.knob && HP.knob[k] ? h('span.lb-kh', HP.knob[k]) : null;
    function buildGuide() {
      mount(q('#lb-guide-body'),
        h('p.lb-gwhat', HP.what),
        h('div.lb-gcols',
          h('div', h('span.lb', '결과 읽는 법'), h('dl.lb-gdl', (HP.read || []).map(([t, d]) => [h('dt', t), h('dd', d)]))),
          h('div', h('span.lb', '해 볼 것 — 누르면 그 설정으로 바뀐다'),
            h('div.lb-gtry', (HP.try || []).map(([t, d, href]) => h('a.lb-try', { href: io.href(href) }, h('b', t), h('span', d)))))));
    }
    const helpTg = q('#lb-helptg');
    helpTg.onclick = () => {
      const on = helpTg.getAttribute('aria-pressed') !== 'true';
      helpTg.setAttribute('aria-pressed', String(on)); helpTg.classList.toggle('on', on);
      helpTg.textContent = on ? '설명 보기' : '설명 숨김';
      q('#lb-knobs').classList.toggle('nohelp', !on);
    };
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
          // PCM 이면 히터 손잡이는, 히터면 단계 손잡이는 쓰이지 않는다
          const idle = (st.cfg.tune === 'pcm' && (k === 'eta' || k === 'xt')) || (st.cfg.tune !== 'pcm' && k === 'lv');
          e.inp.closest('.lb-k').classList.toggle('idle', idle);
        } else {
          mount(e.box, e.opts.map(([id, nm]) => A.pill(nm, String(v) === String(id), () => setK(k, id), { class: 'pill lb-opt' })));
          e.box.closest('.lb-k').classList.toggle('mod', String(v) !== String(dflt));
        }
      });
    }

    // ── 표본 하나(그림용) ──
    function sample() {
      const r = G.rng(st.seed * 7919), { m, n } = st.cfg;
      const W = Array.from({ length: m }, () => Array.from({ length: n }, () => 2 * r() - 1));
      const x = Array.from({ length: m }, () => r());
      return { W, x, out: G.forward(st.cfg, W, x, G.rng(st.seed * 104729)) };
    }
    const chColor = (i, m) => `hsl(${Math.round(i * 300 / Math.max(1, m - 1) + 200) % 360}, 62%, 48%)`;

    // ── 2D: 입력(콤 버스 위 링 변조기 / 레이저 + 다중화) → n 갈래 → 뱅크마다 through·drop 버스 사이 링 + 균형 검출기 ──
    function draw2d(S) {
      const { m, n, src } = st.cfg, W = 820, top = 70, bh = 78, H = top + n * bh + 40;
      const X0 = 300, X1 = 700, rx = i => X0 + (X1 - X0) * (i + 0.5) / m, rr = Math.max(6, Math.min(16, (X1 - X0) / m * 0.32));
      const zone = (x, y, w, hh, t) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6" fill="none" stroke="var(--rule)" stroke-dasharray="4 3"/><text x="${x + 8}" y="${y + 14}" class="lb-t lb-zt">${t}</text>`;
      const yIn = top + n * bh / 2 - bh / 2 + 20;
      let g = zone(4, 8, 248, H - 16, src === 'comb' ? '입력 — 콤 버스 위 링 변조기' : '입력 — 레이저 + 다중화(AWG)') + zone(262, 8, W - 270, H - 16, '링 가중치 뱅크 — 출력마다 한 줄');
      if (src === 'comb') {
        g += `<rect x="14" y="${yIn - 14}" width="40" height="28" rx="4" fill="var(--panel)" stroke="var(--ink)" stroke-width=".8"/><text x="34" y="${yIn + 26}" text-anchor="middle" class="lb-t lb-cap">콤</text>`;
        g += `<path d="M54 ${yIn} H232" stroke="var(--muted)" stroke-width="2.2" fill="none"/>`;
        for (let i = 0; i < m; i++) { const cx = 70 + 160 * (i + 0.5) / m; g += `<circle cx="${f(cx, 1)}" cy="${yIn - 11}" r="${f(Math.min(9, 70 / m), 1)}" fill="none" stroke="${chColor(i, m)}" stroke-width="2.2"><title>λ${i + 1} 링 변조기 — x${i + 1} = ${f(S.x[i])}</title></circle>`; }
        g += `<text x="150" y="${yIn + 26}" text-anchor="middle" class="lb-t lb-tm">링마다 자기 파장에 x 를 싣는다</text>`;
      } else {
        for (let i = 0; i < m; i++) {
          const y = 40 + (H - 90) * (i + 0.5) / m;
          g += `<rect x="14" y="${f(y - 7, 1)}" width="30" height="14" rx="3" fill="var(--panel)" stroke="${chColor(i, m)}"/><path d="M44 ${f(y, 1)} C 120 ${f(y, 1)} 120 ${yIn} 176 ${yIn}" stroke="${chColor(i, m)}" stroke-width="1" fill="none" stroke-opacity=".7"/>`;
        }
        g += `<rect x="176" y="${yIn - 20}" width="18" height="40" rx="3" fill="var(--panel)" stroke="var(--ink)" stroke-width=".8"/><text x="185" y="${yIn + 34}" text-anchor="middle" class="lb-t lb-cap">AWG</text><path d="M194 ${yIn} H232" stroke="var(--muted)" stroke-width="2.2"/>`;
      }
      // 한 버스를 n 갈래로 나눈다(1/n)
      for (let k = 0; k < n; k++) {
        const yt = top + k * bh, yd = yt + 36;
        g += `<path d="M232 ${yIn} C 252 ${yIn} 252 ${yt} 272 ${yt} H${X1 + 34}" stroke="var(--muted)" stroke-width="2" fill="none"/>`;
        g += `<path d="M${X0 - 20} ${yd} H${X1 + 34}" stroke="var(--muted)" stroke-width="2" fill="none" stroke-dasharray="1 0"/>`;
        g += `<text x="276" y="${yt - 6}" class="lb-t lb-tm">뱅크 ${k + 1} · through</text><text x="${X0 - 20}" y="${yd + 14}" class="lb-t lb-tm">drop</text>`;
        for (let i = 0; i < m; i++) {
          const w = S.out.weff[k][i], c = chColor(i, m);
          g += `<circle cx="${f(rx(i), 1)}" cy="${(yt + yd) / 2}" r="${f(rr, 1)}" fill="none" stroke="${c}" stroke-width="2.4" stroke-opacity="${f(0.35 + 0.65 * (w + 1) / 2)}"><title>λ${i + 1} → w = ${f(w)} (목표 ${f(S.W[i][k])})</title></circle>`;
          if (m <= 8) g += `<text x="${f(rx(i), 1)}" y="${f((yt + yd) / 2 + 3.5, 1)}" text-anchor="middle" class="lb-t lb-w">${f(w, 1)}</text>`;
        }
        const es = Math.max(-1, Math.min(1, S.out.est[k])), id = S.out.ideal[k];
        g += `<rect x="${X1 + 36}" y="${yt - 6}" width="36" height="${yd - yt + 12}" rx="4" fill="var(--panel)" stroke="var(--beam)"/><text x="${X1 + 54}" y="${yt + 10}" text-anchor="middle" class="lb-t">+</text><text x="${X1 + 54}" y="${yd + 2}" text-anchor="middle" class="lb-t">−</text>`;
        g += `<text x="${X1 + 78}" y="${(yt + yd) / 2 + 4}" class="lb-t lb-cap">y${k + 1} ${f(es * 1, 2)}</text><text x="${X1 + 78}" y="${(yt + yd) / 2 + 16}" class="lb-t lb-tm">이상 ${f(id, 2)}</text>`;
      }
      const svg = q('#lb-2d');
      svg.setAttribute('viewBox', `0 0 ${W + 40} ${H}`);
      svg.innerHTML = g;
    }

    // ── 스펙트럼: 뱅크 1 의 through(파랑)·drop(빨강), 채널 점선 ──
    function drawSpec(S) {
      const cfg = st.cfg, B = S.out.banks[0], sp = G.spectrum(cfg, B.det, B.offs, 600), p = S.out.p;
      const W = 860, H = 170, L = 40, Rr = 12, T = 12, Bm = 26, span = (cfg.m + 1) * cfg.sp;
      const X = d => L + (W - L - Rr) * (d + cfg.sp) / span, Y = v => T + (H - T - Bm) * (1 - v);
      let g = '';
      for (let i = 0; i < cfg.m; i++) g += `<path d="M${f(X(i * cfg.sp), 1)} ${T} V${H - Bm}" stroke="${chColor(i, cfg.m)}" stroke-dasharray="3 3" stroke-width="1.2"/><text x="${f(X(i * cfg.sp), 1)}" y="${H - 8}" text-anchor="middle" class="lb-t">λ${i + 1}</text>`;
      const path = k => 'M' + sp.map(o => `${f(X(o.d), 1)} ${f(Y(o[k]), 1)}`).join(' L');
      g += `<path d="${path('t')}" stroke="var(--probe)" stroke-width="1.6" fill="none"/><path d="${path('dr')}" stroke="var(--beam)" stroke-width="1.6" fill="none"/>`;
      g += `<path d="M${L} ${T} V${H - Bm} H${W - Rr}" stroke="var(--rule)" fill="none"/><text x="${L - 6}" y="${T + 8}" text-anchor="end" class="lb-t">1</text><text x="${L - 6}" y="${H - Bm}" text-anchor="end" class="lb-t">0</text>`;
      if ((cfg.m - 1) * cfg.sp > p.fsr) g += `<text x="${W - Rr}" y="${T + 10}" text-anchor="end" class="lb-t lb-warnt">채널 창 ${f((cfg.m - 1) * cfg.sp, 1)} nm > FSR ${f(p.fsr, 1)} nm — 링이 다른 채널에서도 공진한다</text>`;
      const svg = q('#lb-spec');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = g;
    }

    // ── 3D (three.js, 처음 열 때만 불러온다) ──
    let T3 = null;
    async function draw3d(S) {
      const box = q('#lb-3d');
      if (!T3) {
        box.textContent = '3D 불러오는 중…';
        try {
          const [THREE, OC] = await Promise.all([import('../../vendor/three/three.module.min.js'), import('../../vendor/three/OrbitControls.js')]);
          box.textContent = '';
          const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
          box.appendChild(r.domElement);
          const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
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
      const { THREE, scene, cam, ctl } = T3, { m, n, src } = st.cfg;
      if (T3.grp) { scene.remove(T3.grp); T3.grp.traverse(o => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose(); }); }
      const grp = new THREE.Group(), col = v => new THREE.Color(v);
      const add = (geo, c, x, y, z, e) => { const o = new THREE.Mesh(geo, new THREE.MeshStandardMaterial(e ? { color: c, emissive: c, emissiveIntensity: e } : { color: c })); o.position.set(x, y, z); grp.add(o); return o; };
      const Bx = (w, hh, d) => new THREE.BoxGeometry(w, hh, d);
      // 납작한 고리 도파로
      const ring = (R, c, x, z, e) => {
        const s = new THREE.Shape(); s.absarc(0, 0, R, 0, Math.PI * 2, false);
        const hl = new THREE.Path(); hl.absarc(0, 0, R - 0.07, 0, Math.PI * 2, true); s.holes.push(hl);
        const o = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: false, curveSegments: 40 }), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: e || 0.2 }));
        o.rotation.x = -Math.PI / 2; o.position.set(x, 0, z); grp.add(o);
      };
      const ink = col(css('--muted') || '#6B675E'), red = col(css('--beam') || '#C9472F');
      const step = 1.1, xb0 = 0, xb1 = xb0 + m * step, zIn = -(n - 1) * 0.9, wb = 0.07;
      add(Bx(xb1 + 7.5, 0.25, n * 1.8 + 2.4), col(css('--grid') || '#ECE8DF'), (xb1 - 6.4) / 2, -0.16, 0);
      // 입력 버스와 변조
      const xs = -5.6, xsplit = -1.4;
      if (src === 'comb') {
        add(Bx(0.8, 0.3, 0.6), col(css('--probe') || '#2C7A86'), xs - 0.5, 0.1, zIn);
        add(Bx(xsplit - xs, 0.05, wb), ink, (xs + xsplit) / 2, 0, zIn);
        for (let i = 0; i < m; i++) ring(0.28, col(chColor(i, m)), xs + 0.6 + (xsplit - xs - 1.0) * (i + 0.5) / m, zIn - 0.36, 0.15 + 0.6 * S.x[i]);
      } else {
        for (let i = 0; i < m; i++) add(Bx(0.5, 0.25, 0.3), col(chColor(i, m)), xs - 0.4, 0.1, zIn - 1.4 + 2.8 * (i + 0.5) / m, 0.2 + 0.6 * S.x[i]);
        add(Bx(0.35, 0.4, 2.6), ink, xs + 1.4, 0.15, zIn);
        add(Bx(xsplit - xs - 1.6, 0.05, wb), ink, (xs + 1.6 + xsplit) / 2, 0, zIn);
      }
      // n 갈래 → 뱅크마다 through(위)·drop(아래) 버스, 그 사이 링, 끝에 균형 검출기
      for (let k = 0; k < n; k++) {
        const zt = (k - (n - 1) / 2) * 1.8, zd = zt + 0.9;
        const dz = zt - zIn, Lr = Math.hypot(1.4, dz), br = add(Bx(Lr, 0.05, wb), ink, xsplit + 0.7, 0, (zIn + zt) / 2); br.rotation.y = Math.atan2(-dz, 1.4);
        add(Bx(xb1 - xb0 + 0.8, 0.05, wb), ink, (xb0 + xb1) / 2, 0, zt);
        add(Bx(xb1 - xb0 + 0.8, 0.05, wb), ink, (xb0 + xb1) / 2, 0, zd);
        add(Bx(0.7, 0.05, wb), ink, xb0 - 0.4, 0, zt);
        for (let i = 0; i < m; i++) { const w = S.out.weff[k][i]; ring(0.38, col(chColor(i, m)), xb0 + step * (i + 0.5), (zt + zd) / 2, 0.1 + 0.6 * (w + 1) / 2); }
        const es = Math.max(-1, Math.min(1, S.out.est[k]));
        add(Bx(0.45, 0.2 + 0.25 * Math.abs(es), 1.1), red, xb1 + 0.7, 0.1, (zt + zd) / 2);
      }
      scene.add(grp); T3.grp = grp;
      const key = m + 'x' + n + src;
      if (T3.key !== key) { const s = Math.max(m * 1.1, n * 1.8) + 7, cx = (xs + xb1) / 2; cam.position.set(cx + s * 0.2, s * 0.85, s * 0.9); ctl.target.set(cx, 0, 0.4); T3.key = key; }
    }

    // ── 오른쪽: 논문이 하려던 것 · 결과 ──
    function side(S) {
      const pre = PRE[st.pre], cfg = st.cfg, p = S.out.p;
      const trials = Math.max(60, Math.min(300, Math.round(3000 / (cfg.m * cfg.n))));
      const pr = G.precision(cfg, trials, st.seed), Rw = G.wRange(p, cfg.sp);
      const warn = [];
      if (cfg.sp < 3 * p.fwhm) warn.push(`채널 간격 ${f(cfg.sp)} nm 가 링 선폭 ${f(p.fwhm, 3)} nm 의 3배도 안 된다 — 공진 꼬리가 이웃 채널을 건드린다.`);
      if ((cfg.m - 1) * cfg.sp > p.fsr) warn.push(`채널 창 ${f((cfg.m - 1) * cfg.sp, 1)} nm 가 FSR ${f(p.fsr, 1)} nm 보다 넓다 — 링 하나가 두 채널에서 공진한다. 링을 작게(반지름↓) 하거나 채널을 줄이자.`);
      if (!cfg.cal && cfg.fab > 0.1) warn.push(`보정을 끈 채 제작 편차가 ${f(cfg.fab)} nm 다 — 링 공진이 제 채널에서 어긋나 가중치가 엉뚱해진다.`);
      if (cfg.tune !== 'pcm' && cfg.xt > 5) warn.push(`열 누화 ${cfg.xt}% — 한 링을 데우면 이웃 링 공진도 밀린다.`);
      const plist = A.papers('a2', pid => io.href(pid));
      const toP = plist ? h('button.cmp-topapers', { type: 'button', onclick: () => plist.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, `관련 논문 ${plist.querySelectorAll('.paper').length}편 ↓`) : null;
      const hist = histo(pr.errs, Math.max(0.03, 4 * pr.sigma));
      mount(sideEl,
        h('div', h('span.lb', pre.id.startsWith('tait') ? '프리셋 · 논문' : '가정 실험'), h('h2', pre.n), h('p.sub', pre.cite)),
        toP,
        h('div.det.lb-goal', h('span.lb', '논문이 하려던 것'), h('p', pre.goal), h('ul.lb-facts', pre.facts.map(x => h('li', x)))),
        h('div.lb-res',
          h('div.lb-big', h('b.mono', f(pr.bits, 1)), h('span', ' bit'), pre.report ? h('span.lb-rep', ` · 논문 보고 ${pre.report.bits} bit`) : null),
          h('p.note', `무작위 입력·가중치 ${trials}회 × 뱅크 ${cfg.n}개의 오차 σ = ${f(pr.sigma, 4)} → log₂(2/4σ) · 가중치는 부호를 가진다(−1 ~ +1)`),
          h('div.lb-hist', { html: hist })),
        warn.length ? h('div.warnbox.lb-warn', warn.map(w => h('p', w))) : null,
        h('div.lb-sec', h('span.lb', '링 한 개'),
          h('p.lb-kvs', h('span', `FSR ${f(p.fsr, 2)} nm · 선폭 ${f(p.fwhm, 3)} nm · Q ${Math.round(p.Q).toLocaleString()} · 피네스 ${f(p.F, 0)}`),
            h('span', `낼 수 있는 가중치 ${f(Rw.lo)} ~ ${f(Rw.hi)} (채널 간격 절반까지 디튜닝)`))),
        h('div.lb-sec', h('span.lb', '튜닝'),
          h('p.lb-kvs', h('span', cfg.tune === 'pcm' ? `PCM — 유지 전력 0 · ${cfg.lv} 단계` : `히터 — 평균 ${f(pr.power, 1)} mW (링 ${cfg.m * cfg.n}개, 링당 ${f(pr.power / (cfg.m * cfg.n), 2)} mW)`),
            h('span', `제작 편차 ${f(cfg.fab)} nm · ${cfg.cal ? '보정함' : '보정 안 함'}`))),
        plist);
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
      q('#lb-hint').textContent = mod ? `프리셋에서 ${mod}개 바꿈` : '프리셋 그대로';
      syncKnobs();
      const S = sample();
      q('#lb-2d').style.display = st.view === '2d' ? '' : 'none';   // SVG 요소는 hidden 속성이 듣지 않는다
      q('#lb-3d').hidden = st.view !== '3d';
      if (st.view === '2d') draw2d(S); else draw3d(S);
      drawSpec(S);
      mount(q('#lb-legend'), h('span', '링 색 = 맡은 파장 · 진할수록 가중치 +'), h('span', '균형 검출기 = drop − through'), st.view === '3d' ? h('span', '끌어서 돌리기 · 휠로 확대') : null);
      side(S);
    }

    q('#lb-assume').textContent = D.ASSUME + ' 모형은 add-drop 링의 해석식과 잡음까지다 — 장(field) 풀이는 하지 않는다.';
    q('#lb-reseed').onclick = () => io.set({ seed: st.seed + 1 });
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
  window.RingLab = { mount: mountLab };
})();
