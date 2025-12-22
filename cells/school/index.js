const palette = {
  ink: '#0b132b',
  sea: '#5bc0be',
  sand: '#f7b267',
  sky: '#e1efff',
  shell: '#f8fafc',
};

function createTag(text, variant = 'default') {
  const tag = document.createElement('span');
  tag.textContent = text;
  tag.style.display = 'inline-flex';
  tag.style.alignItems = 'center';
  tag.style.gap = '6px';
  tag.style.fontSize = '11px';
  tag.style.fontWeight = '800';
  tag.style.letterSpacing = '0.08em';
  tag.style.padding = '6px 10px';
  tag.style.borderRadius = '999px';

  const variants = {
    default: { background: 'rgba(11,19,43,0.06)', color: palette.ink },
    info: { background: 'rgba(91,192,190,0.18)', color: palette.ink },
    warning: { background: 'rgba(247,178,103,0.2)', color: palette.ink },
    success: { background: 'rgba(155,229,100,0.2)', color: palette.ink },
  };

  const style = variants[variant] ?? variants.default;
  tag.style.background = style.background;
  tag.style.color = style.color;

  return tag;
}

function createStat(label, value) {
  const card = document.createElement('article');
  card.style.display = 'grid';
  card.style.gap = '6px';
  card.style.padding = '14px 16px';
  card.style.borderRadius = '14px';
  card.style.background = '#fff';
  card.style.border = '1px solid rgba(11,19,43,0.06)';
  card.style.boxShadow = '0 12px 32px rgba(0,0,0,0.06)';

  const title = document.createElement('p');
  title.textContent = label;
  title.style.margin = '0';
  title.style.fontSize = '12px';
  title.style.fontWeight = '700';
  title.style.letterSpacing = '0.06em';
  title.style.textTransform = 'uppercase';
  title.style.color = 'rgba(11,19,43,0.6)';

  const strong = document.createElement('strong');
  strong.textContent = value;
  strong.style.fontSize = '20px';
  strong.style.color = palette.ink;

  card.append(title, strong);
  return card;
}

function createModuleCard(module) {
  const card = document.createElement('article');
  card.style.display = 'grid';
  card.style.gap = '10px';
  card.style.padding = '14px';
  card.style.borderRadius = '16px';
  card.style.background = '#fff';
  card.style.border = '1px solid rgba(11,19,43,0.06)';
  card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
  card.style.transition = 'transform 140ms ease, box-shadow 140ms ease';

  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-2px)';
    card.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
  });

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';

  const title = document.createElement('h3');
  title.textContent = module.title;
  title.style.margin = '0';
  title.style.fontSize = '15px';
  title.style.color = palette.ink;

  const badge = createTag(module.status, module.statusVariant);

  const description = document.createElement('p');
  description.textContent = module.description;
  description.style.margin = '0';
  description.style.opacity = '0.75';
  description.style.fontSize = '13px';
  description.style.color = palette.ink;

  const meta = document.createElement('p');
  meta.textContent = module.meta;
  meta.style.margin = '0';
  meta.style.fontSize = '12px';
  meta.style.color = 'rgba(11,19,43,0.7)';
  meta.style.fontWeight = '700';

  header.append(title, badge);
  card.append(header, description, meta);
  return card;
}

function createScheduleItem(entry) {
  const row = document.createElement('div');
  row.style.display = 'grid';
  row.style.gridTemplateColumns = '110px 1fr';
  row.style.gap = '12px';
  row.style.alignItems = 'start';

  const time = document.createElement('div');
  time.textContent = entry.time;
  time.style.fontWeight = '800';
  time.style.color = palette.ink;
  time.style.letterSpacing = '0.08em';
  time.style.fontSize = '12px';
  time.style.textTransform = 'uppercase';

  const info = document.createElement('div');
  info.style.display = 'grid';
  info.style.gap = '6px';
  info.style.padding = '12px 14px';
  info.style.borderRadius = '14px';
  info.style.background = '#fff';
  info.style.border = '1px solid rgba(11,19,43,0.06)';
  info.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';

  const title = document.createElement('strong');
  title.textContent = entry.title;
  title.style.color = palette.ink;
  title.style.fontSize = '14px';

  const detail = document.createElement('p');
  detail.textContent = entry.detail;
  detail.style.margin = '0';
  detail.style.color = 'rgba(11,19,43,0.7)';
  detail.style.fontSize = '13px';

  const tags = document.createElement('div');
  tags.style.display = 'flex';
  tags.style.flexWrap = 'wrap';
  tags.style.gap = '8px';

  entry.tags?.forEach((tag) => tags.append(createTag(tag, 'info')));

  info.append(title, detail, tags);
  row.append(time, info);
  return row;
}

