import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { CheckIn as CheckInDaten, Tagesart, checkInSpeichern, heute } from '../speicher';
import { Auswahl, Knopf, styles } from '../ui';

// Fünfstufige Skala: angezeigt werden nur Worte, gespeichert wird die Zahl 1–5.
const NIEDRIG_HOCH = ['sehr niedrig', 'niedrig', 'mittel', 'hoch', 'sehr hoch'];
const SCHLECHT_GUT = ['sehr schlecht', 'schlecht', 'mittel', 'gut', 'sehr gut'];

type SkalenFrage = 'energie' | 'stimmung' | 'motivation' | 'fokus' | 'schlafqualitaet';

const FRAGEN: { feld: SkalenFrage; frage: string; worte: string[] }[] = [
  { feld: 'energie', frage: 'Wie ist deine Energie?', worte: NIEDRIG_HOCH },
  { feld: 'stimmung', frage: 'Wie ist deine Stimmung?', worte: SCHLECHT_GUT },
  { feld: 'motivation', frage: 'Wie ist deine Motivation?', worte: NIEDRIG_HOCH },
  { feld: 'fokus', frage: 'Wie ist dein Fokus?', worte: NIEDRIG_HOCH },
  { feld: 'schlafqualitaet', frage: 'Wie gut hast du geschlafen?', worte: SCHLECHT_GUT },
];

const skala = (worte: string[]) => worte.map((text, i) => ({ wert: i + 1, text }));

type Props = {
  onFertig: (checkIn: CheckInDaten) => void;
  onSpaeter: () => void;
};

export default function CheckIn({ onFertig, onSpaeter }: Props) {
  const [tagesart, setTagesart] = useState<Tagesart>();
  const [werte, setWerte] = useState<Partial<Record<SkalenFrage, number>>>({});
  const [schlafStunden, setSchlafStunden] = useState(8);
  const [nervositaet, setNervositaet] = useState<number>();
  const [richtung, setRichtung] = useState<'hilfreich' | 'hinderlich'>();

  const spieltag = tagesart === 'spieltag';
  const fertig =
    tagesart !== undefined &&
    FRAGEN.every((f) => werte[f.feld] !== undefined) &&
    (!spieltag || (nervositaet !== undefined && richtung !== undefined));

  function schlafAendern(um: number) {
    setSchlafStunden((s) => Math.min(16, Math.max(0, s + um)));
  }

  async function speichern() {
    if (!fertig || !tagesart) return;
    const checkIn: CheckInDaten = {
      datum: heute(),
      tagesart,
      energie: werte.energie!,
      stimmung: werte.stimmung!,
      motivation: werte.motivation!,
      fokus: werte.fokus!,
      schlafStunden,
      schlafqualitaet: werte.schlafqualitaet!,
      ...(spieltag ? { nervositaet, nervositaetRichtung: richtung } : {}),
      gespeichertUm: new Date().toISOString(),
    };
    await checkInSpeichern(checkIn);
    onFertig(checkIn);
  }

  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.titel}>Check-in</Text>
      <Text style={styles.text}>Wie geht es dir heute? Tippe jeweils an, was am besten passt.</Text>

      <Text style={styles.zwischentitel}>Was für ein Tag ist heute?</Text>
      <Auswahl
        optionen={[
          { wert: 'pausentag' as Tagesart, text: 'Pausentag' },
          { wert: 'trainingstag' as Tagesart, text: 'Trainingstag' },
          { wert: 'spieltag' as Tagesart, text: 'Spieltag' },
        ]}
        gewaehlt={tagesart}
        onWahl={setTagesart}
      />

      {FRAGEN.slice(0, 4).map((f) => (
        <View key={f.feld}>
          <Text style={styles.zwischentitel}>{f.frage}</Text>
          <Auswahl
            optionen={skala(f.worte)}
            gewaehlt={werte[f.feld]}
            onWahl={(wert) => setWerte((w) => ({ ...w, [f.feld]: wert }))}
          />
        </View>
      ))}

      <Text style={styles.zwischentitel}>Wie lange hast du geschlafen?</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ width: 60 }}>
          <Knopf titel="–" art="neben" onPress={() => schlafAendern(-0.5)} />
        </View>
        <Text style={[styles.titel, { marginBottom: 0, marginTop: 16, minWidth: 110, textAlign: 'center' }]}>
          {schlafStunden.toLocaleString('de-DE')} Std.
        </Text>
        <View style={{ width: 60 }}>
          <Knopf titel="+" art="neben" onPress={() => schlafAendern(0.5)} />
        </View>
      </View>

      {FRAGEN.slice(4).map((f) => (
        <View key={f.feld}>
          <Text style={styles.zwischentitel}>{f.frage}</Text>
          <Auswahl
            optionen={skala(f.worte)}
            gewaehlt={werte[f.feld]}
            onWahl={(wert) => setWerte((w) => ({ ...w, [f.feld]: wert }))}
          />
        </View>
      ))}

      {spieltag && (
        <View>
          <Text style={styles.zwischentitel}>Wie nervös bist du?</Text>
          <Auswahl optionen={skala(NIEDRIG_HOCH)} gewaehlt={nervositaet} onWahl={setNervositaet} />

          <Text style={styles.zwischentitel}>Ist deine Nervosität eher …</Text>
          <Auswahl
            optionen={[
              { wert: 'hilfreich' as const, text: 'eher hilfreich' },
              { wert: 'hinderlich' as const, text: 'eher hinderlich' },
            ]}
            gewaehlt={richtung}
            onWahl={setRichtung}
          />
        </View>
      )}

      <Knopf titel="Check-in speichern" onPress={speichern} deaktiviert={!fertig} />
      <Knopf titel="Später machen" art="neben" onPress={onSpaeter} />
    </ScrollView>
  );
}
