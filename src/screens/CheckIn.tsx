import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CheckIn as CheckInDaten, Tagesart, checkInSpeichern, heute } from '../speicher';
import { Auswahl, Knopf, farben, styles } from '../ui';

// Fünfstufige Skala: angezeigt werden nur Worte, gespeichert wird die Zahl 1–5.
const NIEDRIG_HOCH = ['sehr niedrig', 'niedrig', 'mittel', 'hoch', 'sehr hoch'];
const SCHLECHT_GUT = ['sehr schlecht', 'schlecht', 'mittel', 'gut', 'sehr gut'];

const skala = (worte: string[]) => worte.map((text, i) => ({ wert: i + 1, text }));

type Antworten = Omit<CheckInDaten, 'datum' | 'gespeichertUm'>;
type Feld = keyof Antworten;

type Schritt = {
  feld: Feld;
  frage: string;
  optionen?: { wert: Antworten[Feld]; text: string }[];
};

const TAGESART: Schritt = {
  feld: 'tagesart',
  frage: 'Was für ein Tag ist heute?',
  optionen: [
    { wert: 'pausentag', text: 'Pausentag' },
    { wert: 'trainingstag', text: 'Trainingstag' },
    { wert: 'spieltag', text: 'Spieltag' },
  ],
};

const TAEGLICH: Schritt[] = [
  { feld: 'energie', frage: 'Wie ist deine Energie?', optionen: skala(NIEDRIG_HOCH) },
  { feld: 'stimmung', frage: 'Wie ist deine Stimmung?', optionen: skala(SCHLECHT_GUT) },
  { feld: 'motivation', frage: 'Wie ist deine Motivation?', optionen: skala(NIEDRIG_HOCH) },
  { feld: 'fokus', frage: 'Wie ist dein Fokus?', optionen: skala(NIEDRIG_HOCH) },
  { feld: 'schlafStunden', frage: 'Wie lange hast du geschlafen?' },
  { feld: 'schlafqualitaet', frage: 'Wie gut hast du geschlafen?', optionen: skala(SCHLECHT_GUT) },
];

const SPIELTAG: Schritt[] = [
  { feld: 'nervositaet', frage: 'Wie nervös bist du?', optionen: skala(NIEDRIG_HOCH) },
  {
    feld: 'nervositaetRichtung',
    frage: 'Ist deine Nervosität eher …',
    optionen: [
      { wert: 'hilfreich', text: 'eher hilfreich' },
      { wert: 'hinderlich', text: 'eher hinderlich' },
    ],
  },
];

type Props = {
  onFertig: (checkIn: CheckInDaten) => void;
  onSpaeter: () => void;
};

export default function CheckIn({ onFertig, onSpaeter }: Props) {
  const [antworten, setAntworten] = useState<Antworten>({});
  const [schlafStunden, setSchlafStunden] = useState(8);
  const [nummer, setNummer] = useState(0);

  // Die Fragen zur Nervosität gibt es nur am Spieltag.
  const schritte = [TAGESART, ...TAEGLICH, ...(antworten.tagesart === 'spieltag' ? SPIELTAG : [])];
  const schritt = schritte[nummer] as Schritt | undefined;

  function weiter() {
    setNummer((n) => n + 1);
  }

  function zurueck() {
    setNummer((n) => Math.max(0, n - 1));
  }

  function waehlen(feld: Feld, wert: Antworten[Feld]) {
    setAntworten((a) => {
      const neu = { ...a, [feld]: wert };
      // Wer vom Spieltag auf einen anderen Tag wechselt, hat keine Nervositätsangaben.
      if (feld === 'tagesart' && wert !== 'spieltag') {
        delete neu.nervositaet;
        delete neu.nervositaetRichtung;
      }
      return neu;
    });
    // Kurz warten, damit man die Auswahl noch sieht. Doppeltes Tippen springt nicht zwei Fragen weiter.
    const naechste = nummer + 1;
    setTimeout(() => setNummer(naechste), 250);
  }

  function ueberspringen() {
    if (!schritt) return;
    setAntworten((a) => {
      const neu = { ...a };
      delete neu[schritt.feld];
      return neu;
    });
    weiter();
  }

  async function speichern() {
    const checkIn: CheckInDaten = {
      ...antworten,
      datum: heute(),
      gespeichertUm: new Date().toISOString(),
    };
    await checkInSpeichern(checkIn);
    onFertig(checkIn);
  }

  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <View style={styles.kopfzeile}>
        {nummer > 0 ? (
          <Pressable onPress={zurueck} hitSlop={12}>
            <Text style={styles.textKnopf}>‹ Zurück</Text>
          </Pressable>
        ) : (
          <View />
        )}
        <Pressable onPress={onSpaeter} hitSlop={12}>
          <Text style={styles.textKnopf}>Später</Text>
        </Pressable>
      </View>

      <View style={styles.fortschritt}>
        <View
          style={[
            styles.fortschrittBalken,
            { width: `${(Math.min(nummer, schritte.length) / schritte.length) * 100}%` },
          ]}
        />
      </View>

      {schritt ? (
        <View>
          <Text style={styles.kleintext}>
            Frage {nummer + 1} von {schritte.length}
          </Text>
          <Text style={[styles.titel, { marginBottom: 24 }]}>{schritt.frage}</Text>

          {schritt.optionen ? (
            <Auswahl
              optionen={schritt.optionen}
              gewaehlt={antworten[schritt.feld]}
              onWahl={(wert) => waehlen(schritt.feld, wert)}
            />
          ) : (
            <View>
              <View style={styles.schlafReihe}>
                <Pressable
                  style={styles.rundKnopf}
                  onPress={() => setSchlafStunden((s) => Math.max(0, s - 0.5))}
                >
                  <Text style={styles.rundKnopfText}>–</Text>
                </Pressable>
                <Text style={styles.schlafZahl}>{schlafStunden.toLocaleString('de-DE')} Std.</Text>
                <Pressable
                  style={styles.rundKnopf}
                  onPress={() => setSchlafStunden((s) => Math.min(16, s + 0.5))}
                >
                  <Text style={styles.rundKnopfText}>+</Text>
                </Pressable>
              </View>
              <Knopf
                titel="Weiter"
                onPress={() => {
                  setAntworten((a) => ({ ...a, schlafStunden }));
                  weiter();
                }}
              />
            </View>
          )}

          <Pressable onPress={ueberspringen} hitSlop={12} style={{ marginTop: 24, alignSelf: 'center' }}>
            <Text style={styles.textKnopf}>Überspringen</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <Text style={styles.titel}>Geschafft!</Text>
          <Text style={styles.text}>
            Danke, dass du dir die Zeit nimmst. Möchtest du deinen Check-in für heute speichern?
          </Text>
          <Knopf titel="Check-in speichern" onPress={speichern} />
        </View>
      )}
    </ScrollView>
  );
}
