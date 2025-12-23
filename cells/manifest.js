export const cellsManifest = [
  {
    name: 'sis_genoma',
    label: 'Genoma',
    module: './core/genoma.js',
    icon: 'Home',
    theme: {
      primaryColor: '#4A90E2',
      secondaryColor: '#f4f7f6',
      textColor: '#ffffff',
      iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    config: {
      showStatusBar: true,
      fullScreen: true,
      requiresAuth: true
    },
    version: '1.0.4'
  },
  {
    name: 'app_school',
    label: 'Escola',
    module: './cells/school/index.js',
    icon: 'School',
    theme: {
      primaryColor: '#E67E22',
      secondaryColor: '#FEF5E7',
      textColor: '#ffffff',
      iconBg: '#E67E22'
    },
    config: {
      showStatusBar: true,
      fullScreen: false,
      requiresAuth: false
    },
    version: '2.1.0'
  }
];
