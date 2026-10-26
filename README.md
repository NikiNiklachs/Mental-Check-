# Mental Check

Mentale Trainings-App für Athlet:innen im Leistungssport. Gebaut mit React Native, Expo und TypeScript, für iOS und Android.

## App auf dem eigenen Handy testen

Einmalig vorbereiten:

1. Auf dem Computer **Node.js** installieren (Version 20 oder neuer, „LTS“): https://nodejs.org
2. Auf dem Handy die App **Expo Go** installieren (App Store oder Google Play).
3. Dieses Repository auf den Computer holen und im Projektordner einmal ausführen:

   ```bash
   npm install
   ```

App starten:

1. Im Projektordner ausführen:

   ```bash
   npx expo start
   ```

2. Im Terminal erscheint ein QR-Code.
   - **iPhone:** QR-Code mit der normalen Kamera-App scannen.
   - **Android:** Expo Go öffnen und dort „Scan QR code“ wählen.
3. Die App öffnet sich in Expo Go und zeigt den Startbildschirm „Mental Check“.

Handy und Computer müssen im selben WLAN sein. Klappt das nicht (z. B. im Vereins- oder Uni-WLAN), stattdessen `npx expo start --tunnel` verwenden.

Änderungen am Code erscheinen nach dem Speichern automatisch auf dem Handy. Beenden mit `Strg + C` im Terminal.

## Testen ohne Computer (Expo Snack, z. B. auf dem iPad)

1. Auf https://snack.expo.dev ein neues Snack öffnen.
2. Die Datei `App.js` in `App.tsx` umbenennen (links in der Dateiliste, Datei gedrückt halten oder Drei-Punkte-Menü, „Rename“). Ohne die Endung `.tsx` versteht Snack den TypeScript-Code nicht und meldet z. B. „Missing initializer in const declaration“.
3. Den gesamten Inhalt von `App.tsx` durch die Snack-Version ersetzen (eine einzige Datei mit allen Bildschirmen).
4. Snack meldet, dass `expo-secure-store` fehlt: auf „Add dependency“ tippen.
5. Rechts „iOS“ oder „Android“ wählen oder den QR-Code mit Expo Go öffnen.

In der Web-Vorschau gibt es keinen sicheren Speicher. Die App zeigt dann „Testmodus“ und vergisst die Eingaben beim Neuladen. Mit Expo Go auf dem Gerät wird verschlüsselt gespeichert.

## Datenschutz-Hinweis zur Entwicklung

- Beim Testen mit Expo Go läuft der Code vom eigenen Computer aufs Handy. Es werden keine Daten von Athlet:innen verarbeitet.
- Das Expo-Werkzeug sendet anonyme Nutzungsstatistiken an Expo. Abschalten mit der Umgebungsvariable `EXPO_NO_TELEMETRY=1`.
