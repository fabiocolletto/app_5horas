function styleContainer(container) {
  container.style.display = 'grid';
  container.style.gap = '1rem';
  container.style.padding = '1.5rem';
  container.style.background = 'rgba(255, 255, 255, 0.04)';
  container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  container.style.borderRadius = '16px';
}

export const cell = {
  id: 'sistema.welcome',
  name: 'Boas-vindas',
  version: '1.4.0',
  init(context) {
    const container = document.createElement('section');
    styleContainer(container);

    const title = document.createElement('h1');
    title.textContent = 'Bem-vindo ao Genoma v1.4';
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

    action.addEventListener('click', () => context.navigate('home'));

    container.append(title, description, action);
    context.host.replaceChildren(container);
  },
  destroy() {
    // Nenhum recurso persistente para desmontar na célula de boas-vindas.
  },
};
