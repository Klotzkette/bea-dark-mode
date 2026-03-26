// beA Dark Mode — Background Service Worker
// Sorgt dafür, dass Dark Mode bei Tab-Navigation aktiv bleibt.
// Alle Rechte vorbehalten.

'use strict';

// Bei Tab-Update (Navigation): Content Script benachrichtigen
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status !== 'complete') return;
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) return;

  chrome.storage.local.get(['beaDarkActive'], function(data) {
    if (chrome.runtime.lastError) return;
    if (!data || !data.beaDarkActive) return;

    // Content Script ist via manifest injiziert — nur Nachricht senden
    chrome.tabs.sendMessage(tabId, { action: 'enable' }, function() {
      if (chrome.runtime.lastError) {
        // Content Script noch nicht bereit — das Script holt sich den State selbst via storage
      }
    });
  });
});

// Wenn Extension installiert/aktualisiert wird: State beibehalten
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.storage.local.set({ beaDarkActive: false });
  }
  // Bei Update: bestehenden State nicht überschreiben
});
