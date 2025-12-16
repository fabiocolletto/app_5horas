import { cellsManifest } from './cells.manifest.js';

class Genoma {
  constructor() {
    this.root = document.getElementById('genoma-root');
    this.status = document.getElementById('genoma-status');
    this.manifest = Array.isArray(cellsManifest) ? cellsManifest : [];
    this.profileKey = 'genoma.profile';
    this.profile = this.loadProfile();

    this.defaultCell = this.profile ? 'home' : 'sistema.perfil';

    this.registerNavigation();
    this.reportBootstrap();
    this.loadDefaultCell();
  }

  registerNavigation() {
    window.addEventListener('genoma:navigate', (event) => {
      const target = event.detail?.target;
      if (!target) {
        this.updateStatus('Evento de navegação recebido sem destino.');
        return;
      }
      this.loadCell(target);
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

    import(cell.module)
      .then((module) => {
        if (typeof module.mount !== 'function') {
          this.updateStatus(`Célula "${targetName}" não expõe a função mount.`);
          return;
        }

        if (this.root) {
          this.root.replaceChildren();
          module.mount(this.root);
        }
        this.updateStatus(`Célula "${targetName}" carregada.`);
      })
      .catch((error) => {
        console.error(error);
        this.updateStatus(`Falha ao carregar célula "${targetName}".`);
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
