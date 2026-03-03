# Agent Playbook - meu website

## 1. Contexto de produto
- Projeto: reformulacao do site pessoal `thierryrenematos.tec.br`.
- Conceito: dashboard biografico com linguagem Neo-Brutalista.
- Objetivo: consolidar sinais digitais em uma experiencia unica e evolutiva.
- Blog: `meu.ponto` (significado editorial: "meu ponto de vista").

## 2. Stack atual obrigatoria
- HTML5
- Tailwind via CDN
- CSS customizado com variaveis
- JavaScript puro
- Conteudo em `data/*.json` (posts/fotos/ensaios/midia)
- Script principal externo em `assets/js/main.js` (evitar JS inline em `index.html`).

Nao fazer nesta fase:
- adotar Astro (ou outro framework) sem aprovacao explicita;
- criar pipeline de build obrigatoria;
- migrar arquitetura para escopo maior que a tarefa.

## 3. Regras visuais inegociaveis
- Grid desktop de 5 colunas como estrutura principal.
- Hero biografico ocupando 2x2 slots no desktop.
- Bordas como parte da arquitetura visual.
- Sistema de temas via variaveis CSS (`:root` + `.theme-day`).

## 4. Requisitos de comportamento
- Tema automatico por horario.
- Override manual com persistencia em `localStorage`.
- Troca de idioma `pt-BR`/`en-US` com persistencia em `localStorage`.
- Navegacao clara entre Dashboard, Sobre, Blog e Contato.
- Estados de fallback para blocos de dados externos.
- Fotografias com filtros por ensaio/ano.
- Interacoes de prototipo em fotografias: likes, comentarios e mensagem privada (modo local).

### 4.1 Guardrails mobile (obrigatorio em toda task de layout)
- Comecar validacao por mobile (<768px) antes de ajustar desktop.
- Evitar `p-10/p-12` como base em mobile; usar escala progressiva (`p-6 md:p-10` etc.).
- Em header/nav, garantir area de toque adequada e ausencia de sobreposicao entre logo, menu e toggle.
- Em cards com acoes (likes/comentarios/partilha), usar `flex-wrap` quando houver risco de estouro horizontal.
- Validar rapidamente em larguras de 360px e 390px antes de encerrar.
- Dashboard mobile deve permanecer em coluna unica (opcao 1), mantendo altura minima estavel em cards vazios.

## 5. Seguranca e dados
- Nao expor chaves/tokens no client.
- Usar placeholders quando nao houver backend disponivel.
- Quando houver API real, implementar degradacao elegante para falhas.

## 6. Checklist antes de encerrar tarefa
- Mudanca respeita `docs/especificacoes-tecnicas.md`.
- Layout continua coerente com a grade brutalista.
- Semantica e acessibilidade minima preservadas.
- `CHANGELOG.md` atualizado quando aplicavel.
- Nota diaria do Obsidian atualizada com os principais updates da sessao (atualizacao manual, sem uso de script).
- Bloco estruturado de coleta preenchido na nota (`commits_qtd`, `pushes_qtd`, `arquivos_alterados_qtd`, `status_sessao`, `proximo_passo`).
- Commit com emoji e mensagem semantica.

## 7. Evolucao futura (opcional)
Avaliacao de migracao para framework pode ocorrer no futuro, em iniciativa propria e aprovada, sem impactar a fase atual.
