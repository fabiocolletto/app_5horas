import { cellsManifest } from './cells.manifest.js';
import { events, EVENT_TYPES } from './core/events.js';
import { logger } from './core/logger.js';
import { state } from './core/state.js';

class Genoma {
  constructor() {
    this.root = document.getElementById('genoma-root');
    this.status = document.getElementById('genoma-status');
    this.manifest = Array.isArray(cellsManifest) ? cellsManifest : [];
    this.events = events;
    this.logger = logger;
    this.state = state;
    this.deviceId = this.state.getDeviceId();
    this.profile = this.state.getProfile();
    this.currentCellId = this.state.getActiveCell();
    this.currentCell = null;
    this.isLoading = false;

    const restoredCell = this.currentCellId || this.state.getLastCell();
    this.defaultCell = restoredCell || (this.profile ? 'home' : 'sistema.perfil');

    this.ensureDeviceIdentity();
    this.reportDebugMode();
    this.registerNavigation();
    this.reportBootstrap();
    this.loadDefaultCell();
  }

  ensureDeviceIdentity() {
    const existing = this.state.getDeviceId();

    if (existing) {
      this.deviceId = existing;
      this.updateStatus('Identidade do dispositivo carregada.');
      return;
    }

    const generated = crypto.randomUUID();
    this.deviceId = generated;
    this.state.setDeviceId(generated);
    this.updateStatus('Identidade do dispositivo gerada.');
  }

  reportDebugMode() {
    if (this.logger.isDebugEnabled()) {
      this.updateStatus('Modo debug ativado.');
    }
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
    this.logger.debug('Manifesto analisado.', { total });
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

    this.events.emit(EVENT_TYPES.CELL_DESTROY, { id: this.currentCellId });
    this.logger.debug(`Destruindo célula "${this.currentCellId}".`);

    try {
      this.currentCell.destroy();
    } catch (error) {
      this.handleCellError(this.currentCellId, error, 'destroy');
    }

    if (this.root) {
      this.root.replaceChildren();
    }

    this.currentCell = null;
    this.currentCellId = null;
    this.state.setActiveCell(null);
  }

  createContext(targetId) {
    return {
      host: this.root,
      profile: this.profile,
      deviceId: this.deviceId,
      preferences: this.state.getPreferences(),
      updateProfile: (data) => this.setProfile(data),
      updatePreferences: (patch) => this.state.updatePreferences(patch),
      navigate: (destination) => this.navigate(destination, targetId),
      events: this.events,
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
    this.profile = this.state.getProfile();
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
    this.events.emit(EVENT_TYPES.CELL_LOAD, { id: chosenId, origin: this.currentCellId });

    import(cellEntry.module)
      .then((module) => {
        const candidate = module.cell ?? module.default;
        const contractIssue = this.validateCellContract(candidate);

        if (contractIssue) {
          this.handleCellError(chosenId, new Error(contractIssue), 'contract');
          return;
        }

        this.teardownCurrentCell();

        const context = this.createContext(chosenId);
        this.events.emit(EVENT_TYPES.CELL_INIT, { id: chosenId, name: candidate.name, version: candidate.version });

        try {
          candidate.init(context);
          this.currentCell = candidate;
          this.currentCellId = chosenId;
          this.state.setActiveCell(chosenId);
          this.events.emit(EVENT_TYPES.CELL_READY, { id: chosenId, name: candidate.name, version: candidate.version });
          this.updateStatus(`Célula "${candidate.name}" (v${candidate.version}) carregada.`);
        } catch (error) {
          this.handleCellError(chosenId, error, 'init');
        }
      })
      .catch((error) => {
        this.handleCellError(chosenId, error, 'load');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  handleCellError(cellId, error, stage) {
    this.events.emit(EVENT_TYPES.CELL_ERROR, { id: cellId, stage, error });
    this.logger.error(`Erro na célula "${cellId}" durante ${stage ?? 'execução'}.`, error);
    this.updateStatus(`Falha ao processar célula "${cellId}" na etapa "${stage || 'execução'}".`);
  }

  updateStatus(message) {
    if (this.status) {
      this.status.textContent = message;
    }

    this.logger.info(message);
  }

  setProfile(profile) {
    this.profile = this.state.setProfile(profile);
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
