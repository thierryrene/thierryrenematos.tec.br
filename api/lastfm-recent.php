<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function startsWith(string $haystack, string $needle): bool
{
    if ($needle === '') {
        return true;
    }
    return strpos($haystack, $needle) === 0;
}

function endsWith(string $haystack, string $needle): bool
{
    if ($needle === '') {
        return true;
    }
    $needleLen = strlen($needle);
    if ($needleLen > strlen($haystack)) {
        return false;
    }
    return substr($haystack, -$needleLen) === $needle;
}

function loadEnvFile(string $path): void
{
    if (!is_file($path) || !is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || startsWith($trimmed, '#')) {
            continue;
        }

        $parts = explode('=', $trimmed, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $key = trim($parts[0]);
        $value = trim($parts[1]);

        if ($key === '') {
            continue;
        }

        if ((startsWith($value, '"') && endsWith($value, '"')) || (startsWith($value, "'") && endsWith($value, "'"))) {
            $value = substr($value, 1, -1);
        }

        if (getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getEnvValue(string $key): ?string
{
    $value = getenv($key);
    if ($value === false || trim($value) === '') {
        return null;
    }
    return trim($value);
}

function readIntQueryParam(string $name, int $default, int $min, int $max): int
{
    $raw = $_GET[$name] ?? null;
    if ($raw === null || $raw === '') {
        return $default;
    }

    $value = filter_var($raw, FILTER_VALIDATE_INT);
    if ($value === false) {
        return $default;
    }

    if ($value < $min) return $min;
    if ($value > $max) return $max;
    return $value;
}

function httpGetJson(string $url): array
{
    $responseBody = '';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
            CURLOPT_USERAGENT => 'thierry-dashboard-lastfm/1.0',
        ]);

        $result = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($result === false) {
            throw new RuntimeException('network_error: ' . $curlError);
        }

        $responseBody = (string) $result;
        if ($httpCode < 200 || $httpCode >= 300) {
            throw new RuntimeException('upstream_http_' . $httpCode);
        }
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 10,
                'header' => "Accept: application/json\r\nUser-Agent: thierry-dashboard-lastfm/1.0\r\n",
            ],
        ]);

        $result = @file_get_contents($url, false, $context);
        if ($result === false) {
            throw new RuntimeException('network_error');
        }
        $responseBody = (string) $result;
    }

    $decoded = json_decode($responseBody, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('invalid_json');
    }

    return $decoded;
}

function normalizeTrack(array $track): array
{
    $pickText = static function ($value): string {
        if (is_array($value)) {
            $hashText = $value['#text'] ?? '';
            return trim((string) $hashText);
        }
        return trim((string) $value);
    };

    $name = trim((string) ($track['name'] ?? ''));
    $artist = $pickText($track['artist'] ?? '');
    $album = $pickText($track['album'] ?? '');
    $url = trim((string) ($track['url'] ?? ''));
    $images = is_array($track['image'] ?? null) ? $track['image'] : [];
    $albumArt = '';
    foreach ($images as $image) {
        if (!is_array($image)) {
            continue;
        }
        $candidate = trim((string) ($image['#text'] ?? ''));
        if ($candidate !== '') {
            $albumArt = $candidate;
        }
    }
    $isNowPlaying = (($track['@attr']['nowplaying'] ?? '') === 'true');
    $playedAtUnixRaw = $track['date']['uts'] ?? null;
    $playedAtUnix = is_numeric($playedAtUnixRaw) ? (int) $playedAtUnixRaw : null;
    $playedAt = $isNowPlaying ? null : trim((string) (($track['date']['#text'] ?? '') ?: ($track['date'] ?? '')));

    return [
        'name' => $name,
        'artist' => $artist,
        'album' => $album,
        'album_art' => $albumArt,
        'url' => $url,
        'is_now_playing' => $isNowPlaying,
        'played_at_unix' => $playedAtUnix,
        'played_at' => $playedAt,
    ];
}

loadEnvFile(__DIR__ . '/../.env');

$apiKey = getEnvValue('LASTFM_API_KEY');
$username = getEnvValue('LASTFM_USERNAME');
$requestedLimit = readIntQueryParam('limit', 100, 1, 100);

if ($apiKey === null || $username === null) {
    respond(200, [
        'ok' => false,
        'error' => 'missing_lastfm_env',
        'hint' => 'Configure LASTFM_API_KEY and LASTFM_USERNAME on server-side.',
        'now_playing' => false,
        'track' => null,
        'recent' => [],
    ]);
}

$lastfmUrl = sprintf(
    'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=%s&api_key=%s&format=json&limit=%d',
    rawurlencode($username),
    rawurlencode($apiKey),
    $requestedLimit
);

try {
    $data = httpGetJson($lastfmUrl);
} catch (Throwable $exception) {
    respond(200, [
        'ok' => false,
        'error' => 'upstream_failure',
        'now_playing' => false,
        'track' => null,
        'recent' => [],
    ]);
}

$tracksRaw = $data['recenttracks']['track'] ?? [];
if (is_array($tracksRaw) && array_key_exists('name', $tracksRaw)) {
    $tracksRaw = [$tracksRaw];
}

if (!is_array($tracksRaw) || count($tracksRaw) === 0) {
    respond(200, [
        'ok' => true,
        'now_playing' => false,
        'track' => null,
        'recent' => [],
    ]);
}

$normalizedTracks = array_values(array_filter(array_map(
    static fn ($item) => is_array($item) ? normalizeTrack($item) : null,
    $tracksRaw
)));

$first = $normalizedTracks[0] ?? null;
if (!is_array($first)) {
    respond(200, [
        'ok' => true,
        'now_playing' => false,
        'track' => null,
        'recent' => [],
    ]);
}

respond(200, [
    'ok' => true,
    'now_playing' => (bool) ($first['is_now_playing'] ?? false),
    'track' => [
        'name' => $first['name'] ?? '',
        'artist' => $first['artist'] ?? '',
        'album' => $first['album'] ?? '',
        'album_art' => $first['album_art'] ?? '',
        'url' => $first['url'] ?? '',
        'played_at_unix' => $first['played_at_unix'] ?? null,
        'played_at' => $first['played_at'] ?? null,
    ],
    'recent' => array_map(static fn ($track) => [
        'name' => $track['name'] ?? '',
        'artist' => $track['artist'] ?? '',
        'album' => $track['album'] ?? '',
        'album_art' => $track['album_art'] ?? '',
        'url' => $track['url'] ?? '',
        'is_now_playing' => (bool) ($track['is_now_playing'] ?? false),
        'played_at_unix' => $track['played_at_unix'] ?? null,
        'played_at' => $track['played_at'] ?? null,
    ], array_slice($normalizedTracks, 0, $requestedLimit)),
]);
