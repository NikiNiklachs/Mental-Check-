import * as SecureStore from 'expo-secure-store';

// Alle Daten liegen nur auf dem Gerät, verschlüsselt im Schlüsselbund
// (iOS Keychain / Android Keystore). Nichts wird an einen Server geschickt.
// "THIS_DEVICE_ONLY": Daten wandern nicht in Backups oder auf andere Geräte.
const OPTIONEN: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const SCHLUESSEL_EINWILLIGUNG = 'einwilligung';
const SCHLUESSEL_ERSTER_TAG = 'erster_tag';
const checkInSchluessel = (datum: string) => `checkin_${datum}`;

export type Altersgruppe = 'ab16' | 'unter16';

export type Einwilligung = {
  version: number;
  erteiltAm: string;
  altersgruppe: Altersgruppe;
  elternEinverstanden: boolean;
};

export type Tagesart = 'pausentag' | 'spieltag' | 'trainingstag';

// Skalenwerte werden als Zahl 1–5 gespeichert (1 = sehr niedrig, 5 = sehr hoch).
// Übersprungene Fragen fehlen im gespeicherten Check-in.
export type CheckIn = {
  datum: string;
  tagesart?: Tagesart;
  energie?: number;
  stimmung?: number;
  motivation?: number;
  fokus?: number;
  schlafStunden?: number;
  schlafqualitaet?: number;
  nervositaet?: number;
  nervositaetRichtung?: 'hilfreich' | 'hinderlich';
  gespeichertUm: string;
};

// Im Browser (z. B. Web-Vorschau in Snack) gibt es keinen sicheren Speicher.
// Dann merkt sich die App die Daten nur, solange sie geöffnet ist.
const testSpeicher = new Map<string, string>();
let sichererSpeicherDa: boolean | undefined;

export async function istSichererSpeicherDa(): Promise<boolean> {
  if (sichererSpeicherDa === undefined) {
    sichererSpeicherDa = await SecureStore.isAvailableAsync().catch(() => false);
  }
  return sichererSpeicherDa;
}

async function lesen(schluessel: string): Promise<string | null> {
  if (!(await istSichererSpeicherDa())) return testSpeicher.get(schluessel) ?? null;
  return SecureStore.getItemAsync(schluessel, OPTIONEN);
}

async function schreiben(schluessel: string, wert: string): Promise<void> {
  if (!(await istSichererSpeicherDa())) {
    testSpeicher.set(schluessel, wert);
    return;
  }
  await SecureStore.setItemAsync(schluessel, wert, OPTIONEN);
}

async function loeschen(schluessel: string): Promise<void> {
  if (!(await istSichererSpeicherDa())) {
    testSpeicher.delete(schluessel);
    return;
  }
  await SecureStore.deleteItemAsync(schluessel, OPTIONEN);
}

// Datum als "JJJJ-MM-TT" in der Ortszeit des Handys. Ein neuer Tag beginnt um 00:00 Uhr.
export function heute(): string {
  return datumAlsText(new Date());
}

function datumAlsText(d: Date): string {
  const monat = String(d.getMonth() + 1).padStart(2, '0');
  const tag = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${monat}-${tag}`;
}

export async function einwilligungLaden(): Promise<Einwilligung | null> {
  const text = await lesen(SCHLUESSEL_EINWILLIGUNG);
  return text ? (JSON.parse(text) as Einwilligung) : null;
}

export async function einwilligungSpeichern(einwilligung: Einwilligung): Promise<void> {
  if (!(await lesen(SCHLUESSEL_ERSTER_TAG))) {
    await schreiben(SCHLUESSEL_ERSTER_TAG, heute());
  }
  await schreiben(SCHLUESSEL_EINWILLIGUNG, JSON.stringify(einwilligung));
}

export async function checkInLaden(datum: string): Promise<CheckIn | null> {
  const text = await lesen(checkInSchluessel(datum));
  return text ? (JSON.parse(text) as CheckIn) : null;
}

export async function checkInSpeichern(checkIn: CheckIn): Promise<void> {
  await schreiben(checkInSchluessel(checkIn.datum), JSON.stringify(checkIn));
}

// Widerruf: löscht die Einwilligung und jeden Check-in seit dem ersten Tag.
export async function allesLoeschen(): Promise<void> {
  const ersterTag = await lesen(SCHLUESSEL_ERSTER_TAG);
  if (ersterTag) {
    const tag = new Date(`${ersterTag}T00:00:00`);
    // Einen Tag Puffer, falls die Uhr des Handys verstellt wurde.
    const ende = new Date();
    ende.setDate(ende.getDate() + 1);
    while (tag <= ende) {
      await loeschen(checkInSchluessel(datumAlsText(tag)));
      tag.setDate(tag.getDate() + 1);
    }
  }
  await loeschen(SCHLUESSEL_ERSTER_TAG);
  await loeschen(SCHLUESSEL_EINWILLIGUNG);
}
