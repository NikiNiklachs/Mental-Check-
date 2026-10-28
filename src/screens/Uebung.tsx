import { ScrollView, Text, View } from 'react-native';
import { Uebung as UebungDaten } from '../uebungen';
import { Knopf, styles } from '../ui';

type Props = {
  uebung: UebungDaten;
  onFertig: () => void;
};

// Platzhalter, bis die Audios aufgenommen sind.
export default function Uebung({ uebung, onFertig }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.kleintext}>Übung</Text>
      <Text style={styles.titel}>{uebung.titel}</Text>
      <Text style={styles.text}>{uebung.beschreibung}</Text>
      <View style={styles.hinweis}>
        <Text style={[styles.text, { marginBottom: 0 }]}>
          Das Audio zu dieser Übung kommt bald. Hier kannst du es dann abspielen.
        </Text>
      </View>
      <Knopf titel="Fertig" onPress={onFertig} />
    </ScrollView>
  );
}
