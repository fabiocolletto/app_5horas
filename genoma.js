import { cellsManifest } from './cells.manifest.js';
import { getDeviceId, getProfile, initializeStorage, saveDeviceId } from './core/storage.js';
import { getState, initializeState, setActiveCell } from './core/state.js';
import { showTransientStatus } from './core/status.js';

class Genoma {
  constructor() {
    this.root = document.getElementById('genoma-root');
    this.manifest = Array.isArray(cellsManifest) ? cellsManifest : [];
    this.deviceId = null;
    this.profile = null;
    this.currentCell = null;
    this.isLoading = false;

    this.defaultCell = 'sistema.welcome';

    this.initialize();
  }

  async initialize() {
    this.updateStatus('Inicializando persistência...');
    await initializeStorage();
    await this.ensureDeviceIdentity();
    await initializeState();
    this.profile = await getProfile();
    this.registerNavigation();
    this.reportBootstrap();
    await this.loadDefaultCell();
  }

  async ensureDeviceIdentity() {
    const existing = await getDeviceId();

    if (existing) {
      this.deviceId = existing;
      this.updateStatus('Identidade do dispositivo carregada.');
      return;
    }

    const generated = crypto.randomUUID();
    await saveDeviceId(generated);
    this.deviceId = generated;
    this.updateStatus('Identidade do dispositivo gerada.');
  }

  registerNavigation() {
    window.addEventListener('genoma:navigate', (event) => {
      const target = event.detail?.target;
      const targetName = typeof target === 'string' ? target.trim() : '';

      if (!targetName) {
        this.updateStatus('Evento de navegação recebido sem destino válido.', { type: 'warning' });
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

  async loadDefaultCell() {
    const { activeCell, lastCell } = getState();
    const preferred = [activeCell, lastCell].find((candidate) => this.isCellAvailable(candidate));

    if (preferred) {
      await this.loadCell(preferred);
      return;
    }

    if (this.isCellAvailable('sistema.welcome')) {
      await this.loadCell('sistema.welcome');
      return;
    }

    this.defaultCell = this.profile ? 'home' : 'sistema.perfil';
    if (this.isCellAvailable(this.defaultCell)) {
      await this.loadCell(this.defaultCell);
    }
  }

  isCellAvailable(name) {
    return typeof name === 'string' && name.trim().length > 0 && this.manifest.some((entry) => entry.name === name);
  }

  async loadCell(name) {
    this.profile = await getProfile();
    const needsProfile = name !== 'sistema.perfil' && name !== 'sistema.welcome' && !this.profile;
    const targetName = needsProfile ? 'sistema.perfil' : name;

    if (needsProfile) {
      this.updateStatus('Perfil não encontrado. Redirecionando para cadastro.', { type: 'warning' });
    }

    const cell = this.manifest.find((entry) => entry.name === targetName);

    if (!cell) {
      this.updateStatus(`Célula "${targetName}" não encontrada no manifesto.`, { type: 'error' });
      return;
    }

    this.isLoading = true;
    this.updateStatus(`Carregando célula "${targetName}"...`);

    try {
      const module = await import(cell.module);

      if (typeof module.mount !== 'function') {
        this.updateStatus(`Célula "${targetName}" não expõe a função mount.`, { type: 'error' });
        return;
      }

      if (this.root) {
        await module.mount(this.root);
        this.currentCell = targetName;
        await setActiveCell(targetName);
      }
      this.updateStatus(`Célula "${targetName}" carregada.`, { type: 'success' });
    } catch (error) {
      console.error(error);
      this.updateStatus(`Falha ao carregar célula "${targetName}".`, { type: 'error' });
    } finally {
      this.isLoading = false;
    }
  }

  updateStatus(message, options = {}) {
    showTransientStatus(message, options);
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
