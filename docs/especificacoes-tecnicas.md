# meu website - Especificacao Tecnica do Projeto

Este documento e a fonte de verdade para o desenvolvimento do meu website.

## 1. Visao do projeto
Meu website e um website pessoal com proposta de dashboard biografico em linguagem Neo-Brutalista.

Definicao editorial:
- `meu.ponto` e o nome da secao de blog;
- significado: "meu ponto de vista".

Objetivo principal nesta fase:
- consolidar um layout forte e funcional;
- validar a experiencia visual e de navegacao;
- preparar base para futuras integracoes de dados.

## 2. Stack oficial (fase atual)
A stack oficial desta fase e:
- HTML5
- Tailwind CSS via CDN
- CSS customizado (variaveis no `:root`)
- JavaScript puro (sem framework)

Regras:
- nao introduzir framework frontend agora;
- nao introduzir build pipeline obrigatorio agora;
- manter a base simples, legivel e facil de editar.
- manter JavaScript desacoplado do HTML, carregado por arquivo externo (`assets/js/main.js`).

## 3. Itens removidos da especificacao (nao considerar por enquanto)
Os itens abaixo estao explicitamente fora do escopo atual:
- migracao obrigatoria para Astro;
- arquitetura de ilhas/hidratacao parcial como requisito imediato;
- Content Collections, Astro Actions, `server:defer`;
- Edge Functions como dependencia para iniciar o projeto.

Observacao:
- esses pontos podem voltar no futuro como fase de modernizacao, mas nao devem guiar implementacoes atuais.

## 4. Arquitetura visual
### 4.1 Grid e proporcao
- Desktop (>= 768px): grid principal com 5 colunas.
- Mobile (< 768px): coluna unica com ordem semantica preservada.
- Bloco biografico principal: ocupa 2 colunas x 2 linhas no desktop.

### 4.2 Linguagem Neo-Brutalista
- bordas fazem parte da estrutura visual;
- cantos predominantemente retos;
- evitar espacamentos que quebrem a continuidade da malha;
- usar `box-sizing: border-box` global.

### 4.3 Design system minimo obrigatorio
- manter tokens globais no `:root` para espacamento, borda e componentes;
- padronizar estilo de botao e card por classes base reutilizaveis;
- evitar estilos duplicados quando houver classe base equivalente.

### 4.4 Diretrizes mobile obrigatorias
- Header deve manter logo, navegacao e toggle de tema utilizaveis sem sobreposicao em <768px.
- Navegacao horizontal em mobile pode ter scroll, mas sem cortar links ou foco visivel.
- Header pode auto-ocultar ao scroll descendente no mobile, com affordance visual para retorno.
- Titulos e blocos de texto devem escalar em mobile (`text-*` e `p-*` responsivos) para evitar overflow.
- Cards interativos (fotos/blog) devem aceitar quebra de linha e `flex-wrap` para icones/metadados.
- Espacamento base em mobile deve priorizar `p-6` ou menor; expansao para `p-8/p-10/p-12` apenas em `md+`.
- Dashboard mobile oficial (opcao 1): coluna unica com slots estaveis por `min-height`, incluindo blocos vazios.
- Respeitar safe-area (`env(safe-area-inset-*)`) em header/footer/modais quando aplicavel.

Referencia:
- `docs/design-system.md`

## 5. Sistema de temas
Variaveis base:
- `--bg-color`
- `--grid-border`
- `--text-main`
- `--text-label`
- `--accent`

Comportamento:
1. tema automatico por horario local (dia/noite);
2. transicao visual suave na troca;
3. override manual pelo usuario;
4. persistencia do override em `localStorage`.

## 6. Estrutura de conteudo (fase atual)
No prototipo atual, o conteudo pode permanecer em pagina unica com secoes:
- Dashboard
- Sobre
- Fotografias
- Blog
- Contato

Diretriz:
- manter navegacao clara entre secoes;
- preservar semantica HTML;
- preparar conteudo para futura separacao em rotas fisicas, sem obrigatoriedade nesta fase.

### 6.3 Internacionalizacao (i18n)
- Idiomas ativos: `pt-BR` e `en-US`.
- Conteudo textual deve ser gerenciado por dicionarios JSON em `data/i18n/`.
- UI deve permitir troca de idioma com persistencia em `localStorage`.
- `html[lang]` deve refletir o idioma ativo para acessibilidade/SEO.

### 6.1 Modelo de dados local (preparacao para CMS)
O conteudo deve ser mantido em arquivos JSON no diretorio `data/`:
- `data/posts.json`
- `data/photos.json`
- `data/essays.json`
- `data/media-map.json`

Campos obrigatorios para objetos de conteudo:
- `id`, `slug`, `created_at`, `updated_at`, `status`

Requisito:
- renderizar blog e fotografias a partir desses dados, evitando acoplamento do layout a texto hardcoded.

### 6.2 Midia e metadados
- organizar midia em `assets/img/blog/` e `assets/img/fotografias/`;
- manter metadados de acessibilidade (`alt`) e contexto (`caption`, `credit`) no `media-map`.

## 7. Integracoes externas
Nesta fase, integracoes podem ser representadas por placeholders.

Quando integrar APIs reais:
- nunca expor tokens/chaves no client;
- priorizar camada server-side quando houver backend;
- implementar estado de erro visivel (degradacao elegante).

### 7.1 Interacoes sociais em Fotografias (fase atual)
Enquanto nao houver backend, likes, comentarios e mensagens privadas podem funcionar em modo local com `localStorage`, apenas para validacao de UX.

Quando evoluir para producao:
- mover persistencia para backend autenticado;
- aplicar moderacao e limite de abuso;
- adicionar consentimento e politica de privacidade para dados de interacao.

## 8. Regras para agentes de codigo
- seguir este documento como referencia principal;
- nao introduzir stack diferente da fase atual sem aprovacao explicita;
- evitar mudancas de escopo amplo em tarefas pequenas;
- manter consistencia visual com a grade e tema definidos;
- atualizar `CHANGELOG.md` em mudancas relevantes.
- registrar os updates da sessao na nota diaria do Obsidian (`Diário de Trabalho`) por edicao manual de texto, sem automacao por script.
- em sessoes com `commit` e `push`, a atualizacao da nota diaria do Obsidian e obrigatoria na mesma sessao.
- padronizar coleta manual no diario com campos estruturados minimos para reports: `commits_qtd`, `pushes_qtd`, `arquivos_alterados_qtd`, `status_sessao`, `proximo_passo`.

## 9. Requisitos nao-funcionais obrigatorios
- Mobile-first: base funcional primeiro em telas pequenas.
- Mobile QA minimo em 360px, 390px e 768px sem overflow horizontal nao intencional.
- Acessibilidade: semantica correta, foco visivel, contraste adequado, `alt` em midias.
- Performance: midias otimizadas e `loading=\"lazy\"` quando aplicavel.
- SEO basico: `title`, `meta description` e hierarquia de headings consistente.

Referencia:
- `docs/non-functional-checklist.md`

## 10. Roadmap revisado
1. consolidar layout e conteudo da versao HTML atual;
2. ajustar acessibilidade, semantica e performance basica;
3. integrar primeiros dados reais de forma segura;
4. avaliar migracao para framework em etapa futura, com decisao tecnica separada.

Documento revisado em: 2026-02-23
