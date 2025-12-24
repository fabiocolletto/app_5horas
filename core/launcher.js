import { cellsManifest } from '../cells/manifest.js';

const iconMap = {
  School: '🏫',
};

function createAppIcon(cell, onClick) {
  const wrapper = document.createElement('button');
  wrapper.type = 'button';
  wrapper.className = 'app-icon-wrapper';
  wrapper.setAttribute('aria-label', cell.label);
  wrapper.addEventListener('click', onClick);

  const icon = document.createElement('div');
  icon.className = 'app-icon';
  icon.style.background = cell.theme?.iconBg || cell.theme?.primary || '#4A90E2';
  icon.textContent = iconMap[cell.icon] || '⬤';

  const label = document.createElement('span');
  label.className = 'app-label';
  label.textContent = cell.label;

  wrapper.append(icon, label);
  return wrapper;
}

function openCell(host, cell, onBack) {
  const shell = document.createElement('section');
  shell.className = 'app-shell';
  shell.style.setProperty('--app-color', cell.theme?.primary || '#4A90E2');

  const header = document.createElement('header');
  header.className = 'app-header';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'back-button';
  backButton.textContent = 'Voltar';
  let cleanup = null;
  backButton.addEventListener('click', () => {
    if (typeof cleanup === 'function') {
      cleanup();
    }
    onBack();
  });

  const title = document.createElement('strong');
  title.textContent = cell.label;

  header.append(backButton, title);

  const content = document.createElement('div');
  content.className = 'app-content';
  content.textContent = 'Carregando...';

  shell.append(header, content);
  host.replaceChildren(shell);

  cell
    .module()
    .then((module) => {
      if (typeof module.mount === 'function') {
        const maybeCleanup = module.mount(content);
        if (typeof maybeCleanup === 'function') {
          cleanup = maybeCleanup;
        }
        return;
      }

      content.textContent = 'Aplicativo carregado.';
    })
    .catch(() => {
      content.textContent = 'Não foi possível carregar o aplicativo.';
    });
}

export function mount(host) {
  if (!host) {
    return;
  }

  const renderLauncher = () => {
    const screen = document.createElement('section');
    screen.className = 'home-screen';

    const grid = document.createElement('div');
    grid.className = 'app-grid';

    cellsManifest.forEach((cell) => {
      const icon = createAppIcon(cell, () => openCell(host, cell, renderLauncher));
      grid.append(icon);
    });

    screen.append(grid);
    host.replaceChildren(screen);
  };

  renderLauncher();
}
