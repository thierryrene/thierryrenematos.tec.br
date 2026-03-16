# Lembrete - Ultimas Alteracoes

Data de referencia: 2026-03-16

## Status consolidado do projeto (2026-03-16)

### Visao geral
O projeto esta com todas as integracoes de dashboard implementadas e funcionais.
A stack e HTML + Tailwind CDN + JS puro + PHP 8.1 no backend (endpoints API).
O foco agora e evoluir o conteudo editorial real e modularizar a renderizacao.

### Integrações de dashboard (todas concluidas)
| Card | Endpoint | Status |
|---|---|---|
| Last.fm (Listening Log) | `api/lastfm-recent.php` | ✅ Polling adaptativo, toast, modal diário |
| GitHub | `api/github-activity.php` | ✅ Atividade recente, mini-grid semanal, starred |
| Strava | `api/strava-activity.php` | ✅ OAuth, resumo semana, última atividade |
| Spotify | `api/spotify-now-playing.php` | ✅ OAuth, playing/recently-played, fallback |
| Samsung Health | `api/samsung-health.php` | ✅ Endpoint pronto; `data/samsung-health.json` vazio (input manual pendente) |

### Dados de conteudo (estado atual)
- `data/posts.json`: 5 posts ficticios com status `published` (categorias: Design, Tech, Tutorial, Life)
- `data/photos.json`: base de fotos com modelo de dados pronto
- `data/essays.json`: base de ensaios fotograficos
- `data/media-map.json`: metadados de midia (alt, caption, credit, slug, status)
- `data/samsung-health.json`: arquivo-base vazio; aguarda export manual do Samsung Health / Health Connect
- `data/i18n/pt-BR.json` e `data/i18n/en-US.json`: dicionarios completos com todas as chaves ativas

### Frontend (estado atual)
- `index.html`: 1463 linhas, layout completo com SPA/History API, todas as secoes e cards
- `assets/js/main.js`: 2829 linhas, JS desacoplado; polling adaptativo, ordenacao dinamica, i18n, temas, toast, modais

### Samsung Health integrado (2026-03-07)

#### O que foi feito
1. `data/samsung-health.json` criado como arquivo-base para input manual de dados exportados do Samsung Health.
2. `api/samsung-health.php` implementado com contrato estavel (`ok: false`), cache em `data/samsung-health-cache.json` (TTL 10min) e fallback stale quando disponivel.
3. Card `Samsung Health` no `index.html` evoluido de placeholder para card funcional com destaque de km, tipo de atividade e meta da semana.
4. `assets/js/main.js` atualizado com constantes, estado e ciclo de sync (polling 5min/10min), integrado ao `initApp` e a ordenacao dinamica do dashboard.
5. `api/README.md` documentado com a nova secao Samsung Health.
6. `CHANGELOG.md` atualizado.

#### Proximo passo - Samsung Health
- Alimentar `data/samsung-health.json` com um export real do Samsung Health ou Health Connect.
  - Campos esperados: `updated_at` (ISO 8601), `source`, `latest_activity.type`, `latest_activity.distance_km`, `latest_activity.moving_time_sec`, `latest_activity.start_date`, `week.count`, `week.distance_km`, `week.moving_time_sec`.

## Atualizacao para proxima sessao (2026-03-03 → conteudo/blog/fotos)

### Objetivo imediato (conteudo)
- Criar arquivos de categorias/tags (`post-categories`, `photo-tags`).
- Implementar `content-rules.js`.
- Modularizar render em `assets/js/render/*`.
- Aplicar filtros expandidos em fotografias (incluindo tipo).
- Adicionar docs editoriais (`editorial-blog` e `editorial-fotografias`).

### A. Estrutura de dados por dominio
- Blog:
  - manter `data/posts.json`
  - criar `data/post-categories.json`
- Fotografias:
  - manter `data/photos.json`
  - manter `data/essays.json`
  - criar `data/photo-tags.json`
- Midia:
  - manter `data/media-map.json` como fonte de `alt`, `caption`, `credit`, `type`

### B. Camada de regras de conteudo
Criar `assets/js/content-rules.js` para validar campos minimos antes do render.

Validacoes minimas:
- Post: `id`, `slug`, `title`, `excerpt`, `category`, `status`, `created_at`
- Foto/Video: `id`, `slug`, `media_type`, `alt`, `essay_id`, `year`, `status`

### C. Modularizacao da renderizacao
Separar o JS por responsabilidade:
- `assets/js/render/blog.js`
- `assets/js/render/photos.js`
- `assets/js/render/modals.js`

Meta: reduzir acoplamento do `index.html` e facilitar migracao para CMS depois.

### D. Estados editoriais
Padronizar e respeitar:
- `draft`
- `published`
- `archived`

Regra: renderizar no site apenas `published`.

### E. Evolucao da frente Blog
- lista por categoria
- relacionados por categoria/tag no detalhe
- incluir campos opcionais em post:
  - `reading_time`
  - `featured`

### F. Evolucao da frente Fotografias
- filtro combinado por `ensaio + ano + tipo (image/video)`
- manter cards focados em midia + legenda (sem blocos textuais soltos)
- exibir metadados curtos: localizacao e data de captura
- manter interacoes locais como prototipo ate existir backend

### G. Documentacao editorial
Criar:
- `docs/editorial-blog.md`
- `docs/editorial-fotografias.md`

Conteudo esperado:
- tom editorial
- formato de titulo/legenda
- checklist de publicacao
- frequencia de atualizacao

## Ultimo push realizado
- Branch: `copilot/analyze-project-data`
- Remoto: `origin`
- Arquivos alterados: `data/samsung-health.json`, `api/samsung-health.php`, `index.html`, `assets/js/main.js`, `api/README.md`, `CHANGELOG.md`
