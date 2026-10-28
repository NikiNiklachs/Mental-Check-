import { Pressable, ScrollView, Text, View } from 'react-native';
import { CheckIn } from '../speicher';
import { Knopf, styles } from '../ui';

type Props = {
  checkInHeute: CheckIn | null;
  uebersprungen: boolean;
  testModus: boolean;
  onCheckIn: () => void;
  onUeberspringen: () => void;
  onEinstellungen: () => void;
};

export default function Start({
  checkInHeute,
  uebersprungen,
  testModus,
  onCheckIn,
  onUeberspringen,
  onEinstellungen,
}: Props) {
  const stunde = new Date().getHours();
  const gruss = stunde < 11 ? 'Guten Morgen!' : stunde < 18 ? 'Hallo!' : 'Guten Abend!';

  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <View style={styles.kopfzeile}>
        <View />
        <Pressable onPress={onEinstellungen} hitSlop={12}>
          <Text style={styles.textKnopf}>Einstellungen</Text>
        </Pressable>
      </View>

      <Text style={styles.kleintext}>Mental Check</Text>
      <Text style={[styles.titel, { marginBottom: 24 }]}>{gruss}</Text>

      {checkInHeute ? (
        <View style={styles.hinweis}>
          <Text style={[styles.zwischentitel, { marginTop: 0 }]}>Check-in erledigt ✓</Text>
          <Text style={styles.text}>Danke! Dein Check-in für heute ist gespeichert.</Text>
        </View>
      ) : uebersprungen ? (
        <View style={styles.hinweis}>
          <Text style={styles.text}>Du hast den Check-in für heute übersprungen.</Text>
          <Pressable onPress={onCheckIn} hitSlop={12}>
            <Text style={styles.textKnopf}>Doch noch machen</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.hinweis}>
          <Text style={[styles.zwischentitel, { marginTop: 0 }]}>Dein Check-in für heute</Text>
          <Text style={styles.text}>Zwei Minuten für dich: Wie geht es dir heute?</Text>
          <Knopf titel="Check-in starten" onPress={onCheckIn} />
          <Knopf titel="Heute überspringen" art="neben" onPress={onUeberspringen} />
        </View>
      )}

      {testModus && (
        <Text style={[styles.kleintext, { marginTop: 32 }]}>
          Testmodus: Auf diesem Gerät gibt es keinen sicheren Speicher. Deine Eingaben werden nicht
          dauerhaft gespeichert. Nach dem Neuladen beginnt die App wieder beim Datenschutz.
        </Text>
      )}
    </ScrollView>
  );
}
