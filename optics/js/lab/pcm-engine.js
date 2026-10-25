/* PCM 크로스바 물리 엔진 — 순수 함수. 브라우저에서는 window.PCM, node 에서는 module.exports.
   모형의 범위와 근사는 docs/lab-pcm.md. 단위: 길이 µm · 손실 dB · 출력 mW · NEP pW/√Hz · 대역폭 GHz */
(function (root) {
  'use strict';

  // 시드 고정 난수 — 같은 설정이면 같은 결과가 나와야 주소로 공유한 화면이 같다
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function gauss(r) { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const dB2lin = d => Math.pow(10, -d / 10);

  // 셀 투과율: 결정화 비율 c 에 대해 dB 손실을 선형 보간
  function cellT(mat, len, c) { return dB2lin(len * (mat.aa + c * (mat.ac - mat.aa))); }
  function range(mat, len) {
    const Ta = cellT(mat, len, 0), Tc = cellT(mat, len, 1);
    return { Ta, Tc, contrast: Ta - Tc, contrastDb: len * (mat.ac - mat.aa) };
  }
  // 가중치는 투과율 단계로 쓴다(논문들은 투과율을 보며 단계를 맞춘다). w=1 은 비정질 = 가장 밝음
  function quant(w, lv) { const k = Math.max(2, lv) - 1; return Math.round(Math.min(1, Math.max(0, w)) * k) / k; }
  function weightT(mat, len, wq) { const R = range(mat, len); return R.Tc + wq * R.contrast; }
  // 그 투과율을 내는 결정화 비율(화면 색칠용)
  function cOfT(mat, len, T) { const d = mat.ac - mat.aa; return d > 0 ? Math.min(1, Math.max(0, (-10 * Math.log10(T) / len - mat.aa) / d)) : 0; }

  // 손실 예산(최악 경로 근사)
  function budget(cfg, mat) {
    const { m, n, dc, cx, len } = cfg;
    const fan = 10 * Math.log10(m * n), dcs = dc * (m + n), cxs = cx * Math.max(0, m + n - 2), pcm = mat.aa * len;
    return { fan, dc: dcs, cx: cxs, pcm, total: fan + dcs + cxs + pcm };
  }

  // 한 번의 행렬-벡터 곱. W[i][j]: 입력 i(행 m개) → 출력 j(열 n개), x[i]∈[0,1]
  function forward(cfg, mat, W, x, r) {
    const { m, n, lv, src, er, p, nep, bw } = cfg;
    const R = range(mat, cfg.len), B = budget(cfg, mat);
    const Lp = dB2lin(B.total - B.pcm);          // 셀 흡수는 T 안에 따로 든다
    const P0 = p * 1e-3, sigP = nep * 1e-12 * Math.sqrt(bw * 1e9);
    const erl = Math.pow(10, er / 10);
    const xe = x.map(v => v + (1 - v) / erl);
    const ideal = [], est = [], pw = [];
    for (let j = 0; j < n; j++) {
      let S = 0, re = 0, im = 0, off = 0, id = 0;
      for (let i = 0; i < m; i++) {
        const T = weightT(mat, cfg.len, quant(W[i][j], lv));
        if (src === 'single') { const a = Math.sqrt(xe[i] * T), ph = 2 * Math.PI * r(); re += a * Math.cos(ph); im += a * Math.sin(ph); }
        else S += xe[i] * T;
        off += x[i] * R.Tc; id += x[i] * W[i][j];
      }
      if (src === 'single') S = re * re + im * im;
      const P = P0 * Lp * S + sigP * gauss(r);
      pw.push(P);
      ideal.push(id / m);
      est.push((P / (P0 * Lp) - off) / (m * R.contrast));
    }
    return { ideal, est, pw };
  }

  // 무작위 입력·가중치로 오차 분포를 잰다. bits = log2(1/(4σ)) — Feldmann 2021 의 σ=0.008 → 5 bit 와 맞는 정의
  function precision(cfg, mat, trials, seed) {
    const r = rng(seed || 1), errs = [];
    for (let t = 0; t < trials; t++) {
      const W = Array.from({ length: cfg.m }, () => Array.from({ length: cfg.n }, () => r()));
      const x = Array.from({ length: cfg.m }, () => r());
      const o = forward(cfg, mat, W, x, r);
      for (let j = 0; j < cfg.n; j++) errs.push(o.est[j] - o.ideal[j]);
    }
    const mu = errs.reduce((a, b) => a + b, 0) / errs.length;
    const sd = Math.sqrt(errs.reduce((a, b) => a + (b - mu) * (b - mu), 0) / errs.length);
    const bits = sd > 0 ? Math.max(0, Math.min(16, Math.log2(1 / (4 * sd)))) : 16;
    return { sigma: sd, bias: mu, bits, errs };
  }

  // 전부 1 을 넣고 전부 비정질일 때 한 출력에 닿는 세기(mW) — 검출기가 보는 가장 큰 신호
  function fullScale(cfg, mat) {
    const B = budget(cfg, mat);
    return cfg.p * dB2lin(B.total) * cfg.m;
  }

  const api = { rng, cellT, range, quant, weightT, cOfT, budget, forward, precision, fullScale };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PCM = api;
})(this);
