# Checklist Nao-Funcional

Este checklist deve ser validado em cada mudanca relevante de layout/conteudo.

## 1. Mobile-first
- [ ] Layout base funcional em telas pequenas (<768px).
- [ ] Breakpoints apenas para expandir composicao, nao para corrigir layout quebrado.
- [ ] Menus e blocos clicaveis com area de toque adequada.

## 2. Acessibilidade (a11y)
- [ ] Semantica estrutural correta (`header`, `nav`, `main`, `section`, `footer`).
- [ ] Foco visivel em links e botoes (`:focus-visible`).
- [ ] Contraste minimo AA entre texto e fundo.
- [ ] `alt` obrigatorio para imagens de conteudo.
- [ ] Hierarquia de headings sem saltos confusos.

## 3. Performance
- [ ] Imagens com dimensoes coerentes e compressao adequada.
- [ ] Midias fora da dobra com `loading="lazy"` quando aplicavel.
- [ ] Evitar JavaScript desnecessario no carregamento inicial.
- [ ] Evitar duplicacao de render que gere custo sem ganho visual.

## 4. SEO basico
- [ ] `title` descritivo e coerente com a pagina.
- [ ] `meta description` presente.
- [ ] Heading principal claro (`h1`) por contexto de pagina.
- [ ] Estrutura de conteudo legivel por rastreadores.

## 5. Conteudo e design system
- [ ] Espacamentos seguindo tokens de `:root`.
- [ ] Botoes e cards usando classes base do design system.
- [ ] Texto de legenda consistente em fotos/videos.
