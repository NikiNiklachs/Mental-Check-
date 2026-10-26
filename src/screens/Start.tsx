import { ScrollView, Text, View } from 'react-native';
import { CheckIn } from '../speicher';
import { Knopf, styles } from '../ui';

type Props = {
  checkInHeute: CheckIn | null;
  testModus: boolean;
  onCheckIn: () => void;
  onEinstellungen: () => void;
};

export default function Start({ checkInHeute, testModus, onCheckIn, onEinstellungen }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.titel}>Mental Check</Text>

      {testModus && (
        <View style={styles.hinweis}>
          <Text style={styles.text}>
            Testmodus: Auf diesem Gerät gibt es keinen sicheren Speicher. Deine Eingaben werden
            nicht dauerhaft gespeichert.
          </Text>
        </View>
      )}

      {checkInHeute ? (
        <View style={styles.hinweis}>
          <Text style={[styles.zwischentitel, { marginTop: 0 }]}>Check-in erledigt ✓</Text>
          <Text style={styles.text}>Danke! Dein Check-in für heute ist gespeichert.</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.text}>Du hast heute noch keinen Check-in gemacht.</Text>
          <Knopf titel="Check-in starten" onPress={onCheckIn} />
        </View>
      )}

      <Knopf titel="Einstellungen" art="neben" onPress={onEinstellungen} />
    </ScrollView>
  );
}
