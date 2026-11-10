# CLAUDE.md – Mentale Trainings-App für Athlet:innen

## Projektüberblick

Eine App, die Athlet:innen im Leistungssport hilft, mental stabiler und leistungsfähiger zu werden. Entwickelt von einem Sportpsychologen (Praxis im Leistungssport, Master Sportpsychologie).

**Status:** Designphase. Es gibt ein lauffähiges Grundgerüst mit Datenschutz-Start und Check-in. Zielplattform: iOS und Android (beschlossen). Technologie-Stack: React Native mit Expo (beschlossen).

## Arbeitsregeln für Claude Code

- **Datenschutz immer mitdenken.** Bei jeder Funktion, jedem Datenmodell und jeder Schnittstelle aktiv prüfen und ansprechen, welche Daten wo landen. Der Entwickler hat ausdrücklich darum gebeten, daran erinnert zu werden.
- Annahmen offen benennen und bei Unklarheiten nachfragen statt raten.
- So einfach wie möglich bauen. Keine Funktionen, die nicht beschlossen sind.
- Nur ändern, was zur Aufgabe gehört.
- Neue Designentscheidungen in dieser Datei ergänzen.

## Datenschutz (verbindlich)

- Nur die eingeloggte Athlet:in sieht ihre eigenen Daten. Auch die betreuende Person (Sportpsycholog:in) hat **keinen** Einblick.
- Geteilt wird nur, was die Athlet:in selbst teilen möchte.
- Check-in-Daten zur mentalen Verfassung gelten voraussichtlich als Gesundheitsdaten nach Art. 9 DSGVO und brauchen eine ausdrückliche Einwilligung.
- Einmalige Datenschutzerklärung beim ersten Start mit aktiver Zustimmung.
- Altersabfrage: unter 16 Jahren zusätzlich Einwilligung der Eltern.
- Zustimmung jederzeit in den Einstellungen widerrufbar, inklusive vollständiger Datenlöschung.
- Spotify-Verbindung freiwillig und klar als Datenweitergabe an Drittanbieter gekennzeichnet.
- Auswertung und Mustererkennung möglichst lokal auf dem Gerät oder Ende-zu-Ende-verschlüsselt.
- Vor einem echten Start ist eine rechtliche Prüfung vorgesehen.

## Technologie-Stack

- **React Native mit Expo**, Sprache TypeScript (beschlossen am 22.10.2026).
- Gründe: einfacher Einstieg, Testen auf dem eigenen Handy per Expo Go, iOS-Builds in der Cloud (EAS) ohne Mac.
- Datenschutz: keine Analyse-, Tracking- oder Crash-Reporting-Pakete ohne ausdrückliche Entscheidung. Jedes neue Paket vor dem Einbau darauf prüfen, ob es Daten an Dritte sendet.
- Beim Cloud-Build (EAS) wird nur der Programmcode hochgeladen, keine Daten von Athlet:innen.
- Spotify später nur über Community-Pakete möglich, dafür ist mehr Aufwand einzuplanen.
- Projekt liegt direkt im Hauptordner des Repos (Vorlage `blank-typescript`, Expo SDK 58). Nur iOS und Android, keine Web-Version.
- Neue Pakete immer mit `npx expo install <paket>` hinzufügen. Testanleitung steht in `README.md`.
- Testen ohne Computer (2026-10-28): GitHub Action veröffentlicht jeden Push per EAS Update, Niklas öffnet den Stand in Expo Go (eigenes Expo-Konto, Secret `EXPO_TOKEN`). Dafür ist `expo-updates` eingebaut. Datenschutz: In einer echten App-Version fragt `expo-updates` beim Start bei Expo-Servern nach Updates. Vor dem ersten echten Build entscheiden, ob das bleibt oder abgeschaltet wird.

## Umsetzung Datenschutz-Start und Check-in (Stand 26.10.2026)

