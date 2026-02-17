# Changelog

Todas as mudancas relevantes deste projeto serao registradas aqui.

Este arquivo segue o padrao Keep a Changelog e versionamento semantico.

## [Unreleased]
### Changed
- Especificacao tecnica revisada para oficializar a stack atual: HTML + Tailwind via CDN + JavaScript puro.
- Remocao de requisitos prematuros (Astro, ilhas, server:defer, Content Collections, Astro Actions e Edge Functions) do escopo atual.
- README e playbook de agentes alinhados com a estrategia de simplicidade da fase atual.

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
- Render dinamico de Blog/Fotografias no `index.html` para facilitar migracao futura para CMS.
- Interacoes locais em fotografias: likes, comentarios e mensagem privada (via `localStorage`).

## [0.1.0] - 2026-02-17
### Added
- Estrutura inicial do repositorio (`assets/`, `docs/`, `index.html`).
- Prototipo visual inicial do dashboard bento brutalista em `index.html`.
- Documento mestre de especificacoes tecnicas em `docs/especificacoes-tecnicas.md`.
- README expandido com contexto pessoal e direcao do projeto.
- Guia operacional para agentes em `AGENTS.md` e `docs/agent-playbook.md`.
