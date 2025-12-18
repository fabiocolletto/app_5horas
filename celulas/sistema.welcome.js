function createButton(label, className, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.className = `btn ${className}`.trim();
  button.addEventListener('click', onClick);
  return button;
}

function createPill(text) {
  const pill = document.createElement('span');
  pill.className = 'pill';
  pill.textContent = text;
  return pill;
}

function createProfileModal(context, onProfileSaved) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Seleção de perfil do Genoma');

  const title = document.createElement('h2');
  title.textContent = 'Escolha ou cadastre um perfil';

  const subtitle = document.createElement('p');
  subtitle.className = 'muted';
  subtitle.textContent = 'O Genoma precisa de um perfil ativo para carregar as células corretas. Selecione um atalho ou personalize seus dados.';

  const inputNameRow = document.createElement('div');
  inputNameRow.className = 'input-row';
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Nome';
  const nameInput = document.createElement('input');
  nameInput.name = 'nome';
  nameInput.placeholder = 'Digite como quer ser identificado';

  const inputRoleRow = document.createElement('div');
  inputRoleRow.className = 'input-row';
  const roleLabel = document.createElement('label');
  roleLabel.textContent = 'Papel';
  const roleInput = document.createElement('input');
  roleInput.name = 'papel';
  roleInput.placeholder = 'Ex.: Operador, Gestor, Convidado';

  const stored = context.profile || {};
  nameInput.value = stored.nome || '';
  roleInput.value = stored.papel || '';

  const setInputs = (nome, papel) => {
    nameInput.value = nome;
    roleInput.value = papel;
  };

  const choiceGrid = document.createElement('div');
  choiceGrid.className = 'choice-grid';

  const shortcuts = [
    { nome: 'Operador', papel: 'Execução diária' },
    { nome: 'Gestor', papel: 'Coordenação e indicadores' },
    { nome: 'Convidado', papel: 'Visualização segura' },
  ];

  shortcuts.forEach((preset) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';

    const label = document.createElement('strong');
    label.textContent = preset.nome;

    const hint = document.createElement('span');
    hint.className = 'muted';
    hint.textContent = preset.papel;

    chip.append(label, hint);
    chip.addEventListener('click', () => setInputs(preset.nome, preset.papel));
    choiceGrid.appendChild(chip);
  });

  const actions = document.createElement('div');
  actions.className = 'actions';

  const feedback = document.createElement('p');
  feedback.className = 'muted';
  feedback.style.margin = '0';

  const close = () => {
    document.removeEventListener('keydown', handleKeyDown);
    overlay.classList.remove('is-visible');
    overlay.remove();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  const saveProfile = () => {
    const nome = nameInput.value.trim() || 'Operador';
    const papel = roleInput.value.trim() || 'Execução';

    if (typeof context.updateProfile === 'function') {
      context.updateProfile({ nome, papel });
    }

    feedback.textContent = 'Perfil salvo. Redirecionando para a home para continuar a descoberta.';

    if (typeof onProfileSaved === 'function') {
      onProfileSaved({ nome, papel });
    }

    setTimeout(() => {
      context.navigate('home');
      close();
    }, 120);
  };

  const confirm = createButton('Salvar e continuar', 'btn-primary', saveProfile);
  const cancel = createButton('Cancelar', 'btn-ghost', close);

  actions.append(confirm, cancel);

  inputNameRow.append(nameLabel, nameInput);
  inputRoleRow.append(roleLabel, roleInput);

  modal.append(title, subtitle, choiceGrid, inputNameRow, inputRoleRow, actions, feedback);
  overlay.appendChild(modal);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
    }
  });

  const open = () => {
    document.body.appendChild(overlay);
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => overlay.classList.add('is-visible'));
    requestAnimationFrame(() => nameInput.focus());
  };

  return { open, close, overlay };
}

let activeModal = null;

