# Thierry Rene Matos - Especificacao Tecnica do Projeto

Este documento e a fonte de verdade para o desenvolvimento do site Thierry Rene Matos.

## 1. Visao do projeto
O site Thierry Rene Matos e um website pessoal com proposta de dashboard biografico em linguagem Neo-Brutalista.

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
- Blog
- Contato

Diretriz:
- manter navegacao clara entre secoes;
- preservar semantica HTML;
- preparar conteudo para futura separacao em rotas fisicas, sem obrigatoriedade nesta fase.

## 7. Integracoes externas
Nesta fase, integracoes podem ser representadas por placeholders.

Quando integrar APIs reais:
- nunca expor tokens/chaves no client;
- priorizar camada server-side quando houver backend;
- implementar estado de erro visivel (degradacao elegante).

## 8. Regras para agentes de codigo
- seguir este documento como referencia principal;
- nao introduzir stack diferente da fase atual sem aprovacao explicita;
- evitar mudancas de escopo amplo em tarefas pequenas;
- manter consistencia visual com a grade e tema definidos;
- atualizar `CHANGELOG.md` em mudancas relevantes.

## 9. Roadmap revisado
1. consolidar layout e conteudo da versao HTML atual;
2. ajustar acessibilidade, semantica e performance basica;
3. integrar primeiros dados reais de forma segura;
4. avaliar migracao para framework em etapa futura, com decisao tecnica separada.

Documento revisado em: 2026-02-17
