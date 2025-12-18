import { storage } from './storage.js';

const STATE_KEY = 'genoma.state';
const DEFAULT_STATE = {
  activeCell: null,
  lastCell: null,
  preferences: { theme: 'dark' },
  profile: null,
  deviceId: null,
};

function sanitizeState(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return { ...DEFAULT_STATE };
  }

  return {
    activeCell: typeof candidate.activeCell === 'string' ? candidate.activeCell : null,
    lastCell: typeof candidate.lastCell === 'string' ? candidate.lastCell : null,
    preferences: {
      ...DEFAULT_STATE.preferences,
      ...(typeof candidate.preferences === 'object' && candidate.preferences ? candidate.preferences : {}),
    },
    profile: candidate.profile && typeof candidate.profile === 'object'
      ? { ...candidate.profile }
      : null,
    deviceId: typeof candidate.deviceId === 'string' ? candidate.deviceId : null,
  };
}

class StateManager {
  constructor(key = STATE_KEY) {
    this.key = key;
    this.state = this.load();
  }

  load() {
    const stored = storage.readJSON(this.key);
    return sanitizeState(stored);
  }

  persist() {
    storage.writeJSON(this.key, this.state);
  }

  getActiveCell() {
    return this.state.activeCell;
  }

  getLastCell() {
    return this.state.lastCell;
  }

  setActiveCell(cellId) {
    this.state.activeCell = cellId ?? null;
    if (cellId) {
      this.state.lastCell = cellId;
    }
    this.persist();
  }

  getPreferences() {
    return this.state.preferences;
  }

  updatePreferences(patch) {
    this.state.preferences = { ...this.state.preferences, ...(patch || {}) };
    this.persist();
    return this.state.preferences;
  }

  getProfile() {
    return this.state.profile;
  }

  setProfile(profile) {
    if (!profile || typeof profile !== 'object') {
      this.state.profile = null;
      this.persist();
      return null;
    }

    const cleanProfile = {
      nome: typeof profile.nome === 'string' ? profile.nome : '',
      papel: typeof profile.papel === 'string' ? profile.papel : '',
    };

    this.state.profile = cleanProfile;
    this.persist();
    return cleanProfile;
  }

  getDeviceId() {
    return this.state.deviceId;
  }

  setDeviceId(id) {
    this.state.deviceId = typeof id === 'string' ? id : null;
    this.persist();
    return this.state.deviceId;
  }
}

export const state = new StateManager();
