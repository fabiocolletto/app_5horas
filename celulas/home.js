function applyContainerStyles(section) {
  section.style.display = 'grid';
  section.style.gap = '0.75rem';
  section.style.padding = '1.5rem';
  section.style.background = 'rgba(255, 255, 255, 0.04)';
  section.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  section.style.borderRadius = '16px';
}

function createActionButton(label, background, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.style.padding = '0.75rem 1.25rem';
  button.style.borderRadius = '12px';
  button.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  button.style.background = background;
  button.style.color = '#0b132b';
  button.style.cursor = 'pointer';
  button.style.fontWeight = '700';
  button.addEventListener('click', onClick);
  return button;
}

export const cell = {
  id: 'home',
  name: 'Home',
  version: '1.4.0',
  init(context) {
    const container = document.createElement('section');
    applyContainerStyles(container);

    const title = document.createElement('h1');
    title.textContent = 'Home';
    title.style.margin = '0';

    const summary = document.createElement('p');
    summary.textContent = 'A célula home confirma que a navegação por eventos está ativa.';
    summary.style.margin = '0';

    const status = document.createElement('p');
    status.textContent = 'Escolha uma célula para navegar.';
    status.style.margin = '0';
    status.style.opacity = '0.85';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '0.75rem';
    actions.style.flexWrap = 'wrap';

    const toWelcome = createActionButton('Voltar para welcome', '#3a506b', () => context.navigate('sistema.welcome'));
    toWelcome.style.color = '#e0e6ed';
    const editProfile = createActionButton('Editar perfil', '#5bc0be', () => context.navigate('sistema.perfil'));
    const finance = createActionButton('Ir para Financeiro', '#9be564', () => context.navigate('finance'));
    const education = createActionButton('Ir para Educação', '#5bc0be', () => context.navigate('education'));
    const contract = createActionButton('Ver modelo canônico', '#f7b267', () => context.navigate('modelo.celular'));

    actions.append(toWelcome, editProfile, finance, education, contract);

    container.append(title, summary, status, actions);
    context.host.replaceChildren(container);
  },
  destroy() {
    // Nenhum recurso persistente para limpar nesta célula.
  },
};
