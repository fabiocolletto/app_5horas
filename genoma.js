import { cellsManifest } from './cells.manifest.js';
import { getDeviceId, getProfile, initializeStorage, saveDeviceId } from './core/storage.js';
import { getState, initializeState, setActiveCell } from './core/state.js';

class Genoma {
  constructor() {
    this.root = document.getElementById('genoma-root');
    this.status = document.getElementById('genoma-status');
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

  async loadDefaultCell() {
    const { activeCell, lastCell } = getState();
    const preferred = [activeCell, lastCell].find((candidate) => typeof candidate === 'string' && candidate.trim().length > 0);

    if (preferred) {
      const exists = this.manifest.some((entry) => entry.name === preferred);
      if (exists) {
        await this.loadCell(preferred);
        return;
      }
    }

    this.defaultCell = this.profile ? 'home' : 'sistema.perfil';
    const exists = this.manifest.some((entry) => entry.name === this.defaultCell);
    if (exists) {
      await this.loadCell(this.defaultCell);
    }
  }

  async loadCell(name) {
    this.profile = await getProfile();
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

    try {
      const module = await import(cell.module);

      if (typeof module.mount !== 'function') {
        this.updateStatus(`Célula "${targetName}" não expõe a função mount.`);
        return;
      }

      if (this.root) {
        await module.mount(this.root);
        this.currentCell = targetName;
        await setActiveCell(targetName);
      }
      this.updateStatus(`Célula "${targetName}" carregada.`);
    } catch (error) {
      console.error(error);
      this.updateStatus(`Falha ao carregar célula "${targetName}".`);
    } finally {
      this.isLoading = false;
    }
  }

  updateStatus(message) {
    if (this.status) {
      this.status.textContent = message;
    }
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
