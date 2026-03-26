// beA Dark Mode — Content Script v2.0
// Erkennt beA automatisch, funktioniert auf allen Webseiten.
// Fügt genau ein <link>-Element ein — sonst nichts.
// Kein Zugriff auf Seiteninhalte, kein DOM-Eingriff, keine Funktionsänderung.
// Alle Rechte vorbehalten.

'use strict';

(function() {

  // ─── Konstanten ──────────────────────────────────────────
  var LINK_ID   = 'bea-dark-mode';
  var STORE_KEY = 'beaDarkActive';
  var BEA_HOSTS = ['bea-brak.de', 'www.bea-brak.de'];

  // ─── State ───────────────────────────────────────────────
  var linkEl  = null;
  var beaCSS  = null;
  var genCSS  = null;
  var isBeA   = false;

  // ─── beA-Erkennung ───────────────────────────────────────
  try {
    var host = location.hostname || '';
    for (var i = 0; i < BEA_HOSTS.length; i++) {
      if (host === BEA_HOSTS[i] || host.indexOf('.' + BEA_HOSTS[i]) !== -1) {
        isBeA = true;
        break;
      }
    }
  } catch (e) { /* about:blank etc. */ }

  // ─── CSS-URLs einmalig ermitteln ─────────────────────────
  try {
    beaCSS = chrome.runtime.getURL('css/bea-dark.css');
    genCSS = chrome.runtime.getURL('css/generic-dark.css');
  } catch (e) { /* Extension context invalidated */ }

  // ─── Hilfsfunktion: Ziel-Node für Injection ──────────────
  function getTarget() {
    return document.head || document.documentElement || document;
  }

  // ─── Enable: Dark Mode einschalten ───────────────────────
  function enable() {
    // Guard: kein Doppel-Inject
    if (linkEl) return;
    try {
      var existing = document.getElementById(LINK_ID);
      if (existing) { linkEl = existing; return; }
    } catch (e) { /* noop */ }

    var url = isBeA ? beaCSS : genCSS;
    if (!url) return;

    try {
      var el = document.createElement('link');
      el.id   = LINK_ID;
      el.rel  = 'stylesheet';
      el.type = 'text/css';
      el.href = url;
      el.setAttribute('data-bea-dm', '1');
      getTarget().appendChild(el);
      linkEl = el;
    } catch (e) { /* fail silently */ }
  }

  // ─── Disable: Dark Mode ausschalten ──────────────────────
  function disable() {
    if (linkEl) {
      try { linkEl.remove(); } catch (e) { /* noop */ }
      linkEl = null;
    }
    // Sicherheitsnetz
    try {
      var orphan = document.getElementById(LINK_ID);
      if (orphan) orphan.remove();
    } catch (e) { /* noop */ }
  }

  // ─── Zustand wiederherstellen (bei jedem Seitenaufruf) ───
  try {
    chrome.storage.local.get([STORE_KEY], function(data) {
      if (chrome.runtime.lastError) return;
      if (data && data[STORE_KEY]) enable();
    });
  } catch (e) { /* Extension context invalidated */ }

  // ─── Nachrichten vom Popup / Background ──────────────────
  try {
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
      try {
        if (!msg) return;
        if (msg.action === 'enable') {
          enable();
          sendResponse({ ok: true });
        } else if (msg.action === 'disable') {
          disable();
          sendResponse({ ok: true });
        } else if (msg.action === 'ping') {
          sendResponse({ ok: true, active: !!linkEl, isBeA: isBeA });
        }
      } catch (e) {
        try { sendResponse({ ok: false }); } catch (e2) { /* noop */ }
      }
      return true;
    });
  } catch (e) { /* Extension context invalidated */ }

})();
