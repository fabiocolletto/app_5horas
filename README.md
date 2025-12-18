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

🟢 **Marco 1.4 — Plataforma Operacional**

O app agora possui:

* Versão consolidada **1.4.0** definida em `core/app.meta.js`
* Genoma com validação de manifesto, contrato celular e observabilidade central
* Estado global persistente (perfil, preferências, célula ativa e último acesso)
* Pelo menos **3 células reais** funcionais e independentes (`home`, `finance`, `education`), além das células sistêmicas (`sistema.welcome`, `sistema.perfil`) e do modelo canônico
* Documentação alinhada entre README, `agent.md` e `CHANGELOG.md`

Novas células podem ser adicionadas sem alterar o genoma: basta seguir o contrato e registrá-las no manifesto.

### Validação visual

* O `index.html` foi conferido manualmente no marco 1.4.0: cabeçalho, navegação entre células (`home`, `finance`, `education`), painéis sistêmicos e rodapés aparecem conforme esperado.
* Para reproduzir a checagem, sirva a raiz do projeto com `python -m http.server 8000` e acesse `http://localhost:8000/`.

---

## Versionamento e Marcos

* **appVersion:** `1.4.0` (`core/app.meta.js`)
* **Marco ativo:** `Marco 1.4 — Plataforma Operacional`
* **Histórico concluído:** etapas 1.3.1 a 1.3.4 registradas em `CHANGELOG.md`

Use o `app.meta.js` como fonte única para rótulos de versão e milestone em interfaces ou diagnósticos.

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
│   └── app.meta.js       # Metadados oficiais de versão e marcos
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

### Estado e Persistência (Etapa 1.3.2)

O Genoma mantém um **estado global persistente** através dos módulos `core/state` e `core/storage`.
Atualmente são registrados:

* Célula ativa
* Última célula carregada
* Preferências básicas (ex.: tema)
* Perfil do usuário e identidade do dispositivo

As células recebem no `context` apenas funções para ler/atualizar esses dados (`profile`, `preferences`, `updateProfile`, `updatePreferences`), mantendo o acesso ao armazenamento centralizado e permitindo trocar a implementação sem quebrar módulos.

### Contrato Mínimo de Célula (Etapa 1.3.1)

A partir da versão **1.3.1** cada célula precisa seguir um contrato explícito para ser carregada pelo Genoma:

* `id`: identificador único da célula
* `name`: nome legível para diagnósticos
* `version`: versão da célula para rastreabilidade
* `init(context)`: inicializa a célula recebendo um contexto com `host`, `navigate`, `profile` e `deviceId`
* `destroy()`: libera recursos e listeners antes de trocar de célula

O Genoma valida essas propriedades antes de ativar qualquer módulo. Células que não atendem ao contrato são rejeitadas e o status exibe o motivo.

**Como adicionar uma nova célula sem tocar no genoma:**

1. Crie o arquivo da célula em `celulas/` seguindo o contrato acima.
2. Registre-a apenas no `cells.manifest.js` com `id` e `module`.
3. O Genoma valida o manifesto e rejeita entradas inválidas ou duplicadas automaticamente.

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

## Roadmap (Pós-Marco 1.4)

### Manutenção imediata

* Garantir que novas células sigam o contrato e sejam registradas apenas via manifesto
* Manter observabilidade central (eventos e logger) como fonte única de diagnóstico

### Próximas capacidades

* Catálogo versionado de células e documentação por release
* Modo offline/PWA e empacotamento leve para publicação
* Checklist de segurança e performance para novas células

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
