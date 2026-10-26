import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Einwilligung, allesLoeschen } from '../speicher';
import { Knopf, styles } from '../ui';

type Props = {
  einwilligung: Einwilligung;
  onZurueck: () => void;
  onGeloescht: () => void;
};

export default function Einstellungen({ einwilligung, onZurueck, onGeloescht }: Props) {
  const [nachfragen, setNachfragen] = useState(false);
  const [loeschtGerade, setLoeschtGerade] = useState(false);

  async function widerrufen() {
    setLoeschtGerade(true);
    await allesLoeschen();
    onGeloescht();
  }

  const datum = new Date(einwilligung.erteiltAm).toLocaleDateString('de-DE');

  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.titel}>Einstellungen</Text>

      <Text style={styles.zwischentitel}>Datenschutz</Text>
      <Text style={styles.text}>Du hast am {datum} zugestimmt, dass die App deine Angaben auf diesem Gerät speichert.</Text>
      <Text style={styles.text}>
        Wenn du deine Einwilligung widerrufst, werden alle deine Daten vollständig von diesem Gerät
        gelöscht. Das kann nicht rückgängig gemacht werden.
      </Text>

      {nachfragen ? (
        <View style={styles.hinweis}>
          <Text style={styles.text}>Wirklich widerrufen und alle Daten löschen?</Text>
          <Knopf
            titel="Ja, alles löschen"
            art="warnung"
            onPress={widerrufen}
            deaktiviert={loeschtGerade}
          />
          <Knopf titel="Abbrechen" art="neben" onPress={() => setNachfragen(false)} />
        </View>
      ) : (
        <Knopf
          titel="Einwilligung widerrufen"
          art="warnung"
          onPress={() => setNachfragen(true)}
        />
      )}

      <Knopf titel="Zurück" art="neben" onPress={onZurueck} />
    </ScrollView>
  );
}
