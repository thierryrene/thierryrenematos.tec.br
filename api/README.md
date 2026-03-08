# API local - Dashboard integrations

Endpoints implementados:
- `GET /api/lastfm-recent.php`
- `GET /api/github-activity.php`
- `GET /api/strava-activity.php`
- `GET /api/samsung-health.php`

## Last.fm
Variaveis de ambiente necessarias:
- `LASTFM_API_KEY`
- `LASTFM_USERNAME`

## GitHub
Variaveis de ambiente:
- `GITHUB_USERNAME` (opcional; default: `thierryrene`)
- `GITHUB_TOKEN` (opcional; recomendado para reduzir risco de rate limit)

Cache:
- arquivo: `data/github-activity-cache.json`
- TTL: 10 minutos
- comportamento: em falha upstream, o endpoint prioriza cache stale quando existir.

## Strava
Variaveis de ambiente:
- `STRAVA_CLIENT_ID`
- `STRAVA_CLIENT_SECRET`
- `STRAVA_REFRESH_TOKEN` (obrigatorio para renovacao de acesso)
- `STRAVA_ACCESS_TOKEN` (opcional; fallback inicial)

Cache tecnico:
- arquivo: `data/strava-auth-cache.json`
- conteudo: ultimo `access_token`/`refresh_token`/`expires_at` retornado pelo OAuth
- objetivo: evitar refresh desnecessario a cada request e preservar integracao estavel

Cache de payload:
- arquivo: `data/strava-activity-cache.json`
- TTL: 10 minutos
- comportamento: em falha OAuth/upstream, o endpoint retorna cache stale quando disponivel

## Samsung Health
Sem variaveis de ambiente. Dados lidos de arquivo local.

Fonte de dados:
- arquivo: `data/samsung-health.json`
- atualizacao: manual (via export do Samsung Health / Health Connect)
- campos esperados: `updated_at`, `source`, `latest_activity` (type/distance_km/moving_time_sec/start_date), `week` (count/distance_km/moving_time_sec)

Cache de payload:
- arquivo: `data/samsung-health-cache.json`
- TTL: 10 minutos
- comportamento: em falha de leitura/dados desatualizados, o endpoint retorna cache stale quando disponivel

Para desenvolvimento local, os endpoints tentam ler `../.env` automaticamente.
