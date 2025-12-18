const NAMESPACE_PREFIX = 'genoma';
export const DEVICE_ID_KEY = 'genoma.deviceId';
export const LEGACY_PROFILE_KEY = 'genoma.profile';

function buildProfileKey(deviceId) {
  return buildNamespacedKey(deviceId, 'profile');
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function persistJson(key, payload) {
  window.localStorage.setItem(key, JSON.stringify(payload));
}

function parseProfile(raw) {
  if (!isNonEmptyString(raw)) {
    return null;
  }

  try {
    const data = JSON.parse(raw);

    if (isNonEmptyString(data?.nome) && isNonEmptyString(data?.papel)) {
      return { nome: data.nome, papel: data.papel };
    }
  } catch (error) {
    console.warn('Perfil inválido no storage.', error);
  }

  return null;
}

export function buildNamespacedKey(deviceId, resource) {
  if (isNonEmptyString(deviceId)) {
    return `${NAMESPACE_PREFIX}:${deviceId}:${resource}`;
  }

  return `${NAMESPACE_PREFIX}:${resource}`;
}

export function getStoredDeviceId() {
  const stored = window.localStorage.getItem(DEVICE_ID_KEY);

  if (isNonEmptyString(stored)) {
    return stored;
  }

  return null;
}

export function readProfileFromStorage(deviceId) {
  const namespacedKey = buildProfileKey(deviceId);
  const namespacedProfile = parseProfile(window.localStorage.getItem(namespacedKey));

  if (namespacedProfile) {
    return namespacedProfile;
  }

  const legacyProfile = parseProfile(window.localStorage.getItem(LEGACY_PROFILE_KEY));

  if (legacyProfile && namespacedKey !== LEGACY_PROFILE_KEY) {
    persistJson(namespacedKey, legacyProfile);
    return legacyProfile;
  }

  return null;
}

export function persistProfileToStorage(deviceId, nome, papel) {
  const profile = {
    nome: isNonEmptyString(nome) ? nome : '',
    papel: isNonEmptyString(papel) ? papel : '',
  };
  const namespacedKey = buildProfileKey(deviceId);

  persistJson(namespacedKey, profile);

  if (namespacedKey !== LEGACY_PROFILE_KEY) {
    persistJson(LEGACY_PROFILE_KEY, profile);
  }
}

export function associateLegacyProfileWithDevice(deviceId) {
  if (!isNonEmptyString(deviceId)) {
    return null;
  }

  const namespacedKey = buildProfileKey(deviceId);
  const namespacedProfile = parseProfile(window.localStorage.getItem(namespacedKey));

  if (namespacedProfile) {
    return namespacedProfile;
  }

  const legacyProfile = parseProfile(window.localStorage.getItem(LEGACY_PROFILE_KEY));

  if (legacyProfile) {
    persistJson(namespacedKey, legacyProfile);
    return legacyProfile;
  }

  return null;
}
