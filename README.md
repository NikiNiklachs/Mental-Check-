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

## Datenschutz-Hinweis zur Entwicklung

- Beim Testen mit Expo Go läuft der Code vom eigenen Computer aufs Handy. Es werden keine Daten von Athlet:innen verarbeitet.
- Das Expo-Werkzeug sendet anonyme Nutzungsstatistiken an Expo. Abschalten mit der Umgebungsvariable `EXPO_NO_TELEMETRY=1`.
