import { getProfile } from '../core/storage.js';
import { getState } from '../core/state.js';

function navigate(host, target) {
  if (!target) return;

  host.dispatchEvent(new CustomEvent('genoma:navigate', {
    detail: { target },
    bubbles: true,
  }));
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
  title.textContent = 'Bem-vindo ao Genoma v1.2';
  title.style.margin = '0';

  const description = document.createElement('p');
  description.textContent = 'Este é o shell inicial do Genoma. Estamos verificando dados salvos no dispositivo...';
  description.style.margin = '0';

  const status = document.createElement('p');
  status.style.margin = '0';
  status.style.opacity = '0.85';
  status.textContent = 'Aguardando verificação de dados persistidos.';

  const action = document.createElement('button');
  action.textContent = 'Ir para home';
  action.style.padding = '0.75rem 1.25rem';
  action.style.borderRadius = '12px';
  action.style.border = '1px solid rgba(255, 255, 255, 0.18)';
  action.style.background = '#5bc0be';
  action.style.color = '#0b132b';
  action.style.cursor = 'pointer';
  action.style.fontWeight = '600';
  action.disabled = true;

  action.addEventListener('click', () => {
    navigate(host, 'home');
  });

  container.append(title, description, status, action);
  host.replaceChildren(container);

  (async () => {
    action.disabled = true;

    const [profile, state] = await Promise.all([
      getProfile(),
      Promise.resolve(getState()),
    ]);

    const hasProfile = Boolean(profile && typeof profile === 'object' && (profile.nome || profile.papel));
    const preferredCell = [state?.activeCell, state?.lastCell]
      .find((name) => typeof name === 'string' && name.trim() && name !== 'sistema.welcome');

    if (preferredCell) {
      status.textContent = `Dados encontrados. Redirecionando para "${preferredCell}"...`;
      navigate(host, preferredCell);
      return;
    }

    if (hasProfile) {
      status.textContent = 'Perfil salvo encontrado. Redirecionando para home...';
      navigate(host, 'home');
      return;
    }

    status.textContent = 'Nenhum dado salvo encontrado. Você pode seguir para home.';
    description.textContent = 'Este é o shell inicial do Genoma. Use o botão abaixo para carregar a célula home.';
    action.disabled = false;
  })();
}
