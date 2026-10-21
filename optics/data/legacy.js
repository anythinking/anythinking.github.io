(function () {
  const PAL = { beam: '#C9472F', probe: '#2C7A86', warm: '#B7791F', wall: '#8A5A2B', panel: '#FBFAF7', ink: '#1C1B18', muted: '#6B675E', rule: '#D9D4C9', grid: '#ECE8DF', bg: '#F2F0EB' };
  const ATTR = {
    wg: [['fill', 'none'], ['stroke', '#8C877C']], bm: [['fill', 'none'], ['stroke', '#C9472F'], ['stroke-linecap', 'round']],
    pd: [['fill', 'none'], ['stroke', '#2C7A86']], pdf: [['fill', '#2C7A86'], ['stroke', 'none']], ht: [['fill', '#B7791F'], ['stroke', 'none']],
    gridl: [['fill', 'none'], ['stroke', '#D9D4C9']], box: [['fill', '#FBFAF7'], ['stroke', '#D9D4C9']], fillg: [['fill', '#ECE8DF'], ['stroke', '#D9D4C9']],
    m: [['fill', '#6B675E']], i: [['fill', '#1C1B18']], a: [['fill', '#C9472F']], p: [['fill', '#2C7A86']], w: [['fill', '#8A5A2B']]
  };
  const shim = { getPropertyValue: k => ' ' + (PAL[String(k).replace(/^--/, '')] || '#000') };
  const gcs = () => shim;
  function fixTree(el) {
    if (!el || !el.querySelectorAll) return;
    const list = el.matches && el.matches('svg') ? el.querySelectorAll('[class]') : el.querySelectorAll('svg [class]');
    list.forEach(n => {
      const c = n.getAttribute('class');
      if (n.getAttribute('data-c') === c) return;
      c.split(/\s+/).forEach(k => (ATTR[k] || []).forEach(([a, v]) => n.setAttribute(a, v)));
      n.setAttribute('data-c', c);
    });
  }
  const inkHtml = s => String(s || '')
    .replace(/class="k"/g, 'style="color:#C9472F;font-weight:700"')
    .replace(/class="w"/g, 'style="color:#8A5A2B;font-weight:700"')
    .replace(/<b>/g, '<b style="color:#1C1B18">');
  const txt = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  function boot(g) {
    const L = window.OPT_LEGACY && window.OPT_LEGACY[g];
    if (!L) return null;
    if (L.entries) return L;
    const root = document.createElement('div');
    root.setAttribute('aria-hidden', 'true');
    root.setAttribute('data-legacy-root', g);
    document.querySelectorAll('[data-legacy-root="' + g + '"]').forEach(n => n.remove());
    root.style.cssText = 'position:absolute;left:-20000px;top:0;width:1100px;visibility:hidden;pointer-events:none';
    root.innerHTML = L.html;
    root.querySelectorAll('section[hidden]').forEach(s => s.removeAttribute('hidden'));
    const src = L.run.toString();
    root.querySelectorAll('[id]').forEach(n => {
      const short = n.id.replace(/^\w-/, '');
      if (short !== n.id && src.indexOf("'#" + short) >= 0 && !document.getElementById(short)) n.id = short;
    });
    document.body.appendChild(root);
    L.root = root;
    try { L.run(gcs); } catch (e) { console.warn('legacy run', g, e); }
    try { window.MOD && window.MOD[g] && window.MOD[g].init(); } catch (e) { console.warn('legacy init', g, e); }
    fixTree(root);
    L.entries = build(g, root);
    return L;
  }

  function build(g, root) {
    const ST = (window.OPT_DATA && window.OPT_DATA.ST) || {};
    const tabNames = {};
    root.querySelectorAll('[id$="-tabs"] button[data-s]').forEach(b => {
      const n = b.querySelector('.n'); tabNames[b.dataset.s] = txt(b).replace(n ? txt(n) : '', '').trim();
    });
    const lede = root.querySelector(':scope > p.lede');
    return [...root.querySelectorAll('.card.sec')].map((card, idx) => {
      const sNum = String(idx + 1), id = card.id.replace(/^(\w)-s/, '$1');
      const h2 = card.querySelector('h2');
      if (card.classList.contains('close')) {
        return { id, num: '', tab: tabNames[sNum] || '겹쳐 보면', title: txt(h2), text: true, legacy: true, group: g,
          bodyHtml: [...card.querySelectorAll(':scope > p')].map(p => '<p style="margin:0">' + inkHtml(p.innerHTML) + '</p>').join(''),
          figEl: card.querySelector('svg.f, canvas.f'), ledeHtml: lede ? inkHtml(lede.innerHTML) : '' };
      }
      const num = txt(card.querySelector('.num'));
      const chips = [...card.querySelectorAll('.head .chip')];
      const key = Object.keys(ST).find(k => ST[k][0] === g && String(ST[k][1]) === String(+num)) || '';
      const panes = [...card.querySelectorAll('.split')].map((sp, i) => {
        const fig = sp.querySelector('.fig svg, .fig canvas');
        const step = sp.closest('.wstep');
        let h = '';
        let prev = sp.previousElementSibling;
        while (prev && !h) { if (prev.matches('h3')) h = txt(prev); if (prev.matches('.split')) break; prev = prev.previousElementSibling; }
        const intro = step ? step.querySelector('.wtext') : (sp.previousElementSibling && sp.previousElementSibling.matches('p.wtext, p.sub') ? sp.previousElementSibling : null);
        const wi = step ? [...card.querySelectorAll('.wstep')].indexOf(step) + 1 : 0;
        return { fig, ctl: sp.children[1], read: sp.querySelector('.read'), note: sp.querySelector('.note'), introHtml: intro ? inkHtml(intro.innerHTML) : '',
          wbtn: wi ? card.querySelector('[data-w="' + wi + '"]') : null,
          label: step ? (i === 0 ? '실험' : String([...card.querySelectorAll('.wstep')].indexOf(step) + 1)) : (h || (i === 0 ? '실험' : String(i + 1))), step: !!step };
      });
      const walkHead = card.querySelector('.walkhead h3');
      return { id, num, tab: tabNames[sNum] || txt(h2), title: txt(h2), legacy: true, group: g, key,
        who: txt(chips.find(c => !c.classList.contains('wall'))), wall: txt(chips.find(c => c.classList.contains('wall'))),
        ideaHtml: inkHtml((card.querySelector('.idea') || {}).innerHTML || ''), panes, walkTitle: walkHead ? txt(walkHead) : '' };
    });
  }

  function controls(pane) {
    const out = [];
    if (!pane || !pane.ctl) return out;
    const walk = el => {
      [...el.children].forEach(c => {
        if (c.matches('.read, .note, .walkhead, .steps')) return;
        if (c.matches('.row') && c.querySelector('input[type=range]')) {
          const inp = c.querySelector('input[type=range]'), o = c.querySelector('output');
          out.push({ kind: 'range', label: txt(c.querySelector('label')), el: inp, min: inp.min, max: inp.max, step: inp.step, value: +inp.value, text: o ? txt(o) : inp.value });
        } else if (c.matches('.btns')) {
          const chip = c.querySelector('.chip');
          const btns = [...c.querySelectorAll('button')].filter(b => !b.hidden && !/wprev|wnext/.test(b.id));
          if (btns.length) out.push({ kind: 'row', label: chip ? txt(chip) : '', btns: btns.map(b => ({ el: b, text: txt(b), on: b.getAttribute('aria-pressed') === 'true', dis: b.disabled })) });
        } else if (c.matches('button')) {
          if (!/wprev|wnext/.test(c.id) && !c.hidden) out.push({ kind: 'row', label: '', btns: [{ el: c, text: txt(c), on: c.getAttribute('aria-pressed') === 'true', dis: c.disabled }] });
        } else if (c.children.length) walk(c);
      });
    };
    walk(pane.ctl);
    return out;
  }
  function fire(kind, el, v) {
    if (kind === 'range') { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }
    else el.click();
  }

  /* ── 가로로 나란한 그림을 위·아래로 쌓는다 ── */
  const STACK = {
    'c-f2': { parts: [(x, y) => y < 104 || x < 140, (x, y) => y < 232, () => true], max: 1.7 },
    'd-f5': { parts: [(x, y, c, b) => b.y + b.height <= 56 && !(c.tagName === 'text' && b.x >= 28 && b.x < 44), () => true] },
    'd-f6': { parts: [(x, y, c, b) => b.height < 40 && b.y >= 26 && b.y + b.height <= 80 && (x < 165 || (c.tagName === 'text' && x > 190)), () => true] },
    'e-f2': { rects: [[0, 0, 555, 320], [545, 0, 335, 320]] },
    'e-f3': { rects: [[0, 0, 295, 300], [295, 0, 302, 300], [597, 0, 283, 300]], rows: [[0, 1], [2]] },
    'e-f4': { rects: [[0, 0, 440, 340], [440, 0, 440, 340]] },
    'b-f1': { rects: [[0, 0, 330, 360], [345, 0, 535, 360]] },
    'b-f4': { rects: [[0, 0, 285, 330], [290, 0, 590, 330]] }
  };
  function layout(rects, spec) {
    const rows = spec.rows || rects.map((_, i) => [i]), max = spec.max || 1.4, gap = 10;
    const rw = rows.map(r => r.reduce((s, i) => s + rects[i][2], 0) + gap * (r.length - 1));
    const W = Math.max(...rw); let oy = 0; const map = [];
    rows.forEach((r, k) => {
      const s = Math.min(max, W / rw[k]); let ox = (W - rw[k] * s) / 2, rh = 0;
      r.forEach(i => { const [x, y, w, h] = rects[i]; map[i] = { x, y, w, h, ox, oy, s }; ox += (w + gap) * s; rh = Math.max(rh, h * s); });
      oy += rh + gap;
    });
    return { W, H: oy - gap, map };
  }
  function mapPoint(L, x, y) {
    if (!L) return [x, y];
    let best = null, bd = 1e9;
    L.map.forEach(m => { if (!m) return; const dx = Math.max(m.x - x, 0, x - m.x - m.w), dy = Math.max(m.y - y, 0, y - m.y - m.h), d = dx + dy; if (d < bd) { bd = d; best = m; } });
    return best ? [best.ox + (x - best.x) * best.s, best.oy + (y - best.y) * best.s] : [x, y];
  }
  function stackSvg(el, spec) {
    if (!el.viewBox) return null;
    const kids = [...el.children];
    if (kids.length && kids.every(k => k.hasAttribute('data-stk'))) return el._stk;
    kids.filter(k => k.hasAttribute('data-stk')).forEach(g => { while (g.firstChild) el.insertBefore(g.firstChild, g); g.remove(); });
    if (!el._vb0) { const v = el.viewBox.baseVal; el._vb0 = [v.x, v.y, v.width, v.height]; }
    el.setAttribute('viewBox', el._vb0.join(' '));
    const items = [...el.children], n = spec.parts.length, buckets = Array.from({ length: n }, () => []), box = Array(n).fill(null);
    items.forEach(c => {
      let b = null; try { b = c.getBBox(); } catch (e) {}
      let i = n - 1;
      if (b && (b.width || b.height)) { const cx = b.x + b.width / 2, cy = b.y + b.height / 2; i = spec.parts.findIndex(f => f(cx, cy, c, b)); if (i < 0) i = n - 1;
        const r = box[i]; box[i] = r ? [Math.min(r[0], b.x), Math.min(r[1], b.y), Math.max(r[2], b.x + b.width), Math.max(r[3], b.y + b.height)] : [b.x, b.y, b.x + b.width, b.y + b.height]; }
      buckets[i].push(c);
    });
    const pad = 6, rects = box.map(r => r ? [r[0] - pad, r[1] - pad, r[2] - r[0] + 2 * pad, r[3] - r[1] + 2 * pad] : [0, 0, 1, 1]);
    const L = layout(rects, spec), NS = 'http://www.w3.org/2000/svg';
    buckets.forEach((list, i) => {
      const m = L.map[i]; if (!m) return;
      const g = document.createElementNS(NS, 'g'); g.setAttribute('data-stk', i);
      g.setAttribute('transform', `translate(${m.ox.toFixed(1)} ${m.oy.toFixed(1)}) scale(${m.s.toFixed(3)}) translate(${-m.x} ${-m.y})`);
      list.forEach(c => g.appendChild(c)); el.appendChild(g);
    });
    el.setAttribute('viewBox', `0 0 ${L.W.toFixed(1)} ${L.H.toFixed(1)}`);
    el._stk = L; return L;
  }
  function canvasLayout(spec) { return spec._L || (spec._L = layout(spec.rects, Object.assign({}, spec, { max: 1 }))); }
  function blit(src, dst, spec, k) {
    k = k || 1;
    const L = canvasLayout(spec), W = Math.round(L.W * k), H = Math.round(L.H * k);
    if (dst.width !== W) dst.width = W; if (dst.height !== H) dst.height = H;
    const c = dst.getContext('2d'); c.clearRect(0, 0, W, H);
    spec.rects.forEach(([x, y, w, h], i) => { const m = L.map[i]; c.drawImage(src, x * k, y * k, w * k, h * k, m.ox * k, m.oy * k, w * m.s * k, h * m.s * k); });
    return L;
  }
  const stack = { spec: el => el && STACK[el.id], svg: stackSvg, blit, canvasLayout, layout, mapPoint };

  window.OPT = window.OPT || { groups: {} };
  window.OPT.groups = window.OPT.groups || {};
  window.OPT.stack = stack;
  window.OPT.legacy = { boot, controls, fire, fixTree, inkHtml };
  const names = { b: 'B · 신경망', c: 'C · 최적화', d: 'D · 논리', e: 'E · 변환 앞', f: 'F · 양자·신호' };
  window.OPT.legacyGroup = g => {
    if (!names[g] || !window.OPT_LEGACY || !window.OPT_LEGACY[g]) return null;
    return { id: g, name: names[g], legacy: true, get list() { const L = boot(g); return L ? L.entries : []; } };
  };
  window.dispatchEvent(new Event('opt-ready'));
})();
