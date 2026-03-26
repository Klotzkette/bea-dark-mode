// beA Dark Mode — Background Service Worker v2.2
// Klick aufs Icon = Toggle. Nur für beA.
// Alle Rechte vorbehalten.

'use strict';

var KEY = 'beaDarkActive';

function badge(on) {
  chrome.action.setBadgeText({ text: on ? 'AN' : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#5a8a9e' });
}

chrome.action.onClicked.addListener(function(tab) {
  chrome.storage.local.get([KEY], function(d) {
    if (chrome.runtime.lastError) return;
    var on = !(d && d[KEY]);
    chrome.storage.local.set({ beaDarkActive: on });
    badge(on);
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: on ? 'enable' : 'disable' }, function() {
        if (chrome.runtime.lastError) {}
      });
    }
  });
});

chrome.tabs.onUpdated.addListener(function(id, info, tab) {
  if (info.status !== 'complete') return;
  if (!tab.url || !tab.url.includes('bea-brak.de')) return;
  chrome.storage.local.get([KEY], function(d) {
    if (chrome.runtime.lastError || !d || !d[KEY]) return;
    chrome.tabs.sendMessage(id, { action: 'enable' }, function() {
      if (chrome.runtime.lastError) {}
    });
  });
});

chrome.storage.local.get([KEY], function(d) {
  if (!chrome.runtime.lastError) badge(!!(d && d[KEY]));
});

chrome.runtime.onInstalled.addListener(function(e) {
  if (e.reason === 'install') {
    chrome.storage.local.set({ beaDarkActive: false });
    badge(false);
  }
});