export const cell = {
  id: 'sistema.welcome',
  name: 'Boas-vindas',
  version: '1.4.0',
  init(context) {
    const container = document.createElement('section');
    container.className = 'cell-surface';
    container.style.display = 'grid';
    container.style.gap = '1.25rem';

    const hero = document.createElement('div');
    hero.style.display = 'grid';
    hero.style.gap = '0.35rem';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'Célula sistêmica ativa';

    const title = document.createElement('h1');
    title.textContent = 'Bem-vindo ao Genoma v1.4';
    title.style.margin = '0';

    const description = document.createElement('p');
    description.className = 'muted';
    description.textContent = 'Esta célula de boas-vindas conecta você ao manifesto, perfis e navegação do Genoma 1.4 sem violar o contrato celular.';

    const statusRow = document.createElement('div');
    statusRow.className = 'actions';
    statusRow.append(createPill('Observável'), createPill('Persistência central'), createPill('Contrato 1.4'));

    const ctas = document.createElement('div');
    ctas.className = 'actions';

    const goHome = createButton('Entrar na home', 'btn-primary', () => context.navigate('home'));
    const seeCells = createButton('Explorar células', 'btn-secondary', () => context.navigate('home'));

    let profileInfo = context.profile || { nome: 'Sem perfil', papel: 'Defina para continuar' };
    const profileBadge = document.createElement('span');
    profileBadge.className = 'pill';
    profileBadge.textContent = `${profileInfo.nome} • ${profileInfo.papel}`;

    const modal = createProfileModal(context, (profile) => {
      profileInfo = profile;
      profileBadge.textContent = `${profileInfo.nome} • ${profileInfo.papel}`;
    });
    activeModal = modal;

    const openProfile = createButton('Selecionar/editar perfil', 'btn-ghost', () => modal.open());

    ctas.append(goHome, seeCells, openProfile, profileBadge);

    hero.append(eyebrow, title, description, statusRow, ctas);

    const cards = document.createElement('div');
    cards.className = 'card-grid';

    const onboardingCard = document.createElement('div');
    onboardingCard.className = 'card';
    const onboardingTitle = document.createElement('h2');
    onboardingTitle.textContent = 'Onboarding guiado';
    const onboardingCopy = document.createElement('p');
    onboardingCopy.className = 'muted';
    onboardingCopy.textContent = 'Ative a home, escolha um perfil e avance para células temáticas. O contexto expõe apenas navegação e atualização de perfil.';
    const onboardingList = document.createElement('ul');
    onboardingList.className = 'muted';
    onboardingList.style.paddingLeft = '1.2rem';
    ['1. Acione a home pelo CTA principal.', '2. Valide seu perfil antes de abrir células.', '3. Retorne aqui para navegar entre áreas.'].forEach((step) => {
      const item = document.createElement('li');
      item.textContent = step;
      onboardingList.appendChild(item);
    });
    onboardingCard.append(onboardingTitle, onboardingCopy, onboardingList);

    const modalCard = document.createElement('div');
    modalCard.className = 'card';
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Seleção de perfil';
    const modalCopy = document.createElement('p');
    modalCopy.className = 'muted';
    modalCopy.textContent = 'Relembre o fluxo de escolha de conta ao definir quem está pilotando. Isso orienta o Genoma a carregar as células certas.';
    const modalAction = createButton('Abrir modal de perfil', 'btn-secondary', () => modal.open());
    modalCard.append(modalTitle, modalCopy, modalAction);

    const manifestoCard = document.createElement('div');
    manifestoCard.className = 'card';
    const manifestoTitle = document.createElement('h2');
    manifestoTitle.textContent = 'Contrato e manifesto';
    const manifestoCopy = document.createElement('p');
    manifestoCopy.className = 'muted';
    manifestoCopy.textContent = 'Todas as interações respeitam o contrato de célula: init(context), destroy(), navegação por eventos e atualização de perfil via core.';
    const manifestoActions = document.createElement('div');
    manifestoActions.className = 'actions';
    const goProfile = createButton('Ir para perfil', 'btn-secondary', () => context.navigate('sistema.perfil'));
    const goModel = createButton('Ver modelo canônico', 'btn-ghost', () => context.navigate('modelo.celular'));
    manifestoActions.append(goProfile, goModel);
    manifestoCard.append(manifestoTitle, manifestoCopy, manifestoActions);

    cards.append(onboardingCard, modalCard, manifestoCard);

    container.append(hero, cards);
    context.host.replaceChildren(container);
  },
  destroy() {
    if (activeModal) {
      activeModal.close();
      activeModal = null;
    }
  },
};