- Speicher: `expo-secure-store` (iOS Keychain / Android Keystore), Option „nur dieses Gerät“, also kein Backup und keine Übertragung. Ein Eintrag pro Check-in-Tag (`checkin_JJJJ-MM-TT`), dazu `einwilligung` und `erster_tag`. Code in `src/speicher.ts`.
- Widerruf löscht alle Tage vom ersten Tag bis heute, danach Einwilligung und ersten Tag.
- Wo kein sicherer Speicher da ist (z. B. Web-Vorschau in Snack), läuft die App im Testmodus und speichert nur im Arbeitsspeicher.
- Altersabfrage nur als Gruppe („16 oder älter“ / „unter 16“), kein Geburtsdatum (datensparsam). Elternzustimmung per Ankreuzen, ohne Nachweis (rechtlich zu prüfen).
- Navigation vorerst ohne Paket, einfache Seitenwechsel in `App.tsx`. Die Leiste unten kommt später.
- Tagesart wird im Check-in immer abgefragt, bis der Kalender da ist.
- Skalenworte: Energie, Motivation, Fokus, Nervosität „sehr niedrig … sehr hoch“; Stimmung und Schlafqualität „sehr schlecht … sehr gut“.
- Schlafdauer per Minus/Plus in halben Stunden (0–16 Std., Start bei 8).
- Check-in öffnet sich beim ersten Öffnen des Tages von selbst und lässt sich mit „Später“ verschieben.
- Check-in zeigt eine Frage pro Seite, Antworten untereinander. Nach dem Ankreuzen geht es automatisch weiter. Jede Frage hat „Zurück“ und „Überspringen“; übersprungene Fragen fehlen im gespeicherten Check-in. Am Ende „Check-in speichern“.
- Design: Farbschema „Salbei“ (helles Salbeigrün, dunkelgrüner Akzent), Farben zentral in `src/ui.tsx`. Creme/Terrakotta hat Niklas abgelehnt.
- Startseite: Gruß, Karte „Dein Check-in für heute“ mit „Check-in starten“ und „Heute überspringen“, Einstellungen oben rechts. „Später“ im Check-in führt dorthin. Überspringen wird nicht gespeichert.
- Snack-Test auf dem iPad: Code als JavaScript über eine Seite mit Kopier-Knopf (siehe README).
- Snack-Version: alle Dateien zu einer `App.tsx` zusammengefügt (ohne `expo-status-bar`).

## Tagesablauf

- Neuer Tag beginnt um 00:00 Uhr.
- **Check-in:** erscheint beim ersten Öffnen des Tages. Kann auch spät am Tag nachgeholt werden.
- Nach dem Check-in schlägt die App eine passende Maßnahme vor. Die Athlet:in kann annehmen oder ablehnen. Beides wird gespeichert (Grundlage für bessere Vorschläge und für die Auswertung).
- **Check-out:** Ab einer von der Athlet:in eingestellten Uhrzeit erscheint beim Öffnen automatisch der Check-out. Benachrichtigungen dafür sind optional und abschaltbar.

## Check-in-Fragen

**Täglich:**
- Energie
- Stimmung
- Motivation
- Fokus
- Schlafdauer (Eingabe in Stunden, z. B. Scrollrad in halben Stunden)
- Schlafqualität

**Zusätzlich am Wettkampftag:**
- Nervosität
- Richtung der Nervosität: „eher hilfreich oder eher hinderlich?“ Beruhigende Maßnahmen werden nur bei hinderlicher Nervosität vorgeschlagen.

**Skala:** Fünf Stufen, in der Anzeige nur als Worte (z. B. „sehr niedrig – niedrig – mittel – hoch – sehr hoch“). Intern als Zahl 1–5 gespeichert und ausgewertet.

Der Wettkampftag wird über die Kategorie des Kalendereintrags erkannt.

## Check-out

Kurze Tagesreflexion per Ankreuzen, plus optionale Notiz zu:
- Was war gut?
- Was war nicht gut?
- Was kann/will ich besser machen?

## Navigation (Leiste unten, 5 Bereiche, beschlossen 2026-11-10)

