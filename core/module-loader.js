const BABEL_CDN_URL = 'https://unpkg.com/@babel/standalone/babel.min.js';

async function ensureBabelReady() {
  if (window.Babel) {
    return window.Babel;
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = BABEL_CDN_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Não foi possível carregar o Babel Standalone.'));
    document.head.append(script);
  });

  return window.Babel;
}

export async function importJSXModule(modulePath) {
  const Babel = await ensureBabelReady();
  const response = await fetch(modulePath);

  if (!response.ok) {
    throw new Error(`Não foi possível carregar o módulo ${modulePath}.`);
  }

  const source = await response.text();
  const { code } = Babel.transform(source, {
    filename: modulePath,
    presets: [['react', { runtime: 'classic' }]],
    sourceType: 'module',
  });

  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);

  try {
    return await import(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}
