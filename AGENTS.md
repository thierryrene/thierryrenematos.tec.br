# AGENTS.md - Diretrizes para agentes de codigo

## Objetivo
Este repositorio implementa o projeto pessoal **Thierry Rene Matos**. Agentes devem manter coerencia com a proposta biografica, a estetica brutalista e a arquitetura definida nas especificacoes tecnicas.
No contexto de conteudo, `meu.ponto` e o nome editorial do blog ("meu ponto de vista").

## Ordem de prioridade
1. `docs/especificacoes-tecnicas.md` (fonte da verdade)
2. `docs/agent-playbook.md` (traducao operacional)
3. `README.md` (contexto de produto e visao)

## Regras obrigatorias
- Nao introduzir solucoes que quebrem a malha visual sem justificativa tecnica documentada.
- Nao expor secrets/API keys em client-side.
- Nao remover bordas/estrutura brutalista sem solicitacao explicita.
- Garantir acessibilidade minima (contraste AA, foco visivel, semantica HTML).
- Registrar mudancas relevantes no `CHANGELOG.md`.
- Registrar ao final de cada sessao os updates do projeto na nota diaria do Obsidian (`Diário de Trabalho`), sempre por atualizacao manual de texto (sem scripts de automacao).
- Sempre que houver `commit` e `push`, atualizar a nota diaria do Obsidian na mesma sessao (sem excecao).
- Ao atualizar o diario, preencher tambem os campos estruturados de coleta para reports (`commits_qtd`, `pushes_qtd`, `arquivos_alterados_qtd`, `status_sessao`, `proximo_passo`).
- Usar convencao de commits com emoji.

## Fluxo padrao de trabalho para agentes
1. Ler `docs/especificacoes-tecnicas.md` e mapear impacto da tarefa.
2. Propor mudanca minima viavel, sem escopo paralelo desnecessario.
3. Implementar com foco em performance e manutencao.
4. Validar comportamento e nao regressao.
5. Atualizar `CHANGELOG.md` quando aplicavel.
6. Quando houver `commit` e `push`, atualizar obrigatoriamente a nota diaria do Obsidian na mesma sessao (manual, sem script).
7. Garantir que os dados estruturados do diario estejam completos para consolidacao futura de relatorios.

## Guardrails de implementacao
- Preferir componentes reutilizaveis para blocos de grid.
- Preservar comportamento de tema (automatico + override manual).
- Tratar estados de erro/loading em integracoes externas.
- Priorizar renderizacao estatica no que nao exige hidratacao.

## Quando houver conflito
Se a tarefa solicitada conflitar com a especificacao, o agente deve:
1. apontar o conflito de forma objetiva;
2. sugerir alternativa aderente;
3. so implementar excecao com aprovacao explicita.

## Ambiente de desenvolvimento local
- O projeto roda em um stack **LAMP via Docker** (container `lamp-php81`, PHP 8.1 + Apache).
- Document root: `/home/thierry/docker/www` mapeado para `/var/www/html` no container.
- Webserver disponivel em `http://localhost` (porta 80).
- URL base do projeto: `http://localhost/thierryrenematos.tec.br/`
- Para testar endpoints PHP, sempre usar o webserver Docker: `http://localhost/thierryrenematos.tec.br/api/<endpoint>.php`
- **Nao usar `php -S` (servidor built-in do PHP CLI)**: nao tem curl, nao espelha o ambiente real e nao e necessario.
- Secrets ficam em `/home/thierry/docker/www/thierryrenematos.tec.br/.env` (gitignored).
