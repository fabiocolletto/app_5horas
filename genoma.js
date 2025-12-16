import { cellsManifest } from './cells.manifest.js';

class Genoma {
  constructor() {
    this.root = document.getElementById('genoma-root');
    this.status = document.getElementById('genoma-status');
    this.manifest = Array.isArray(cellsManifest) ? cellsManifest : [];

    this.defaultCell = 'sistema.welcome';

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
    const cell = this.manifest.find((entry) => entry.name === name);

    if (!cell) {
      this.updateStatus(`Célula "${name}" não encontrada no manifesto.`);
      return;
    }

    import(cell.module)
      .then((module) => {
        if (typeof module.mount !== 'function') {
          this.updateStatus(`Célula "${name}" não expõe a função mount.`);
          return;
        }

        if (this.root) {
          this.root.replaceChildren();
          module.mount(this.root);
        }
        this.updateStatus(`Célula "${name}" carregada.`);
      })
      .catch((error) => {
        console.error(error);
        this.updateStatus(`Falha ao carregar célula "${name}".`);
      });
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
