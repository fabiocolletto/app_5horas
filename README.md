# App 5Horas

**App 5Horas** é a base do ecossistema digital da 5 Horas.
Um aplicativo web modular, orientado a **células independentes**, carregadas dinamicamente por um **genoma central**, com foco em organização, escalabilidade e evolução contínua.

O projeto foi desenhado para servir como **plataforma viva**, onde novas funcionalidades podem ser adicionadas sem reescrever o núcleo do sistema.

---

## Visão Geral

O App 5Horas segue uma arquitetura inspirada em sistemas celulares:

* Um **genoma central** controla o carregamento e o ciclo de vida do app
* **Células** representam módulos funcionais independentes
* Um **manifesto de células** registra e organiza o que pode ser carregado
* Ferramentas e utilitários dão suporte transversal ao sistema

Essa abordagem permite:

* Evolução incremental
* Isolamento de responsabilidades
* Facilidade de manutenção
* Crescimento orgânico do produto

---

## Status do Projeto

🟡 **Em desenvolvimento ativo**

Atualmente o projeto possui:

* Estrutura base funcional
* Genoma inicial implementado
* Registro de células via manifesto
* Organização modular clara
* Documentação técnica inicial (`agent.md`, `CHANGELOG.md`)

Próximas etapas estão descritas no roadmap abaixo.

---

## Estrutura do Repositório

```text
app_5horas/
├── index.html           # Ponto de entrada do app
├── genoma.js             # Núcleo do sistema (controle e carregamento)
├── cells.manifest.js     # Registro e configuração das células
├── celulas/              # Módulos funcionais independentes
│   └── ...               # Cada célula possui sua própria estrutura
├── core/                 # Funções centrais compartilhadas
├── tools/                # Utilitários e helpers globais
├── agent.md              # Instruções e regras do agente do projeto
├── CHANGELOG.md          # Histórico de versões e mudanças
└── README.md             # Este arquivo
```

---

## Conceitos-Chave

### Genoma

O **genoma** é o núcleo do sistema.
Ele controla:

* Inicialização do app
* Carregamento dinâmico das células
* Comunicação básica entre módulos
* Fluxo geral da aplicação

### Células

As **células** são módulos independentes que:

* Possuem responsabilidade clara
* Podem evoluir sem impactar outras células
* São registradas no `cells.manifest.js`
* Podem ser ativadas ou desativadas sem alterar o genoma

### Manifesto de Células

O arquivo `cells.manifest.js` funciona como:

* Catálogo do sistema
* Contrato entre o genoma e as células
* Ponto único de controle de carregamento

### Contrato Mínimo de Célula (Etapa 1.3.1)

A partir da versão **1.3.1** cada célula precisa seguir um contrato explícito para ser carregada pelo Genoma:

* `id`: identificador único da célula
* `name`: nome legível para diagnósticos
* `version`: versão da célula para rastreabilidade
* `init(context)`: inicializa a célula recebendo um contexto com `host`, `navigate`, `profile` e `deviceId`
* `destroy()`: libera recursos e listeners antes de trocar de célula

O Genoma valida essas propriedades antes de ativar qualquer módulo. Células que não atendem ao contrato são rejeitadas e o status exibe o motivo.

---

## Como Rodar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/fabiocolletto/app_5horas.git
```

2. Acesse a pasta do projeto:

```bash
cd app_5horas
```

3. Abra o `index.html` em um navegador

> Por enquanto o projeto não depende de build ou bundler.

Para desenvolvimento mais avançado, recomenda-se rodar via servidor local (ex: Live Server).

---

## Padrões e Boas Práticas

* Cada célula deve ser **autossuficiente**
* O genoma não deve conter lógica específica de negócio
* Comunicação entre módulos deve ser explícita e simples
* Mudanças significativas devem ser registradas no `CHANGELOG.md`
* Decisões arquiteturais devem ser documentadas

---

## Roadmap (Próximas Etapas)

### Curto Prazo

* Consolidar documentação das células existentes
* Definir contrato formal de inicialização das células
* Padronizar naming e estrutura interna das células

### Médio Prazo

* Introduzir persistência local (ex: IndexedDB / Dexie)
* Criar sistema básico de estado global
* Implementar carregamento condicional de células

### Longo Prazo

* Pipeline de CI/CD
* Versão PWA
* Controle de permissões por célula
* Publicação estável com versionamento semântico

---

## Contribuição

Este projeto segue um modelo de evolução controlada.

Antes de contribuir:

1. Leia o `agent.md`
2. Respeite a arquitetura existente
3. Documente decisões relevantes
4. Atualize o `CHANGELOG.md` quando necessário

Pull requests devem ser claros, objetivos e alinhados à visão do projeto.

---

## Filosofia do Projeto

O App 5Horas não é apenas um aplicativo.
É uma **plataforma em construção**, guiada por:

* Simplicidade estrutural
* Evolução consciente
* Respeito ao que já funciona
* Espaço para inovação sem ruptura

---

## Autor

Projeto idealizado e mantido por **Fabio Colletto**
