import { ScrollView, Text, View } from 'react-native';
import { Uebung } from '../uebungen';
import { Knopf, styles } from '../ui';

type Props = {
  uebung: Uebung;
  onAntwort: (angenommen: boolean) => void;
};

// Vorschlag nach dem Check-in. Annehmen und Ablehnen werden beide gespeichert.
export default function Vorschlag({ uebung, onAntwort }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.kleintext}>Unser Vorschlag für dich</Text>
      <Text style={styles.titel}>{uebung.titel}</Text>
      <View style={styles.hinweis}>
        <Text style={[styles.text, { marginBottom: 0 }]}>{uebung.beschreibung}</Text>
      </View>
      <Text style={styles.text}>Passend zu deinem Check-in von heute. Möchtest du die Übung machen?</Text>
      <Knopf titel="Ja, Übung starten" onPress={() => onAntwort(true)} />
      <Knopf titel="Nein, danke" art="neben" onPress={() => onAntwort(false)} />
    </ScrollView>
  );
}
