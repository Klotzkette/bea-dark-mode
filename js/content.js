// beA Dark Mode — Content Script
// Rein grafische Übermalung per CSS-Injection.
// Fügt genau ein <link>-Element ein — sonst nichts.
// Kein Zugriff auf Seiteninhalte, kein DOM-Eingriff, keine Funktionsänderung.
// Alle Rechte vorbehalten.

'use strict';

(function() {

  var linkEl = null;
  var cssURL = null;

  // CSS-URL einmalig ermitteln
  try {
    cssURL = chrome.runtime.getURL('css/bea-dark.css');
  } catch (e) { /* Extension context invalidated */ }

  // Dark Mode einschalten — synchron, kein fetch, kein Promise
  function enable() {
    if (linkEl || !cssURL) return;
    try {
      var el = document.createElement('link');
      el.id = 'bea-dark-mode';
      el.rel = 'stylesheet';
      el.type = 'text/css';
      el.href = cssURL;
      el.setAttribute('data-bea-dm', '1');
      var target = document.head || document.documentElement;
      target.appendChild(el);
      linkEl = el;
    } catch (e) { /* still fail silently */ }
  }

  // Dark Mode ausschalten
  function disable() {
    if (linkEl) {
      try { linkEl.remove(); } catch (e) { /* noop */ }
      linkEl = null;
    }
    // Sicherheitsnetz: falls das Element noch im DOM hängt
    try {
      var orphan = document.getElementById('bea-dark-mode');
      if (orphan) orphan.remove();
    } catch (e) { /* noop */ }
  }

  // Zustand beim Laden wiederherstellen
  try {
    chrome.storage.local.get(['beaDarkActive'], function(data) {
      if (chrome.runtime.lastError) return;
      if (data && data.beaDarkActive) enable();
    });
  } catch (e) { /* Extension context invalidated — ignore */ }

  // Nachrichten vom Popup
  try {
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
      try {
        if (msg && msg.action === 'enable') {
          enable();
          sendResponse({ ok: true });
        } else if (msg && msg.action === 'disable') {
          disable();
          sendResponse({ ok: true });
        }
      } catch (e) {
        sendResponse({ ok: false });
      }
      return true;
    });
  } catch (e) { /* Extension context invalidated — ignore */ }

})();
