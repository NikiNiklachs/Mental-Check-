import { Pressable, ScrollView, Text } from 'react-native';
import { UEBUNGEN } from '../uebungen';
import { styles } from '../ui';

type Props = {
  onUebung: (id: string) => void;
};

export default function Uebungen({ onUebung }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.titel}>Übungen</Text>
      <Text style={styles.text}>Die Audios kommen bald. Bis dahin siehst du hier, welche Übungen es geben wird.</Text>
      {UEBUNGEN.map((u) => (
        <Pressable key={u.id} onPress={() => onUebung(u.id)} style={styles.hinweis}>
          <Text style={[styles.zwischentitel, { marginTop: 0 }]}>{u.titel}</Text>
          <Text style={[styles.text, { marginBottom: 0 }]}>{u.beschreibung}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
