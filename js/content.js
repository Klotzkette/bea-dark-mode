// beA Dark Mode — Content Script
// Rein grafische Übermalung per CSS-Injection.
// Fügt genau ein <style>-Element in <head> ein — sonst nichts.
// Kein Zugriff auf Seiteninhalte, kein DOM-Eingriff, keine Funktionsänderung.
// Alle Rechte vorbehalten.

'use strict';

(function() {

  let styleEl = null;
  let cssCache = null;
  let isApplying = false;

  // CSS aus der Extension laden — einmalig, dann gecacht
  function loadCSS() {
    if (cssCache) return Promise.resolve(cssCache);
    return new Promise(function(resolve) {
      try {
        var url = chrome.runtime.getURL('css/bea-dark.css');
        fetch(url)
          .then(function(r) { return r.text(); })
          .then(function(text) { cssCache = text; resolve(text); })
          .catch(function() { resolve(null); });
      } catch (e) {
        resolve(null);
      }
    });
  }

  // Dark Mode einschalten
  function enable() {
    if (isApplying || styleEl) return;
    isApplying = true;
    loadCSS().then(function(css) {
      isApplying = false;
      if (!css || styleEl) return;
      try {
        var el = document.createElement('style');
        el.id = 'bea-dark-mode';
        el.setAttribute('data-bea-dm', '1');
        el.textContent = css;
        var target = document.head || document.documentElement;
        target.appendChild(el);
        styleEl = el;
      } catch (e) { /* still fail silently */ }
    });
  }

  // Dark Mode ausschalten
  function disable() {
    if (styleEl) {
      try { styleEl.remove(); } catch (e) { /* noop */ }
      styleEl = null;
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
