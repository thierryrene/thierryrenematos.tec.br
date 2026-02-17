# Lembrete - Ultimas Alteracoes

Data de referencia: 2026-02-17

## O que foi feito por ultimo

1. Padronizacao de largura entre paginas internas
- Todas as secoes principais agora usam a classe `page-shell`.
- Token criado: `--page-max-width` em `:root`.
- Arquivo alterado: `index.html`.

2. Design system minimo iniciado
- Tokens de espacamento/componentes em `:root`.
- Classes base de UI criadas e aplicadas (`.ui-btn`, `.ui-card`, `.ui-label`).
- Documento criado: `docs/design-system.md`.

3. Requisitos nao-funcionais definidos e aplicados
- Checklist criado: `docs/non-functional-checklist.md`.
- Ajustes no HTML para SEO e a11y (meta description, skip link, aria em modais/nav, foco visivel).
- Melhorias de performance em midia da galeria (`loading="lazy"` para imagens).

4. Base pronta para CMS futuro (sem framework)
- Conteudo separado em `data/*.json`:
  - `data/posts.json`
  - `data/photos.json`
  - `data/essays.json`
  - `data/media-map.json`
- Documento criado: `docs/content-model.md`.

5. Galeria de fotografias
- Secao ajustada para blocos de midia (imagem/video) com legenda.
- Interacoes locais tipo social funcionando:
  - like (emoji)
  - comentarios (modal)
  - mensagem privada (modal)
- Persistencia local via `localStorage`.

6. Blog
- Conteudos ficticios restaurados para manter composicao do layout.

## Ultimo push realizado
- Branch: `master`
- Remoto: `origin`
- Commit mais recente enviado: `535b8e2`
- Mensagem: `🎨 style: padronizar largura das secoes internas no desktop`

## Contexto para retomada (Blog + Fotografias)
Objetivo: amadurecer as duas frentes sem trocar stack agora (manter HTML + Tailwind CDN + JS puro).

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

## Ordem sugerida para proxima sessao
1. Criar arquivos de categorias/tags (`post-categories`, `photo-tags`).
2. Implementar `content-rules.js`.
3. Modularizar render em `assets/js/render/*`.
4. Aplicar filtros expandidos em fotografias (incluindo tipo).
5. Adicionar docs editoriais (`editorial-blog` e `editorial-fotografias`).
