# Changelog

Todas as mudancas relevantes deste projeto serao registradas aqui.

Este arquivo segue o padrao Keep a Changelog e versionamento semantico.

## [Unreleased]
### Changed
- Especificacao tecnica revisada para oficializar a stack atual: HTML + Tailwind via CDN + JavaScript puro.
- Remocao de requisitos prematuros (Astro, ilhas, server:defer, Content Collections, Astro Actions e Edge Functions) do escopo atual.
- README e playbook de agentes alinhados com a estrategia de simplicidade da fase atual.
- Ajustes mobile-first no `index.html` para corrigir quebras de layout: header responsivo, reducao de espacamentos em telas pequenas, tipografia escalavel e cards com melhor adaptacao.
- Diretrizes mobile reforcadas em `docs/especificacoes-tecnicas.md`, `docs/agent-playbook.md` e `docs/non-functional-checklist.md`.
- Nova rodada de UX mobile no `index.html`: links de navegacao com melhor area de toque e scroll por snap, acoes de cards com botoes maiores e slots da dashboard com altura minima estavel mesmo sem conteudo.
- Opcao 1 oficializada para dashboard mobile: coluna unica com slots estaveis (incluindo vazios), tokens dedicados no design system e guardrails atualizados.
- Menu mobile configurado para auto-ocultar ao rolar para baixo e reaparecer ao rolar para cima/topo, poupando area util de tela.
- Footer padronizado com celulas `.ui-card`, mantendo consistencia da malha brutalista e comportamento responsivo no mobile.
- Estrutura do footer refinada no desktop: proporcao de colunas, alinhamento e espacamento ajustados para leitura horizontal mais limpa.
- Ajuste fino no desktop: segundo bloco do footer alinhado como o primeiro, evitando texto colado na borda.
- UX mobile pass 2: affordance para menu auto-oculto, suporte a `prefers-reduced-motion`, modais com foco/ESC/backdrop/lock de scroll, preservacao de rolagem em interacoes de fotos e safe-area para notch.

### Planned
- Consolidacao do prototipo HTML com melhorias de acessibilidade e semantica.
- Integracao gradual de dados externos com fallback visual e seguranca.
- Avaliacao futura de migracao para framework em iniciativa separada.

### Added
- `robots.txt` com bloqueio de crawlers de IA, indexadores e bots de preview social.
- Metatags de anti-indexacao/anti-snippet no `index.html`.
- Politica de uso e protecao em `docs/politica-de-conteudo.md`.
- Camada de dados em `data/*.json` (posts, fotografias, ensaios e media map) com IDs/slug/datas/status.
- Documento `docs/content-model.md` com convencoes editoriais e checklist de publicacao.
- Documento `docs/design-system.md` com tokens de espacamento e padrao de botoes/cards.
- Documento `docs/non-functional-checklist.md` com criterios de mobile-first, a11y, performance e SEO.
- Render dinamico de Blog/Fotografias no `index.html` para facilitar migracao futura para CMS.
- Interacoes locais em fotografias: likes, comentarios e mensagem privada (via `localStorage`).

## [0.1.0] - 2026-02-17
### Added
- Estrutura inicial do repositorio (`assets/`, `docs/`, `index.html`).
- Prototipo visual inicial do dashboard bento brutalista em `index.html`.
- Documento mestre de especificacoes tecnicas em `docs/especificacoes-tecnicas.md`.
- README expandido com contexto pessoal e direcao do projeto.
- Guia operacional para agentes em `AGENTS.md` e `docs/agent-playbook.md`.
