// beA Dark Mode — Popup
// Alle Rechte vorbehalten.

'use strict';

(function() {

  var toggle = document.getElementById('mainToggle');
  var statusEl = document.getElementById('status');

  if (!toggle || !statusEl) return;

  toggle.addEventListener('change', function() {
    var isOn = toggle.checked;

    statusEl.textContent = isOn ? 'Aktiv' : 'Aus';
    if (isOn) { statusEl.classList.add('active'); }
    else      { statusEl.classList.remove('active'); }

    try {
      chrome.storage.local.set({ beaDarkActive: isOn });
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (chrome.runtime.lastError || !tabs || !tabs[0]) return;
        chrome.tabs.sendMessage(tabs[0].id, { action: isOn ? 'enable' : 'disable' }, function() {
          if (chrome.runtime.lastError) { /* Tab hat kein Content Script — ok */ }
        });
      });
    } catch (e) { /* noop */ }
  });

  // Zustand wiederherstellen
  try {
    chrome.storage.local.get(['beaDarkActive'], function(data) {
      if (chrome.runtime.lastError) return;
      if (data && data.beaDarkActive) {
        toggle.checked = true;
        statusEl.textContent = 'Aktiv';
        statusEl.classList.add('active');
      }
    });
  } catch (e) { /* noop */ }

})();
