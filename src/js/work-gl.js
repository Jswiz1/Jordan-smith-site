/* Selected work, drawn in WebGL: each project image is a plane bent around the same curve the DOM carousel uses.
   Scroll still drives it (the section stays pinned), and it also takes drag, horizontal trackpad swipes and the
   arrow keys, with inertia and snapping. Clicking the front card grows its image to full screen (GSAP Flip in site.js).
   The DOM cards stay underneath as the fallback: reduced motion, no WebGL, or a lost context simply leaves them showing.
   Pauses off-screen, caps the pixel ratio and uses a lighter mesh on phones. */
(function () {
  var stage = document.getElementById('stage');
  var C = window.WorkCarousel;
  if (!stage || !C) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var phone = matchMedia('(pointer: coarse)').matches || window.innerWidth < 700;
  var SEG = phone ? 16 : 40;
  var DPR = Math.min(window.devicePixelRatio || 1, phone ? 1.25 : 1.5);

  var cv = document.createElement('canvas');
  cv.className = 'work-gl';
  cv.setAttribute('aria-hidden', 'true');
  var gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true, depth: false, stencil: false });
  if (!gl) return;
  stage.appendChild(cv);

  /* ---------- shaders ---------- */
  var VS = [
    'attribute vec2 aPos;',
    'uniform float uD, uW, uH, uR, uStep, uPersp;',
    'uniform vec2 uRes;',
    'varying vec2 vUv;',
    'void main(){',
    '  vUv = aPos + .5;',
    '  float th = uD * uStep + aPos.x * uW / uR;',        // every vertex sits on the curve, so the plane bends with it
    '  float x = uR * sin(th);',
    '  float z = uR * (1. - cos(th)) * .85;',
    '  float s = uPersp / (uPersp - z);',
    '  gl_Position = vec4(x * s / (uRes.x * .5), aPos.y * uH * s / (uRes.y * .5), 0., 1.);',
    '}'
  ].join('\n');
  var FS = [
    'precision mediump float;',
    'uniform sampler2D uTex; uniform vec2 uCov, uCovOff; uniform float uGs, uAlpha;',
    'varying vec2 vUv;',
    'void main(){',
    '  vec3 c = texture2D(uTex, vUv * uCov + uCovOff).rgb;',
    '  float g = dot(c, vec3(.299, .587, .114));',
    '  vec3 col = mix(c, vec3(g), uGs);',                   // colour at the front, black and white to the sides
    '  col *= 1. - smoothstep(.5, 0., vUv.y) * .3;',        // the same soft floor shadow the DOM cards have
    '  gl_FragColor = vec4(col, uAlpha);',
    '}'
  ].join('\n');
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  var pg = gl.createProgram();
  try {
    gl.attachShader(pg, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pg, sh(gl.FRAGMENT_SHADER, FS));
    gl.bindAttribLocation(pg, 0, 'aPos'); gl.linkProgram(pg);
    if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) throw new Error('link');
  } catch (e) { cv.remove(); return; }
  gl.useProgram(pg);
  var U = {};
  ['uD', 'uW', 'uH', 'uR', 'uStep', 'uPersp', 'uRes', 'uTex', 'uCov', 'uCovOff', 'uGs', 'uAlpha'].forEach(function (n) { U[n] = gl.getUniformLocation(pg, n); });

  // a strip of SEG quads, so the plane can bend smoothly
  var v = [];
  for (var i = 0; i <= SEG; i++) { var x = i / SEG - 0.5; v.push(x, -0.5, x, 0.5); }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.uniform1i(U.uTex, 0);

  /* ---------- textures: loaded when the section gets close ---------- */
  var P = C.projects, tex = [], aspect = [], loaded = 0;
  function loadAll() {
    P.forEach(function (p, k) {
      var im = new Image();
      im.onload = function () {
        var t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        tex[k] = t; aspect[k] = im.naturalWidth / im.naturalHeight;
        if (++loaded === P.length) ready();
      };
      im.onerror = function () { if (++loaded === P.length) ready(); };
      im.src = p.img || '';
    });
  }
  var started = false;
  function ready() {
    if (tex.filter(Boolean).length < P.length) { cv.remove(); return; } // any image missing: keep the DOM cards
    stage.classList.add('gl');
    started = true;
    wake();
  }

  /* ---------- geometry shared by drawing and hit-testing ---------- */
  var S = null, Wpx = 0, Hpx = 0;
  function bentR(st) { return st.R * (1 - Math.min(1, Math.abs(st.target - st.pos)) * 0.08); } // a touch more curve while moving
  function project(st, th) {
    var R = bentR(st), x = R * Math.sin(th), z = R * (1 - Math.cos(th)) * 0.85;
    return { x: x, s: st.persp / (st.persp - z) };
  }
  function rect(i) {
    var st = C.state(), d = i - st.pos, R = bentR(st), half = (st.W / 2) / R;
    var a = project(st, d * st.STEP - half), b = project(st, d * st.STEP + half), m = project(st, d * st.STEP);
    var H = st.W * 10 / 16, r = stage.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var l = cx + a.x * a.s, rr = cx + b.x * b.s, h = H * m.s;
    return { left: l, top: cy - h / 2, width: rr - l, height: h };
  }
  window.WorkGL = { rect: rect };

  function resize() {
    var w = stage.clientWidth, h = stage.clientHeight;
    var pw = Math.round(w * DPR), ph = Math.round(h * DPR);
    if (pw !== cv.width || ph !== cv.height) { cv.width = pw; cv.height = ph; }
    Wpx = w; Hpx = h;
  }

  function draw() {
    if (!started || lost) return;
    resize();
    var st = C.state(), R = bentR(st), H = st.W * 10 / 16, cardAR = 16 / 10;
    gl.viewport(0, 0, cv.width, cv.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(U.uW, st.W); gl.uniform1f(U.uH, H); gl.uniform1f(U.uR, R);
    gl.uniform1f(U.uStep, st.STEP); gl.uniform1f(U.uPersp, st.persp); gl.uniform2f(U.uRes, Wpx, Hpx);
    // furthest from the front first, so the front card sits on top
    var order = P.map(function (_, k) { return k; }).sort(function (a, b) { return Math.abs(b - st.pos) - Math.abs(a - st.pos); });
    order.forEach(function (k) {
      var d = k - st.pos, ad = Math.abs(d);
      if (ad > 3.2) return;
      var alpha = Math.max(0, 1 - Math.max(0, ad - 1.6) * 0.6);
      if (alpha <= 0) return;
      // cover-fit the image into the 16:10 card
      var ia = aspect[k] || cardAR, cov = ia > cardAR ? [cardAR / ia, 1] : [1, ia / cardAR];
      gl.uniform2f(U.uCov, cov[0], cov[1]); gl.uniform2f(U.uCovOff, (1 - cov[0]) / 2, (1 - cov[1]) / 2);
      gl.uniform1f(U.uD, d); gl.uniform1f(U.uGs, Math.min(1, ad * 1.6)); gl.uniform1f(U.uAlpha, alpha);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[k]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, (SEG + 1) * 2);
    });
  }

  /* ---------- run only while the section is on screen ---------- */
  var visible = false, ticking = false, lost = false;
  function tick() { draw(); }
  function wake() {
    var on = visible && started && !lost && !document.hidden;
    if (on && !ticking) { ticking = true; if (window.gsap) gsap.ticker.add(tick); else (function f() { if (ticking) { draw(); requestAnimationFrame(f); } })(); }
    if (!on && ticking) { ticking = false; if (window.gsap) gsap.ticker.remove(tick); }
  }
  if ('IntersectionObserver' in window) {
    var once = false;
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !once) { once = true; loadAll(); }
      wake();
    }, { rootMargin: '600px 0px' }).observe(stage);
  } else { visible = true; loadAll(); }
  document.addEventListener('visibilitychange', wake);
  cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); lost = true; stage.classList.remove('gl'); wake(); });

  /* ---------- input: drag with inertia, horizontal swipes, keys, click ---------- */
  function scrollToIndex(idx, immediate) {
    var y = C.progressToY(idx / (P.length - 1));
    if (window.lenis) window.lenis.scrollTo(y, { immediate: !!immediate, force: true });
    else window.scrollTo(0, y);
  }
  var drag = null, moved = false;
  stage.addEventListener('pointerdown', function (e) {
    if (!stage.classList.contains('gl') || e.button !== 0) return;
    var st = C.state();
    drag = { x: e.clientX, y: e.clientY, idx: st.target, start: st.target, t: performance.now(), v: 0, id: e.pointerId, axis: e.pointerType === 'mouse' ? 'x' : null };
    moved = false;
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.axis) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; }
    if (drag.axis !== 'x') { drag = null; return; }              // a vertical swipe on a phone is just a scroll
    if (Math.abs(dx) > 6 && !moved) { moved = true; stage.classList.add('dragging'); try { stage.setPointerCapture(e.pointerId); } catch (_) {} }
    var st = C.state(), spacing = st.W * 1.06;
    var idx = Math.max(-0.35, Math.min(P.length - 0.65, drag.start - dx / spacing));
    var now = performance.now(), dt = Math.max(1, now - drag.t);
    drag.v = drag.v * 0.7 + ((idx - drag.idx) / dt) * 0.3;       // cards per millisecond, smoothed
    drag.idx = idx; drag.t = now;
    scrollToIndex(idx, true);
  });
  function release() {
    if (!drag) return;
    var d = drag; drag = null; stage.classList.remove('dragging');
    if (!moved) return;
    var to = Math.round(d.idx + d.v * 320);                        // flick: carry on in the same direction, then settle
    to = Math.max(0, Math.min(P.length - 1, to));
    scrollToIndex(to, false);
  }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);

  stage.addEventListener('wheel', function (e) {                   // two-finger sideways swipe on a trackpad
    if (!stage.classList.contains('gl') || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    var y = (window.lenis ? window.lenis.targetScroll : window.scrollY) + e.deltaX * 1.4;
    if (window.lenis) window.lenis.scrollTo(y, { force: true }); else window.scrollTo(0, y);
  }, { passive: false });

  stage.addEventListener('click', function (e) {
    if (!stage.classList.contains('gl')) return;
    e.stopImmediatePropagation();                                  // the DOM-card click handler doesn't apply in GL mode
    if (moved) { moved = false; return; }
    var st = C.state(), best = -1, bestD = 1e9;
    for (var k = 0; k < P.length; k++) {
      if (Math.abs(k - st.pos) > 2.5) continue;
      var r = rect(k);
      if (e.clientX >= r.left && e.clientX <= r.left + r.width && e.clientY >= r.top && e.clientY <= r.top + r.height) {
        var dd = Math.abs(k - st.pos); if (dd < bestD) { bestD = dd; best = k; }
      }
    }
    if (best < 0) return;
    if (best === Math.round(st.pos)) C.open(best, rect(best)); else C.goTo(best);
  }, true);

  // keyboard: the stage can take focus; arrows move, Enter opens
  stage.tabIndex = 0;
  stage.addEventListener('keydown', function (e) {
    var i = Math.round(C.state().pos);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); C.goTo(Math.max(0, Math.min(P.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)))); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); C.open(i, stage.classList.contains('gl') ? rect(i) : null); }
  });
})();
