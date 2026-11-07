/* 공용 런타임: 데이터 받기 · 해시 라우터 · DOM 도우미. 전역 이름은 A 하나. */
(function () {
  'use strict';

  // ── 데이터 ─────────────────────────────────────────────
  // 빌드가 <script type="application/json" id="data-<name>"> (공개)와
  // id="data-<name>-private" (개인 오버레이, 개인 빌드에만)를 인라인한다.
  const cache = {};

  function fail(msg) {
    let el = document.querySelector('.fail');
    if (!el) {
      el = document.createElement('div');
      el.className = 'fail';
      el.setAttribute('role', 'alert');
      document.body.appendChild(el);
    }
    el.textContent = el.textContent ? el.textContent + ' · ' + msg : msg;
    console.error(msg);
  }

  function readJSON(id) {
    const el = document.getElementById(id);
    if (!el) return undefined;
    return JSON.parse(el.textContent);
  }

  function ptr(p) {
    return p.split('/').slice(1).map(k => k.replace(/~1/g, '/').replace(/~0/g, '~'));
  }

  // 오버레이 규칙(build.py 의 merge 와 같다):
  //  배열 + 객체 → 키가 숫자면 인덱스, 아니면 원소의 id 로 찾아 병합
  //  배열 + 배열 → 같은 인덱스끼리 병합 / 객체 + 객체 → 키별 병합 / 그 밖 → 오버레이 값
  //  "$paths": {JSON Pointer: 값} → 마지막에 그 자리를 통째로 바꾼다
  function merge(base, ov) {
    if (ov === undefined) return base;
    if (ov && typeof ov === 'object' && !Array.isArray(ov)) {
      const paths = ov.$paths;
      let out;
      if (Array.isArray(base)) {
        out = base.slice();
        for (const k of Object.keys(ov)) {
          if (k === '$paths') continue;
          const i = /^\d+$/.test(k) ? +k : out.findIndex(r => r && r.id === k);
          if (i >= 0) out[i] = merge(out[i], ov[k]);
        }
      } else {
        out = Object.assign({}, base && typeof base === 'object' ? base : {});
        for (const k of Object.keys(ov)) if (k !== '$paths') out[k] = merge(out[k], ov[k]);
      }
      if (paths) for (const p of Object.keys(paths)) {
        const ks = ptr(p), last = ks.pop();
        let host = out;
        for (const k of ks) { host = host && host[k]; }
        if (host) host[last] = paths[p];
      }
      return out;
    }
    if (Array.isArray(ov) && Array.isArray(base)) {
      const out = base.slice();
      ov.forEach((v, i) => { out[i] = merge(out[i], v); });
      return out;
    }
    return ov;
  }

  function data(name) {
    if (name in cache) return cache[name];
    let pub, priv;
    try {
      pub = readJSON('data-' + name);
      priv = readJSON('data-' + name + '-private');
    } catch (e) {
      fail(t('데이터 로드 실패: ', 'Failed to load data: ') + name + '.json (' + e.message + ')');
      return (cache[name] = null);
    }
    if (pub === undefined && priv === undefined) {
      fail(t('데이터 로드 실패: ', 'Failed to load data: ') + name + '.json');
      return (cache[name] = null);
    }
    return (cache[name] = merge(pub === undefined ? {} : pub, priv));
  }
  const hasPrivate = name => !!document.getElementById('data-' + name + '-private');

  // ── 해시 라우터 ─────────────────────────────────────────
  // 화면 상태는 전부 해시 하나에 있다. 앞부분은 무엇을 보나(선택), ? 뒤는 어떻게 보나(필터·검색·축).
  // "#d5" → {key:'', arg:'d5'} · "#term/포켈스?only=L3" → {key:'term', arg:'포켈스', params:{only:'L3'}}
  // 페이지는 클릭에서 화면을 직접 고치지 않고 go/set 으로 해시만 바꾼다. 그리기는 on 구독자 한 곳에서만.
  function parse(hash) {
    const all = (hash || '').replace(/^#/, '');
    const q = all.indexOf('?');
    const h = q < 0 ? all : all.slice(0, q);
    const params = {};
    if (q >= 0) new URLSearchParams(all.slice(q + 1)).forEach((v, k) => { params[k] = v; });
    const d = s => { try { return decodeURIComponent(s); } catch (e) { return s; } };
    const i = h.indexOf('/');
    const r = i < 0 ? { key: '', arg: d(h), raw: d(h) } : { key: d(h.slice(0, i)), arg: d(h.slice(i + 1)), raw: d(h) };
    r.params = params;
    return r;
  }
  function fmt(key, arg, params) {
    const a = arg == null ? '' : String(arg);
    const path = !key && !a ? '' : (key ? encodeURIComponent(key) + '/' : '') + encodeURIComponent(a);
    const qs = new URLSearchParams();
    Object.keys(params || {}).sort().forEach(k => { const v = params[k]; if (v != null && v !== '') qs.set(k, v); });
    const q = qs.toString();
    return path || q ? '#' + path + (q ? '?' + q : '') : '';
  }
  const norm = hash => { const r = parse(hash); return fmt(r.key, r.arg, r.params); };
  const subs = [];
  let last = null;
  function emit() {
    const now = norm(location.hash);
    if (last !== null && now === last) return;
    last = now;
    const r = parse(location.hash);
    subs.forEach(fn => fn(r));
  }
  function write(h, opt) {
    if (h === norm(location.hash)) return;
    history[opt && opt.replace ? 'replaceState' : 'pushState'](null, '', location.pathname + location.search + h);
    emit();
  }
  const route = {
    get: () => parse(location.hash),
    // 구독: 등록 즉시 현재 상태로 한 번 부르고, 이후 뒤로/앞으로·해시 변경마다 부른다
    on(fn) { subs.push(fn); fn(parse(location.hash)); },
    // 선택 이동. 보기 상태(params)는 유지한다 — opt.params 로 같이 바꿀 수 있다(null 은 지움)
    go(key, arg, opt) {
      const cur = parse(location.hash).params;
      write(fmt(key, arg, Object.assign({}, cur, opt && opt.params)), opt);
    },
    // 보기 상태만 바꾼다. 선택은 그대로. 기본값과 같은 값은 null 로 넘겨 주소를 짧게 둔다
    set(patch, opt) {
      const r = parse(location.hash);
      write(fmt(r.key, r.arg, Object.assign({}, r.params, patch)), opt);
    },
    // 보기 상태 읽기(없으면 기본값)
    param: (r, name, def) => (r.params[name] != null ? r.params[name] : def),
    href: fmt,
    parse,
  };
  window.addEventListener('popstate', emit);
  window.addEventListener('hashchange', emit);

  // ── DOM 도우미 ─────────────────────────────────────────
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ESC[c]);

  // h('button.pill.on', {onclick, title, style:{...}, dataset:{...}, html:'<b>..</b>'}, '글자', 자식요소…)
  function h(spec, attrs, ...kids) {
    const m = spec.match(/^([a-z0-9-]+)?((?:[.#][\w-]+)*)$/i);
    const el = document.createElement((m && m[1]) || 'div');
    if (m && m[2]) m[2].replace(/([.#])([\w-]+)/g, (_, t, v) => { t === '.' ? el.classList.add(v) : (el.id = v); });
    if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(Infinity).forEach(c => { if (c != null && c !== false) el.append(c instanceof Node ? c : String(c)); });
    return el;
  }

  // 알약 버튼(필터 칩). on 이면 .on — 색은 CSS 토큰이 정한다
  function pill(label, on, onclick, extra) {
    const b = h('button.pill', Object.assign({ type: 'button', onclick, 'aria-pressed': on ? 'true' : 'false' }, extra || {}));
    if (on) b.classList.add('on');
    if (label instanceof Node || Array.isArray(label)) b.append(...[].concat(label)); else b.textContent = label;
    return b;
  }

  // 교체 렌더: el 의 자식을 kids 로 갈아끼운다
  function mount(el, ...kids) {
    el = typeof el === 'string' ? $(el) : el;
    el.replaceChildren(...kids.flat(Infinity).filter(k => k != null && k !== false));
    return el;
  }

  // ── 언어 ──────────────────────────────────────────────
  // 번역판(en/)은 <html lang="en">, 자산은 한 단계 위(root = '../')에 있다.
  const lang = document.documentElement.lang || 'ko';
  const root = document.body.dataset.root || '';
  // 탭 제목 끝의 사이트 이름(빌드가 언어별로 넣는다) — 페이지가 제목을 다시 쓸 때 쓴다
  const site = document.title.split(' — ').pop();
  // 이름 사전: 데이터 키(한국어)는 그대로 두고 화면에 그릴 때만 번역판 이름으로 바꾼다
  const dictEl = document.getElementById('i18n-dict');
  const DICT = dictEl ? JSON.parse(dictEl.textContent) : {};
  const tr = s => (s != null && Object.prototype.hasOwnProperty.call(DICT, s) ? DICT[s] : s);
  // 화면 문구 사전(i18n-tx): 한국어 조각 → 번역. 한글 낱말 중간은 건드리지 않는다(앞뒤가 한글이 아닐 때만)
  const txEl = document.getElementById('i18n-tx');
  const TXD = txEl ? JSON.parse(txEl.textContent) : null;
  let TXR = null;
  if (TXD) {
    const keys = Object.keys(TXD).sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    TXR = new RegExp('(?<![가-힣])(?:' + keys.join('|') + ')(?![가-힣])', 'g');
  }
  const HANGUL = /[가-힣]/;
  const tx = s => (TXR && typeof s === 'string' && HANGUL.test(s) ? s.replace(TXR, m => TXD[m]) : s);
  if (TXR) {
    // 캔버스에 직접 그리는 글자
    const C2 = CanvasRenderingContext2D.prototype;
    ['fillText', 'strokeText', 'measureText'].forEach(fn => {
      const orig = C2[fn];
      C2[fn] = function (text, ...rest) { return orig.call(this, tx(text), ...rest); };
    });
    // 그려진 DOM 글자·속성 — 처음 한 번과 바뀔 때마다
    const ATTRS = ['title', 'aria-label', 'placeholder'];
    // 바뀔 때만 쓴다 — 같은 값을 다시 쓰면 감시가 또 깨어나 끝없이 돈다
    const setText = n => { const v = n.nodeValue; if (HANGUL.test(v)) { const nv = tx(v); if (nv !== v) n.nodeValue = nv; } };
    const fix = root => {
      if (root.nodeType === 3) { setText(root); return; }
      if (root.nodeType !== 1 || root.closest('.lang, script, style')) return;
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) if (!n.parentElement.closest('.lang, script, style')) setText(n);
      [root, ...root.querySelectorAll('[title], [aria-label], [placeholder]')].forEach(el => ATTRS.forEach(a => {
        const v = el.getAttribute && el.getAttribute(a); if (v && HANGUL.test(v)) { const nv = tx(v); if (nv !== v) el.setAttribute(a, nv); }
      }));
    };
    const start = () => {
      const main = document.querySelector('.app') || document.body;
      fix(main);
      new MutationObserver(ms => ms.forEach(m => {
        if (m.type === 'characterData') fix(m.target);
        else if (m.type === 'attributes') fix(m.target);
        else m.addedNodes.forEach(fix);
      })).observe(main, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  }
  const t = (ko, en) => (lang === 'en' && en != null ? en : ko);
  // 언어 전환 링크는 지금 보고 있는 선택·필터(해시)를 그대로 가지고 간다
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('.lang a');
    if (a && location.hash) a.href = a.getAttribute('href').split('#')[0] + location.hash;
  });

  const narrow = () => window.matchMedia('(max-width: 899.98px)').matches;
  const stars = (n, max = 3) => '★'.repeat(n) + '☆'.repeat(max - n);

  // 관련 논문 목록 — content/papers.json 을 태그(구조 id 등)로 거른다. 페이지에 그 데이터가 없으면 null.
  // open(preset) 을 주면 프리셋이 있는 논문에 「실험실에서 열기」를 단다. PDF 는 개인판에만 있다
  function papers(tag, open) {
    if (!document.getElementById('data-papers')) return null;
    const P = (data('papers') || {}).PAPERS || [], list = P.filter(p => (p.tags || []).includes(tag));
    if (!list.length) return null;
    return h('div.papers', h('span.lb', t(`관련 논문 ${list.length}편`, `Related papers (${list.length})`)), list.map(p => h('div.paper',
      h('a.paper-t', { href: p.arxiv ? 'https://arxiv.org/abs/' + p.arxiv : 'https://doi.org/' + p.doi, target: '_blank', rel: 'noopener' }, p.t),
      h('span.paper-m', `${p.a} · ${p.y} · ${p.v}`),
      h('span.paper-d', p.did),
      h('span.paper-l',
        (p.tags || []).filter(t => !/^[a-f]\d+$/.test(t)).map(t => h('span.tag', tr(t))),
        p.arxiv ? h('a', { href: 'https://arxiv.org/abs/' + p.arxiv, target: '_blank', rel: 'noopener' }, 'arXiv') : null,
        p.doi ? h('a', { href: 'https://doi.org/' + p.doi, target: '_blank', rel: 'noopener' }, 'DOI') : null,
        p.pdf ? h('a', { href: root + p.pdf, target: '_blank' }, 'PDF') : null,
        p.preset && open ? h('a', { href: open(p.preset) }, t('실험실에서 열기 →', 'Open in the lab →')) : null))));
  }

  window.A = { lang, root, site, t, tr, tx, data, hasPrivate, merge, route, $, $$, h, esc, pill, mount, fail, narrow, stars, papers };
})();
