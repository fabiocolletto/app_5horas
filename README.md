# App 5Horas — PWA v0.0

Este projeto está focado 100% no uso das APIs de PWA do Google/Chrome:

* **Navigation Handler API** — captura e direciona links automaticamente para abrir dentro do PWA instalado.
* **File System Observer API** — observa e reage a mudanças no sistema de arquivos local (Origin Private File System).

Para executar:

1. Instale o app como PWA no **Google Chrome** (desktop ou Android WebAPK).
2. Ative as flags/recursos experimentais necessários para Navigation Handler e File System Observer.
3. Abra o `index.html` via servidor local e confirme os prompts de permissão.

Sem essas APIs ativas o genoma não avança no carregamento das células.

Estrutura mínima mantida:

* `index.html` — shell do PWA
* `genoma.js` — orquestrador central dependente das APIs
* `cells.manifest.js` + `celulas/` — células carregáveis
* `core/` — integração com Navigation Handler e File System Observer
* `agent.md` e `CHANGELOG.md` — orientação e histórico
