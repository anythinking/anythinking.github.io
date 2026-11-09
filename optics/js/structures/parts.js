/* 구조 그림의 부품 — 「광원에서 센서까지」 사이클을 같은 문법으로 그린다.
   CYC.pen()      → SVG 문자열 펜 (A군 render, 옛 장 SVG)
   CYC.pen(ctx)   → 캔버스 펜 (옛 장 캔버스)
   부품마다 BOM id 와 상자를 남긴다 — SVG 는 <g data-part data-bb>, 캔버스는 canvas._parts.
   마커 p 와 「필수 부품이 그림에 다 있나」 점검이 이 기록을 읽는다(scripts/check_parts.js).
   색: 빔 빨강 = 빛·가중치 자리, 조작 파랑 = 전자·제어. 글자는 짧은 라벨만. */
(function () {
  'use strict';
  const HEX = { beam: '#D62A1F', probe: '#2457E6', warm: '#D1A017', wall: '#6B5B4E', ink: '#16233A', muted: '#55657F', faint: '#8A97AD', rule: '#D5DCE8', grid: '#E9EEF5', panel: '#FFFFFF', bg: '#F8F9FB' };
  const FONT = 'IBM Plex Mono, monospace';
  const r1 = v => Math.round(v * 10) / 10;

  function pen(ctx) {
    const cv = !!ctx, out = [], parts = {};
    const C = k => (k == null || k === 'none') ? 'none' : (HEX[k] ? (cv ? HEX[k] : `var(--${k})`) : k);
    const P = {};
    const I = (o, d) => o.id === false ? false : (o.id || d);
    // ── 바탕 도형: 모두 SVG path 문자열로 — 캔버스는 Path2D 가 같은 문자열을 읽는다 ──
    P.path = (d, o) => {
      o = o || {};
      const st = o.c === undefined ? 'ink' : o.c, fi = o.f || 'none', w = o.w == null ? 1.2 : o.w, op = o.op == null ? 1 : o.op;
      if (cv) {
        const p2 = new Path2D(d); ctx.save(); ctx.globalAlpha = op;
        if (fi !== 'none') { ctx.globalAlpha = op * (o.fo == null ? 1 : o.fo); ctx.fillStyle = C(fi); ctx.fill(p2); ctx.globalAlpha = op; }
        if (st !== 'none') { ctx.strokeStyle = C(st); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash(o.dash || []); ctx.stroke(p2); }
        ctx.restore();
      } else {
        out.push(`<path d="${d}" fill="${C(fi)}"${o.fo != null ? ` fill-opacity="${o.fo}"` : ''} stroke="${C(st)}" stroke-width="${w}"${op < 1 ? ` opacity="${op}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash.join(' ')}"` : ''} stroke-linecap="round" stroke-linejoin="round"${o.attr ? ' ' + o.attr : ''}/>`);
      }
    };
    P.poly = (pts, o) => P.path('M' + pts.map(p => r1(p[0]) + ' ' + r1(p[1])).join(' L'), o);
    P.rect = (x, y, w, h, o) => { o = o || {}; const r = o.r == null ? 3 : o.r;
      P.path(`M${r1(x + r)} ${r1(y)} H${r1(x + w - r)} Q${r1(x + w)} ${r1(y)} ${r1(x + w)} ${r1(y + r)} V${r1(y + h - r)} Q${r1(x + w)} ${r1(y + h)} ${r1(x + w - r)} ${r1(y + h)} H${r1(x + r)} Q${r1(x)} ${r1(y + h)} ${r1(x)} ${r1(y + h - r)} V${r1(y + r)} Q${r1(x)} ${r1(y)} ${r1(x + r)} ${r1(y)} Z`, Object.assign({ f: 'panel' }, o)); };
    P.circ = (x, y, r, o) => P.path(`M${r1(x - r)} ${r1(y)} A${r} ${r} 0 1 0 ${r1(x + r)} ${r1(y)} A${r} ${r} 0 1 0 ${r1(x - r)} ${r1(y)} Z`, o);
    P.ell = (x, y, rx, ry, o) => P.path(`M${r1(x - rx)} ${r1(y)} A${rx} ${ry} 0 1 0 ${r1(x + rx)} ${r1(y)} A${rx} ${ry} 0 1 0 ${r1(x - rx)} ${r1(y)} Z`, o);
    P.text = (x, y, s, o) => {
      o = o || {}; const sz = o.s || 11, a = o.a || 'start', c = o.c || 'muted';
      if (cv) { ctx.save(); ctx.font = `${o.b ? '600 ' : ''}${sz}px ${FONT}`; ctx.fillStyle = C(c); ctx.textAlign = a === 'middle' ? 'center' : a; ctx.fillText(s, x, y); ctx.restore(); }
      else out.push(`<text x="${r1(x)}" y="${r1(y)}" font-size="${sz}"${a !== 'start' ? ` text-anchor="${a}"` : ''} fill="${C(c)}"${o.b ? ' font-weight="600"' : ''}${o.attr ? ' ' + o.attr : ''}>${s}</text>`);
    };
    P.raw = s => { if (!cv) out.push(s); };
    // ── 부품 기록: id = BOM 부품 id. 같은 id 가 둘이면 첫째가 마커 자리(둘째는 p2) ──
    P.part = (id, bb, fn, at) => {
      if (id === false) { fn(); return; }
      // 마커 자리: 따로 안 주면 부품의 오른쪽 위 모서리 — 부품과 라벨을 가리지 않게
      const a = at || [bb[0] + bb[2], bb[1]];
      if (!parts[id]) parts[id] = { bb, at: a };
      if (!cv) out.push(`<g data-part="${id}" data-bb="${bb.map(r1).join(',')}" data-at="${a.map(r1).join(',')}">`);
      fn();
      if (!cv) out.push('</g>');
    };
    // ── 선: 빛(빨강) · 전자(파랑) ──
    const head = (a, b, c, s) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, k = s || 5;
      P.path(`M${r1(b[0] - ux * k - uy * k * .6)} ${r1(b[1] - uy * k + ux * k * .6)} L${r1(b[0])} ${r1(b[1])} L${r1(b[0] - ux * k + uy * k * .6)} ${r1(b[1] - uy * k - ux * k * .6)}`, { c, w: 1.3 }); };
    P.beam = (pts, o) => { o = o || {}; P.poly(pts, { c: o.c || 'beam', w: o.w == null ? 2 : o.w, op: o.op, dash: o.dash }); if (o.arrow) head(pts[pts.length - 2], pts[pts.length - 1], o.c || 'beam', 6); };
    P.wire = (pts, o) => { o = o || {}; P.poly(pts, { c: o.c || 'probe', w: o.w == null ? 1.2 : o.w, dash: o.dash, op: o.op }); if (o.arrow !== false) head(pts[pts.length - 2], pts[pts.length - 1], o.c || 'probe', 4.5); };
    P.lab = (x, y, s, o) => P.text(x, y, s, Object.assign({ s: 10.5, c: 'muted' }, o || {}));

    // ── 부품 (가운데 좌표) ── 돌려주는 값: 왼쪽·오른쪽 포트
    const port = (cx, cy, w) => ({ l: [cx - w / 2, cy], r: [cx + w / 2, cy] });
    P.laser = (cx, cy, o) => { o = o || {}; const id = I(o, 'src-cw'), w = o.w || 46, h = 28, kind = id === 'src-pulse' ? 'pulse' : id === 'src-comb' ? 'comb' : (o.kind || 'cw');
      P.part(id, [cx - w / 2, cy - h / 2, w, h], () => {
        P.rect(cx - w / 2, cy - h / 2, w, h, { c: 'ink', w: 1.3 });
        if (kind === 'pulse') P.path(`M${cx - 14} ${cy + 6} h5 v-12 h2 v12 h6 v-12 h2 v12 h6 v-12 h2 v12 h5`, { c: 'beam', w: 1.3 });
        else if (kind === 'comb') { for (let i = 0; i < 7; i++) P.path(`M${cx - 15 + i * 5} ${cy + 7} v${-6 - 7 * Math.exp(-((i - 3) ** 2) / 4)}`, { c: 'beam', w: 1.5 }); }
        else if (kind === 'pump') P.text(cx, cy + 4, '펌프', { a: 'middle', c: 'ink', s: 10.5 });
        else P.text(cx, cy + 4, 'LD', { a: 'middle', c: 'ink', s: 11, b: 1 });
      });
      if (o.lab !== '') P.lab(cx, cy + h / 2 + 13, o.lab || (kind === 'pulse' ? '펄스 LD' : kind === 'comb' ? '콤' : kind === 'pump' ? '' : 'CW'), { a: 'middle' });
      return port(cx, cy, w); };
    P.box = (cx, cy, w, h, lab, o) => { o = o || {};
      const draw = () => { P.rect(cx - w / 2, cy - h / 2, w, h, { c: o.tone || 'ink', w: 1.3, f: o.f || 'panel', fo: o.fo }); if (lab) P.text(cx, cy + 4, lab, { a: 'middle', c: o.tc || o.tone || 'ink', s: o.s || 11 }); };
      if (o.id) P.part(o.id, [cx - w / 2, cy - h / 2, w, h], draw); else draw();
      if (o.sub) P.lab(cx, cy + h / 2 + 13, o.sub, { a: 'middle' });
      return Object.assign(port(cx, cy, w), { t: [cx, cy - h / 2], b: [cx, cy + h / 2] }); };
    // 변조기: 도파로가 지나가는 상자 + 파란 전극(전기 입력)
    P.mod = (cx, cy, o) => { o = o || {}; const id = I(o, 'eom'), w = o.w || 40, h = 22;
      P.part(id, [cx - w / 2, cy - h / 2, w, h], () => {
        P.rect(cx - w / 2, cy - h / 2, w, h, { c: 'ink', w: 1.3 });
        P.path(`M${cx - w / 2 + 5} ${cy - h / 2 + 4} H${cx + w / 2 - 5}`, { c: o.red ? 'beam' : 'probe', w: 3 });
        P.text(cx, cy + 7, o.lab || 'EOM', { a: 'middle', c: 'ink', s: 9.5 });
      });
      if (o.sub) P.lab(cx, cy + h / 2 + 13, o.sub, { a: 'middle' });
      if (o.drive) P.wire([[cx, cy - h / 2 - 16], [cx, cy - h / 2 - 1]]);
      return port(cx, cy, w); };
    // 광검출기: 반원 머리 + 파란 리드
    P.pd = (cx, cy, o) => { o = o || {}; const id = I(o, 'pd'), fill = o.v == null ? 0 : Math.max(0, Math.min(1, o.v));
      P.part(id, [cx - 8, cy - 10, 18, 20], () => {
        P.path(`M${cx - 7} ${cy - 9} H${cx} A9 9 0 0 1 ${cx} ${cy + 9} H${cx - 7} Z`, { c: 'ink', w: 1.3, f: 'panel' });
        if (fill) P.path(`M${cx - 7} ${cy - 9} H${cx} A9 9 0 0 1 ${cx} ${cy + 9} H${cx - 7} Z`, { c: 'none', f: 'probe', fo: .15 + .75 * fill });
      });
      if (o.lab) P.lab(cx, cy + 22, o.lab, { a: 'middle' });
      return { l: [cx - 7, cy], r: [cx + 9, cy] }; };
    // 밸런스드 검출: PD 둘 + 차
    P.bal = (cx, cy, o) => { o = o || {};
      P.part(I(o, 'bal'), [cx - 10, cy - 24, 34, 48], () => {
        [cy - 13, cy + 13].forEach(y => P.path(`M${cx - 7} ${y - 8} H${cx} A8 8 0 0 1 ${cx} ${y + 8} H${cx - 7} Z`, { c: 'ink', w: 1.3, f: 'panel' }));
        P.path(`M${cx + 8} ${cy - 13} H${cx + 16} V${cy + 13} H${cx + 8}`, { c: 'probe', w: 1.2 });
        P.text(cx + 21, cy + 4, '−', { c: 'probe', s: 13 });
      });
      return { l1: [cx - 7, cy - 13], l2: [cx - 7, cy + 13], r: [cx + 24, cy] }; };
    P.lens = (cx, cy, h, o) => { o = o || {};
      P.part(I(o, 'lens'), [cx - 6, cy - h / 2, 12, h], () => P.ell(cx, cy, 5.5, h / 2, { c: 'ink', w: 1.3, f: 'grid' }));
      if (o.lab) P.lab(cx, cy + h / 2 + 13, o.lab, { a: 'middle' });
      return port(cx, cy, 12); };
    // 판(마스크·메타표면·회절층): 세로 판 + 붉은 무늬(가중치)
    P.plate = (cx, cy, h, o) => { o = o || {}; const n = o.n || 8, vals = o.vals || [];
      P.part(I(o, 'mask'), [cx - 5, cy - h / 2, 10, h], () => {
        P.rect(cx - 4, cy - h / 2, 8, h, { c: 'ink', w: 1.2, r: 1.5 });
        for (let i = 0; i < n; i++) { const v = vals.length ? vals[i % vals.length] : (0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + (o.seed || 0)))); P.rect(cx - 3, cy - h / 2 + 1 + i * (h - 2) / n, 6, (h - 2) / n - 1, { c: 'none', f: o.tone || 'beam', fo: v * .85, r: 0.5 }); }
      });
      if (o.lab) P.lab(cx, cy + h / 2 + 13, o.lab, { a: 'middle' });
      return port(cx, cy, 8); };
    // 격자(SLM·크로스바·화소): 칸 채움 = 가중치(붉음)
    P.grid = (x, y, w, h, n, m, o) => { o = o || {}; const vals = o.vals, cw = w / m, ch = h / n;
      P.part(I(o, 'slm'), [x, y, w, h], () => {
        P.rect(x - 2, y - 2, w + 4, h + 4, { c: 'ink', w: 1.2, r: 2 });
        for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const v = vals ? vals(i, j) : 0.2 + 0.8 * Math.abs(Math.sin(i * 0.7 + j * 1.3));
          P.rect(x + j * cw + .5, y + i * ch + .5, cw - 1, ch - 1, { c: 'none', f: o.tone || 'beam', fo: Math.max(.06, v) * .85, r: .5 }); }
      });
      if (o.lab) P.lab(x + w / 2, y + h + 15, o.lab, { a: 'middle' });
      return { l: [x - 2, y + h / 2], r: [x + w + 2, y + h / 2] }; };
    P.cam = (cx, cy, w, h, o) => { o = o || {}; const vals = o.vals;
      P.part(I(o, 'cam'), [cx - w / 2, cy - h / 2, w, h], () => {
        P.rect(cx - w / 2, cy - h / 2, w, h, { c: 'ink', w: 1.3 });
        const n = o.n || 4, cw = (w - 8) / n, ch = (h - 8) / n;
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = vals ? vals(i, j) : .15;
          P.rect(cx - w / 2 + 4 + j * cw + .5, cy - h / 2 + 4 + i * ch + .5, cw - 1, ch - 1, { c: 'none', f: 'probe', fo: Math.max(.08, v) * .8, r: .5 }); }
      });
      if (o.lab !== '') P.lab(cx, cy + h / 2 + 13, o.lab || '카메라', { a: 'middle' });
      return port(cx, cy, w); };
    P.ring = (cx, cy, r, o) => { o = o || {};
      P.part(I(o, 'ring'), [cx - r - 2, cy - r - 2, 2 * r + 4, 2 * r + 4], () => P.circ(cx, cy, r, { c: o.red ? 'beam' : 'faint', w: o.red ? 2 : 1.6, f: o.fill ? 'warm' : 'none', fo: o.fill || 0 }));
      if (o.lab) P.lab(cx, cy + r + 14, o.lab, { a: 'middle' }); };
    // 2×2 결합기: 두 도파로가 가까워졌다 벌어진다
    P.coupler = (cx, cy, o) => { o = o || {}; const w = o.w || 36, g = o.g || 10;
      P.part(I(o, 'bs'), [cx - w / 2, cy - g - 2, w, 2 * g + 4], () => {
        P.path(`M${cx - w / 2} ${cy - g} C${cx - w / 4} ${cy - g} ${cx - w / 4} ${cy - 2} ${cx} ${cy - 2} C${cx + w / 4} ${cy - 2} ${cx + w / 4} ${cy - g} ${cx + w / 2} ${cy - g}`, { c: 'ink', w: 1.4 });
        P.path(`M${cx - w / 2} ${cy + g} C${cx - w / 4} ${cy + g} ${cx - w / 4} ${cy + 2} ${cx} ${cy + 2} C${cx + w / 4} ${cy + 2} ${cx + w / 4} ${cy + g} ${cx + w / 2} ${cy + g}`, { c: 'ink', w: 1.4 });
      });
      return { l1: [cx - w / 2, cy - g], l2: [cx - w / 2, cy + g], r1: [cx + w / 2, cy - g], r2: [cx + w / 2, cy + g] }; };
    // 1×N 분배: 한 점에서 부채꼴로
    P.split = (x, y, ys, o) => { o = o || {}; const L = o.L || 30;
      const lo = Math.min(y, ...ys), hi = Math.max(y, ...ys);
      const fan = () => ys.forEach(yy => P.path(`M${x} ${y} C${x + L * .5} ${y} ${x + L * .5} ${yy} ${x + L} ${yy}`, { c: o.c || 'beam', w: o.w || 1.4, op: o.op }));
      if (o.id === false) fan(); else P.part(I(o, 'ysplit'), [x, lo - 3, L, hi - lo + 6], fan, [x + 6, y]);
      return ys.map(yy => [x + L, yy]); };
    // 지연선: 감은 광섬유
    P.coil = (cx, cy, o) => { o = o || {}; const r = o.r || 12;
      P.part(I(o, 'delay'), [cx - r - 6, cy - r, 2 * r + 12, 2 * r], () => { for (let i = 0; i < 3; i++) P.ell(cx - 4 + i * 4, cy, r, r * .8, { c: o.c || 'faint', w: 1.3 }); });
      if (o.lab) P.lab(cx, cy + r + 13, o.lab, { a: 'middle' });
      return port(cx, cy, 2 * r + 12); };
    P.amp = (cx, cy, o) => { o = o || {};
      P.part(I(o, 'amp'), [cx - 13, cy - 12, 26, 24], () => { P.path(`M${cx - 12} ${cy - 12} L${cx + 13} ${cy} L${cx - 12} ${cy + 12} Z`, { c: 'ink', w: 1.3, f: 'panel' }); P.text(cx - 5, cy + 4, o.t || 'G', { c: 'ink', s: 9.5 }); });
      if (o.lab) P.lab(cx, cy + 25, o.lab, { a: 'middle' });
      return port(cx, cy, 26); };
    P.iso = (cx, cy, o) => { o = o || {};
      P.part(I(o, 'iso'), [cx - 14, cy - 9, 28, 18], () => { P.rect(cx - 14, cy - 9, 28, 18, { c: 'ink', w: 1.2 }); P.path(`M${cx - 8} ${cy} H${cx + 6} M${cx + 2} ${cy - 4} L${cx + 7} ${cy} L${cx + 2} ${cy + 4}`, { c: 'ink', w: 1.2 }); });
      if (o.lab) P.lab(cx, cy + 22, o.lab, { a: 'middle' });
      return port(cx, cy, 28); };
    // 파장 분배기(먹스·디먹스): 사다리꼴, n갈래
    P.wdm = (cx, cy, h, o) => { o = o || {}; const w = o.w || 22, flip = !!o.flip;
      P.part(I(o, 'wdm'), [cx - w / 2, cy - h / 2, w, h], () => P.path(flip
        ? `M${cx - w / 2} ${cy - h / 2} L${cx + w / 2} ${cy - 7} L${cx + w / 2} ${cy + 7} L${cx - w / 2} ${cy + h / 2} Z`
        : `M${cx - w / 2} ${cy - 7} L${cx + w / 2} ${cy - h / 2} L${cx + w / 2} ${cy + h / 2} L${cx - w / 2} ${cy + 7} Z`, { c: 'ink', w: 1.3, f: 'grid' }));
      if (o.lab) P.lab(cx, cy + h / 2 + 13, o.lab, { a: 'middle' });
      return port(cx, cy, w); };
    // 위상 천이기: 도파로 위 붉은 히터(가중치 자리)
    P.ps = (cx, cy, o) => { o = o || {}; const w = o.w || 22, v = o.v == null ? 1 : o.v;
      P.part(I(o, 'ps'), [cx - w / 2, cy - 7, w, 6], () => P.rect(cx - w / 2, cy - 7, w, 5, { c: 'none', f: o.tone || 'beam', fo: .25 + .7 * v, r: 1.5 }));
      if (o.lab) P.lab(cx, cy - 11, o.lab, { a: 'middle', s: 9.5 }); };
    // 안정화 루프: 파란 점선 고리
    P.lock = (x, y, w, h, o) => { o = o || {};
      P.part(I(o, 'lock'), [x, y, w, h], () => { P.rect(x, y, w, h, { c: 'probe', w: 1.1, f: 'none', dash: [3, 3], r: 6 }); }, o.at || [x + w, y + h / 2]);
      if (o.lab !== '') P.lab(o.lx == null ? x + w + 4 : o.lx, o.ly == null ? y + 11 : o.ly, o.lab || '락', { c: 'probe', s: 9.5 }); };
    // 영역 표시(칩·공진기·자유공간 구역) — 옅은 바탕
    P.zone = (x, y, w, h, lab, o) => { o = o || {}; P.rect(x, y, w, h, { c: 'rule', w: 1, f: o.f || 'grid', fo: o.fo == null ? .45 : o.fo, r: 6 }); if (lab) P.lab(x + 6, y - 6, lab, { s: 10 }); };
    // 오른쪽 아래 보조 패널 자리 — 옅은 테두리와 제목
    P.aux = (x, y, w, h, title) => { P.rect(x, y, w, h, { c: 'rule', w: 1, f: 'panel', r: 4 }); if (title) P.lab(x + 8, y + 15, title, { s: 10, c: 'muted' }); };

    // 아무것도 안 그리고 자리만 기록(옛 그림이 그린 부품에 마커를 달 때)
    P.mark = (id, bb, at) => P.part(id, bb, () => {}, at);
    // 같은 부품의 둘째 자리(마커 p2) — 반복되는 부품은 첫째만 찍히고, 둘째는 이걸로 골라 찍는다
    P.at2 = (id, at) => { if (parts[id]) parts[id].at2 = at; if (!cv) out.push(`<g data-part2="${id}" data-at="${at.map(r1).join(',')}"></g>`); };
    // 범례 한 줄: 사이클 단계 + 색 약속
    P.legend = (x, y, steps) => {
      // 한 줄 글자로 — 영어판 사전이 조각마다 바꿔도 간격이 저절로 맞는다
      // 단계가 다섯을 넘으면 두 줄 — 번역되어 길어져도 오른쪽 보조 패널(x 470~)에 닿지 않게
      const k = steps.length > 5 ? Math.ceil(steps.length / 2) : steps.length, two = k < steps.length;
      P.lab(x, y, steps.slice(0, k).join(' → ') + (two ? ' →' : ''), { s: 10, c: 'ink' });
      if (two) P.lab(x, y + 14, steps.slice(k).join(' → '), { s: 10, c: 'ink' });
      const yk = y + (two ? 29 : 15);
      P.path(`M${x} ${yk} h16`, { c: 'beam', w: 2.4 }); P.lab(x + 22, yk + 4, '빛 · 가중치', { s: 9.5 });
      P.path(`M${x + 120} ${yk} h16`, { c: 'probe', w: 1.6 }); P.lab(x + 142, yk + 4, '전자 · 제어', { s: 9.5 });
    };
    P.out = () => out.join('');
    P.parts = () => parts;
    P.ctx = ctx;
    return P;
  }

  // SVG 안에 옛 그래프를 축척 그대로 끼운다(넘치는 문장은 잘린다 — 문장은 그림 밖으로)
  function sub(x, y, w, h, vb, inner) { return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`; }
  // 캔버스 펜의 부품 기록을 캔버스에 붙인다(점검 스크립트가 읽는다)
  function seal(P) { if (P.ctx) P.ctx.canvas._parts = P.parts(); return P; }

  window.CYC = { pen, sub, seal, HEX };
})();
