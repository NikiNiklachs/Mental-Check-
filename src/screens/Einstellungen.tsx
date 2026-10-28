import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Einstellungen as EinstellungenDaten, Einwilligung, allesLoeschen } from '../speicher';
import { Knopf, styles } from '../ui';

type Props = {
  einwilligung: Einwilligung;
  einstellungen: EinstellungenDaten;
  onAendern: (einstellungen: EinstellungenDaten) => void;
  onZurueck: () => void;
  onGeloescht: () => void;
};

export default function Einstellungen({
  einwilligung,
  einstellungen,
  onAendern,
  onZurueck,
  onGeloescht,
}: Props) {
  const [nachfragen, setNachfragen] = useState(false);
  const [loeschtGerade, setLoeschtGerade] = useState(false);

  async function widerrufen() {
    setLoeschtGerade(true);
    await allesLoeschen();
    onGeloescht();
  }

  const stunde = einstellungen.checkOutStunde;
  const datum = new Date(einwilligung.erteiltAm).toLocaleDateString('de-DE');

  return (
    <ScrollView contentContainerStyle={styles.seite}>
      <Text style={styles.titel}>Einstellungen</Text>

      <Text style={styles.zwischentitel}>Check-out</Text>
      <Text style={styles.text}>Ab dieser Uhrzeit erscheint dein Check-out für den Tag.</Text>
      <View style={styles.schlafReihe}>
        <Pressable
          style={styles.rundKnopf}
          onPress={() => onAendern({ ...einstellungen, checkOutStunde: Math.max(12, stunde - 1) })}
        >
          <Text style={styles.rundKnopfText}>–</Text>
        </Pressable>
        <Text style={styles.schlafZahl}>{stunde}:00 Uhr</Text>
        <Pressable
          style={styles.rundKnopf}
          onPress={() => onAendern({ ...einstellungen, checkOutStunde: Math.min(23, stunde + 1) })}
        >
          <Text style={styles.rundKnopfText}>+</Text>
        </Pressable>
      </View>

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