function createActionButton(label, onClick, variant = 'primary') {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.style.padding = '12px 16px';
  button.style.borderRadius = '12px';
  button.style.fontWeight = '800';
  button.style.border = '1px solid transparent';
  button.style.cursor = 'pointer';
  button.style.transition = 'transform 140ms ease, box-shadow 140ms ease';

  const variants = {
    primary: { background: palette.ink, color: '#fff', shadow: '0 12px 32px rgba(11,19,43,0.25)' },
    ghost: { background: 'rgba(11,19,43,0.05)', color: palette.ink, shadow: 'none' },
  };

  const style = variants[variant] ?? variants.primary;
  button.style.background = style.background;
  button.style.color = style.color;
  button.style.boxShadow = style.shadow;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-1px)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
  });
  button.addEventListener('click', onClick);
  return button;
}

export function mount(host) {
  if (!host) return;

  const shell = document.createElement('section');
  shell.style.minHeight = '100vh';
  shell.style.display = 'flex';
  shell.style.justifyContent = 'center';
  shell.style.background = `radial-gradient(circle at 20% 20%, ${palette.sky}, #fff 40%, ${palette.shell} 100%)`;
  shell.style.padding = '24px';
  shell.style.boxSizing = 'border-box';

  const device = document.createElement('div');
  device.style.width = 'min(1080px, 100%)';
  device.style.background = '#fdfdfd';
  device.style.borderRadius = '28px';
  device.style.boxShadow = '0 24px 80px rgba(23,63,95,0.2), inset 0 0 0 1px rgba(11,19,43,0.06)';
  device.style.padding = '24px';
  device.style.display = 'grid';
  device.style.gap = '18px';
  device.style.fontFamily = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';
  device.style.color = palette.ink;

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.gap = '12px';

  const titleWrap = document.createElement('div');
  titleWrap.style.display = 'grid';
  titleWrap.style.gap = '6px';

  const title = document.createElement('h1');
  title.textContent = 'App School';
  title.style.margin = '0';
  title.style.fontSize = '22px';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Ambiente escolar com visão rápida das turmas, infraestrutura e recados.';
  subtitle.style.margin = '0';
  subtitle.style.opacity = '0.75';
  subtitle.style.fontWeight = '600';

  titleWrap.append(title, subtitle);

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '10px';

  actions.append(
    createActionButton('Voltar ao launcher', () => {
      host.dispatchEvent(new CustomEvent('genoma:navigate', {
        detail: { target: 'sistema.launcher' },
        bubbles: true,
      }));
    }, 'ghost'),
    createActionButton('Ir para home', () => {
      host.dispatchEvent(new CustomEvent('genoma:navigate', {
        detail: { target: 'home' },
        bubbles: true,
      }));
    }),
  );

  header.append(titleWrap, actions);

  const statsRow = document.createElement('div');
  statsRow.style.display = 'grid';
  statsRow.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
  statsRow.style.gap = '12px';

  [
    { label: 'Alunos ativos', value: '482' },
    { label: 'Turmas', value: '24' },
    { label: 'Ambientes', value: '18' },
    { label: 'Alertas do dia', value: '6' },
  ].forEach((stat) => statsRow.append(createStat(stat.label, stat.value)));

  const modulesSection = document.createElement('div');
  modulesSection.style.display = 'grid';
  modulesSection.style.gap = '10px';

  const modulesHeader = document.createElement('div');
  modulesHeader.style.display = 'flex';
  modulesHeader.style.justifyContent = 'space-between';
  modulesHeader.style.alignItems = 'center';

  const modulesTitle = document.createElement('h2');
  modulesTitle.textContent = 'Módulos instalados';
  modulesTitle.style.margin = '0';
  modulesTitle.style.fontSize = '14px';
  modulesTitle.style.letterSpacing = '0.06em';
  modulesTitle.style.textTransform = 'uppercase';

  modulesHeader.append(modulesTitle, createTag('Visual do mini OS', 'info'));

  const modulesGrid = document.createElement('div');
  modulesGrid.style.display = 'grid';
  modulesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(240px, 1fr))';
  modulesGrid.style.gap = '12px';

  [
    { title: 'Matrículas', status: '14 em análise', statusVariant: 'info', description: 'Candidatos aguardando documentação e aprovação.', meta: 'Visão rápida de etapas concluídas.' },
    { title: 'Turmas & horários', status: '24 turmas', statusVariant: 'default', description: 'Agenda por bloco, professor e sala.', meta: 'Atualizado em tempo real.' },
    { title: 'Infraestrutura', status: '3 alertas', statusVariant: 'warning', description: 'Ambientes e equipamentos com manutenções.', meta: 'Pendências priorizadas.' },
    { title: 'Comunicados', status: 'Novo', statusVariant: 'success', description: 'Envio de avisos para responsáveis e equipe.', meta: 'Templates prontos para uso.' },
  ].forEach((module) => modulesGrid.append(createModuleCard(module)));

  modulesSection.append(modulesHeader, modulesGrid);

  const scheduleSection = document.createElement('div');
  scheduleSection.style.display = 'grid';
  scheduleSection.style.gap = '12px';

  const scheduleTitle = document.createElement('h2');
  scheduleTitle.textContent = 'Agenda de hoje';
  scheduleTitle.style.margin = '0';
  scheduleTitle.style.fontSize = '14px';
  scheduleTitle.style.letterSpacing = '0.06em';
  scheduleTitle.style.textTransform = 'uppercase';

  const scheduleList = document.createElement('div');
  scheduleList.style.display = 'grid';
  scheduleList.style.gap = '12px';

  [
    { time: '08:00', title: 'Matemática — 2º A', detail: 'Sala 204 • Prof. Lúcia • Plano revisado', tags: ['avaliação hoje'] },
    { time: '10:30', title: 'Laboratório de Ciências', detail: 'Bloco B • Experimento guiado', tags: ['sala preparada'] },
    { time: '14:00', title: 'Reunião de responsáveis', detail: 'Auditório • 18 confirmações', tags: ['lista de presença'] },
  ].forEach((entry) => scheduleList.append(createScheduleItem(entry)));

  scheduleSection.append(scheduleTitle, scheduleList);

  const alertsSection = document.createElement('div');
  alertsSection.style.display = 'grid';
  alertsSection.style.gap = '10px';

  const alertsTitle = document.createElement('h2');
  alertsTitle.textContent = 'Recados rápidos';
  alertsTitle.style.margin = '0';
  alertsTitle.style.fontSize = '14px';
  alertsTitle.style.letterSpacing = '0.06em';
  alertsTitle.style.textTransform = 'uppercase';

  const alertsList = document.createElement('ul');
  alertsList.style.listStyle = 'none';
  alertsList.style.padding = '0';
  alertsList.style.margin = '0';
  alertsList.style.display = 'grid';
  alertsList.style.gap = '10px';

  [
    '3 alunos aguardam autorização para excursão.',
    'Equipamento de projeção do Bloco C em manutenção preventiva.',
    'Portal interno atualizado com novos modelos de comunicado.',
  ].forEach((alert) => {
    const item = document.createElement('li');
    item.style.padding = '12px 14px';
    item.style.borderRadius = '12px';
    item.style.background = '#fff';
    item.style.border = '1px solid rgba(11,19,43,0.06)';
    item.style.color = palette.ink;
    item.style.fontWeight = '600';
    item.textContent = alert;
    alertsList.append(item);
  });

  alertsSection.append(alertsTitle, alertsList);

  device.append(header, statsRow, modulesSection, scheduleSection, alertsSection);
  shell.append(device);
  host.replaceChildren(shell);
}

export function unmount(host) {
  if (host) {
    host.replaceChildren();
  }
}
