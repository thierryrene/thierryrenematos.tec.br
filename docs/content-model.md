# Modelo de Conteudo (Preparacao para CMS)

Este documento define o modelo minimo de dados para migracao futura para CMS sem quebrar layout.

## Objetos principais

### Post
Campos obrigatorios:
- `id` (string estavel)
- `slug` (string unica)
- `title` (string)
- `excerpt` (string curta)
- `content` (array de paragrafos)
- `category` (string)
- `created_at` (YYYY-MM-DD)
- `updated_at` (YYYY-MM-DD)
- `status` (`draft|published|archived`)

### Foto
Campos obrigatorios:
- `id`
- `slug`
- `title`
- `description`
- `essay_id`
- `year`
- `image`
- `alt`
- `created_at`
- `updated_at`
- `status`

### Ensaio
Campos obrigatorios:
- `id`
- `slug`
- `name`
- `title`
- `description`
- `created_at`
- `updated_at`
- `status`

### Midia
Campos obrigatorios:
- `id`
- `owner_type` (`post|photo`)
- `owner_id`
- `path`
- `kind`
- `alt`
- `caption`
- `credit`
- `created_at`
- `updated_at`

## Convencoes editoriais
- Titulo de post: ate 90 caracteres.
- Excerpt de post: ate 180 caracteres.
- Foto precisa sempre de `alt` descritivo e contexto curto.
- Categoria de blog deve usar taxonomia fechada.
- Slugs devem ser minusculos e com hifen.

## Checklist de publicacao

### Blog
- [ ] `id` e `slug` validos
- [ ] titulo e excerpt revisados
- [ ] categoria definida
- [ ] status em `published`
- [ ] data de atualizacao revisada

### Fotografias
- [ ] foto associada a `essay_id`
- [ ] `year` preenchido
- [ ] `alt` acessivel e especifico
- [ ] descricao curta definida
- [ ] metadados de midia atualizados (`media-map.json`)

### Interacoes sociais (fase local)
- [ ] likes funcionais por foto
- [ ] comentarios locais por foto
- [ ] mensagem privada local por foto
- [ ] textos de aviso indicando que e simulacao local
