# CHANGELOG — Genoma v1.3

## 2025-12-20
- Etapa concluída: Etapa 1.3.2 — Estado Global e Persistência
- Resumo: Criados módulos `core/state` e `core/storage` para persistir célula ativa, última célula e preferências; Genoma e célula de perfil passaram a usar o estado central, eliminando acessos diretos a `localStorage` pelas células.

## 2025-12-19
- Etapa concluída: Etapa 1.3.1 — Contrato Celular Formal
- Resumo: Genoma agora valida contrato mínimo (id, name, version, init, destroy) antes de ativar uma célula; manifesto atualizado, células existentes adaptadas e célula modelo canônica adicionada.

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
