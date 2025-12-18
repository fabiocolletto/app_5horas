import { getProfile, saveProfile } from '../core/storage.js';

async function readProfile() {
  const profile = await getProfile();

  if (!profile) {
    return { nome: '', papel: '' };
  }

  return {
    nome: typeof profile?.nome === 'string' ? profile.nome : '',
    papel: typeof profile?.papel === 'string' ? profile.papel : '',
  };
}

export function mount(host) {
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
  nameInput.style.padding = '0.75rem';
  nameInput.style.borderRadius = '10px';
  nameInput.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  nameInput.style.background = 'rgba(255, 255, 255, 0.04)';
  nameInput.style.color = '#e0e6ed';

  const roleLabel = document.createElement('label');
  roleLabel.textContent = 'Papel';
  roleLabel.style.fontWeight = '600';

  const roleInput = document.createElement('input');
  roleInput.type = 'text';
  roleInput.name = 'papel';
  roleInput.required = true;
  roleInput.placeholder = 'Ex: Operador, Gestor';
  roleInput.style.padding = '0.75rem';
  roleInput.style.borderRadius = '10px';
  roleInput.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  roleInput.style.background = 'rgba(255, 255, 255, 0.04)';
  roleInput.style.color = '#e0e6ed';

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '0.75rem';
  actions.style.flexWrap = 'wrap';

  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.textContent = 'Salvar perfil';
  saveButton.style.padding = '0.75rem 1.25rem';
  saveButton.style.borderRadius = '12px';
  saveButton.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  saveButton.style.background = '#5bc0be';
  saveButton.style.color = '#0b132b';
  saveButton.style.cursor = 'pointer';
  saveButton.style.fontWeight = '700';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.textContent = 'Voltar ao welcome';
  backButton.style.padding = '0.75rem 1.25rem';
  backButton.style.borderRadius = '12px';
  backButton.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  backButton.style.background = '#3a506b';
  backButton.style.color = '#e0e6ed';
  backButton.style.cursor = 'pointer';
  backButton.style.fontWeight = '700';

  const feedback = document.createElement('p');
  feedback.style.margin = '0';
  feedback.style.opacity = '0.9';
  feedback.style.padding = '0.75rem';
  feedback.style.borderRadius = '12px';
  feedback.style.display = 'none';

  function showFeedback(type, message) {
    feedback.textContent = message;
    feedback.style.display = 'block';

    const styles = {
      success: {
        background: 'rgba(155, 229, 100, 0.12)',
        color: '#c2ff9d',
        border: '1px solid rgba(155, 229, 100, 0.45)',
      },
      warning: {
        background: 'rgba(247, 178, 103, 0.12)',
        color: '#f7b267',
        border: '1px solid rgba(247, 178, 103, 0.45)',
      },
      error: {
        background: 'rgba(244, 93, 72, 0.12)',
        color: '#ffb3b3',
        border: '1px solid rgba(244, 93, 72, 0.45)',
      },
      info: {
        background: 'rgba(91, 192, 190, 0.12)',
        color: '#d8ffff',
        border: '1px solid rgba(91, 192, 190, 0.35)',
      },
    };

    const palette = styles[type] ?? styles.info;
    feedback.style.background = palette.background;
    feedback.style.color = palette.color;
    feedback.style.border = palette.border;
  }

  readProfile()
    .then((stored) => {
      nameInput.value = stored.nome;
      roleInput.value = stored.papel;
    })
    .catch(() => {
      nameInput.value = '';
      roleInput.value = '';
    });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = nameInput.value.trim();
    const papel = roleInput.value.trim();

    if (!nome || !papel) {
      showFeedback('warning', 'Informe nome e papel para continuar.');
      return;
    }

    saveButton.disabled = true;
    saveButton.textContent = 'Salvando...';
    saveButton.style.opacity = '0.7';
    showFeedback('info', 'Salvando perfil...');

    try {
      await saveProfile({ nome, papel });
      showFeedback('success', 'Perfil salvo com sucesso. Redirecionando para home.');

      host.dispatchEvent(new CustomEvent('genoma:navigate', {
        detail: { target: 'home' },
        bubbles: true,
      }));
    } catch (error) {
      console.error('Erro ao salvar perfil', error);
      showFeedback('error', 'Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = 'Salvar perfil';
      saveButton.style.opacity = '1';
    }
  });

  backButton.addEventListener('click', () => {
    host.dispatchEvent(new CustomEvent('genoma:navigate', {
      detail: { target: 'sistema.welcome' },
      bubbles: true,
    }));
  });

  form.append(nameLabel, nameInput, roleLabel, roleInput, actions, feedback);
  actions.append(saveButton, backButton);

  container.append(title, description, form);
  host.replaceChildren(container);
}
