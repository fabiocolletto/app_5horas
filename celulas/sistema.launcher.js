function createStatusBar() {
  const bar = document.createElement('div');
  bar.style.display = 'flex';
  bar.style.justifyContent = 'space-between';
  bar.style.alignItems = 'center';
  bar.style.fontSize = '12px';
  bar.style.fontWeight = '700';
  bar.style.opacity = '0.9';
  bar.style.color = '#0b132b';

  const time = document.createElement('span');
  time.textContent = '05:00';

  const signals = document.createElement('div');
  signals.style.display = 'flex';
  signals.style.gap = '6px';
  signals.style.alignItems = 'center';
  signals.innerHTML = `
    <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#2ec4b6;"></span>
    <span style="display:inline-block;width:14px;height:8px;border-radius:4px;border:2px solid #0b132b;position:relative;">
      <span style="position:absolute;inset:2px;border-radius:2px;background:#0b132b;"></span>
    </span>
    <span style="display:inline-block;width:18px;height:10px;border-radius:3px;border:2px solid #0b132b;position:relative;">
      <span style="position:absolute;inset:2px;border-radius:2px;background:linear-gradient(90deg,#0b132b 60%,transparent 0%);"></span>
    </span>
  `;

  bar.append(time, signals);
  return bar;
}

function createAppButton(app, host) {
  const button = document.createElement('button');
  button.type = 'button';
  button.style.display = 'grid';
  button.style.gap = '8px';
  button.style.justifyItems = 'center';
  button.style.padding = '10px';
  button.style.border = 'none';
  button.style.background = 'transparent';
  button.style.cursor = 'pointer';
  button.style.transition = 'transform 140ms ease, opacity 140ms ease';
  button.style.color = '#0b132b';

  const icon = document.createElement('div');
  icon.style.display = 'grid';
  icon.style.placeItems = 'center';
  icon.style.width = '64px';
  icon.style.height = '64px';
  icon.style.borderRadius = '18px';
  icon.style.background = app.background;
  icon.style.boxShadow = '0 12px 36px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.4)';
  icon.style.fontSize = '26px';
  icon.textContent = app.emoji;

  const label = document.createElement('span');
  label.textContent = app.label;
  label.style.fontSize = '12px';
  label.style.fontWeight = '700';
  label.style.letterSpacing = '0.02em';

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px) scale(1.02)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0) scale(1)';
  });
  button.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: app.target },
      bubbles: true,
    }));
  });

  button.append(icon, label);
  return button;
}

