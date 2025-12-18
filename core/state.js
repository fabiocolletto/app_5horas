import { getPreferences, getStateSnapshot, savePreferences, saveStateSnapshot, initializeStorage } from './storage.js';

let state = {
  activeCell: null,
  lastCell: null,
  preferences: {},
};

let initialized = false;
const listeners = new Set();

function getSnapshot() {
  return {
    activeCell: state.activeCell,
    lastCell: state.lastCell,
    preferences: { ...state.preferences },
  };
}

function notify() {
  const snapshot = getSnapshot();
  listeners.forEach((listener) => listener(snapshot));
}

async function persist() {
  await saveStateSnapshot({
    activeCell: state.activeCell,
    lastCell: state.lastCell,
  });
  await savePreferences(state.preferences);
}

export async function initializeState() {
  if (initialized) {
    return getSnapshot();
  }

  await initializeStorage();
  const persistedState = await getStateSnapshot();
  const persistedPreferences = await getPreferences();

  if (persistedState?.activeCell) {
    state.activeCell = persistedState.activeCell;
  }

  if (persistedState?.lastCell) {
    state.lastCell = persistedState.lastCell;
  }

  if (persistedPreferences && typeof persistedPreferences === 'object') {
    state.preferences = { ...persistedPreferences };
  }

  initialized = true;
  return getSnapshot();
}

export function getState() {
  return getSnapshot();
}

export async function setActiveCell(name) {
  state = {
    ...state,
    lastCell: state.activeCell,
    activeCell: name,
  };
  await persist();
  notify();
}

export async function setPreferences(preferences) {
  state = {
    ...state,
    preferences: { ...preferences },
  };
  await persist();
  notify();
}

export function onStateChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
