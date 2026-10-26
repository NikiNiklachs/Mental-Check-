import { Pressable, StyleSheet, Text, View } from 'react-native';

export const farben = {
  hintergrund: '#fff',
  text: '#222',
  grau: '#555',
  akzent: '#1f6feb',
  hell: '#eef3fb',
  rahmen: '#ccd',
  warnung: '#b42318',
};

type KnopfProps = {
  titel: string;
  onPress: () => void;
  deaktiviert?: boolean;
  art?: 'haupt' | 'neben' | 'warnung';
};

export function Knopf({ titel, onPress, deaktiviert, art = 'haupt' }: KnopfProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deaktiviert}
      style={[
        styles.knopf,
        art === 'neben' && styles.knopfNeben,
        art === 'warnung' && styles.knopfWarnung,
        deaktiviert && styles.knopfAus,
      ]}
    >
      <Text style={[styles.knopfText, art === 'neben' && styles.knopfTextNeben]}>{titel}</Text>
    </Pressable>
  );
}

type AuswahlProps<T> = {
  optionen: { wert: T; text: string }[];
  gewaehlt: T | undefined;
  onWahl: (wert: T) => void;
};

// Eine Reihe von Antwortfeldern, von denen genau eines gewählt werden kann.
export function Auswahl<T>({ optionen, gewaehlt, onWahl }: AuswahlProps<T>) {
  return (
    <View style={styles.auswahl}>
      {optionen.map((o) => {
        const aktiv = o.wert === gewaehlt;
        return (
          <Pressable
            key={o.text}
            onPress={() => onWahl(o.wert)}
            style={[styles.option, aktiv && styles.optionAktiv]}
          >
            <Text style={[styles.optionText, aktiv && styles.optionTextAktiv]}>{o.text}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type HakenProps = {
  text: string;
  an: boolean;
  onWechsel: (an: boolean) => void;
};

// Ankreuzfeld für Zustimmungen.
export function Haken({ text, an, onWechsel }: HakenProps) {
  return (
    <Pressable onPress={() => onWechsel(!an)} style={styles.haken}>
      <View style={[styles.kaestchen, an && styles.kaestchenAn]}>
        {an && <Text style={styles.hakenZeichen}>✓</Text>}
      </View>
      <Text style={styles.hakenText}>{text}</Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  seite: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 48,
    backgroundColor: farben.hintergrund,
    flexGrow: 1,
  },
  titel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: farben.text,
    marginBottom: 12,
  },
  zwischentitel: {
    fontSize: 18,
    fontWeight: '600',
    color: farben.text,
    marginTop: 24,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 23,
    color: farben.grau,
    marginBottom: 12,
  },
  knopf: {
    backgroundColor: farben.akzent,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  knopfNeben: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: farben.akzent,
  },
  knopfWarnung: {
    backgroundColor: farben.warnung,
  },
  knopfAus: {
    opacity: 0.4,
  },
  knopfText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  knopfTextNeben: {
    color: farben.akzent,
  },
  auswahl: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: farben.rahmen,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  optionAktiv: {
    backgroundColor: farben.akzent,
    borderColor: farben.akzent,
  },
  optionText: {
    fontSize: 15,
    color: farben.text,
  },
  optionTextAktiv: {
    color: '#fff',
    fontWeight: '600',
  },
  haken: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 8,
  },
  kaestchen: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: farben.akzent,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kaestchenAn: {
    backgroundColor: farben.akzent,
  },
  hakenZeichen: {
    color: '#fff',
    fontWeight: 'bold',
  },
  hakenText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
    color: farben.text,
  },
  hinweis: {
    backgroundColor: farben.hell,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
});
