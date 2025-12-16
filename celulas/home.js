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

  container.append(title, summary, status, action);
  host.replaceChildren(container);
}
