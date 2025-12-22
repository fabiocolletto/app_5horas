export function mount(host) {
  const container = document.createElement('section');
  container.style.display = 'grid';
  container.style.gap = '0.75rem';
  container.style.padding = '1.5rem';
  container.style.background = 'rgba(255, 255, 255, 0.04)';
  container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  container.style.borderRadius = '16px';

  const title = document.createElement('h1');
  title.textContent = 'Home';
  title.style.margin = '0';

  const summary = document.createElement('p');
  summary.textContent = 'A célula home confirma que a navegação por eventos está ativa.';
  summary.style.margin = '0';

  const status = document.createElement('p');
  status.textContent = 'Dispare um novo evento de navegação para voltar ao welcome.';
  status.style.margin = '0';
  status.style.opacity = '0.85';

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '0.75rem';
  actions.style.flexWrap = 'wrap';

  const launcherAction = document.createElement('button');
  launcherAction.textContent = 'Abrir launcher';
  launcherAction.style.padding = '0.75rem 1.25rem';
  launcherAction.style.borderRadius = '12px';
  launcherAction.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  launcherAction.style.background = '#f7b267';
  launcherAction.style.color = '#0b132b';
  launcherAction.style.cursor = 'pointer';
  launcherAction.style.fontWeight = '700';

  launcherAction.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'sistema.launcher' },
      bubbles: true,
    }));
  });

  const action = document.createElement('button');
  action.textContent = 'Voltar para welcome';
  action.style.padding = '0.75rem 1.25rem';
  action.style.borderRadius = '12px';
  action.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  action.style.background = '#3a506b';
  action.style.color = '#e0e6ed';
  action.style.cursor = 'pointer';
  action.style.fontWeight = '600';

  action.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'sistema.welcome' },
      bubbles: true,
    }));
  });

  const profileAction = document.createElement('button');
  profileAction.textContent = 'Editar perfil';
  profileAction.style.padding = '0.75rem 1.25rem';
  profileAction.style.borderRadius = '12px';
  profileAction.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  profileAction.style.background = '#5bc0be';
  profileAction.style.color = '#0b132b';
  profileAction.style.cursor = 'pointer';
  profileAction.style.fontWeight = '700';

  profileAction.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'sistema.perfil' },
      bubbles: true,
    }));
  });

  const financeAction = document.createElement('button');
  financeAction.textContent = 'Ir para Financeiro';
  financeAction.style.padding = '0.75rem 1.25rem';
  financeAction.style.borderRadius = '12px';
  financeAction.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  financeAction.style.background = '#9be564';
  financeAction.style.color = '#0b132b';
  financeAction.style.cursor = 'pointer';
  financeAction.style.fontWeight = '700';

  financeAction.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'finance' },
      bubbles: true,
    }));
  });

  const educationAction = document.createElement('button');
  educationAction.textContent = 'Ir para Educação';
  educationAction.style.padding = '0.75rem 1.25rem';
  educationAction.style.borderRadius = '12px';
  educationAction.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  educationAction.style.background = '#5bc0be';
  educationAction.style.color = '#0b132b';
  educationAction.style.cursor = 'pointer';
  educationAction.style.fontWeight = '700';

  educationAction.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'education' },
      bubbles: true,
    }));
  });

  const schoolAction = document.createElement('button');
  schoolAction.textContent = 'Abrir app School';
  schoolAction.style.padding = '0.75rem 1.25rem';
  schoolAction.style.borderRadius = '12px';
  schoolAction.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  schoolAction.style.background = '#ffd166';
  schoolAction.style.color = '#0b132b';
  schoolAction.style.cursor = 'pointer';
  schoolAction.style.fontWeight = '700';

  schoolAction.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'app_school' },
      bubbles: true,
    }));
  });

  actions.append(launcherAction, action, profileAction, financeAction, educationAction, schoolAction);

  container.append(title, summary, status, actions);
  host.replaceChildren(container);
}
