// beA Dark Mode — Background Service Worker v2.1
// Klick aufs Icon = Toggle. Kein Popup nötig.
// Alle Rechte vorbehalten.

'use strict';

var STORE_KEY = 'beaDarkActive';

// ─── Badge aktualisieren ───────────────────────────────────
function updateBadge(isOn) {
  chrome.action.setBadgeText({ text: isOn ? 'AN' : '' });
  chrome.action.setBadgeBackgroundColor({ color: isOn ? '#5a8a9e' : '#333' });
}

// ─── Icon-Klick = Toggle ──────────────────────────────────
chrome.action.onClicked.addListener(function(tab) {
  chrome.storage.local.get([STORE_KEY], function(data) {
    if (chrome.runtime.lastError) return;
    var wasOn = !!(data && data[STORE_KEY]);
    var isOn  = !wasOn;

    chrome.storage.local.set({ beaDarkActive: isOn });
    updateBadge(isOn);

    // Nachricht an aktiven Tab
    if (tab && tab.id) {
      var action = isOn ? 'enable' : 'disable';
      chrome.tabs.sendMessage(tab.id, { action: action }, function() {
        if (chrome.runtime.lastError) { /* Content Script nicht geladen */ }
      });
    }
  });
});

// ─── Tab-Navigation: Dark Mode beibehalten ─────────────────
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status !== 'complete') return;
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) return;

  chrome.storage.local.get([STORE_KEY], function(data) {
    if (chrome.runtime.lastError) return;
    if (!data || !data[STORE_KEY]) return;

    chrome.tabs.sendMessage(tabId, { action: 'enable' }, function() {
      if (chrome.runtime.lastError) { /* Content Script noch nicht bereit */ }
    });
  });
});

// ─── Bei Start: Badge-Status wiederherstellen ──────────────
chrome.storage.local.get([STORE_KEY], function(data) {
  if (chrome.runtime.lastError) return;
  updateBadge(!!(data && data[STORE_KEY]));
});

// ─── Installation: Default-State setzen ────────────────────
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.storage.local.set({ beaDarkActive: false });
    updateBadge(false);
  }
});
