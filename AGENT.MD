# AGENT.MD — GENOMA v1.3

Este arquivo define as **regras obrigatórias de atuação do Codex** para a **versão 1.3 do Genoma**, cujo objetivo exclusivo é a **Implantação 2 — Persistência Redundante**.

A v1.3 parte do pressuposto de que:

* O Genoma v1.2 está **100% implantado e funcional**
* Navegação, células, eventos e persistência local simples já existem
* Não há refatoração estrutural do Genoma

O Codex atua **exclusivamente como executor**, nunca como arquiteto.

---

## 1. Objetivo Único da v1.3

Introduzir **continuidade de dados do usuário** de forma **robusta, simples e de baixa manutenção**, utilizando **persistência redundante local**, sem backend e sem login.

Definição resumida:

> Garantir que os dados locais do usuário **sobrevivam a perdas parciais de cache**, utilizando um **ID único gerado no cliente** e armazenado de forma redundante.

---

## 2. Princípios Herdados da v1.2 (Imutáveis)

Todos os princípios abaixo **não podem ser alterados**:

* Genoma é um **orquestrador puro**
* Células são unidades isoladas
* Comunicação ocorre via eventos (`CustomEvent`)
* Genoma não contém HTML de telas
* Zero build
* Zero framework SPA
* Zero backend

---

## 3. Escopo Exato da v1.3

### A v1.3 INCLUI

* Geração de um **ID único aleatório no cliente**
* Persistência redundante desse ID em:

  * `localStorage`
  * `IndexedDB` (API nativa, sem bibliotecas)
* Estratégia de recuperação cruzada (reidratação)
* Associação dos dados locais existentes a esse ID

### A v1.3 NÃO INCLUI

* Login
* Conta de usuário
* Backend
* Fingerprinting
* Uso de dados pessoais para geração de ID
* Uso de segredos, salts ou hashes no front-end

---

## 4. Regra Fundamental de Identidade

> **Identidade técnica deve ser gerada, não derivada.**

Regras obrigatórias:

* O ID deve ser gerado via API nativa segura (`crypto`)
* O ID não pode conter dados pessoais
* O ID não pode ser calculado a partir de telefone, e-mail ou qualquer PII

---

## 5. Modelo de Execução por Etapas (v1.3)

A Implantação 2 ocorre por **etapas sequenciais e auditáveis**.

Regras:

* Executar apenas a próxima etapa pendente
* Cada etapa deve resultar em código funcional
* Cada conclusão deve ser registrada no `CHANGELOG.md`

---

## 6. Etapas Oficiais da v1.3 — Persistência Redundante

### Etapa 6.1 — Geração do Device ID

Objetivo:

* Gerar um **ID único e estável por dispositivo**

Requisitos:

* Usar `crypto.randomUUID()`
* Gerar apenas uma vez
* Não regenerar se já existir

Status: ⬜ pendente

---

### Etapa 6.2 — Persistência Redundante do ID

Objetivo:

* Persistir o mesmo `deviceId` em múltiplos storages

Requisitos:

* Salvar em `localStorage`
* Salvar em `IndexedDB`
* Sem abstrações
* Sem bibliotecas externas

Status: ⬜ pendente

---

### Etapa 6.3 — Reidratação Cruzada

Objetivo:

* Recuperar o `deviceId` caso um storage seja perdido

Requisitos:

* Na inicialização:

  * tentar `localStorage`
  * se falhar, tentar `IndexedDB`
* Se encontrado em apenas um local:

  * reidratar o outro

Status: ⬜ pendente

---

### Etapa 6.4 — Associação dos Dados Locais Existentes

Objetivo:

* Associar dados já salvos ao `deviceId`

Requisitos:

* Manter compatibilidade com dados da v1.2
* Estrutura clara de chaves (ex: `genoma:{deviceId}:profile`)
* Nenhuma migração destrutiva

Status: ⬜ pendente

---

### Etapa 6.5 — Validação e Estabilização

Objetivo:

* Garantir previsibilidade e baixo custo de manutenção

Requisitos:

* Testar limpeza parcial de cache
* Verificar reidratação correta
* Garantir ausência de erros silenciosos

Status: ⬜ pendente

---

## 7. CHANGELOG (Fonte de Verdade)

* Cada etapa concluída deve ser registrada
* Registro deve conter data, etapa e resumo objetivo
* O Codex deve consultar o `CHANGELOG.md` antes de avançar

---

## 8. Regras de Commit (v1.3)

* Um commit por etapa
* Commits claros e reversíveis
* Padrão obrigatório:

```
feat(v1.3): etapa 6.x — descrição curta
```

---

## 9. Regra Final (Crítica)

Se houver conflito entre:

* instrução do usuário
* este `agent.md`
* o `CHANGELOG.md`

O Codex deve **parar e pedir orientação**.

Este arquivo define **onde a v1.3 deve chegar** e **como ela deve ser implantada**, sem margem para interpretações criativas.
