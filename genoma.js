import { cellsManifest } from './cells.manifest.js';

class Genoma {
  constructor() {
    this.root = document.getElementById('genoma-root');
    this.status = document.getElementById('genoma-status');
    this.manifest = Array.isArray(cellsManifest) ? cellsManifest : [];
    this.profileKey = 'genoma.profile';
    this.deviceIdKey = 'genoma.deviceId';
    this.deviceId = null;
    this.indexedDbName = 'genoma';
    this.indexedDbStore = 'genomaStore';
    this.indexedDbInstance = null;
    this.profile = this.loadProfile();
    this.currentCell = null;
    this.isLoading = false;

    this.defaultCell = this.profile ? 'home' : 'sistema.perfil';

    this.ensureDeviceIdentity().catch((error) => {
      console.error('Falha ao garantir a identidade do dispositivo.', error);
      this.updateStatus('Falha ao inicializar a identidade do dispositivo.');
    });
    this.registerNavigation();
    this.reportBootstrap();
    this.loadDefaultCell();
  }

  async ensureDeviceIdentity() {
    const localId = this.readDeviceIdFromLocalStorage();
    const indexedId = await this.readDeviceIdFromIndexedDb();
    const existing = localId || indexedId;

    if (existing) {
      this.deviceId = existing;

      if (!localId || !indexedId || localId !== indexedId) {
        this.updateStatus('Identidade do dispositivo reidratada.');
      } else {
        this.updateStatus('Identidade do dispositivo carregada.');
      }

      await this.persistDeviceId(existing);
      return;
    }

    const generated = crypto.randomUUID();
    this.deviceId = generated;
    await this.persistDeviceId(generated);
    this.updateStatus('Identidade do dispositivo gerada.');
  }

  readDeviceIdFromLocalStorage() {
    const stored = window.localStorage.getItem(this.deviceIdKey);

    if (typeof stored === 'string' && stored.trim().length > 0) {
      return stored;
    }

    return null;
  }

  async readDeviceIdFromIndexedDb() {
    try {
      const db = await this.openIndexedDb();

      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(this.indexedDbStore, 'readonly');
        const store = transaction.objectStore(this.indexedDbStore);
        const request = store.get(this.deviceIdKey);

        request.onsuccess = () => {
          const value = request.result;

          if (typeof value === 'string' && value.trim().length > 0) {
            resolve(value);
            return;
          }

          resolve(null);
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Falha ao ler deviceId do IndexedDB.', error);
      return null;
    }
  }

  async persistDeviceId(deviceId) {
    window.localStorage.setItem(this.deviceIdKey, deviceId);

    try {
      await this.saveDeviceIdToIndexedDb(deviceId);
    } catch (error) {
      console.error('Falha ao salvar deviceId no IndexedDB.', error);
    }
  }

  async saveDeviceIdToIndexedDb(deviceId) {
    const db = await this.openIndexedDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.indexedDbStore, 'readwrite');
      const store = transaction.objectStore(this.indexedDbStore);
      const request = store.put(deviceId, this.deviceIdKey);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  openIndexedDb() {
    if (this.indexedDbInstance) {
      return Promise.resolve(this.indexedDbInstance);
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.indexedDbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(this.indexedDbStore)) {
          db.createObjectStore(this.indexedDbStore);
        }
      };

      request.onsuccess = () => {
        this.indexedDbInstance = request.result;
        resolve(this.indexedDbInstance);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  registerNavigation() {
    window.addEventListener('genoma:navigate', (event) => {
      const target = event.detail?.target;
      const targetName = typeof target === 'string' ? target.trim() : '';

      if (!targetName) {
        this.updateStatus('Evento de navegação recebido sem destino válido.');
        return;
      }

      if (this.currentCell === targetName && !this.isLoading) {
        this.updateStatus(`Célula "${targetName}" já está ativa.`);
        return;
      }

      this.loadCell(targetName);
    });
  }

  reportBootstrap() {
    const total = this.manifest.length;
    const message = total === 0
      ? 'Manifesto vazio: nenhuma célula registrada.'
      : `Manifesto carregado com ${total} célula(s).`;
    this.updateStatus(message);
  }

  loadDefaultCell() {
    const exists = this.manifest.some((entry) => entry.name === this.defaultCell);
    if (exists) {
      this.loadCell(this.defaultCell);
    }
  }

  loadCell(name) {
    this.profile = this.loadProfile();
    const needsProfile = name !== 'sistema.perfil' && !this.profile;
    const targetName = needsProfile ? 'sistema.perfil' : name;

    if (needsProfile) {
      this.updateStatus('Perfil não encontrado. Redirecionando para cadastro.');
    }

    const cell = this.manifest.find((entry) => entry.name === targetName);

    if (!cell) {
      this.updateStatus(`Célula "${targetName}" não encontrada no manifesto.`);
      return;
    }

    this.isLoading = true;
    this.updateStatus(`Carregando célula "${targetName}"...`);

    import(cell.module)
      .then((module) => {
        if (typeof module.mount !== 'function') {
          this.updateStatus(`Célula "${targetName}" não expõe a função mount.`);
          return;
        }

        if (this.root) {
          module.mount(this.root);
          this.currentCell = targetName;
        }
        this.updateStatus(`Célula "${targetName}" carregada.`);
      })
      .catch((error) => {
        console.error(error);
        this.updateStatus(`Falha ao carregar célula "${targetName}".`);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  updateStatus(message) {
    if (this.status) {
      this.status.textContent = message;
    }
  }

  loadProfile() {
    const raw = window.localStorage.getItem(this.profileKey);

    if (!raw) {
      return null;
    }

    try {
      const profile = JSON.parse(raw);

      if (typeof profile?.nome === 'string' && typeof profile?.papel === 'string') {
        return profile;
      }
    } catch (error) {
      console.warn('Falha ao ler perfil armazenado.', error);
    }

    return null;
  }
}

function bootGenoma() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Genoma());
    return;
  }
  new Genoma();
}

bootGenoma();
