# CLAUDE.md – Mentale Trainings-App für Athlet:innen

## Projektüberblick

Eine App, die Athlet:innen im Leistungssport hilft, mental stabiler und leistungsfähiger zu werden. Entwickelt von einem Sportpsychologen (Praxis im Leistungssport, Master Sportpsychologie).

**Status:** Designphase. Es gibt noch keinen Code. Technologie-Stack und Zielplattform sind noch nicht entschieden.

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

## Navigation (Leiste unten, 4 Bereiche)

1. **Start** (unten links): zeigt die anstehende Sporteinheit aus dem Kalender. Antippen öffnet den vollständigen Kalender (Woche, Monat, Jahr).
2. **Übungen:** Audioübungen, z. B. Visualisierung, Atemübungen, Self-Talk.
3. **Routinen:** eigene Pre-Training- und Pre-Wettkampf-Routinen zusammenstellen (z. B. Atemübung, Musik, eigene Sprachaufnahme). Die App kann auf Wunsch Routinen vorschlagen.
4. **Verläufe/Mustererkennung:** Name noch offen (Ideen: „Einblicke“, „Verlauf“, „Entwicklung“, „Mein Weg“). Zeigt Verläufe und automatische Hinweise, z. B. „Fokus schwächer nach mehreren Auswärtswettkämpfen“ oder „vor Wettkämpfen häufiger geringe Energie“.

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
- Kalender: selbst eintragen und `.ics`-Import
- Erinnerung an den Check-out: optional und abschaltbar, als lokale Benachrichtigung auf dem Gerät (kein Server)
- Einfacher Verlauf
- Alle Daten nur lokal und verschlüsselt auf dem Gerät

**Später:** Routinen-Baukasten, Spotify, eigene Sprachaufnahmen der Athlet:innen, automatische Mustererkennung, Excel-Import, Handy-Kalender verbinden

## Offene Punkte

- Zuordnung Check-in-Wert → vorgeschlagene Maßnahme. Bisheriger Entwurf (noch nicht beschlossen):
  - niedrige Energie → aktivierende Atmung / Energizer-Audio
  - hinderliche Nervosität → verlängertes Ausatmen / Box-Breathing
  - niedriger Fokus → Fokus-Cue-Übung / kurze Achtsamkeitsübung
  - niedrige Motivation → Erinnerung an eigene Ziele / Self-Talk-Audio
  - schlechte Stimmung → kurze Reflexion / Musik aus eigener Routine
  - wenig oder schlechter Schlaf → Hinweis auf Regeneration, abends Entspannungsaudio
- Antwortoptionen für den Check-out
- Name für Bereich 4
- .ics in Version 1: nur einmaliger Datei-Import oder auch Abo-Link?
- Zielplattform (iOS, Android, Web-App) und Technologie-Stack
- Speicherort der Daten (nur auf dem Gerät oder verschlüsselte Cloud)
- Weitere geplante Ideen ohne festes Konzept: Ziele nach Zielkategorien, Wochenreflexion
