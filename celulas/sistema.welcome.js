function styleContainer(container) {
  container.style.display = 'grid';
  container.style.gap = '1rem';
  container.style.padding = '1.5rem';
  container.style.background = 'rgba(255, 255, 255, 0.04)';
  container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  container.style.borderRadius = '16px';
}

function createDeviceInfo(deviceId) {
  const wrapper = document.createElement('section');
  wrapper.style.display = 'grid';
  wrapper.style.gap = '0.5rem';
  wrapper.style.padding = '1rem';
  wrapper.style.background = 'rgba(0, 0, 0, 0.15)';
  wrapper.style.border = '1px dashed rgba(255, 255, 255, 0.2)';
  wrapper.style.borderRadius = '12px';

  const title = document.createElement('h2');
  title.textContent = 'Identidade do dispositivo';
  title.style.margin = '0';

  const normalizedId = typeof deviceId === 'string' && deviceId.trim().length > 0 ? deviceId.trim() : null;
  const fileName = normalizedId ? `genoma-state-${normalizedId}.json` : 'genoma-state.json';

  const description = document.createElement('p');
  description.style.margin = '0';
  description.style.opacity = '0.9';
  description.textContent = normalizedId
    ? `Use o ID abaixo para localizar o arquivo salvo localmente para este dispositivo (ex.: "${fileName}").`
    : 'ID do dispositivo indisponível. Use o arquivo padrão "genoma-state.json" para restaurar suas configurações.';

  const idLine = document.createElement('p');
  idLine.style.margin = '0';
  idLine.style.fontFamily = 'monospace';
  idLine.style.background = 'rgba(255, 255, 255, 0.05)';
  idLine.style.padding = '0.75rem';
  idLine.style.borderRadius = '10px';
  idLine.textContent = normalizedId || '—';

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '0.5rem';
  actions.style.flexWrap = 'wrap';

  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.textContent = 'Copiar ID';
  copyButton.style.padding = '0.6rem 1rem';
  copyButton.style.borderRadius = '10px';
  copyButton.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  copyButton.style.background = '#5bc0be';
  copyButton.style.color = '#0b132b';
  copyButton.style.cursor = 'pointer';
  copyButton.style.fontWeight = '700';

  const hint = document.createElement('span');
  hint.style.opacity = '0.9';

  copyButton.addEventListener('click', async () => {
    if (!normalizedId) {
      hint.textContent = 'ID indisponível para cópia.';
      hint.style.color = '#f7b267';
      return;
    }

    try {
      await navigator.clipboard.writeText(normalizedId);
      hint.textContent = 'ID copiado. Use-o para localizar o arquivo salvo localmente.';
      hint.style.color = '#9be564';
    } catch (error) {
      console.warn('Não foi possível copiar o ID do dispositivo.', error);
      hint.textContent = 'Não foi possível copiar automaticamente; selecione o texto e copie manualmente.';
      hint.style.color = '#f7b267';
    }
  });

  actions.append(copyButton, hint);
  wrapper.append(title, description, idLine, actions);
  return wrapper;
}

export const cell = {
  id: 'sistema.welcome',
  name: 'Boas-vindas',
  version: '1.4.0',
  init(context) {
    const container = document.createElement('section');
    styleContainer(container);

    const title = document.createElement('h1');
    title.textContent = 'Bem-vindo ao Genoma v1.4';
    title.style.margin = '0';

    const description = document.createElement('p');
    description.textContent = 'Este é o shell inicial do Genoma. Use o botão abaixo para carregar a célula home.';
    description.style.margin = '0';

    const action = document.createElement('button');
    action.textContent = 'Ir para home';
    action.style.padding = '0.75rem 1.25rem';
    action.style.borderRadius = '12px';
    action.style.border = '1px solid rgba(255, 255, 255, 0.18)';
    action.style.background = '#5bc0be';
    action.style.color = '#0b132b';
    action.style.cursor = 'pointer';
    action.style.fontWeight = '600';

    action.addEventListener('click', () => context.navigate('home'));

    const deviceInfo = createDeviceInfo(context.deviceId);

    container.append(title, description, action, deviceInfo);
    context.host.replaceChildren(container);
  },
  destroy() {
    // Nenhum recurso persistente para desmontar na célula de boas-vindas.
  },
};
