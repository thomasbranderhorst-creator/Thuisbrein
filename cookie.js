(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     ThuisBrein — cookiemelding

     Op dit moment gebruikt thuisbrein.nl GEEN tracking-, analytics- of
     advertentiecookies. Er is dus geen toestemming vereist; deze balk is
     puur informatief en verdwijnt zodra hij is weggeklikt.

     ► Ga je later wél meten (bijv. Google Analytics), zet dan hieronder
       TOESTEMMING_VEREIST op true. De balk verandert dan in een echte
       keuze met een gelijkwaardige weiger-knop, zoals de wet vereist.
       Laad je meetscript pas ná een 'accepteer'-keuze — zie de functie
       activeerStatistieken() onderaan dit bestand.
     ───────────────────────────────────────────────────────────────── */

  var TOESTEMMING_VEREIST = false;
  var OPSLAG_SLEUTEL      = 'tb_cookie_v1';
  var PRIVACY_URL         = '/privacy.html';

  /* Al eerder weggeklikt of een keuze gemaakt? Dan niets tonen. */
  var eerdereKeuze = null;
  try { eerdereKeuze = localStorage.getItem(OPSLAG_SLEUTEL); } catch (e) {}

  if (eerdereKeuze) {
    if (eerdereKeuze === 'alles') activeerStatistieken();
    return;
  }

  /* ─── Opmaak ─────────────────────────────────────────────────────── */

  var css = ''
    + '#tb-cookie{'
    +   'position:fixed;z-index:9998;left:1rem;right:1rem;bottom:1rem;'
    +   'max-width:520px;margin-left:auto;'
    +   'background:#FFFFFF;color:#1A2B3C;'
    +   'border:1px solid rgba(26,43,60,0.12);border-radius:14px;'
    +   'box-shadow:0 8px 30px rgba(26,43,60,0.14);'
    +   'padding:1.15rem 1.25rem;'
    +   "font-family:'DM Sans',system-ui,-apple-system,sans-serif;"
    +   'opacity:0;transform:translateY(12px);'
    +   'transition:opacity .35s ease,transform .35s ease;'
    + '}'
    + '#tb-cookie.tb-in{opacity:1;transform:translateY(0)}'
    + '#tb-cookie.tb-uit{opacity:0;transform:translateY(12px);pointer-events:none}'
    + '#tb-cookie p{margin:0 0 .9rem;font-size:.875rem;line-height:1.55;color:#1A2B3C}'
    + '#tb-cookie a{color:#3B6D11;text-decoration:underline;text-underline-offset:2px}'
    + '#tb-cookie .tb-knoppen{display:flex;gap:.5rem;flex-wrap:wrap}'
    + '#tb-cookie button{'
    +   'font:inherit;font-size:.83rem;font-weight:500;'
    +   'padding:.5rem 1.1rem;border-radius:8px;cursor:pointer;'
    +   'border:1px solid transparent;transition:background .2s ease,border-color .2s ease;'
    + '}'
    + '#tb-cookie .tb-primair{background:#3B6D11;color:#fff}'
    + '#tb-cookie .tb-primair:hover{background:#639922}'
    + '#tb-cookie .tb-secundair{background:transparent;color:#1A2B3C;border-color:rgba(26,43,60,0.2)}'
    + '#tb-cookie .tb-secundair:hover{background:#F5F0E8}'
    + '#tb-cookie button:focus-visible{outline:2px solid #3B6D11;outline-offset:2px}'
    + '@media (prefers-reduced-motion:reduce){'
    +   '#tb-cookie{transition:none;opacity:1;transform:none}'
    + '}';

  var stijl = document.createElement('style');
  stijl.appendChild(document.createTextNode(css));
  document.head.appendChild(stijl);

  /* ─── Inhoud ─────────────────────────────────────────────────────── */

  var balk = document.createElement('div');
  balk.id = 'tb-cookie';
  balk.setAttribute('role', 'dialog');
  balk.setAttribute('aria-live', 'polite');
  balk.setAttribute('aria-label', 'Cookiemelding');

  if (TOESTEMMING_VEREIST) {
    balk.innerHTML =
      '<p><strong>Cookies</strong><br>' +
      'ThuisBrein gebruikt cookies die nodig zijn om de site te laten werken. ' +
      'Daarnaast wil ik graag anoniem meten welke pagina’s worden gelezen. ' +
      'Dat mag alleen met jouw toestemming. ' +
      '<a href="' + PRIVACY_URL + '">Lees de privacyverklaring</a>.</p>' +
      '<div class="tb-knoppen">' +
        '<button type="button" class="tb-primair"   data-keuze="alles">Accepteren</button>' +
        '<button type="button" class="tb-secundair" data-keuze="minimaal">Alleen noodzakelijk</button>' +
      '</div>';
  } else {
    balk.innerHTML =
      '<p><strong>Geen tracking op deze site</strong><br>' +
      'thuisbrein.nl gebruikt geen tracking- of advertentiecookies. ' +
      'Bezoekersaantallen worden anoniem geteld, zonder cookies en zonder je te volgen. ' +
      '<a href="' + PRIVACY_URL + '">Lees de privacyverklaring</a>.</p>' +
      '<div class="tb-knoppen">' +
        '<button type="button" class="tb-primair" data-keuze="gezien">Begrepen</button>' +
      '</div>';
  }

  /* ─── Gedrag ─────────────────────────────────────────────────────── */

  function toon() {
    document.body.appendChild(balk);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { balk.classList.add('tb-in'); });
    });
  }

  function sluit(keuze) {
    try { localStorage.setItem(OPSLAG_SLEUTEL, keuze); } catch (e) {}
    if (keuze === 'alles') activeerStatistieken();
    balk.classList.add('tb-uit');
    setTimeout(function () {
      if (balk.parentNode) balk.parentNode.removeChild(balk);
    }, 400);
  }

  balk.addEventListener('click', function (e) {
    var knop = e.target.closest('button[data-keuze]');
    if (knop) sluit(knop.getAttribute('data-keuze'));
  });

  /* ─── Statistieken ───────────────────────────────────────────────── */
  /* Zet hier je meetscript neer zodra je gaat meten. Deze functie wordt
     alleen aangeroepen na een expliciete 'accepteren'-keuze.

     Voorbeeld Google Analytics 4:
       var s = document.createElement('script');
       s.async = true;
       s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
       document.head.appendChild(s);
       window.dataLayer = window.dataLayer || [];
       function gtag(){ dataLayer.push(arguments); }
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXX');

     Gebruik je cookieloze statistieken (Plausible, Simple Analytics,
     Cloudflare Web Analytics)? Die hoeven hier NIET in — die mag je
     gewoon in de <head> van je pagina's zetten, want ze zetten geen
     cookies en vereisen geen toestemming.                              */

  function activeerStatistieken() {
    /* nog niets ingesteld */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', toon);
  } else {
    toon();
  }
})();