1. **Start** (unten links): Gruß, Check-in-Karte, Übungsvorschlag, anstehende Sporteinheit aus dem Kalender.
2. **Kalender:** Trainings und Wettkämpfe (Woche, Monat, Jahr), Check vor und Kurz-Evaluation nach der Einheit.
3. **Übungen:** Audioübungen (z. B. Visualisierung, Atemübungen, Self-Talk) und Schreibübungen „wie auf dem Papier“ (z. B. eigene Self-Talk-Sätze formulieren). Schreibübungen werden in der App ausgefüllt, die Antworten bleiben nur lokal auf dem Gerät.
4. **Routinen:** eigene Pre-Training- und Pre-Wettkampf-Routinen mit Ideen und Übungen aus der Bibliothek. In Version 1 als „Kommt bald“ sichtbar.
5. **Mein Profil:** Verläufe und Durchschnitte, Reflexion/Tagebuch, Ziele, später Hinweise aus Mustern.

Einstellungen oben rechts. Mehr als fünf Knöpfe passen auf dem Handy schlecht.

Auf jeder Unterseite (alles, was man angetippt hat) gibt es oben links „Zurück“.

Die Bereiche sind verknüpft: Ein Check-in-Ergebnis kann direkt zu einer passenden Übung führen.

## Kalender

Drei Quellen:
- **Vereinsplan einfügen:**
  - `.ics`: direkt importieren oder als Abo-Link einbinden (Änderungen werden automatisch übernommen)
  - Excel: Import mit Zuordnungsschritt der Spalten (Datum, Uhrzeit, Art der Einheit, Ort); zusätzlich eine Excel-Vorlage für Trainer:innen anbieten
  - PDF: wird manuell eingetragen
- **Selbst eintragen** in der App
- **Handy-Kalender** verbinden

Jeder Eintrag hat eine Kategorie (z. B. Training, Wettkampf, Regeneration).

## Spotify

Umsetzen, was technisch möglich ist: Songs in Routinen abspielen und mit eigenen Sprachaufnahmen kombinieren. Gleichzeitiges Überlagern von eigener Aufnahme und Spotify-Song ist voraussichtlich nicht erlaubt, daher nacheinander abspielen (z. B. erst Self-Talk, dann Song).

## Umfang der ersten Version (beschlossen 2026-10-22)

**In Version 1:**
- Datenschutz beim ersten Start: Einwilligung, Altersabfrage, Widerruf mit vollständiger Löschung
- Check-in mit den täglichen Fragen, am Wettkampftag zusätzlich Nervosität
- Tagesart im Check-in: Geht aus dem Kalender nicht hervor, welche Art Tag ist, fragt der Check-in per Ankreuzen „Pausentag, Spieltag oder Trainingstag?“ (Annahme: Spieltag = Wettkampf, Pausentag = Regeneration)
- Maßnahmenvorschlag nach dem Check-in (Annehmen/Ablehnen wird gespeichert)
- Check-out
- Übungen: einige Audios, selbst aufgenommen vom Entwickler
- Kalender: selbst eintragen und `.ics` (Datei-Import und Abo-Link)
- Erinnerung an den Check-out: optional und abschaltbar, als lokale Benachrichtigung auf dem Gerät (kein Server)
- Einfacher Verlauf
- Alle Daten nur lokal und verschlüsselt auf dem Gerät

**Später:** siehe Gesamtplan unten.

## Gesamtplan (beschlossen 2026-11-10)

Die fünf Bausteine: Übungsbibliothek (Audio), Routine-Baukasten, Ziele, Reflexion/Tagebuch, Kalender mit Kurz-Evaluation. Der große Unterschied zu anderen Apps: Die Bausteine sind miteinander verbunden. Niklas' Stimme in den Audios ist das Markenzeichen.

**Version 1: das tägliche Fundament**
- Alles aus „Umfang der ersten Version“ oben. Täglicher Check-in in unter 1 Minute.
- Übungsbibliothek mit Niklas' Audios: Visualisierung (z. B. Selbstwirksamkeits-/Selbstvertrauenserfahrung), Atmung aktivierend und beruhigend, Self-Talk.
- Dazu erste Schreibübungen in der App (z. B. Self-Talk-Sätze), Antworten nur lokal gespeichert.
- Neu: kurzer Check vor der Einheit (Energie, Nervosität, Motivation) und Kurz-Evaluation nach der Einheit. Beides hängt am Kalendereintrag, per Antippen, Auswahlfelder („Was lief gut? Was nicht? Was verbessere ich?“) plus optionales Freitextfeld.
- Erste Verbindungen: hohe hinderliche Nervosität im Check vor dem Wettkampf schlägt direkt eine passende Atemübung vor; „Nervosität war zu hoch“ in der Evaluation ebenso.
- Einfacher Verlauf in „Mein Profil“, Vorher/Nachher-Vergleich pro Einheit.
- Sicherheitsnetz: bei mehreren sehr schlechten Tagen ein ruhiger Hinweis auf Hilfsangebote (Wortlaut und Schwelle noch offen).

