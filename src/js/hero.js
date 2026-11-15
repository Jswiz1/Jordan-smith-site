/* Hero portrait: hand-written WebGL, no libraries.
   1. Depth parallax: the photo is shifted by a depth map as the mouse moves (or the phone tilts), so it reads as 3D.
   2. Fluid: a small GPU fluid simulation (splat, curl/vorticity, divergence, pressure, advection) driven by the cursor.
      Its dye is used as a mask that reveals the colour photo through the black-and-white one, then fades back.
   Fallbacks: reduced motion, no WebGL or no float render targets → the static black-and-white <img> stays.
   Pauses off-screen and in background tabs; pixel ratio capped; lighter simulation on phones. */
(function () {
  var hero = document.querySelector('.hero');
  var cv = document.getElementById('heroGL');
  var img = document.getElementById('heroImg');
  if (!hero || !cv || !img) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // The shader starts on the first sign of a person (mouse, touch, scroll or key), not on page load:
  // the static black-and-white photo is already on screen, so loading stays fast and the GPU work only
  // happens for someone who is actually there.
  var booted = false, wake = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'];
  function wakeUp() {
    if (booted) return; booted = true;
    wake.forEach(function (ev) { window.removeEventListener(ev, wakeUp, true); });
    boot();
  }
  wake.forEach(function (ev) { window.addEventListener(ev, wakeUp, { capture: true, passive: true }); });

  function boot() {

  var PHOTO = img.currentSrc || img.src;
  var DEPTH = PHOTO.replace(/(\.\w+)$/, '-depth$1');
  var FOCUS = [0.74, 0.5];                 // where the subject sits in the photo (x, y from top-left)

  var phone = matchMedia('(pointer: coarse)').matches || window.innerWidth < 700;
  var P = {
    sim: phone ? 64 : 128,          // velocity grid (shortest side)
    dye: phone ? 256 : 512,         // reveal mask resolution
    iters: phone ? 12 : 20,         // pressure solve iterations
    curl: phone ? 0 : 8,            // vorticity (swirl) strength; off on phones
    velDiss: 0.4, dyeDiss: 1.6,    // how quickly motion and colour fade
    radius: phone ? 0.006 : 0.0032,
    force: 5200,
    depth: phone ? 0.008 : 0.012,  // parallax strength (kept low so the face never warps)
    dpr: Math.min(window.devicePixelRatio || 1, phone ? 1.25 : 1.5)
  };

  /* ---------- context ---------- */
  var opts = { alpha: false, depth: false, stencil: false, antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' };
  var gl = cv.getContext('webgl2', opts), gl2 = !!gl;
  if (!gl) gl = cv.getContext('webgl', opts) || cv.getContext('experimental-webgl', opts);
  if (!gl) return;

  var HALF, linearOK;
  if (gl2) {
    gl.getExtension('EXT_color_buffer_float');
    linearOK = !!gl.getExtension('OES_texture_float_linear');
    HALF = gl.HALF_FLOAT;
  } else {
    var hf = gl.getExtension('OES_texture_half_float');
    if (!hf) return;
    linearOK = !!gl.getExtension('OES_texture_half_float_linear');
    HALF = hf.HALF_FLOAT_OES;
  }
  var FILTER = linearOK ? gl.LINEAR : gl.NEAREST;

  function renderable(internal, format) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, HALF, null);
    var f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.deleteFramebuffer(f); gl.deleteTexture(t);
    return ok;
  }
  var FMT;
  if (gl2) {
    var rgba = renderable(gl.RGBA16F, gl.RGBA);
    if (!rgba) return;
    FMT = {
      rgba: [gl.RGBA16F, gl.RGBA],
      rg: renderable(gl.RG16F, gl.RG) ? [gl.RG16F, gl.RG] : [gl.RGBA16F, gl.RGBA],
      r: renderable(gl.R16F, gl.RED) ? [gl.R16F, gl.RED] : [gl.RGBA16F, gl.RGBA]
    };
  } else {
    if (!renderable(gl.RGBA, gl.RGBA)) return;
    FMT = { rgba: [gl.RGBA, gl.RGBA], rg: [gl.RGBA, gl.RGBA], r: [gl.RGBA, gl.RGBA] };
  }

  /* ---------- shaders ---------- */
  var VS = [
    'precision highp float;',
    'attribute vec2 aPos; uniform vec2 uTexel;',
    'varying vec2 vUv, vL, vR, vT, vB;',
    'void main(){ vUv = aPos * .5 + .5;',
    ' vL = vUv - vec2(uTexel.x, 0.); vR = vUv + vec2(uTexel.x, 0.);',
    ' vT = vUv + vec2(0., uTexel.y); vB = vUv - vec2(0., uTexel.y);',
    ' gl_Position = vec4(aPos, 0., 1.); }'
  ].join('\n');
  var HEAD = 'precision highp float; precision highp sampler2D; varying vec2 vUv, vL, vR, vT, vB;\n';
  var FS = {
    clear: 'uniform sampler2D uT; uniform float uV; void main(){ gl_FragColor = uV * texture2D(uT, vUv); }',
    splat: 'uniform sampler2D uT; uniform float uAspect, uRadius; uniform vec3 uColor; uniform vec2 uPoint;' +
      'void main(){ vec2 p = vUv - uPoint; p.x *= uAspect; vec3 s = exp(-dot(p, p) / uRadius) * uColor;' +
      ' gl_FragColor = vec4(texture2D(uT, vUv).xyz + s, 1.); }',
    advect: 'uniform sampler2D uVel, uSrc; uniform vec2 uTexel; uniform float uDt, uDiss;' +
      'void main(){ vec2 c = vUv - uDt * texture2D(uVel, vUv).xy * uTexel;' +
      ' gl_FragColor = texture2D(uSrc, c) / (1. + uDiss * uDt); }',
    divergence: 'uniform sampler2D uVel;' +
      'void main(){ float L = texture2D(uVel, vL).x, R = texture2D(uVel, vR).x, T = texture2D(uVel, vT).y, B = texture2D(uVel, vB).y;' +
      ' vec2 C = texture2D(uVel, vUv).xy;' +
      ' if (vL.x < 0.) L = -C.x; if (vR.x > 1.) R = -C.x; if (vT.y > 1.) T = -C.y; if (vB.y < 0.) B = -C.y;' +
      ' gl_FragColor = vec4(.5 * (R - L + T - B), 0., 0., 1.); }',
    curl: 'uniform sampler2D uVel;' +
      'void main(){ float L = texture2D(uVel, vL).y, R = texture2D(uVel, vR).y, T = texture2D(uVel, vT).x, B = texture2D(uVel, vB).x;' +
      ' gl_FragColor = vec4(.5 * (R - L - T + B), 0., 0., 1.); }',
    vorticity: 'uniform sampler2D uVel, uCurl; uniform float uCurlAmt, uDt;' +
      'void main(){ float L = texture2D(uCurl, vL).x, R = texture2D(uCurl, vR).x, T = texture2D(uCurl, vT).x, B = texture2D(uCurl, vB).x, C = texture2D(uCurl, vUv).x;' +
      ' vec2 f = .5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); f /= length(f) + .0001; f *= uCurlAmt * C; f.y *= -1.;' +
      ' vec2 v = texture2D(uVel, vUv).xy + f * uDt; gl_FragColor = vec4(clamp(v, -1000., 1000.), 0., 1.); }',
    pressure: 'uniform sampler2D uP, uDiv;' +
      'void main(){ float L = texture2D(uP, vL).x, R = texture2D(uP, vR).x, T = texture2D(uP, vT).x, B = texture2D(uP, vB).x;' +
      ' gl_FragColor = vec4((L + R + B + T - texture2D(uDiv, vUv).x) * .25, 0., 0., 1.); }',
    gradient: 'uniform sampler2D uP, uVel;' +
      'void main(){ float L = texture2D(uP, vL).x, R = texture2D(uP, vR).x, T = texture2D(uP, vT).x, B = texture2D(uP, vB).x;' +
      ' vec2 v = texture2D(uVel, vUv).xy - vec2(R - L, T - B); gl_FragColor = vec4(v, 0., 1.); }',
    display: 'uniform sampler2D uPhoto, uDepth, uDye, uVel; uniform vec2 uScale, uFocus, uOffset; uniform float uDepthAmt, uReady;' +
      'void main(){' +
      ' vec2 uv = (vUv - .5) * uScale + uFocus;' +
      ' float d = texture2D(uDepth, uv).r;' +
      ' uv += uOffset * (d - .5) * uDepthAmt;' +                       // nearer pixels move further: depth parallax
      ' vec3 c = texture2D(uPhoto, uv).rgb;' +
      ' float l = dot(c, vec3(.299, .587, .114)); float g = clamp((l - .5) * 1.12 + .5, 0., 1.) * .8;' + // matches the fallback img grade
      ' float m = (1. - exp(-texture2D(uDye, vUv).r * 2.2)) * uReady;' +
      ' vec3 col = vec3(g) + (c - vec3(l)) * .7 * m;' +                  // add the photo's own colour on top of the grade: same brightness, natural tones
      ' gl_FragColor = vec4(col, 1.); }'
  };

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  var vsh;
  function program(fs) {
    vsh = vsh || compile(gl.VERTEX_SHADER, VS);
    var p = gl.createProgram();
    gl.attachShader(p, vsh); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, HEAD + fs));
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
    return { p: p, u: u };
  }
  var prog = {};
  try { for (var k in FS) prog[k] = program(FS[k]); } catch (e) { return; }

  // one full-screen triangle pair
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  /* ---------- render targets ---------- */
  function target(w, h, fmt) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, FILTER);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, FILTER);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt[0], w, h, 0, fmt[1], HALF, null);
    var f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    return { t: t, f: f, w: w, h: h, texel: [1 / w, 1 / h] };
  }
  function pair(w, h, fmt) {
    var a = target(w, h, fmt), b = target(w, h, fmt);
    return { get read() { return a; }, get write() { return b; }, swap: function () { var x = a; a = b; b = x; }, w: w, h: h, texel: a.texel };
  }
  function res(n) {
    var ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (ar < 1) ar = 1 / ar;
    var max = Math.round(n * ar), min = Math.round(n);
    return gl.drawingBufferWidth > gl.drawingBufferHeight ? [max, min] : [min, max];
  }

  var vel, dye, pres, div, curl;
  function buildTargets() {
    var s = res(P.sim), d = res(P.dye);
    vel = pair(s[0], s[1], FMT.rg);
    pres = pair(s[0], s[1], FMT.r);
    div = target(s[0], s[1], FMT.r);
    curl = target(s[0], s[1], FMT.r);
    dye = pair(d[0], d[1], FMT.r);
  }

  function draw(to, w, h) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, to ? to.f : null);
    gl.viewport(0, 0, w || to.w, h || to.h);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  var unit = 0;
  function use(pg, texel) { gl.useProgram(pg.p); unit = 0; if (texel && pg.u.uTexel) gl.uniform2f(pg.u.uTexel, texel[0], texel[1]); return pg; }
  function tex(pg, name, t) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(pg.u[name], unit); unit++; }

  /* ---------- photo + depth ---------- */
  var photo = null, depth = null, imgAspect = 2400 / 1350;
  function loadTex(src, cb) {
    var im = new Image();
    im.decoding = 'async';
    im.onload = function () {
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      cb(t, im);
    };
    im.onerror = function () { cb(null); };
    im.src = src;
  }
  function flatDepth() { // if the depth map is missing, use mid-grey: no parallax, nothing breaks
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128]));
    return t;
  }

  /* ---------- sizing ---------- */
  var W = 0, H = 0;
  function resize() {
    var w = Math.max(2, Math.round(hero.clientWidth * P.dpr)), h = Math.max(2, Math.round(hero.clientHeight * P.dpr));
    if (w === W && h === H) return;
    W = cv.width = w; H = cv.height = h;
    buildTargets();
  }

  /* ---------- input ---------- */
  var splats = [], last = null, offset = [0, 0], aim = [0, 0], lastInput = 0, tilted = false;
  function inHero(x, y) { var r = hero.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom ? r : null; }
  function pointer(x, y) {
    var r = inHero(x, y);
    if (!r) { last = null; return; }
    var u = (x - r.left) / r.width, v = 1 - (y - r.top) / r.height;
    if (!tilted) { aim[0] = (u - 0.5) * 2; aim[1] = (v - 0.5) * 2; }
    lastInput = performance.now();
    if (last) {
      var dx = u - last[0], dy = v - last[1];
      if (dx * dx + dy * dy > 1e-7) splats.push([u, v, dx * P.force, dy * P.force]);
    }
    last = [u, v];
  }
  window.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || e.pointerType === 'pen') pointer(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('touchmove', function (e) { var t = e.touches[0]; if (t) pointer(t.clientX, t.clientY); }, { passive: true });
  window.addEventListener('touchend', function () { last = null; }, { passive: true });
  hero.addEventListener('pointerleave', function () { last = null; });

  // phones: tilt drives the parallax (iOS asks permission, so ask on the first tap on the hero)
  function onTilt(e) {
    if (e.gamma == null) return;
    tilted = true; lastInput = performance.now();
    aim[0] = Math.max(-1, Math.min(1, e.gamma / 25));
    aim[1] = Math.max(-1, Math.min(1, (45 - e.beta) / 25));
  }
  if (phone && 'DeviceOrientationEvent' in window) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      hero.addEventListener('click', function ask() {
        hero.removeEventListener('click', ask);
        DeviceOrientationEvent.requestPermission().then(function (s) { if (s === 'granted') window.addEventListener('deviceorientation', onTilt, { passive: true }); }).catch(function () {});
      });
    } else window.addEventListener('deviceorientation', onTilt, { passive: true });
  }

  /* ---------- simulation step ---------- */
  function splat(x, y, dx, dy) {
    var aspect = W / H, pg;
    pg = use(prog.splat, vel.texel);
    tex(pg, 'uT', vel.read.t);
    gl.uniform1f(pg.u.uAspect, aspect); gl.uniform2f(pg.u.uPoint, x, y);
    gl.uniform3f(pg.u.uColor, dx, dy, 0); gl.uniform1f(pg.u.uRadius, P.radius * (aspect > 1 ? aspect : 1));
    draw(vel.write); vel.swap();
    pg = use(prog.splat, dye.texel);
    tex(pg, 'uT', dye.read.t);
    gl.uniform3f(pg.u.uColor, Math.min(1.2, 0.25 + Math.hypot(dx, dy) / P.force * 40), 0, 0);
    draw(dye.write); dye.swap();
  }

  function step(dt) {
    var pg;
    if (P.curl) {
      pg = use(prog.curl, vel.texel); tex(pg, 'uVel', vel.read.t); draw(curl);
      pg = use(prog.vorticity, vel.texel); tex(pg, 'uVel', vel.read.t); tex(pg, 'uCurl', curl.t);
      gl.uniform1f(pg.u.uCurlAmt, P.curl); gl.uniform1f(pg.u.uDt, dt); draw(vel.write); vel.swap();
    }
    pg = use(prog.divergence, vel.texel); tex(pg, 'uVel', vel.read.t); draw(div);
    pg = use(prog.clear, pres.texel); tex(pg, 'uT', pres.read.t); gl.uniform1f(pg.u.uV, 0.8); draw(pres.write); pres.swap();
    pg = use(prog.pressure, pres.texel);
    for (var i = 0; i < P.iters; i++) { unit = 0; tex(pg, 'uP', pres.read.t); tex(pg, 'uDiv', div.t); draw(pres.write); pres.swap(); }
    pg = use(prog.gradient, vel.texel); tex(pg, 'uP', pres.read.t); tex(pg, 'uVel', vel.read.t); draw(vel.write); vel.swap();
    pg = use(prog.advect, vel.texel); tex(pg, 'uVel', vel.read.t); tex(pg, 'uSrc', vel.read.t);
    gl.uniform2f(pg.u.uTexel, vel.texel[0], vel.texel[1]); gl.uniform1f(pg.u.uDt, dt); gl.uniform1f(pg.u.uDiss, P.velDiss);
    draw(vel.write); vel.swap();
    pg = use(prog.advect, dye.texel); tex(pg, 'uVel', vel.read.t); tex(pg, 'uSrc', dye.read.t);
    gl.uniform2f(pg.u.uTexel, vel.texel[0], vel.texel[1]); gl.uniform1f(pg.u.uDt, dt); gl.uniform1f(pg.u.uDiss, P.dyeDiss);
    draw(dye.write); dye.swap();
  }

  function render(ready) {
    var ca = W / H, s = ca > imgAspect ? [1, imgAspect / ca] : [ca / imgAspect, 1];
    s[0] *= 0.94; s[1] *= 0.94;                              // a little headroom so parallax never shows an edge
    var fx = Math.min(1 - s[0] / 2, Math.max(s[0] / 2, FOCUS[0]));
    var fy = Math.min(1 - s[1] / 2, Math.max(s[1] / 2, 1 - FOCUS[1]));
    var pg = use(prog.display, null);
    tex(pg, 'uPhoto', photo); tex(pg, 'uDepth', depth); tex(pg, 'uDye', dye.read.t); tex(pg, 'uVel', vel.read.t);
    gl.uniform2f(pg.u.uScale, s[0], s[1]); gl.uniform2f(pg.u.uFocus, fx, fy);
    gl.uniform2f(pg.u.uOffset, offset[0], offset[1]); gl.uniform1f(pg.u.uDepthAmt, P.depth);
    gl.uniform1f(pg.u.uReady, ready);
    draw(null, W, H);
  }

  /* ---------- loop: only while the hero is on screen and the tab is visible ---------- */
  var visible = true, running = false, prev = 0, shown = false, born = 0;
  function frame(now) {
    if (!visible || document.hidden || lost) { running = false; return; }
    var dt = Math.min((now - prev) / 1000, 1 / 30); prev = now;
    resize();
    // idle: a slow drift keeps the depth alive when nobody is moving the mouse
    var t = now / 1000;
    if (now - lastInput > 2500) { aim[0] = Math.sin(t * 0.35) * 0.35; aim[1] = Math.cos(t * 0.27) * 0.2; }
    offset[0] += (aim[0] - offset[0]) * 0.06; offset[1] += (aim[1] - offset[1]) * 0.06;
    for (var i = 0; i < splats.length && i < 6; i++) splat.apply(null, splats[i]);
    splats.length = 0;
    step(dt);
    render(Math.min(1, (now - born) / 600));
    if (!shown) { shown = true; cv.classList.add('on'); }
    requestAnimationFrame(frame);
  }
  function start() { if (!running && visible && photo && !document.hidden && !lost) { running = true; prev = performance.now(); requestAnimationFrame(frame); } }

  var lost = false;
  cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); lost = true; cv.classList.remove('on'); }, false);

  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; start(); }).observe(hero);
  document.addEventListener('visibilitychange', start);

  resize();
  loadTex(PHOTO, function (t, im) {
    if (!t) return;                                       // photo failed: keep the static fallback
    photo = t; imgAspect = im.naturalWidth / im.naturalHeight;
    loadTex(DEPTH, function (d) {
      depth = d || flatDepth();
      born = performance.now();
      window.HeroGL = { splat: function (u, v, dx, dy) { splats.push([u, v, dx, dy]); }, params: P }; // for testing
      start();
    });
  });
  }
})();
