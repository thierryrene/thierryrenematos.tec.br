# API local - Last.fm

Endpoint implementado:
- `GET /api/lastfm-recent.php`

Variaveis de ambiente necessarias no servidor:
- `LASTFM_API_KEY`
- `LASTFM_USERNAME`

Para desenvolvimento local, o endpoint tenta ler `../.env` automaticamente.

Exemplo de payload retornado:

```json
{
  "ok": true,
  "now_playing": true,
  "track": {
    "name": "Track Name",
    "artist": "Artist Name",
    "album": "Album Name",
    "url": "https://www.last.fm/music/...",
    "played_at": null
  },
  "recent": [
    { "name": "Track Name", "artist": "Artist Name", "is_now_playing": true }
  ]
}
```
