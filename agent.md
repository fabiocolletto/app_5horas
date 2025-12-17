# Guia de Execução do Genoma

Este documento consolida as diretrizes de governança das versões v1.2 e v1.3.
Consulte o `CHANGELOG.md` para detalhes de cada entrega.

## Status das Etapas — v1.2
- [x] Etapa 1 — Bootstrap do Repositório (concluída)
- [x] Etapa 2 — Células Base
- [x] Etapa 3 — Célula Perfil
- [x] Etapa 4 — Células Funcionais
- [x] Etapa 5 — Estabilização

## Regras de Validação — v1.2
- Toda tarefa deve ser validada abrindo o app no navegador, capturando um print da tela alterada e incluindo essa evidência no resumo final.

---

# AGENT — GENOMA v1.3

Este arquivo define as regras obrigatórias para a versão 1.3 do Genoma, cujo objetivo exclusivo é a **Implantação 2 — Persistência Redundante**.

A v1.3 parte do pressuposto de que:

- O Genoma v1.2 está **100% implantado e funcional**
- Navegação, células, eventos e persistência local simples já existem
- Não há refatoração estrutural do Genoma

O Codex atua **exclusivamente como executor**, nunca como arquiteto.

---

## 1. Objetivo Único da v1.3
Introduzir continuidade de dados do usuário de forma robusta, simples e de baixa manutenção, utilizando persistência redundante local, sem backend e sem login.

> Garantir que os dados locais do usuário sobrevivam a perdas parciais de cache, utilizando um ID único gerado no cliente e armazenado de forma redundante.

## 2. Princípios Herdados da v1.2 (Imutáveis)
- Genoma é um **orquestrador puro**
- Células são unidades isoladas
- Comunicação ocorre via eventos (`CustomEvent`)
- Genoma não contém HTML de telas
- Zero build
- Zero framework SPA
- Zero backend

## 3. Escopo Exato da v1.3
### A v1.3 INCLUI
- Geração de um **ID único aleatório no cliente**
- Persistência redundante desse ID em:
  - `localStorage`
  - `IndexedDB` (API nativa, sem bibliotecas)
- Estratégia de recuperação cruzada (reidratação)
- Associação dos dados locais existentes a esse ID

### A v1.3 NÃO INCLUI
- Login
- Conta de usuário
- Backend
- Fingerprinting
- Uso de dados pessoais para geração de ID
- Uso de segredos, salts ou hashes no front-end

## 4. Regra Fundamental de Identidade
> **Identidade técnica deve ser gerada, não derivada.**

Regras obrigatórias:
- O ID deve ser gerado via API nativa segura (`crypto.randomUUID()`)
- O ID não pode conter dados pessoais
- O ID não pode ser calculado a partir de telefone, e-mail ou qualquer PII

## 5. Modelo de Execução por Etapas (v1.3)
A Implantação 2 ocorre por etapas sequenciais e auditáveis.

Regras:
- Executar apenas a próxima etapa pendente
- Cada etapa deve resultar em código funcional
- Cada conclusão deve ser registrada no `CHANGELOG.md`

## 6. Etapas Oficiais da v1.3 — Persistência Redundante
### Etapa 6.1 — Geração do Device ID
Objetivo:
- Gerar um **ID único e estável por dispositivo**

Requisitos:
- Usar `crypto.randomUUID()`
- Gerar apenas uma vez
- Não regenerar se já existir

Status: ✅ concluída em 2025-12-17 — ID gerado via `crypto.randomUUID()` e salvo no `localStorage` para persistir entre recargas.

### Etapa 6.2 — Persistência Redundante do ID
Objetivo:
- Persistir o mesmo `deviceId` em múltiplos storages

Requisitos:
- Salvar em `localStorage`
- Salvar em `IndexedDB`
- Sem abstrações
- Sem bibliotecas externas

Status: ⬜ pendente

### Etapa 6.3 — Reidratação Cruzada
Objetivo:
- Recuperar o `deviceId` caso um storage seja perdido

