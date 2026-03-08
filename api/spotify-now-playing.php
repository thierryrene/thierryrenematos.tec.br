<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

const SPOTIFY_AUTH_CACHE_FILE    = __DIR__ . '/../data/spotify-auth-cache.json';
const SPOTIFY_PAYLOAD_CACHE_FILE = __DIR__ . '/../data/spotify-cache.json';
const SPOTIFY_TOKEN_SKEW_SECONDS = 90;
const SPOTIFY_CACHE_TTL_PLAYING  = 20;
const SPOTIFY_CACHE_TTL_IDLE     = 60;

function startsWith(string $haystack, string $needle): bool
{
    if ($needle === '') return true;
    return strpos($haystack, $needle) === 0;
}

function endsWith(string $haystack, string $needle): bool
{
    if ($needle === '') return true;
    $len = strlen($needle);
    if ($len > strlen($haystack)) return false;
    return substr($haystack, -$len) === $needle;
}

function loadEnvFile(string $path): void
{
    if (!is_file($path) || !is_readable($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) return;
    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || startsWith($trimmed, '#')) continue;
        $parts = explode('=', $trimmed, 2);
        if (count($parts) !== 2) continue;
        $key   = trim($parts[0]);
        $value = trim($parts[1]);
        if ($key === '') continue;
        if ((startsWith($value, '"') && endsWith($value, '"')) || (startsWith($value, "'") && endsWith($value, "'"))) {
            $value = substr($value, 1, -1);
        }
        if (getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

function getenvOr(string $key, string $fallback = ''): string
{
    $value = getenv($key);
    if ($value === false) return $fallback;
    $trimmed = trim((string) $value);
    return $trimmed === '' ? $fallback : $trimmed;
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonFile(string $path): ?array
{
    if (!is_file($path) || !is_readable($path)) return null;
    $raw = file_get_contents($path);
    if ($raw === false || trim($raw) === '') return null;
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : null;
}

function writeJsonFile(string $path, array $payload): void
{
    @file_put_contents(
        $path,
        json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL,
        LOCK_EX
    );
}

function isCacheFresh(?array $cache, int $ttlSeconds): bool
{
    if (!is_array($cache)) return false;
    $updatedAt = (string) ($cache['updated_at'] ?? '');
    if ($updatedAt === '') return false;
    $ts = strtotime($updatedAt);
    if ($ts === false) return false;
    return (time() - $ts) < $ttlSeconds;
}

function isAccessTokenValid(?array $tokenData): bool
{
    if (!is_array($tokenData)) return false;
    $accessToken = trim((string) ($tokenData['access_token'] ?? ''));
    $expiresAt   = (int) ($tokenData['expires_at'] ?? 0);
    if ($accessToken === '' || $expiresAt <= 0) return false;
    return $expiresAt > (time() + SPOTIFY_TOKEN_SKEW_SECONDS);
}

function httpPostFormJson(string $url, array $fields, array $headers = []): array
{
    $postBody = http_build_query($fields);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $postBody,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER     => array_merge(
                ['Content-Type: application/x-www-form-urlencoded', 'Accept: application/json'],
                $headers
            ),
        ]);
        $result   = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr  = curl_error($ch);
        curl_close($ch);
        if ($result === false) throw new RuntimeException('network_error: ' . $curlErr);
        if ($httpCode < 200 || $httpCode >= 300) throw new RuntimeException('upstream_http_' . $httpCode);
        $decoded = json_decode((string) $result, true);
    } else {
        $context = stream_context_create(['http' => [
            'method'  => 'POST',
            'timeout' => 10,
            'header'  => implode("\r\n", array_merge(
                ['Content-Type: application/x-www-form-urlencoded', 'Accept: application/json'],
                $headers
            )) . "\r\n",
            'content' => $postBody,
        ]]);
        $result = @file_get_contents($url, false, $context);
        if ($result === false) throw new RuntimeException('network_error');
        $decoded = json_decode((string) $result, true);
    }

    if (!is_array($decoded)) throw new RuntimeException('invalid_json');
    return $decoded;
}

/**
 * Makes a GET request to the Spotify API.
 * Returns ['status' => int, 'body' => array|null] - body is null on 204 No Content.
 */
function httpGetSpotify(string $url, string $accessToken): array
{
    $headers = [
        'Authorization: Bearer ' . trim($accessToken),
        'Accept: application/json',
        'User-Agent: thierry-dashboard-spotify/1.0',
    ];

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER     => $headers,
        ]);
        $result   = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr  = curl_error($ch);
        curl_close($ch);
        if ($result === false) throw new RuntimeException('network_error: ' . $curlErr);
        if ($httpCode === 204) return ['status' => 204, 'body' => null];
        if ($httpCode < 200 || $httpCode >= 300) throw new RuntimeException('upstream_http_' . $httpCode);
        $decoded = json_decode((string) $result, true);
        return ['status' => $httpCode, 'body' => is_array($decoded) ? $decoded : null];
    }

    $context = stream_context_create(['http' => [
        'method'          => 'GET',
        'timeout'         => 10,
        'header'          => implode("\r\n", $headers) . "\r\n",
        'ignore_errors'   => true,
    ]]);
    $result = @file_get_contents($url, false, $context);
    if ($result === false) throw new RuntimeException('network_error');
    if (trim((string) $result) === '') return ['status' => 204, 'body' => null];
    $decoded = json_decode((string) $result, true);
    return ['status' => 200, 'body' => is_array($decoded) ? $decoded : null];
}

