import { ensureFileSystemObserverConnection, ensureNavigationHandlerConnection } from './core/pwa.js';
import { mount as mountSingleScreenLauncher } from './core/launcher.js';

const root = document.getElementById('genoma-root');

function normalizeErrors(errors) {
  if (Array.isArray(errors)) {
    return errors.filter(Boolean);
  }

  return errors ? [errors] : [];
}

function createBlockingMessage(errors) {
  const errorList = normalizeErrors(errors);
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
  const hasMultipleErrors = errorList.length > 1;
  message.textContent = hasMultipleErrors
    ? 'As APIs obrigatórias do PWA estão indisponíveis.'
    : errorList[0]?.message || 'Ative as APIs obrigatórias do PWA para continuar.';
  message.style.margin = '0 0 1rem';
  message.style.lineHeight = '1.5';
  message.style.opacity = '0.9';

  let errorDetails = null;
  if (hasMultipleErrors) {
    errorDetails = document.createElement('ul');
    errorDetails.style.margin = '0 0 1rem';
    errorDetails.style.paddingLeft = '1.2rem';
    errorDetails.style.lineHeight = '1.6';

    errorList.forEach((error) => {
      if (!error?.message) {
        return;
      }

      const item = document.createElement('li');
      item.textContent = error.message;
      errorDetails.append(item);
    });
  }

  const list = document.createElement('ul');
  list.style.margin = '0 0 1rem';
  list.style.paddingLeft = '1.2rem';
  list.style.lineHeight = '1.6';

  const flagNavigation = document.createElement('li');
  flagNavigation.textContent = 'chrome://flags/#enable-navigation-api';

  const flagFileSystem = document.createElement('li');
  flagFileSystem.textContent = 'chrome://flags/#file-system-observer';

  list.append(flagNavigation, flagFileSystem);

  const hint = document.createElement('p');
  hint.textContent = 'Habilite as flags acima e reinicie o navegador para continuar.';
  hint.style.margin = '0';
  hint.style.fontSize = '0.9rem';
  hint.style.opacity = '0.75';

  if (errorDetails) {
    card.append(title, message, errorDetails, list, hint);
  } else {
    card.append(title, message, list, hint);
  }
  wrapper.append(card);
  return wrapper;
}

async function bootstrap() {
  if (!root) {
    return;
  }

  const results = await Promise.allSettled([
    ensureNavigationHandlerConnection(),
    ensureFileSystemObserverConnection(),
  ]);
  const errors = [];
  const warnings = [];

  results.forEach((result) => {
    if (result.status === 'rejected') {
      errors.push(result.reason);
      return;
    }

    if (result.value?.supported === false && result.value?.reason) {
      warnings.push(result.value.reason);
    }
  });

  if (errors.length) {
    root.replaceChildren(createBlockingMessage(errors));
    return;
  }

  mountSingleScreenLauncher(root);

  if (warnings.length) {
    console.warn('APIs opcionais indisponíveis.', warnings);
  }
}

bootstrap();
