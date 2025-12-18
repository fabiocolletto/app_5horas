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
    this.currentCellId = null;
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
      const targetId = typeof target === 'string' ? target.trim() : '';

      if (!targetId) {
        this.updateStatus('Evento de navegação recebido sem destino válido.');
        return;
      }

      if (this.currentCellId === targetId && !this.isLoading) {
        this.updateStatus(`Célula "${targetId}" já está ativa.`);
        return;
      }

      this.loadCell(targetId);
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
    const exists = this.manifest.some((entry) => entry.id === this.defaultCell);
    if (exists) {
      this.loadCell(this.defaultCell);
    }
  }

  validateCellContract(cell) {
    if (!cell || typeof cell !== 'object') {
      return 'Módulo de célula inválido ou não exportado.';
    }

    const stringProps = ['id', 'name', 'version'];
    const missingStrings = stringProps.filter((prop) => typeof cell[prop] !== 'string' || cell[prop].trim().length === 0);

    if (missingStrings.length > 0) {
      return `Contrato celular incompleto: faltando ${missingStrings.join(', ')}.`;
    }

    if (typeof cell.init !== 'function') {
      return 'Contrato celular inválido: função init(context) ausente.';
    }

    if (typeof cell.destroy !== 'function') {
      return 'Contrato celular inválido: função destroy() ausente.';
    }

    return null;
  }

  teardownCurrentCell() {
    if (!this.currentCell) {
      return;
    }

    try {
      this.currentCell.destroy();
    } catch (error) {
      console.warn(`Falha ao destruir célula "${this.currentCellId}".`, error);
    }

    if (this.root) {
      this.root.replaceChildren();
    }

    this.currentCell = null;
    this.currentCellId = null;
  }

  createContext(targetId) {
    return {
      host: this.root,
      profile: this.profile,
      deviceId: this.deviceId,
      navigate: (destination) => this.navigate(destination, targetId),
    };
  }

  navigate(destination, origin) {
    const targetId = typeof destination === 'string' ? destination.trim() : '';

    if (!targetId) {
      this.updateStatus('Navegação ignorada: destino vazio.');
      return;
    }

    if (targetId === origin) {
      this.updateStatus(`Célula "${targetId}" já está ativa.`);
      return;
    }

    window.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: targetId },
    }));
  }

  loadCell(targetId) {
    this.profile = this.loadProfile();
    const needsProfile = targetId !== 'sistema.perfil' && !this.profile;
    const chosenId = needsProfile ? 'sistema.perfil' : targetId;

    if (needsProfile) {
      this.updateStatus('Perfil não encontrado. Redirecionando para cadastro.');
    }

    const cellEntry = this.manifest.find((entry) => entry.id === chosenId);

    if (!cellEntry) {
      this.updateStatus(`Célula "${chosenId}" não encontrada no manifesto.`);
      return;
    }

    this.isLoading = true;
    this.updateStatus(`Carregando célula "${chosenId}"...`);

    import(cellEntry.module)
      .then((module) => {
        const candidate = module.cell ?? module.default;
        const contractIssue = this.validateCellContract(candidate);

        if (contractIssue) {
          this.updateStatus(`Contrato inválido para "${chosenId}": ${contractIssue}`);
          return;
        }

        this.teardownCurrentCell();

        const context = this.createContext(chosenId);
        candidate.init(context);
        this.currentCell = candidate;
        this.currentCellId = chosenId;

        this.updateStatus(`Célula "${candidate.name}" (v${candidate.version}) carregada.`);
      })
      .catch((error) => {
        console.error(error);
        this.updateStatus(`Falha ao carregar célula "${chosenId}".`);
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