function normalizeSpotifyTrack(array $item, ?string $playedAt = null): array
{
    $name    = trim((string) ($item['name'] ?? ''));
    $artists = is_array($item['artists'] ?? null) ? $item['artists'] : [];
    $artist  = implode(', ', array_map(
        static fn ($a) => trim((string) ($a['name'] ?? '')),
        array_filter($artists, static fn ($a) => is_array($a))
    ));
    $album     = trim((string) (($item['album']['name'] ?? '') ?: ''));
    $albumUrl  = trim((string) (($item['album']['external_urls']['spotify'] ?? '') ?: ''));
    $trackUrl  = trim((string) (($item['external_urls']['spotify'] ?? '') ?: ''));
    $durationMs = (int) ($item['duration_ms'] ?? 0);

    $images   = is_array($item['album']['images'] ?? null) ? $item['album']['images'] : [];
    $albumArt = '';
    foreach ($images as $img) {
        if (!is_array($img)) continue;
        $candidate = trim((string) ($img['url'] ?? ''));
        $width     = (int) ($img['width'] ?? 0);
        // prefer ~300px image
        if ($candidate !== '' && ($albumArt === '' || abs($width - 300) < 100)) {
            $albumArt = $candidate;
        }
    }

    return [
        'name'        => $name,
        'artist'      => $artist,
        'album'       => $album,
        'album_art'   => $albumArt,
        'url'         => $trackUrl ?: $albumUrl,
        'duration_ms' => $durationMs,
        'played_at'   => $playedAt,
    ];
}

