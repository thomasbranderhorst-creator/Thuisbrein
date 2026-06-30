(function () {
  /* ─── Instellingen ─────────────────────────────────────────────── */
  var WACHTWOORD = 'preview2025';   // ← verander dit naar jouw wachtwoord
  var STORAGE_KEY = 'tb_toegang';
  /* ──────────────────────────────────────────────────────────────── */

  // Al eerder toegang verleend? Niets doen.
  try { if (localStorage.getItem(STORAGE_KEY) === '1') return; } catch(e){}

  // Blokkeer scrollen op de achtergrond
  document.documentElement.style.overflow = 'hidden';

  var css = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

    #_tb-overlay {
      position: fixed; inset: 0; z-index: 999999;
      background: #1A2B3C;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 2rem;
      font-family: 'DM Sans', sans-serif;
      transition: opacity 0.4s ease;
    }
    #_tb-overlay._tb-fade { opacity: 0; pointer-events: none; }

    ._tb-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 3rem 2.5rem 2.5rem;
      max-width: 420px; width: 100%;
      text-align: center;
    }

    ._tb-logo {
      font-family: 'Fraunces', serif;
      font-size: 22px; font-weight: 300;
      color: #ffffff;
      letter-spacing: -0.3px;
      margin-bottom: 1.75rem;
      display: block;
    }
    ._tb-logo span { color: #639922; }

    ._tb-badge {
      display: inline-block;
      background: rgba(99,153,34,0.15);
      color: #97C459;
      font-size: 11px; font-weight: 500;
      letter-spacing: 0.8px; text-transform: uppercase;
      padding: 5px 14px; border-radius: 20px;
      margin-bottom: 1.5rem;
    }

    ._tb-title {
      font-family: 'Fraunces', serif;
      font-size: 32px; font-weight: 300;
      color: #ffffff; line-height: 1.2;
      letter-spacing: -1px;
      margin-bottom: 0.75rem;
    }
    ._tb-title em { font-style: italic; color: #97C459; }

    ._tb-sub {
      font-size: 14px; color: rgba(255,255,255,0.5);
      line-height: 1.65; margin-bottom: 2rem;
    }

    ._tb-form { display: flex; flex-direction: column; gap: 0.75rem; }

    ._tb-input {
      width: 100%; padding: 13px 16px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      color: #ffffff; font-size: 15px;
      font-family: 'DM Sans', sans-serif;
      outline: none; transition: border-color 0.2s;
      box-sizing: border-box;
    }
    ._tb-input::placeholder { color: rgba(255,255,255,0.3); }
    ._tb-input:focus { border-color: rgba(99,153,34,0.6); }

    ._tb-btn {
      width: 100%; padding: 13px;
      background: #639922; color: #ffffff;
      border: none; border-radius: 8px;
      font-size: 15px; font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer; transition: background 0.2s;
    }
    ._tb-btn:hover { background: #4f7a1b; }

    ._tb-error {
      font-size: 13px; color: #f87171;
      display: none; margin-top: 0.25rem;
    }

    ._tb-footer {
      margin-top: 2.5rem;
      font-size: 12px; color: rgba(255,255,255,0.2);
      text-align: center;
    }

    @media (max-width: 480px) {
      ._tb-card { padding: 2rem 1.5rem; }
      ._tb-title { font-size: 26px; }
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var overlay = document.createElement('div');
  overlay.id = '_tb-overlay';
  overlay.innerHTML = `
    <div class="_tb-card">
      <span class="_tb-logo"><b>Th</b>uis<span><b>Br</b>ein</span></span>
      <div class="_tb-badge">Binnenkort beschikbaar</div>
      <div class="_tb-title">We zijn bijna klaar.<br><em>Heel bijna.</em></div>
      <p class="_tb-sub">ThuisBrein is in de maak. Heb je een toegangscode ontvangen? Vul 'm hieronder in.</p>
      <form class="_tb-form" id="_tb-form">
        <input
          class="_tb-input" id="_tb-input"
          type="password"
          placeholder="Toegangscode"
          autocomplete="off"
        >
        <div class="_tb-error" id="_tb-error">Onjuiste code — probeer het opnieuw.</div>
        <button type="submit" class="_tb-btn">Toegang krijgen</button>
      </form>
    </div>
    <div class="_tb-footer">thuisbrein.nl &nbsp;·&nbsp; Oss, midden en zuidoost Nederland</div>
  `;

  // Wacht tot DOM klaar is
  function mount() {
    document.body.appendChild(overlay);

    document.getElementById('_tb-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var val = document.getElementById('_tb-input').value.trim();
      if (val === WACHTWOORD) {
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch(e){}
        overlay.classList.add('_tb-fade');
        document.documentElement.style.overflow = '';
        setTimeout(function () { overlay.remove(); styleEl.remove(); }, 450);
      } else {
        var err = document.getElementById('_tb-error');
        err.style.display = 'block';
        document.getElementById('_tb-input').value = '';
        document.getElementById('_tb-input').focus();
        setTimeout(function () { err.style.display = 'none'; }, 3000);
      }
    });
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();
