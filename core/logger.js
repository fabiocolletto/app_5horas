import { storage } from './storage.js';

const DEBUG_FLAG_KEY = 'genoma.debug';

function resolveDebugFlag() {
  const query = new URLSearchParams(window.location.search);
  const queryValue = query.get('debug');

  if (typeof queryValue === 'string') {
    const normalized = queryValue.toLowerCase();
    const enabled = normalized === 'true' || normalized === '1';
    storage.write(DEBUG_FLAG_KEY, enabled ? 'true' : 'false');
    return enabled;
  }

  const stored = storage.read(DEBUG_FLAG_KEY);
  return stored === 'true';
}

class Logger {
  constructor() {
    this.debugMode = resolveDebugFlag();
  }

  isDebugEnabled() {
    return this.debugMode;
  }

  setDebugMode(enabled) {
    this.debugMode = Boolean(enabled);
    storage.write(DEBUG_FLAG_KEY, this.debugMode ? 'true' : 'false');
  }

  debug(message, ...args) {
    if (!this.debugMode) return;
    console.debug(`[Genoma][debug] ${message}`, ...args);
  }

  info(message, ...args) {
    console.info(`[Genoma] ${message}`, ...args);
  }

  warn(message, ...args) {
    console.warn(`[Genoma][warn] ${message}`, ...args);
  }

  error(message, ...args) {
    console.error(`[Genoma][error] ${message}`, ...args);
  }
}

export const logger = new Logger();
export { DEBUG_FLAG_KEY };
