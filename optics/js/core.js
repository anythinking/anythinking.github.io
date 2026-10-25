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
      fail('데이터 로드 실패: ' + name + '.json (' + e.message + ')');
      return (cache[name] = null);
    }
    if (pub === undefined && priv === undefined) {
      fail('데이터 로드 실패: ' + name + '.json');
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

  const narrow = () => window.matchMedia('(max-width: 899.98px)').matches;
  const stars = (n, max = 3) => '★'.repeat(n) + '☆'.repeat(max - n);

  window.A = { data, hasPrivate, merge, route, $, $$, h, esc, pill, mount, fail, narrow, stars };
})();
