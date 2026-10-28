import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import CheckIn from './src/screens/CheckIn';
import CheckOut from './src/screens/CheckOut';
import Datenschutz, { DATENSCHUTZ_VERSION } from './src/screens/Datenschutz';
import Einstellungen from './src/screens/Einstellungen';
import Start from './src/screens/Start';
import Uebung from './src/screens/Uebung';
import Vorschlag from './src/screens/Vorschlag';
import {
  CheckIn as CheckInDaten,
  CheckOut as CheckOutDaten,
  Einstellungen as EinstellungenDaten,
  Einwilligung,
  checkInLaden,
  checkInSpeichern,
  checkOutLaden,
  einstellungenLaden,
  einstellungenSpeichern,
  einwilligungLaden,
  heute,
  istSichererSpeicherDa,
} from './src/speicher';
import { Uebung as UebungDaten, uebungFinden, uebungVorschlagen } from './src/uebungen';
import { farben } from './src/ui';

type Seite =
  | 'laden'
  | 'datenschutz'
  | 'start'
  | 'checkin'
  | 'vorschlag'
  | 'uebung'
  | 'checkout'
  | 'einstellungen';

export default function App() {
  const [seite, setSeite] = useState<Seite>('laden');
  const [einwilligung, setEinwilligung] = useState<Einwilligung | null>(null);
  const [checkInHeute, setCheckInHeute] = useState<CheckInDaten | null>(null);
  const [checkOutHeute, setCheckOutHeute] = useState<CheckOutDaten | null>(null);
  const [einstellungen, setEinstellungen] = useState<EinstellungenDaten | null>(null);
  // Vorgeschlagene bzw. geöffnete Übung.
  const [uebung, setUebung] = useState<UebungDaten | undefined>();
  const [testModus, setTestModus] = useState(false);
  // Datum, an dem der Check-in übersprungen wurde. Wird nicht gespeichert.
  const [uebersprungenAm, setUebersprungenAm] = useState<string | null>(null);
  // Der Check-in öffnet sich nur beim ersten Öffnen des Tages von selbst.
  const checkInGezeigtAm = useRef<string | null>(null);
  // Der Check-out öffnet sich ab der eingestellten Uhrzeit einmal am Tag von selbst.
  const checkOutGezeigtAm = useRef<string | null>(null);

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
    const co = await checkOutLaden(tag);
    const ei = await einstellungenLaden();
    setCheckInHeute(c);
    setCheckOutHeute(co);
    setEinstellungen(ei);
    if (!c && checkInGezeigtAm.current !== tag) {
      checkInGezeigtAm.current = tag;
      setSeite('checkin');
    } else if (
      !co &&
      new Date().getHours() >= ei.checkOutStunde &&
      checkOutGezeigtAm.current !== tag
    ) {
      checkOutGezeigtAm.current = tag;
      setSeite('checkout');
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
          const vorschlag = uebungVorschlagen(c);
          setUebung(vorschlag);
          setSeite(vorschlag ? 'vorschlag' : 'start');
        }}
        onSpaeter={() => setSeite('start')}
      />
    );
  } else if (seite === 'vorschlag' && uebung && checkInHeute) {
    inhalt = (
      <Vorschlag
        uebung={uebung}
        onAntwort={async (angenommen) => {
          // Die Antwort wird zum Check-in des Tages gespeichert.
          const c: CheckInDaten = {
            ...checkInHeute,
            vorschlag: uebung.id,
            vorschlagAntwort: angenommen ? 'angenommen' : 'abgelehnt',
          };
          await checkInSpeichern(c);
          setCheckInHeute(c);
          setSeite(angenommen ? 'uebung' : 'start');
        }}
      />
    );
  } else if (seite === 'uebung' && uebung) {
    inhalt = <Uebung uebung={uebung} onFertig={() => setSeite('start')} />;
  } else if (seite === 'checkout') {
    inhalt = (
      <CheckOut
        onFertig={(co) => {
          setCheckOutHeute(co);
          setSeite('start');
        }}
        onSpaeter={() => setSeite('start')}
      />
    );
  } else if (seite === 'einstellungen' && einwilligung && einstellungen) {
    inhalt = (
      <Einstellungen
        einwilligung={einwilligung}
        einstellungen={einstellungen}
        onAendern={(ei) => {
          setEinstellungen(ei);
          einstellungenSpeichern(ei);
        }}
        onZurueck={() => setSeite('start')}
        onGeloescht={() => {
          setEinwilligung(null);
          setCheckInHeute(null);
          setCheckOutHeute(null);
          setEinstellungen(null);
          checkInGezeigtAm.current = null;
          checkOutGezeigtAm.current = null;
          setSeite('datenschutz');
        }}
      />
    );
  } else {
    inhalt = (
      <Start
        checkInHeute={checkInHeute}
        uebersprungen={uebersprungenAm === heute()}
        checkOutHeute={checkOutHeute}
        checkOutStunde={einstellungen?.checkOutStunde ?? 19}
        testModus={testModus}
        onCheckIn={() => setSeite('checkin')}
        onCheckOut={() => setSeite('checkout')}
        onUebung={(id) => {
          setUebung(uebungFinden(id));
          setSeite('uebung');
        }}
        onUeberspringen={() => setUebersprungenAm(heute())}
        onEinstellungen={() => setSeite('einstellungen')}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: farben.hintergrund }}>
      {inhalt}
      <StatusBar style="auto" />
    </View>
  );
}
