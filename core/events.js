const EVENT_TYPES = {
  CELL_LOAD: 'cell:load',
  CELL_INIT: 'cell:init',
  CELL_READY: 'cell:ready',
  CELL_ERROR: 'cell:error',
  CELL_DESTROY: 'cell:destroy',
};

class EventHub {
  constructor() {
    this.target = new EventTarget();
  }

  emit(name, detail = {}) {
    if (!name) return;
    const payload = detail && typeof detail === 'object' ? detail : {};
    this.target.dispatchEvent(new CustomEvent(name, { detail: payload }));
  }

  subscribe(name, handler) {
    if (!name || typeof handler !== 'function') return () => {};
    this.target.addEventListener(name, handler);
    return () => this.target.removeEventListener(name, handler);
  }
}

export const events = new EventHub();
export { EVENT_TYPES };
