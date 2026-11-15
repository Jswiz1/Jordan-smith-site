/* Motion foundation: Lenis smooth scroll on GSAP's ticker, ScrollTrigger, SplitText line reveals,
   soft fades on body copy. One curve and three durations, shared with the CSS tokens in site.css.
   Everything here is progressive: if this file or GSAP fails to load, the page is fully visible and usable. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = function () { return root.clientWidth < 700; };

  var M = window.Motion = {
    ease: 'expo.out',                         // == cubic-bezier(.19,1,.22,1), --ease in CSS
    d: { quick: 0.45, base: 0.9, slow: 1.4 }, // == --d-quick / --d-base / --d-slow
    stagger: 0.08,
    ready: false
  };
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  if (window.Flip) gsap.registerPlugin(Flip);
  gsap.defaults({ ease: M.ease, duration: M.d.base });

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }, // expo out, same family as the curve
      smoothWheel: true,
      syncTouch: false,   // phones keep their own native touch scrolling
      autoRaf: false
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis;
    root.classList.add('has-lenis');

    // pause while the case study or the mobile menu is open (site.js marks both with body.locked)
    new MutationObserver(function () {
      if (document.body.classList.contains('locked')) lenis.stop(); else lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // in-page links glide instead of jumping (site.js closes the menu/overlay first, in its own click handler)
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var el = document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    window.smoothTo(el);
    if (history.pushState) history.pushState(null, '', id);
    el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true });
  });

  /* ---------- the work carousel always settles on a card ---------- */
  // CSS scroll-snap can't run alongside Lenis, so the same snapping is done here.
  var work = document.getElementById('work');
  if (lenis && work) {
    var idle = null;
    lenis.on('scroll', function () {
      clearTimeout(idle);
      idle = setTimeout(function () {
        var cards = document.querySelectorAll('#ring .card').length;
        if (cards < 2 || lenis.isStopped) return;
        var stg = document.getElementById('stage');
        if (stg && stg.classList.contains('dragging')) return; // the drag does its own settling
        var top = work.getBoundingClientRect().top + window.scrollY;
        var span = work.offsetHeight - window.innerHeight;
        var y = window.scrollY, k = (y - top) / span;
        if (k <= 0.002 || k >= 0.998) return;            // let people scroll in and out freely
        var target = top + span * Math.round(k * (cards - 1)) / (cards - 1);
        if (Math.abs(target - y) > 2) lenis.scrollTo(target, { duration: M.d.base, easing: function (t) { return 1 - Math.pow(1 - t, 3); } });
      }, 160);
    });
  }

  if (reduce) { M.ready = true; return; } // reduced motion: smooth scroll and reveals stay off

  /* ---------- masked line reveals on headings ---------- */
  // Static section headings only: the hero has its own entrance, and generated content (quiz, audit) animates itself.
  var heads = [].slice.call(document.querySelectorAll('section h2, .cow-line')).filter(function (el) {
    return el.offsetParent !== null && !el.closest('.hero, #auRes, #qz, [hidden]');
  });
  if (window.SplitText) heads.forEach(function (el) {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,                                  // re-splits on resize and font load
      aria: 'none',                                     // line wrappers only: screen readers still read the text in order
      onSplit: function (self) {
        [].forEach.call(el.querySelectorAll('.split-line'), function (l) { if (l.parentNode) l.parentNode.classList.add('split-mask'); });
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: M.d.slow,
          stagger: M.stagger + 0.02,
          scrollTrigger: { trigger: el, start: 'top 86%', once: true }
        });
      }
    });
  });

  /* ---------- soft fades on body copy and supporting blocks ---------- */
  var fadeSel = [
    'section .body-lg', 'section p.soft', '.svc li', '.offer', '.caps > div',
    '.ledger li', '.hobbies li', '#rows .row', '.onset-media', '.portrait', '.sys-tabs', '.au', '.fit'
  ].join(',');
  var fades = [].slice.call(document.querySelectorAll(fadeSel)).filter(function (el) {
    return el.offsetParent !== null && !el.closest('.hero, #auRes, #qz, .case, [hidden]');
  });
  var lift = small() ? 16 : 28;
  gsap.set(fades, { autoAlpha: 0, y: lift });
  ScrollTrigger.batch(fades, {
    start: 'top 90%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: M.d.base, stagger: M.stagger, overwrite: true, clearProps: 'transform' });
    }
  });
  /* ---------- slice reveals: section titles and the marquee open in vertical slices ---------- */
  // A clip-path polygon made of N columns joined along the bottom edge (the joins have no area),
  // each column rising from the bottom in turn. Cleared afterwards so nothing stays clipped.
  function slices(el, n, opts) {
    opts = opts || {};
    var tops = []; for (var i = 0; i < n; i++) tops.push(100);
    function paint() {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var x0 = (i / n * 100).toFixed(3), x1 = ((i + 1) / n * 100 + 0.2).toFixed(3), t = tops[i].toFixed(2);
        pts.push(x0 + '% 100%', x0 + '% ' + t + '%', x1 + '% ' + t + '%', x1 + '% 100%');
      }
      el.style.clipPath = 'polygon(' + pts.join(',') + ')';
    }
    paint();
    var state = tops.map(function (v) { return { v: v }; });
    gsap.to(state, {
      v: opts.from || -2, duration: M.d.slow, ease: M.ease,
      stagger: { each: opts.each || 0.05, from: opts.dir || 'start' },
      onUpdate: function () { for (var i = 0; i < n; i++) tops[i] = state[i].v; paint(); },
      onComplete: function () { el.style.clipPath = ''; },
      scrollTrigger: { trigger: el, start: opts.start || 'top 88%', once: true }
    });
  }
  [].forEach.call(document.querySelectorAll('section .eyebrow'), function (el) {
    if (el.offsetParent === null || el.closest('.hero, #auRes, #qz, .case, [hidden]')) return;
    slices(el, small() ? 6 : 10, { each: 0.04 });
  });
  var mq = document.querySelector('.marquee');
  if (mq) slices(mq, small() ? 8 : 16, { each: 0.03, dir: 'center', start: 'top 95%' });

  // images and fonts change the page height once loaded: re-measure trigger points then
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });

  M.ready = true;
})();
