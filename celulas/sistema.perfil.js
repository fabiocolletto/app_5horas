function styleInput(input) {
  input.style.padding = '0.75rem';
  input.style.borderRadius = '10px';
  input.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  input.style.background = 'rgba(255, 255, 255, 0.04)';
  input.style.color = '#e0e6ed';
}

function createButton(label, background, color = '#0b132b') {
  const button = document.createElement('button');
  button.type = 'button';
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
  id: 'sistema.perfil',
  name: 'Perfil do Genoma',
  version: '1.4.0',
  init(context) {
    const container = document.createElement('section');
    container.style.display = 'grid';
    container.style.gap = '1rem';
    container.style.padding = '1.5rem';
    container.style.background = 'rgba(255, 255, 255, 0.04)';
    container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    container.style.borderRadius = '16px';

    const title = document.createElement('h1');
    title.textContent = 'Perfil do Genoma';
    title.style.margin = '0';

    const description = document.createElement('p');
    description.textContent = 'Cadastre ou edite seu perfil para liberar as demais células.';
    description.style.margin = '0';
    description.style.opacity = '0.9';

    const form = document.createElement('form');
    form.style.display = 'grid';
    form.style.gap = '0.75rem';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Nome';
    nameLabel.style.fontWeight = '600';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'nome';
    nameInput.required = true;
    nameInput.placeholder = 'Digite seu nome';
    styleInput(nameInput);

    const roleLabel = document.createElement('label');
    roleLabel.textContent = 'Papel';
    roleLabel.style.fontWeight = '600';

    const roleInput = document.createElement('input');
    roleInput.type = 'text';
    roleInput.name = 'papel';
    roleInput.required = true;
    roleInput.placeholder = 'Ex: Operador, Gestor';
    styleInput(roleInput);

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '0.75rem';
    actions.style.flexWrap = 'wrap';

    const saveButton = createButton('Salvar perfil', '#5bc0be');
    saveButton.type = 'submit';

    const backButton = createButton('Voltar ao welcome', '#3a506b', '#e0e6ed');
    backButton.addEventListener('click', () => context.navigate('sistema.welcome'));

    const feedback = document.createElement('p');
    feedback.style.margin = '0';
    feedback.style.opacity = '0.9';

    const stored = context.profile || { nome: '', papel: '' };
    nameInput.value = stored.nome;
    roleInput.value = stored.papel;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const nome = nameInput.value.trim();
      const papel = roleInput.value.trim();

      if (!nome || !papel) {
        feedback.textContent = 'Informe nome e papel para continuar.';
        feedback.style.color = '#f7b267';
        return;
      }

      if (typeof context.updateProfile === 'function') {
        context.updateProfile({ nome, papel });
      }
      feedback.textContent = 'Perfil salvo com sucesso. Redirecionando para home.';
      feedback.style.color = '#9be564';

      context.navigate('home');
    });

    form.append(nameLabel, nameInput, roleLabel, roleInput, actions, feedback);
    actions.append(saveButton, backButton);

    container.append(title, description, form);
    context.host.replaceChildren(container);
  },
  destroy() {
    // A célula apenas manipula elementos locais; nada a limpar globalmente.
  },
};
