/* A군 — 행렬곱. 구조마다 render(S) 순수 모델 + controls. 페이지(compute.js)가 그림·손잡이를 그린다 */
(function () {
  'use strict';
  const PAL = { beam: '#D62A1F', probe: '#2457E6', warm: '#D1A017', wall: '#6B5B4E', panel: '#FFFFFF', ink: '#16233A', muted: '#55657F', rule: '#D5DCE8', grid: '#E9EEF5', bg: '#F8F9FB' };
  const col = k => PAL[k.replace(/^--/, '')] || '#000';
  const D2R = Math.PI / 180, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), fmt = (v, n) => v.toFixed(n == null ? 2 : n);

  /* 03 D²NN */
  const N3 = 128;
  function prop(re, im, d) {
    const Re = new Float64Array(N3), Im = new Float64Array(N3);
    for (let k = 0; k < N3; k++) { let a = 0, b = 0; for (let n = 0; n < N3; n++) { const t = -2 * Math.PI * k * n / N3, c = Math.cos(t), s = Math.sin(t); a += re[n] * c - im[n] * s; b += re[n] * s + im[n] * c; } Re[k] = a; Im[k] = b; }
    for (let k = 0; k < N3; k++) { const f = (k < N3 / 2 ? k : k - N3) / N3, ph = -Math.PI * d * f * f * 40, c = Math.cos(ph), s = Math.sin(ph), a = Re[k], b = Im[k]; Re[k] = a * c - b * s; Im[k] = a * s + b * c; }
    const or_ = new Float64Array(N3), oi = new Float64Array(N3);
    for (let n = 0; n < N3; n++) { let a = 0, b = 0; for (let k = 0; k < N3; k++) { const t = 2 * Math.PI * k * n / N3, c = Math.cos(t), s = Math.sin(t); a += Re[k] * c - Im[k] * s; b += Re[k] * s + Im[k] * c; } or_[n] = a / N3; oi[n] = b / N3; }
    return [or_, oi];
  }
  function mask(re, im, foc, tilt) {
    for (let n = 0; n < N3; n++) { const u = (n - N3 / 2) / N3, ph = -foc * 0.06 * u * u * N3 + tilt * 0.12 * u * N3 * 0.08, c = Math.cos(ph), s = Math.sin(ph), a = re[n], b = im[n]; re[n] = a * c - b * s; im[n] = a * s + b * c; }
  }
  /* 04 4f */
  const N4 = 64;
  function sig(kind) {
    const a = new Float64Array(N4), bump = (c, w, h) => { for (let n = 0; n < N4; n++) { const u = (n - c) / w; a[n] += h * Math.exp(-u * u); } };
    if (kind === 'A' || kind === 'AN') { bump(18, 2.2, 1); bump(26, 1.6, .7); bump(38, 2.6, .9); } else bump(30, 6, 1);
    if (kind === 'AN') for (let n = 0; n < N4; n++) a[n] += (Math.sin(n * 12.9898) * 43758.5453 % 1) * 0.35;
    return a;
  }
  function dft(re, im, inv) {
    const R = new Float64Array(N4), I = new Float64Array(N4), s = inv ? 1 : -1;
    for (let k = 0; k < N4; k++) { let a = 0, b = 0; for (let n = 0; n < N4; n++) { const t = s * 2 * Math.PI * k * n / N4, c = Math.cos(t), q = Math.sin(t); a += re[n] * c - im[n] * q; b += re[n] * q + im[n] * c; } R[k] = inv ? a / N4 : a; I[k] = inv ? b / N4 : b; }
    return [R, I];
  }
  let timer7 = null;

  const A = [
    {
      id: 'a1', num: '01', tab: 'MZI 메시', title: 'MZI 메시', fig: { type: 'svg', w: 880, h: 370 }, label: '4×4 MZI 메시 — 광원에서 검출까지',
      idea: [['2×2 유니터리를 격자로 쌓아 임의 행렬을 만든다(Reck·Clements 분해). 가중치는 '], ['위상', 1], ['이 들고 있다.']],
      note: '4채널 전체 메시와 실물 배치·단면은 따로 있다 → <a href="https://claude.ai/artifact/1rU7rNCNLmKpuXvThQPB9S">4×4 광 연산 메시</a>',
      controls: [{ type: 'range', k: 'th', label: 'θ', min: 0, max: 360, step: 1, def: 90, fmt: v => v + '°' }],
      render(S) {
        const th = S.th, s = Math.sin(th * D2R / 2) ** 2;
        const P = CYC.pen(), Y = [60, 92, 124, 156], X0 = 150, X1 = 640;
        // ① 광원 → 1×4 → ② 변조기(입력 x)
        P.laser(38, 108);
        P.split(61, 108, Y, { id: false, L: 40 });
        Y.forEach((y, i) => P.mod(124, y, { w: 34, lab: 'x' + (i + 1) }));
        // ③ 칩: Clements 4×4 = MZI 6개. MZI = 결합기 · θ(나눔) · 결합기 · φ(위상)
        P.zone(X0 + 4, 34, X1 - X0 - 4, 148, '실리콘 칩 · MZI 6개');
        const MZ = [[210, 0], [210, 2], [300, 1], [390, 0], [390, 2], [480, 1]], gap = {};
        MZ.forEach(([xc, r]) => [r, r + 1].forEach(k => (gap[k] = gap[k] || []).push([xc - 34, xc - 10], [xc + 10, xc + 34])));
        Y.forEach((y, k) => { let x = X0; (gap[k] || []).sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { P.path(`M${x} ${y} H${a}`, { c: 'faint', w: 1.5 }); x = b; }); P.path(`M${x} ${y} H${X1}`, { c: 'faint', w: 1.5 }); });
        P.mark('wg', [560, Y[3] - 3, 60, 6]);
        MZ.forEach(([xc, r], i) => {
          const y = Y[r] + 16;
          P.coupler(xc - 22, y, { w: 24, g: 16 }); P.coupler(xc + 22, y, { w: 24, g: 16 });
          P.ps(xc, Y[r], { w: 16, v: i ? 0.3 + 0.6 * Math.abs(Math.sin(i * 1.9)) : s, lab: i ? '' : 'θ' });
          P.ps(xc + 45, Y[r], { w: 14, v: 0.3 + 0.6 * Math.abs(Math.cos(i * 1.3)), lab: i ? '' : 'φ' });
        });
        // 첫 MZI 의 나눔이 그 뒤로 퍼지는 빛
        P.beam([[X0, Y[0]], [176, Y[0]]], { w: 2.4 }); P.beam([[X0, Y[1]], [176, Y[1]]], { w: 1.2, op: .5 });
        P.beam([[244, Y[0]], [352, Y[0]]], { w: 1 + 3 * s, op: .25 + .75 * s }); P.beam([[244, Y[1]], [266, Y[1]]], { w: 1 + 3 * (1 - s), op: .25 + .75 * (1 - s) });
        // ④ 검출 → ⑤ TIA → ADC
        const out = [s, 1 - s, .55, .45];
        Y.forEach((y, i) => { P.beam([[X1, y], [652, y]], { w: 1.2 + 2 * out[i], op: .4 + .6 * out[i] }); P.pd(660, y, { v: out[i] }); P.wire([[670, y], [706, y]]); });
        P.box(734, 108, 54, 124, 'TIA', { id: 'tia' });
        P.wire([[761, 108], [789, 108]]);
        P.box(815, 108, 48, 124, 'ADC', { id: 'adc' });
        // 디지털 결과가 다음 층 입력으로 — DAC 가 변조기를 다시 몬다
        P.wire([[815, 170], [815, 200], [150, 200]], { arrow: false }); P.box(124, 200, 44, 22, 'DAC', { s: 10 }); P.at2('adc', [124, 200]);
        P.wire([[124, 189], [124, 168]]);
        P.lab(330, 195, '다음 층 입력', { s: 9.5, c: 'probe' });
        P.legend(16, 250, ['광원', '변조', '위상 메시', '검출', 'TIA·ADC']);
        // 보조: MZI 하나의 나눔 (θ)
        P.aux(470, 222, 402, 142, 'MZI 하나 — θ 가 나눔비');
        P.raw(CYC.sub(474, 236, 394, 124, '0 0 440 150', `<path class="wg" stroke-width="1.4" opacity=".55" d="M40 40 C70 40 70 75 100 75 H150 C180 75 180 40 210 40 H250 C280 40 280 75 310 75"/>
            <path class="wg" stroke-width="1.4" opacity=".55" d="M40 110 C70 110 70 75 100 75 H150 C180 75 180 110 210 110 H250 C280 110 280 75 310 75"/>
            <path class="bm" stroke-width="5" opacity=".9" d="M14 40 H40"/>
            <rect class="ht" x="212" y="37" width="36" height="6" rx="2" opacity=".9"/>
            <text class="m" x="230" y="28" font-size="11" text-anchor="middle">θ = ${th}°</text>
            <path class="bm" stroke-width="${(1 + 5 * s).toFixed(2)}" opacity="${(0.15 + 0.85 * s).toFixed(2)}" d="M310 75 C340 75 340 40 370 40 H400"/>
            <path class="bm" stroke-width="${(1 + 5 * (1 - s)).toFixed(2)}" opacity="${(0.15 + 0.85 * (1 - s)).toFixed(2)}" d="M310 75 C340 75 340 110 370 110 H400"/>
            <text class="i" x="406" y="44" font-size="12">${fmt(s)}</text>
            <text class="i" x="406" y="114" font-size="12">${fmt(1 - s)}</text>
            <text class="m" x="40" y="140" font-size="11">결합기 → 위상 → 결합기</text>`));
        return {
          svg: P.out(),
          stats: [{ l: '통과', v: fmt(s), c: PAL.beam }, { l: '건너감', v: fmt(1 - s) }],
          read: '세기 비율 = sin²(θ/2) : cos²(θ/2) — 첫 MZI 의 θ 가 그 뒤 두 줄로 빛을 나눈다'
        };
      }
    },
    {
      id: 'a2', num: '02', tab: '링 가중치 뱅크', title: '마이크로링 가중치 뱅크', fig: { type: 'svg', w: 880, h: 270 }, label: '콤 광원에서 검출기 합까지',
      idea: [['파장마다 가중치 하나. '], ['WDM 채널 수가 곧 행렬 크기', 1], ['이고, 합산은 검출기 하나가 광전류를 더해서 한다.']],
      note: '온도를 조금만 올려도 네 링이 <b>같이</b> 밀린다. 그게 파장 락킹 회로가 필요한 이유다.',
      controls: [0, 1, 2, 3].map(i => ({ type: 'range', k: 'd' + i, label: 'λ' + (i + 1) + ' 디튜닝', min: -30, max: 30, step: 1, def: 0, fmt: v => v + ' pm' }))
        .concat([{ type: 'range', k: 'T', label: '칩 온도', min: 0, max: 30, step: 1, def: 0, fmt: v => '+' + v + ' K', warm: 1, sep: 1 }]),
      render(S) {
        const G = 9, X = [1, .8, .6, 1], det = [S.d0, S.d1, S.d2, S.d3];
        const w = det.map(d => 1 / (1 + ((d + S.T * 1.4) / G) ** 2)), w0 = det.map(d => 1 / (1 + (d / G) ** 2));
        const sum = w.reduce((s, v, i) => s + v * X[i], 0), sum0 = w0.reduce((s, v, i) => s + v * X[i], 0);
        let g = `<path class="wg" stroke-width="2.2" opacity=".5" d="M20 140 H330"/><path class="bm" stroke-width="4.5" opacity=".85" d="M20 140 H70"/>`;
        for (let i = 0; i < 4; i++) {
          const cx = 80 + i * 68, a = w[i];
          g += `<circle class="wg" cx="${cx}" cy="112" r="20" stroke-width="${(1.2 + 2.6 * a).toFixed(2)}" opacity="${(0.3 + 0.7 * a).toFixed(2)}"/>`;
          g += `<rect class="ht" x="${cx - 13}" y="80" width="26" height="5" rx="2" opacity=".85"/>`;
          g += `<text class="m" x="${cx}" y="74" font-size="9.5" text-anchor="middle">λ${i + 1}</text>`;
          g += `<text class="${a > .5 ? 'a' : 'm'}" x="${cx}" y="116" font-size="10" text-anchor="middle">${fmt(a)}</text>`;
          g += `<text class="m" x="${cx}" y="160" font-size="9" text-anchor="middle">x=${fmt(X[i], 1)}</text>`;
        }
        const fill = clamp(sum / 3.4, 0, 1);
        g += `<rect class="pd" x="336" y="124" width="30" height="32" rx="3" stroke-width="1.3"/>`;
        g += `<rect class="pdf" x="336" y="${(156 - 32 * fill).toFixed(1)}" width="30" height="${(32 * fill).toFixed(1)}" rx="2" opacity=".85"/>`;
        g += `<text class="p" x="374" y="144" font-size="11">Σ ${fmt(sum)}</text><text class="m" x="336" y="176" font-size="9">검출기가 더한다</text>`;
        g += `<text class="m" x="20" y="36" font-size="10">링 하나 = 가중치 하나 · 파장 하나</text>`;
        // 사이클: 콤 → 디먹스 → 변조기(x) → 먹스 → 링 뱅크(위 그림, 가중치) → PD(합) → TIA → ADC · 파장 락
        const P = CYC.pen(), YE = [131, 157, 183, 209];
        P.laser(38, 170, { id: 'src-comb' });
        P.beam([[61, 170], [79, 170]]);
        P.wdm(90, 170, 100, { lab: '' });
        YE.forEach((y, i) => { P.beam([[101, 170 + (y - 170) * .9], [123, y]], { w: 1.4 }); P.mod(140, y, { w: 32, lab: 'x' + (i + 1) }); P.beam([[156, y], [178, 170 + (y - 170) * .9]], { w: 1.4 }); });
        P.path('M178 120 L200 163 L200 177 L178 220 Z', { c: 'ink', w: 1.3, f: 'grid' });
        P.beam([[200, 170], [270, 170]], { w: 3 });
        P.raw(`<g transform="translate(250 30)">${g}</g>`);
        P.mark('ring', [310, 122, 40, 40], [348, 126]); P.mark('ps', [317, 110, 26, 5]); P.mark('pd', [586, 154, 30, 32]);
        P.wire([[618, 170], [652, 170]]); P.box(677, 170, 46, 28, 'TIA', { id: 'tia' }); P.wire([[700, 170], [726, 170]]); P.box(749, 170, 44, 28, 'ADC', { id: 'adc' });
        P.box(700, 96, 74, 24, '파장 락', { id: 'lock', tone: 'probe', s: 10 });
        P.wire([[677, 156], [677, 108]]); P.wire([[663, 96], [580, 96], [580, 92], [300, 92]], { arrow: false });
        [330, 398, 466, 534].forEach(x => P.wire([[x + 14, 92], [x + 14, 108]]));
        P.legend(16, 244, ['콤', '디먹스·변조', '링 가중치', '검출 Σ', 'TIA·ADC']);
        const err = Math.abs(sum - sum0) / Math.max(sum0, 1e-6) * 100;
        return {
          svg: P.out(), stats: [{ l: '출력 Σwᵢxᵢ', v: fmt(sum), c: PAL.probe }],
          read: `가중치 ${w.map(v => fmt(v)).join(' · ')}<br>` + (S.T > 0 ? `<span style="color:var(--wall)">온도 +${S.T} K → 의도한 값에서 ${fmt(err, 1)}% 벗어남</span>` : '온도 0 K — 의도한 값 그대로')
        };
      }
    },
    {
      id: 'a3', num: '03', tab: '회절 신경망', title: '회절 신경망 (D²NN)', fig: { type: 'canvas', w: 880, h: 300 }, label: '두 장의 마스크와 출력면',
      stack: { rects: [[10, 20, 665, 265], [672, 40, 205, 245]] },
      idea: [['마스크 여러 장을 통과시키면 층이 쌓인다. 가중치는 '], ['마스크의 위상 패턴', 1], ['이고, 연산은 전파가 공짜로 한다.']],
      note: '1차원 프레넬 전파를 128점으로 실제 계산한다. 출력 칸 넷 중 가장 밝은 칸이 분류 결과다.',
      controls: [
        { type: 'range', k: 'fa', label: '마스크1 초점', min: -100, max: 100, step: 1, def: 55 },
        { type: 'range', k: 'ta', label: '마스크1 기울기', min: -60, max: 60, step: 1, def: 0 },
        { type: 'range', k: 'fb', label: '마스크2 초점', min: -100, max: 100, step: 1, def: 40 },
        { type: 'range', k: 'tb', label: '마스크2 기울기', min: -60, max: 60, step: 1, def: 22 }],
      render(S) {
        let re = new Float64Array(N3), im = new Float64Array(N3);
        for (let n = 0; n < N3; n++) { const u = (n - N3 / 2) / 18; re[n] = Math.exp(-u * u); }
        mask(re, im, S.fa, S.ta); const A1 = [re.slice(), im.slice()]; let [r, i] = prop(re, im, 1);
        mask(r, i, S.fb, S.tb); const A2 = [r.slice(), i.slice()]; [r, i] = prop(r, i, 1);
        const I = [...r].map((v, n) => v * v + i[n] * i[n]), mx = Math.max(...I, 1e-9), bins = [0, 0, 0, 0];
        for (let n = 0; n < N3; n++) bins[clamp(Math.floor(n / (N3 / 4)), 0, 3)] += I[n];
        const best = bins.indexOf(Math.max(...bins)), tot = bins.reduce((a, b) => a + b, 0);
        return {
          draw(cx, W, H) {
            cx.clearRect(0, 0, W, H);
            // 전파 띠 — 마스크 뒤 거리 z 에서의 세기 |E(x,z)|² 를 14단계로 실제 전파해 칠한다. 초점·기울기를 바꾸면 띠가 모이고 휜다
            const strip = (x0, x1, [r0, i0]) => {
              const K = 14, w = (x1 - x0) / K;
              for (let k = 1; k <= K; k++) {
                const [pr, pi] = prop(r0, i0, k / K); let m = 1e-9; const J = new Float64Array(N3);
                for (let n = 0; n < N3; n++) { J[n] = pr[n] * pr[n] + pi[n] * pi[n]; if (J[n] > m) m = J[n]; }
                for (let n = 0; n < N3; n += 2) { const a = Math.min(1, (J[n] + J[n + 1]) / (2 * m)); if (a < .05) continue; cx.globalAlpha = .1 + .75 * a; cx.fillStyle = col('--beam'); cx.fillRect(x0 + (k - 1) * w, 50 + n / N3 * 200, w + .6, 200 / N3 * 2 + .6); }
              }
              cx.globalAlpha = 1;
            };
            // 입사: 가우시안 빔이 마스크 1 로
            for (let n = 0; n < N3; n += 2) { const u = (n - N3 / 2) / 18, a = Math.exp(-u * u); if (a < .05) continue; cx.globalAlpha = .08 + .5 * a; cx.fillStyle = col('--beam'); cx.fillRect(30, 50 + n / N3 * 200, 104, 200 / N3 * 2 + .6); }
            cx.globalAlpha = 1;
            strip(150, 392, A1); strip(410, 652, A2);
            // 마스크 선 — 기울기 슬라이더만큼 기운다(선형 위상 = 빔 조향), 초점은 라벨로
            const tiltLine = (x, t) => { const dx = Math.tan(t / 60 * 9 * D2R) * 110; cx.beginPath(); cx.moveTo(x - dx, 30); cx.lineTo(x + dx, 250); cx.stroke(); };
            cx.strokeStyle = col('--rule'); cx.lineWidth = 2;
            cx.strokeStyle = col('--warm'); cx.lineWidth = 3; tiltLine(140, S.ta); tiltLine(400, S.tb);
            cx.strokeStyle = col('--rule'); cx.lineWidth = 2; cx.beginPath(); cx.moveTo(660, 30); cx.lineTo(660, 250); cx.stroke();
            cx.fillStyle = col('--muted'); cx.font = '13px IBM Plex Mono, monospace';
            cx.fillText('마스크 1', 110, 270); cx.fillText('마스크 2', 370, 270); cx.fillText('출력면', 640, 270);
            cx.font = '10.5px IBM Plex Mono, monospace';
            cx.fillText(`초점 ${S.fa} · 기울기 ${S.ta}`, 86, 286); cx.fillText(`초점 ${S.fb} · 기울기 ${S.tb}`, 346, 286);
            cx.fillText('|E|² — 거리별 실제 전파', 150, 42);
            cx.strokeStyle = col('--beam'); cx.lineWidth = 2; cx.beginPath();
            for (let n = 0; n < N3; n++) { const y = 250 - (I[n] / mx) * 200, x = 680 + n * 1.5; n ? cx.lineTo(x, y) : cx.moveTo(x, y); } cx.stroke();
            for (let b = 0; b < 4; b++) {
              const x0 = 680 + b * (N3 / 4) * 1.5, w = (N3 / 4) * 1.5;
              cx.fillStyle = col(b === best ? '--beam' : '--grid'); cx.globalAlpha = b === best ? .18 : .5; cx.fillRect(x0, 50, w, 200); cx.globalAlpha = 1;
              cx.fillStyle = col(b === best ? '--beam' : '--muted'); cx.font = '12px IBM Plex Mono, monospace'; cx.fillText('C' + (b + 1), x0 + w / 2 - 9, 270);
            }
          },
          stats: [{ l: '분류 결과', v: 'C' + (best + 1), c: PAL.beam }, { l: '확신도', v: fmt(bins[best] / tot * 100, 1) + '%' }],
          read: `칸별 세기 ${bins.map(b => fmt(b / tot, 2)).join(' · ')}`
        };
      }
    },
    {
      id: 'a4', num: '04', tab: '4f 상관기', title: '4f 상관기 · 정합 필터', fig: { type: 'svg', w: 880, h: 330 }, label: '4f 상관기 — 입력면 · 렌즈 · 푸리에 면 필터 · 렌즈 · 출력면',
      idea: [['렌즈가 푸리에 변환을 공짜로 해준다. 푸리에 면에 '], ['찾는 패턴의 켤레', 1], ['를 놓으면, 맞을 때만 출력에 뾰족한 봉우리가 선다.']],
      note: '64점 DFT로 실제 상관을 계산한다. 필터와 입력이 어긋나면 봉우리가 주저앉는다.',
      controls: [
        { type: 'seg', k: 'inp', label: '입력', def: 'A', opts: [['A', 'A'], ['B', 'B'], ['AN', 'A+잡음']] },
        { type: 'seg', k: 'flt', label: '필터', def: 'A', opts: [['A', 'A에 정합'], ['B', 'B에 정합']] }],
      render(S) {
        const in4 = S.inp, fl4 = S.flt, x = sig(in4), t = sig(fl4);
        const [XR, XI] = dft(x, new Float64Array(N4), false), [TR, TI] = dft(t, new Float64Array(N4), false);
        const PR = new Float64Array(N4), PI = new Float64Array(N4);
        for (let k = 0; k < N4; k++) { PR[k] = XR[k] * TR[k] + XI[k] * TI[k]; PI[k] = XI[k] * TR[k] - XR[k] * TI[k]; }
        const [cr, ci] = dft(PR, PI, true), C = [...cr].map((v, n) => Math.hypot(v, ci[n]));
        const peak = Math.max(...C), at = C.indexOf(peak), mean = C.reduce((a, b) => a + b, 0) / N4, ok = in4[0] === fl4[0];
        const TM = [...TR].map((v, k) => Math.hypot(v, TI[k]));
        const xm = Math.max(...x), tm = Math.max(...TM), shift = k => TM[(k + N4 / 2) % N4];
        // 사이클: LD → 입력면(SLM) → f → 렌즈 → f → 푸리에 면 필터(가중치) → f → 렌즈 → f → 출력면(카메라)
        const P = CYC.pen(), Y = 96, XS = [150, 260, 370, 480, 590];
        P.laser(38, Y);
        P.path(`M61 ${Y - 3} L${XS[0]} ${Y - 38} L${XS[1]} ${Y - 38} L${XS[2]} ${Y} L${XS[3]} ${Y - 38} L${XS[4]} ${Y - 38} L${XS[4]} ${Y + 38} L${XS[3]} ${Y + 38} L${XS[2]} ${Y} L${XS[1]} ${Y + 38} L${XS[0]} ${Y + 38} L61 ${Y + 3} Z`, { c: 'none', f: 'beam', fo: .07 });
        P.beam([[61, Y - 3], [XS[0], Y - 38], [XS[1], Y - 38], [XS[2], Y], [XS[3], Y + 38], [XS[4], Y + 38]], { w: 1.3, op: .8 });
        P.beam([[61, Y + 3], [XS[0], Y + 38], [XS[1], Y + 38], [XS[2], Y], [XS[3], Y - 38], [XS[4], Y - 38]], { w: 1.3, op: .8 });
        P.grid(XS[0] - 7, Y - 40, 14, 80, 16, 1, { id: 'slm', vals: i => x[Math.round(i * (N4 - 1) / 15)] / xm });
        P.lens(XS[1], Y, 96); P.lens(XS[3], Y, 96);
        P.plate(XS[2], Y, 84, { n: 16, vals: [...Array(16)].map((_, i) => shift(Math.round(i * (N4 - 1) / 15)) / tm) });
        P.cam(XS[4], Y, 24, 84, { n: 16, vals: i => C[Math.round(i * (N4 - 1) / 15)] / peak, lab: '' });
        [205, 315, 425, 535].forEach(xx => P.lab(xx, Y + 56, 'f', { a: 'middle', c: 'ink', s: 11 }));
        [['입력면', 0], ['렌즈', 1], ['푸리에 면', 2], ['렌즈', 3], ['카메라', 4]].forEach(([t, i]) => P.lab(XS[i], Y - 50, t, { a: 'middle', s: 10 }));
        P.wire([[604, Y], [650, Y]]);
        P.text(660, Y - 6, '봉우리 / 평균', { s: 10.5, c: 'muted' }); P.text(660, Y + 16, fmt(peak / mean, 1), { s: 18, c: ok ? 'probe' : 'wall', b: 1 });
        P.text(660, Y + 36, ok ? '정합 — 봉우리' : '불일치', { s: 10, c: ok ? 'probe' : 'wall' });
        // 아래: 세 면에서 실제로 보이는 것 — 64점 DFT 로 계산
        const plot = (cx, title, arr, c, norm, dot) => {
          const x0 = cx - 95, y0 = 276; P.lab(x0, 192, title, { s: 10 });
          P.path(`M${x0} ${y0} H${x0 + 190}`, { c: 'rule', w: 1 });
          P.poly(arr.map((v, n) => [x0 + n * 190 / (N4 - 1), y0 - v / norm * 66]), { c, w: 1.8 });
          if (dot != null) P.circ(x0 + dot * 190 / (N4 - 1), y0 - 66, 4, { c: 'none', f: 'probe' });
        };
        plot(130, '입력 ' + (in4 === 'AN' ? 'A+잡음' : in4), [...x], 'beam', xm);
        plot(XS[2], '푸리에 면 · 필터 ' + fl4, [...Array(N4)].map((_, k) => shift(k)), 'warm', tm);
        plot(610, '출력 상관', C, 'probe', peak, at);
        P.legend(16, 292, ['광원', '입력면', '렌즈', '필터 = 가중치', '렌즈', '카메라']);
        return {
          svg: P.out(),
          stats: [{ l: '봉우리 / 평균', v: fmt(peak / mean, 1), c: PAL.probe }, { l: '위치', v: String(at) }],
          read: ok ? '<span style="color:var(--probe)">정합 — 봉우리가 섰다</span>' : '<span style="color:var(--wall)">불일치 — 봉우리가 주저앉았다</span>'
        };
      }
    },
    {
      id: 'a5', num: '05', tab: 'PCM 크로스바', title: 'PCM 크로스바', fig: { type: 'svg', w: 880, h: 292 }, label: 'PCM 크로스바 4×4 — 광원에서 검출까지',
      idea: [['상변화 재료의 결정 상태가 가중치다. '], ['전원을 꺼도 값이 남는다', 1], [' — 위상이 들고 있던 가중치와 갈리는 지점.']],
      note: '칸을 누르면 결정 상태가 바뀐다(0 → 0.5 → 1). 전원을 꺼보면 왜 비휘발이 승부처인지 보인다.',
      init: () => ({ w: [[1, .5, 0, .5], [0, 1, .5, 0], [.5, 0, 1, .5], [1, .5, .5, 0]], off: false, writes: 0 }),
      controls: [
        { type: 'btn', label: S => S.off ? '전원 켜기' : '전원 끄기', on: S => S.off, act: (S, set) => set({ off: !S.off }) },
        { type: 'btn', label: () => '가중치 무작위', act: (S, set) => set({ w: S.w.map(r => r.map(() => [0, .5, 1][Math.floor(Math.random() * 3)])), writes: S.writes + 16 }) }]
        .concat([0, 1, 2, 3].map(i => ({ type: 'range', k: 'x' + i, label: '입력 x' + (i + 1), min: 0, max: 1, step: 0.05, def: [1, .6, .8, .4][i], fmt: v => fmt(+v, 2) }))),
      render(S) {
        const x = [S.x0, S.x1, S.x2, S.x3], y = [0, 1, 2, 3].map(i => S.w[i].reduce((s, w, j) => s + w * x[j], 0));
        let g = '';
        for (let i = 0; i < 4; i++) { g += `<path class="wg" stroke-width="1.6" opacity=".45" d="M40 ${44 + i * 34} H300"/><text class="m" x="20" y="${48 + i * 34}" font-size="10">x${i + 1}</text>`; }
        for (let j = 0; j < 4; j++) g += `<path class="wg" stroke-width="1" opacity=".3" d="M${70 + j * 56} 26 V168"/>`;
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
          const w = S.w[i][j];
          g += `<rect class="ht" data-i="${i}" data-j="${j}" x="${60 + j * 56}" y="${36 + i * 34}" width="20" height="16" rx="3" opacity="${(0.18 + 0.75 * w).toFixed(2)}" style="cursor:pointer"/>`;
          g += `<text class="m" x="${70 + j * 56}" y="${48 + i * 34}" font-size="9" text-anchor="middle" pointer-events="none">${w === 0 ? '0' : w === 1 ? '1' : '½'}</text>`;
        }
        for (let i = 0; i < 4; i++) {
          const v = clamp(y[i] / 2.6, 0, 1);
          g += `<rect class="pd" x="320" y="${34 + i * 34}" width="26" height="20" rx="3" stroke-width="1.2"/>`;
          g += `<rect class="pdf" x="320" y="${(54 + i * 34 - 20 * v).toFixed(1)}" width="26" height="${(20 * v).toFixed(1)}" rx="2" opacity=".8"/>`;
          g += `<text class="i" x="354" y="${48 + i * 34}" font-size="10.5">${fmt(y[i])}</text>`;
        }
        g += `<text class="m" x="40" y="190" font-size="9.5">교차점의 결정 상태가 가중치 — 누르면 0 → ½ → 1</text>`;
        // 구역: 왼쪽 입력 → 가운데 행렬 → 오른쪽 검출
        g += `<text class="m" x="20" y="16" font-size="9">입력</text><text class="m" x="155" y="16" font-size="9" text-anchor="middle">행렬 — PCM</text><text class="m" x="333" y="16" font-size="9" text-anchor="middle">출력 — 검출</text>`;
        if (S.off) g += `<rect x="0" y="0" width="440" height="200" fill="var(--panel)" opacity=".62"/><text class="a" x="220" y="100" font-size="13" text-anchor="middle" font-weight="600">전원 꺼짐 — 가중치는 그대로 남아 있다</text>`;
        const P = CYC.pen(), YR = [84, 118, 152, 186];
        P.laser(38, 135);
        P.split(61, 135, YR, { id: false, L: 50 });
        YR.forEach((y, i) => { P.mod(134, y, { w: 32, lab: 'x' + (i + 1) }); P.beam([[150, y], [262, y]], { w: 1.2 + 1.6 * x[i], op: .35 + .65 * x[i] }); });
        P.raw(`<g transform="translate(250 40)">${g}</g>`);
        P.mark('wg', [290, 80, 260, 110], [440, 101]); P.mark('pcm', [310, 76, 20, 16]); P.mark('pd', [570, 74, 26, 20]);
        P.laser(360, 16, { id: 'src-pulse', lab: '' }); P.lab(392, 20, '쓰기 펄스', { s: 9.5 });
        P.beam([[360, 30], [360, 70]], { dash: [4, 3], arrow: true, w: 1.6 });
        P.box(230, 16, 52, 24, 'FPGA', { id: 'fpga', tone: 'probe', s: 10 }); P.wire([[256, 16], [336, 16]]);
        YR.forEach(y => P.wire([[646, y], [676, y]]));
        P.box(702, 135, 48, 128, 'TIA', { id: 'tia' }); P.wire([[726, 135], [752, 135]]); P.box(776, 135, 44, 128, 'ADC', { id: 'adc' });
        P.legend(16, 268, ['광원', '변조', 'PCM 가중치', '검출', 'TIA·ADC']);
        g = P.out();
        return { svg: g, stats: [{ l: '누적 쓰기', v: S.writes + '회', c: PAL.warm }], read: `출력 y = <b>${y.map(v => fmt(v)).join(' · ')}</b><br>실제 PCM 셀은 10⁶~10⁸회에서 지친다` };
      },
      bind(el, S, set) {
        el.querySelectorAll('rect[data-i]').forEach(r => r.addEventListener('click', () => {
          const i = +r.dataset.i, j = +r.dataset.j, w = S.w.map(row => row.slice()), v = w[i][j];
          w[i][j] = v === 0 ? .5 : v === .5 ? 1 : 0; set({ w, writes: S.writes + 1 });
        }));
      }
    },
    {
      id: 'a6', num: '06', tab: '호모다인', title: '호모다인 · 코히런트 MVM', fig: { type: 'svg', w: 880, h: 370 }, label: '신호 팔 + 기준(LO) 팔 → 결합 → 밸런스드 검출',
      idea: [['검출기는 세기만 읽으니 부호가 사라진다. 기준 빛을 같이 때려 '], ['음수와 복소수', 1], ['를 되찾는 방법.']],
      note: 'LO 위상이 틀어지면 결과가 cos만큼 깎인다. 그 각도를 붙잡는 게 안정화 회로가 하는 일이다.',
      controls: [
        { type: 'range', k: 'w', label: '가중치 w', min: -100, max: 100, step: 1, def: -70, fmt: v => fmt(v / 100) },
        { type: 'range', k: 'x', label: '입력 x', min: -100, max: 100, step: 1, def: 60, fmt: v => fmt(v / 100) },
        { type: 'range', k: 'p', label: 'LO 위상', min: 0, max: 180, step: 1, def: 0, fmt: v => v + '°' }],
      render(S) {
        const w = S.w / 100, x = S.x / 100, p = S.p, prod = w * x, direct = prod * prod, homo = prod * Math.cos(p * D2R);
        const bar = (x0, v, max, cls) => { const h = clamp(Math.abs(v) / max, 0, 1) * 52, y = v >= 0 ? 110 - h : 110; return `<rect class="${cls}" x="${x0}" y="${y.toFixed(1)}" width="46" height="${h.toFixed(1)}" rx="2" opacity=".8"/>`; };
        const old = `<path class="wg" stroke-width="1" opacity=".4" d="M40 110 H400"/>
          ${bar(70, direct, 1, 'pdf')}<text class="m" x="93" y="174" font-size="11" text-anchor="middle">직접검출</text>
          <text class="i" x="93" y="100" font-size="11.5" text-anchor="middle">${fmt(direct)}</text>
          ${bar(200, homo, 1, 'pdf')}<text class="m" x="223" y="174" font-size="11" text-anchor="middle">호모다인</text>
          <text class="i" x="223" y="${homo >= 0 ? (110 - clamp(Math.abs(homo), 0, 1) * 52 - 6).toFixed(0) : (110 + clamp(Math.abs(homo), 0, 1) * 52 + 14).toFixed(0)}" font-size="11.5" text-anchor="middle">${fmt(homo)}</text>
          ${bar(330, prod, 1, 'ht')}<text class="m" x="353" y="174" font-size="11" text-anchor="middle">참값 w·x</text>
          <text class="m" x="404" y="114" font-size="10">0</text>`;
        // 사이클: LD → 나눔 → [신호 팔: x 변조 → w 변조] / [기준 팔: 위상 φ + 락] → 결합 → 밸런스드 PD → TIA → ADC
        const P = CYC.pen(), YS = 70, YL = 150;
        P.laser(38, 110);
        P.split(61, 110, [YS, YL], { id: 'bs', L: 52 });
        P.beam([[113, YS], [184, YS]], { w: 2.2 }); P.mod(200, YS, { lab: 'x', sub: '입력', drive: true });
        P.beam([[220, YS], [274, YS]], { w: 1 + 2 * Math.abs(x), op: .35 + .65 * Math.abs(x) }); P.mod(294, YS, { lab: 'w', red: true, sub: '가중치', drive: true });
        P.beam([[314, YS], [380, YS]], { w: 1 + 2 * Math.abs(prod), op: .35 + .65 * Math.abs(prod) });
        P.beam([[113, YL], [380, YL]], { w: 2.2 }); P.lab(150, YL + 18, '기준 빛 (LO)', { s: 10 });
        P.ps(260, YL, { w: 24, v: p / 180, lab: 'φ', tone: 'probe' });
        P.lock(240, YL - 18, 40, 30, { lab: '' });
        P.coupler(410, 110, { w: 60, g: 40 }); P.at2('bs', [410, 110]);
        P.beam([[440, YS], [456, YS], [473, 97]], { w: 1.6 }); P.beam([[440, YL], [456, YL], [473, 123]], { w: 1.6 });
        P.bal(480, 110); P.lab(470, 152, '밸런스드', { s: 10 });
        P.wire([[504, 110], [536, 110]]); P.box(562, 110, 50, 28, 'TIA', { id: 'tia' }); P.wire([[587, 110], [614, 110]]); P.box(638, 110, 46, 28, 'ADC', { id: 'adc' });
        P.text(672, 105, 'w·x', { s: 10.5 }); P.text(672, 124, fmt(homo), { s: 16, c: 'probe', b: 1 });
        P.wire([[562, 124], [562, 196], [260, 196], [260, YL + 13]]); P.lab(330, 191, '위상 락 — φ 를 붙잡는다', { s: 9.5, c: 'probe' });
        P.legend(16, 250, ['광원', '나눔', '변조 x·w', '결합', '밸런스드 PD', 'ADC']);
        P.aux(470, 222, 402, 142, '같은 w·x 를 세 가지로 읽기');
        P.raw(CYC.sub(474, 236, 394, 124, '0 40 440 145', old));
        return {
          svg: P.out(), stats: [{ l: '참값 w·x', v: fmt(prod), c: PAL.warm }, { l: '호모다인', v: fmt(homo), c: PAL.probe }],
          read: `직접검출 |E|² = <b>${fmt(direct)}</b> — 부호를 잃고 제곱된다` + (p > 0 ? `<br><span style="color:var(--wall)">호모다인이 cos ${p}° 만큼 깎임</span>` : '')
        };
      }
    },
    {
      id: 'a7', num: '07', tab: '시간다중', title: '시간다중 MVM', fig: { type: 'svg', w: 880, h: 370 }, label: '펄스 → 변조기 하나 → 누적 고리 → 검출 → FPGA 가 다음 가중치',
      idea: [['소자 하나를 시간으로 재사용한다. '], ['공간 대신 시간', 1], ['으로 행렬을 펼치니 면적은 줄고 지연은 늘어난다.']],
      note: 'N = 벡터 길이 = 한 행이 차지하는 시간 슬롯 수. 입력 펄스 N개가 변조기 하나를 차례로 지나고, 고리가 N바퀴 누적한 뒤 PD 가 y_i 하나를 읽는다. N×N 행렬이면 이걸 N번(행마다) 반복한다.',
      init: () => ({ t: 0 }),
      controls: [
        { type: 'range', k: 'N', label: '채널 N', min: 4, max: 64, step: 4, def: 16 },
        { type: 'range', k: 'f', label: '변조 속도', min: 1, max: 100, step: 1, def: 50, fmt: v => v + ' GHz' },
        { type: 'btn', label: () => '한 번 돌리기', act: (S, set, get) => {
          if (timer7) clearInterval(timer7);
          const cols = Math.min(S.N, 16); let t = 0; set({ t: 0 });
          timer7 = setInterval(() => { t++; set({ t }); if (t % cols === cols - 1) { clearInterval(timer7); timer7 = null; } }, 110);
        } }],
      render(S) {
        const N = S.N, f = S.f, t7 = S.t, lat = N / f, ops = 2 * N * N / (lat * 1e-9) / 1e12, cols = Math.min(N, 16);
        let g = '';
        for (let k = 0; k < cols; k++) {
          const on = k <= t7 % cols;
          g += `<rect class="${on ? 'ht' : 'fillg'}" x="${20 + k * 25}" y="46" width="19" height="28" rx="3" opacity="${on ? .85 : .6}" stroke-width="1"/>`;
          g += `<text class="m" x="${29.5 + k * 25}" y="88" font-size="9.5" text-anchor="middle">w${k + 1}</text>`;
        }
        const acc = (t7 % cols + 1) / cols, k0 = t7 % cols;
        g += `<rect class="pd" x="20" y="104" width="400" height="18" rx="3" stroke-width="1.2"/><rect class="pdf" x="20" y="104" width="${(400 * acc).toFixed(1)}" height="18" rx="2" opacity=".75"/>`;
        g += `<text class="m" x="20" y="142" font-size="11">누적 ${Math.round(acc * 100)}% — 사이클 ${k0 + 1} / ${cols}${N > 16 ? ' (앞 16)' : ''}</text>`;
        // 사이클: 펄스 LD → 변조기(xₖ·wₖ) → 누적 고리(지연선 + 증폭) → 탭 → PD → TIA → ADC → FPGA → 다음 wₖ
        const P = CYC.pen(), Y = 110;
        P.laser(38, Y, { id: 'src-pulse' });
        P.beam([[61, Y], [124, Y]]);
        for (let k = 0; k < 4; k++) P.path(`M${72 + k * 12} ${Y - 9} v-8`, { c: 'beam', w: 2, op: k === 3 - (k0 % 4) ? 1 : .3 });
        P.lab(92, Y - 24, `x₁…x_N — 슬롯 N=${N}`, { a: 'middle', s: 9.5 });
        P.mod(144, Y, { lab: 'xₖwₖ', red: true, w: 44 });
        P.beam([[166, Y], [236, Y]], { w: 2 });
        // 고리: 결합기로 들어가 한 바퀴 돌며 직전 슬롯과 더해진다
        P.path(`M236 ${Y} C250 ${Y} 252 ${Y - 8} 266 ${Y - 8} H430 Q450 ${Y - 8} 450 ${Y - 28} V${Y - 58} Q450 ${Y - 78} 430 ${Y - 78} H286 Q266 ${Y - 78} 266 ${Y - 58} V${Y - 28}`, { c: 'beam', w: 1.6, op: .35 + .65 * acc });
        P.coupler(258, Y - 4, { w: 30, g: 5, id: false });
        P.coil(350, Y - 78, { r: 11, lab: '' }); P.lab(350, Y - 98, '지연 = 한 슬롯', { a: 'middle', s: 9.5 });
        P.lab(340, Y - 40, `N=${N} 바퀴 누적 = 행 하나`, { a: 'middle', s: 9.5, c: 'beam' });
        P.amp(450, Y - 44, { lab: '' }); P.lab(470, Y - 40, '증폭', { s: 9.5 });
        P.beam([[430, Y - 8], [470, Y - 8], [482, Y], [520, Y]], { w: 1.6 });
        P.pd(528, Y, { v: acc }); P.wire([[538, Y], [566, Y]]);
        P.lab(528, Y + 30, `N슬롯 뒤 y_i 읽음`, { a: 'middle', s: 9.5 });
        P.box(592, Y, 48, 28, 'TIA', { id: 'tia' }); P.wire([[616, Y], [642, Y]]);
        P.box(666, Y, 44, 28, 'ADC', { id: 'adc' }); P.wire([[688, Y], [716, Y]]);
        P.box(748, Y, 60, 34, 'FPGA', { id: 'fpga', tone: 'probe' });
        P.wire([[748, Y + 17], [748, 190], [144, 190], [144, Y + 12]]); P.lab(380, 185, `FPGA 가 w_i1…w_iN 을 슬롯마다 하나씩 변조기에`, { s: 9.5, c: 'probe' });
        P.legend(16, 250, ['펄스', '변조 xₖwₖ', '누적 고리', '검출', 'ADC', 'FPGA']);
        P.aux(470, 222, 402, 142, '소자 하나가 사이클마다 다른 w');
        P.raw(CYC.sub(474, 236, 394, 124, '0 34 440 116', g));
        return { svg: P.out(), stats: [{ l: '지연', v: fmt(lat, 1) + ' ns', c: PAL.beam }, { l: '유효', v: fmt(ops, 1) + ' TOPS' }], read: '지연 = N / 속도 · 소자는 1개 — 공간을 시간으로 바꾼 값이다' };
      }
    },
    {
      id: 'a8', num: '08', tab: 'SLM 자유공간', title: 'SLM 자유공간 MVM', fig: { type: 'svg', w: 880, h: 300 }, label: 'LD → 입력 벡터 → SLM 행렬 → 원통 렌즈 합 → 카메라',
      idea: [['공간광변조기 한 장에 큰 행렬을 통째로 올린다. '], ['병렬도는 압도적이고 갱신은 느리다', 1], [' — 07과 정확히 반대의 거래.']],
      note: '가중치를 고정해두고 입력만 빠르게 흘리면(weight-stationary) 이 거래가 유리해진다.',
      controls: [
        { type: 'range', k: 'N', label: '한 변 N', min: 16, max: 512, step: 16, def: 256 },
        { type: 'range', k: 'T', label: '갱신 주기', min: 1, max: 200, step: 1, def: 50, fmt: v => v + ' ms' }],
      render(S) {
        const N = S.N, T = S.T, cells = N * N, ops = 2 * cells / (T * 1e-3) / 1e9;
        // 사이클: LD → 입력 벡터 x(행마다 펼침) → SLM 행렬(가중치) → 원통 렌즈(행을 모아 합) → 카메라 열
        const P = CYC.pen(), Y = 120, n = 8;
        P.laser(38, Y);
        P.path(`M61 ${Y - 3} L150 ${Y - 66} L150 ${Y + 66} L61 ${Y + 3} Z`, { c: 'none', f: 'beam', fo: .08 });
        P.beam([[61, Y - 3], [150, Y - 66]], { w: 1.2, op: .7 }); P.beam([[61, Y + 3], [150, Y + 66]], { w: 1.2, op: .7 });
        P.grid(152, Y - 64, 16, 128, n, 1, { id: false, tone: 'beam', vals: j => 0.3 + 0.7 * Math.abs(Math.cos(j * 0.9)) });
        P.lab(160, Y - 74, '입력 x', { a: 'middle', s: 10 });
        P.path(`M172 ${Y - 64} H300 V${Y + 64} H172 Z`, { c: 'none', f: 'beam', fo: .06 });
        P.grid(300, Y - 64, 128, 128, n, n, { id: 'slm', vals: (i, j) => 0.2 + 0.8 * Math.abs(Math.sin(i * 0.7 + j * 1.3)) });
        P.lab(364, Y - 74, `SLM ${N}×${N}`, { a: 'middle', s: 10 });
        P.path(`M430 ${Y - 64} L500 ${Y - 64} L590 ${Y - 6} L590 ${Y + 6} L500 ${Y + 64} L430 ${Y + 64} Z`, { c: 'none', f: 'beam', fo: .08 });
        P.lens(500, Y, 132, { lab: '' }); P.lab(500, Y + 82, '원통 렌즈', { a: 'middle', s: 10 });
        P.cam(596, Y, 16, 132, { n: 8, lab: '', vals: i => 0.25 + 0.7 * Math.abs(Math.sin(i * 1.1)) }); P.lab(596, Y + 82, '카메라', { a: 'middle', s: 10 });
        P.wire([[606, Y], [640, Y]]);
        P.aux(650, 50, 220, 140, '');
        P.text(664, 78, '가중치', { s: 10.5 }); P.text(664, 100, cells.toLocaleString() + '개', { s: 15, c: 'warm', b: 1 });
        P.text(664, 128, '갱신 ' + T + ' ms', { s: 10.5 }); P.text(664, 156, fmt(ops, 0) + ' GOPS', { s: 15, c: 'probe', b: 1 });
        P.text(664, 178, '한 장에 통째로', { s: 9.5 });
        P.legend(16, 268, ['광원', '입력 x', 'SLM 가중치', '렌즈 Σ', '카메라']);
        return { svg: P.out(), stats: [{ l: '병렬 채널', v: cells.toLocaleString(), c: PAL.warm }, { l: '연산량', v: fmt(ops, 1) + ' GOPS', c: PAL.probe }], read: `갱신 ${T} ms — 07과 반대의 거래다` };
      }
    },
    {
      id: 'a9', num: '', tab: '겹쳐 보면', title: '여덟을 겹쳐 보면', text: true,
      body: [
        '<b>가중치를 어디에 두느냐가 전부를 가른다.</b> 위상에 두면(01) 임의 행렬이 되지만 소자가 N²로 늘고 계속 전기를 먹는다. 파장에 두면(02) 합산이 공짜가 되지만 온도에 묶인다. 마스크에 두면(03·04) 전파가 연산을 대신 해주지만 바꾸려면 다시 찍어야 한다. 재료의 결정 상태에 두면(05) 꺼도 남지만 쓰기가 느리다.',
        '<b>그리고 검출이 절반이다.</b> 06이 보여주는 건 연산을 아무리 잘해도 <span style="color:#D62A1F;font-weight:700">읽는 방식이 부호를 버리면 음수 가중치를 못 쓴다</span>는 것이다. 광 가속기 논문에서 호모다인이 자꾸 나오는 이유가 여기 있다.',
        '<b>07과 08은 같은 축의 양 끝이다.</b> 시간으로 펼치면 소자가 하나로 줄고 지연이 N배, 공간으로 펼치면 병렬도가 N²이고 갱신이 밀리초다. 실제 설계는 둘 사이 어딘가에 선다.'
      ]
    }
  ];

  (window.CMP = window.CMP || { groups: {} }).groups.a = { id: 'a', name: 'A · 행렬곱', list: A };
})();
