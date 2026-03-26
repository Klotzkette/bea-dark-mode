// beA Dark Mode — Content Script v2.2
// Nur für bea-brak.de. Fügt ein <link>-Element ein — sonst nichts.
// Alle Rechte vorbehalten.

'use strict';

(function() {

  var LINK_ID   = 'bea-dark-mode';
  var STORE_KEY = 'beaDarkActive';
  var linkEl    = null;
  var cssURL    = null;

  try { cssURL = chrome.runtime.getURL('css/bea-dark.css'); }
  catch (e) { return; }

  function enable() {
    if (linkEl || !cssURL) return;
    try {
      if (document.getElementById(LINK_ID)) return;
      var el  = document.createElement('link');
      el.id   = LINK_ID;
      el.rel  = 'stylesheet';
      el.type = 'text/css';
      el.href = cssURL;
      (document.head || document.documentElement).appendChild(el);
      linkEl = el;
    } catch (e) { /* noop */ }
  }

  function disable() {
    if (linkEl) { try { linkEl.remove(); } catch (e) {} linkEl = null; }
    try { var o = document.getElementById(LINK_ID); if (o) o.remove(); }
    catch (e) { /* noop */ }
  }

  try {
    chrome.storage.local.get([STORE_KEY], function(d) {
      if (!chrome.runtime.lastError && d && d[STORE_KEY]) enable();
    });
  } catch (e) {}

  try {
    chrome.runtime.onMessage.addListener(function(msg, s, respond) {
      try {
        if (msg.action === 'enable')  { enable();  respond({ ok: true }); }
        if (msg.action === 'disable') { disable(); respond({ ok: true }); }
      } catch (e) { try { respond({ ok: false }); } catch (e2) {} }
      return true;
    });
  } catch (e) {}

})();
