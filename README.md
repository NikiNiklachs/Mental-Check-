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

## Ohne Computer testen (iPad oder Handy)

Bei jedem Push veröffentlicht GitHub den aktuellen Stand automatisch per **EAS Update** (Datei `.github/workflows/eas-update.yml`). Der Stand lässt sich dann in **Expo Go** öffnen. Kein Kopieren, kein Snack.

Einmalig einrichten (alles in Safari):

1. **Expo-Konto anlegen:** https://expo.dev/signup (kostenlos).
2. **Token erstellen:** Auf expo.dev oben rechts aufs Profilbild → „Account settings“ → „Access tokens“ → „Create token“. Name z. B. `github`. Den angezeigten Token kopieren. Er wird nur einmal angezeigt. Nicht weitergeben, auch nicht im Chat mit Claude.
3. **Token bei GitHub eintragen:** Im Repository auf „Settings“ → „Secrets and variables“ → „Actions“ → „New repository secret“. Name: `EXPO_TOKEN`, bei „Secret“ den Token einfügen, speichern. Fehlt „Settings“, in Safari über das „aA“-Menü „Desktop-Website anfordern“ wählen.
4. **Expo Go installieren** (App Store) und dort mit demselben Expo-Konto anmelden.

Danach bei jedem neuen Stand:

1. Nach einem Push zwei bis vier Minuten warten. Ob es fertig ist, zeigt im Repository der Reiter „Actions“ (grüner Haken).
2. Expo Go öffnen. Unter den Projekten „mental-check“ wählen, dann den Branch (z. B. `Mental-App`) und das neueste Update antippen.

Grenzen:

- Nur das eigene Expo-Konto kann die Stände in Expo Go öffnen. Für Tests durch andere braucht es später einen eigenen Build.
- Expo Go kann nur Pakete, die in Expo Go enthalten sind (z. B. `expo-secure-store`). Spätere Funktionen wie Spotify gehen damit nicht.
- Expo Go aus dem App Store unterstützt nur die neueste Expo-SDK-Version. Nach einem SDK-Wechsel muss das Projekt nachziehen.

## Notlösung: Expo Snack

1. Die Snack-Version der App ist eine einzige JavaScript-Datei mit allen Bildschirmen. Claude stellt sie auf einer Seite mit „Code kopieren“-Knopf bereit.
2. Auf https://snack.expo.dev die App-Datei öffnen (`App.js` oder `App.tsx`, beides geht), in den Code tippen, gedrückt halten, „Alles auswählen“ und dann „Einfügen“.
3. Snack meldet, dass `expo-secure-store` fehlt: auf „Add dependency“ tippen.
4. Rechts „iOS“ oder „Android“ wählen oder den QR-Code mit Expo Go öffnen.

In der Web-Vorschau gibt es keinen sicheren Speicher. Die App zeigt dann „Testmodus“ und vergisst die Eingaben beim Neuladen. Mit Expo Go auf dem Gerät wird verschlüsselt gespeichert.

## Datenschutz-Hinweis zur Entwicklung

- Bei EAS Update wird nur der Programmcode zu Expo hochgeladen, keine Daten von Athlet:innen.
- Beim Testen mit Expo Go läuft der Code vom eigenen Computer aufs Handy. Es werden keine Daten von Athlet:innen verarbeitet.
- Das Expo-Werkzeug sendet anonyme Nutzungsstatistiken an Expo. Abschalten mit der Umgebungsvariable `EXPO_NO_TELEMETRY=1`.
