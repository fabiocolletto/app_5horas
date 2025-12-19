const PROFILE_KEY = 'genoma.profile';
const DEVICE_KEY = 'genoma.deviceId';
const STATE_KEY = 'global.state';
const PREFERENCES_KEY = 'global.preferences';

let adapterPromise;

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Valor inválido no localStorage, ignorando.', error);
    return null;
  }
};

function createLocalStorageAdapter() {

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

async function migrateLegacyLocalStorage(db, shadowStorage) {
  const legacyProfile = window.localStorage.getItem(PROFILE_KEY);
  const legacyDeviceId = window.localStorage.getItem(DEVICE_KEY);
  const legacyPreferences = window.localStorage.getItem(PREFERENCES_KEY);
  const legacyState = window.localStorage.getItem(STATE_KEY);

  if (legacyProfile) {
    const parsed = safeParse(legacyProfile);
    if (parsed && typeof parsed === 'object') {
      await db.profiles.put(parsed, 'current');
      window.localStorage.removeItem(PROFILE_KEY);
      await shadowStorage.saveProfile(parsed);
    }
  }

  if (legacyDeviceId) {
    await db.devices.put({ key: 'device', value: legacyDeviceId });
    window.localStorage.removeItem(DEVICE_KEY);
    await shadowStorage.saveDeviceId(legacyDeviceId);
  }

  if (legacyPreferences) {
    const parsed = safeParse(legacyPreferences);
    if (parsed && typeof parsed === 'object') {
      await db.preferences.put({ key: PREFERENCES_KEY, value: parsed });
      window.localStorage.removeItem(PREFERENCES_KEY);
      await shadowStorage.savePreferences(parsed);
    }
  }

  if (legacyState) {
    const parsed = safeParse(legacyState);
    if (parsed && typeof parsed === 'object') {
      const value = parsed?.value ?? null;
      if (value) {
        await db.state.put({ key: STATE_KEY, value });
        window.localStorage.removeItem(STATE_KEY);
        await shadowStorage.saveStateSnapshot(value);
      }
    }
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

  const shadowStorage = createLocalStorageAdapter();
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
    await migrateLegacyLocalStorage(db, shadowStorage);
  } catch (error) {
    console.warn('Dexie indisponível. Recuando para localStorage.', error);
    return createLocalStorageAdapter();
  }

  const readWithFallback = async (label, primaryAction, fallbackAction, recoverAction) => {
    try {
      const result = await primaryAction();
      if (result !== undefined && result !== null) {
        return result;
      }
    } catch (error) {
      console.warn(`Falha ao ler ${label} no Dexie. Usando localStorage.`, error);
    }

    const fallbackValue = await fallbackAction();
    if (fallbackValue !== undefined && fallbackValue !== null && typeof recoverAction === 'function') {
      recoverAction(fallbackValue).catch((error) => {
        console.warn(`Falha ao ressincronizar ${label} no Dexie.`, error);
      });
    }
    return fallbackValue;
  };

  const writeWithShadow = async (label, primaryAction, shadowAction) => {
    try {
      await primaryAction();
    } catch (error) {
      console.warn(`Falha ao salvar ${label} no Dexie. Persistindo apenas em localStorage.`, error);
      await shadowAction();
      return;
    }
    await shadowAction();
  };

  return {
    async getProfile() {
      return readWithFallback(
        'perfil',
        () => db.profiles.get('current'),
        () => shadowStorage.getProfile(),
        (profile) => db.profiles.put(profile, 'current'),
      );
    },
    async saveProfile(profile) {
      await writeWithShadow(
        'perfil',
        () => db.profiles.put(profile, 'current'),
        () => shadowStorage.saveProfile(profile),
      );
    },
    async getDeviceId() {
      return readWithFallback(
        'deviceId',
        async () => {
          const stored = await db.devices.get('device');
          return stored?.value || null;
        },
        () => shadowStorage.getDeviceId(),
        (deviceId) => db.devices.put({ key: 'device', value: deviceId }),
      );
    },
    async saveDeviceId(deviceId) {
      await writeWithShadow(
        'deviceId',
        () => db.devices.put({ key: 'device', value: deviceId }),
        () => shadowStorage.saveDeviceId(deviceId),
      );
    },
    async getPreferences() {
      return readWithFallback(
        'preferências',
        async () => {
          const stored = await db.preferences.get(PREFERENCES_KEY);
          return stored?.value ?? null;
        },
        () => shadowStorage.getPreferences(),
        (preferences) => db.preferences.put({ key: PREFERENCES_KEY, value: preferences }),
      ) || {};
    },
    async savePreferences(preferences) {
      await writeWithShadow(
        'preferências',
        () => db.preferences.put({ key: PREFERENCES_KEY, value: preferences }),
        () => shadowStorage.savePreferences(preferences),
      );
    },
    async getStateSnapshot() {
      return readWithFallback(
        'estado',
        async () => {
          const stored = await db.state.get(STATE_KEY);
          return stored?.value ?? null;
        },
        () => shadowStorage.getStateSnapshot(),
        (snapshot) => db.state.put({ key: STATE_KEY, value: snapshot }),
      );
    },
    async saveStateSnapshot(snapshot) {
      await writeWithShadow(
        'estado',
        () => db.state.put({ key: STATE_KEY, value: snapshot }),
        () => shadowStorage.saveStateSnapshot(snapshot),
      );
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
