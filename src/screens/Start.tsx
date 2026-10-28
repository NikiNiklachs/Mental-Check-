import { Pressable, ScrollView, Text, View } from 'react-native';
import { CheckIn, CheckOut } from '../speicher';
import { uebungFinden } from '../uebungen';
import { Knopf, styles } from '../ui';

type Props = {
  checkInHeute: CheckIn | null;
  uebersprungen: boolean;
  checkOutHeute: CheckOut | null;
  checkOutStunde: number;
  testModus: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onUebung: (id: string) => void;
  onUeberspringen: () => void;
  onEinstellungen: () => void;
};

export default function Start({
  checkInHeute,
  uebersprungen,
  checkOutHeute,
  checkOutStunde,
  testModus,
  onCheckIn,
  onCheckOut,
  onUebung,
  onUeberspringen,
  onEinstellungen,
}: Props) {
  const stunde = new Date().getHours();
  // Angenommene Übung von heute bleibt auf der Startseite erreichbar.
  const uebung =
    checkInHeute?.vorschlagAntwort === 'angenommen' ? uebungFinden(checkInHeute.vorschlag) : undefined;
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
          {uebung && (
            <Pressable onPress={() => onUebung(uebung.id)} hitSlop={12}>
              <Text style={styles.textKnopf}>Deine Übung: {uebung.titel} ›</Text>
            </Pressable>
          )}
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

      {checkOutHeute ? (
        <View style={styles.hinweis}>
          <Text style={[styles.zwischentitel, { marginTop: 0 }]}>Check-out erledigt ✓</Text>
          <Text style={styles.text}>Schönen Abend! Dein Rückblick auf heute ist gespeichert.</Text>
        </View>
      ) : stunde >= checkOutStunde ? (
        <View style={styles.hinweis}>
          <Text style={[styles.zwischentitel, { marginTop: 0 }]}>Dein Check-out für heute</Text>
          <Text style={styles.text}>Wie war dein Tag? Ein kurzer Rückblick.</Text>
          <Knopf titel="Check-out starten" onPress={onCheckOut} />
        </View>
      ) : (
        <Text style={styles.kleintext}>Dein Check-out erscheint ab {checkOutStunde}:00 Uhr.</Text>
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