Requisitos:
- Na inicialização:
  - tentar `localStorage`
  - se falhar, tentar `IndexedDB`
- Se encontrado em apenas um local:
  - reidratar o outro

Status: ⬜ pendente

### Etapa 6.4 — Associação dos Dados Locais Existentes
Objetivo:
- Associar dados já salvos ao `deviceId`

Requisitos:
- Manter compatibilidade com dados da v1.2
- Estrutura clara de chaves (ex: `genoma:{deviceId}:profile`)
- Nenhuma migração destrutiva

Status: ⬜ pendente

### Etapa 6.5 — Validação e Estabilização
Objetivo:
- Garantir previsibilidade e baixo custo de manutenção

Requisitos:
- Testar limpeza parcial de cache
- Verificar reidratação correta
- Garantir ausência de erros silenciosos

Status: ⬜ pendente

## 7. CHANGELOG (Fonte de Verdade)
- Cada etapa concluída deve ser registrada
- Registro deve conter data, etapa e resumo objetivo
- O Codex deve consultar o `CHANGELOG.md` antes de avançar

## 8. Testes obrigatórios por etapa (executar **após** implementar cada etapa 6.x)
- Adicione os testes abaixo imediatamente após concluir a ação de código da etapa correspondente.
- Qualquer falha bloqueia a conclusão da etapa e impede o commit.

### Etapa 6.1 — Verificação de geração única
- Confirmar geração via `crypto.randomUUID()`.
- Recarregar a página e garantir que o `deviceId` não muda.

### Etapa 6.2 — Persistência redundante
- Após gerar o ID, inspecionar `localStorage` e `IndexedDB` para confirmar que o mesmo valor está salvo em ambos (chave `genomaDeviceId` ou equivalente definida na implementação).

### Etapa 6.3 — Reidratação cruzada
- Limpar apenas o `localStorage`, recarregar e verificar que o ID é reidratado a partir do `IndexedDB`.
- Repetir limpando apenas o `IndexedDB` e reidratando a partir do `localStorage`.

### Etapa 6.4 — Dados legados
- Confirmar que dados v1.2 permanecem acessíveis e passam a ser referenciados pelo novo ID (ex.: chaves `genoma:{deviceId}:...`).

### Etapa 6.5 — Estabilização
- Testar limpeza parcial de cache, reidratação correta e ausência de erros silenciosos após a consolidação das etapas anteriores.

## 9. Registro, evidências e checklist pós-ação (obrigatórios antes de marcar a etapa como concluída)
- Criar evidências logo após executar os testes de cada etapa:
  - Screenshot do app exibindo o estado pós-teste.
  - Log documentando o conteúdo de `localStorage` e `IndexedDB` com o `deviceId` presente.
- Atualizar o `CHANGELOG.md` com data, etapa (6.x) e resumo objetivo do resultado.
- Seguir o checklist antes de encerrar a etapa:
  - Executar todos os testes obrigatórios da seção 8.
  - Registrar evidências (screenshot + logs de storage).
  - Atualizar o `CHANGELOG.md`.
  - Somente então realizar o commit único da etapa.

## 10. Condições de aceite por etapa
- 6.1: ID único gerado uma única vez e reutilizado em recargas.
- 6.2: ID idêntico salvo em `localStorage` e `IndexedDB`.
- 6.3: Reidratação automática quando um storage é apagado e validação do preenchimento cruzado.
- 6.4: Dados legados intactos e referenciados pelo novo ID.
- 6.5: Fluxo completo tolerante a limpezas parciais de cache, sem erros silenciosos.

## 11. Regras de Commit (v1.3)
- Um commit por etapa
- Commits claros e reversíveis
- Padrão obrigatório:

```
feat(v1.3): etapa 6.x — descrição curta
```

## 12. Regra Final (Crítica)
Se houver conflito entre:
- instrução do usuário
- este `agent.md`
- o `CHANGELOG.md`

O Codex deve **parar e pedir orientação**.
