export function mount(host) {
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
    badge.style.display = 'inline-block';
    badge.style.width = 'fit-content';
    badge.style.padding = '0.35rem 0.6rem';
    badge.style.borderRadius = '999px';
    badge.style.border = '1px solid rgba(255, 255, 255, 0.18)';
    badge.style.background = module.badgeColor;
    badge.style.color = '#0b132b';
    badge.style.fontWeight = '700';
    badge.style.fontSize = '0.9rem';

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

  const homeButton = document.createElement('button');
  homeButton.textContent = 'Voltar para home';
  homeButton.style.padding = '0.75rem 1.25rem';
  homeButton.style.borderRadius = '12px';
  homeButton.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  homeButton.style.background = '#3a506b';
  homeButton.style.color = '#e0e6ed';
  homeButton.style.cursor = 'pointer';
  homeButton.style.fontWeight = '700';

  homeButton.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'home' },
      bubbles: true,
    }));
  });

  const financeButton = document.createElement('button');
  financeButton.textContent = 'Ver Financeiro';
  financeButton.style.padding = '0.75rem 1.25rem';
  financeButton.style.borderRadius = '12px';
  financeButton.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  financeButton.style.background = '#5bc0be';
  financeButton.style.color = '#0b132b';
  financeButton.style.cursor = 'pointer';
  financeButton.style.fontWeight = '700';

  financeButton.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'finance' },
      bubbles: true,
    }));
  });

  actions.append(homeButton, financeButton);

  container.append(title, description, modulesGrid, actions);
  host.replaceChildren(container);
}
