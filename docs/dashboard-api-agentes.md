# Dashboard API - Agentes por Task de Integracao

Este documento prepara um agente dedicado para cada task de conexao de API usada nos cards do dashboard.

## Regras comuns (todos os agentes)
- Stack: HTML + Tailwind CDN + JS puro.
- Nao expor tokens/chaves no client.
- Implementar estado `loading`, `success` e `error` no card.
- Criar adaptador server-side (ou mock local) para proteger credenciais.
- Manter consistencia visual brutalista (bordas, grid, slots).

## Contrato padrao de entrega
Cada agente deve entregar:
1. Mapeamento de endpoint(s) + schema minimo de resposta.
2. Estrategia de autenticacao e renovacao de token.
3. Adaptador server-side proposto (`/api/<servico>`).
4. Fallback visual e mensagem de erro amigavel.
5. Checklist de testes manuais (desktop + mobile 360/390/768).

## Agentes prontos

### 1) `agent-threads-card`
- Card alvo: `Threads`
- Task: buscar perfil e ultimas publicacoes para resumo no card.
- API foco: Threads API (Meta).
- Prompt sugerido:

```txt
Voce e o agent-threads-card. Mapeie a integracao do card Threads no dashboard.
Entregue: endpoints oficiais, auth OAuth, campos minimos do card, contrato de /api/threads,
fallback de erro e plano de implementacao em JS puro sem expor token no client.
```

### 2) `agent-instagram-card`
- Card alvo: `Instagram`
- Task: mostrar ultimo post/reel e metrica basica.
- API foco: Instagram Graph API.
- Prompt sugerido:

```txt
Voce e o agent-instagram-card. Defina integracao para ultimo post do Instagram no dashboard.
Entregue endpoints, permissoes, contrato /api/instagram e fallback visual.
```

### 3) `agent-strava-card`
- Card alvo: `Strava`
- Task: exibir metrica resumida (distancia semanal, atividade recente).
- API foco: Strava API.
- Prompt sugerido:

```txt
Voce e o agent-strava-card. Estruture integracao do card Strava com OAuth,
refresh token e payload minimo para distancia semanal + ultima atividade.
```

### 4) `agent-youtube-card`
- Card alvo: `YouTube`
- Task: exibir ultimo video publicado no canal.
- API foco: YouTube Data API v3.
- Prompt sugerido:

```txt
Voce e o agent-youtube-card. Defina integracao para ultimo video no card YouTube.
Entregue endpoint, auth, contrato /api/youtube e estado de erro/loading.
```

### 5) `agent-listening-log-card`
- Card alvo: `Listening Log`
- Task: exibir historico curto de escuta (barras/ultimas faixas).
- API foco: Last.fm API (preferencial) ou Spotify fallback.
- Prompt sugerido:

```txt
Voce e o agent-listening-log-card. Proponha integracao de listening log via Last.fm
(com fallback para Spotify), definindo schema e atualizacao segura no dashboard.
```

### 6) `agent-spotify-card`
- Card alvo: `Spotify`
- Task: now playing/ultimo track com status live.
- API foco: Spotify Web API.
- Prompt sugerido:

```txt
Voce e o agent-spotify-card. Planeje integracao now playing com OAuth,
refresh token e contrato /api/spotify-now-playing sem expor credenciais.
```

### 7) `agent-github-card`
- Card alvo: `GitHub`
- Task: exibir atividade recente (commit/PR/repo).
- API foco: GitHub REST API.
- Prompt sugerido:

```txt
Voce e o agent-github-card. Defina endpoints para atividade recente no GitHub,
auth por token e adaptador /api/github-activity com fallback de limite de rate.
```

### 8) `agent-linkedin-card`
- Card alvo: `LinkedIn`
- Task: exibir post recente ou metrica de perfil permitida.
- API foco: LinkedIn APIs.
- Prompt sugerido:

```txt
Voce e o agent-linkedin-card. Estruture task de integracao do card LinkedIn
considerando escopos restritos, aprovacao de app e fallback quando endpoint nao estiver liberado.
```

### 9) `agent-x-card`
- Card alvo: `X`
- Task: exibir ultimo post publico.
- API foco: X API.
- Prompt sugerido:

```txt
Voce e o agent-x-card. Defina integracao para ultimo post no X,
com auth correta por app, tratamento de rate limit e contrato /api/x-feed.
```

### 10) `agent-letterboxd-card`
- Card alvo: `Letterboxd`
- Task: exibir ultimo diary/review quando houver acesso permitido.
- API foco: Letterboxd (acesso restrito/nao publico).
- Prompt sugerido:

```txt
Voce e o agent-letterboxd-card. Avalie viabilidade de integracao oficial do Letterboxd,
identifique limitacoes de acesso e proponha alternativa segura (ex: feed publico permitido).
```

### 11) `agent-dribbble-card`
- Card alvo: `Dribbble`
- Task: exibir ultimo shot publicado.
- API foco: Dribbble API v2.
- Prompt sugerido:

```txt
Voce e o agent-dribbble-card. Mapeie auth e endpoint para ultimo shot no Dribbble,
com contrato /api/dribbble e fallback quando app nao autorizado.
```

### 12) `agent-steam-card`
- Card alvo: `Steam`
- Task: exibir status de jogo recente/perfil publico.
- API foco: Steam Web API.
- Prompt sugerido:

```txt
Voce e o agent-steam-card. Defina integracao do card Steam com API key server-side,
endpoints de perfil/jogos recentes e tratamento de perfil privado.
```

### 13) `agent-twitch-card`
- Card alvo: `Twitch`
- Task: exibir status online/offline e ultima live.
- API foco: Twitch Helix API.
- Prompt sugerido:

```txt
Voce e o agent-twitch-card. Estruture integracao do card Twitch via Helix API,
com app access token, renovacao e fallback de indisponibilidade.
```

### 14) `agent-behance-card`
- Card alvo: `Behance`
- Task: exibir projeto recente (quando API disponivel).
- API foco: Behance Developer API (status pode variar).
- Prompt sugerido:

```txt
Voce e o agent-behance-card. Verifique viabilidade da API Behance atual,
defina estrategia de integracao ou alternativa oficial caso o acesso esteja restrito.
```

### 15) `agent-goodreads-card`
- Card alvo: `Goodreads`
- Task: exibir leitura atual/recente quando houver fonte oficial.
- API foco: Goodreads (sem novas chaves publicas).
- Prompt sugerido:

```txt
Voce e o agent-goodreads-card. Avalie as restricoes atuais de API Goodreads
e proponha alternativa oficial para compor o card sem violar termos de uso.
```

### 16) `agent-producthunt-card`
- Card alvo: `ProductHunt`
- Task: exibir ultimos lancamentos salvos/seguindo criterio editorial.
- API foco: Product Hunt GraphQL API.
- Prompt sugerido:

```txt
Voce e o agent-producthunt-card. Mapeie query GraphQL para card Product Hunt,
auth via Developer Token e contrato /api/producthunt.
```

## Ordem recomendada de execucao
1. Spotify
2. GitHub
3. YouTube
4. Strava
5. Twitch
6. Product Hunt
7. X
8. Instagram
9. Threads
10. LinkedIn
11. Steam
12. Dribbble
13. Letterboxd
14. Behance
15. Goodreads
16. Listening Log (Last.fm/Spotify)

Motivo: comecar pelas APIs com onboarding mais claro e menor risco de bloqueio.
