// Manifesto declarativo de células do Genoma v1.2
// Cada entrada deve seguir o formato: { name: 'celula.nome', module: './celulas/arquivo.js' }

export const cellsManifest = [
  { name: 'sis_genoma', module: './core/genoma.js' },
  { name: 'app_school', module: './cells/school/index.js' }
];
