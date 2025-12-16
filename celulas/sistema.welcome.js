export function mount(host) {
  const container = document.createElement('section');
  container.style.display = 'grid';
  container.style.gap = '1rem';
  container.style.padding = '1.5rem';
  container.style.background = 'rgba(255, 255, 255, 0.04)';
  container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  container.style.borderRadius = '16px';

  const title = document.createElement('h1');
  title.textContent = 'Bem-vindo ao Genoma v1.2';
  title.style.margin = '0';

  const description = document.createElement('p');
  description.textContent = 'Este é o shell inicial do Genoma. Use o botão abaixo para carregar a célula home.';
  description.style.margin = '0';

  const action = document.createElement('button');
  action.textContent = 'Ir para home';
  action.style.padding = '0.75rem 1.25rem';
  action.style.borderRadius = '12px';
  action.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  action.style.background = '#5bc0be';
  action.style.color = '#0b132b';
  action.style.cursor = 'pointer';
  action.style.fontWeight = '600';

  action.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'home' },
      bubbles: true,
    }));
  });

  container.append(title, description, action);
  host.replaceChildren(container);
}
