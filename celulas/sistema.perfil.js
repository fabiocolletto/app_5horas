import { state } from '../core/state.js';

function buildExportFileName(deviceId) {
  const normalized = typeof deviceId === 'string' && deviceId.trim().length > 0 ? deviceId.trim() : '';
  return normalized ? `genoma-state-${normalized}.json` : 'genoma-state.json';
}

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

    const exportButton = createButton('Exportar configurações', '#9be564');
    const importButton = createButton('Importar', '#f7b267');
    const filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.accept = 'application/json';
    filePicker.style.display = 'none';

    exportButton.addEventListener('click', () => {
      const snapshot = state.exportState();
      const blob = new Blob([snapshot], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const downloader = document.createElement('a');
      downloader.href = url;
      const exportFileName = buildExportFileName(state.getDeviceId() || context.deviceId);
      downloader.download = exportFileName;
      downloader.click();
      URL.revokeObjectURL(url);

      feedback.textContent = `Configurações exportadas como "${exportFileName}".`;
      feedback.style.color = '#9be564';
    });

    const reportImportResult = (result) => {
      if (!result.success) {
        feedback.textContent = result.warnings.join(' ') || 'Não foi possível importar o arquivo.';
        feedback.style.color = '#f7b267';
        return;
      }

      const warnings = result.warnings.length > 0 ? ` Avisos: ${result.warnings.join(' ')}` : '';
      feedback.textContent = `Configurações importadas.${warnings}`;
      feedback.style.color = '#9be564';

      const importedProfile = state.getProfile() || { nome: '', papel: '' };
      nameInput.value = importedProfile.nome || '';
      roleInput.value = importedProfile.papel || '';
      context.profile = importedProfile;
    };

    filePicker.addEventListener('change', (event) => {
      const [file] = event.target.files || [];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const content = typeof reader.result === 'string' ? reader.result : '';
          const parsed = JSON.parse(content);
          const result = state.importState(parsed);
          reportImportResult(result);
        } catch (error) {
          feedback.textContent = 'Arquivo inválido ou corrompido.';
          feedback.style.color = '#f7b267';
        } finally {
          filePicker.value = '';
        }
      };

      reader.onerror = () => {
        feedback.textContent = 'Não foi possível ler o arquivo selecionado.';
        feedback.style.color = '#f7b267';
        filePicker.value = '';
      };

      reader.readAsText(file);
    });

    importButton.addEventListener('click', () => {
      filePicker.click();
    });

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

    form.append(nameLabel, nameInput, roleLabel, roleInput, actions, feedback, filePicker);
    actions.append(saveButton, backButton, exportButton, importButton);

    container.append(title, description, form);
    context.host.replaceChildren(container);
  },
  destroy() {
    // A célula apenas manipula elementos locais; nada a limpar globalmente.
  },
};
