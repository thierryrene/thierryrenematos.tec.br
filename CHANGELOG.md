# Changelog

Todas as mudancas relevantes deste projeto serao registradas aqui.

Este arquivo segue o padrao Keep a Changelog e versionamento semantico.

## [Unreleased]
### Changed
- Modo SEO de producao ativado: metatags `robots`/`googlebot`/`bingbot` atualizadas para `index, follow` com previews amplos e sem bloqueio de snippet.
- `robots.txt` simplificado para liberar rastreamento global (`User-agent: *` + `Allow: /`), removendo bloqueios anteriores.
- Navegacao SPA com URL real integrada via History API: menu principal e navegacao de posts agora atualizam `pathname` (`/`, `/sobre`, `/fotografias`, `/blog`, `/blog/:slug`, `/contato`) sem recarregar pagina.
- Suporte a `popstate` para back/forward do navegador, reidratando a secao/post correto com estado consistente.
- Camada de SEO/analytics para navegacao interna: atualizacao de `document.title`, `link[rel="canonical"]` e disparo de pageview virtual (`gtag`/`dataLayer`) em mudancas de rota.
- Links de navegacao do header atualizados para `href` canonicos de rota, mantendo interceptacao client-side para UX fluida.
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
- Card `Listening Log` integrado ao Last.fm com polling no endpoint server-side `/api/lastfm-recent.php`, estados `Now Playing/Recente/Offline` e fallback visual para indisponibilidade.
- Endpoint server-side `api/lastfm-recent.php` adicionado para buscar `recenttracks` no Last.fm com leitura de `LASTFM_API_KEY` e `LASTFM_USERNAME` via ambiente (sem expor segredo no client).
- Roteamento SPA ajustado para ambiente local em subpasta (`localhost/thierryrenematos.tec.br`): aplicacao de `base path` em links, History API, resolucao de rota e endpoint Last.fm, evitando conflitos de navegação nos testes locais.
- Endpoint `api/lastfm-recent.php` compatibilizado com PHP 7.4 (remoção de dependência em `str_starts_with/str_ends_with`) e normalização de campos Last.fm para evitar retorno indevido (`album: \"Array\"`).
- Conexão do card Last.fm atualizada para resolver endpoint com `base path` em ambiente local (`localhost/thierryrenematos.tec.br`), mantendo compatibilidade com produção.
- Card `Listening Log` aprimorado com simbolo musical animado durante `Now Playing` e fundo dinâmico com capa do álbum (centralizado + fade black) quando `album_art` estiver disponível no payload.
- Status do card Last.fm refinado para estado real: `Now Playing` quando ativo e, quando inativo, exibição temporal da última reprodução (`Ha X min` / `Ultima HH:MM`), usando `played_at_unix` do endpoint.
- Bloco visual do card Last.fm ajustado para dark mode com overlay mais legível sobre capa de álbum, chip de status com contraste aprimorado e text-shadow contextual no conteúdo.
- Dashboard com ordenação ao vivo de cards por atualização: cards de integração agora registram `lastUpdatedAt`, exibem microstatus (`upd HH:MM` / `erro HH:MM`) e são reordenados dinamicamente por recência de sync.
- Card GitHub integrado com sync em tempo real via endpoint server-side (`/api/github-activity.php`), exibindo atividade pública recente (`Push/PR/Issue/Create`), metadata temporal e participação automática na ordenação ao vivo do dashboard.
- Card GitHub evoluído com contagem de commits da semana atual e mini-grid semanal em verde (7 dias), alimentado por série `week.commits` do endpoint.
- Card GitHub atualizado para exibir também o último repositório favoritado (com estrela), via novo bloco `starred` no endpoint.
- Endurecimento da integração GitHub contra falhas upstream/rate limit: endpoint com contrato estável (`ok: false` sem quebrar JSON), cache em arquivo `data/github-activity-cache.json` (TTL 10min) e fallback para cache stale quando disponível.
- Integracao Last.fm sem cache em arquivo: endpoint voltou para leitura direta da API em tempo real, mantendo contrato de resposta estavel para o frontend.
- Card Last.fm: `upd HH:MM` agora usa o inicio da faixa (quando disponivel) em vez do horario do polling; sincronizacao ganhou throttle anti-burst em eventos de foco/visibilidade e pausa de polling com aba oculta para reduzir hits sem perder realtime ao voltar.
- Card Strava integrado com endpoint server-side (`/api/strava-activity.php`): OAuth via refresh token, resumo da semana (atividades/distancia/tempo), ultima atividade com link e sync periodico no dashboard.
- Card Strava refinado: quando a semana atual nao tem atividades, o destaque de km passa a considerar a ultima atividade registrada; endpoint ganhou cache de payload (`data/strava-activity-cache.json`, TTL 10min) com fallback stale para reduzir falhas por expiracao de acesso.
- Slot `ProductHunt` substituido por `Samsung Health` na grid da dashboard, mantendo compatibilidade com ordenacao dinamica dos cards.
- Card `Listening Log` recebeu pass de UX visual: blocos internos com estrutura brutalista (track/visualizer/status), animações sutis de sincronizacao e equalizer em `Now Playing`, com fallback em `prefers-reduced-motion`.
- Simplificacao visual no card `Listening Log`: boxes internos removidos para manter apenas o conteudo (faixa, barras e status), preservando animacoes e estados.
- Card `Listening Log` simplificado no status: removidos borda/chip e icone musical, mantendo apenas o texto de estado (`Now Playing`, `Offline`, etc.).
- Sincronizacao do card `Listening Log` alterada para modo quase em tempo real com polling adaptativo: 10s em `Now Playing`, 30s em idle, 60s com aba em segundo plano e retry de 45s em erro, evitando requests concorrentes.
- Polling do Last.fm evoluido para backoff adaptativo por estabilidade (aumenta intervalo quando a faixa nao muda), pausa inteligente por visibilidade/rede (`visibilitychange`, `online`, `offline`, `focus`, `pageshow`) e sync leve (`limit=4`) vs completo (`limit=100` no modal), reduzindo hits sem cache persistente e mantendo resposta quase realtime.
- Alerta em tempo real de troca de musica adicionado: toast glass no canto do rodape com faixa/artista/capa, exibido apenas quando a musica muda e auto-dismiss em 3 segundos.
- Estetica do toast de troca de musica evoluida para `liquid glass`: refração mais evidente, highlights internos, brilho especular animado e profundidade de vidro com suporte a `prefers-reduced-motion`.
- Card `Listening Log` agora abre modal com historico das musicas tocadas no dia, agrupando duplicadas por faixa+artista e exibindo contagem por item.
- Endpoint `api/lastfm-recent.php` ampliado para retornar historico recente detalhado (ate 100 itens com `played_at_unix`, `played_at`, `album` e `album_art`) para suportar agrupamento diario no frontend.
- Toast de notificacao musical refinado para visual glass mais proximo da referencia: bloco translúcido sem arredondamentos, fundo de vidro transparente e composicao com indicador lateral de reproducao.
- Modal de musicas do dia atualizado para exibir album por faixa agrupada (com fallback e consolidacao quando houver mais de um album para a mesma musica).
- Links de referencia do Last.fm adicionados nos blocos textuais de musica/artista/album: card principal, itens do modal diario e conteudo textual do toast de notificacao.
- Toast de musica recebeu camada vetorial SVG para liquid glass (caustic/reflexo/borda optica) e icones em SVG, aproximando o visual do padrao Apple sem arredondamentos.
- Fundo do toast de musica simplificado: gradientes removidos e base alterada para preto translúcido, preservando blur e camadas de vidro.
- Notificacao de musica alinhada ao layout de `notification_example.html`: estrutura minimal com capa 60x60, tipografia em 3 linhas (musica/artista/album) e icone musical discreto na lateral.
- Notificacao de musica refinada para dark mode com contraste ampliado: base mais escura/translúcida, reflexo superior calibrado e hierarquia de texto ajustada para leitura em baixa luminosidade.
- Correcao visual no light mode da notificacao de musica: fundo de vidro mais claro, tipografia em tons escuros e contraste ajustado (mantendo dark mode inalterado).
- Card `Samsung Health` integrado com endpoint server-side (`/api/samsung-health.php`): leitura de arquivo local `data/samsung-health.json` (export manual), destaque de km da ultima atividade e da semana, estado de erro sem quebrar ordenacao dinamica do dashboard.
- Endpoint `api/samsung-health.php` adicionado com contrato estavel (`ok: false` sem quebrar JSON), cache em arquivo `data/samsung-health-cache.json` (TTL 10min) e fallback para cache stale quando disponivel.
- `data/samsung-health.json` criado como arquivo-base para input manual de dados exportados do Samsung Health.

### Planned
- Consolidacao do prototipo HTML com melhorias de acessibilidade e semantica.
- Integracao gradual de dados externos com fallback visual e seguranca.
- Avaliacao futura de migracao para framework em iniciativa separada.

### Added
- Documento `docs/dashboard-api-agentes.md` com um agente dedicado por task de integracao de API dos cards do dashboard.
- Documento `docs/manual-tokens-apis-dashboard.md` com passo a passo para obtencao de tokens por servico e links de documentacao dev oficial.
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
