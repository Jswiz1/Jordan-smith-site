(function(){
  /* one way to scroll the page: through Lenis when it's running, natively otherwise */
  window.smoothTo = function(target, o){
    o = o || {};
    var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + (o.offset || 0);
    if (window.lenis && !rm) window.lenis.scrollTo(y, { immediate: !!o.immediate, force: true, duration: o.duration || 1.2 });
    else window.scrollTo({ top: y, behavior: (rm || o.immediate) ? 'auto' : 'smooth' });
  };
  var P = [
    { id:'seven', title:'Seven Studios', client:'Co-founder', meta:'Studio + operating system',
      line:'A production studio, built from the ground up.', type:'Production studio',
      role:'Co-founder', where:'Doncaster',
      brief:'Commercial video, podcasts and social content, from UGC-style ads to multi-camera brand films. Running it meant fixing the admin as well as the output.',
      img:'seven-studios.jpg', caption:'The studio, Doncaster',
      site:'https://sevenstudios.co.uk', siteLabel:'sevenstudios.co.uk', crm:'tabSeven',
      videos:[
        {k:'British Gas · FTSE 100', t:'Dyno-Rod', d:'A retainer client, from summer campaigns to full content assets used nationally.', s:'Retainer · national campaigns'},
        {k:'Doncaster Racecourse', t:'The St Leger', d:'Four films across three filming days around the historic race.', s:'389,569 views'},
        {k:'OXEN Sports', t:'Engineered to Inspire', d:'Hosting the podcast for a global sports brand, sitting down with its founders and athletes, including Kevin Sinfield.', s:'Host \u00b7 podcast \u00b7 watch on YouTube \u2197', img:'oxen.jpg', wide:true, url:'https://www.youtube.com/watch?v=pHBksblVFz4'},
        {k:'Pristine Clean', t:'Commercial content', d:'Social and brand content for a commercial cleaning company.', s:'Ongoing'}
      ],
      did:['Co-founded the studio and built it from the ground up with my business partner.','Led the brand, design and marketing.','Designed and built the website, with online booking and payments.','Set up the booking and marketing systems, so a paid booking lands straight on the production board.','Built the studio’s own CRM: leads, podcasts, video, retainers and KPIs in one place, with Claude working inside it.','Video production, from podcasts to full brand films.'],
      result:'Swapped a £200+ a month off-the-shelf system for a CRM built around how we work.' },
    { id:'scene', title:'Scene', client:'Co-founder', meta:'Coffee · third venue soon',
      line:'Be seen. Feel seen. Drink Scene.', type:'Hospitality brand',
      role:'Co-founder · name, identity, marketing', where:'Doncaster city centre · Auckley',
      brief:"An independent coffee brand with a personality, run with an operator's view of margins, staffing and opening new sites.",
      img:'scene.jpg', imgTitle:true, caption:'Drink Scene: the brand in one frame',
      site:'https://drinkscene.co.uk', siteLabel:'drinkscene.co.uk', crm:'tabScene',
      did:['Named it, built the identity and branded the spaces.','Personality-led and barista-led social content.','Launch strategy for each new location.'],
      result:'Two venues open. A third coming soon.' },
    { id:'don', title:'The Don', client:'Co-founder', meta:'Media · 50k followers',
      line:"Doncaster's own media brand, built from zero.", type:'Media platform',
      role:'Co-founder · brand, formats, commercial', where:'Doncaster',
      brief:"Local news is mostly bad news. The Don set out to tell Doncaster's good stories, about its people and its businesses, and make that worth following.",
      did:['Built the brand, the tone of voice and a presenter-led identity.','Developed repeatable, social-first content formats.','Turned attention into revenue through sponsorships, business features and sponsored content.','Took The Don pitch-side at a Queensberry fight night in Doncaster, broadcast on DAZN.'],
      img:'the-don.jpg', caption:'Pitch-side at a Queensberry × DAZN fight night, Doncaster',
      site:'https://wearethedon.co.uk', siteLabel:'wearethedon.co.uk', crm:'tabDon',
      result:'50,000 followers since launching in late 2025.' },
    { id:'doncard', title:'Don Card', client:'Co-founder', meta:'Product · 90+ venues',
      line:'An audience, turned into a product.', type:'Digital membership',
      role:'Co-founder · concept, brand, product, launch', where:'doncard.co.uk',
      brief:'The Don had an audience that cared about local businesses. Don Card gives members a reason to visit, and venues a reason to join.',
      did:['Designed the membership: pricing, subscriptions and payments on Shopify.','Digital wallet cards with QR verification at the till.','Merchant onboarding and a business directory.'],
      img:'don-card.jpg', caption:'The membership lives in Apple and Google Wallet',
      site:'https://doncard.co.uk', siteLabel:'doncard.co.uk', crm:'tabDon',
      result:'90+ venues and 300+ members signed up.' },
    { id:'jonny', title:'Jonny from Donny', client:'Marketing lead', meta:'Films · £4m in a year',
      line:'Advertising that plays like entertainment.', type:'Films and trailers',
      role:'Marketing lead', where:'Switzerland · Lake Como · Italy · Liverpool',
      brief:'Donny Competitions gives away supercars and cash. Competition ads tend to look the same, with product, price and a countdown. Here the prizes star in their own travel series instead, published on the Jonny From Donny channel.',
      did:['A cinematic, British-gangster-style trailer with a full cast, a country-house library set, luxury cars and watches. Over 2 million views.','Films shot on location across Switzerland, Italy and Liverpool.','In Italy, the prize line-up, including a Ferrari SF90 Stradale and a Porsche 911 GT3 RS, takes on Lake Como, Milan and the Stelvio Pass.','In Liverpool, four Porsche 911 GT3 RS Weissach cars, each the top prize in a live draw.','At home, a comedy sketch starring John Fury.'],
      img:'terry-2.jpg',
      films:[
        {place:'Trailer · 2M+ views', title:'Terry Two Fu*ks', url:'https://www.youtube.com/watch?v=TOolYaw_t9w', img:'terry-1.jpg'},
        {place:'Italy', title:'The Ultimate Italian Supercar Road Trip', url:'https://www.youtube.com/watch?v=d15wGBmmW4w', img:'jonny-italy.jpg'},
        {place:'Liverpool', title:'4 × Porsche GT3s in Liverpool', url:'https://www.youtube.com/watch?v=tKrSmCmZePA', img:'jonny-liverpool.jpg'},
        {place:'Comedy sketch', title:"It's Raffle Time, starring John Fury", url:'https://www.youtube.com/watch?v=a7M1d8jBJIA', img:'jonny-fury.jpg'}
      ],
      result:'The face of a brand that turned over £4m in a year.' },
    { id:'work', title:'My work', client:'Selected projects', meta:'Selected work · twelve projects',
      line:'Brands I\u2019ve designed, filmed, produced and built for.', type:'Selected projects',
      img:'my-work.jpg', collection:[
        {k:'Iconic Hospitality', t:'Brand identity', d:'Full brand identity and strategy for a hospitality tickets business, from the heart monogram up.', s:'Brand · identity · strategy', img:'iconic.png', logo:true},
        {k:'Strategy', t:'The Don', d:'Built a local media channel to a 50,000 audience in one year, then turned that attention into sponsors and a product.', s:'50k audience · one year', img:'the-don.jpg', wide:true},
        {k:'British Gas · FTSE 100', t:'Dyno-Rod', d:'A retainer client, from summer campaigns to full content assets used nationally.', s:'Retainer · national campaigns', img:'dynorod.jpg'},
        {k:'Doncaster Racecourse', t:'The St Leger', d:'Four films across three filming days around the historic race.', s:'389,569 views · 1,009 shares'},
        {k:'OXEN Sports', t:'Engineered to Inspire', d:'Hosting the podcast for a global sports brand, sitting down with its founders and athletes, including Kevin Sinfield.', s:'Host \u00b7 podcast \u00b7 watch on YouTube \u2197', img:'oxen.jpg', wide:true, url:'https://www.youtube.com/watch?v=pHBksblVFz4'},
        {k:'Scene', t:'Staff into brands', d:'Turned our barista into @lattelad: a full personal brand, live streams reaching thousands a week, new markets for Scene, and a local celebrity behind the counter.', s:'@lattelad \u00b7 live daily 12\u20132', img:'lattelad.jpg'},
        {k:'Influencer strategy', t:'@danbennetz', d:'Strategy, filming and YouTube for the \u201810s only\u2019 season, from Miami to Houston, reaching millions of views. Now launching his own product, Sorted Pouches.', s:'Strategy \u00b7 filming \u00b7 product launch', img:'danbennetz.jpg'},
        {k:'Automotive & marine', t:'Supercars & superyachts', d:'Porsche GT3 RS content, and superyacht filming in Cannes and Poole.', s:'Cannes · Poole', img:'portrait.jpg'},
        {k:'Pristine Clean', t:'Commercial content', d:'Social and brand content for a commercial cleaning company.', s:'Ongoing'},
        {k:'Paul Gascoigne', t:'Clothing brand content', d:'Content for Paul Gascoigne\u2019s clothing brand, including Gazza on stage in front of a packed crowd of England fans.', s:'Brand \u00b7 event \u00b7 social', img:'gazza.jpg'},
        {k:'Websites', t:'Don Card', d:'A membership site on Shopify. Browse 100+ local deals, join for \u00a329 a year, and the card lands straight in Apple or Google Wallet.', s:'doncard.co.uk \u2197', img:'web-doncard.jpg', wide:true, shot:true, url:'https://doncard.co.uk', noplay:true},
        {k:'Custom CRMs', t:'Built around the team', d:'Bespoke CRMs for Seven Studios, The Don and Scene, with Claude working inside them. One replaced a \u00a3200+ a month system.', s:'See the real builds \u2192', img:'crm/seven-home-dark.jpg', crm:'tabSeven', wide:true, shot:true}
      ] }
  ];
  var pad = function(n){ return (n<10?'0':'')+n; };
  var esc = function(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); };
  var body = document.body, root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var VH = function(){ return window.innerHeight; };

  /* ---------- preloader ---------- */
  var loader = document.getElementById('loader'), lc = document.getElementById('loadCount');
  function reveal(){ body.classList.add('ready'); }
  if (reduce) { loader.classList.add('gone'); reveal(); }
  else {
    var t0 = performance.now(), DUR = 1500;
    (function step(now){
      var k = Math.min(1, (now - t0)/DUR), e = 1 - Math.pow(1-k, 3);
      lc.textContent = String(Math.round(e*100)).padStart(3,'0');
      if (k < 1) requestAnimationFrame(step);
      else { setTimeout(function(){ loader.classList.add('open'); reveal(); setTimeout(function(){ loader.classList.add('gone'); }, 1200); }, 180); }
    })(t0);
  }

  /* ---------- grain ---------- */
  (function(){
    var c = document.createElement('canvas'); c.width = c.height = 160;
    var x = c.getContext('2d'), d = x.createImageData(160,160);
    for (var i=0;i<d.data.length;i+=4){ var v = Math.random()*255|0; d.data[i]=d.data[i+1]=d.data[i+2]=v; d.data[i+3]=255; }
    x.putImageData(d,0,0);
    document.getElementById('grain').style.backgroundImage = 'url('+c.toDataURL()+')';
  })();

  /* ---------- smoke shader ---------- */
  var mouse = {x:.5, y:.5, tx:.5, ty:.5};
  (function(){
    var cv = document.getElementById('smoke');
    var gl = cv.getContext('webgl', {antialias:false, premultipliedAlpha:false});
    if (!gl) return;
    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<6;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}',
      'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.)*1.6;',
      'vec2 mm=m*vec2(r.x/r.y,1.)*1.6;float d=length(p-mm);',
      'vec2 q=vec2(fbm(p+vec2(0.,t*.04)),fbm(p+vec2(5.2,1.3)-t*.03));',
      'vec2 w=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*.05),fbm(p+3.*q+vec2(8.3,2.8)-t*.04));',
      'w+=.25*normalize(p-mm+1e-4)*exp(-d*2.2);',
      'float v=fbm(p+3.5*w);',
      'v=smoothstep(.25,1.05,v);v=pow(v,1.7)*.55;',
      'v+=.12*exp(-d*3.)*v*4.;',
      'float vig=smoothstep(1.25,.25,length(uv-vec2(.5,.55))*1.25);',
      'v*=vig;v*=mix(.55,1.,smoothstep(0.,.6,uv.y));',
      'gl_FragColor=vec4(vec3(v)+.035,1.);}'
    ].join('');
    function sh(type, src){ var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr,'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    var uR = gl.getUniformLocation(pr,'r'), uT = gl.getUniformLocation(pr,'t'), uM = gl.getUniformLocation(pr,'m');
    var scale = 0.5;
    function size(){ var w = cv.clientWidth, h = cv.clientHeight; cv.width = Math.max(1, w*scale|0); cv.height = Math.max(1, h*scale|0); gl.viewport(0,0,cv.width,cv.height); }
    size(); window.addEventListener('resize', size);
    var visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible) loop(); }).observe(cv);
    var start = performance.now(), running = false;
    function frame(now){
      mouse.x += (mouse.tx - mouse.x)*.05; mouse.y += (mouse.ty - mouse.y)*.05;
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, reduce ? 12 : (now - start)/1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (visible && !reduce) requestAnimationFrame(frame); else running = false;
    }
    function loop(){ if (!running){ running = true; requestAnimationFrame(frame); } }
    loop();
    var hero = cv.parentNode;
    hero.addEventListener('pointermove', function(e){ var r = cv.getBoundingClientRect(); mouse.tx = (e.clientX - r.left)/r.width; mouse.ty = 1 - (e.clientY - r.top)/r.height; });
  })();

  /* ---------- hero film stills ---------- */
  (function(){
    var f = [].slice.call(document.querySelectorAll('.hero-film img')), i = 0;
    if (reduce || f.length < 2) return;
    setInterval(function(){ f[i].classList.remove('on'); i = (i + 1) % f.length; f[i].classList.add('on'); }, 5200);
  })();

  /* ---------- purple cow: one turns as it comes into view ---------- */
  (function(){
    var sec = document.getElementById('cowsec'); if (!sec) return;
    if (reduce || !('IntersectionObserver' in window)) { sec.classList.add('moo'); return; }
    var io = new IntersectionObserver(function(es){ if (es[0].isIntersecting) { setTimeout(function(){ sec.classList.add('moo'); }, 500); io.disconnect(); } }, {threshold:.55});
    io.observe(sec.querySelector('.herd'));
  })();

  /* ---------- marquee ---------- */
  var track = document.getElementById('track');
  var mq = P.map(function(p){ return esc(p.title); }).concat(['Oxen Sports','St Leger']);
  var unit = mq.map(function(t){ return '<span>'+t+'<i class="sep" aria-hidden="true"></i></span>'; }).join('');
  track.innerHTML = unit + unit + unit;
  var mqX = 0, vel = 0, lastY = window.scrollY, dir = 1;

  /* ---------- stats count-up (final values shown at rest) ---------- */
  var stats = [].slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(en){
      if (!en.isIntersecting) return; io.unobserve(en.target);
      var el = en.target, to = +el.dataset.count, pre = el.dataset.pre||'', suf = el.dataset.suf||'', s = performance.now();
      (function st(now){ var k = Math.min(1,(now-s)/1400), e = 1-Math.pow(1-k,4); el.textContent = pre + Math.round(e*to) + suf; if (k<1) requestAnimationFrame(st); })(s);
    }); }, {threshold:.6});
    stats.forEach(function(s){ io.observe(s); });
  }

  /* ---------- systems: CRM tabs + a job moving through the pipeline ---------- */
  (function(){
    var tabs = [].slice.call(document.querySelectorAll('.sys-tabs [role="tab"]'));
    var panels = tabs.map(function(t){ return document.getElementById(t.getAttribute('aria-controls')); });
    var pS = document.getElementById('crmSeven'), pSc = document.getElementById('crmScene');
    function sel(i){
      tabs.forEach(function(t, j){ t.setAttribute('aria-selected', i === j); panels[j].hidden = i !== j; });
      var w = panels[i].querySelector('.win'); w.style.animation = 'none'; void w.offsetWidth; w.style.animation = '';
      document.getElementById('sysNote').textContent = tabs[i].dataset.note || 'Illustration · example data';
    }
    tabs.forEach(function(t, i){
      t.addEventListener('click', function(){ sel(i); });
      t.addEventListener('keydown', function(e){
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var n = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; sel(n); tabs[n].focus();
      });
    });

    // Scene Opening Board: a working day playing out
    (function(){
      var todo = document.getElementById('obTodo'), toastEl = document.getElementById('scToast'), tt;
      var jobs = [['Count stock','The Village'],['Order oat milk','High Street'],['Post Thursday reel','Socials'],['Update autumn menu','Menu'],['Book signage fitter','New site']];
      var who = ['Amy','Leo','Kara'];
      var takings = {A:0, C:0}, week = 3412.60, step = 0, ji = 0;
      var fols = [].slice.call(document.querySelectorAll('[data-f]'));
      function gbp(n){ return '£' + n.toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits:2}); }
      function toast(m){ toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(function(){ toastEl.classList.remove('show'); }, 1900); }
      function bump(el){ el.classList.add('bump'); setTimeout(function(){ el.classList.remove('bump'); }, 700); }
      function reset(){
        todo.innerHTML = '<li class="empty">Nothing on your list.</li>';
        takings = {A:0, C:0}; week = 3412.60; ji = 0;
        document.getElementById('obAuck').textContent = '–'; document.getElementById('obCity').textContent = '–';
        document.getElementById('obTotal').textContent = '£0'; document.getElementById('obWeek').textContent = gbp(week);
        ['obStockA','obStockC'].forEach(function(id){ var e = document.getElementById(id); e.textContent = 'Stock not counted yet'; e.classList.remove('fresh'); });
      }
      function tick(){
        if (pSc.hidden) return;
        step++;
        var r = Math.random();
        if (r < .3 && ji < jobs.length) {
          var e = todo.querySelector('.empty'); if (e) e.remove();
          var li = document.createElement('li'); li.innerHTML = '<i></i><span></span><small></small>';
          li.querySelector('span').textContent = jobs[ji][0]; li.querySelector('small').textContent = jobs[ji][1];
          todo.appendChild(li); if (todo.children.length > 3) todo.removeChild(todo.firstElementChild); ji++;
        } else if (r < .5) {
          var open = todo.querySelector('li:not(.ok):not(.empty)');
          if (open) { open.classList.add('ok'); var w = who[Math.floor(Math.random()*3)]; toast(w + ' ticked off: ' + open.querySelector('span').textContent);
            if (/Count stock/.test(open.textContent)) { var s = document.getElementById('obStockC'); s.textContent = 'Stock counted today, by ' + w; s.classList.add('fresh'); } }
        } else if (r < .8) {
          var k = Math.random() < .5 ? 'A' : 'C', add = 18 + Math.round(Math.random()*42) + Math.random();
          takings[k] += add; week += add;
          var el = document.getElementById(k === 'A' ? 'obAuck' : 'obCity'); el.textContent = gbp(takings[k]); bump(el);
          document.getElementById('obTotal').textContent = gbp(takings.A + takings.C);
          document.getElementById('obWeek').textContent = gbp(week);
        } else {
          var f = fols[Math.floor(Math.random()*fols.length)], n = +f.dataset.f + 1 + Math.floor(Math.random()*3);
          f.dataset.f = n; f.textContent = n.toLocaleString('en-GB'); bump(f);
          document.getElementById('obFol').textContent = fols.reduce(function(a, x){ return a + +x.dataset.f; }, 0).toLocaleString('en-GB');
        }
        if (step > 40) { step = 0; reset(); }
      }
      if (!reduce) setInterval(tick, 1300);
    })();
    // CRM players: the real builds, cycling through their screens
    var CRMS = {
      don: { title:'The Don CRM', phone:'crm/don-mobile-dark.jpg', shots:[
        ['don-home-dark','Home','Today at a glance: streaks, the next event, the next paid job and emails to sort.'],
        ['don-inbox-dark','Inbox','Claude reads each email, says what to do and drafts the reply.'],
        ['don-leads-dark','Leads','Every lead from first message to won, with chase dates that go red when late.'],
        ['don-sponsors-dark','Sponsors','Sponsors from pitch to live, with warnings before a deal runs out.'],
        ['don-card-home-dark','Don Card','The card business: retailers, members and cards sold, synced from Shopify.'],
        ['don-braindump-dark','Brain dump','Say what happened. Claude updates the CRM within the hour.'],
        ['don-todo-dark','To-do','Everyone’s to-dos, plus tasks Claude suggests.']],
        feats:[['Brain dump','talk or type, and Claude files it'],['Email triage','summaries, next steps and drafted replies'],['Two businesses, one system','The Don and Don Card, access set per person'],['Sponsor renewals','flagged before they run out'],['Shopify sync','members and retailers update themselves'],['Claude writes','lead proposals and filming scripts'],['Live for everyone','every change shows instantly, with full history'],['Team streaks','a daily habit, not another chore']] },
      seven: { title:'Seven Studios Board', phone:'crm/seven-mobile-dark.jpg', shots:[
        ['seven-home-dark','Home','The day ahead: calendar, the next shoot countdown, and what Claude suggests.'],
        ['seven-dashboard-dark','KPIs','Weekly wins and KPIs that track themselves.'],
        ['seven-leads-dark','Leads','The pipeline with values per stage, chase flags and quotes started in Xero.'],
        ['seven-podcasts-dark','Podcasts','Bookings synced from Acuity, through recording, edit and delivery.'],
        ['seven-retainers-dark','Retainers','Each retainer client’s monthly deliverables, delivered against promised.'],
        ['seven-retainer-profile-dark','Client profile','Brand colours, fonts, files and contacts for every client.'],
        ['seven-ideas-dark','Ideas','The team pitches ideas and rates them 1 to 10.'],
        ['seven-quiz-dark','Quiz','A daily quiz with a monthly champion. Small things keep a team using it.']],
        feats:[['Brain dump','talk or type, and Claude files it'],['Claude drafts','proposals and follow-ups, straight into Outlook'],['Production boards','podcast, video and retainers, each with checklists'],['Xero built in','paid and due status, quotes started in one click'],['Acuity sync','bookings land on the board automatically'],['Self-tracking KPIs','leads, sessions, videos and money in'],['Team culture','streaks, a daily quiz and an ideas wall'],['Live for everyone','every change shows instantly, with full history']] }
    };
    [].slice.call(document.querySelectorAll('.pl[data-crm]')).forEach(function(pl){
      var c = CRMS[pl.dataset.crm], panel = pl.closest('[role="tabpanel"]');
      pl.innerHTML =
        '<div class="pl-stage"><div class="win pl-win"><div class="win-bar"><i></i><i></i><i></i><span class="ob-title">'+c.title+'</span></div>' +
        '<div class="pl-screen">' + c.shots.map(function(s, i){ return '<img src="crm/'+s[0]+'.jpg" alt="'+c.title+': '+s[1]+' screen" '+(i ? 'loading="lazy" ' : '')+(i ? '' : 'class="on"')+'>'; }).join('') + '</div></div>' +
        '<figure class="pl-phone"><img src="'+c.phone+'" alt="'+c.title+' on a phone" loading="lazy"></figure></div>' +
        '<div class="pl-chips" role="group" aria-label="Screens">' + c.shots.map(function(s, i){ return '<button type="button" aria-pressed="'+(i===0)+'">'+s[1]+'<i></i></button>'; }).join('') + '</div>' +
        '<p class="pl-cap" aria-live="polite"></p>' +
        '<ul class="pl-feats">' + c.feats.map(function(f, i){ return '<li><span>'+pad(i+1)+'</span><div><b>'+f[0]+'</b><small>'+f[1].charAt(0).toUpperCase()+f[1].slice(1)+'.</small></div></li>'; }).join('') + '</ul>';
      var imgs = [].slice.call(pl.querySelectorAll('.pl-screen img')), chips = [].slice.call(pl.querySelectorAll('.pl-chips button')), cap = pl.querySelector('.pl-cap');
      var cur = 0, timer = null, inView = false, hover = false, DUR = 4200;
      function show(i){
        cur = (i + imgs.length) % imgs.length;
        imgs.forEach(function(im, j){ if (j === cur) im.loading = 'eager'; im.classList.toggle('on', j === cur); });
        chips.forEach(function(b, j){ b.setAttribute('aria-pressed', j === cur); var bar = b.querySelector('i'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; });
        cap.innerHTML = '<b>' + c.shots[cur][1] + '.</b> ' + c.shots[cur][2];
        var nxt = imgs[(cur + 1) % imgs.length]; if (nxt) nxt.loading = 'eager';
      }
      function run(){ clearInterval(timer); timer = null; if (!reduce && inView && !hover && !panel.hidden) timer = setInterval(function(){ show(cur + 1); }, DUR); pl.classList.toggle('paused', !timer); }
      chips.forEach(function(b, j){ b.addEventListener('click', function(){ show(j); run(); }); });
      var stage = pl.querySelector('.pl-stage');
      stage.addEventListener('mouseenter', function(){ hover = true; run(); });
      stage.addEventListener('mouseleave', function(){ hover = false; run(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ inView = es[0].isIntersecting; run(); }, {threshold:.35}).observe(pl);
      else inView = true;
      tabs.forEach(function(t){ t.addEventListener('click', function(){ setTimeout(run, 0); }); });
      pl.style.setProperty('--dur', DUR + 'ms');
      show(0); run();
    });
  })();

  /* ---------- hobbies: one black sweep down the list the first time it's seen ---------- */
  var hob = document.getElementById('hobList');
  if (hob && 'IntersectionObserver' in window && !reduce) {
    var hio = new IntersectionObserver(function(es){
      if (!es[0].isIntersecting) return; hio.disconnect();
      [].slice.call(hob.children).forEach(function(li, i){
        setTimeout(function(){ li.classList.add('play'); setTimeout(function(){ li.classList.remove('play'); }, 1500); }, 300 + i*260);
      });
    }, {threshold:.6});
    hio.observe(hob);
  }

  /* ---------- word-lit statements ---------- */
  function splitWords(src, dest){
    [].slice.call(src.childNodes).forEach(function(n){
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function(t){
          if (!t) return;
          if (/^\s+$/.test(t)) dest.appendChild(document.createTextNode(t));
          else { var s = document.createElement('span'); s.className = 'w'; s.setAttribute('aria-hidden','true'); s.textContent = t; dest.appendChild(s); }
        });
      } else if (n.nodeType === 1) { var c = n.cloneNode(false); splitWords(n, c); dest.appendChild(c); }
    });
  }
  var lits = [].slice.call(document.querySelectorAll('.lit')).map(function(el){
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g,' ').trim());
    var frag = document.createDocumentFragment(); splitWords(el, frag);
    el.innerHTML = ''; el.appendChild(frag);
    return {el:el, ws:[].slice.call(el.querySelectorAll('.w'))};
  });
  function updateLits(){
    var vh = VH();
    lits.forEach(function(l){
      var r = l.el.getBoundingClientRect();
      var k = reduce ? 1 : Math.max(0, Math.min(1, (vh*0.85 - r.top) / (vh*0.5)));
      var n = Math.round(k * l.ws.length);
      l.ws.forEach(function(w,i){ w.classList.toggle('on', i < n); });
    });
  }

  /* ---------- rows ---------- */
  document.getElementById('rows').innerHTML = P.map(function(p,i){
    return '<button type="button" class="row" data-case="'+p.id+'" data-cursor="Open"><span class="mono">'+pad(i+1)+'</span><span class="serif">'+esc(p.title)+'</span><span class="mono">'+esc(p.meta)+'</span></button>';
  }).join('');

  /* ---------- pinned curved carousel ---------- */
  var work = document.getElementById('work'), ring = document.getElementById('ring'), stage = document.getElementById('stage');
  ring.innerHTML = P.map(function(p,i){
    return '<div class="card'+(p.img?' has-img':'')+'" data-i="'+i+'" data-cursor="View" role="button" tabindex="-1" aria-label="Open '+esc(p.title)+'">' +
      (p.img ? '<img class="still" src="'+p.img+'" alt="">' : '<div class="ph mono">[ Footage ]</div>') +
      '<div class="top-row mono"><span>'+pad(i+1)+'</span><span>'+esc(p.client)+'</span></div>' +
      '<div class="name'+(p.imgTitle?' sr':'')+'">'+esc(p.title)+'</div>' +
      '<div class="foot mono"><span>'+esc(p.type)+'</span><span>View →</span></div></div>';
  }).join('');
  var cards = [].slice.call(ring.children);
  var pos = 0, target = 0, W = 700, R = 1800, STEP = 0.42, shown = -1, PER = 0.75;
  function measure(){
    var vw = root.clientWidth, sh = stage.clientHeight || VH()*0.55;
    PER = vw < 700 ? 0.34 : 0.75;
    W = Math.min(vw * (vw < 700 ? 0.8 : 0.52), 820, sh * 0.9 * 16/10);
    R = W * 1.06 / Math.sin(STEP);
    ring.style.setProperty('--cw', W+'px');
    stage.style.perspective = Math.max(W*1.5, 700)+'px';
    work.style.height = (VH() * (1 + (P.length-1)*PER)) + 'px';
    // snap points: one per project, so the carousel always settles on a card
    var span = VH() * (P.length-1) * PER;
    var marks = work.querySelectorAll('.snap');
    if (marks.length !== P.length) { [].forEach.call(marks, function(m){ m.remove(); }); for (var si = 0; si < P.length; si++) { var m = document.createElement('i'); m.className = 'snap'; m.setAttribute('aria-hidden','true'); work.appendChild(m); } marks = work.querySelectorAll('.snap'); }
    [].forEach.call(marks, function(m, i){ m.style.top = (span * i / (P.length-1)) + 'px'; });
  }
  function layoutCards(){
    var H = W*10/16;
    cards.forEach(function(c,i){
      var d = i - pos, phi = d*STEP;
      if (Math.abs(d) > 3.2) { c.style.visibility = 'hidden'; return; }
      c.style.visibility = 'visible';
      var x = R*Math.sin(phi), z = R*(1-Math.cos(phi))*0.85;
      c.style.transform = 'translate3d('+(x-W/2)+'px,'+(-H/2)+'px,'+z+'px) rotateY('+(-phi)+'rad)';
      c.style.opacity = String(Math.max(0, 1 - Math.max(0, Math.abs(d)-1.6)*0.6));
      c.style.setProperty('--gs', Math.min(1, Math.abs(d)*1.6).toFixed(3));
    });
    var now = Math.max(0, Math.min(P.length-1, Math.round(pos)));
    if (now !== shown) {
      shown = now;
      document.getElementById('count').textContent = pad(now+1)+' / '+pad(P.length);
      document.getElementById('nowTitle').textContent = P[now].title;
      document.getElementById('nowMeta').textContent = P[now].meta;
    }
    document.getElementById('progBar').style.width = (pos/(P.length-1)*100)+'%';
  }
  function workProgress(){
    var r = work.getBoundingClientRect(), span = work.offsetHeight - VH();
    return Math.max(0, Math.min(1, -r.top / span));
  }
  function scrollToCard(i){
    var top = work.getBoundingClientRect().top + window.scrollY;
    var span = work.offsetHeight - VH();
    window.smoothTo(top + span * (i/(P.length-1)));
  }
  stage.addEventListener('click', function(e){
    var c = e.target.closest('.card'); if (!c) return;
    var i = +c.dataset.i;
    if (i === Math.round(pos)) openCase(P[i].id, c); else scrollToCard(i);
  });
  document.getElementById('openCase').addEventListener('click', function(){ var i = Math.round(pos); openCase(P[i].id, cards[i]); });

  /* ---------- case overlay with FLIP ---------- */
  var caseEl = document.getElementById('case'), lastFocus = null;
  function tileHTML(c, j){
    var tag = c.url ? 'a' : c.crm ? 'button' : 'article';
    var attrs = c.url ? ' href="'+c.url+'" target="_blank" rel="noopener" data-cursor="'+(c.noplay?'Visit':'Play')+'"' : c.crm ? ' type="button" data-crm-link="'+c.crm+'" data-cursor="Open"' : '';
    var cls = 'coll-item'+(c.img?' has-img':'')+(c.logo?' logo':'')+(c.wide?' wide':'')+(c.shot?' shot':'')+((c.url||c.crm)?' is-link':'');
    return '<'+tag+' class="'+cls+'"'+attrs+'>' + (c.img ? '<img class="still" src="'+c.img+'" alt="" loading="lazy">' : '') +
      '<div class="coll-top mono"><span>'+esc(c.k)+'</span></div>' +
      (c.url && !c.noplay ? '<span class="play-dot coll-play" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 22 22"><path d="M7 4l12 7-12 7z" fill="currentColor"/></svg></span>' : '') +
      '<div><h3>'+esc(c.t)+'</h3><p>'+esc(c.d)+'</p><span class="mono">'+esc(c.s)+'</span></div></'+tag+'>';
  }
  function fillCase(id){
    var i = 0; for (var k=0;k<P.length;k++) if (P[k].id===id) i=k;
    var p = P[i], n = P[(i+1)%P.length];
    caseEl.innerHTML = '<div class="wrap">' +
      '<div class="case-bar"><span class="mono" style="color:var(--grey-on-black)">'+pad(i+1)+' / '+pad(P.length)+'</span><button type="button" class="close mono" data-close-case>Close ×</button></div>' +
      '<div class="case-head"><div><span class="mono" style="color:var(--grey-on-black)">'+esc(p.client)+'</span><h2><span class="ln"><span>'+esc(p.title)+'</span></span></h2></div><p class="line">'+esc(p.line)+'</p></div>' +
      (p.collection
        ? '<div class="coll">' + p.collection.map(function(c, j){
            return tileHTML(c, j);
          }).join('') + '<a class="coll-item coll-cta" href="#contact" data-close-case data-cursor="Let\'s talk"><div class="coll-top mono"><span>Next</span></div><div><h3>Your project</h3><p>Tell me what you\'re working on.</p><span class="mono">Let\'s talk →</span></div></a></div>'
        : p.films
        ? '<div class="films">' + p.films.map(function(f,j){
            return '<a class="film watch" href="'+f.url+'" target="_blank" rel="noopener" data-cursor="Play">' +
              (f.img ? '<img class="still" src="'+f.img+'" alt="" loading="lazy">' : '') +
              '<span class="film-top mono"><span>Film '+pad(j+1)+'</span><span>'+esc(f.place)+'</span></span>' +
              '<span class="play-dot" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 22 22"><path d="M7 4l12 7-12 7z" fill="currentColor"/></svg></span>' +
              '<span class="film-title">'+esc(f.title)+'<span class="mono">Watch on YouTube ↗</span></span></a>';
          }).join('') + '</div>'
        : p.img
          ? '<figure class="film photo"><img class="still" src="'+p.img+'" alt="'+esc(p.caption||p.title)+'"><figcaption class="mono">'+esc(p.caption||'')+'</figcaption></figure>'
          : '<div class="film mono">[ Film — '+esc(p.title)+' ]</div>') +
      (p.collection ? '<div class="result"><div><span class="mono">More</span><p>Want the full showreel? Get in touch.</p></div><button type="button" class="next mono" data-case="'+n.id+'" data-cursor="Next">Next — '+esc(n.title)+' →</button></div>' :
      ((p.site || p.crm) ? '<div class="case-links">' +
        (p.site ? '<a class="case-link" href="'+p.site+'" target="_blank" rel="noopener" data-cursor="Visit"><span>View website</span><span class="mono">'+esc(p.siteLabel)+' ↗</span></a>' : '') +
        (p.crm ? '<button type="button" class="case-link" data-crm-link="'+p.crm+'" data-cursor="Open"><span>See the CRM</span><span class="mono">The real build →</span></button>' : '') +
        '</div>' : '') +
      '<div class="facts"><div><span class="mono">Type</span>'+esc(p.type)+'</div><div><span class="mono">Role</span>'+esc(p.role)+'</div><div><span class="mono">Where</span>'+esc(p.where)+'</div></div>' +
      '<div class="cols"><div><span class="mono">The situation</span><p>'+esc(p.brief)+'</p></div><div><span class="mono">What I did</span><ul class="did">'+p.did.map(function(d){return '<li>'+esc(d)+'</li>';}).join('')+'</ul></div></div>' +
      (p.videos ? '<div class="case-videos"><div class="eyebrow mono"><span>Video projects</span><span>'+pad(p.videos.length)+'</span></div><div class="coll">' + p.videos.map(function(c, j){
          return tileHTML(c, j);
        }).join('') + '</div></div>' : '') +
      '<div class="result"><div><span class="mono">Result</span><p>'+esc(p.result)+'</p></div><button type="button" class="next mono" data-case="'+n.id+'" data-cursor="Next">Next — '+esc(n.title)+' →</button></div>') +
      '</div>';
    caseEl.scrollTop = 0;
    try { history.replaceState(null,'','#'+p.id); } catch(e){}
  }
  function showCase(withDoor){
    if (caseEl.hidden) lastFocus = document.activeElement;
    caseEl.classList.remove('door'); caseEl.classList.remove('ready');
    caseEl.hidden = false; body.classList.add('locked');
    if (withDoor && !reduce) { void caseEl.offsetWidth; caseEl.classList.add('door'); }
    var head = caseEl.querySelector('.ln>span');
    if (head && !reduce) { head.style.transform = 'translateY(105%)'; requestAnimationFrame(function(){ requestAnimationFrame(function(){ head.style.transition = 'transform var(--d-slow) var(--ease)'; head.style.transform = 'none'; }); }); }
    var c = caseEl.querySelector('.close'); if (c) c.focus({preventScroll:true});
  }
  function openCase(id, fromEl){
    fillCase(id);
    if (!fromEl || reduce || !caseEl.hidden) { showCase(true); return; }
    var r = fromEl.getBoundingClientRect();
    var f = document.createElement('div'); f.className = 'flip';
    f.style.left = r.left+'px'; f.style.top = r.top+'px'; f.style.width = r.width+'px'; f.style.height = r.height+'px';
    document.body.appendChild(f);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      f.style.left = '0px'; f.style.top = '0px'; f.style.width = '100vw'; f.style.height = '100vh'; f.style.background = '#0A0A0A'; f.style.borderColor = '#0A0A0A';
    }); });
    setTimeout(function(){ showCase(false); setTimeout(function(){ f.remove(); }, 60); }, 760);
  }
  function closeCase(){
    caseEl.hidden = true; body.classList.remove('locked');
    try { history.replaceState(null,'','#work'); } catch(e){}
    if (lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true});
  }

  /* ---------- menu ---------- */
  var sheet = document.getElementById('sheet'), menuBtn = document.getElementById('menuBtn');
  function setMenu(open){ sheet.hidden = !open; menuBtn.textContent = open ? 'Close' : 'Menu'; menuBtn.setAttribute('aria-expanded', open); body.classList.toggle('locked', open); }
  menuBtn.addEventListener('click', function(){ setMenu(sheet.hidden); });
  document.addEventListener('click', function(e){
    var t = e.target;
    var dc = t.closest('[data-case]'); if (dc) { openCase(dc.dataset.case, caseEl.hidden ? dc : null); return; }
    if (t.closest('[data-close-case]')) { closeCase(); return; }
    var cl = t.closest('[data-crm-link]');
    if (cl) { var tabId = cl.dataset.crmLink; closeCase(); var tb = document.getElementById(tabId); if (tb) tb.click();
      var sys = document.getElementById('systems'); if (sys) window.smoothTo(sys); return; }
    if (t.closest('[data-close]')) setMenu(false);
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { if (!caseEl.hidden) closeCase(); else if (!sheet.hidden) setMenu(false); } });

  /* ---------- cursor + magnet ---------- */
  var cur = document.getElementById('cursor'), lbl = document.getElementById('cursorLbl');
  var cx = -100, cy = -100, kx = -100, ky = -100;
  if (fine && !reduce) {
    cur.classList.add('on'); root.classList.add('hide-cursor');
    window.addEventListener('pointermove', function(e){
      kx = e.clientX; ky = e.clientY;
      var tgt = e.target.closest && e.target.closest('[data-cursor]');
      if (tgt) { lbl.textContent = tgt.dataset.cursor; cur.classList.add('big'); } else cur.classList.remove('big');
    });
    document.addEventListener('pointerleave', function(){ kx = ky = -100; });
  }
  var magnet = document.querySelector('[data-magnet]');
  if (fine && !reduce) {
    magnet.addEventListener('pointermove', function(e){ var r = magnet.getBoundingClientRect(); var dx = e.clientX-(r.left+r.width/2), dy = e.clientY-(r.top+r.height/2); magnet.style.transform = 'translate('+dx*.3+'px,'+dy*.4+'px)'; });
    magnet.addEventListener('pointerleave', function(){ magnet.style.transition = 'transform var(--d-base) var(--ease)'; magnet.style.transform = ''; setTimeout(function(){ magnet.style.transition = ''; }, 600); });
  }

  /* ---------- master loop ---------- */
  var big = document.getElementById('bigName'), pimg = document.getElementById('portraitImg'), oimg = document.getElementById('onsetImg');
  function frame(){
    // carousel follows scroll
    target = workProgress() * (P.length-1);
    pos += reduce ? (target-pos) : (target-pos)*0.12;
    if (Math.abs(target-pos) < 0.0005) pos = target;
    layoutCards();
    // marquee speed reacts to scroll velocity
    var y = window.scrollY, dy = y - lastY; lastY = y;
    if (dy !== 0) dir = dy > 0 ? 1 : -1;
    vel += (Math.min(40, Math.abs(dy)) - vel) * 0.1;
    if (!reduce) {
      mqX -= dir * (0.6 + vel*0.35);
      var half = track.scrollWidth/3;
      if (mqX <= -half) mqX += half; if (mqX > 0) mqX -= half;
      track.style.transform = 'translate3d('+mqX+'px,0,0)';
    }
    // sign-off rises into place
    var br = big.parentNode.getBoundingClientRect();
    var k = Math.max(0, Math.min(1, (VH() - br.top) / (br.height + VH()*0.25)));
    big.style.setProperty('--sy', (reduce ? 0 : (1-k)*30) + '%');
    updateLits();
    // portrait drifts slower than the page
    if (pimg && !reduce) { var pr = pimg.parentNode.getBoundingClientRect(); var pk = (pr.top + pr.height/2 - VH()/2) / VH(); pimg.style.setProperty('--py', (-pk*48*(root.clientWidth < 700 ? .5 : 1)).toFixed(1)+'px'); }
    // on-set photo: drifts, and colour bleeds in as it reaches the middle of the screen
    if (oimg) {
      var orr = oimg.parentNode.getBoundingClientRect(), ok = (orr.top + orr.height/2 - VH()/2) / VH();
      if (!reduce) oimg.style.setProperty('--py', (-ok*56*(root.clientWidth < 700 ? .5 : 1)).toFixed(1)+'px');
      oimg.style.setProperty('--gs', reduce ? '0' : Math.min(1, Math.max(0, Math.abs(ok)*2.2 - 0.15)).toFixed(3));
    }
    // cursor
    cx += (kx-cx)*.2; cy += (ky-cy)*.2;
    cur.style.transform = 'translate3d('+cx+'px,'+cy+'px,0)';
    if (!window.gsap) requestAnimationFrame(frame);
  }

  /* ---------- Netlify Forms (live site only; preview falls back to email) ---------- */
  var LIVE = /^https?:$/.test(location.protocol) && !/claude|localhost|127\.0\.0\.1|^$/.test(location.hostname);
  // flip to true once the audit is running on Netlify (functions + ANTHROPIC_API_KEY)
  var AUDIT_LIVE = true;
  var AUDIT_MANUAL = LIVE && !AUDIT_LIVE;   // until then, live visitors request an audit and Jordan does it by hand
  function sendForm(name, data){
    if (!LIVE) return Promise.reject(new Error('preview'));
    var body = new URLSearchParams(Object.assign({'form-name': name}, data)).toString();
    return fetch('/', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: body })
      .then(function(r){ if (!r.ok) throw new Error('send failed'); return r; });
  }

  /* ---------- contact quiz: questions → score → recommendation → enquiry ---------- */
  (function(){
    var TO = 'jordan@sevenstudios.co.uk';
    var Q = [
      {id:'type', q:'What kind of business are you?', o:['Hospitality or retail','Professional services','Media, events or sport','Product or e-commerce','Something else']},
      {id:'team', q:'How big is the team?', o:['Just me','2 to 10 people','11 to 50 people','More than 50']},
      {id:'pain', q:'What’s holding you back right now?', sub:'Pick up to two.', multi:2, o:['Not enough leads or customers','Content isn’t landing','The website doesn’t convert','Too much admin, messy systems','No clear marketing plan','We need video and content made']},
      {id:'lead', q:'Who runs your marketing today?', o:['Nobody, really','Me, around everything else','Someone junior','A team, but no senior lead']},
      {id:'want', q:'What would help most?', o:['A clear plan I can act on','Someone to build and deliver it','Ongoing senior guidance','Not sure yet']},
      {id:'budget', q:'Roughly what do you spend on marketing each month?', o:['Under £1,000','£1,000 to £3,000','£3,000 to £5,000','Over £5,000']}
    ];
    var OFFERS = {
      diag:{name:'The Diagnostic', price:'£1,500 · two days', why:'You need clarity before spend. One day inside the business, one day turning it into a plan you keep, whatever you do next.', last:'Start with two days in your business, and a plan you can run with.'},
      build:{name:'Build', price:'£3,500 / month', why:'You know what’s wrong and need it fixed, not another report. I find the weak points, set the plan, then build it and hand it to your team.', last:'Deliver it month by month, handed to your team ready to run.'},
      md:{name:'Marketing Director', price:'£1,500 / month', why:'You have people doing the work but no senior lead steering it. Weekly calls, advice when you need it, and a non-exec seat on your marketing team.', last:'Weekly calls to keep it moving, with a senior eye on every decision.'}
    };
    var FIX = [
      'Find where your customers actually are, and build a simple path from first look to booked.',
      'Rework your content formats so they build an audience, not just views.',
      'Rebuild the website around one job: turning visitors into enquiries.',
      'Replace the admin with a system built around how you work, like the CRMs above.',
      'Write a 90-day plan with the five things that matter most, in order.',
      'Produce the video and content in-house, through Seven Studios.'
    ];
    var A = {}, step = 0, body = document.getElementById('qzBody'), res = document.getElementById('qzResult');
    var back = document.getElementById('qzBack'), stepLbl = document.getElementById('qzStep'), bar = document.getElementById('qzBar');
    var rec = null, score = 0;

    function draw(){
      var q = Q[step], sel = A[q.id] || (q.multi ? [] : null);
      stepLbl.textContent = 'Question ' + (step + 1) + ' of ' + Q.length;
      bar.style.width = (step / Q.length * 100) + '%';
      back.hidden = step === 0;
      body.innerHTML = '<div class="qz-q"><h3>' + q.q + '</h3>' + (q.sub ? '<p class="sub">' + q.sub + '</p>' : '') +
        '<div class="qz-opts" role="group" aria-label="' + q.q.replace(/"/g,'') + '">' + q.o.map(function(t, i){
          var on = q.multi ? sel.indexOf(i) > -1 : sel === i;
          return '<button type="button" class="qz-opt" data-i="' + i + '" aria-pressed="' + on + '"><i></i><span>' + t + '</span><kbd>' + (i + 1) + '</kbd></button>';
        }).join('') + '</div>' + (q.multi ? '<button type="button" class="qz-next" id="qzNext"' + (sel.length ? '' : ' disabled') + '>Next</button>' : '') + '</div>';
    }
    function pick(i){
      var q = Q[step];
      if (q.multi) {
        var s = (A[q.id] || []).slice(), k = s.indexOf(i);
        if (k > -1) s.splice(k, 1); else { if (s.length >= q.multi) s.shift(); s.push(i); }
        A[q.id] = s; draw(); return;
      }
      A[q.id] = i;
      [].forEach.call(body.querySelectorAll('.qz-opt'), function(b){ b.setAttribute('aria-pressed', +b.dataset.i === i); });
      setTimeout(next, 260);
    }
    function next(){ if (step < Q.length - 1) { step++; draw(); } else result(); }
    body.addEventListener('click', function(e){
      var b = e.target.closest('.qz-opt'); if (b) { pick(+b.dataset.i); return; }
      if (e.target.closest('#qzNext')) next();
    });
    back.addEventListener('click', function(){ if (!res.hidden) { res.hidden = true; body.hidden = false; step = Q.length - 1; draw(); return; } if (step > 0) { step--; draw(); } });
    document.addEventListener('keydown', function(e){
      if (body.hidden || !body.offsetParent) return;
      var r = document.getElementById('qz').getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      if (/^[1-6]$/.test(e.key) && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { var n = +e.key - 1; if (n < Q[step].o.length) pick(n); }
    });

    function result(){
      var pain = A.pain || [];
      score = 72 - pain.length * 11 - [16, 10, 5, 0][A.lead] - (A.want === 3 ? 4 : 0) - (A.budget === 0 ? 5 : 0) + (A.team >= 2 ? 4 : 0);
      score = Math.max(18, Math.min(88, score));
      var k = A.want === 1 ? 'build' : A.want === 2 ? 'md' : 'diag';
      if (k === 'build' && A.budget === 0) k = 'diag';
      if (A.want === 3 && A.lead === 3) k = 'md';
      if (A.want !== 0 && A.budget >= 2 && (pain.indexOf(2) > -1 || pain.indexOf(3) > -1)) k = 'build';
      rec = OFFERS[k];
      var verdict = score < 40 ? 'Plenty of upside. The foundations need work, which means the quick wins are close.'
        : score < 62 ? 'Solid in places, leaking in others. A few gaps between the joins are costing you customers.'
        : 'A strong base. The next gains come from sharper systems and standing out.';
      document.getElementById('qzVerdict').textContent = verdict;
      document.getElementById('qzRec').innerHTML = rec.name + '<small>' + rec.price + '</small>';
      document.getElementById('qzRecWhy').textContent = rec.why;
      var plan = pain.map(function(p){ return FIX[p]; }); plan.push(rec.last);
      document.getElementById('qzPlan').innerHTML = plan.map(function(t){ return '<li>' + t + '</li>'; }).join('');
      body.hidden = true; res.hidden = false; bar.style.width = '100%';
      stepLbl.textContent = 'Your result'; back.hidden = false;
      var sc = document.getElementById('qzScore'), arc = document.getElementById('qzArc'), t0 = performance.now();
      arc.style.strokeDashoffset = 327; requestAnimationFrame(function(){ arc.style.strokeDashoffset = 327 * (1 - score / 100); });
      (function tick(now){ var p = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - p, 3); sc.textContent = Math.round(e * score); if (p < 1 && !reduce) requestAnimationFrame(tick); else sc.textContent = score; })(t0);
      document.getElementById('qzForm').hidden = false; document.getElementById('qzDone').hidden = true;
      window.smoothTo(document.getElementById('qz'), {offset: -90});
    }

    function summary(f){
      return 'Name: ' + f.name + '\nEmail: ' + f.email + '\nBusiness: ' + f.business + (f.website ? '\nWebsite: ' + f.website : '') +
        '\n\nThe problem: ' + f.message + '\n\n--- Quiz answers ---\n' +
        Q.map(function(q){ var a = A[q.id]; return q.q + ' ' + (q.multi ? (a || []).map(function(i){ return q.o[i]; }).join('; ') : q.o[a]); }).join('\n') +
        '\n\nScore: ' + score + '/100\nRecommended: ' + rec.name + ' (' + rec.price + ')';
    }
    var form = document.getElementById('qzForm'), err = document.getElementById('qzErr'), last = '';
    var fName = document.getElementById('fName'), fEmail = document.getElementById('fEmail'), fBiz = document.getElementById('fBiz'), fSite = document.getElementById('fSite'), fMsg = document.getElementById('fMsg');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var f = { name: fName.value.trim(), email: fEmail.value.trim(), business: fBiz.value.trim(), website: fSite.value.trim(), message: fMsg.value.trim() };
      var bad = [];
      [['name', fName], ['business', fBiz], ['message', fMsg]].forEach(function(x){ x[1].classList.toggle('bad', !f[x[0]]); if (!f[x[0]]) bad.push(x[1]); });
      var okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email); fEmail.classList.toggle('bad', !okMail); if (!okMail) bad.unshift(fEmail);
      if (bad.length) { err.textContent = !okMail ? 'Check your email address, it doesn’t look quite right.' : 'Fill in the highlighted fields so I know who I’m talking to.'; bad[0].focus(); return; }
      err.textContent = ''; last = summary(f);
      var btn = document.getElementById('qzSend'); btn.disabled = true; btn.textContent = 'Sending…';
      function fallback(){
        btn.disabled = false; btn.textContent = 'Send it to Jordan';
        form.hidden = true; document.getElementById('qzDone').hidden = false;
        document.getElementById('qzDoneH').textContent = 'Nearly there.';
        document.getElementById('qzDoneP').textContent = 'Press the button below to send this from your own email. Your answers are already filled in.';
        document.getElementById('qzMail').href = 'mailto:' + TO + '?subject=' + encodeURIComponent('Enquiry from ' + f.business + ' (quiz result: ' + rec.name + ')') + '&body=' + encodeURIComponent(last);
        document.getElementById('qzFallback').hidden = false;
      }
      sendForm('enquiry', { name:f.name, email:f.email, business:f.business, website:f.website, message:f.message, score:String(score), recommended:rec.name, answers:last })
        .then(function(){
          form.hidden = true; document.getElementById('qzDone').hidden = false;
          document.getElementById('qzDoneH').textContent = 'Sent. Thanks, ' + f.name.split(' ')[0] + '.';
          document.getElementById('qzDoneP').textContent = 'I’ll read your answers and reply within one working day.';
          document.getElementById('qzFallback').hidden = true;
        }).catch(fallback);
    });
    document.getElementById('qzCopy').addEventListener('click', function(){
      var b = this; try { navigator.clipboard.writeText(last).then(function(){ b.textContent = 'Copied'; setTimeout(function(){ b.textContent = 'Copy my answers'; }, 1600); }, function(){}); } catch(e){}
    });
    document.getElementById('qzAgain').addEventListener('click', function(){ A = {}; step = 0; res.hidden = true; body.hidden = false; draw(); });
    draw();
  })();

  /* ---------- website audit: url → /api/audit → teardown → lead ---------- */
  (function(){
    if (!document.getElementById('au')) return;
    if (AUDIT_MANUAL) { var eb = document.querySelector('#audit .eyebrow span:last-child'); if (eb) eb.textContent = 'Back within 48 hours'; }
    var TO = 'jordan@sevenstudios.co.uk';
    var OFF = {
      diag:{name:'The Diagnostic', price:'£1,500 · two days'},
      build:{name:'Build', price:'£3,500 / month'},
      md:{name:'Marketing Director', price:'£1,500 / month'}
    };
    var DEMO = {
      site:{host:'northgatecoffee.co.uk', url:'https://northgatecoffee.co.uk/'},
      facts:{https:true, load_ms:2840, platform:['Squarespace'], booking:[], tracking:[], social:['instagram.com']},
      brand:{logo:'', image:'', colour:'#8a4b22', site_name:'Northgate Coffee Co.'},
      basics:{score:52, checks:[]},
      report:{
        business:{name:'Northgate Coffee Co.', what:'Independent coffee shop and roastery', trade:'coffee shop', town:'Doncaster'},
        hero:{headline:'Roasted here. Poured here.', sub:'Small-batch coffee roasted in the back every Tuesday, ten minutes from the station.', cta:'Order ahead', cta2:'Buy our beans', proof:'Roasted on site every week'},
        film:[
          {title:'Roast day', format:'30s Reel', idea:'Green beans to bagged coffee in thirty seconds, shot on a Tuesday morning with the roaster talking over it.'},
          {title:'Meet the regulars', format:'Series of 4 Reels', idea:'Your barista guesses regulars’ orders before they reach the till. Light, local, very shareable.'},
          {title:'Why we roast our own', format:'2-minute brand film', idea:'The story behind the roastery, for the homepage hero and the bean shop page.'}
        ],
        score:46,
        verdict:'Lovely product, but the homepage makes people work to find out why they should visit, and there is no way to capture anyone who isn’t ready today.',
        categories:[
          {name:'First impression', score:6, note:'Clear it’s coffee, not clear why this coffee.'},
          {name:'Message', score:4, note:'“Welcome to Northgate” says nothing a visitor cares about.'},
          {name:'Conversion', score:3, note:'No order, visit or sign-up action above the fold.'},
          {name:'Trust', score:4, note:'No reviews, press or faces anywhere on the page.'},
          {name:'Search', score:6, note:'Title is fine, meta description missing.'},
          {name:'Tech', score:5, note:'Slow load and no analytics to learn from.'}
        ],
        working:['The roastery story further down is genuine and specific.','Opening hours and address are easy to find in the footer.'],
        weak:[
          {title:'The headline is a greeting, not a reason', detail:'“Welcome to Northgate” could be any business. Lead with what you do better: roasted on site, ten minutes from the station, whatever is true and specific.', impact:'High'},
          {title:'No action for people ready to buy', detail:'The only buttons are “Menu” and “About”. There is no order ahead, no beans to buy, nothing that turns interest into money.', impact:'High'},
          {title:'Nothing captures the people who aren’t ready', detail:'No email sign-up or loyalty offer, so every visitor who leaves is gone for good.', impact:'Medium'},
          {title:'No proof from customers', detail:'No reviews, no Google rating, no faces of the team. People buy from people.', impact:'Medium'},
          {title:'You can’t see what’s working', detail:'No analytics or pixel installed, so there is no data to improve the site or run ads with.', impact:'Low'}
        ],
        fix_first:[
          {title:'Rewrite the hero', how:'One line on why you, one line on what to do next, and a single button: order ahead or buy beans.'},
          {title:'Sell the beans online', how:'You already roast. A simple shop for bags and a monthly subscription turns the website into a till.'},
          {title:'Put your regulars on the page', how:'Pull in your best Google reviews and a photo of the team behind the counter.'}
        ],
        support:[
          {service:'Web', title:'A homepage that sells', detail:'I’d rebuild the top of the page around one clear action and add a bean shop, the same way I set up Scene online.'},
          {service:'Content', title:'Turn the team into the brand', detail:'I turned a barista at Scene into @lattelad, now reaching thousands a week live. Your roaster could be the face people come in for.'},
          {service:'AI automation', title:'Capture and follow up', detail:'I’d add a sign-up with a free-coffee offer and automate the welcome and win-back emails so it runs without you.'}
        ],
        offer:'build',
        offer_reason:'You know the product works. What’s missing is the website, content and follow-up joined up, and that needs building, not another report.',
        plan:[
          {week:'Week 1', focus:'New hero, one call to action, reviews on the page, analytics and pixel installed.'},
          {week:'Week 2', focus:'Bean shop and subscription live, with photography of the roastery.'},
          {week:'Week 3', focus:'Email sign-up with a free-coffee offer, welcome sequence automated.'},
          {week:'Week 4', focus:'First month of team-led content, then review the numbers and double down.'}
        ]
      }
    };


    var DEMO_PLAN = {
      summary:'Northgate has a product people love and a homepage that hides it. This plan turns the site into a till and a sign-up sheet in four weeks: a headline that says why you, beans you can buy online, and a way to bring people back. By day 30 you should see online orders and an email list you own.',
      headline:{ current:'Welcome to Northgate',
        options:['Roasted here on Tuesday. In your cup by Wednesday. / Doncaster’s only on-site roastery, ten minutes from the station.',
                 'Coffee worth crossing town for. / Small-batch beans roasted in the back, served at the front.',
                 'Your new favourite bag of beans. / Roasted fresh every week and posted free in Doncaster.'],
        cta:['Order ahead','Buy this week’s beans','Get a free coffee'] },
      quick_wins:[
        {title:'Swap the headline', how:'Use option one above and put “Order ahead” as the only button at the top.', time:'20 minutes'},
        {title:'Add your Google rating', how:'Paste your three best reviews under the hero, with first names.', time:'30 minutes'},
        {title:'Write a meta description', how:'One sentence with “Doncaster”, “coffee” and “roastery” in it.', time:'10 minutes'},
        {title:'Install analytics', how:'Add Google Analytics and the Meta Pixel so you can see what works from day one.', time:'30 minutes'},
        {title:'Put a face on the page', how:'A photo of [your roaster] at the roaster, with one line on who they are.', time:'15 minutes'}
      ],
      weeks:[
        {week:'Week 1', goal:'Fix the front door', tasks:['New headline, subheading and one button','Reviews and team photo under the hero','Analytics and pixel installed','Opening hours moved above the fold on mobile']},
        {week:'Week 2', goal:'Sell the beans', tasks:['Add a shop with three blends and a monthly subscription','Photograph the bags on the counter, natural light','Free local delivery over £20','Link the shop from Instagram bio']},
        {week:'Week 3', goal:'Capture the ones who leave', tasks:['Email sign-up with a free coffee for joining','Three-email welcome: story, best seller, subscription offer','QR code on every table and cup sleeve']},
        {week:'Week 4', goal:'Turn the team into the brand', tasks:['Film four short Reels with [your roaster]','Post twice a week, same day and time','Review the numbers and double down on what sold']}
      ],
      content:[
        {format:'30s Reel', idea:'Tuesday roast day, from green bean to bag.'},
        {format:'Carousel', idea:'Three blends, who each one is for.'},
        {format:'Reel', idea:'Regulars’ orders, guessed by the barista.'},
        {format:'Email', idea:'The story of the first bag you ever roasted.'},
        {format:'Story', idea:'Poll: which blend should we roast next?'},
        {format:'Reel', idea:'“What £3.40 actually pays for” behind the counter.'}
      ],
      measure:[
        {metric:'Online orders', target:'20 in the first month'},
        {metric:'Email sign-ups', target:'150 by day 30'},
        {metric:'Clicks on the top button', target:'1 in 10 visitors'}
      ],
      tools:[
        {name:'Squarespace Commerce', for:'The bean shop and subscriptions, on the site you already have.'},
        {name:'Mailchimp', for:'Sign-up form and the welcome emails.'},
        {name:'CapCut', for:'Editing the Reels on your phone.'},
        {name:'Google Business Profile', for:'Reviews, photos and opening hours in search.'}
      ]
    };
    var form = document.getElementById('auForm'), input = document.getElementById('auUrl'), go = document.getElementById('auGo');
    var err = document.getElementById('auErr'), scan = document.getElementById('auScan'), res = document.getElementById('auRes');
    var steps = [].slice.call(document.querySelectorAll('#auLog li')), timer = null, data = null;
    var esc2 = function(t){ return String(t == null ? '' : t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };

    function clean(v){
      v = v.trim(); if (!v) return '';
      if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
      try { var u = new URL(v); return u.hostname.indexOf('.') > 0 ? u.href : ''; } catch(e){ return ''; }
    }
    function startScan(host){
      document.getElementById('auHost').textContent = host;
      steps.forEach(function(li){ li.className = ''; });
      scan.hidden = false; res.hidden = true;
      var t0 = Date.now(), i = 0, gaps = [900, 2200, 3600, 5200, 7000];
      steps[0].className = 'on';
      timer = setInterval(function(){
        var el = (Date.now() - t0) / 1000;
        document.getElementById('auTime').textContent = Math.floor(el) + 's';
        while (i < gaps.length && el * 1000 > gaps[i]) { steps[i].className = 'ok'; i++; steps[i].className = 'on'; }
      }, 200);
    }
    function stopScan(){
      clearInterval(timer); steps.forEach(function(li){ li.className = 'ok'; });
    }
    function chip(t, bad){ return '<span' + (bad ? ' class="bad"' : '') + '>' + esc2(t) + '</span>'; }


    /* ---- extras: the fixed homepage, Google speed, local rivals, real searches, film ideas ---- */
    var DEMO_SPEED = { score:38, lcp_s:5.2, screenshot:null };
    var DEMO_MARKET = { query:'coffee shop doncaster', position:null, searched:true, rivals:[
      {name:'Harbour Coffee', host:'harbourcoffee.example', score:78, missing:['Structured data','Analytics']},
      {name:'The Corner Roast', host:'cornerroast.example', score:66, missing:['Share image','Sitemap','Search description']},
      {name:'Dale Street Café', host:'dalestreetcafe.example', score:44, missing:['Call to action','Loads fast','Social links']}
    ], terms:['coffee shop doncaster','best coffee doncaster','coffee shops near me','coffee doncaster town centre','independent coffee shop doncaster','coffee beans doncaster','brunch doncaster','cafe doncaster open now'] };
    var extras = {};
    function lum(hex){ var h = (hex || '').replace('#',''); if (h.length !== 6) return 0; var c = [0,2,4].map(function(i){ var v = parseInt(h.substr(i,2),16)/255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); }); return .2126*c[0] + .7152*c[1] + .0722*c[2]; }
    function mockAfter(d){
      var b = d.brand || {}, h = d.report.hero || {}, col = /^#[0-9a-f]{6}$/i.test(b.colour || '') ? b.colour : '#ffffff';
      var txt = lum(col) > .45 ? '#111' : '#fff';
      var bg = b.image ? 'background-image:url(\'' + esc2(b.image).replace(/'/g,'%27') + '\')' : 'background:linear-gradient(160deg,' + col + ' 0%, #111 85%)';
      var logo = b.logo ? '<img src="' + esc2(b.logo) + '" alt="" referrerpolicy="no-referrer" onerror="this.outerHTML=\'<b>' + esc2(d.report.business.name).replace(/'/g,'') + '</b>\'">' : '<b>' + esc2(d.report.business.name) + '</b>';
      return '<div class="mk"><div class="mk-top">' + logo + '<i></i></div>' +
        '<div class="mk-hero" style="' + bg + '"><h4>' + esc2(h.headline) + '</h4><p>' + esc2(h.sub) + '</p>' +
        '<div class="mk-btns"><span style="background:' + col + ';color:' + txt + '">' + esc2(h.cta) + '</span><span>' + esc2(h.cta2) + '</span></div>' +
        '<div class="mk-proof">' + esc2(h.proof) + '</div></div><div class="mk-strip"><i></i><i></i><i></i></div></div>';
    }
    function mockBefore(d){
      var f = d.report;
      return '<div class="mk-old"><div class="nav"><b>' + esc2(f.business.name) + '</b><span>Home</span><span>About</span><span>Menu</span></div>' +
        '<h4>Welcome to Northgate</h4><p>We are an independent coffee shop. Come and visit us.</p><div class="img"></div><p>Opening hours</p></div>';
    }
    function setX(v){ document.getElementById('fxCmp').style.setProperty('--x', v + '%'); document.getElementById('fxRange').value = v; }
    document.getElementById('fxRange').addEventListener('input', function(){ setX(this.value); });
    function statClass(el, good, bad){ el.classList.toggle('ok', !!good); el.classList.toggle('bad', !!bad); }

    function resetExtras(d, demo){
      extras = {};
      var has = d.report.hero && d.report.hero.headline;
      document.getElementById('auFx').hidden = !has;
      if (has) {
        document.getElementById('fxAfter').innerHTML = mockAfter(d);
        document.getElementById('fxBefore').innerHTML = '<div class="fx-wait mono">Photographing your homepage on a phone…</div>';
        setX(50);
        var h = d.report.hero;
        document.getElementById('fxList').innerHTML =
          '<li><b>Headline:</b> ' + esc2(h.headline) + '</li><li><b>Buttons:</b> ' + esc2(h.cta) + ' · ' + esc2(h.cta2) + '</li><li><b>Trust line:</b> ' + esc2(h.proof) + '</li>';
      }
      ['fxSpeed','fxLcp'].forEach(function(id){ var el = document.getElementById(id); el.textContent = '…'; statClass(el); });
      var bs = document.getElementById('fxBasics'), bsc = d.basics ? d.basics.score : null;
      bs.textContent = bsc == null ? '–' : bsc; statClass(bs, bsc >= 75, bsc != null && bsc < 50);
      var bz = d.report.business || {};
      document.getElementById('auLocal').hidden = !bz.trade;
      document.getElementById('auTerms').hidden = !bz.trade;
      document.getElementById('lcLine').textContent = 'Searching “' + (bz.trade || '') + (bz.town ? ' ' + bz.town : '') + '”…';
      document.getElementById('lcHead').textContent = bz.town ? 'How you stack up in ' + bz.town : 'How you stack up';
      document.getElementById('lcRows').innerHTML = '<div class="lc-wait mono">Finding who you’re up against…</div>';
      document.getElementById('tmChips').innerHTML = '<span class="lc-wait mono">Pulling real Google searches…</span>';
      var fm = d.report.film || [];
      document.getElementById('auFilm').parentNode.hidden = !fm.length;
      document.getElementById('auFilm').innerHTML = fm.map(function(x){ return '<div><span class="mono">' + esc2(x.format) + '</span><h4>' + esc2(x.title) + '</h4><p>' + esc2(x.idea) + '</p></div>'; }).join('');

      if (demo) {
        setTimeout(function(){ document.getElementById('fxBefore').innerHTML = mockBefore(d); showSpeed(DEMO_SPEED); }, 900);
        setTimeout(function(){ showMarket(DEMO_MARKET, d); }, 1600);
        return;
      }
      var post = function(path, body){ return fetch(path, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); }); };
      var mine = d;
      post('api/speed', { url: d.site.url }).then(function(sp){ if (data === mine) showSpeed(sp); }, function(){ if (data === mine) showSpeed(null); });
      if (bz.trade) post('api/market', { host: d.site.host, trade: bz.trade, town: bz.town || '' })
        .then(function(m){ if (data === mine) showMarket(m, d); }, function(){ if (data === mine) showMarket(null, d); });
    }

    function showSpeed(sp){
      extras.speed = sp;
      var sEl = document.getElementById('fxSpeed'), lEl = document.getElementById('fxLcp');
      if (!sp) { sEl.textContent = '–'; lEl.textContent = '–'; }
      else {
        sEl.textContent = sp.score; statClass(sEl, sp.score >= 80, sp.score < 50);
        lEl.textContent = sp.lcp_s != null ? sp.lcp_s + 's' : '–'; statClass(lEl, sp.lcp_s != null && sp.lcp_s <= 2.5, sp.lcp_s > 4);
      }
      var before = document.getElementById('fxBefore');
      if (sp && sp.screenshot) before.innerHTML = '<img src="' + sp.screenshot + '" alt="Your current homepage on a phone">';
      else if (!before.querySelector('.mk-old')) before.innerHTML = '<div class="fx-wait mono" style="animation:none">Google couldn’t photograph your homepage this time. The fixed version is on the right.</div>';
      if (!reduce) { var t0 = performance.now(); (function anim(now){ var p = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - p, 3); setX(Math.round(85 - 35 * e)); if (p < 1) requestAnimationFrame(anim); })(t0); }
    }

    function showMarket(m, d){
      extras.market = m;
      var line = document.getElementById('lcLine'), rows = document.getElementById('lcRows'), chips = document.getElementById('tmChips');
      if (!m) { line.textContent = 'Couldn’t run the local search this time.'; rows.innerHTML = ''; chips.innerHTML = '<span class="lc-wait mono">Search suggestions unavailable right now.</span>'; return; }
      var q = '“' + m.query + '”';
      line.textContent = !m.searched ? 'Couldn’t run the local search this time.' : (m.position ? 'Search ' + q + ' and you’re #' + m.position + ' on the first page.' : 'Search ' + q + ' and you’re not on the first page. These are:');
      var me = { name: d.report.business.name, host: d.site.host, score: d.basics ? d.basics.score : 0, me: true };
      var list = (m.rivals || []).concat([me]).sort(function(a, b){ return b.score - a.score; });
      rows.innerHTML = (m.rivals || []).length ? list.map(function(x, i){
        return '<div class="lc-row' + (x.me ? ' me' : '') + '"><span class="mono">' + String(i + 1).padStart(2, '0') + '</span><div><b>' + esc2(x.me ? x.name + ' (you)' : x.name) + '</b><small>' + esc2(x.host) + '</small></div>' +
          '<div class="bar"><i data-w="' + x.score + '"></i></div><em>' + x.score + '</em>' +
          (!x.me && x.missing && x.missing.length ? '<div class="lc-miss">' + x.missing.map(function(t){ return '<span>No ' + esc2(t.toLowerCase()) + '</span>'; }).join('') + '</div>' : '') + '</div>';
      }).join('') : '<div class="lc-wait mono">No comparable local sites came up for that search.</div>';
      requestAnimationFrame(function(){ [].forEach.call(rows.querySelectorAll('.bar i'), function(i){ i.style.width = i.getAttribute('data-w') + '%'; }); });
      var you = list.findIndex(function(x){ return x.me; }) + 1;
      if ((m.rivals || []).length) line.textContent += ' On the basics, you’re ' + (you === 1 ? 'top of this group.' : '#' + you + ' of ' + list.length + '.');
      chips.innerHTML = (m.terms || []).length ? m.terms.map(function(t){ return '<span class="t">' + esc2(t) + '</span>'; }).join('') : '<span class="lc-wait mono">No suggestions came back for this one.</span>';
    }

    document.getElementById('auBook').addEventListener('click', function(){
      var fm = (data && data.report.film) || [];
      document.getElementById('alMsg').value = 'I’d like to talk about filming: ' + fm.map(function(x){ return x.title; }).join(', ') + '.';
      showLead();
    });

    function render(d, demo){
      data = d; var r = d.report, f = d.facts || {};
      document.getElementById('auDemo').hidden = !demo;
      document.getElementById('auSite').textContent = d.site.host;
      document.getElementById('auBiz').textContent = r.business.name;
      document.getElementById('auWhat').textContent = r.business.what;
      document.getElementById('auVerdict').textContent = r.verdict;
      var c = [];
      c.push(chip(f.https ? 'HTTPS' : 'Not secure', !f.https));
      if (f.load_ms) c.push(chip('Loaded in ' + (f.load_ms / 1000).toFixed(1) + 's', f.load_ms > 2500));
      (f.platform || []).forEach(function(p){ c.push(chip(p)); });
      (f.booking || []).forEach(function(p){ c.push(chip(p + ' booking')); });
      c.push((f.tracking || []).length ? chip((f.tracking || []).join(' · ')) : chip('No analytics found', true));
      c.push(chip((f.social || []).length + ' social link' + ((f.social || []).length === 1 ? '' : 's'), !(f.social || []).length));
      document.getElementById('auChips').innerHTML = c.join('');
      document.getElementById('auCats').innerHTML = r.categories.map(function(k){
        return '<div class="au-cat"><b>' + esc2(k.name) + '</b><div class="bar"><i data-w="' + (k.score * 10) + '"></i></div><em>' + k.score + '/10</em><small>' + esc2(k.note) + '</small></div>';
      }).join('');
      document.getElementById('auGood').innerHTML = r.working.map(function(w){ return '<li>' + esc2(w) + '</li>'; }).join('');
      document.getElementById('auWeak').innerHTML = r.weak.map(function(w){
        return '<li><b>' + esc2(w.title) + '<span class="' + esc2(w.impact) + '">' + esc2(w.impact) + '</span></b><p>' + esc2(w.detail) + '</p></li>';
      }).join('');
      document.getElementById('auFix').innerHTML = r.fix_first.map(function(x){ return '<li><span><b style="font-weight:500">' + esc2(x.title) + '.</b> ' + esc2(x.how) + '</span></li>'; }).join('');
      document.getElementById('auHelp').innerHTML = r.support.map(function(x){
        return '<div><span class="mono">' + esc2(x.service) + '</span><h4>' + esc2(x.title) + '</h4><p>' + esc2(x.detail) + '</p></div>';
      }).join('');
      var o = OFF[r.offer] || OFF.diag;
      document.getElementById('auRec').innerHTML = esc2(o.name) + '<small>' + esc2(o.price) + '</small>';
      document.getElementById('auRecWhy').textContent = r.offer_reason;
      document.getElementById('auPlan').innerHTML = r.plan.map(function(x){ return '<li data-w="' + esc2(x.week) + '">' + esc2(x.focus) + '</li>'; }).join('');
      document.getElementById('auGate').classList.add('locked');
      document.getElementById('auLead').hidden = true; document.getElementById('alDone').hidden = true;
      document.getElementById('auFull').hidden = true; document.getElementById('auBuyErr').textContent = '';

      scan.hidden = true; res.hidden = false;
      var sc = document.getElementById('auScore'), arc = document.getElementById('auArc'), t0 = performance.now(), score = r.score;
      arc.style.strokeDashoffset = 327;
      requestAnimationFrame(function(){
        arc.style.strokeDashoffset = 327 * (1 - score / 100);
        [].forEach.call(document.querySelectorAll('#auCats .bar i'), function(i){ i.style.width = i.getAttribute('data-w') + '%'; });
      });
      (function tick(now){ var p = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - p, 3); sc.textContent = Math.round(e * score); if (p < 1 && !reduce) requestAnimationFrame(tick); else sc.textContent = score; })(t0);
      resetExtras(d, demo);
      window.smoothTo(res, {offset: -100});
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var url = clean(input.value);
      if (!url) { err.textContent = 'Type your website address, like yourbusiness.co.uk'; input.focus(); return; }
      err.textContent = '';
      var host = new URL(url).hostname.replace(/^www\./, '');
      if (AUDIT_MANUAL) { manual(host); return; }
      function manual(host){
        var mf = document.getElementById('auManual'); mf.hidden = false; mf.setAttribute('data-site', host);
        document.getElementById('amDone').hidden = true;
        document.getElementById('amHead').textContent = 'I’ll audit ' + host + ' myself and send it within 48 hours';
        document.getElementById('amName').focus();
      }
      go.disabled = true; go.textContent = 'Auditing…';
      startScan(host);
      fetch('api/audit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ url: url }) })
        .then(function(r){ return r.json().catch(function(){ return { error: 'unavailable', status: r.status }; }).then(function(j){ j._status = r.status; return j; }); })
        .catch(function(){ return { error: 'unavailable', _status: 0 }; })
        .then(function(j){
          var off = !(j && j.report) && (j.error === 'unavailable' || j.error === 'not_configured' || j._status === 404 || j._status === 501);
          if (off && !LIVE) {   // preview: play the scan, then show the example report
            setTimeout(function(){ stopScan(); go.disabled = false; go.textContent = 'Audit it →'; render(JSON.parse(JSON.stringify(DEMO)), true); }, 5200);
            return;
          }
          stopScan(); go.disabled = false; go.textContent = 'Audit it →';
          if (j && j.report) { render(j, false); return; }
          scan.hidden = true;
          if (off || j._status >= 500) { manual(host); return; }   // engine off or failing: take the request by hand
          err.textContent = off ? 'The audit is having a rest. Email me your address and I’ll look at it myself: ' + TO : (j.error || 'Something went wrong. Try again.');
        });
    });

    document.getElementById('auManual').addEventListener('submit', function(e){
      e.preventDefault();
      var mf = this, n = document.getElementById('amName'), m = document.getElementById('amEmail'), msg = document.getElementById('amMsg').value.trim(), site = mf.getAttribute('data-site');
      var okN = !!n.value.trim(), okM = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim()), ae = document.getElementById('amErr');
      n.classList.toggle('bad', !okN); m.classList.toggle('bad', !okM);
      if (!okN || !okM) { ae.textContent = !okM ? 'Check your email address, it doesn’t look quite right.' : 'Add your name so I know who I’m talking to.'; (okN ? m : n).focus(); return; }
      ae.textContent = '';
      var b = document.getElementById('amSend'); b.disabled = true; b.textContent = 'Sending…';
      function done(sent){
        b.disabled = false; b.textContent = 'Send me my audit'; mf.hidden = true;
        document.getElementById('amDone').hidden = false;
        document.getElementById('amDoneH').textContent = sent ? 'Got it, ' + n.value.trim().split(' ')[0] + '.' : 'Nearly there.';
        document.getElementById('amFallback').hidden = sent;
        if (!sent) document.getElementById('amMail').href = 'mailto:' + TO + '?subject=' + encodeURIComponent('Website audit request: ' + site) + '&body=' + encodeURIComponent('Hi Jordan,\n\nPlease audit ' + site + '.' + (msg ? '\n\n' + msg : '') + '\n\n' + n.value.trim());
      }
      sendForm('audit-lead', { name:n.value.trim(), email:m.value.trim(), website:site, message:msg, score:'', recommended:'', audit:'Audit requested by hand (AI audit not switched on yet).' })
        .then(function(){ done(true); }, function(){ done(false); });
    });

    document.getElementById('auAgain').addEventListener('click', function(){
      res.hidden = true; input.value = ''; input.focus();
      window.smoothTo(document.getElementById('au'), {offset: -100});
    });

    var lead = document.getElementById('auLead'), alErr = document.getElementById('alErr');
    /* ---- the two ways forward: work with me, or buy the plan ---- */
    var PAY_LINK = '';   // your Stripe Payment Link, e.g. https://buy.stripe.com/xxxx
    var refFor = function(h){ return String(h || '').toLowerCase().replace(/^www\./, '').replace(/[^a-z0-9]+/g, '_').slice(0, 190); };
    function showLead(){
      var g = document.getElementById('auGate');
      document.getElementById('alDone').hidden = true; lead.hidden = false;
      window.smoothTo(g, {offset: -100});
      setTimeout(function(){ document.getElementById('alName').focus({preventScroll:true}); }, reduce ? 0 : 600);
    }
    if (LIVE && !PAY_LINK) {   // no Stripe link yet: just the Work with me option
      var buy = document.getElementById('auBuy').closest('.au-opt'); if (buy) buy.remove();
      document.getElementById('auChoose').style.gridTemplateColumns = 'minmax(0,1fr)';
    }
    document.getElementById('auWork').addEventListener('click', showLead);
    document.getElementById('afWork').addEventListener('click', showLead);
    var buyBtn = document.getElementById('auBuy');
    if (buyBtn) buyBtn.addEventListener('click', function(){
      var be = document.getElementById('auBuyErr'); be.textContent = '';
      if (!LIVE) { renderFull(DEMO_PLAN, true); return; }
      if (!PAY_LINK) { be.textContent = 'Plans go on sale shortly. Email me in the meantime: ' + TO; return; }
      try { localStorage.setItem('au_audit', JSON.stringify(data)); } catch(e){}
      this.disabled = true; this.textContent = 'Opening checkout…';
      location.href = PAY_LINK + (PAY_LINK.indexOf('?') < 0 ? '?' : '&') + 'client_reference_id=' + encodeURIComponent(refFor(data.site.host));
    });

    var fullPlan = null;
    function li(arr, f){ return arr.map(f).join(''); }
    function renderFull(pl, demo){
      fullPlan = pl;
      var g = document.getElementById('auGate'); g.classList.remove('locked');
      document.getElementById('afDemo').hidden = !demo;
      document.getElementById('afTitle').textContent = data.report.business.name;
      var h = pl.headline;
      document.getElementById('afBody').innerHTML =
        '<p class="af-sum">' + esc2(pl.summary) + '</p>' +
        '<div class="af-sec"><span class="mono">Your headline, rewritten</span><div class="af-hl"><div class="was">Now: ' + esc2(h.current) + '</div>' +
          li(h.options, function(o){ var x = String(o).split(' / '); return '<div>' + esc2(x[0]) + (x[1] ? '<small>' + esc2(x.slice(1).join(' / ')) + '</small>' : '') + '</div>'; }) +
          '</div><div class="af-ctas">' + li(h.cta, function(c){ return '<span>' + esc2(c) + '</span>'; }) + '</div></div>' +
        '<div class="af-sec"><span class="mono">Quick wins, this week</span><ul class="af-qw">' +
          li(pl.quick_wins, function(q){ return '<li><b>' + esc2(q.title) + '</b><p>' + esc2(q.how) + '</p><em>' + esc2(q.time) + '</em></li>'; }) + '</ul></div>' +
        '<div class="af-sec"><span class="mono">Your 30 days</span><div class="af-weeks">' +
          li(pl.weeks, function(w){ return '<div><span class="mono">' + esc2(w.week) + '</span><h5>' + esc2(w.goal) + '</h5><ul>' + li(w.tasks, function(t){ return '<li>' + esc2(t) + '</li>'; }) + '</ul></div>'; }) + '</div></div>' +
        '<div class="af-sec"><span class="mono">Six pieces of content to make</span><div class="af-grid">' +
          li(pl.content, function(c){ return '<div><span class="mono">' + esc2(c.format) + '</span>' + esc2(c.idea) + '</div>'; }) + '</div></div>' +
        '<div class="af-sec af-two"><div><span class="mono">What to measure</span><ul class="af-qw">' +
          li(pl.measure, function(m){ return '<li><b>' + esc2(m.metric) + '</b><p>' + esc2(m.target) + '</p></li>'; }) + '</ul></div>' +
          '<div><span class="mono">Tools to use</span><ul class="af-qw">' +
          li(pl.tools, function(t){ return '<li><b>' + esc2(t.name) + '</b><p>' + esc2(t.for) + '</p></li>'; }) + '</ul></div></div>';
      var full = document.getElementById('auFull'); full.hidden = false;
      window.smoothTo(full, {offset: -100});
    }

    document.getElementById('afPdf').addEventListener('click', function(){
      if (!fullPlan) return;
      var r = data.report, pl = fullPlan, e = esc2;
      var css = 'body{font:15px/1.5 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;color:#111;margin:0;padding:48px}h1{font-size:40px;letter-spacing:-.03em;line-height:1;margin:6px 0 18px}h2{font-size:12px;font-family:Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:#666;margin:34px 0 10px;border-top:1px solid #111;padding-top:14px}.k{font-family:Menlo,monospace;font-size:11px;color:#666;letter-spacing:.06em;text-transform:uppercase}.hl{border:1px solid #ddd;border-radius:10px;padding:12px 14px;margin:6px 0;font-size:18px;font-weight:600;letter-spacing:-.01em}.hl small{display:block;font-weight:400;font-size:14px;color:#555}.was{border-style:dashed;color:#777;font-weight:400;font-size:15px}.cta span{display:inline-block;background:#111;color:#fff;border-radius:99px;padding:6px 14px;margin:6px 6px 0 0;font-size:13px}ul{padding-left:18px;margin:6px 0}li{margin:5px 0}.row{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #eee;padding:8px 0}.row i{font-style:normal;color:#666;white-space:nowrap;font-size:13px}.wk{break-inside:avoid;margin:10px 0 16px}.wk b{font-size:16px}.foot{margin-top:40px;color:#666;font-size:12px;border-top:1px solid #ddd;padding-top:12px}@page{margin:14mm}@media print{body{padding:0}}';
      var html = '<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>' + e(r.business.name) + ' · 30-day marketing plan</title><style>' + css + '</style></head><body>' +
        '<div class="k">30-day marketing plan · ' + e(data.site.host) + ' · audit score ' + r.score + '/100</div><h1>' + e(r.business.name) + '</h1><p>' + e(pl.summary) + '</p>' +
        '<h2>Your headline, rewritten</h2><div class="hl was">Now: ' + e(pl.headline.current) + '</div>' +
        pl.headline.options.map(function(o){ var x = String(o).split(' / '); return '<div class="hl">' + e(x[0]) + (x[1] ? '<small>' + e(x.slice(1).join(' / ')) + '</small>' : '') + '</div>'; }).join('') +
        '<div class="cta">' + pl.headline.cta.map(function(c){ return '<span>' + e(c) + '</span>'; }).join('') + '</div>' +
        '<h2>What to fix first</h2><ul>' + r.fix_first.map(function(x){ return '<li><b>' + e(x.title) + '.</b> ' + e(x.how) + '</li>'; }).join('') + '</ul>' +
        '<h2>Quick wins, this week</h2>' + pl.quick_wins.map(function(q){ return '<div class="row"><div><b>' + e(q.title) + '</b><br>' + e(q.how) + '</div><i>' + e(q.time) + '</i></div>'; }).join('') +
        '<h2>Your 30 days</h2>' + pl.weeks.map(function(w){ return '<div class="wk"><div class="k">' + e(w.week) + '</div><b>' + e(w.goal) + '</b><ul>' + w.tasks.map(function(t){ return '<li>' + e(t) + '</li>'; }).join('') + '</ul></div>'; }).join('') +
        '<h2>Six pieces of content to make</h2><ul>' + pl.content.map(function(c){ return '<li><b>' + e(c.format) + ':</b> ' + e(c.idea) + '</li>'; }).join('') + '</ul>' +
        '<h2>What to measure</h2>' + pl.measure.map(function(m){ return '<div class="row"><b>' + e(m.metric) + '</b><i>' + e(m.target) + '</i></div>'; }).join('') +
        '<h2>Tools to use</h2><ul>' + pl.tools.map(function(t){ return '<li><b>' + e(t.name) + ':</b> ' + e(t['for']) + '</li>'; }).join('') + '</ul>' +
        '<div class="foot">Prepared by Jordan Smith · Want help doing it? Email ' + TO + '</div>' +
        '<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>';
      var w = window.open('', '_blank');
      if (w) { w.document.open(); w.document.write(html); w.document.close(); }
      else {
        var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], {type:'text/html'}));
        a.download = refFor(data.site.host) + '-plan.html'; document.body.appendChild(a); a.click(); a.remove();
      }
    });

    // back from Stripe: ?plan=paid&session_id=cs_...
    (function(){
      var q = new URLSearchParams(location.search), sid = q.get('session_id');
      if (q.get('plan') !== 'paid' || !sid) return;
      var saved = null; try { saved = JSON.parse(localStorage.getItem('au_audit') || 'null'); } catch(e){}
      history.replaceState(null, '', location.pathname + '#audit');
      if (!saved || !saved.report) { err.textContent = 'Payment received, thank you. Open this page on the device you paid on, or email ' + TO + ' and I’ll send your plan.'; return; }
      render(saved, false);
      var full = document.getElementById('auFull'); full.hidden = false;
      document.getElementById('afTitle').textContent = saved.report.business.name;
      document.getElementById('afBody').innerHTML = '<p class="af-sum af-load">Payment received. Writing your plan now, this takes about 30 seconds…</p>';
      document.getElementById('afPdf').disabled = true;
      setTimeout(function(){ window.smoothTo(full, {offset: -100, immediate: true}); }, 400);
      fetch('api/plan', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ session_id: sid, audit: saved }) })
        .then(function(r){ return r.json(); })
        .then(function(j){
          document.getElementById('afPdf').disabled = false;
          if (!j.plan) throw new Error(j.error || 'failed');
          renderFull(j.plan, false);
          try { localStorage.removeItem('au_audit'); } catch(e){}
          sendForm('plan-sale', { name: j.buyer.name || '', email: j.buyer.email || '', website: saved.site.host, score: String(saved.report.score),
            audit: 'Paid £250 for the plan.\n\nVerdict: ' + saved.report.verdict }).catch(function(){});
        })
        .catch(function(){
          document.getElementById('afBody').innerHTML = '<p class="af-sum">Your payment went through, but the plan didn’t finish writing. Refresh to try again, or email <a style="color:inherit" href="mailto:' + TO + '">' + TO + '</a> and I’ll send it over today.</p>';
          history.replaceState(null, '', location.pathname + '?plan=paid&session_id=' + encodeURIComponent(sid) + '#audit');
        });
    })();

    lead.addEventListener('submit', function(e){
      e.preventDefault();
      var n = document.getElementById('alName'), m = document.getElementById('alEmail'), msg = document.getElementById('alMsg').value.trim();
      var okN = !!n.value.trim(), okM = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim());
      n.classList.toggle('bad', !okN); m.classList.toggle('bad', !okM);
      if (!okN || !okM) { alErr.textContent = !okM ? 'Check your email address, it doesn’t look quite right.' : 'Add your name so I know who I’m talking to.'; (okN ? m : n).focus(); return; }
      alErr.textContent = '';
      var r = data.report, o = OFF[r.offer] || OFF.diag;
      var text = 'Site: ' + data.site.host + '\nBusiness: ' + r.business.name + '\nScore: ' + r.score + '/100\nVerdict: ' + r.verdict +
        '\n\nCosting them:\n' + r.weak.map(function(w){ return '- [' + w.impact + '] ' + w.title + ': ' + w.detail; }).join('\n') +
        '\n\nFix first:\n' + r.fix_first.map(function(x){ return '- ' + x.title + ': ' + x.how; }).join('\n') +
        (extras.speed ? '\n\nGoogle mobile speed: ' + extras.speed.score + '/100, page shows in ' + extras.speed.lcp_s + 's' : '') +
        (extras.market && extras.market.searched ? '\nSearch "' + extras.market.query + '": ' + (extras.market.position ? '#' + extras.market.position : 'not on page one') +
          '\nRivals: ' + (extras.market.rivals || []).map(function(x){ return x.name + ' (' + x.score + ')'; }).join(', ') : '') +
        '\n\nRecommended: ' + o.name + ' (' + o.price + ')' + (msg ? '\n\nTheir note: ' + msg : '');
      var btn = document.getElementById('alSend'); btn.disabled = true; btn.textContent = 'Sending…';
      function done(sent){
        btn.disabled = false; btn.textContent = 'Send it to Jordan';
        document.getElementById('auGate').classList.remove('locked');
        lead.hidden = true; document.getElementById('alDone').hidden = false;
        document.getElementById('alDoneH').textContent = sent ? 'Sent. Thanks, ' + n.value.trim().split(' ')[0] + '.' : 'Nearly there.';
        document.getElementById('alDoneP').textContent = sent ? 'Your audit is with me. I’ll reply within one working day with what I’d do first.' : 'Press the button to send it from your own email. Your audit is already filled in.';
        var fb = document.getElementById('alFallback'); fb.hidden = sent;
        if (!sent) document.getElementById('alMail').href = 'mailto:' + TO + '?subject=' + encodeURIComponent('Website audit: ' + data.site.host + ' (' + r.score + '/100)') + '&body=' + encodeURIComponent('Hi Jordan,\n\n' + text + '\n\n' + n.value.trim());
      }
      sendForm('audit-lead', { name:n.value.trim(), email:m.value.trim(), website:data.site.host, message:msg, score:String(r.score), recommended:o.name, audit:text })
        .then(function(){ done(true); }, function(){ done(false); });
    });
  })();

  /* ---------- copy ---------- */
  document.getElementById('copyBtn').addEventListener('click', function(){
    var t = document.getElementById('email').textContent, b = this;
    var done = function(){ b.textContent = 'Copied'; setTimeout(function(){ b.textContent = 'Copy email'; }, 1600); };
    var sel = function(){ var r = document.createRange(); r.selectNodeContents(document.getElementById('email')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(t).then(done, sel); } catch(e){ sel(); }
  });

  window.addEventListener('resize', measure);
  measure(); pos = target = workProgress()*(P.length-1); layoutCards(); updateLits();
  if (window.gsap) gsap.ticker.add(frame); else requestAnimationFrame(frame);
  var h = window.__OPEN || (location.hash||'').slice(1);
  for (var k=0;k<P.length;k++) if (P[k].id === h) { openCase(h); break; }
})();
