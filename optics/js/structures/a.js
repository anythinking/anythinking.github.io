/* A군 — 행렬곱. 구조마다 render(S) 순수 모델 + controls. 페이지(compute.js)가 그림·손잡이를 그린다 */
(function () {
  'use strict';
  const PAL = { beam: '#C9472F', probe: '#2C7A86', warm: '#B7791F', wall: '#8A5A2B', panel: '#FBFAF7', ink: '#1C1B18', muted: '#6B675E', rule: '#D9D4C9', grid: '#ECE8DF', bg: '#F2F0EB' };
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
      id: 'a1', key: 'MZI 메시', num: '01', tab: 'MZI 메시', title: 'MZI 메시', fig: { type: 'svg', w: 440, h: 150 }, label: 'MZI 한 개의 나눔',
      idea: [['2×2 유니터리를 격자로 쌓아 임의 행렬을 만든다(Reck·Clements 분해). 가중치는 '], ['위상', 1], ['이 들고 있다.']],
      who: 'HHI · 스탠포드 S.Fan · Lightmatter', wall: '위상천이기 N² · 6~9비트 · 드리프트',
      note: '4채널 전체 메시와 실물 배치·단면은 따로 있다 → <a href="https://claude.ai/artifact/1rU7rNCNLmKpuXvThQPB9S">4×4 광 연산 메시</a>',
      controls: [{ type: 'range', k: 'th', label: 'θ', min: 0, max: 360, step: 1, def: 90, fmt: v => v + '°' }],
      render(S) {
        const th = S.th, s = Math.sin(th * D2R / 2) ** 2;
        return {
          svg: `<path class="wg" stroke-width="1.4" opacity=".55" d="M40 40 C70 40 70 75 100 75 H150 C180 75 180 40 210 40 H250 C280 40 280 75 310 75"/>
            <path class="wg" stroke-width="1.4" opacity=".55" d="M40 110 C70 110 70 75 100 75 H150 C180 75 180 110 210 110 H250 C280 110 280 75 310 75"/>
            <path class="bm" stroke-width="5" opacity=".9" d="M14 40 H40"/>
            <rect class="ht" x="155" y="34" width="50" height="6" rx="2" opacity=".9"/>
            <text class="m" x="180" y="28" font-size="10" text-anchor="middle">θ = ${th}°</text>
            <path class="bm" stroke-width="${(1 + 5 * s).toFixed(2)}" opacity="${(0.15 + 0.85 * s).toFixed(2)}" d="M310 75 C340 75 340 40 370 40 H400"/>
            <path class="bm" stroke-width="${(1 + 5 * (1 - s)).toFixed(2)}" opacity="${(0.15 + 0.85 * (1 - s)).toFixed(2)}" d="M310 75 C340 75 340 110 370 110 H400"/>
            <text class="i" x="406" y="44" font-size="11">${fmt(s)}</text>
            <text class="i" x="406" y="114" font-size="11">${fmt(1 - s)}</text>
            <text class="m" x="14" y="30" font-size="10">입력 1</text>
            <text class="m" x="40" y="140" font-size="10">결합기 → 위상 → 결합기</text>`,
          stats: [{ l: '통과', v: fmt(s), c: PAL.beam }, { l: '건너감', v: fmt(1 - s) }],
          read: '세기 비율 = sin²(θ/2) : cos²(θ/2)'
        };
      }
    },
    {
      id: 'a2', key: '마이크로링 가중치 뱅크', num: '02', tab: '링 가중치 뱅크', title: '마이크로링 가중치 뱅크', fig: { type: 'svg', w: 440, h: 190 }, label: '마이크로링 가중치 뱅크',
      idea: [['파장마다 가중치 하나. '], ['WDM 채널 수가 곧 행렬 크기', 1], ['이고, 합산은 검출기 하나가 광전류를 더해서 한다.']],
      who: '프린스턴 계보', wall: '온도 민감 · 파장 락킹',
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
        const err = Math.abs(sum - sum0) / Math.max(sum0, 1e-6) * 100;
        return {
          svg: g, stats: [{ l: '출력 Σwᵢxᵢ', v: fmt(sum), c: PAL.probe }],
          read: `가중치 ${w.map(v => fmt(v)).join(' · ')}<br>` + (S.T > 0 ? `<span style="color:var(--wall)">온도 +${S.T} K → 의도한 값에서 ${fmt(err, 1)}% 벗어남</span>` : '온도 0 K — 의도한 값 그대로')
        };
      }
    },
    {
      id: 'a3', key: '회절 신경망 D²NN', num: '03', tab: '회절 신경망', title: '회절 신경망 (D²NN)', fig: { type: 'canvas', w: 880, h: 300 }, label: '두 장의 마스크와 출력면',
      stack: { rects: [[10, 20, 665, 265], [672, 40, 205, 245]] },
      idea: [['마스크 여러 장을 통과시키면 층이 쌓인다. 가중치는 '], ['마스크의 위상 패턴', 1], ['이고, 연산은 전파가 공짜로 한다.']],
      who: 'UCLA · 칭화', wall: '커널 고정 — 재학습이 어렵다',
      note: '1차원 프레넬 전파를 128점으로 실제 계산한다. 출력 칸 넷 중 가장 밝은 칸이 분류 결과다.',
      controls: [
        { type: 'range', k: 'fa', label: '마스크1 초점', min: -100, max: 100, step: 1, def: 55 },
        { type: 'range', k: 'ta', label: '마스크1 기울기', min: -60, max: 60, step: 1, def: 0 },
        { type: 'range', k: 'fb', label: '마스크2 초점', min: -100, max: 100, step: 1, def: 40 },
        { type: 'range', k: 'tb', label: '마스크2 기울기', min: -60, max: 60, step: 1, def: 22 }],
      render(S) {
        let re = new Float64Array(N3), im = new Float64Array(N3);
        for (let n = 0; n < N3; n++) { const u = (n - N3 / 2) / 18; re[n] = Math.exp(-u * u); }
        mask(re, im, S.fa, S.ta); let [r, i] = prop(re, im, 1);
        mask(r, i, S.fb, S.tb); [r, i] = prop(r, i, 1);
        const I = [...r].map((v, n) => v * v + i[n] * i[n]), mx = Math.max(...I, 1e-9), bins = [0, 0, 0, 0];
        for (let n = 0; n < N3; n++) bins[clamp(Math.floor(n / (N3 / 4)), 0, 3)] += I[n];
        const best = bins.indexOf(Math.max(...bins)), tot = bins.reduce((a, b) => a + b, 0);
        return {
          draw(cx, W, H) {
            cx.clearRect(0, 0, W, H);
            cx.strokeStyle = col('--rule'); cx.lineWidth = 2;
            [140, 400, 660].forEach(x => { cx.beginPath(); cx.moveTo(x, 30); cx.lineTo(x, 250); cx.stroke(); });
            cx.fillStyle = col('--muted'); cx.font = '13px IBM Plex Mono, monospace';
            cx.fillText('마스크 1', 110, 270); cx.fillText('마스크 2', 370, 270); cx.fillText('출력면', 640, 270);
            cx.strokeStyle = col('--beam'); cx.globalAlpha = .25; cx.lineWidth = 1;
            for (let k = 0; k < 9; k++) { const y = 60 + k * 17; cx.beginPath(); cx.moveTo(30, 140); cx.lineTo(140, y); cx.lineTo(400, 280 - y); cx.lineTo(660, y); cx.stroke(); }
            cx.globalAlpha = 1;
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
      id: 'a4', key: '4f 상관기', num: '04', tab: '4f 상관기', title: '4f 상관기 · 정합 필터', fig: { type: 'canvas', w: 880, h: 320 }, label: '입력 · 푸리에 면 · 출력 상관',
      stack: { rects: [[22, 8, 270, 250], [302, 8, 262, 250], [566, 8, 304, 250]], rows: [[0, 1], [2]] },
      idea: [['렌즈가 푸리에 변환을 공짜로 해준다. 푸리에 면에 '], ['찾는 패턴의 켤레', 1], ['를 놓으면, 맞을 때만 출력에 뾰족한 봉우리가 선다.']],
      who: '1기(1953~72)', wall: '아날로그 정밀도',
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
        return {
          draw(cx, W, H) {
            cx.clearRect(0, 0, W, H);
            const panel = (x0, title, arr, color, norm) => {
              cx.fillStyle = col('--muted'); cx.font = '13px IBM Plex Mono, monospace'; cx.fillText(title, x0, 26);
              cx.strokeStyle = col('--rule'); cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x0, 250); cx.lineTo(x0 + 260, 250); cx.stroke();
              cx.strokeStyle = col(color); cx.lineWidth = 2; cx.beginPath();
              arr.forEach((v, n) => { const px = x0 + n * (260 / N4), py = 250 - (v / norm) * 180; n ? cx.lineTo(px, py) : cx.moveTo(px, py); }); cx.stroke();
            };
            panel(30, '입력 ' + (in4 === 'AN' ? 'A+잡음' : in4), [...x], '--beam', Math.max(...x));
            panel(310, '푸리에 면 · 필터 ' + fl4, TM, '--warm', Math.max(...TM));
            panel(590, '출력 상관', C, '--probe', peak);
            cx.fillStyle = col('--probe'); cx.beginPath(); cx.arc(590 + at * (260 / N4), 70, 5, 0, 7); cx.fill();
            cx.fillStyle = col('--muted'); cx.font = '12px IBM Plex Mono, monospace'; cx.fillText('봉우리', 590 + at * (260 / N4) - 18, 60);
          },
          stats: [{ l: '봉우리 / 평균', v: fmt(peak / mean, 1), c: PAL.probe }, { l: '위치', v: String(at) }],
          read: ok ? '<span style="color:var(--probe)">정합 — 봉우리가 섰다</span>' : '<span style="color:var(--wall)">불일치 — 봉우리가 주저앉았다</span>'
        };
      }
    },
    {
      id: 'a5', key: 'PCM 크로스바', num: '05', tab: 'PCM 크로스바', title: 'PCM 크로스바', fig: { type: 'svg', w: 440, h: 200 }, label: 'PCM 크로스바 4×4',
      idea: [['상변화 재료의 결정 상태가 가중치다. '], ['전원을 꺼도 값이 남는다', 1], [' — 위상이 들고 있던 가중치와 갈리는 지점.']],
      who: '옥스퍼드 Bhaskaran · 하이델베르크 Pernice · 뮌스터', wall: '쓰기 횟수 · 속도',
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
        if (S.off) g += `<rect x="0" y="0" width="440" height="200" fill="var(--panel)" opacity=".62"/><text class="a" x="220" y="100" font-size="13" text-anchor="middle" font-weight="600">전원 꺼짐 — 가중치는 그대로 남아 있다</text>`;
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
      id: 'a6', key: '호모다인 MVM', num: '06', tab: '호모다인', title: '호모다인 · 코히런트 MVM', fig: { type: 'svg', w: 440, h: 180 }, label: '직접검출과 호모다인 비교',
      idea: [['검출기는 세기만 읽으니 부호가 사라진다. 기준 빛을 같이 때려 '], ['음수와 복소수', 1], ['를 되찾는 방법.']],
      who: 'SJTU · Lightmatter', wall: '국부발진기 · 안정화',
      note: 'LO 위상이 틀어지면 결과가 cos만큼 깎인다. 그 각도를 붙잡는 게 안정화 회로가 하는 일이다.',
      controls: [
        { type: 'range', k: 'w', label: '가중치 w', min: -100, max: 100, step: 1, def: -70, fmt: v => fmt(v / 100) },
        { type: 'range', k: 'x', label: '입력 x', min: -100, max: 100, step: 1, def: 60, fmt: v => fmt(v / 100) },
        { type: 'range', k: 'p', label: 'LO 위상', min: 0, max: 180, step: 1, def: 0, fmt: v => v + '°' }],
      render(S) {
        const w = S.w / 100, x = S.x / 100, p = S.p, prod = w * x, direct = prod * prod, homo = prod * Math.cos(p * D2R);
        const bar = (x0, v, max, cls) => { const h = clamp(Math.abs(v) / max, 0, 1) * 52, y = v >= 0 ? 110 - h : 110; return `<rect class="${cls}" x="${x0}" y="${y.toFixed(1)}" width="46" height="${h.toFixed(1)}" rx="2" opacity=".8"/>`; };
        const svg = `<path class="wg" stroke-width="1" opacity=".4" d="M40 110 H400"/>
          <text class="m" x="40" y="30" font-size="10">같은 w·x를 두 방식으로 읽는다</text>
          ${bar(70, direct, 1, 'pdf')}<text class="m" x="93" y="174" font-size="10" text-anchor="middle">직접검출</text>
          <text class="i" x="93" y="100" font-size="10.5" text-anchor="middle">${fmt(direct)}</text>
          ${bar(200, homo, 1, 'pdf')}<text class="m" x="223" y="174" font-size="10" text-anchor="middle">호모다인</text>
          <text class="i" x="223" y="${homo >= 0 ? (110 - clamp(Math.abs(homo), 0, 1) * 52 - 6).toFixed(0) : (110 + clamp(Math.abs(homo), 0, 1) * 52 + 14).toFixed(0)}" font-size="10.5" text-anchor="middle">${fmt(homo)}</text>
          ${bar(330, prod, 1, 'ht')}<text class="m" x="353" y="174" font-size="10" text-anchor="middle">참값 w·x</text>
          <text class="m" x="404" y="114" font-size="9">0</text>`;
        return {
          svg, stats: [{ l: '참값 w·x', v: fmt(prod), c: PAL.warm }, { l: '호모다인', v: fmt(homo), c: PAL.probe }],
          read: `직접검출 |E|² = <b>${fmt(direct)}</b> — 부호를 잃고 제곱된다` + (p > 0 ? `<br><span style="color:var(--wall)">호모다인이 cos ${p}° 만큼 깎임</span>` : '')
        };
      }
    },
    {
      id: 'a7', key: '시간다중 MVM', num: '07', tab: '시간다중', title: '시간다중 MVM', fig: { type: 'svg', w: 440, h: 170 }, label: '시간다중 누적',
      idea: [['소자 하나를 시간으로 재사용한다. '], ['공간 대신 시간', 1], ['으로 행렬을 펼치니 면적은 줄고 지연은 늘어난다.']],
      who: '칭화 Taichi', wall: '처리량이 시간에 묶인다',
      note: 'N×N 행렬 하나에 N 사이클이 든다. 소자는 하나로 줄지만 계산 시간이 N배다.',
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
        let g = `<text class="m" x="20" y="26" font-size="10">소자 하나가 사이클마다 다른 가중치를 쓴다</text>`;
        for (let k = 0; k < cols; k++) {
          const on = k <= t7 % cols;
          g += `<rect class="${on ? 'ht' : 'fillg'}" x="${20 + k * 25}" y="46" width="19" height="28" rx="3" opacity="${on ? .85 : .6}" stroke-width="1"/>`;
          g += `<text class="m" x="${29.5 + k * 25}" y="86" font-size="8.5" text-anchor="middle">w${k + 1}</text>`;
        }
        const acc = (t7 % cols + 1) / cols;
        g += `<rect class="pd" x="20" y="104" width="400" height="18" rx="3" stroke-width="1.2"/><rect class="pdf" x="20" y="104" width="${(400 * acc).toFixed(1)}" height="18" rx="2" opacity=".75"/>`;
        g += `<text class="m" x="20" y="140" font-size="10">누적 ${Math.round(acc * 100)}% — 사이클 ${t7 % cols + 1} / ${cols}${N > 16 ? ' (앞 16개만 표시)' : ''}</text>`;
        g += `<text class="m" x="20" y="160" font-size="10">N 사이클을 다 돌아야 결과 한 벌이 나온다</text>`;
        return { svg: g, stats: [{ l: '지연', v: fmt(lat, 1) + ' ns', c: PAL.beam }, { l: '유효', v: fmt(ops, 1) + ' TOPS' }], read: '지연 = N / 속도 · 소자는 1개 — 공간을 시간으로 바꾼 값이다' };
      }
    },
    {
      id: 'a8', key: 'SLM 자유공간', num: '08', tab: 'SLM 자유공간', title: 'SLM 자유공간 MVM', fig: { type: 'svg', w: 440, h: 180 }, label: 'SLM 병렬도와 갱신 속도',
      idea: [['공간광변조기 한 장에 큰 행렬을 통째로 올린다. '], ['병렬도는 압도적이고 갱신은 느리다', 1], [' — 07과 정확히 반대의 거래.']],
      who: '스탠포드 Kiyoul Yang', wall: '속도 (ms~µs)',
      note: '가중치를 고정해두고 입력만 빠르게 흘리면(weight-stationary) 이 거래가 유리해진다.',
      controls: [
        { type: 'range', k: 'N', label: '한 변 N', min: 16, max: 512, step: 16, def: 256 },
        { type: 'range', k: 'T', label: '갱신 주기', min: 1, max: 200, step: 1, def: 50, fmt: v => v + ' ms' }],
      render(S) {
        const N = S.N, T = S.T, cells = N * N, ops = 2 * cells / (T * 1e-3) / 1e9, g = [];
        g.push(`<text class="m" x="20" y="26" font-size="10">한 장에 ${cells.toLocaleString()}개 가중치가 동시에 올라간다</text>`);
        const px = Math.max(2, Math.min(12, Math.round(180 / Math.sqrt(cells) * 8))), n = Math.min(28, Math.floor(170 / px));
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = 0.2 + 0.8 * Math.abs(Math.sin(i * 0.7 + j * 1.3)); g.push(`<rect class="ht" x="${30 + j * px}" y="${44 + i * px}" width="${px - 1}" height="${px - 1}" opacity="${(v * 0.8).toFixed(2)}"/>`); }
        g.push(`<text class="m" x="30" y="${50 + n * px + 14}" font-size="9.5">SLM 화면 (일부만 표시)</text>`);
        g.push(`<path class="bm" stroke-width="2" opacity=".5" d="M250 110 L300 70 M250 110 L300 110 M250 110 L300 150"/>`);
        g.push(`<rect class="pd" x="304" y="62" width="30" height="96" rx="3" stroke-width="1.2"/><text class="m" x="304" y="174" font-size="9.5">센서</text>`);
        g.push(`<text class="p" x="344" y="106" font-size="11">${fmt(ops, 0)} GOPS</text>`);
        return { svg: g.join(''), stats: [{ l: '병렬 채널', v: cells.toLocaleString(), c: PAL.warm }, { l: '연산량', v: fmt(ops, 1) + ' GOPS', c: PAL.probe }], read: `갱신 ${T} ms — 07과 반대의 거래다` };
      }
    },
    {
      id: 'a9', num: '', tab: '겹쳐 보면', title: '여덟을 겹쳐 보면', text: true,
      body: [
        '<b>가중치를 어디에 두느냐가 전부를 가른다.</b> 위상에 두면(01) 임의 행렬이 되지만 소자가 N²로 늘고 계속 전기를 먹는다. 파장에 두면(02) 합산이 공짜가 되지만 온도에 묶인다. 마스크에 두면(03·04) 전파가 연산을 대신 해주지만 바꾸려면 다시 찍어야 한다. 재료의 결정 상태에 두면(05) 꺼도 남지만 쓰기가 느리다.',
        '<b>그리고 검출이 절반이다.</b> 06이 보여주는 건 연산을 아무리 잘해도 <span style="color:#C9472F;font-weight:700">읽는 방식이 부호를 버리면 음수 가중치를 못 쓴다</span>는 것이다. 광 가속기 논문에서 호모다인이 자꾸 나오는 이유가 여기 있다.',
        '<b>07과 08은 같은 축의 양 끝이다.</b> 시간으로 펼치면 소자가 하나로 줄고 지연이 N배, 공간으로 펼치면 병렬도가 N²이고 갱신이 밀리초다. 실제 설계는 둘 사이 어딘가에 선다.'
      ]
    }
  ];

  (window.CMP = window.CMP || { groups: {} }).groups.a = { id: 'a', name: 'A · 행렬곱', list: A };
})();
