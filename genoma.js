import { cellsManifest } from './cells.manifest.js';

class Genoma {
  constructor() {
    this.root = document.getElementById('genoma-root');
    this.status = document.getElementById('genoma-status');
    this.manifest = Array.isArray(cellsManifest) ? cellsManifest : [];
    this.profileKey = 'genoma.profile';
    this.deviceIdKey = 'genoma.deviceId';
    this.deviceId = null;
    this.profile = this.loadProfile();
    this.currentCell = null;
    this.isLoading = false;

    this.defaultCell = this.profile ? 'home' : 'sistema.perfil';

    this.ensureDeviceIdentity();
    this.registerNavigation();
    this.reportBootstrap();
    this.loadDefaultCell();
  }

  ensureDeviceIdentity() {
    const existing = this.readDeviceId();

    if (existing) {
      this.deviceId = existing;
      this.updateStatus('Identidade do dispositivo carregada.');
      return;
    }

    const generated = crypto.randomUUID();
    window.localStorage.setItem(this.deviceIdKey, generated);
    this.deviceId = generated;
    this.updateStatus('Identidade do dispositivo gerada.');
  }

  readDeviceId() {
    const stored = window.localStorage.getItem(this.deviceIdKey);

    if (typeof stored === 'string' && stored.trim().length > 0) {
      return stored;
    }

    return null;
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
