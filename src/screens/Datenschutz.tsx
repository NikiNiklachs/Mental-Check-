import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Altersgruppe, Einwilligung, einwilligungSpeichern } from '../speicher';
import { Auswahl, Haken, Knopf, styles } from '../ui';

// Wird erhöht, wenn sich der Text der Datenschutzerklärung wesentlich ändert.
export const DATENSCHUTZ_VERSION = 1;

type Props = {
  onFertig: (einwilligung: Einwilligung) => void;
};

export default function Datenschutz({ onFertig }: Props) {
  const [altersgruppe, setAltersgruppe] = useState<Altersgruppe>();
  const [eltern, setEltern] = useState(false);
  const [gelesen, setGelesen] = useState(false);
  const [gesundheitsdaten, setGesundheitsdaten] = useState(false);

  const fertig =
    altersgruppe !== undefined &&
    (altersgruppe === 'ab16' || eltern) &&
    gelesen &&
    gesundheitsdaten;

  async function zustimmen() {
    if (!altersgruppe) return;
    const einwilligung: Einwilligung = {
      version: DATENSCHUTZ_VERSION,
      erteiltAm: new Date().toISOString(),
      altersgruppe,
      elternEinverstanden: altersgruppe === 'unter16' && eltern,
    };
    await einwilligungSpeichern(einwilligung);
    onFertig(einwilligung);
  }

  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.titel}>Deine Daten gehören dir</Text>
      <Text style={styles.text}>
        Bevor es losgeht, kurz das Wichtigste dazu, was mit deinen Angaben passiert.
      </Text>

      <Text style={styles.zwischentitel}>Was die App speichert</Text>
      <Text style={styles.text}>
        Deine Antworten im täglichen Check-in (zum Beispiel Energie, Stimmung, Schlaf und am
        Spieltag deine Nervosität), die Art des Tages, deine Altersgruppe und wann du zugestimmt
        hast.
      </Text>

      <Text style={styles.zwischentitel}>Wo deine Daten liegen</Text>
      <Text style={styles.text}>
        Nur auf diesem Gerät, verschlüsselt. Sie werden an keinen Server geschickt und an niemanden
        weitergegeben. Auch deine Sportpsychologin oder dein Sportpsychologe sieht sie nicht. Die App
        enthält keine Werbung und kein Tracking.
      </Text>

      <Text style={styles.zwischentitel}>Warum wir ausdrücklich fragen</Text>
      <Text style={styles.text}>
        Angaben zu deiner mentalen Verfassung können Gesundheitsdaten sein. Diese dürfen nur mit
        deiner ausdrücklichen Einwilligung gespeichert werden.
      </Text>

      <Text style={styles.zwischentitel}>Du kannst jederzeit widerrufen</Text>
      <Text style={styles.text}>
        In den Einstellungen kannst du deine Einwilligung jederzeit zurücknehmen. Dann werden alle
        deine Daten vollständig gelöscht.
      </Text>

      <Text style={styles.zwischentitel}>Wie alt bist du?</Text>
      <Auswahl
        optionen={[
          { wert: 'ab16' as Altersgruppe, text: '16 Jahre oder älter' },
          { wert: 'unter16' as Altersgruppe, text: 'unter 16 Jahre' },
        ]}
        gewaehlt={altersgruppe}
        onWahl={setAltersgruppe}
      />

      {altersgruppe === 'unter16' && (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.text}>
            Unter 16 Jahren brauchst du zusätzlich die Zustimmung deiner Eltern oder
            Erziehungsberechtigten. Zeig ihnen diese Seite am besten.
          </Text>
          <Haken
            text="Meine Eltern bzw. Erziehungsberechtigten sind einverstanden."
            an={eltern}
            onWechsel={setEltern}
          />
        </View>
      )}

      <Text style={styles.zwischentitel}>Deine Zustimmung</Text>
      <Haken
        text="Ich habe die Datenschutzhinweise gelesen."
        an={gelesen}
        onWechsel={setGelesen}
      />
      <Haken
        text="Ich willige ausdrücklich ein, dass die App meine Angaben zur mentalen Verfassung auf diesem Gerät speichert."
        an={gesundheitsdaten}
        onWechsel={setGesundheitsdaten}
      />

      <Knopf titel="Zustimmen und loslegen" onPress={zustimmen} deaktiviert={!fertig} />
      {!fertig && (
        <Text style={[styles.text, { marginTop: 12 }]}>
          Ohne deine Zustimmung kann die App keine Check-ins speichern.
        </Text>
      )}
    </ScrollView>
  );
}
