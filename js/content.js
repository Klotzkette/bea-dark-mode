// beA Dark Mode — Content Script
// Injiziert/entfernt den Dark Mode CSS. Keine Funktionsänderungen.

let darkStyleElement = null;
let darkCSSText = null;

// CSS laden (einmalig)
async function loadDarkCSS() {
  if (darkCSSText) return darkCSSText;
  const url = chrome.runtime.getURL('css/bea-dark.css');
  const response = await fetch(url);
  darkCSSText = await response.text();
  return darkCSSText;
}

// Dark Mode aktivieren
async function enableDarkMode() {
  if (darkStyleElement) return;

  const css = await loadDarkCSS();

  darkStyleElement = document.createElement('style');
  darkStyleElement.id = 'bea-dark-mode';
  darkStyleElement.textContent = css;
  document.head.appendChild(darkStyleElement);

  showNotification('Dark Mode aktiviert');
}

// Dark Mode deaktivieren
function disableDarkMode() {
  if (darkStyleElement) {
    darkStyleElement.remove();
    darkStyleElement = null;
    showNotification('Dark Mode deaktiviert');
  }
}

// Auto-apply beim Laden falls aktiv
chrome.storage.local.get(['beaDarkActive'], (data) => {
  if (data.beaDarkActive) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      enableDarkMode();
    } else {
      window.addEventListener('DOMContentLoaded', () => enableDarkMode(), { once: true });
    }
  }
});

// Nachrichten vom Popup empfangen
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'enable') {
    enableDarkMode();
    sendResponse({ success: true });
  } else if (message.action === 'disable') {
    disableDarkMode();
    sendResponse({ success: true });
  }
  return true;
});

// Notification anzeigen
function showNotification(text) {
  const existing = document.getElementById('bea-dm-notification');
  if (existing) existing.remove();

  const n = document.createElement('div');
  n.id = 'bea-dm-notification';
  n.textContent = text;
  n.className = 'bea-dm-notification';
  document.body.appendChild(n);

  requestAnimationFrame(() => n.classList.add('bea-dm-notification-show'));
  setTimeout(() => {
    n.classList.add('bea-dm-notification-hide');
    setTimeout(() => n.remove(), 500);
  }, 2000);
}
