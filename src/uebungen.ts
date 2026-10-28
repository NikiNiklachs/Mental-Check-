import { CheckIn } from './speicher';

// Übungen sind Audios, die Niklas selbst aufnimmt. Bis dahin sind es Platzhalter ohne Ton.
export type Uebung = {
  id: string;
  titel: string;
  beschreibung: string;
};

export const UEBUNGEN: Uebung[] = [
  {
    id: 'box_atmung',
    titel: 'Box-Breathing',
    beschreibung: 'Ruhig werden mit gleichmäßigem Atmen und verlängertem Ausatmen.',
  },
  {
    id: 'aktivierende_atmung',
    titel: 'Aktivierende Atmung',
    beschreibung: 'Kurze Atemübung, die dich wacher und energiegeladener macht.',
  },
  {
    id: 'fokus_cue',
    titel: 'Fokus-Cue',
    beschreibung: 'Ein kurzes Stichwort, das deine Aufmerksamkeit zurück ins Hier und Jetzt holt.',
  },
  {
    id: 'self_talk',
    titel: 'Self-Talk',
    beschreibung: 'Erinnere dich an deine Ziele und sprich dir selbst Mut zu.',
  },
  {
    id: 'reflexion',
    titel: 'Kurze Reflexion',
    beschreibung: 'Ein paar Minuten, um deine Gedanken und Gefühle zu sortieren.',
  },
  {
    id: 'regeneration',
    titel: 'Regeneration',
    beschreibung: 'Dein Körper braucht Erholung. Am Abend hilft ein Entspannungsaudio.',
  },
  {
    id: 'visualisierung',
    titel: 'Visualisierung',
    beschreibung: 'Geh deinen Wettkampf in Gedanken durch, Schritt für Schritt.',
  },
];

export function uebungFinden(id: string | undefined): Uebung | undefined {
  return UEBUNGEN.find((u) => u.id === id);
}

// "niedrig" oder "sehr niedrig" bzw. "schlecht" oder "sehr schlecht".
const niedrig = (wert: number | undefined) => wert !== undefined && wert <= 2;

// Wählt eine Übung zum Check-in. Sind mehrere Werte niedrig, gilt die Reihenfolge unten.
// Übersprungene Fragen zählen nicht. Ist nichts auffällig, gibt es nur am Spieltag einen Vorschlag.
export function uebungVorschlagen(c: CheckIn): Uebung | undefined {
  let id: string | undefined;
  if (c.nervositaetRichtung === 'hinderlich') id = 'box_atmung';
  else if (niedrig(c.energie)) id = 'aktivierende_atmung';
  else if (niedrig(c.fokus)) id = 'fokus_cue';
  else if (niedrig(c.motivation)) id = 'self_talk';
  else if (niedrig(c.stimmung)) id = 'reflexion';
  else if ((c.schlafStunden !== undefined && c.schlafStunden < 6) || niedrig(c.schlafqualitaet))
    id = 'regeneration';
  else if (c.tagesart === 'spieltag') id = 'visualisierung';
  return uebungFinden(id);
}
