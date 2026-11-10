import { ScrollView, Text, View } from 'react-native';
import { styles } from '../ui';

type Props = {
  titel: string;
  text: string;
};

// Platzhalter für Bereiche, die noch nicht gebaut sind.
export default function KommtBald({ titel, text }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.titel}>{titel}</Text>
      <View style={styles.hinweis}>
        <Text style={[styles.zwischentitel, { marginTop: 0 }]}>Kommt bald</Text>
        <Text style={[styles.text, { marginBottom: 0 }]}>{text}</Text>
      </View>
    </ScrollView>
  );
}
