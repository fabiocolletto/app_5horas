export const cellsManifest = [
  { 
    name: 'sis_genoma', 
    label: 'Genoma', 
    module: () => import('./core/genoma.js'),
    icon: "Home",
    theme: { primary: '#4A90E2', iconBg: '#4A90E2' }
  },
  { 
    name: 'app_school', 
    label: 'Escola', 
    module: () => import('./cells/school/index.js'), 
    icon: "School",
    theme: { primary: '#E67E22', iconBg: '#E67E22' }
  }
];