function emptyPayload(): array
{
    return [
        'ok'          => true,
        'now_playing' => false,
        'progress_ms' => null,
        'track'       => null,
        'cache'       => ['hit' => false, 'stale' => false, 'updated_at' => ''],
    ];
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

loadEnvFile(__DIR__ . '/../.env');

$clientId     = getenvOr('SPOTIFY_CLIENT_ID');
$clientSecret = getenvOr('SPOTIFY_CLIENT_SECRET');
$envRefresh   = getenvOr('SPOTIFY_REFRESH_TOKEN');

$authCache    = readJsonFile(SPOTIFY_AUTH_CACHE_FILE);
$payloadCache = readJsonFile(SPOTIFY_PAYLOAD_CACHE_FILE);

// ─── Cache check ─────────────────────────────────────────────────────────────

$nowPlayingFromCache = (bool) (($payloadCache['payload']['now_playing'] ?? false));
$cacheTtl = $nowPlayingFromCache ? SPOTIFY_CACHE_TTL_PLAYING : SPOTIFY_CACHE_TTL_IDLE;

if (isCacheFresh($payloadCache, $cacheTtl) && is_array($payloadCache['payload'] ?? null)) {
    $hit              = $payloadCache['payload'];
    $hit['cache']     = ['hit' => true, 'stale' => false, 'updated_at' => (string) ($payloadCache['updated_at'] ?? '')];
    respond(200, $hit);
}

// ─── Config guard ────────────────────────────────────────────────────────────

if ($clientId === '' || $clientSecret === '') {
    if (is_array($payloadCache['payload'] ?? null)) {
        $stale            = $payloadCache['payload'];
        $stale['cache']   = ['hit' => true, 'stale' => true, 'updated_at' => (string) ($payloadCache['updated_at'] ?? '')];
        $stale['warning'] = 'missing_env_using_cached_data';
        respond(200, $stale);
    }
    $empty          = emptyPayload();
    $empty['ok']    = false;
    $empty['error'] = 'missing_spotify_env';
    $empty['hint']  = 'Configure SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET e SPOTIFY_REFRESH_TOKEN.';
    respond(200, $empty);
}

// ─── Token refresh ───────────────────────────────────────────────────────────

$tokenData = is_array($authCache) ? $authCache : [];

if (!isAccessTokenValid($tokenData)) {
    $refreshToken = trim((string) ($tokenData['refresh_token'] ?? $envRefresh));
    if ($refreshToken === '') {
        if (is_array($payloadCache['payload'] ?? null)) {
            $stale            = $payloadCache['payload'];
            $stale['cache']   = ['hit' => true, 'stale' => true, 'updated_at' => (string) ($payloadCache['updated_at'] ?? '')];
            $stale['warning'] = 'missing_refresh_token_using_cached_data';
            respond(200, $stale);
        }
        $empty          = emptyPayload();
        $empty['ok']    = false;
        $empty['error'] = 'missing_refresh_token';
        respond(200, $empty);
    }

    $basicAuth = base64_encode($clientId . ':' . $clientSecret);
    try {
        $oauthResponse = httpPostFormJson(
            'https://accounts.spotify.com/api/token',
            ['grant_type' => 'refresh_token', 'refresh_token' => $refreshToken],
            ['Authorization: Basic ' . $basicAuth]
        );
    } catch (Throwable $e) {
        if (is_array($payloadCache['payload'] ?? null)) {
            $stale            = $payloadCache['payload'];
            $stale['cache']   = ['hit' => true, 'stale' => true, 'updated_at' => (string) ($payloadCache['updated_at'] ?? '')];
            $stale['warning'] = 'oauth_refresh_failed_using_cached_data';
            respond(200, $stale);
        }
        $empty           = emptyPayload();
        $empty['ok']     = false;
        $empty['error']  = 'oauth_refresh_failed';
        $empty['detail'] = $e->getMessage();
        respond(200, $empty);
    }

    $newAccessToken  = trim((string) ($oauthResponse['access_token'] ?? ''));
    $newRefreshToken = trim((string) ($oauthResponse['refresh_token'] ?? $refreshToken));
    $expiresIn       = (int) ($oauthResponse['expires_in'] ?? 3600);

    if ($newAccessToken === '') {
        $empty          = emptyPayload();
        $empty['ok']    = false;
        $empty['error'] = 'invalid_oauth_response';
        respond(200, $empty);
    }

    $tokenData = [
        'access_token'  => $newAccessToken,
        'refresh_token' => $newRefreshToken,
        'expires_at'    => time() + $expiresIn,
    ];
    writeJsonFile(SPOTIFY_AUTH_CACHE_FILE, $tokenData);
}

$accessToken = trim((string) ($tokenData['access_token'] ?? ''));
if ($accessToken === '') {
    $empty          = emptyPayload();
    $empty['ok']    = false;
    $empty['error'] = 'missing_access_token';
    respond(200, $empty);
}

// ─── Spotify API calls ───────────────────────────────────────────────────────

try {
    $nowPlayingResp = httpGetSpotify(
        'https://api.spotify.com/v1/me/player/currently-playing?additional_types=track',
        $accessToken
    );
} catch (Throwable $e) {
    if (is_array($payloadCache['payload'] ?? null)) {
        $stale            = $payloadCache['payload'];
        $stale['cache']   = ['hit' => true, 'stale' => true, 'updated_at' => (string) ($payloadCache['updated_at'] ?? '')];
        $stale['warning'] = 'upstream_failure_using_cached_data';
        respond(200, $stale);
    }
    $empty           = emptyPayload();
    $empty['ok']     = false;
    $empty['error']  = 'upstream_failure';
    $empty['detail'] = $e->getMessage();
    respond(200, $empty);
}

// 204 = nothing playing; fall back to recently played
if ($nowPlayingResp['status'] === 204 || $nowPlayingResp['body'] === null) {
    try {
        $recentResp = httpGetSpotify(
            'https://api.spotify.com/v1/me/player/recently-played?limit=1',
            $accessToken
        );
        $recentItem  = $recentResp['body']['items'][0] ?? null;
        $recentTrack = is_array($recentItem['track'] ?? null) ? $recentItem['track'] : null;
        $playedAt    = trim((string) ($recentItem['played_at'] ?? ''));

        $track = is_array($recentTrack) ? normalizeSpotifyTrack($recentTrack, $playedAt) : null;
        $payload = [
            'ok'          => true,
            'now_playing' => false,
            'progress_ms' => null,
            'track'       => $track,
            'cache'       => ['hit' => false, 'stale' => false, 'updated_at' => gmdate('c')],
        ];
    } catch (Throwable $e) {
        $payload = emptyPayload();
        $payload['cache']['updated_at'] = gmdate('c');
    }

    writeJsonFile(SPOTIFY_PAYLOAD_CACHE_FILE, ['updated_at' => gmdate('c'), 'payload' => $payload]);
    respond(200, $payload);
}

// Currently playing
$data        = $nowPlayingResp['body'];
$isPlaying   = (bool) ($data['is_playing'] ?? false);
$progressMs  = isset($data['progress_ms']) ? (int) $data['progress_ms'] : null;
$itemRaw     = is_array($data['item'] ?? null) ? $data['item'] : null;

$track = is_array($itemRaw) ? normalizeSpotifyTrack($itemRaw) : null;

$payload = [
    'ok'          => true,
    'now_playing' => $isPlaying && $track !== null,
    'progress_ms' => $progressMs,
    'track'       => $track,
    'cache'       => ['hit' => false, 'stale' => false, 'updated_at' => gmdate('c')],
];

writeJsonFile(SPOTIFY_PAYLOAD_CACHE_FILE, ['updated_at' => gmdate('c'), 'payload' => $payload]);
respond(200, $payload);
