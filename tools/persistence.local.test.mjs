import assert from 'assert/strict';

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }

  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }

  setItem(key, value) {
    this.map.set(key, String(value));
  }

  removeItem(key) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }
}

await (async () => {
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, 'window', { value: { localStorage: storage }, configurable: true });
  Object.defineProperty(globalThis, 'navigator', {
    value: { storage: { persist: async () => true } },
    configurable: true,
  });

  const { state } = await import('../core/state.js');

  state.setProfile({ nome: 'Usuária', papel: 'QA' });
  state.setDeviceId('device-xyz');

  const ReloadedManager = state.constructor;
  const reloaded = new ReloadedManager();

  assert.deepStrictEqual(reloaded.getProfile(), { nome: 'Usuária', papel: 'QA' });
  assert.strictEqual(reloaded.getDeviceId(), 'device-xyz');

  storage.clear();
  const cleared = new ReloadedManager();

  assert.strictEqual(cleared.getProfile(), null);
  assert.strictEqual(cleared.getDeviceId(), null);

  console.log('State persistence test passed: data survives reload and resets after manual clear.');
})();
