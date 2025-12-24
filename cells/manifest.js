import { importJSXModule } from '../core/module-loader.js';

export const cellsManifest = [
  {
    name: 'app_school',
    label: 'Escola',
    module: () => importJSXModule(new URL('./school/index.js', import.meta.url).toString()),
    icon: 'School',
    theme: { primary: '#E67E22', iconBg: '#E67E22' },
  },
];
