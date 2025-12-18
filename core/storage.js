const MEMORY_FALLBACK = new Map();

function isStorageAvailable(candidate) {
  if (!candidate) return false;
  try {
    const probeKey = '__genoma_probe__';
    candidate.setItem(probeKey, 'ok');
    candidate.removeItem(probeKey);
    return true;
  } catch (error) {
    console.warn('Armazenamento indisponível, usando fallback em memória.', error);
    return false;
  }
}

const persistenceRequest = navigator?.storage?.persist
  ? navigator.storage.persist()
  : null;

if (persistenceRequest?.then) {
  persistenceRequest
    .then((granted) => {
      if (granted) {
        console.info('Armazenamento protegido contra despejo automático.');
      }
    })
    .catch(() => undefined);
}

const engine = isStorageAvailable(window?.localStorage) ? window.localStorage : null;

function readFromMemory(key) {
  return MEMORY_FALLBACK.has(key) ? MEMORY_FALLBACK.get(key) : null;
}

function writeToMemory(key, value) {
  MEMORY_FALLBACK.set(key, value);
}

function removeFromMemory(key) {
  MEMORY_FALLBACK.delete(key);
}

export const storage = {
  read(key) {
    if (!key) return null;
    if (engine) {
      return engine.getItem(key);
    }
    return readFromMemory(key);
  },
  write(key, value) {
    if (!key) return;
    if (engine) {
      engine.setItem(key, value);
      return;
    }
    writeToMemory(key, value);
  },
  remove(key) {
    if (!key) return;
    if (engine) {
      engine.removeItem(key);
      return;
    }
    removeFromMemory(key);
  },
  readJSON(key, fallback = null) {
    const raw = this.read(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`Falha ao interpretar JSON para "${key}".`, error);
      return fallback;
    }
  },
  writeJSON(key, value) {
    this.write(key, JSON.stringify(value));
  },
};
