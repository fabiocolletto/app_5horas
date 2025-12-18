const styles = {
  container: {
    display: 'grid',
    gap: '1rem',
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.35rem 0.75rem',
    borderRadius: '999px',
    background: 'rgba(91, 192, 190, 0.15)',
    border: '1px solid rgba(91, 192, 190, 0.5)',
    color: '#9be564',
    fontWeight: '700',
    width: 'fit-content',
  },
  list: {
    margin: 0,
    paddingLeft: '1.25rem',
    display: 'grid',
    gap: '0.5rem',
  },
  code: {
    fontFamily: 'ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    background: 'rgba(255, 255, 255, 0.06)',
    padding: '0.15rem 0.4rem',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  button: {
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    background: '#5bc0be',
    color: '#0b132b',
    cursor: 'pointer',
    fontWeight: '700',
  },
};

function applyStyles(element, styleObject = {}) {
  Object.entries(styleObject).forEach(([key, value]) => {
    element.style[key] = value;
  });
}

function createBadge(text) {
  const badge = document.createElement('span');
  applyStyles(badge, styles.badge);
  badge.textContent = text;
  return badge;
}

export const cell = {
  id: 'modelo.celular',
  name: 'Modelo Canônico',
  version: '1.3.1',
  init(context) {
    const container = document.createElement('section');
    applyStyles(container, styles.container);

    const title = document.createElement('h1');
    title.textContent = 'Contrato Mínimo de Célula';
    title.style.margin = '0';

    const badge = createBadge('v1.3.1 — contrato ativo');

    const intro = document.createElement('p');
    intro.style.margin = '0';
    intro.style.opacity = '0.9';
    intro.textContent = 'Toda célula do App 5Horas precisa atender a este contrato antes de ser carregada pelo Genoma.';

    const list = document.createElement('ul');
    applyStyles(list, styles.list);

    const fields = [
      { label: 'id', detail: 'Identificador único da célula.' },
      { label: 'name', detail: 'Nome legível apresentado em diagnósticos.' },
      { label: 'version', detail: 'Versão da célula para rastreabilidade.' },
      { label: 'init(context)', detail: 'Inicializa a célula com acesso ao host e às funções de navegação.' },
      { label: 'destroy()', detail: 'Finaliza e limpa recursos antes de sair da célula.' },
    ];

    fields.forEach(({ label, detail }) => {
      const item = document.createElement('li');
      const code = document.createElement('code');
      applyStyles(code, styles.code);
      code.textContent = label;
      item.append(code, document.createTextNode(` — ${detail}`));
      list.appendChild(item);
    });

    const observation = document.createElement('p');
    observation.style.margin = '0';
    observation.style.opacity = '0.9';
    observation.textContent = 'O Genoma somente ativa células que validam este contrato. Células legadas precisam ser adaptadas.';

    const actions = document.createElement('div');
    applyStyles(actions, styles.actions);

    const backHome = document.createElement('button');
    applyStyles(backHome, styles.button);
    backHome.textContent = 'Voltar para Home';
    backHome.addEventListener('click', () => context.navigate('home'));

    actions.append(backHome);

    container.append(title, badge, intro, list, observation, actions);
    context.host.replaceChildren(container);
  },
  destroy() {
    // Célula modelo não mantém listeners globais; nada a desmontar no momento.
  },
};
