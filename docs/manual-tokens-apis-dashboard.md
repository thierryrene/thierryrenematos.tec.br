# Manual - Como obter tokens das APIs do dashboard

Referencia atualizada em: 2026-03-02.

## Regras de seguranca antes de gerar tokens
- Nunca colocar token em `index.html` ou `assets/js/main.js`.
- Guardar segredos em variaveis de ambiente server-side.
- Criar um endpoint backend por servico (`/api/<servico>`) para proteger credenciais.
- Rotacionar tokens periodicamente.

## Guia por servico

### 1) Spotify
- Tipo: OAuth 2.0 (`access_token` + `refresh_token`).
- Passos:
1. Criar app no dashboard de developer.
2. Configurar Redirect URI.
3. Fazer fluxo Authorization Code.
4. Salvar `refresh_token` no backend e renovar `access_token` por servidor.
- Docs dev:
- https://developer.spotify.com/documentation/web-api
- https://developer.spotify.com/documentation/web-api/concepts/authorization
- https://developer.spotify.com/dashboard

### 2) GitHub
- Tipo: Fine-grained Personal Access Token (ou OAuth App/GitHub App).
- Passos:
1. Criar PAT com escopos minimos necessarios.
2. Salvar token no backend.
3. Consumir API via endpoint server-side para evitar exposicao.
- Docs dev:
- https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

### 3) YouTube
- Tipo: API Key (dados publicos) ou OAuth 2.0 (dados privados).
- Passos:
1. Criar projeto no Google Cloud.
2. Ativar YouTube Data API v3.
3. Criar API Key ou credenciais OAuth.
4. Restringir chave/token por origem e escopo.
- Docs dev:
- https://developers.google.com/youtube/v3/getting-started
- https://developers.google.com/youtube/registering_an_application

### 4) Strava
- Tipo: OAuth 2.0 com refresh token.
- Passos:
1. Criar app no painel Strava.
2. Definir callback URL.
3. Executar fluxo OAuth para capturar `code`.
4. Trocar `code` por `access_token` e `refresh_token`.
5. Renovar token no backend.
- Docs dev:
- https://developers.strava.com/docs/getting-started/
- https://developers.strava.com/docs/authentication

### 5) Twitch
- Tipo: OAuth 2.0 (App Access Token ou User Access Token).
- Passos:
1. Registrar app no console Twitch.
2. Gerar `client_id` e `client_secret`.
3. Obter app token via endpoint OAuth.
4. Renovar token quando expirar.
- Docs dev:
- https://dev.twitch.tv/docs/api/
- https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/

### 6) Product Hunt
- Tipo: Developer Token (Bearer) para API GraphQL.
- Passos:
1. Criar app no Product Hunt Developer Portal.
2. Gerar token na API Dashboard.
3. Usar token no backend para queries GraphQL.
- Docs dev:
- https://api.producthunt.com/v2/docs
- https://api.producthunt.com/v2/docs/getting-started/quick-start

### 7) X (Twitter)
- Tipo: OAuth 2.0 Bearer Token e/ou OAuth 1.0a user context.
- Passos:
1. Criar projeto/app no X Developer Portal.
2. Gerar chaves e tokens necessarios para endpoint alvo.
3. Definir permissao (read/read-write) minima.
4. Fazer chamadas por backend para proteger segredo.
- Docs dev:
- https://developer.x.com/en/docs/x-api
- https://developer.x.com/en/docs/tutorials/getting-access-to-the-x-api

### 8) Instagram
- Tipo: OAuth (Instagram Graph API via Meta App).
- Passos:
1. Criar app na plataforma Meta for Developers.
2. Adicionar produto Instagram Graph API.
3. Configurar permissao e conta vinculada.
4. Trocar `code` por token e estender para long-lived token.
- Docs dev:
- https://developers.facebook.com/docs/instagram-platform
- https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api

### 9) Threads
- Tipo: OAuth (Threads API via Meta App).
- Passos:
1. Criar app na plataforma Meta for Developers.
2. Habilitar produto Threads API.
3. Executar fluxo de autorizacao e obter token.
4. Renovar token conforme politica da Meta.
- Docs dev:
- https://developers.facebook.com/docs/threads
- https://www.postman.com/meta/workspace/threads-api/documentation/23987686-9386f468-7714-490f-8ee0-9442db5dc01d

### 10) LinkedIn
- Tipo: OAuth 2.0 (escopos dependem dos produtos aprovados).
- Passos:
1. Criar app no LinkedIn Developer Portal.
2. Solicitar produtos/escopos necessarios.
3. Configurar redirect URL.
4. Executar OAuth para gerar access token.
- Docs dev:
- https://learn.microsoft.com/en-us/linkedin/
- https://www.linkedin.com/developers/apps

### 11) Steam
- Tipo: Steam Web API key.
- Passos:
1. Logar na conta Steam.
2. Gerar chave em pagina oficial de API key.
3. Guardar chave somente no backend.
4. Tratar perfil privado como fallback no card.
- Docs dev:
- https://steamcommunity.com/dev/apikey
- https://partner.steamgames.com/doc/webapi_overview

### 12) Dribbble
- Tipo: OAuth 2.0 personal access token.
- Passos:
1. Registrar app no Dribbble Developers.
2. Definir callback URL.
3. Gerar token e usar somente server-side.
- Docs dev:
- https://developer.dribbble.com/v2/
- https://developer.dribbble.com/v2/oauth/

### 13) Letterboxd
- Tipo: acesso API oficial nao aberto publicamente (status restrito).
- Passos:
1. Validar se sua conta/projeto tem parceria/acesso aprovado.
2. Sem acesso oficial, nao usar scraping que viole termos.
3. Usar fallback (ex.: card estatico, feed permitido pelos termos) ate acesso oficial.
- Referencias:
- https://letterboxd.com

### 14) Behance
- Tipo: historicamente OAuth/API key; disponibilidade atual pode variar por conta.
- Passos:
1. Verificar acesso no portal de developers.
2. Se API indisponivel, manter fallback estatico no dashboard.
3. Integrar apenas por endpoint/documentacao oficial ativa.
- Docs dev:
- https://www.behance.net/dev

### 15) Goodreads
- Tipo: API publica com novas chaves descontinuada para novos usos.
- Passos:
1. Nao planejar dependencia de token novo do Goodreads para producao.
2. Adotar alternativa oficial (Amazon Books, Open Library, etc.) para card de leitura.
- Referencias:
- https://www.goodreads.com/topic/show/22074219-goodreads-is-retiring-its-current-api-and-key-system

### 16) Listening Log (Last.fm como opcao principal)
- Tipo: API key (e opcionalmente assinatura autenticada para write).
- Passos:
1. Criar API account no Last.fm.
2. Gerar API key/secret.
3. Buscar `recenttracks` no backend e normalizar para o card.
- Docs dev:
- https://www.last.fm/api

## Prioridade recomendada para obter tokens
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
16. Last.fm (Listening Log)

Motivo: prioriza APIs com onboarding mais claro e menor risco de bloqueio/restricao.
