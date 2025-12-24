const BABEL_CDN_URL = 'https://unpkg.com/@babel/standalone/babel.min.js';
const BARE_IMPORT_MAP = {
  react: 'https://esm.sh/react@18.3.1',
  'react-dom/client': 'https://esm.sh/react-dom@18.3.1/client',
  'lucide-react': 'https://esm.sh/lucide-react@0.474.0?deps=react@18.3.1',
};

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

function resolveBareImports(source) {
  const replaceSpecifier = (match, specifier) => {
    const mapped = BARE_IMPORT_MAP[specifier];
    return mapped ? match.replace(specifier, mapped) : match;
  };

  return source
    .replace(/from\s+['"]([^'"]+)['"]/g, replaceSpecifier)
    .replace(/import\s+['"]([^'"]+)['"]/g, replaceSpecifier);
}

export async function importJSXModule(modulePath) {
  const Babel = await ensureBabelReady();
  const response = await fetch(modulePath);

  if (!response.ok) {
    throw new Error(`Não foi possível carregar o módulo ${modulePath}.`);
  }

  const source = await response.text();
  const resolvedSource = resolveBareImports(source);
  const { code } = Babel.transform(resolvedSource, {
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
