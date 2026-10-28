import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { CheckOut as CheckOutDaten, checkOutSpeichern, heute } from '../speicher';
import { Auswahl, Knopf, MehrfachAuswahl, farben, styles } from '../ui';

const ZUFRIEDENHEIT = ['sehr unzufrieden', 'unzufrieden', 'mittel', 'zufrieden', 'sehr zufrieden'].map(
  (text, i) => ({ wert: i + 1, text }),
);

// Gleiche Bereiche für alle drei Reflexionsfragen. Gespeichert wird das Kürzel.
const BEREICHE = [
  { wert: 'fokus', text: 'Fokus' },
  { wert: 'einsatz', text: 'Einsatz' },
  { wert: 'druck', text: 'Umgang mit Druck' },
  { wert: 'technik', text: 'Technik' },
  { wert: 'stimmung', text: 'Stimmung' },
  { wert: 'erholung', text: 'Erholung' },
];

type Antworten = Omit<CheckOutDaten, 'datum' | 'gespeichertUm'>;
type Liste = 'gut' | 'nichtGut' | 'besser';
type NotizFeld = 'gutNotiz' | 'nichtGutNotiz' | 'besserNotiz';

type Schritt =
  | { art: 'zufriedenheit'; frage: string }
  | { art: 'liste'; feld: Liste; notiz: NotizFeld; frage: string };

const SCHRITTE: Schritt[] = [
  { art: 'zufriedenheit', frage: 'Wie zufrieden bist du mit deinem Tag?' },
  { art: 'liste', feld: 'gut', notiz: 'gutNotiz', frage: 'Was war gut?' },
  { art: 'liste', feld: 'nichtGut', notiz: 'nichtGutNotiz', frage: 'Was war nicht gut?' },
  { art: 'liste', feld: 'besser', notiz: 'besserNotiz', frage: 'Was willst du besser machen?' },
];

type Props = {
  onFertig: (checkOut: CheckOutDaten) => void;
  onSpaeter: () => void;
};

export default function CheckOut({ onFertig, onSpaeter }: Props) {
  const [antworten, setAntworten] = useState<Antworten>({});
  const [nummer, setNummer] = useState(0);
  const schritt = SCHRITTE[nummer] as Schritt | undefined;

  function weiter() {
    setNummer((n) => n + 1);
  }

  function zurueck() {
    setNummer((n) => Math.max(0, n - 1));
  }

  function setzen(neu: Partial<Antworten>) {
    setAntworten((a) => ({ ...a, ...neu }));
  }

  function ueberspringen() {
    if (!schritt) return;
    setAntworten((a) => {
      const neu = { ...a };
      if (schritt.art === 'zufriedenheit') delete neu.zufriedenheit;
      else {
        delete neu[schritt.feld];
        delete neu[schritt.notiz];
      }
      return neu;
    });
    weiter();
  }

  async function speichern() {
    // Leere Listen und Notizen werden nicht gespeichert.
    const checkOut: CheckOutDaten = { datum: heute(), gespeichertUm: new Date().toISOString() };
    if (antworten.zufriedenheit) checkOut.zufriedenheit = antworten.zufriedenheit;
    for (const s of SCHRITTE) {
      if (s.art !== 'liste') continue;
      const liste = antworten[s.feld];
      const notiz = antworten[s.notiz]?.trim();
      if (liste?.length) checkOut[s.feld] = liste;
      if (notiz) checkOut[s.notiz] = notiz;
    }
    await checkOutSpeichern(checkOut);
    onFertig(checkOut);
  }

  return (
    <ScrollView contentContainerStyle={styles.seite} keyboardShouldPersistTaps="handled">
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
            { width: `${(Math.min(nummer, SCHRITTE.length) / SCHRITTE.length) * 100}%` },
          ]}
        />
      </View>

      {schritt ? (
        <View>
          <Text style={styles.kleintext}>
            Frage {nummer + 1} von {SCHRITTE.length}
          </Text>
          <Text style={[styles.titel, { marginBottom: 24 }]}>{schritt.frage}</Text>

          {schritt.art === 'zufriedenheit' ? (
            <Auswahl
              optionen={ZUFRIEDENHEIT}
              gewaehlt={antworten.zufriedenheit}
              onWahl={(wert) => {
                setzen({ zufriedenheit: wert });
                // Wie im Check-in: kurz warten, dann automatisch weiter.
                setTimeout(() => setNummer(1), 250);
              }}
            />
          ) : (
            <View>
              <Text style={styles.kleintext}>Du kannst mehreres ankreuzen.</Text>
              <MehrfachAuswahl
                optionen={BEREICHE}
                gewaehlt={antworten[schritt.feld] ?? []}
                onWechsel={(liste) => setzen({ [schritt.feld]: liste })}
              />
              <TextInput
                style={styles.notiz}
                placeholder="Notiz (freiwillig)"
                placeholderTextColor={farben.grau}
                multiline
                value={antworten[schritt.notiz] ?? ''}
                onChangeText={(text) => setzen({ [schritt.notiz]: text })}
              />
              <Knopf titel="Weiter" onPress={weiter} />
            </View>
          )}

          <Pressable onPress={ueberspringen} hitSlop={12} style={{ marginTop: 24, alignSelf: 'center' }}>
            <Text style={styles.textKnopf}>Überspringen</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <Text style={styles.titel}>Gut gemacht!</Text>
          <Text style={styles.text}>
            Danke für deinen Rückblick auf den Tag. Möchtest du deinen Check-out speichern?
          </Text>
          <Knopf titel="Check-out speichern" onPress={speichern} />
        </View>
      )}
    </ScrollView>
  );
}
