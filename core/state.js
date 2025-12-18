import { storage } from './storage.js';

const STATE_KEY = 'genoma.state';
const DEFAULT_STATE = {
  activeCell: null,
  lastCell: null,
  preferences: { theme: 'dark' },
  profile: null,
  deviceId: null,
};

function cleanString(value) {
  const parsed = typeof value === 'string' ? value.trim() : '';
  return parsed.length > 0 ? parsed : null;
}

function sanitizeProfileData(profile) {
  if (!profile || typeof profile !== 'object') {
    return null;
  }

  const nome = typeof profile.nome === 'string' ? profile.nome.trim() : '';
  const papel = typeof profile.papel === 'string' ? profile.papel.trim() : '';
  const hasData = nome.length > 0 || papel.length > 0;

  return hasData ? { nome, papel } : null;
}

function sanitizeState(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return { ...DEFAULT_STATE };
  }

  const activeCell = cleanString(candidate.activeCell);
  const lastCell = cleanString(candidate.lastCell) || activeCell;

  return {
    activeCell,
    lastCell,
    preferences: {
      ...DEFAULT_STATE.preferences,
      ...(typeof candidate.preferences === 'object' && candidate.preferences ? candidate.preferences : {}),
    },
    profile: sanitizeProfileData(candidate.profile),
    deviceId: cleanString(candidate.deviceId),
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
    const cleanProfile = sanitizeProfileData(profile);
    this.state.profile = cleanProfile;
    this.persist();
    return cleanProfile;
  }

  getDeviceId() {
    return this.state.deviceId;
  }

  setDeviceId(id) {
    this.state.deviceId = cleanString(id);
    this.persist();
    return this.state.deviceId;
  }

  exportState() {
    const snapshot = sanitizeState(this.state);
    return JSON.stringify(snapshot, null, 2);
  }

  importState(json) {
    const result = { success: false, warnings: [] };
    const baseState = sanitizeState(this.state);

    const candidate = typeof json === 'string' ? json.trim() : json;
    if (!candidate) {
      result.warnings.push('Nenhum conteúdo para importar.');
      return result;
    }

    let parsed;
    if (typeof candidate === 'string') {
      try {
        parsed = JSON.parse(candidate);
      } catch (error) {
        result.warnings.push('JSON inválido ou corrompido.');
        return result;
      }
    } else if (typeof candidate === 'object') {
      parsed = candidate;
    } else {
      result.warnings.push('Formato de estado não suportado.');
      return result;
    }

    const sanitized = sanitizeState(parsed);
    const rawActive = cleanString(parsed?.activeCell);
    const rawLast = cleanString(parsed?.lastCell);
    const rawDevice = cleanString(parsed?.deviceId);
    const rawProfile = sanitizeProfileData(parsed?.profile);
    const nextState = {
      ...baseState,
      ...sanitized,
      preferences: { ...DEFAULT_STATE.preferences, ...sanitized.preferences },
    };

    if (parsed && parsed.activeCell !== undefined && !rawActive) {
      result.warnings.push('Célula ativa inválida foi descartada.');
    }

    if (parsed && parsed.lastCell !== undefined && !rawLast && sanitized.lastCell) {
      result.warnings.push('Última célula inválida; valor ajustado automaticamente.');
    }

    if (!sanitized.deviceId) {
      result.warnings.push('deviceId ausente ou inválido; identidade existente mantida.');
      nextState.deviceId = baseState.deviceId;
    } else if (parsed && rawDevice && rawDevice !== sanitized.deviceId) {
      result.warnings.push('deviceId ajustado para um formato válido.');
    }

    if (!sanitized.lastCell && sanitized.activeCell) {
      result.warnings.push('Última célula ausente; ativa foi reaproveitada como última.');
      nextState.lastCell = sanitized.activeCell;
    }

    if (!parsed || parsed.preferences === undefined) {
      if (parsed) {
        result.warnings.push('Preferências ausentes; valores atuais mantidos.');
      }
      nextState.preferences = baseState.preferences;
    } else if (typeof parsed.preferences !== 'object') {
      result.warnings.push('Preferências inválidas; valores atuais mantidos.');
      nextState.preferences = baseState.preferences;
    }

    if (parsed && (!parsed.profile || typeof parsed.profile !== 'object')) {
      result.warnings.push('Perfil ausente ou inválido; valor atual mantido.');
      nextState.profile = baseState.profile;
    } else if (parsed && parsed.profile && !rawProfile) {
      result.warnings.push('Perfil sem dados foi ignorado.');
      nextState.profile = baseState.profile;
    }

    this.state = sanitizeState(nextState);
    this.persist();
    result.success = true;
    return result;
  }
}

export const state = new StateManager();
