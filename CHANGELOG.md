# Changelog

Todas as mudancas relevantes deste projeto serao registradas aqui.

Este arquivo segue o padrao Keep a Changelog e versionamento semantico.

## [Unreleased]
### Changed
- Correcao de seguranca e desacoplamento no frontend: remocao de handlers inline (`onclick`/`onsubmit`/`onerror`) do HTML e migracao para `addEventListener` em `assets/js/main.js`.
- Persistencia do override manual de tema via `localStorage` (`thierry.theme.v1`), com restauracao automatica na inicializacao.
- Mitigacao de XSS em renderizacoes dinamicas (comentarios e conteudo de post) com montagem via DOM API/texto e escape de interpolacoes HTML.
- Acessibilidade melhorada nos cards do blog: suporte de teclado (`Enter`/`Espaco`) e semantica interativa (`role="button"`, `tabindex="0"`).
- Wrappers principais de pagina atualizados para `<section>` com `aria-labelledby`, reforcando semantica estrutural.
- Ajustes de UI para conformidade: `title` descritivo, bloco de filtros com padding mobile revisado (`p-6 md:p-10`) e token de contraste do tema claro para `--accent`.
- `data/media-map.json` alinhado ao schema de conteudo com adicao de `slug` e `status` nos itens existentes.
- Loader inicial reduzido para minimizar atraso artificial de exibicao (`LOADER_MIN_MS` de 2000ms para 600ms).
- UX pass de interacoes do post e modais: acoes de compartilhamento passaram para botoes com handlers dedicados e links placeholder foram removidos.
- Acessibilidade dos dialogs refinada com `aria-labelledby`/`aria-describedby` e label explicita no campo de comentario.
- Corrigida condicao de corrida na troca de idioma com controle de requisicao ativa (`localeRequestId`), evitando sobrescrita por resposta antiga.
- Restauracao de foco de modais robustecida com fallback para controles da foto e fallback final em `#photo-grid`.
- Pagina de post passa a consumir capa de `data/media-map.json` (owner `post`) com fallback visual quando ausente/erro.
- i18n atualizado com novas chaves `blog.open_post` e `post.cover_fallback` em `pt-BR` e `en-US`.
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
- Texto do bloco informativo principal da dashboard traduzido para PT-BR.
- Dashboard no mobile ajustada para proporcao fixa 1:1 nos blocos da grid.
- Transicao de paginas com padrao fade + slide aplicada na navegacao, com fallback para `prefers-reduced-motion`.
- Correcao da inicializacao da transicao de paginas: estado inicial ativo com `opacity: 1`.
- Transicao de paginas refinada com duracao maior e easing mais suave.
- Loader inicial adicionado antes da exibicao do website, com fallback de carregamento e suporte a reduced motion.
- Loader inicial configurado para exibicao minima de 2 segundos.
- Secao de contato evoluida para formulario realista com validacao, feedback de envio e fallback funcional via `mailto`.
- Bloco informativo da grid e secao Sobre atualizados com narrativa biografica em PT-BR inspirada na referencia editorial de `sive.rs/about`.
- Mecanismo de idioma `pt-BR`/`en-US` implementado com toggle na interface, persistencia local e dicionarios em `data/i18n/*.json`.
- JavaScript desacoplado do `index.html` para `assets/js/main.js`, facilitando leitura e manutencao sem alterar comportamento funcional.
- Botoes de idioma padronizados com o mesmo padrao visual dos controles do header (incluindo toggle de tema), com estado ativo acessivel via `aria-pressed`.

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
