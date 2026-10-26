import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import CheckIn from './src/screens/CheckIn';
import Datenschutz, { DATENSCHUTZ_VERSION } from './src/screens/Datenschutz';
import Einstellungen from './src/screens/Einstellungen';
import Start from './src/screens/Start';
import {
  CheckIn as CheckInDaten,
  Einwilligung,
  checkInLaden,
  einwilligungLaden,
  heute,
  istSichererSpeicherDa,
} from './src/speicher';

type Seite = 'laden' | 'datenschutz' | 'start' | 'checkin' | 'einstellungen';

export default function App() {
  const [seite, setSeite] = useState<Seite>('laden');
  const [einwilligung, setEinwilligung] = useState<Einwilligung | null>(null);
  const [checkInHeute, setCheckInHeute] = useState<CheckInDaten | null>(null);
  const [testModus, setTestModus] = useState(false);
  // Der Check-in öffnet sich nur beim ersten Öffnen des Tages von selbst.
  const checkInGezeigtAm = useRef<string | null>(null);

  async function pruefen() {
    setTestModus(!(await istSichererSpeicherDa()));
    const e = await einwilligungLaden();
    if (!e || e.version < DATENSCHUTZ_VERSION) {
      setSeite('datenschutz');
      return;
    }
    setEinwilligung(e);
    const tag = heute();
    const c = await checkInLaden(tag);
    setCheckInHeute(c);
    if (!c && checkInGezeigtAm.current !== tag) {
      checkInGezeigtAm.current = tag;
      setSeite('checkin');
    } else {
      setSeite((s) => (s === 'laden' ? 'start' : s));
    }
  }

  useEffect(() => {
    pruefen();
    // Kommt die App am nächsten Tag wieder in den Vordergrund, erscheint der Check-in erneut.
    const abo = AppState.addEventListener('change', (zustand) => {
      if (zustand === 'active') pruefen();
    });
    return () => abo.remove();
  }, []);

  let inhalt;
  if (seite === 'laden') {
    inhalt = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  } else if (seite === 'datenschutz') {
    inhalt = (
      <Datenschutz
        onFertig={(e) => {
          setEinwilligung(e);
          checkInGezeigtAm.current = heute();
          setSeite('checkin');
        }}
      />
    );
  } else if (seite === 'checkin') {
    inhalt = (
      <CheckIn
        onFertig={(c) => {
          setCheckInHeute(c);
          setSeite('start');
        }}
        onSpaeter={() => setSeite('start')}
      />
    );
  } else if (seite === 'einstellungen' && einwilligung) {
    inhalt = (
      <Einstellungen
        einwilligung={einwilligung}
        onZurueck={() => setSeite('start')}
        onGeloescht={() => {
          setEinwilligung(null);
          setCheckInHeute(null);
          checkInGezeigtAm.current = null;
          setSeite('datenschutz');
        }}
      />
    );
  } else {
    inhalt = (
      <Start
        checkInHeute={checkInHeute}
        testModus={testModus}
        onCheckIn={() => setSeite('checkin')}
        onEinstellungen={() => setSeite('einstellungen')}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {inhalt}
      <StatusBar style="auto" />
    </View>
  );
}
