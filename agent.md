# AGENT.md

**App 5Horas — Governança Técnica e Roadmap Controlado**

Este documento define **como o projeto App 5Horas deve evoluir**, quais decisões são permitidas e quais são proibidas, e qual é o **caminho oficial até o Marco 1.4**.

Ele é a referência máxima de comportamento técnico e arquitetural do projeto.

---

## Estado Atual do Projeto

Versão atual: **1.4.0** (fonte única: `core/app.meta.js`)

O App 5Horas atingiu o **Marco 1.4 — Plataforma Operacional**. O genoma valida o contrato das células, mantém estado e observabilidade centralizados e possui pelo menos três células reais (`home`, `finance`, `education`), além das células sistêmicas (`sistema.welcome`, `sistema.perfil`) e do modelo canônico.

Evoluções seguem controladas: nenhuma mudança fora do escopo ou do manifesto é aceita.

---

## Princípios Invioláveis

1. O **genoma é estável**

   * Ele coordena, não executa lógica de negócio.
2. **Células são a unidade mínima de valor**
3. Nenhuma célula conhece detalhes internos de outra
4. Persistência, estado e observabilidade passam pelo **core**
5. Clareza estrutural é mais importante que novas features

---

## Roadmap Controlado: Transição 1.3 → 1.4

O Marco **1.4 não é uma versão incremental**, é um **selo de maturidade**.
Ele só existe após a conclusão e aprovação das quatro etapas abaixo.

**Status:** etapas 1.3.1 a 1.3.4 concluídas. Use-as como checklist mínimo para qualquer célula ou ajuste estrutural.

---

## 🔹 Etapa 1.3.1 — Contrato Celular Formal

### Objetivo

Transformar células em **entidades previsíveis**, com ciclo de vida definido.

### Entregas obrigatórias

* Definição do **contrato mínimo de célula**:

  * `id`
  * `name`
  * `version`
  * `init(context)`
  * `destroy()`
* Documentação oficial do contrato no repositório
* Atualização do genoma para **respeitar esse contrato**
* Criação de **uma célula modelo canônica**

### Critério de conclusão

* Qualquer nova célula pode ser criada apenas seguindo o contrato
* O genoma não executa lógica específica de nenhuma célula

---

## 🔹 Etapa 1.3.2 — Estado Global e Persistência

### Objetivo

Dar **memória ao sistema**, sem acoplamento.

### Entregas obrigatórias

* Criação de um módulo `core/state`
* Criação de um módulo `core/storage`
* Estado mínimo obrigatório:

  * célula ativa
  * última célula carregada
  * preferências básicas
* Nenhuma célula acessa `localStorage`, `sessionStorage` ou IndexedDB diretamente

### Critério de conclusão

* Recarregar o app mantém o estado essencial
* Persistência pode ser trocada sem quebrar células

---

## 🔹 Etapa 1.3.3 — Observabilidade e Eventos

### Objetivo

Garantir que **o sistema saiba o que está acontecendo consigo mesmo**.

### Entregas obrigatórias

* Sistema central de eventos do genoma:

  * `cell:load`
  * `cell:init`
  * `cell:ready`
  * `cell:error`
  * `cell:destroy`
* Logger central no `core`
* Modo debug ativável por flag
* Tratamento explícito de erro de célula

### Critério de conclusão

* Qualquer falha de célula é identificável
* O fluxo de vida de uma célula é observável

---

## 🔹 Etapa 1.3.4 — Consolidação e Selo de Plataforma

### Objetivo

Preparar o sistema para ser oficialmente **App 5Horas 1.4**.

### Entregas obrigatórias

* Limpeza de código legado ou redundante
* Alinhamento completo entre:

  * README
  * agent.md
  * CHANGELOG
* Definição explícita de:

  * `appVersion`
  * marcos versionados
* Pelo menos **3 células reais**, independentes e funcionais
* Validação de que uma nova célula pode ser adicionada **sem tocar no genoma**

### Critério de conclusão

* O sistema se comporta como plataforma
* A arquitetura é previsível
* A evolução futura é segura

---

## 🔴 Marco 1.4 — Plataforma Operacional

O Marco **1.4** é atingido quando:

* Todas as etapas 1.3.1 a 1.3.4 foram concluídas
* O sistema está:

  * modular
  * observável
  * persistente
  * governável
* O App 5Horas pode ser estendido sem reescrita estrutural

A partir do 1.4, o projeto passa a evoluir por **capacidades**, não por improvisação.

---

## Pós-Marco 1.4 — Direção imediata

* Novas células devem seguir o contrato e entrar apenas via manifesto (genoma permanece intocado)
* Observabilidade (eventos + logger) é a fonte única de diagnóstico
* Próximas capacidades desejadas:
  * Catálogo versionado de células e documentação por release
  * Modo offline/PWA
  * Checklist de segurança e performance por célula

---

## Regras de Evolução

* Nenhuma feature fora do escopo da etapa atual é permitida
* Todo avanço deve ser refletido no CHANGELOG
* Quebras de contrato exigem revisão do agent.md
* Clareza vence velocidade

---

## Papel do Agente

O agente do projeto deve:

* Guardar a arquitetura
* Recusar atalhos técnicos
* Priorizar estabilidade estrutural
* Garantir que cada etapa esteja completa antes da próxima
