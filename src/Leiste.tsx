import { Pressable, StyleSheet, Text, View } from 'react-native';
import { farben } from './ui';

export type Bereich = 'start' | 'kalender' | 'uebungen' | 'routinen' | 'profil';

const BEREICHE: { wert: Bereich; text: string }[] = [
  { wert: 'start', text: 'Start' },
  { wert: 'kalender', text: 'Kalender' },
  { wert: 'uebungen', text: 'Übungen' },
  { wert: 'routinen', text: 'Routinen' },
  { wert: 'profil', text: 'Mein Profil' },
];

type Props = {
  aktiv: Bereich;
  onWahl: (bereich: Bereich) => void;
};

// Leiste unten, ohne zusätzliches Paket.
export default function Leiste({ aktiv, onWahl }: Props) {
  return (
    <View style={styles.leiste}>
      {BEREICHE.map((b) => {
        const an = b.wert === aktiv;
        return (
          <Pressable key={b.wert} onPress={() => onWahl(b.wert)} style={styles.eintrag}>
            <View style={[styles.punkt, an && styles.punktAn]} />
            <Text style={[styles.text, an && styles.textAn]}>{b.text}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  leiste: {
    flexDirection: 'row',
    backgroundColor: farben.karte,
    borderTopWidth: 1,
    borderTopColor: farben.rahmen,
    paddingTop: 10,
    // Platz für den Balken unten am iPhone.
    paddingBottom: 28,
  },
  eintrag: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  punkt: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  punktAn: {
    backgroundColor: farben.akzent,
  },
  text: {
    fontSize: 13,
    color: farben.grau,
  },
  textAn: {
    color: farben.akzent,
    fontWeight: '600',
  },
});
