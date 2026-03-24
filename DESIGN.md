# DESIGN.md — thierryrenematos.tec.br

> Arquivo de design system + instruções para o Google Stitch.
> Importar diretamente no Stitch para gerar telas consistentes com o projeto.

---

## Como usar no Stitch

1. Acessar [stitch.withgoogle.com](https://stitch.withgoogle.com)
2. Criar novo projeto e importar este `DESIGN.md`
3. Verificar se cores, tipografia e espaçamentos foram reconhecidos
4. Usar os **Prompts de Vibe Design** (seção final) para gerar cada tela
5. Ordem sugerida: Dashboard → Blog → Fotografias → Sobre → Contato → Mobile
6. Para cada tela: gerar 2–3 variações, selecionar a melhor, iterar
7. Conectar telas em protótipo navegável (Home → Sobre → Fotografias → Blog → Post → Contato)
8. Testar responsividade no canvas (360px, 390px, 768px)
9. Exportar HTML + Tailwind CSS quando aprovado

---

## 1. Identidade do Projeto

- **Projeto**: Thierry Rene Matos — Dashboard Biográfico Pessoal
- **URL**: `thierryrenematos.tec.br`
- **Estilo visual**: Neo-Brutalista
- **Blog**: "meu.ponto" (significado editorial: "meu ponto de vista")
- **Propósito**: consolidar sinais digitais (música, código, treino, fotos, escrita) em uma experiência única
- **Tom**: cru, estruturado, vivo — painel de controle pessoal com personalidade editorial
- **Idiomas**: pt-BR (padrão) e en-US, com toggle na interface

---

## 2. Linguagem Visual

- Arestas duras, sem border-radius (cantos sempre retos)
- Bordas visíveis são **estruturais**, não decorativas — definem a malha
- O grid É a arquitetura: cada célula enquadrada por bordas de 1px
- Alto contraste entre conteúdo e estrutura
- Ornamentação mínima — deixar dados e tipografia conduzirem
- Background com textura de pontos sutis (dot pattern 48×48px)
- Estética de "terminal editorial": labels mono uppercase, dados em destaque

---

## 3. Paleta de Cores

### Dark Theme (padrão / Noite)

| Token | Valor | Uso |
|---|---|---|
| `--bg-color` | `#09090b` | Fundo da página (quase preto) |
| `--grid-border` | `#1f1f22` | Todas as bordas estruturais |
| `--text-main` | `#f4f4f5` | Texto principal (quase branco) |
| `--text-label` | `#71717a` | Labels, metadata, texto secundário |
| `--item-hover` | `#141417` | Hover em cards e botões |
| `--accent` | `#ff5c00` | Laranja vivo — foco, links ativos, destaques |
| `--empty-slot` | `rgba(20, 20, 23, 0.4)` | Fundo de slots vazios da dashboard |

### Light Theme (Dia)

| Token | Valor | Uso |
|---|---|---|
| `--bg-color` | `#fcfcfc` | Fundo claro |
| `--grid-border` | `#e4e4e7` | Bordas em cinza claro |
| `--text-main` | `#09090b` | Texto escuro |
| `--text-label` | `#71717a` | Labels (mantido) |
| `--accent` | `#ff5c00` | Laranja (mantido) |
| `--item-hover` | `#f4f4f5` | Hover claro |

### Cores Semânticas

| Cor | Valor | Uso |
|---|---|---|
| Verde sucesso | `#22c55e` | Form OK, indicador online, GitHub commits |
| Vermelho erro | `#f87171` | Form erro, barras equalizer playing |
| Azul Samsung | `#60a5fa` (blue-400) | Card Samsung Health |

### Tema automático
- Troca automaticamente por horário local (dia/noite)
- Override manual via botão no header, persiste em `localStorage`
- Transição suave de 0.6s em background e texto

---

## 4. Tipografia

| Papel | Fonte | Fallback | Estilo |
|---|---|---|---|
| Body / UI | `Inter` | `-apple-system, sans-serif` | pesos 300–600, antialiased |
| Headings / Display | `Instrument Serif` | `serif` | italic, peso 400, tracking -0.02em |

### Hierarquia tipográfica

| Elemento | Tamanho | Peso | Detalhes |
|---|---|---|---|
| Hero título (Dashboard) | `text-4xl → md:text-5xl → lg:text-7xl` | 400 | Serif italic, leading 0.85 |
| Seção título (Blog/Fotos) | `text-5xl → md:text-7xl → lg:text-9xl` | medium | Serif italic, tracking tighter |
| Card título (post) | `text-xl → md:text-2xl` | medium | Serif italic |
| `.ui-label` | `0.65rem` | 600 | UPPERCASE, tracking 0.15–0.2em |
| `.ui-btn` | `0.7rem` | 600 | UPPERCASE, tracking 0.2em |
| Body text | 1rem | 400 | line-height 1.5 |
| Post body `p` | 1rem | 400 | line-height 1.8, opacity 0.85 |
| Dado mono (cards) | `8–10px` | mono | font-mono, UPPERCASE, tracking 0.1–0.2em |
| Footer | `0.625rem` | — | UPPERCASE, tracking 0.16em, opacity 0.45 |

---

## 5. Espaçamento

| Token | Valor |
|---|---|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.25rem (20px) |
| `--space-6` | 1.5rem (24px) |
| `--space-8` | 2rem (32px) |
| `--space-10` | 2.5rem (40px) |
| `--space-12` | 3rem (48px) |
| `--space-16` | 4rem (64px) |

---

## 6. Bordas e Grid

- **Border width**: 1px
- **Border radius**: 0 (sempre — regra absoluta)
- **Cor**: `var(--grid-border)`
- **Construção do grid**: container tem `border-top` + `border-left`; cada filho tem `border-right` + `border-bottom`
- **Resultado**: malha contínua sem dupla borda

### Layout Grid

| Contexto | Estrutura |
|---|---|
| Dashboard desktop | 5 colunas iguais, `grid-cols-5` |
| Sobre desktop | 3 colunas, `grid-cols-3` |
| Fotografias desktop | 4 colunas, `grid-cols-4` |
| Blog desktop | 3 colunas, `grid-cols-3` |
| Contato desktop | 3 colunas (2 form + 1 sidebar) |
| Mobile (<768px) | Sempre 1 coluna |
| Max page width | `100rem` (1600px) |

### Aspect Ratio
- Desktop grid items: `1:1` (quadrados)
- Hero e blocos de texto: `aspect-auto` (altura livre)
- Mobile: sem aspect ratio forçado, altura por conteúdo

---

## 7. Componentes

### Card (`.ui-card` / `.grid-item`)
- Borda right + bottom: 1px solid `--grid-border`
- Padding: `--space-6` (1.5rem), hero: `p-8 md:p-12`
- Border-radius: 0
- Display: flex column
- Hover: background `--item-hover`
- Overflow: hidden, position: relative

### Botão (`.ui-btn`)
- Altura: 2.75rem
- Padding horizontal: 1.25rem
- Font: 0.7rem, UPPERCASE, tracking 0.2em, peso 600
- Borda: 1px solid `--grid-border`
- Fundo transparente
- Hover: background `--item-hover`
- Focus-visible: outline 2px `--accent`

### Label (`.ui-label`)
- Font: 0.65rem, UPPERCASE, tracking 0.15em, peso 600
- Cor: `--text-label`
- Margin-bottom: `--space-3`

### Icon Button (`.icon-btn`)
- 2.75rem × 2.75rem, centrado
- Borda transparente
- Hover: borda `--grid-border`, fundo `--item-hover`, scale 1.03
- Touch target: ≥44px para mobile

### Form Controls (`.ui-input`, `.ui-textarea`, `.ui-select`)
- Borda 1px `--grid-border`, fundo transparente
- Focus: outline 2px `--accent`
- Placeholder: cor `--text-label`, opacity 0.9
- Textarea min-height: 9rem

### Nav Link (`.nav-link`)
- Min-height: 2.5rem (2.75rem no mobile)
- Padding: `--space-2` horizontal
- Active: cor `--accent` + barra de 2px na base

### Modal (`.app-modal`)
- Overlay: rgba(0,0,0,0.6) em full viewport
- Container: max-width 800px, max-height 85vh
- Borda 1px `--grid-border`, fundo `--bg-color`
- Shadow: `0 40px 100px rgba(0,0,0,0.6)`
- Header com padding `--space-8`, borda inferior
- Body com scroll interno e scrollbar de 4px
- Sem border-radius

---

## 8. Animações e Transições

| Tipo | Easing | Duração |
|---|---|---|
| Tema (bg + cor) | `cubic-bezier(0.4, 0, 0.2, 1)` | 0.6s |
| Page fade-in | `cubic-bezier(0.4, 0, 0.2, 1)` | 420ms, translateY 12→0 |
| Page fade-out | `cubic-bezier(0.4, 0, 0.2, 1)` | 320ms, translateY 0→-6 |
| Toast entrada | `cubic-bezier(0.19, 1, 0.22, 1)` | 0.5s, spring |
| Card hover | ease | 0.3s |
| Barras equalizer | ease-in-out | 0.92s, infinite |
| Dot pulse (online) | ease-in-out | 1.5s, infinite |
| Loader dot | ease-in-out | 1s, infinite |

**Regra**: sempre respeitar `prefers-reduced-motion: reduce` — remove todas as animações

### Background Texture
```css
background-image: radial-gradient(circle at 2px 2px, var(--grid-border) 1px, transparent 0);
background-size: 48px 48px;
```

---

## 9. Estrutura Completa do Website

### 9.1 Site Loader
- Tela fixa (z-index 200) com fundo `--bg-color`
- Conteúdo: ponto laranja pulsante + texto "Carregando"
- Desaparece com fade após conteúdo carregado
- Texto traduzível via i18n

### 9.2 Header (sticky, z-index 50)
- **Logo** (esquerda): texto "thierry", link para Dashboard, bold, tracking tight
- **Navegação principal** (centro): 5 links — Dashboard, Sobre, Fotografias, Blog, Contato
  - Links em estilo `.label` (UPPERCASE, 0.65rem, tracking)
  - Link ativo: cor `--accent` + barra inferior 2px
  - Mobile: scroll horizontal com snap, auto-oculta no scroll para baixo
  - Affordance de retorno: barra fina quando nav oculta
- **Controles** (direita):
  - Toggle de idioma PT | EN (botões `.lang-toggle-btn`, ativo com cor `--accent`)
  - Toggle de tema ☀/🌙 (SVG, rotação 180° no tema dia)
- Borda inferior `--grid-border`
- Min-height: 64px

### 9.3 Dashboard (Home) — Grid 5 colunas

**Hero (2 colunas × 2 linhas)**:
- Label: "Plataforma Biográfica"
- Título serif italic: "Designer, developer e observador da vida."
- Subtítulo: "Construindo ecossistemas digitais onde técnica e narrativa se encontram."
- Indicador live: ponto verde pulsante + texto mono "Syncing..." com hora local
- Fundo: gradiente sutil `bg-color → item-hover`

**Cards ativos com integração API**:

| Card | Label | API | Dados exibidos | Detalhes visuais |
|---|---|---|---|---|
| **Spotify** | "Live Stream" | `api/spotify-now-playing.php` | Status (Now Playing/Offline), track, artist, barra de progresso | Dot live, barra 2px com progresso em `--accent`, tag mono "PROT: SPOTIFY_CONNECT" |
| **Last.fm** (Listening Log) | "Listening Log" | `api/lastfm-recent.php` | Track atual, barras equalizer, status (Now Playing/Offline/Há X min) | Fundo dinâmico com capa do álbum (fade + blur), barras vermelhas animadas quando playing, clicável → abre modal "Músicas do dia" |
| **GitHub** | "Code Base" | `api/github-activity.php` | Última atividade (push/PR/issue), mini-grid semanal 7 colunas (verde), contagem de commits | Grid com 4 níveis de verde, tag "VCS: GITHUB_PUSH", link para perfil |
| **Strava** | "Activity Log" | `api/strava-activity.php` | Título última atividade, KM total (grande em `--accent`), KM última corrida, KM semana | Destaque numérico grande (4xl mono), grid 2 colunas para métricas, tag "SRC: STRAVA_V3" |
| **Samsung Health** | "Samsung Health" | `api/samsung-health.php` | Tipo atividade, meta semanal, KM total destaque em azul | Cor azul (blue-400), dados manuais via JSON |

**Cards placeholder (sem integração ainda)**:
- Threads: "@username"
- Instagram: imagem placeholder
- YouTube: "Aguardando novo vídeo..." com label "LATEST_UPLOAD"
- LinkedIn, X, Letterboxd, Dribbble, Steam, Twitch, Behance, Goodreads: slots vazios com fundo `--empty-slot` e texto fantasma "aguardando integração"

**Comportamento dinâmico**:
- Cards reordenam automaticamente por `lastUpdatedAt` (mais recente primeiro)
- Cada card mostra microstatus "upd HH:MM" ou "erro HH:MM" no canto inferior

**Notificação de música** (Toast):
- Posição: fixed, canto inferior direito
- Aparece quando a música muda
- Layout: grid com capa 3.5rem + 3 linhas texto (track/artist/album) + indicador lateral
- Estilo liquid glass: backdrop-filter blur(40px), barra lateral `--accent`
- Auto-dismiss em 3 segundos
- Theme-aware (fundo escuro no dark, claro no light)

### 9.4 Sobre — Grid 3 colunas

**Hero (3 colunas, altura livre)**:
- Label: "Trajetória"
- Título serif: "Uma vida em construção constante." (text-5xl → 8xl)
- Intro: "Este website é meu arquivo vivo..."
- Gradiente `bg-color → item-hover`

**3 cards de foco** (1 coluna cada):
1. "Foco Atual" — "Sinais do cotidiano em produto digital com identidade."
2. "Base Técnica" — "Design de interface, front-end e estratégia editorial."
3. "Direção" — "Construir um ecossistema pessoal, não apenas um portfólio."

**Linha do Tempo** (2 colunas):
- 2009: "Inicio da minha presença digital..."
- 2024: "Consolidação de um fluxo autoral..."
- 2026: "Thierry Rene Matos vira plataforma biográfica..."

**Princípios** (1 coluna):
- 01: "Clareza antes de volume"
- 02: "Identidade antes de tendência"
- 03: "Consistência antes de pressa"

### 9.5 Fotografias — Grid 4 colunas

**Hero (4 colunas)**:
- Label: "Galeria Autoral"
- Título: "Acervo pessoal." (text-5xl → 9xl)
- Subtítulo: "Publico ensaios, registros de rotina e viagens..."

**Filtros (4 colunas)**:
- Label: "Filtros de exploração"
- Filtro por ensaio (botões `.ui-btn`, ativo com `--accent`)
- Filtro por ano
- Renderizados dinamicamente a partir de `data/essays.json`

**Grid de fotos** (renderizado via JS a partir de `data/photos.json`):
- Cada foto: card com imagem, título, descrição, metadata (ensaio, ano, localização)
- Interações locais por foto:
  - Like (coração) — persistido em `localStorage`
  - Comentários — abre modal com lista + form
  - Mensagem privada — abre modal com textarea
- Dados de exemplo: 3 ensaios, 8 fotos/vídeos (São Paulo, Campinas, Rio de Janeiro)

**Ensaios existentes**:
1. "Cidade em contraste" — série urbana noturna (2026)
2. "Ritmo doméstico" — intimidade visual (2025)
3. "Cor de domingo" — cenas espontâneas (2024)

### 9.6 Blog (meu.ponto) — Grid 3 colunas

**Hero (3 colunas)**:
- Label: "meu.ponto - ensaios e notas"
- Título: "Writing & Thoughts" (text-5xl → 9xl)

**Lista de posts** (renderizado via JS a partir de `data/posts.json`):
- Cada post card: categoria (label accent), título serif italic, excerpt, data
- Card clicável (role="button", suporte teclado Enter/Espaço)
- Categorias existentes: Design, Tech, Tutorial, Life

**Posts de exemplo** (5 posts fictícios para validação):
1. "A era das Bento Grids" — Design
2. "Astro 5 e as Ilhas de Servidor" — Tech
3. "Integrando a API do Spotify..." — Tutorial
4. "O Minimalismo no Design Brutalista..." — Design
5. "Como o Strava mudou minha rotina de dev" — Life

### 9.7 Post Detail

**Header do post**:
- Botão "← Voltar para o blog" (label clicável)
- Metadata: data + categoria (em `--accent`)
- Título: text-5xl → 8xl, serif italic

**Layout 4 colunas** (3 conteúdo + 1 sidebar):
- **Coluna principal**: capa do post (imagem 320px, borda), corpo com parágrafos
- **Sidebar**: ações de compartilhamento (X, LinkedIn, Threads como botões texto) + posts relacionados

### 9.8 Contato — Grid 3 colunas

**Hero (3 colunas)**:
- Label: "Contato"
- Título: "Vamos criar algo real." (text-5xl → 9xl)
- Subtítulo: "Resposta esperada em até 2 dias úteis..."

**Formulário (2 colunas)**:
- Campos: nome, email (grid 2 colunas), assunto (select), mensagem (textarea)
- Honeypot anti-spam (campo hidden)
- Checkbox de consentimento LGPD
- Botão submit: `.ui-btn` — "Enviar mensagem"
- Status do form: "Ready to send" / sucesso verde / erro vermelho
- Assuntos: Projeto de website, Consultoria UX/UI, Parceria de conteúdo, Outro

**Sidebar (1 coluna)**:
- "Canais diretos":
  - E-mail (card `.contact-meta` com hover)
  - LinkedIn (link)
  - SLA: "Retorno em até 48h úteis" (italic, opacidade reduzida)

### 9.9 Footer

- Grid 2 colunas desktop, 1 coluna mobile
- 2 células `.ui-card`:
  - Esquerda: "Feito com amor ❤️ em uma tarde de domingo"
  - Direita: "de 2009 até hoje"
- Estilo: UPPERCASE, 0.625rem, tracking 0.16em, opacity 0.45
- Min-height: 4rem desktop, 3.5rem mobile

### 9.10 Modais

| Modal | Trigger | Conteúdo |
|---|---|---|
| **Comentários** | Botão comentário em foto | Lista de comentários + form com textarea |
| **Mensagem Privada** | Botão mensagem em foto | Form com textarea, aviso "protótipo local" |
| **Músicas do Dia** | Clique no card Last.fm | Lista agrupada por faixa+artista, contagem por item, links Last.fm |

Todos os modais: ESC fecha, clique no backdrop fecha, focus trap ativo, scroll do body bloqueado.

---

## 10. Navegação SPA

- History API com `pushState` — sem reload de página
- Rotas: `/`, `/sobre`, `/fotografias`, `/blog`, `/blog/:slug`, `/contato`
- Base path local: `/thierryrenematos.tec.br/`
- Suporte `popstate` (back/forward do browser)
- Atualização de `document.title` e `canonical` por rota
- Transição de página: fade-out 320ms → fade-in 420ms

---

## 11. Funcionalidades JS Implementadas

| Feature | Detalhes |
|---|---|
| Tema automático | Troca dia/noite por horário, override manual em localStorage |
| i18n | Toggle PT/EN, dicionários em `data/i18n/`, persistência local |
| Polling APIs | Spotify (15s play/60s idle), Last.fm (10s play/30s idle, backoff), GitHub (5min), Strava (5min), Samsung (5min/10min) |
| Reordenação live | Cards reordenam por `lastUpdatedAt` no DOM |
| Toast de música | Notificação quando a faixa muda, auto-dismiss 3s |
| Nav auto-hide mobile | Oculta ao scroll down, mostra ao scroll up/topo |
| Likes/comentários locais | Persistidos em `localStorage` por foto |
| XSS mitigation | Render via DOM API, escape de interpolações |
| Skip link | "Pular para o conteúdo" para a11y |
| Keyboard support | Cards de blog com Enter/Espaço, foco visível |

---

## 12. Acessibilidade

- Foco visível: `outline: 2px solid var(--accent)`, offset 2px
- Contraste mínimo: WCAG AA
- `alt` obrigatório em imagens de conteúdo
- HTML semântico: `header`, `nav`, `main`, `section[aria-labelledby]`, `footer`
- Modais: `role="dialog"`, `aria-modal="true"`, ESC, backdrop, focus trap, scroll lock
- Cards interativos: `role="button"`, `tabindex="0"`, `aria-haspopup`
- Toggle idioma: `aria-pressed`
- Loader: `role="status"`, `aria-live="polite"`
- Skip link para conteúdo principal
- `prefers-reduced-motion` respeitado em todas as animações

---

## 13. Dados e Conteúdo

### Estrutura de arquivos de dados

| Arquivo | Conteúdo |
|---|---|
| `data/posts.json` | 5 posts com id, slug, title, excerpt, content[], category, datas, status |
| `data/photos.json` | 8 fotos/vídeos com id, slug, title, description, essay_id, year, media_type, location |
| `data/essays.json` | 3 ensaios fotográficos com id, slug, name, title, description |
| `data/media-map.json` | Metadados de mídia (alt, caption, credit, owner_type) |
| `data/i18n/pt-BR.json` | Dicionário português (~6KB) |
| `data/i18n/en-US.json` | Dicionário inglês (~6KB) |
| `data/samsung-health.json` | Dados manuais de saúde |

### Categorias de blog
Design, Tech, Tutorial, Life

### Ensaios fotográficos
1. Cidade em contraste (2026, São Paulo) — 2 fotos + 1 vídeo
2. Ritmo doméstico (2025, Campinas) — 2 fotos + 1 vídeo
3. Cor de domingo (2024, Rio de Janeiro) — 2 fotos

---

## 14. APIs Server-Side

Todas em `api/*.php`, leitura de secrets via `.env`, nunca expostas no client.

| Endpoint | Serviço | Auth | Cache |
|---|---|---|---|
| `api/spotify-now-playing.php` | Spotify Web API | OAuth 2.0 refresh token | 20s playing / 60s idle |
| `api/lastfm-recent.php` | Last.fm API | API key | Sem cache (realtime) |
| `api/github-activity.php` | GitHub REST API | Token pessoal | Arquivo, TTL 10min, stale fallback |
| `api/strava-activity.php` | Strava API v3 | OAuth refresh token | Arquivo, TTL 10min, stale fallback |
| `api/samsung-health.php` | Local JSON | — | Arquivo, TTL 10min |

Contrato padrao: `{ ok: true/false, ... }` — nunca quebra JSON mesmo em erro.

---

## 15. Don'ts (Regras absolutas)

- ❌ Border-radius em qualquer elemento
- ❌ Cantos arredondados
- ❌ Paletas genéricas / sem personalidade
- ❌ Componentes de framework (React, Vue, Angular)
- ❌ API keys no frontend
- ❌ Remover bordas da malha brutalista
- ❌ Usar `p-10`/`p-12` como base em mobile (apenas `md:` pra cima)

---

## 16. Prompts de Vibe Design para o Stitch

> Colar cada prompt no modo Vibe Design do Stitch após importar este DESIGN.md.

### 🖥️ Dashboard (Home)

```
Design a Neo-Brutalist biographical dashboard. 5-column grid where each cell is a live 
data card. The grid itself IS the design — visible 1px borders (#1f1f22) define every 
cell. No border-radius. Background near-black (#09090b) with subtle dot pattern. 
Accent: vivid orange (#ff5c00) for active states only.

Hero block: 2x2 cells, serif italic title "Designer, developer e observador da vida." 
with green live indicator dot at bottom. Subtle gradient to dark.

Active cards show real-time data:
- Spotify: live dot, track name bold, artist mono, thin progress bar in orange
- Last.fm (Listening Log): track name, 4 animated equalizer bars, status text, 
  dynamic album art background with dark fade overlay
- GitHub: last activity link, 7-cell weekly commit grid in green levels (4 shades), 
  commit count, mono label "VCS: GITHUB_PUSH"
- Strava: last activity title, large 4xl orange KM number, 2-column metrics 
  (last run / week total), mono label "SRC: STRAVA_V3"
- Samsung Health: blue accent, activity type, KM highlight in blue-400

8 empty slots with faded background and ghost text "aguardando integração".
All cards have tiny tech tags in mono (8px, uppercase, 0.2em tracking, only 
visible on hover).

Cards dynamically reorder by last update. Each shows micro-status "upd HH:MM" 
in bottom-right corner.

Music change toast: fixed bottom-right, liquid glass style, album art 3.5rem, 
3 lines of text, orange left bar indicator. Auto-disappears.

Feeling: mission control center for one person's digital life. Raw, structured, 
alive. Not corporate — personal, editorial, with attitude.
```

### 📝 Blog (meu.ponto)

```
Design a Neo-Brutalist blog page called "meu.ponto" (my point of view).

Hero: full-width brutalist cell with label "meu.ponto - ensaios e notas" and 
huge serif italic title "Writing & Thoughts" (up to text-9xl). Gradient background.

Post listing: 3-column grid of cards with hard borders. Each card shows:
- Category label in orange accent, uppercase 0.65rem
- Large serif italic title
- Short excerpt in Inter
- Date in mono
- Hover: subtle background shift, transition 0.3s
- Clickable with keyboard support (role=button)

Categories: Design, Tech, Tutorial, Life

Post detail page:
- "← Back to blog" link at top
- Meta: date + category in accent orange
- Huge serif title (5xl→8xl)
- 4-column layout: 3 cols for content (cover image + body paragraphs with 
  line-height 1.8), 1 col sidebar with share buttons (X, LinkedIn, Threads 
  as uppercase text buttons) and related posts

Feeling: printed editorial column alive on screen. Strong typographic hierarchy, 
no visual noise, brutalist frame around content.
```

### 📷 Fotografias

```
Design a Neo-Brutalist photography gallery. 4-column grid with hard 1px borders.

Hero: full-width, "Galeria Autoral" label, title "Acervo pessoal." (text-9xl), 
subtitle about publishing without external platforms.

Filter bar: two rows of brutalist buttons. First row: filter by essay/collection 
(e.g., "Cidade em contraste", "Ritmo doméstico", "Cor de domingo"). Second row: 
filter by year (2024, 2025, 2026). Active filter: orange accent color.

Photo cards: image fills the card, title and description below with metadata 
(essay name, year, location). Three icon buttons at bottom: heart (like), 
comment bubble, envelope (private message). Icon buttons are 2.75rem square, 
transparent, visible border on hover.

Modal when photo clicked: dark overlay, photo prominent, metadata and 
interactions below. Modal has close button, ESC support, focus trap.

Content examples: urban night shots from São Paulo, domestic scenes from 
Campinas, Sunday colors from Rio de Janeiro. Mix of photos and video stills.

Feeling: curated gallery wall — photos framed by the grid. Interface disappears, 
images speak. Editorial, not Instagram.
```

### 👤 Sobre

```
Design a Neo-Brutalist About page. 3-column grid structure.

Hero: full-width (3 cols), "Trajetória" label, huge serif title "Uma vida em 
construção constante." (text-5xl→8xl), intro paragraph: "Este website é meu 
arquivo vivo...". Gradient background.

3 focus cards (1 col each), with contrasting purposes:
1. "Foco Atual" — signals into digital product with identity
2. "Base Técnica" — interface design, front-end, editorial strategy
3. "Direção" — personal ecosystem, not just a portfolio

Timeline block (2 cols): three milestone entries with year in uppercase mono 
and description paragraph. Years: 2009 (digital presence), 2024 (authorial flow), 
2026 (biographical platform).

Principles block (1 col): numbered 01/02/03 in bold 3xl with subtitles in 
uppercase tracking:
01 - Clarity before volume
02 - Identity before trend
03 - Consistency before rush

Feeling: confident self-presentation without vanity. Author bio expanded into 
a full page. Text-first, structurally interesting, brutalist grid adding weight.
```

### ✉️ Contato

```
Design a Neo-Brutalist contact page. 3-column grid.

Hero: full-width, "Contato" label, huge title "Vamos criar algo real." (text-9xl), 
subtitle about 2-day response time. Gradient background.

Form (2 cols): name + email side by side, subject select dropdown, message textarea 
(min 9rem). All inputs: transparent bg, 1px border, accent on focus. 
Consent checkbox with LGPD text. Submit button full-width brutalist style. 
Form status indicator ("Ready to send" / success green / error red).

Sidebar (1 col): "Canais diretos" label, three stacked data blocks:
- Email: card with border and hover, email link
- LinkedIn: card with link
- SLA: "Retorno em até 48h úteis" in italic, lower opacity

Feeling: direct and efficient — like sending a telegram. Well-structured way 
to reach out. Brutalist form fields feel intentional, not broken.
```

### 📱 Mobile (360px / 390px)

```
Redesign all sections for mobile (360px, 390px). Single column layout.

Header: logo left, PT|EN toggles + theme toggle right. All controls min 64px height. 
Navigation below as horizontal scroll with snap. Auto-hides on scroll down, returns 
on scroll up. When hidden, shows thin 2.25rem bar as affordance.

Dashboard: cards in single column, square aspect ratio each. Hero card taller 
(clamp 15rem, 70vw, 20rem). Regular cards: clamp(10rem, 45vw, 12rem). 
Brutalist borders remain — structure never breaks.

All text scales down progressively. Padding: p-6 base (never p-10/p-12 on mobile). 
Icon buttons: 2.75rem minimum touch target.

Cards with actions (photos): use flex-wrap for interaction buttons to prevent 
horizontal overflow.

Safe-area: respect env(safe-area-inset-*) in header, footer, and modals for 
devices with notch/home indicator.

Toasts: narrower (max 21rem), positioned at --space-3 from edges.

Footer: single column, cells min 3.5rem height.

Feeling: same mission control, compressed for handheld. Not dumbed-down — 
reconfigured. Grid adapts but never apologizes for being brutalist on small screen.
```

---

## 17. Após o Stitch

1. Exportar HTML + Tailwind CSS
2. Salvar export em `/tmp/stitch-export/` ou enviar via MCP para o Antigravity
3. O agente adapta o export ao projeto real (`index.html`, `styles.css`, `main.js`)
4. **Preservar obrigatoriamente**: todas as integrações API, i18n, SPA routing, sistema de temas, interações de fotos, modais, toast de música, reordenação de cards
5. QA em 360px, 390px, 768px e desktop
6. Atualizar `docs/design-system.md` e `CHANGELOG.md`