export function mount(host) {
  const wrapper = document.createElement('section');
  wrapper.style.minHeight = '100vh';
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'center';
  wrapper.style.alignItems = 'center';
  wrapper.style.padding = '1.5rem';
  wrapper.style.background = 'radial-gradient(circle at 20% 20%, #d9f0ff 0%, #f4f8ff 35%, #e6f7ff 60%, #fdf6e3 100%)';

  const device = document.createElement('div');
  device.style.width = 'min(420px, 100%)';
  device.style.background = '#fdfdfd';
  device.style.borderRadius = '28px';
  device.style.boxShadow = '0 24px 80px rgba(23,63,95,0.25), inset 0 0 0 1px rgba(11,19,43,0.06)';
  device.style.padding = '18px 18px 26px';
  device.style.display = 'grid';
  device.style.gap = '16px';
  device.style.fontFamily = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';
  device.style.color = '#0b132b';
  device.style.position = 'relative';

  const notch = document.createElement('div');
  notch.style.position = 'absolute';
  notch.style.top = '8px';
  notch.style.left = '50%';
  notch.style.transform = 'translateX(-50%)';
  notch.style.width = '120px';
  notch.style.height = '18px';
  notch.style.background = '#111827';
  notch.style.borderRadius = '12px';
  notch.style.opacity = '0.08';

  const statusBar = createStatusBar();

  const title = document.createElement('div');
  title.style.display = 'flex';
  title.style.justifyContent = 'space-between';
  title.style.alignItems = 'center';

  const heading = document.createElement('div');
  heading.style.display = 'grid';
  heading.style.gap = '2px';

  const titleText = document.createElement('h1');
  titleText.textContent = 'Seu sistema 5 Horas';
  titleText.style.margin = '0';
  titleText.style.fontSize = '18px';
  titleText.style.letterSpacing = '0.01em';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Apps instalados';
  subtitle.style.margin = '0';
  subtitle.style.opacity = '0.7';
  subtitle.style.fontSize = '12px';
  subtitle.style.fontWeight = '700';
  subtitle.style.letterSpacing = '0.04em';

  heading.append(titleText, subtitle);

  const indicator = document.createElement('div');
  indicator.textContent = '● ● ●';
  indicator.style.letterSpacing = '4px';
  indicator.style.fontSize = '12px';
  indicator.style.opacity = '0.6';

  title.append(heading, indicator);

  const appGrid = document.createElement('div');
  appGrid.style.display = 'grid';
  appGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(80px, 1fr))';
  appGrid.style.gap = '14px 12px';
  appGrid.style.marginTop = '6px';

  const apps = [
    { label: 'Home', target: 'home', emoji: '🏠', background: 'linear-gradient(135deg,#d7f0fa,#fff1cf)' },
    { label: 'Perfil', target: 'sistema.perfil', emoji: '🧬', background: 'linear-gradient(135deg,#c3f0ca,#e1f6ff)' },
    { label: 'Finanças', target: 'finance', emoji: '💰', background: 'linear-gradient(135deg,#f8e1a1,#ffe8d1)' },
    { label: 'Educação', target: 'education', emoji: '📚', background: 'linear-gradient(135deg,#d8d7ff,#f2e6ff)' },
    { label: 'School', target: 'app_school', emoji: '🏫', background: 'linear-gradient(135deg,#cde8ff,#e6fff7)' },
    { label: 'Bem-vindo', target: 'sistema.welcome', emoji: '✨', background: 'linear-gradient(135deg,#ffe5f1,#e6f7ff)' },
  ];

  apps.forEach((app) => appGrid.append(createAppButton(app, host)));

  const dock = document.createElement('div');
  dock.style.display = 'flex';
  dock.style.justifyContent = 'space-around';
  dock.style.alignItems = 'center';
  dock.style.padding = '10px 12px';
  dock.style.background = 'rgba(255,255,255,0.78)';
  dock.style.borderRadius = '14px';
  dock.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(11,19,43,0.06)';
  dock.style.backdropFilter = 'blur(10px)';

  ['Pesquisar', 'Explorar', 'Ajustes'].forEach((action, index) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.textContent = action;
    pill.style.border = 'none';
    pill.style.background = index === 0 ? '#0b132b' : 'rgba(11,19,43,0.06)';
    pill.style.color = index === 0 ? '#fdfdfd' : '#0b132b';
    pill.style.padding = '10px 14px';
    pill.style.borderRadius = '12px';
    pill.style.fontWeight = '700';
    pill.style.fontSize = '12px';
    pill.style.cursor = 'pointer';
    pill.style.boxShadow = index === 0 ? '0 12px 24px rgba(11,19,43,0.25)' : 'none';
    pill.style.transition = 'transform 140ms ease, box-shadow 140ms ease';
    pill.addEventListener('mouseenter', () => {
      pill.style.transform = 'translateY(-2px)';
      pill.style.boxShadow = '0 10px 24px rgba(11,19,43,0.18)';
    });
    pill.addEventListener('mouseleave', () => {
      pill.style.transform = 'translateY(0)';
      pill.style.boxShadow = index === 0 ? '0 12px 24px rgba(11,19,43,0.25)' : 'none';
    });
    dock.append(pill);
  });

  device.append(notch, statusBar, title, appGrid, dock);
  wrapper.append(device);
  host.replaceChildren(wrapper);
}

export function unmount(host) {
  if (host) {
    host.replaceChildren();
  }
}
