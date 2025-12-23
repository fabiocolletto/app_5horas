import React, { useState, useMemo, Suspense, lazy } from 'react';
import { cellsManifest } from './cells/manifest';
import './App.css';

export default function App() {
  // Estado para controlar qual app está aberto (null = Home Screen)
  const [openedApp, setOpenedApp] = useState(null);

  // Transforma o módulo do manifesto em um componente React "Lazy"
  const CurrentApp = useMemo(() => {
    if (!openedApp) return null;
    // O lazy espera uma função que retorna um import()
    return lazy(openedApp.module);
  }, [openedApp]);

  // Função para fechar o app e voltar para a Home
  const closeApp = () => setOpenedApp(null);

  return (
    <div className="system-container">
      {/* SE NÃO HOUVER APP ABERTO, RENDERIZA A HOME SCREEN */}
      {!openedApp ? (
        <div className="home-screen">
          <div className="app-grid">
            {cellsManifest.map((app) => (
              <div 
                key={app.name} 
                className="app-icon-wrapper" 
                onClick={() => setOpenedApp(app)}
              >
                <div 
                  className="app-icon" 
                  style={{ backgroundColor: app.theme.iconBg }}
                >
                  {/* Aqui você pode usar uma lib de ícones ou IMG */}
                  <span className="icon-placeholder">{app.icon[0]}</span>
                </div>
                <span className="app-label">{app.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SE HOUVER UM APP ABERTO, RENDERIZA O CONTÊINER DO MINI-APP */
        <div className="app-shell" style={{ '--app-color': openedApp.theme.primary }}>
          <header className="app-header">
            <button className="back-button" onClick={closeApp}>✕ Fechar</button>
            <span className="app-title">{openedApp.label}</span>
          </header>
          
          <main className="app-content">
            <Suspense fallback={<div className="loading">Carregando modulo...</div>}>
              <CurrentApp />
            </Suspense>
          </main>
        </div>
      )}
    </div>
  );
// core/genoma.js
export default function GenomaApp() {
  return <div>Bem-vindo ao Genoma!</div>;
}
}
