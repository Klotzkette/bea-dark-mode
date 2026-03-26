// beA Dark Mode — Content Script
// Rein grafische Übermalung per CSS.
// Fügt ein einziges <style>-Element in den <head> ein — sonst nichts.
// Kein DOM-Eingriff, keine Funktionsänderung, kein Zugriff auf Inhalte.

'use strict';

let darkStyleElement = null;
let darkCSSText = null;

// CSS aus der Extension laden (einmalig, gecacht)
async function loadDarkCSS() {
  if (darkCSSText) return darkCSSText;
  const url = chrome.runtime.getURL('css/bea-dark.css');
  const response = await fetch(url);
  darkCSSText = await response.text();
  return darkCSSText;
}

// Dark Mode aktivieren: ein <style>-Tag in <head> einfügen
async function enableDarkMode() {
  if (darkStyleElement) return;
  const css = await loadDarkCSS();
  darkStyleElement = document.createElement('style');
  darkStyleElement.id = 'bea-dark-mode';
  darkStyleElement.textContent = css;
  document.head.appendChild(darkStyleElement);
}

// Dark Mode deaktivieren: das <style>-Tag wieder entfernen
function disableDarkMode() {
  if (darkStyleElement) {
    darkStyleElement.remove();
    darkStyleElement = null;
  }
}

// Beim Seitenaufruf: gespeicherten Zustand wiederherstellen
chrome.storage.local.get(['beaDarkActive'], (data) => {
  if (data.beaDarkActive) {
    enableDarkMode();
  }
});

// Nachrichten vom Popup empfangen (An/Aus)
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
