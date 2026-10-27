/* 링 가중치 뱅크 물리 엔진 — 순수 함수. 브라우저에서는 window.RING, node 에서는 module.exports.
   add-drop 링의 표준식(Bogaerts 외 2012 리뷰의 형태). 단위: 길이 µm · 파장 nm · 손실 dB/cm · 출력 mW · NEP pW/√Hz · 대역폭 GHz
   broadcast-and-weight(Tait 외 2017): 모든 파장이 한 버스에 실린 채 링마다 자기 파장만 디튜닝으로 drop/through 를 나누고,
   균형 검출기가 drop − through 를 읽는다 → 가중치 w ∈ [−1, 1], 역다중화 없음 */
(function (root) {
  'use strict';

  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function gauss(r) { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  // 링 한 개의 상수: 둘레 L, 한 바퀴 진폭 a, 자기결합 r(양쪽 같다고 둔다), FSR·선폭·Q
  function ringParams(cfg) {
    const L = 2 * Math.PI * cfg.R;                                   // µm
    const a = Math.pow(10, -(cfg.loss * L * 1e-4) / 20);             // dB/cm × cm → 진폭
    const r = Math.sqrt(Math.max(0, 1 - cfg.k2));                    // k2 = 파워 결합 비율
    const fsr = cfg.lam * cfg.lam / (cfg.ng * L * 1e3);              // nm  (λ² / (n_g·L))
    const ra = r * r * a;
    const fwhm = (1 - ra) * cfg.lam * cfg.lam / (Math.PI * cfg.ng * L * 1e3 * Math.sqrt(ra));
    return { L, a, r, fsr, fwhm, Q: cfg.lam / fwhm, F: fsr / fwhm };
  }
  // 공진에서 d(nm) 만큼 떨어진 파장의 through·drop 세기 투과율 (FSR 주기를 그대로 따른다)
  function tx(p, d) {
    const phi = 2 * Math.PI * d / p.fsr, { a, r } = p, c = Math.cos(phi);
    const den = 1 - 2 * r * r * a * c + Math.pow(r * r * a, 2);
    return { t: (r * r * a * a - 2 * r * r * a * c + r * r) / den, d: (1 - r * r) * (1 - r * r) * a / den };
  }
  // 링은 이웃 채널을 넘보지 않게 채널 간격의 절반까지만 민다. 그 창에서 낼 수 있는 가중치 끝값
  const reach = (p, sp) => Math.min(sp / 2, p.fsr / 2);
  function wRange(p, sp) { const on = tx(p, 0), off = tx(p, reach(p, sp)); return { hi: on.d - on.t, lo: off.d - off.t }; }
  // 원하는 가중치 w 를 내는 디튜닝(nm) — 그 창 안에서 단조라 이분법으로 찾는다. 창 밖 값은 끝값으로 잘린다
  function detuneFor(p, w, sp) {
    const R = wRange(p, sp), tgt = Math.min(R.hi, Math.max(R.lo, w));
    let lo = 0, hi = reach(p, sp);
    for (let k = 0; k < 50; k++) { const mid = (lo + hi) / 2, x = tx(p, mid); if (x.d - x.t > tgt) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }
  function quant(w, lv) { const k = Math.max(2, lv) - 1; return Math.round((Math.min(1, Math.max(-1, w)) + 1) / 2 * k) / k * 2 - 1; }

  // 뱅크 하나: 채널 i(파장 λ0 + i·Δλ)에 대해 링 j 들을 차례로 지난다. 링 j 의 공진 = λj + 디튜닝 + 제작 편차 + 열 누화
  // drop 은 각 링이 그 자리에서 떼어 낸 몫의 합, through 는 끝까지 남은 몫. 균형 검출기 = drop − through
  function bank(cfg, p, det, offs) {
    const m = det.length, eff = [];
    for (let i = 0; i < m; i++) {
      let pass = 1, drop = 0;
      for (let j = 0; j < m; j++) {
        const x = tx(p, (i - j) * cfg.sp - det[j] - offs[j]);
        drop += pass * x.d; pass *= x.t;
      }
      eff.push(drop - pass);
    }
    return eff;
  }
  // 튜닝: 링마다 목표 가중치를 내는 디튜닝을 정하고, 제작 편차를 얹는다. PCM 은 단계 수로 양자화되고 유지 전력이 없다
  function tuning(cfg, p, Wcol, r) {
    const m = Wcol.length, pcm = cfg.tune === 'pcm';
    const tgt = Wcol.map(w => pcm ? quant(w, cfg.lv) : w);
    const det = tgt.map(w => detuneFor(p, w, cfg.sp));
    const fab = Array.from({ length: m }, () => cfg.fab * gauss(r));
    // 히터가 미는 양: 보정하면 편차까지 상쇄하도록 민다
    const push = det.map((d, j) => cfg.cal ? d - fab[j] : d);
    return { det, fab, tgt, push, pcm };
  }
  // 열 누화(Tait 2017): 뱅크 안 이웃 링의 열은 보정으로 지웠고, 뱅크 사이(같은 자리 링)의 열은 보정하지 않았다 — 그게 오차로 남았다고 보고
  // 보정 끔: 제작 편차 + 뱅크 안·사이 누화가 모두 남는다 · 보정 켬: 뱅크 사이 누화만 남는다 · PCM: 열이 없다
  function offsets(cfg, banks) {
    const n = banks.length, m = banks[0].det.length, x = cfg.xt / 100;
    return banks.map((B, k) => B.det.map((_, j) => {
      if (B.pcm) return cfg.cal ? 0 : B.fab[j];
      const inter = x * (((banks[k - 1] || {}).push || [])[j] || 0) + x * (((banks[k + 1] || {}).push || [])[j] || 0);
      const intra = x * ((B.push[j - 1] || 0) + (B.push[j + 1] || 0));
      return cfg.cal ? inter : B.fab[j] + intra + inter;
    }));
  }

  function forward(cfg, W, x, r) {
    const p = ringParams(cfg), m = cfg.m, n = cfg.n;
    const P0 = cfg.p * 1e-3 / n, sigP = cfg.nep * 1e-12 * Math.sqrt(cfg.bw * 1e9);
    const banks = [];
    for (let k = 0; k < n; k++) banks.push(tuning(cfg, p, W.map(row => row[k]), r));
    const offs = offsets(cfg, banks);
    const ideal = [], est = [], weff = [];
    let power = 0;
    for (let k = 0; k < n; k++) {
      const B = banks[k], eff = bank(cfg, p, B.det, offs[k]);
      B.offs = offs[k];
      if (!B.pcm) power += B.push.reduce((s, d) => s + Math.abs(d) / cfg.eta, 0);
      weff.push(eff);
      let S = 0, id = 0;
      for (let i = 0; i < m; i++) { S += x[i] * eff[i]; id += x[i] * W[i][k]; }
      const P = P0 * S + sigP * Math.SQRT2 * gauss(r);                 // 균형 검출기 두 개의 잡음
      est.push(P / P0 / m); ideal.push(id / m);
    }
    return { ideal, est, weff, banks, power, p };
  }

  // 정밀도: 무작위 입력·가중치로 오차를 잰다. 결과 폭이 [−1, 1] 이라 bits = log2(2 / (4σ))
  function precision(cfg, trials, seed) {
    const r = rng(seed || 1), errs = [];
    let power = 0;
    for (let t = 0; t < trials; t++) {
      const W = Array.from({ length: cfg.m }, () => Array.from({ length: cfg.n }, () => 2 * r() - 1));
      const x = Array.from({ length: cfg.m }, () => r());
      const o = forward(cfg, W, x, r);
      power += o.power;
      for (let k = 0; k < cfg.n; k++) errs.push(o.est[k] - o.ideal[k]);
    }
    const mu = errs.reduce((s, e) => s + e, 0) / errs.length;
    const sd = Math.sqrt(errs.reduce((s, e) => s + (e - mu) * (e - mu), 0) / errs.length);
    return { sigma: sd, bias: mu, bits: sd > 0 ? Math.max(0, Math.min(16, Math.log2(2 / (4 * sd)))) : 16, errs, power: power / trials };
  }

  // 그림용 스펙트럼: 채널 창 전체에서 뱅크의 through·drop 을 파장마다 계산
  function spectrum(cfg, det, offs, N) {
    const p = ringParams(cfg), m = det.length, span = (m + 1) * cfg.sp, out = [];
    for (let s = 0; s <= N; s++) {
      const d0 = -cfg.sp + span * s / N;    // 채널 0 기준 파장 오프셋(nm)
      let pass = 1, drop = 0;
      for (let j = 0; j < m; j++) { const x = tx(p, d0 - j * cfg.sp - det[j] - offs[j]); drop += pass * x.d; pass *= x.t; }
      out.push({ d: d0, t: pass, dr: drop });
    }
    return out;
  }

  const api = { rng, ringParams, tx, wRange, detuneFor, quant, bank, tuning, offsets, forward, precision, spectrum };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RING = api;
})(this);
