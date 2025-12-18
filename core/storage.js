import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@4.0.8/dist/dexie.mjs';

const db = new Dexie('GenomaStorage');

db.version(1).stores({
  devices: 'key',
  profiles: 'key',
  preferences: 'key',
  state: 'key',
});

const PROFILE_KEY = 'genoma.profile';
const DEVICE_KEY = 'genoma.deviceId';
const STATE_KEY = 'global.state';
const PREFERENCES_KEY = 'global.preferences';

let initialized = false;

async function migrateLegacyLocalStorage() {
  const legacyProfile = window.localStorage.getItem(PROFILE_KEY);
  const legacyDeviceId = window.localStorage.getItem(DEVICE_KEY);

  if (legacyProfile) {
    try {
      const parsed = JSON.parse(legacyProfile);
      if (parsed && typeof parsed === 'object') {
        await db.profiles.put(parsed, 'current');
      }
    } catch (error) {
      console.warn('Falha ao migrar perfil do localStorage.', error);
    }
    window.localStorage.removeItem(PROFILE_KEY);
  }

  if (legacyDeviceId) {
    await db.devices.put({ key: 'device', value: legacyDeviceId });
    window.localStorage.removeItem(DEVICE_KEY);
  }
}

export async function initializeStorage() {
  if (initialized) {
    return;
  }

  await db.open();
  await migrateLegacyLocalStorage();
  initialized = true;
}

export async function getProfile() {
  await initializeStorage();
  const stored = await db.profiles.get('current');
  return stored || null;
}

export async function saveProfile(profile) {
  await initializeStorage();
  await db.profiles.put(profile, 'current');
}

export async function getDeviceId() {
  await initializeStorage();
  const stored = await db.devices.get('device');
  return stored?.value || null;
}

export async function saveDeviceId(deviceId) {
  await initializeStorage();
  await db.devices.put({ key: 'device', value: deviceId });
}

export async function getPreferences() {
  await initializeStorage();
  const stored = await db.preferences.get(PREFERENCES_KEY);
  return stored?.value || {};
}

export async function savePreferences(preferences) {
  await initializeStorage();
  await db.preferences.put({ key: PREFERENCES_KEY, value: preferences });
}

export async function getStateSnapshot() {
  await initializeStorage();
  const stored = await db.state.get(STATE_KEY);
  return stored?.value || null;
}

export async function saveStateSnapshot(snapshot) {
  await initializeStorage();
  await db.state.put({ key: STATE_KEY, value: snapshot });
}