**Version 2: persönlich werden**
- Ziele nach Zieltheorie: Prozess-, Leistungs- und Ergebnisziele, Zwischenziele, langfristige Ziele bis zur Vision. Jede Person entscheidet selbst, wie viele Ziele und welche Arten (nichts ist Pflicht). Hinter jeder Zielart steht ein kleines Sternchen: Antippen zeigt einen Satz, was die Zielart ist, plus ein Beispiel. Ein Prozessziel erscheint in der Evaluation („Hast du heute an X gearbeitet?“).
- Routine-Baukasten (Pre-Training, Pre-Wettkampf): Schritt für Schritt aus Vorschlägen und Ideen wählen, Übungen aus der Übungsbibliothek lassen sich als Schritt einbauen. Steht ein Wettkampf im Kalender, schlägt die App die eigene Routine vor.
- Eigene Aufnahmen der Athlet:innen (Self-Talk-Cues, Visualisierung in eigenen Worten).
- Wochenreflexion.
- Erste Hinweise aus Mustern mit Empfehlung, z. B. „vor Wettkämpfen ist deine Energie oft niedriger“.

**Version 3: tiefer auswerten und teilen**
- Ausgebaute Mustererkennung, die von sich aus Hinweise gibt (z. B. Fokus nach drei Auswärtswettkämpfen in Folge schwächer).
- PDF-Export, den die Athlet:in selbst startet und teilt (z. B. für Sitzungen).
- Geprüfte Fragebögen, Spotify, Excel-Import, Handy-Kalender verbinden.

**Reihenfolge:** Ziele, Routinen und Muster bauen auf Kalender und Evaluationen auf. Muster brauchen einige Wochen Daten.

**Datenschutz:** Eigene Sprachaufnahmen bleiben nur auf dem Gerät. Mustererkennung läuft lokal. PDF-Export nur auf Wunsch der Athlet:in.

## Für alle Sportarten und Kontakt zu Niklas (beschlossen 2026-11-10)

- Neutrale Wörter, die in jeder Sportart passen (z. B. „Einheit“ und „Wettkampf“ statt „Spiel“ oder „Match“).
- Die App funktioniert vollständig ohne Verein und ohne Trainer:in.
- Knopf „Mit Niklas arbeiten“: nur ein Link zu Webseite oder E-Mail, es werden keine Daten übertragen. Platz: als Karte in „Mein Profil“ und als Punkt in den Einstellungen.
- Keine Coaching-Werbung, die an schlechte Werte gekoppelt ist. Das Sicherheitsnetz zeigt nur neutrale Hilfsangebote, getrennt vom Kontakt zu Niklas.
- Kein In-App-Kauf für Coaching. Das Preismodell der App wird später entschieden.
- Die rechtliche Prüfung umfasst auch die Berufsbezeichnung in der App.

## Offene Punkte

- Zuordnung Check-in-Wert → vorgeschlagene Maßnahme. Bisheriger Entwurf (noch nicht beschlossen):
  - niedrige Energie → aktivierende Atmung / Energizer-Audio
  - hinderliche Nervosität → verlängertes Ausatmen / Box-Breathing
  - niedriger Fokus → Fokus-Cue-Übung / kurze Achtsamkeitsübung
  - niedrige Motivation → Erinnerung an eigene Ziele / Self-Talk-Audio
  - schlechte Stimmung → kurze Reflexion / Musik aus eigener Routine
  - wenig oder schlechter Schlaf → Hinweis auf Regeneration, abends Entspannungsaudio
- Antwortoptionen für den Check-out
- Speicherort der Daten (nur auf dem Gerät oder verschlüsselte Cloud)
- Weitere geplante Ideen ohne festes Konzept: Ziele nach Zielkategorien, Wochenreflexion
