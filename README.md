# reformulacao do thierryrenematos.tec.br

## Sobre o projeto
O **Thierry Rene Matos** e o meu novo website pessoal: um dashboard biografico que organiza meu rastro digital em uma interface unica, brutalista e orientada a dados.

No projeto, `meu.ponto` e o nome do blog e representa "meu ponto de vista".

Mais do que um portfolio tradicional, este projeto representa meu momento atual como pessoa criativa e tecnica. A proposta e publicar, em tempo real e com identidade visual forte, sinais do que estou construindo, estudando, ouvindo, treinando e escrevendo.

## Proposito pessoal
Este projeto existe para:
- consolidar minha presenca digital em um endereco proprio;
- expressar minha identidade visual e minha visao de produto;
- transformar dados pessoais (musica, atividade, codigo, conteudo) em narrativa;
- manter um site vivo, modular e evolutivo.

## Visao de experiencia
A experiencia desejada combina:
- **estetica Neo-Brutalista**: grade explicita, bordas visiveis, geometria objetiva;
- **navegacao simples**: dashboard, sobre, blog e contato;
- **dinamismo real**: cards alimentados por APIs externas;
- **performance alta**: base estatica com interatividade apenas onde necessario.

## Status atual
- layout em `index.html` com render dinamico de blog e fotografias;
- stack ativa simples: HTML + Tailwind CDN + JS puro;
- camada de conteudo em `data/*.json` pronta para migracao futura para CMS;
- interacoes locais em fotografias (likes, comentarios e mensagem privada);
- design system minimo com tokens CSS em `:root` e classes base de UI;
- checklist nao-funcional definido para mobile-first, a11y, performance e SEO;
- especificacao tecnica mestre em `docs/especificacoes-tecnicas.md`;
- governanca inicial para colaboracao com agentes de codigo.

## Estrutura de pastas
- `index.html`: prototipo inicial da interface
- `assets/css/styles.css`: base de estilos locais
- `assets/js/main.js`: base de scripts locais
- `assets/img/`: imagens do projeto
- `assets/img/blog/`: midia de blog
- `assets/img/fotografias/`: midia de fotografias
- `assets/fonts/`: fontes locais
- `data/posts.json`: base de posts
- `data/photos.json`: base de fotografias
- `data/essays.json`: base de ensaios fotograficos
- `data/media-map.json`: metadados de midia (alt/caption/credito)
- `docs/especificacoes-tecnicas.md`: documento tecnico principal
- `docs/agent-playbook.md`: guia tecnico para execucao por agentes
- `docs/content-model.md`: modelo de conteudo e checklist editorial/publicacao
- `docs/design-system.md`: tokens, padroes de componentes e regras de uso visual
- `docs/non-functional-checklist.md`: criterios de qualidade tecnica por pagina
- `docs/politica-de-conteudo.md`: regras de uso e protecao de conteudo
- `AGENTS.md`: regras operacionais para agentes de codigo
- `CHANGELOG.md`: historico de evolucao do projeto

## Fonte da verdade
Toda decisao de arquitetura, design system e integracoes deve seguir primeiro:
- `docs/especificacoes-tecnicas.md`

Em caso de conflito entre implementacao e documentacao, a especificacao tecnica prevalece ate revisao explicita.

## Processo de evolucao
1. atualizar/revisar requisitos em `docs/especificacoes-tecnicas.md`;
2. planejar mudanca tecnica com base no `docs/agent-playbook.md`;
3. implementar incrementos pequenos e testaveis;
4. registrar alteracoes no `CHANGELOG.md`;
5. versionar com commits semanticos com emoji.

## Convencao de commits
- `✨ feat:` nova funcionalidade
- `🐛 fix:` correcao
- `♻️ refactor:` refatoracao
- `🎨 style:` ajustes visuais e CSS
- `📝 docs:` documentacao
- `✅ test:` testes
- `🔧 chore:` manutencao e configuracao

## Proximos marcos
1. consolidar a versao HTML atual com qualidade visual e tecnica;
2. evoluir acessibilidade, semantica e estrutura de conteudo;
3. integrar dados reais gradualmente com seguranca;
4. avaliar migracao para framework apenas em fase futura.
