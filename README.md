# beA Dark Mode

Eleganter Dark Mode für das besondere elektronische Anwaltspostfach (beA) der BRAK.

Ein Klick — Dark Mode an. Noch ein Klick — Dark Mode aus. Fertig.

---

## Was macht die Extension?

- Verwandelt die beA-Oberfläche in einen augenfreundlichen Dark Mode
- Tiefes Schwarz, silbrige Texte, elegante Kontraste
- Rein kosmetisch — ändert keine Funktionalität
- 100% lokal, kein API-Key, keine Datenübertragung

## Installation (Entwicklermodus)

1. **Download**: [Neueste Version herunterladen](../../releases/latest) (.zip) und entpacken — oder das Repository klonen
2. **Chrome öffnen**: `chrome://extensions` in die Adressleiste eingeben
3. **Entwicklermodus**: Oben rechts den Schalter **"Entwicklermodus"** aktivieren
4. **Laden**: Auf **"Entpackte Erweiterung laden"** klicken
5. **Ordner wählen**: Den entpackten `bea-dark-mode`-Ordner auswählen (der Ordner, in dem die `manifest.json` liegt)
6. **Fertig**: Die Extension erscheint in der Chrome-Toolbar

## Benutzung

1. Öffne das beA unter [bea-brak.de](https://www.bea-brak.de)
2. Klicke auf das beA Dark Mode Icon in der Chrome-Toolbar
3. Toggle auf **"An"** — Dark Mode ist aktiv
4. Toggle auf **"Aus"** — alles wie vorher

Der Zustand bleibt gespeichert. Beim nächsten Besuch von beA-brak.de wird der Dark Mode automatisch angewendet.

---

## Technik

- Chrome Extension (Manifest V3)
- Kein API-Key, läuft komplett lokal
- Injiziert rein CSS-basierte Styles — kein JavaScript-DOM-Manipulation
- Funktioniert mit dem Svelte-Portal, der Keycloak-Anmeldung und der PrimeFaces-Anwendung

## Lizenz

MIT
