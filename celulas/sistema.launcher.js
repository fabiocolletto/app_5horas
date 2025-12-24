const apps = [
  { label: 'Home', emoji: '🏠', background: 'linear-gradient(135deg,#d7f0fa,#fff1cf)' },
  { label: 'Perfil', emoji: '🧬', background: 'linear-gradient(135deg,#c3f0ca,#e1f6ff)' },
  { label: 'Finanças', emoji: '💰', background: 'linear-gradient(135deg,#f8e1a1,#ffe8d1)' },
  { label: 'Educação', emoji: '📚', background: 'linear-gradient(135deg,#d8d7ff,#f2e6ff)' },
  { label: 'School', emoji: '🏫', background: 'linear-gradient(135deg,#cde8ff,#e6fff7)' },
  { label: 'Bem-vindo', emoji: '✨', background: 'linear-gradient(135deg,#ffe5f1,#e6f7ff)' },
  { label: 'Agenda', emoji: '📅', background: 'linear-gradient(135deg,#fde2e4,#e2f0ff)' },
  { label: 'Docs', emoji: '📄', background: 'linear-gradient(135deg,#e0f7fa,#f1f8e9)' },
];

function createAppIcon(app) {
  const wrapper = document.createElement('button');
  wrapper.type = 'button';
  wrapper.className = 'app-icon-wrapper';
  wrapper.setAttribute('aria-label', app.label);

  const icon = document.createElement('div');
  icon.className = 'app-icon';
  icon.style.background = app.background;
  icon.textContent = app.emoji;

  const label = document.createElement('span');
  label.className = 'app-label';
  label.textContent = app.label;

  wrapper.append(icon, label);
  return wrapper;
}

export function mount(host) {
  const screen = document.createElement('section');
  screen.className = 'home-screen';

  const grid = document.createElement('div');
  grid.className = 'app-grid';

  apps.forEach((app) => grid.append(createAppIcon(app)));

  screen.append(grid);
  host.replaceChildren(screen);
}
