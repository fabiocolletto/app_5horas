export const cellsManifest = [
  { 
    name: 'app_school', 
    label: 'Escola', 
    module: () => import('./school/index.js'), 
    icon: 'School',
    theme: { primary: '#E67E22', iconBg: '#E67E22' }
  }
];
