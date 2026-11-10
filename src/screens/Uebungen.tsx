import { Pressable, ScrollView, Text } from 'react-native';
import { UEBUNGEN, Uebung } from '../uebungen';
import { styles } from '../ui';

type Props = {
  onUebung: (id: string) => void;
};

export default function Uebungen({ onUebung }: Props) {
  const karte = (u: Uebung) => (
    <Pressable key={u.id} onPress={() => onUebung(u.id)} style={styles.hinweis}>
      <Text style={[styles.zwischentitel, { marginTop: 0 }]}>{u.titel}</Text>
      <Text style={[styles.text, { marginBottom: 0 }]}>{u.beschreibung}</Text>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.titel}>Übungen</Text>

      <Text style={styles.zwischentitel}>Zum Aufschreiben</Text>
      {UEBUNGEN.filter((u) => u.art === 'schreiben').map(karte)}

      <Text style={styles.zwischentitel}>Zum Anhören</Text>
      <Text style={styles.text}>Die Audios kommen bald.</Text>
      {UEBUNGEN.filter((u) => u.art === 'audio').map(karte)}
    </ScrollView>
  );
}
