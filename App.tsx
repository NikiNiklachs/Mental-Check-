import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import CheckIn from './src/screens/CheckIn';
import CheckOut from './src/screens/CheckOut';
import Datenschutz, { DATENSCHUTZ_VERSION } from './src/screens/Datenschutz';
import Einstellungen from './src/screens/Einstellungen';
import KommtBald from './src/screens/KommtBald';
import Start from './src/screens/Start';
import Uebung from './src/screens/Uebung';
import Uebungen from './src/screens/Uebungen';
import Leiste, { Bereich } from './src/Leiste';
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
import { Uebung as UebungDaten, uebungFinden } from './src/uebungen';
import { farben } from './src/ui';

type Seite =
  | 'laden'
  | 'datenschutz'
  | Bereich
  | 'checkin'
  | 'uebung'
  | 'checkout'
  | 'einstellungen';

export default function App() {
  const [seite, setSeite] = useState<Seite>('laden');
  const [einwilligung, setEinwilligung] = useState<Einwilligung | null>(null);
  const [checkInHeute, setCheckInHeute] = useState<CheckInDaten | null>(null);
  const [checkOutHeute, setCheckOutHeute] = useState<CheckOutDaten | null>(null);
  const [einstellungen, setEinstellungen] = useState<EinstellungenDaten | null>(null);
  // Geöffnete Übung und der Bereich, aus dem sie geöffnet wurde.
  const [uebung, setUebung] = useState<UebungDaten | undefined>();
  const [uebungVon, setUebungVon] = useState<Bereich>('start');
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
          setSeite('start');
        }}
        onSpaeter={() => setSeite('start')}
      />
    );
  } else if (seite === 'uebung' && uebung) {
    inhalt = <Uebung uebung={uebung} onFertig={() => setSeite(uebungVon)} />;
  } else if (seite === 'uebungen') {
    inhalt = (
      <Uebungen
        onUebung={(id) => {
          setUebung(uebungFinden(id));
          setUebungVon('uebungen');
          setSeite('uebung');
        }}
      />
    );
  } else if (seite === 'kalender') {
    inhalt = (
      <KommtBald
        titel="Kalender"
        text="Hier trägst du bald deine Trainings und Wettkämpfe ein oder lädst den Plan deines Vereins."
      />
    );
  } else if (seite === 'routinen') {
    inhalt = (
      <KommtBald
        titel="Routinen"
        text="Hier stellst du bald deine eigenen Routinen vor Training und Wettkampf zusammen."
      />
    );
  } else if (seite === 'profil') {
    inhalt = (
      <KommtBald
        titel="Mein Profil"
        text="Hier siehst du bald deine Verläufe und Durchschnitte, zum Beispiel wie sich deine Check-ins über die Zeit entwickeln."
      />
    );
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
          setUebungVon('start');
          setSeite('uebung');
        }}
        onVorschlagAntwort={async (id, angenommen) => {
          if (!checkInHeute) return;
          // Die Antwort wird zum Check-in des Tages gespeichert.
          const c: CheckInDaten = {
            ...checkInHeute,
            vorschlag: id,
            vorschlagAntwort: angenommen ? 'angenommen' : 'abgelehnt',
          };
          await checkInSpeichern(c);
          setCheckInHeute(c);
          if (angenommen) {
            setUebung(uebungFinden(id));
            setUebungVon('start');
            setSeite('uebung');
          }
        }}
        onUeberspringen={() => setUebersprungenAm(heute())}
        onEinstellungen={() => setSeite('einstellungen')}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: farben.hintergrund }}>
      <View style={{ flex: 1 }}>{inhalt}</View>
      {(seite === 'start' ||
        seite === 'kalender' ||
        seite === 'uebungen' ||
        seite === 'routinen' ||
        seite === 'profil') && (
        <Leiste aktiv={seite} onWahl={setSeite} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}
