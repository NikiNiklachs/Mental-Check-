import * as Print from 'expo-print';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { schreibuebungLaden, schreibuebungSpeichern } from '../speicher';
import { Uebung as UebungDaten } from '../uebungen';
import { Knopf, ZurueckKnopf, farben, styles } from '../ui';

type Props = {
  uebung: UebungDaten;
  onFertig: () => void;
};

// Sonderzeichen entschärfen, damit eigene Antworten das Druckbild nicht verändern.
const sicher = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

// Druckvorlage: leer zum Ausfüllen auf Papier oder mit den eigenen Antworten.
function druckSeite(uebung: UebungDaten, antworten: string[] | null): string {
  const felder = (uebung.fragen ?? [])
    .map((frage, i) => {
      const antwort = antworten?.[i] ? sicher(antworten[i]) : '';
      return `<h2>${sicher(frage)}</h2><div class="feld">${antwort}</div>`;
    })
    .join('');
  return `<html><head><meta charset="utf-8"><style>
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 32px; color: #21302A; }
    h1 { font-size: 24px; } h2 { font-size: 17px; margin-top: 28px; }
    .feld { border-bottom: 1px solid #5F6E66; min-height: 90px; font-size: 16px; }
  </style></head><body><h1>${sicher(uebung.titel)}</h1><p>${sicher(uebung.beschreibung)}</p>${felder}</body></html>`;
}

export default function Uebung({ uebung, onFertig }: Props) {
  const [antworten, setAntworten] = useState<string[]>([]);

  // Schreibübungen zeigen, was schon eingetragen wurde.
  useEffect(() => {
    if (uebung.art === 'schreiben') schreibuebungLaden(uebung.id).then(setAntworten);
  }, [uebung.id]);

  async function speichern() {
    await schreibuebungSpeichern(
      uebung.id,
      (uebung.fragen ?? []).map((_, i) => (antworten[i] ?? '').trim()),
    );
    onFertig();
  }

  // Öffnet den Druckdialog des Handys. Die App schickt nichts selbst weg.
  async function drucken(mitAntworten: boolean) {
    try {
      await Print.printAsync({ html: druckSeite(uebung, mitAntworten ? antworten : null) });
    } catch {
      // Abbrechen im Druckdialog ist kein Fehler.
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.seite} keyboardShouldPersistTaps="handled">
      <View style={styles.kopfzeile}>
        <ZurueckKnopf onPress={onFertig} />
      </View>
      <Text style={styles.kleintext}>{uebung.art === 'schreiben' ? 'Schreibübung' : 'Übung'}</Text>
      <Text style={styles.titel}>{uebung.titel}</Text>
      <Text style={styles.text}>{uebung.beschreibung}</Text>

      {uebung.art === 'schreiben' ? (
        <View>
          {(uebung.fragen ?? []).map((frage, i) => (
            <View key={frage}>
              <Text style={styles.zwischentitel}>{frage}</Text>
              <TextInput
                style={[styles.notiz, { marginTop: 0 }]}
                placeholder="Deine Antwort"
                placeholderTextColor={farben.grau}
                multiline
                value={antworten[i] ?? ''}
                onChangeText={(text) =>
                  setAntworten((a) => {
                    const neu = [...a];
                    neu[i] = text;
                    return neu;
                  })
                }
              />
            </View>
          ))}
          <Text style={[styles.kleintext, { marginTop: 16 }]}>
            Deine Antworten bleiben nur verschlüsselt auf diesem Gerät.
          </Text>
          <Knopf titel="Speichern" onPress={speichern} />
          <Knopf titel="Leer drucken" art="neben" onPress={() => drucken(false)} />
          <Knopf titel="Mit meinen Antworten drucken" art="neben" onPress={() => drucken(true)} />
        </View>
      ) : (
        <View>
          {/* Platzhalter, bis die Audios aufgenommen sind. */}
          <View style={styles.hinweis}>
            <Text style={[styles.text, { marginBottom: 0 }]}>
              Das Audio zu dieser Übung kommt bald. Hier kannst du es dann abspielen.
            </Text>
          </View>
          <Knopf titel="Fertig" onPress={onFertig} />
        </View>
      )}
    </ScrollView>
  );
}
