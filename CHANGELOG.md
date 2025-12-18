# CHANGELOG — Genoma v1.2

# 2025-12-20
- Etapa concluída: Etapa 6.3 — Reidratação Cruzada do Device ID
- Resumo: Implementada leitura cruzada entre localStorage e IndexedDB para reidratar o deviceId quando um storage é limpo, repopulando automaticamente o outro antes de prosseguir.

## 2025-12-19
- Etapa concluída: Etapa 6.2 — Persistência Redundante do Device ID
- Resumo: O deviceId agora é persistido simultaneamente no localStorage e no IndexedDB nativo, garantindo redundância sem dependências externas.

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
