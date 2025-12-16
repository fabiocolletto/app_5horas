export function mount(host) {
  const container = document.createElement('section');
  container.style.display = 'grid';
  container.style.gap = '1rem';
  container.style.padding = '1.5rem';
  container.style.background = 'rgba(255, 255, 255, 0.04)';
  container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  container.style.borderRadius = '16px';

  const title = document.createElement('h1');
  title.textContent = 'Painel Financeiro';
  title.style.margin = '0';

  const summary = document.createElement('p');
  summary.textContent = 'Visão consolidada de indicadores financeiros da operação.';
  summary.style.margin = '0';
  summary.style.opacity = '0.9';

  const metricsGrid = document.createElement('div');
  metricsGrid.style.display = 'grid';
  metricsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
  metricsGrid.style.gap = '0.75rem';

  const metrics = [
    { label: 'Receita do mês', value: 'R$ 428.900' },
    { label: 'Custos operacionais', value: 'R$ 287.450' },
    { label: 'Margem', value: '33,0%' },
    { label: 'Pendências críticas', value: '2 contratos' },
  ];

  metrics.forEach((item) => {
    const card = document.createElement('article');
    card.style.display = 'grid';
    card.style.gap = '0.35rem';
    card.style.padding = '1rem';
    card.style.border = '1px solid rgba(255, 255, 255, 0.12)';
    card.style.borderRadius = '12px';
    card.style.background = 'rgba(255, 255, 255, 0.03)';

    const label = document.createElement('span');
    label.textContent = item.label;
    label.style.opacity = '0.8';
    label.style.fontSize = '0.95rem';

    const value = document.createElement('strong');
    value.textContent = item.value;
    value.style.fontSize = '1.25rem';

    card.append(label, value);
    metricsGrid.append(card);
  });

  const tasksTitle = document.createElement('h2');
  tasksTitle.textContent = 'Prioridades do dia';
  tasksTitle.style.margin = '0';
  tasksTitle.style.fontSize = '1.05rem';

  const taskList = document.createElement('ul');
  taskList.style.display = 'grid';
  taskList.style.gap = '0.5rem';
  taskList.style.paddingLeft = '1.25rem';
  taskList.style.margin = '0';

  const tasks = [
    'Validar atualização do fluxo de caixa projetado.',
    'Rever contratos com pendência e alinhar novos prazos.',
    'Compartilhar resumo financeiro com equipe de educação.',
  ];

  tasks.forEach((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    taskList.append(item);
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

  const educationButton = document.createElement('button');
  educationButton.textContent = 'Ir para Educação';
  educationButton.style.padding = '0.75rem 1.25rem';
  educationButton.style.borderRadius = '12px';
  educationButton.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  educationButton.style.background = '#5bc0be';
  educationButton.style.color = '#0b132b';
  educationButton.style.cursor = 'pointer';
  educationButton.style.fontWeight = '700';

  educationButton.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'education' },
      bubbles: true,
    }));
  });

  actions.append(homeButton, educationButton);

  container.append(title, summary, metricsGrid, tasksTitle, taskList, actions);
  host.replaceChildren(container);
}
