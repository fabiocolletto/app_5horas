# CHANGELOG — Genoma v1.2

## 2025-12-20
- feat(células): feedback visual ao salvar perfil, cobrindo sucesso, alerta de campos vazios e erro de persistência
- fix(core): gravação redundante do perfil/estado garantindo Dexie + cópia espelho em localStorage
- fix(core): migração de preferências e estado para Dexie com reidratação em fallback para manter sincronia com localStorage

## 2025-12-19
- feat(core): introdução de `core/storage` com Dexie e migração do legado em `localStorage`
- feat(core): criação de `core/state` para persistir célula ativa, última célula e preferências
- feat(genoma): bootstrap assíncrono aguardando persistência e rastreando célula ativa
- refactor(células): célula `sistema.perfil` agora consome a API de storage do core

## 2025-12-17
- Etapa concluída: Etapa 6.1 — Geração do Device ID
- Resumo: Device ID gerado uma única vez via `crypto.randomUUID()` e armazenado em `localStorage` para permanecer estável entre recargas, sem regeneração quando já existir.

## 2025-12-18
- chore(v1.2.1): consolidação da base antes da persistência redundante
- chore: preparação do repositório para Genoma v1.3 (persistência redundante)

## 2024-05-17
- Etapa concluída: Etapa 1 — Bootstrap do Repositório
- Resumo: Estrutura inicial criada com shell HTML, orquestrador Genoma, manifesto de células e diretórios base (`core/`, `tools/`, `celulas/`).

## 2024-05-18
- Etapa concluída: Etapa 2 — Células Base
- Resumo: Manifesto atualizado com as células `sistema.welcome` e `home`, navegação por evento integrada e carregamento inicial configurado.

## 2025-12-16
- Etapa concluída: Etapa 3 — Célula Perfil
- Resumo: Célula `sistema.perfil` criada com persistência simples em `localStorage`, manifesto atualizado e Genoma agora redireciona para cadastro quando não há perfil salvo.

## 2025-12-16
- Etapa concluída: Etapa 4 — Células Funcionais
- Resumo: Manifesto atualizado com as células `finance` e `education`, navegação adicionada na home e novas telas com indicadores financeiros e trilhas de educação.

## 2025-12-17
- Etapa concluída: Etapa 5 — Estabilização
- Resumo: Navegação validada com verificação de destino, status ativos e proteção contra recargas redundantes; carregamento de células agora sinaliza progresso e preserva conteúdo em caso de falha.
