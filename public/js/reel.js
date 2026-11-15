/* On set reel: a short clip exported as WebP frames (tools/make-sequence.sh) and drawn to a canvas as you scroll.
   Frames load progressively (every 8th first, then filling in), only once the section is close.
   Phones get a lighter set. Reduced motion or no JS: the poster still stays, with no pinning. */
(function () {
  var reel = document.getElementById('reel');
  var cv = document.getElementById('reelCanvas');
  if (!reel || !cv || !cv.getContext) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var phone = matchMedia('(pointer: coarse)').matches || window.innerWidth < 700;
  var SET = phone ? 'm' : 'd', FPS = phone ? 10 : 18;
  var DPR = Math.min(window.devicePixelRatio || 1, phone ? 1.25 : 1.5);
  var base = 'media/reel/' + SET + '/';
  var ctx = cv.getContext('2d', { alpha: false });
  var tc = document.getElementById('reelTc');
  var frames = [], n = 0, cur = -1, drawn = -1;

  function pad(v) { return (v < 10 ? '0' : '') + v; }
  function size() {
    var w = Math.round(cv.clientWidth * DPR), h = Math.round(cv.clientHeight * DPR);
    if (w && h && (w !== cv.width || h !== cv.height)) { cv.width = w; cv.height = h; drawn = -1; }
  }
  function nearestLoaded(i) {
    for (var d = 0; d < n; d++) {
      if (frames[i - d] && frames[i - d].ok) return i - d;
      if (frames[i + d] && frames[i + d].ok) return i + d;
    }
    return -1;
  }
  function draw() {
    if (!n) return;
    size();
    var k = nearestLoaded(cur);
    if (k < 0 || k === drawn) return;
    var im = frames[k].img, cw = cv.width, ch = cv.height;
    var s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);   // cover
    drawn = k;
    if (!reel.classList.contains('drawing')) reel.classList.add('drawing');
    var t = cur / FPS, ff = cur % FPS;
    if (tc) tc.textContent = '00:00:' + pad(Math.floor(t)) + ':' + pad(ff);
  }

  function progress() {
    var r = reel.getBoundingClientRect(), span = reel.offsetHeight - window.innerHeight;
    return span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
  }
  function update() {
    var k = progress();
    var f = Math.round(k * (n - 1));
    if (k > 0.02) reel.classList.add('moved');
    if (f !== cur) { cur = f; draw(); }
  }

  function load() {
    var order = [], seen = {};
    [8, 4, 2, 1].forEach(function (step) { for (var i = 0; i < n; i += step) if (!seen[i]) { seen[i] = 1; order.push(i); } });
    var inflight = 0, next = 0, MAX = 6;
    function pump() {
      while (inflight < MAX && next < order.length) {
        (function (i) {
          var im = new Image(); im.decoding = 'async';
          frames[i] = { img: im, ok: false };
          inflight++;
          im.onload = function () { frames[i].ok = true; inflight--; if (Math.abs(i - cur) < 8) { drawn = -1; draw(); } pump(); };
          im.onerror = function () { inflight--; pump(); };
          im.src = base + pad4(i + 1) + '.webp';
        })(order[next++]);
      }
    }
    pump();
  }
  function pad4(v) { return ('000' + v).slice(-4); }

  function start(count) {
    n = count;
    reel.classList.add('on');                                   // tall section + pinned frame
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
      ScrollTrigger.create({ trigger: reel, start: 'top top', end: 'bottom bottom', onUpdate: update, onRefresh: function () { drawn = -1; update(); } });
    } else window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', function () { drawn = -1; draw(); });
    cur = 0; load(); update();
  }

  // fetch the frame count only when the section is getting close
  var go = function () {
    fetch('media/reel/frames.json').then(function (r) { return r.json(); }).then(function (j) { if (j[SET] > 1) start(j[SET]); }).catch(function () {});
  };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: '1200px 0px' });
    io.observe(reel);
  } else go();
})();
