/* ThuisBrein motion.js — subtiele beweging sitebreed.
   Progressive enhancement: zonder JS blijft alles gewoon zichtbaar.
   Respecteert prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    /* Kaart-hover: subtiel omhoog, alleen op hover-apparaten */
    '@media (hover:hover){',
    '.kaart,.systeem-card,.compat-card,.pakket-card,.resultaat-kaart,.casus-kaart,.airco-kaart,.check-kaart,.filosofie-item,.technisch-item,.card,.cert-blok,.faq-item{transition:transform .25s ease, box-shadow .25s ease;}',
    '.kaart:hover,.systeem-card:hover,.compat-card:hover,.pakket-card:hover,.resultaat-kaart:hover,.casus-kaart:hover,.airco-kaart:hover,.check-kaart:hover,.filosofie-item:hover,.technisch-item:hover,.card:hover,.cert-blok:hover{transform:translateY(-4px);box-shadow:0 10px 24px rgba(26,43,60,.10);}',
    '}',
    /* FAQ: soepel openklappen (overschrijft display:none/block); JS meet de echte hoogte */
    '.faq-antwoord{display:block!important;max-height:0;overflow:hidden;opacity:0;padding-bottom:0;transition:max-height .35s ease,opacity .3s ease,padding-bottom .35s ease;}',
    '.faq-antwoord.open{max-height:600px;opacity:1;padding-bottom:1.25rem;}',
    /* Bewegend spul alleen als de bezoeker geen reduced motion heeft */
    '@media (prefers-reduced-motion: no-preference){',
    '.tb-reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease;}',
    '.tb-reveal.tb-in{opacity:1;transform:none;}',
    '@keyframes tbPulse{0%,70%,100%{box-shadow:0 4px 12px rgba(37,211,102,.4);}35%{box-shadow:0 4px 12px rgba(37,211,102,.4),0 0 0 14px rgba(37,211,102,0);}}',
    '.whatsapp-float{animation:tbPulse 4s ease-in-out infinite;}',
    '}',
    '@media (prefers-reduced-motion: reduce){.faq-antwoord{transition:none;}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* FAQ: na elke klik de echte hoogte zetten, zodat openen én sluiten
     vloeiend animeren, ongeacht de lengte van het antwoord */
  function syncFaq() {
    document.querySelectorAll('.faq-antwoord').forEach(function (a) {
      a.style.maxHeight = a.classList.contains('open') ? (a.scrollHeight + 24) + 'px' : '0px';
    });
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.faq-vraag')) {
      requestAnimationFrame(syncFaq);
    }
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq-antwoord.open').forEach(function (a) {
      a.style.maxHeight = (a.scrollHeight + 24) + 'px';
    });
  });

  if (reduce || !('IntersectionObserver' in window)) return;

  /* Scroll-reveals: koppen, intro's en kaarten faden in met lichte stagger */
  var selector = [
    'h1', 'h2', '.intro', '.hero-sub', '.page-header p',
    '.kaart', '.systeem-card', '.compat-card', '.pakket-card',
    '.resultaat-kaart', '.casus-kaart', '.airco-kaart', '.check-kaart',
    '.filosofie-item', '.technisch-item', '.card', '.cert-blok',
    '.stap', '.faq-item', '.combi-blok'
  ].join(',');

  var els = Array.prototype.slice.call(document.querySelectorAll(selector));
  if (!els.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('tb-in');
        io.unobserve(entry.target);
        /* na de reveal de stagger-vertraging weghalen, anders reageert hover traag */
        setTimeout(function () { entry.target.style.transitionDelay = ''; }, 900);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  els.forEach(function (el) {
    /* stagger: broertjes binnen dezelfde ouder krijgen oplopende vertraging */
    var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [el];
    var idx = siblings.indexOf(el);
    el.style.transitionDelay = ((idx % 6) * 70) + 'ms';
    el.classList.add('tb-reveal');
    io.observe(el);
  });
})();
