import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { schreibuebungLaden, schreibuebungSpeichern } from '../speicher';
import { Uebung as UebungDaten } from '../uebungen';
import { Knopf, ZurueckKnopf, farben, styles } from '../ui';

type Props = {
  uebung: UebungDaten;
  onFertig: () => void;
};

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
