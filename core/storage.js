const PROFILE_KEY = 'genoma.profile';
const DEVICE_KEY = 'genoma.deviceId';
const STATE_KEY = 'global.state';
const PREFERENCES_KEY = 'global.preferences';

let adapterPromise;

function createLocalStorageAdapter() {
  const safeParse = (value) => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn('Valor inválido no localStorage, ignorando.', error);
      return null;
    }
  };

  return {
    async getProfile() {
      return safeParse(window.localStorage.getItem(PROFILE_KEY));
    },
    async saveProfile(profile) {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    },
    async getDeviceId() {
      return window.localStorage.getItem(DEVICE_KEY);
    },
    async saveDeviceId(deviceId) {
      window.localStorage.setItem(DEVICE_KEY, deviceId);
    },
    async getPreferences() {
      return safeParse(window.localStorage.getItem(PREFERENCES_KEY)) || {};
    },
    async savePreferences(preferences) {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    },
    async getStateSnapshot() {
      const stored = safeParse(window.localStorage.getItem(STATE_KEY));
      return stored?.value ?? null;
    },
    async saveStateSnapshot(snapshot) {
      window.localStorage.setItem(STATE_KEY, JSON.stringify({ value: snapshot }));
    },
  };
}

async function migrateLegacyLocalStorage(db) {
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

async function createDexieAdapter() {
  const dexieModule = await import('https://cdn.jsdelivr.net/npm/dexie@4.0.8/dist/dexie.mjs').catch((error) => {
    console.warn('Dexie indisponível. Recuando para localStorage.', error);
    return null;
  });

  if (!dexieModule?.default) {
    return createLocalStorageAdapter();
  }

  const Dexie = dexieModule.default;
  const db = new Dexie('GenomaStorage');

  db.version(1).stores({
    devices: 'key',
    profiles: 'key',
    preferences: 'key',
    state: 'key',
  });

  try {
    await db.open();
    await migrateLegacyLocalStorage(db);
  } catch (error) {
    console.warn('Dexie indisponível. Recuando para localStorage.', error);
    return createLocalStorageAdapter();
  }

  return {
    async getProfile() {
      return (await db.profiles.get('current')) || null;
    },
    async saveProfile(profile) {
      await db.profiles.put(profile, 'current');
    },
    async getDeviceId() {
      const stored = await db.devices.get('device');
      return stored?.value || null;
    },
    async saveDeviceId(deviceId) {
      await db.devices.put({ key: 'device', value: deviceId });
    },
    async getPreferences() {
      const stored = await db.preferences.get(PREFERENCES_KEY);
      return stored?.value || {};
    },
    async savePreferences(preferences) {
      await db.preferences.put({ key: PREFERENCES_KEY, value: preferences });
    },
    async getStateSnapshot() {
      const stored = await db.state.get(STATE_KEY);
      return stored?.value || null;
    },
    async saveStateSnapshot(snapshot) {
      await db.state.put({ key: STATE_KEY, value: snapshot });
    },
  };
}

async function getAdapter() {
  if (!adapterPromise) {
    adapterPromise = createDexieAdapter();
  }

  return adapterPromise;
}

export async function initializeStorage() {
  await getAdapter();
}

export async function getProfile() {
  const storage = await getAdapter();
  return storage.getProfile();
}

export async function saveProfile(profile) {
  const storage = await getAdapter();
  await storage.saveProfile(profile);
}

export async function getDeviceId() {
  const storage = await getAdapter();
  return storage.getDeviceId();
}

export async function saveDeviceId(deviceId) {
  const storage = await getAdapter();
  await storage.saveDeviceId(deviceId);
}

export async function getPreferences() {
  const storage = await getAdapter();
  return storage.getPreferences();
}

export async function savePreferences(preferences) {
  const storage = await getAdapter();
  await storage.savePreferences(preferences);
}

export async function getStateSnapshot() {
  const storage = await getAdapter();
  return storage.getStateSnapshot();
}

export async function saveStateSnapshot(snapshot) {
  const storage = await getAdapter();
  await storage.saveStateSnapshot(snapshot);
}
