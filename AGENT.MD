# AGENT.MD — GENOMA v1.2

Este arquivo define as **regras obrigatórias de atuação do Codex** no repositório do Genoma v1.2.

O Codex deve atuar **exclusivamente como executor**, nunca como arquiteto.

Qualquer ação fora deste documento é considerada incorreta.

---

## 1. Papel do Codex

O Codex deve:

* executar tarefas explicitamente solicitadas
* seguir rigorosamente a arquitetura definida
* consultar este arquivo antes de qualquer modificação

O Codex **não deve**:

* tomar decisões arquiteturais
* introduzir novas tecnologias
* reinterpretar regras
* migrar código legado

---

## 2. Princípios Arquiteturais (Imutáveis)

* O Genoma é um **orquestrador puro**
* Células são unidades isoladas
* Navegação é centralizada no Genoma
* Comunicação entre células e Genoma ocorre por eventos (`CustomEvent`)
* O Genoma **não contém HTML de telas**
* Células **não manipulam history ou URL**
* Zero build
* Zero framework SPA

---

## 3. Tecnologias Permitidas

Somente estas tecnologias podem ser usadas:

* HTML, CSS e JavaScript nativos
* ES Modules
* Web Components (Custom Elements)
* Lit (Google)
* Material Web (Google)
* History API
* GitHub Pages

Qualquer outra tecnologia é proibida.

---

## 4. Tecnologias Proibidas

* React
* Vue
* Angular
* Svelte
* Bundlers (Webpack, Vite, etc.)
* Transpilers
* Server-side rendering
* Frameworks CSS

---

## 5. Estrutura Obrigatória do Repositório

O repositório deve manter exatamente esta estrutura base:

```
/
├─ index.html            # Shell HTML mínimo
├─ genoma.js             # Orquestrador central
├─ cells.manifest.js     # Registro declarativo de células
├─ agent.md              # Constituição do agente
├─ CHANGELOG.md          # Histórico oficial de execução
└─ celulas/


```

```
/
├─ index.html
├─ genoma.js
├─ cells.manifest.js
├─ agent.md
├─ CHANGELOG.md
├─ core/
├─ tools/
└─ celulas/
```

---

## 6. Template Oficial de Célula Fixa (Obrigatório)

Todas as células fixas devem seguir o **Template Oficial de Célula Fixa v1**.

Nenhuma exceção é permitida.

---

## 7. Modelo de Execução por Etapas

A implantação do Genoma v1.2 ocorre por **etapas sequenciais e cumulativas**.

Regras obrigatórias:

* O Codex deve executar **somente a próxima etapa não concluída**
* O Codex deve verificar **agent.md e CHANGELOG.md antes de agir**
* O Codex não pode iniciar uma etapa se a anterior não estiver marcada como concluída
* Cada etapa deve resultar em **código funcional** sequenciais**.

O Codex deve:

* executar apenas a **próxima etapa pendente**
* verificar o `CHANGELOG.md` antes de agir
* nunca pular etapas

---

## 8. Etapas Oficiais da Implantação

> **Importante:** Cada etapa só pode ser considerada concluída se o código estiver funcional e registrado no `CHANGELOG.md`.

### Etapa 1 — Bootstrap do Repositório

* Criar estrutura inicial
* Criar `index.html`
* Criar `genoma.js`
* Criar `cells.manifest.js`
* Criar `agent.md`
* Criar `CHANGELOG.md`

Status: ⬜ pendente

---

### Etapa 2 — Células Base

* Criar célula `sistema.welcome`
* Criar célula `home`
* Integrar navegação por evento

Status: ⬜ pendente

---

### Etapa 3 — Célula Perfil

* Criar célula `sistema.perfil`
* Implementar gate de perfil no Genoma
* Implementar **persistência inicial via LocalStorage simples**

  * Uso exclusivo de `window.localStorage`
  * Chave única e explícita (ex: `genoma.profile`)
  * Estrutura de dados mínima (ex: nome, papel)
  * Nenhuma abstração, wrapper ou biblioteca adicional

Status: ⬜ pendente

---

### Etapa 4 — Células Funcionais

* Criar célula `finance`
* Criar célula `education`

Status: ⬜ pendente

---

### Etapa 5 — Estabilização

* Revisão de navegação
* Revisão de eventos
* Revisão de carregamento de células

Status: ⬜ pendente

---

## 9. CHANGELOG (Fonte de Verdade)

* O arquivo `CHANGELOG.md` é a **fonte de verdade do progresso**
* Cada entrada deve conter:

  * data
  * etapa concluída
  * resumo objetivo do que foi feito
* Ao concluir uma etapa, o Codex deve:

  * marcar a etapa como concluída no `agent.md`
  * registrar a conclusão no `CHANGELOG.md` é a **fonte de verdade do progresso**
* Ao concluir uma etapa, o Codex deve:

  * marcar a etapa como concluída no `agent.md`
  * registrar a mudança no `CHANGELOG.md`

---

## 10. Regras de Commit

* Um commit por etapa ou subtarefa
* Commits claros e objetivos
* Não misturar etapas no mesmo commit
* Mensagens devem seguir padrão:

````
<tipo>: etapa X — descrição curta
``` por etapa ou subtarefa
- Commits claros e objetivos
- Nunca misturar etapas no mesmo commit

---

## 11. Regra Final (Crítica)

Se houver conflito entre:
- uma instrução do usuário
- este `agent.md`
- o estado registrado no `CHANGELOG.md`

O Codex deve **parar e pedir orientação**, nunca assumir.

Este arquivo é a **constituição viva do Genoma v1.2** e deve ser seguido literalmente.

---

## 12. Módulos Herdados do v1 (Uso Opcional)

Nenhum módulo herdado do v1 deve existir no Genoma v1.2.

### Diretriz Final

- `fetchWithFallback.js` **NÃO deve ser incluído** no repositório inicial
- Fallback de carregamento **não é requisito** da arquitetura v1.2
- Falhas de carregamento devem ser explícitas e visíveis

Regra:
> Código defensivo sem uso real é considerado dívida técnica e não deve existir no repositório.

````
