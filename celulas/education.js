function styleBadge(badge, background) {
  badge.style.display = 'inline-block';
  badge.style.width = 'fit-content';
  badge.style.padding = '0.35rem 0.6rem';
  badge.style.borderRadius = '999px';
  badge.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  badge.style.background = background;
  badge.style.color = '#0b132b';
  badge.style.fontWeight = '700';
  badge.style.fontSize = '0.9rem';
}

function createButton(label, background, color = '#0b132b') {
  const button = document.createElement('button');
  button.textContent = label;
  button.style.padding = '0.75rem 1.25rem';
  button.style.borderRadius = '12px';
  button.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  button.style.background = background;
  button.style.color = color;
  button.style.cursor = 'pointer';
  button.style.fontWeight = '700';
  return button;
}

export const cell = {
  id: 'education',
  name: 'Trilhas de Educação',
  version: '1.3.1',
  init(context) {
    const container = document.createElement('section');
    container.style.display = 'grid';
    container.style.gap = '1rem';
    container.style.padding = '1.5rem';
    container.style.background = 'rgba(255, 255, 255, 0.04)';
    container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    container.style.borderRadius = '16px';

    const title = document.createElement('h1');
    title.textContent = 'Trilhas de Educação';
    title.style.margin = '0';

    const description = document.createElement('p');
    description.textContent = 'Material em andamento para capacitar a equipe em finanças e operação.';
    description.style.margin = '0';
    description.style.opacity = '0.9';

    const modulesGrid = document.createElement('div');
    modulesGrid.style.display = 'grid';
    modulesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
    modulesGrid.style.gap = '0.75rem';

    const modules = [
      { title: 'Fundamentos do orçamento', status: 'Concluído', badgeColor: '#9be564' },
      { title: 'Fluxo de caixa tático', status: 'Em andamento', badgeColor: '#f7b267' },
      { title: 'Integração com finanças', status: 'Próximo', badgeColor: '#5bc0be' },
    ];

    modules.forEach((module) => {
      const card = document.createElement('article');
      card.style.display = 'grid';
      card.style.gap = '0.4rem';
      card.style.padding = '1rem';
      card.style.border = '1px solid rgba(255, 255, 255, 0.12)';
      card.style.borderRadius = '12px';
      card.style.background = 'rgba(255, 255, 255, 0.03)';

      const moduleTitle = document.createElement('strong');
      moduleTitle.textContent = module.title;
      moduleTitle.style.fontSize = '1.05rem';

      const badge = document.createElement('span');
      badge.textContent = module.status;
      styleBadge(badge, module.badgeColor);

      const note = document.createElement('p');
      note.textContent = 'Disponível para leitura offline no repositório interno.';
      note.style.margin = '0';
      note.style.opacity = '0.85';

      card.append(moduleTitle, badge, note);
      modulesGrid.append(card);
    });

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '0.75rem';
    actions.style.flexWrap = 'wrap';

    const homeButton = createButton('Voltar para home', '#3a506b', '#e0e6ed');
    homeButton.addEventListener('click', () => context.navigate('home'));

    const financeButton = createButton('Ver Financeiro', '#5bc0be');
    financeButton.addEventListener('click', () => context.navigate('finance'));

    actions.append(homeButton, financeButton);

    container.append(title, description, modulesGrid, actions);
    context.host.replaceChildren(container);
  },
  destroy() {
    // Não há timers ou listeners globais a remover aqui.
  },
};
