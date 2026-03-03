# API local - Dashboard integrations

Endpoints implementados:
- `GET /api/lastfm-recent.php`
- `GET /api/github-activity.php`

## Last.fm
Variaveis de ambiente necessarias:
- `LASTFM_API_KEY`
- `LASTFM_USERNAME`

## GitHub
Variaveis de ambiente:
- `GITHUB_USERNAME` (opcional; default: `thierryrene`)
- `GITHUB_TOKEN` (opcional; recomendado para reduzir risco de rate limit)

Para desenvolvimento local, os endpoints tentam ler `../.env` automaticamente.
