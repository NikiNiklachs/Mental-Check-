import type { CheckIn } from './speicher';

// Zwei Arten: Audios, die Niklas selbst aufnimmt (bis dahin Platzhalter ohne Ton),
// und Schreibübungen wie auf dem Papier, die in der App ausgefüllt werden.
export type Uebung = {
  id: string;
  titel: string;
  beschreibung: string;
  art: 'audio' | 'schreiben';
  // Nur bei Schreibübungen: eine Frage pro Textfeld.
  fragen?: string[];
};

export const UEBUNGEN: Uebung[] = [
  {
    id: 'box_atmung',
    titel: 'Box-Breathing',
    art: 'audio',
    beschreibung: 'Ruhig werden mit gleichmäßigem Atmen und verlängertem Ausatmen.',
  },
  {
    id: 'aktivierende_atmung',
    titel: 'Aktivierende Atmung',
    art: 'audio',
    beschreibung: 'Kurze Atemübung, die dich wacher und energiegeladener macht.',
  },
  {
    id: 'fokus_cue',
    titel: 'Fokus-Cue',
    art: 'audio',
    beschreibung: 'Ein kurzes Stichwort, das deine Aufmerksamkeit zurück ins Hier und Jetzt holt.',
  },
  {
    id: 'self_talk',
    titel: 'Self-Talk',
    art: 'audio',
    beschreibung: 'Erinnere dich an deine Ziele und sprich dir selbst Mut zu.',
  },
  {
    id: 'reflexion',
    titel: 'Kurze Reflexion',
    art: 'audio',
    beschreibung: 'Ein paar Minuten, um deine Gedanken und Gefühle zu sortieren.',
  },
  {
    id: 'regeneration',
    titel: 'Regeneration',
    art: 'audio',
    beschreibung: 'Dein Körper braucht Erholung. Am Abend hilft ein Entspannungsaudio.',
  },
  {
    id: 'visualisierung',
    titel: 'Visualisierung',
    art: 'audio',
    beschreibung: 'Geh deinen Wettkampf in Gedanken durch, Schritt für Schritt.',
  },
  // Fragen sind ein Entwurf und warten auf Niklas' Bestätigung.
  {
    id: 'self_talk_saetze',
    titel: 'Meine Self-Talk-Sätze',
    beschreibung: 'Schreib dir Sätze auf, die dir in wichtigen Momenten helfen.',
    art: 'schreiben',
    fragen: [
      'Was sagst du dir vor dem Start?',
      'Was sagst du dir, wenn es gerade nicht läuft?',
      'Welcher Satz erinnert dich an deine Stärken?',
    ],
  },
];

export function uebungFinden(id: string | undefined): Uebung | undefined {
  return UEBUNGEN.find((u) => u.id === id);
}

// "niedrig" oder "sehr niedrig" bzw. "schlecht" oder "sehr schlecht".
const niedrig = (wert: number | undefined) => wert !== undefined && wert <= 2;

// Wählt eine Übung zum Check-in. Sind mehrere Werte niedrig, gilt die Reihenfolge unten.
// Übersprungene Fragen zählen nicht. Ist nichts auffällig, gibt es nur am Wettkampftag einen Vorschlag.
export function uebungVorschlagen(c: CheckIn): Uebung | undefined {
  let id: string | undefined;
  if (c.nervositaetRichtung === 'hinderlich') id = 'box_atmung';
  else if (niedrig(c.energie)) id = 'aktivierende_atmung';
  else if (niedrig(c.fokus)) id = 'fokus_cue';
  else if (niedrig(c.motivation)) id = 'self_talk';
  else if (niedrig(c.stimmung)) id = 'reflexion';
  else if ((c.schlafStunden !== undefined && c.schlafStunden < 6) || niedrig(c.schlafqualitaet))
    id = 'regeneration';
  else if (c.tagesart === 'wettkampftag') id = 'visualisierung';
  return uebungFinden(id);
}
