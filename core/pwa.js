const isNavigationHandlerAvailable = typeof window !== 'undefined'
  && 'navigation' in window
  && typeof window.navigation.addEventListener === 'function';

const isLaunchQueueAvailable = typeof window !== 'undefined'
  && 'launchQueue' in window
  && typeof window.launchQueue.setConsumer === 'function';

const isFileSystemObserverAvailable = typeof window !== 'undefined'
  && 'FileSystemObserver' in window
  && typeof FileSystemObserver === 'function';

let navigationAbortController = null;
let fileSystemObserverConnection = null;

/**
 * Garante conexão com a Navigation Handler API para que o PWA capture
 * navegações externas automaticamente.
 */
export async function ensureNavigationHandlerConnection(options = {}) {
  if (navigationAbortController) {
    return { abort: () => navigationAbortController.abort() };
  }

  if (!isNavigationHandlerAvailable) {
    throw new Error(
      'Navigation Handler API indisponível; ative chrome://flags/#enable-navigation-api (ou #enable-experimental-web-platform-features) e reinicie o Chrome.',
    );
  }

  const { onIntercept } = options;
  navigationAbortController = new AbortController();

  const handleNavigation = (event) => {
    if (!event.canIntercept) {
      return;
    }

    const destinationUrl = event.destination?.url || event.destinationURL || '';
    if (typeof onIntercept === 'function') {
      event.intercept({ handler: () => onIntercept(destinationUrl) });
    }
  };

  window.navigation.addEventListener('navigate', handleNavigation, { signal: navigationAbortController.signal });

  if (isLaunchQueueAvailable && typeof onIntercept === 'function') {
    window.launchQueue.setConsumer((launchParams) => {
      const targetUrl = launchParams?.targetURL || launchParams?.url || '';
      if (targetUrl) {
        onIntercept(targetUrl);
      }
    });
  }

  return { abort: () => navigationAbortController.abort() };
}

/**
 * Garante conexão com a File System Observer API para observar alterações
 * em arquivos locais (Origin Private File System).
 */
export async function ensureFileSystemObserverConnection(options = {}) {
  if (fileSystemObserverConnection) {
    return fileSystemObserverConnection;
  }

  if (!isFileSystemObserverAvailable) {
    throw new Error(
      'File System Observer API indisponível; habilite chrome://flags/#file-system-observer (ou #enable-experimental-web-platform-features) e reinicie o Chrome.',
    );
  }

  if (!navigator?.storage?.getDirectory) {
    throw new Error('Não foi possível acessar o Origin Private File System.');
  }

  const directoryHandle = await navigator.storage.getDirectory();
  const observer = new FileSystemObserver((changes) => {
    if (typeof options.onChange === 'function') {
      options.onChange(changes);
    }
  });

  observer.observe(directoryHandle, { recursive: true });

  fileSystemObserverConnection = { observer, directoryHandle };
  return fileSystemObserverConnection;
}
