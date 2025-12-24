import { ensureFileSystemObserverConnection, ensureNavigationHandlerConnection } from './core/pwa.js';
import { mount as mountSingleScreenLauncher } from './core/launcher.js';

const root = document.getElementById('genoma-root');

function createBlockingMessage(error) {
  const wrapper = document.createElement('section');
  wrapper.style.minHeight = '100vh';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.padding = '2rem';
  wrapper.style.background = 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)';
  wrapper.style.color = '#fdfdfd';
  wrapper.style.fontFamily = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';

  const card = document.createElement('div');
  card.style.maxWidth = '520px';
  card.style.background = 'rgba(255, 255, 255, 0.08)';
  card.style.borderRadius = '24px';
  card.style.padding = '2rem';
  card.style.boxShadow = '0 20px 60px rgba(0,0,0,0.35)';
  card.style.border = '1px solid rgba(255, 255, 255, 0.12)';

  const title = document.createElement('h1');
  title.textContent = 'Conexões obrigatórias indisponíveis';
  title.style.margin = '0 0 0.75rem';
  title.style.fontSize = '1.25rem';
  title.style.fontWeight = '700';

  const message = document.createElement('p');
  message.textContent = error?.message || 'Ative as APIs obrigatórias do PWA para continuar.';
  message.style.margin = '0 0 1.5rem';
  message.style.lineHeight = '1.5';
  message.style.opacity = '0.9';

  const hint = document.createElement('p');
  hint.textContent = 'Habilite as flags do Chrome para Navigation Handler e File System Observer e reinicie o navegador.';
  hint.style.margin = '0';
  hint.style.fontSize = '0.9rem';
  hint.style.opacity = '0.75';

  card.append(title, message, hint);
  wrapper.append(card);
  return wrapper;
}

async function bootstrap() {
  if (!root) {
    return;
  }

  try {
    await ensureNavigationHandlerConnection();
    await ensureFileSystemObserverConnection();
  } catch (error) {
    root.replaceChildren(createBlockingMessage(error));
    return;
  }

  mountSingleScreenLauncher(root);
}

bootstrap();
