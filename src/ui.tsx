import { Pressable, StyleSheet, Text, View } from 'react-native';

// Farbschema „Salbei“: helles Salbeigrün mit dunklem Grün als Akzent.
export const farben = {
  hintergrund: '#F2F5F0',
  karte: '#FFFFFF',
  text: '#21302A',
  grau: '#5F6E66',
  akzent: '#2F6B57',
  hell: '#DDE9E1',
  rahmen: '#D3DED6',
  warnung: '#B4443A',
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

// Antwortfelder untereinander, von denen genau eines gewählt werden kann.
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

type MehrfachProps = {
  optionen: { wert: string; text: string }[];
  gewaehlt: string[];
  onWechsel: (gewaehlt: string[]) => void;
};

// Antwortfelder untereinander, von denen mehrere gewählt werden können.
export function MehrfachAuswahl({ optionen, gewaehlt, onWechsel }: MehrfachProps) {
  return (
    <View style={styles.auswahl}>
      {optionen.map((o) => {
        const aktiv = gewaehlt.includes(o.wert);
        return (
          <Pressable
            key={o.wert}
            onPress={() =>
              onWechsel(aktiv ? gewaehlt.filter((w) => w !== o.wert) : [...gewaehlt, o.wert])
            }
            style={[styles.option, aktiv && styles.optionAktiv]}
          >
            <Text style={[styles.optionText, aktiv && styles.optionTextAktiv]}>
              {aktiv ? '✓ ' : ''}
              {o.text}
            </Text>
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 28,
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
    gap: 10,
  },
  option: {
    backgroundColor: farben.karte,
    borderWidth: 1.5,
    borderColor: farben.rahmen,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionAktiv: {
    backgroundColor: farben.akzent,
    borderColor: farben.akzent,
  },
  optionText: {
    fontSize: 17,
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
    borderRadius: 8,
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
  kopfzeile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  textKnopf: {
    fontSize: 16,
    fontWeight: '600',
    color: farben.akzent,
  },
  fortschritt: {
    height: 6,
    borderRadius: 3,
    backgroundColor: farben.hell,
    marginBottom: 32,
    overflow: 'hidden',
  },
  fortschrittBalken: {
    height: 6,
    borderRadius: 3,
    backgroundColor: farben.akzent,
  },
  kleintext: {
    fontSize: 14,
    color: farben.grau,
    marginBottom: 8,
  },
  schlafReihe: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginVertical: 16,
  },
  rundKnopf: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: farben.hell,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rundKnopfText: {
    fontSize: 28,
    color: farben.akzent,
    fontWeight: '600',
  },
  schlafZahl: {
    fontSize: 32,
    fontWeight: 'bold',
    color: farben.text,
    minWidth: 130,
    textAlign: 'center',
  },
  notiz: {
    backgroundColor: farben.karte,
    borderWidth: 1.5,
    borderColor: farben.rahmen,
    borderRadius: 16,
    padding: 14,
    minHeight: 90,
    fontSize: 16,
    color: farben.text,
    textAlignVertical: 'top',
    marginTop: 16,
  },
  hinweis: {
    backgroundColor: farben.hell,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
});
