// beA Dark Mode — Popup v2.0
// Alle Rechte vorbehalten.

'use strict';

(function() {

  var toggle   = document.getElementById('mainToggle');
  var statusEl = document.getElementById('status');
  var siteInfo = document.getElementById('siteInfo');

  if (!toggle || !statusEl) return;

  // ─── UI aktualisieren ────────────────────────────────────
  function updateUI(isOn) {
    statusEl.textContent = isOn ? 'Aktiv' : 'Aus';
    if (isOn) { statusEl.classList.add('active'); }
    else      { statusEl.classList.remove('active'); }
  }

  // ─── Toggle Handler ──────────────────────────────────────
  toggle.addEventListener('change', function() {
    var isOn = toggle.checked;
    updateUI(isOn);

    try {
      chrome.storage.local.set({ beaDarkActive: isOn });

      // Nachricht an aktiven Tab senden
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (chrome.runtime.lastError || !tabs || !tabs[0]) return;
        var action = isOn ? 'enable' : 'disable';
        chrome.tabs.sendMessage(tabs[0].id, { action: action }, function() {
          if (chrome.runtime.lastError) { /* Content Script nicht geladen — ok */ }
        });
      });
    } catch (e) { /* noop */ }
  });

  // ─── Zustand wiederherstellen ────────────────────────────
  try {
    chrome.storage.local.get(['beaDarkActive'], function(data) {
      if (chrome.runtime.lastError) return;
      if (data && data.beaDarkActive) {
        toggle.checked = true;
        updateUI(true);
      }
    });
  } catch (e) { /* noop */ }

  // ─── Site-Info anzeigen (beA oder generisch?) ────────────
  if (siteInfo) {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (chrome.runtime.lastError || !tabs || !tabs[0]) return;

        // Ping an Content Script für Site-Info
        chrome.tabs.sendMessage(tabs[0].id, { action: 'ping' }, function(response) {
          if (chrome.runtime.lastError || !response) {
            siteInfo.textContent = '';
            return;
          }
          if (response.isBeA) {
            siteInfo.textContent = 'beA erkannt — optimierter Modus';
            siteInfo.classList.add('bea');
          } else {
            siteInfo.textContent = 'Generischer Dark Mode';
          }
        });
      });
    } catch (e) { /* noop */ }
  }

})();
