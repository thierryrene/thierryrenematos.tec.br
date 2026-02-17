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
- Usar convencao de commits com emoji.

## Fluxo padrao de trabalho para agentes
1. Ler `docs/especificacoes-tecnicas.md` e mapear impacto da tarefa.
2. Propor mudanca minima viavel, sem escopo paralelo desnecessario.
3. Implementar com foco em performance e manutencao.
4. Validar comportamento e nao regressao.
5. Atualizar `CHANGELOG.md` quando aplicavel.

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
