// beA Dark Mode — Popup: An/Aus Toggle

const toggle = document.getElementById('mainToggle');
const status = document.getElementById('status');

toggle.addEventListener('change', async () => {
  const isOn = toggle.checked;

  if (isOn) {
    status.textContent = 'Aktiv';
    status.classList.add('active');
    chrome.storage.local.set({ beaDarkActive: true });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'enable' });
  } else {
    status.textContent = 'Aus';
    status.classList.remove('active');
    chrome.storage.local.set({ beaDarkActive: false });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'disable' });
  }
});

// Zustand wiederherstellen beim Öffnen
chrome.storage.local.get(['beaDarkActive'], (data) => {
  if (data.beaDarkActive) {
    toggle.checked = true;
    status.textContent = 'Aktiv';
    status.classList.add('active');
  }
});
