# Agent Playbook - Thierry Rene Matos

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
- Navegacao clara entre Dashboard, Sobre, Blog e Contato.
- Estados de fallback para blocos de dados externos.

## 5. Seguranca e dados
- Nao expor chaves/tokens no client.
- Usar placeholders quando nao houver backend disponivel.
- Quando houver API real, implementar degradacao elegante para falhas.

## 6. Checklist antes de encerrar tarefa
- Mudanca respeita `docs/especificacoes-tecnicas.md`.
- Layout continua coerente com a grade brutalista.
- Semantica e acessibilidade minima preservadas.
- `CHANGELOG.md` atualizado quando aplicavel.
- Commit com emoji e mensagem semantica.

## 7. Evolucao futura (opcional)
Avaliacao de migracao para framework pode ocorrer no futuro, em iniciativa propria e aprovada, sem impactar a fase atual.
