<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

const SAMSUNG_HEALTH_DATA_FILE  = __DIR__ . '/../data/samsung-health.json';
const SAMSUNG_HEALTH_CACHE_FILE = __DIR__ . '/../data/samsung-health-cache.json';
const SAMSUNG_HEALTH_CACHE_TTL  = 600;

function shReadJsonFile(string $path): ?array
{
    if (!is_file($path) || !is_readable($path)) return null;
    $raw = file_get_contents($path);
    if ($raw === false || trim($raw) === '') return null;
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : null;
}

function shWriteJsonFile(string $path, array $payload): void
{
    @file_put_contents(
        $path,
        json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . PHP_EOL,
        LOCK_EX
    );
}

function shIsCacheFresh(?array $cache, int $ttlSeconds): bool
{
    if (!is_array($cache)) return false;
    $updatedAt = (string) ($cache['updated_at'] ?? '');
    if ($updatedAt === '') return false;
    $ts = strtotime($updatedAt);
    if ($ts === false) return false;
    return (time() - $ts) < $ttlSeconds;
}

function shRespond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function shBuildFallback(string $error, bool $stale = false, string $updatedAt = ''): array
{
    return [
        'ok'              => false,
        'error'           => $error,
        'source'          => 'samsung_health_export',
        'latest_activity' => null,
        'week'            => ['count' => 0, 'distance_km' => 0, 'moving_time_sec' => 0],
        'cache'           => ['hit' => $stale, 'stale' => $stale, 'updated_at' => $updatedAt],
    ];
}

function shNormalizeActivity(?array $raw): ?array
{
    if (!is_array($raw)) return null;

    $type           = trim((string) ($raw['type'] ?? 'Atividade'));
    $distanceKm     = (float) ($raw['distance_km'] ?? 0);
    $movingTimeSec  = (int)   ($raw['moving_time_sec'] ?? 0);
    $startDate      = trim((string) ($raw['start_date'] ?? ''));

    if ($type === '' && $distanceKm <= 0 && $movingTimeSec <= 0) return null;

    return [
        'type'            => $type !== '' ? $type : 'Atividade',
        'distance_km'     => round($distanceKm, 2),
        'moving_time_sec' => $movingTimeSec,
        'start_date'      => $startDate,
    ];
}

$activityCache = shReadJsonFile(SAMSUNG_HEALTH_CACHE_FILE);

if (shIsCacheFresh($activityCache, SAMSUNG_HEALTH_CACHE_TTL) && is_array($activityCache['payload'] ?? null)) {
    $cached = $activityCache['payload'];
    $cached['cache'] = ['hit' => true, 'stale' => false, 'updated_at' => (string) ($activityCache['updated_at'] ?? '')];
    shRespond(200, $cached);
}

$data = shReadJsonFile(SAMSUNG_HEALTH_DATA_FILE);

if (!is_array($data)) {
    if (is_array($activityCache['payload'] ?? null)) {
        $cached = $activityCache['payload'];
        $cached['cache'] = ['hit' => true, 'stale' => true, 'updated_at' => (string) ($activityCache['updated_at'] ?? '')];
        $cached['warning'] = 'data_file_unreadable_using_cached_data';
        shRespond(200, $cached);
    }
    shRespond(200, shBuildFallback('data_file_unreadable'));
}

$source    = trim((string) ($data['source'] ?? 'samsung_health_export'));
$updatedAt = trim((string) ($data['updated_at'] ?? ''));
$latest    = shNormalizeActivity(is_array($data['latest_activity'] ?? null) ? $data['latest_activity'] : null);

$weekRaw       = is_array($data['week'] ?? null) ? $data['week'] : [];
$weekCount     = (int)   ($weekRaw['count']          ?? 0);
$weekDistKm    = (float) ($weekRaw['distance_km']    ?? 0);
$weekTimeSec   = (int)   ($weekRaw['moving_time_sec'] ?? 0);

if ($updatedAt === '') {
    if (is_array($activityCache['payload'] ?? null)) {
        $cached = $activityCache['payload'];
        $cached['cache'] = ['hit' => true, 'stale' => true, 'updated_at' => (string) ($activityCache['updated_at'] ?? '')];
        $cached['warning'] = 'data_not_updated_yet_using_cached_data';
        shRespond(200, $cached);
    }
    shRespond(200, shBuildFallback('data_not_updated_yet'));
}

$payload = [
    'ok'              => true,
    'source'          => $source !== '' ? $source : 'samsung_health_export',
    'latest_activity' => $latest,
    'week'            => [
        'count'            => $weekCount,
        'distance_km'      => round($weekDistKm, 2),
        'moving_time_sec'  => $weekTimeSec,
    ],
    'data_updated_at' => $updatedAt,
    'cache'           => ['hit' => false, 'stale' => false, 'updated_at' => gmdate('c')],
];

shWriteJsonFile(SAMSUNG_HEALTH_CACHE_FILE, [
    'updated_at' => gmdate('c'),
    'payload'    => $payload,
]);

shRespond(200, $payload);
