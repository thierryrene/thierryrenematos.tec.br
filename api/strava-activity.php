<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

const STRAVA_AUTH_CACHE_FILE = __DIR__ . '/../data/strava-auth-cache.json';
const STRAVA_ACTIVITY_CACHE_FILE = __DIR__ . '/../data/strava-activity-cache.json';
const STRAVA_TOKEN_SKEW_SECONDS = 90;
const STRAVA_CACHE_TTL_SECONDS = 600;

function startsWith(string $haystack, string $needle): bool
{
    if ($needle === '') return true;
    return strpos($haystack, $needle) === 0;
}

function endsWith(string $haystack, string $needle): bool
{
    if ($needle === '') return true;
    $needleLen = strlen($needle);
    if ($needleLen > strlen($haystack)) return false;
    return substr($haystack, -$needleLen) === $needle;
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

        $key = trim($parts[0]);
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
    $updatedTimestamp = strtotime($updatedAt);
    if ($updatedTimestamp === false) return false;
    return (time() - $updatedTimestamp) < $ttlSeconds;
}

function writePayloadCache(string $path, array $payload): void
{
    writeJsonFile($path, [
        'updated_at' => gmdate('c'),
        'payload' => $payload
    ]);
}

function isAccessTokenValid(?array $tokenData): bool
{
    if (!is_array($tokenData)) return false;
    $accessToken = trim((string) ($tokenData['access_token'] ?? ''));
    $expiresAt = (int) ($tokenData['expires_at'] ?? 0);
    if ($accessToken === '' || $expiresAt <= 0) return false;
    return $expiresAt > (time() + STRAVA_TOKEN_SKEW_SECONDS);
}

function httpPostFormJson(string $url, array $fields): array
{
    $postBody = http_build_query($fields);
    $responseBody = '';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postBody,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'User-Agent: thierry-dashboard-strava/1.0'
            ],
        ]);

        $result = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($result === false) throw new RuntimeException('network_error: ' . $curlError);
        if ($httpCode < 200 || $httpCode >= 300) throw new RuntimeException('upstream_http_' . $httpCode);
        $responseBody = (string) $result;
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'timeout' => 10,
                'header' => "Content-Type: application/x-www-form-urlencoded\r\nAccept: application/json\r\nUser-Agent: thierry-dashboard-strava/1.0\r\n",
                'content' => $postBody
            ],
        ]);

        $result = @file_get_contents($url, false, $context);
        if ($result === false) throw new RuntimeException('network_error');
        $responseBody = (string) $result;
    }

    $decoded = json_decode($responseBody, true);
    if (!is_array($decoded)) throw new RuntimeException('invalid_json');
    return $decoded;
}

function httpGetJson(string $url, string $accessToken): array
{
    $responseBody = '';
    $headers = [
        'Accept: application/json',
        'Authorization: Bearer ' . trim($accessToken),
        'User-Agent: thierry-dashboard-strava/1.0'
    ];

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER => $headers,
        ]);

        $result = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($result === false) throw new RuntimeException('network_error: ' . $curlError);
        if ($httpCode < 200 || $httpCode >= 300) throw new RuntimeException('upstream_http_' . $httpCode);
        $responseBody = (string) $result;
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 10,
                'header' => implode("\r\n", $headers) . "\r\n",
            ],
        ]);
        $result = @file_get_contents($url, false, $context);
        if ($result === false) throw new RuntimeException('network_error');
        $responseBody = (string) $result;
    }

    $decoded = json_decode($responseBody, true);
    if (!is_array($decoded)) throw new RuntimeException('invalid_json');
    return $decoded;
}

function getCurrentWeekStartTimestamp(string $timezoneId = 'America/Sao_Paulo'): int
{
    $tz = new DateTimeZone($timezoneId);
    $now = new DateTimeImmutable('now', $tz);
    $weekday = (int) $now->format('N'); // 1=Mon..7=Sun
    $startOfWeek = $now->setTime(0, 0, 0)->modify('-' . ($weekday - 1) . ' days');
    return $startOfWeek->getTimestamp();
}

function normalizeActivity(array $activity): array
{
    $id = (int) ($activity['id'] ?? 0);
    $name = trim((string) ($activity['name'] ?? ''));
    $type = trim((string) ($activity['sport_type'] ?? ($activity['type'] ?? 'Activity')));
    $distanceMeters = (float) ($activity['distance'] ?? 0);
    $movingTimeSec = (int) ($activity['moving_time'] ?? 0);
    $startDate = trim((string) ($activity['start_date'] ?? ''));
    $startDateLocal = trim((string) ($activity['start_date_local'] ?? ''));
    $timezone = trim((string) ($activity['timezone'] ?? ''));
    $url = $id > 0 ? ('https://www.strava.com/activities/' . $id) : 'https://www.strava.com/';

    return [
        'id' => $id,
        'name' => $name,
        'type' => $type,
        'distance_km' => round($distanceMeters / 1000, 2),
        'moving_time_sec' => $movingTimeSec,
        'start_date' => $startDate,
        'start_date_local' => $startDateLocal !== '' ? $startDateLocal : $startDate,
        'timezone' => $timezone,
        'url' => $url,
    ];
}

loadEnvFile(__DIR__ . '/../.env');

$clientId = getenvOr('STRAVA_CLIENT_ID', '');
$clientSecret = getenvOr('STRAVA_CLIENT_SECRET', '');
$envRefreshToken = getenvOr('STRAVA_REFRESH_TOKEN', '');
$envAccessToken = getenvOr('STRAVA_ACCESS_TOKEN', '');
$authCache = readJsonFile(STRAVA_AUTH_CACHE_FILE);
$activityCache = readJsonFile(STRAVA_ACTIVITY_CACHE_FILE);

if (isCacheFresh($activityCache, STRAVA_CACHE_TTL_SECONDS) && is_array($activityCache['payload'] ?? null)) {
    $cachedPayload = $activityCache['payload'];
    $cachedPayload['cache'] = [
        'hit' => true,
        'stale' => false,
        'updated_at' => (string) ($activityCache['updated_at'] ?? '')
    ];
    respond(200, $cachedPayload);
}

if ($clientId === '' || $clientSecret === '' || ($envRefreshToken === '' && !isAccessTokenValid($authCache))) {
    if (is_array($activityCache['payload'] ?? null)) {
        $cachedPayload = $activityCache['payload'];
        $cachedPayload['cache'] = [
            'hit' => true,
            'stale' => true,
            'updated_at' => (string) ($activityCache['updated_at'] ?? '')
        ];
        $cachedPayload['warning'] = 'missing_env_using_cached_data';
        respond(200, $cachedPayload);
    }
    respond(200, [
        'ok' => false,
        'error' => 'missing_strava_env',
        'hint' => 'Configure STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET and STRAVA_REFRESH_TOKEN.',
        'athlete' => ['id' => 0, 'name' => '', 'profile' => ''],
        'latest_activity' => null,
        'week' => ['count' => 0, 'distance_km' => 0, 'moving_time_sec' => 0],
        'cache' => ['hit' => false, 'stale' => false, 'updated_at' => '']
    ]);
}

$tokenData = is_array($authCache) ? $authCache : [];

if (!isAccessTokenValid($tokenData)) {
    $refreshToken = trim((string) ($tokenData['refresh_token'] ?? $envRefreshToken));
    if ($refreshToken === '') {
        if (is_array($activityCache['payload'] ?? null)) {
            $cachedPayload = $activityCache['payload'];
            $cachedPayload['cache'] = [
                'hit' => true,
                'stale' => true,
                'updated_at' => (string) ($activityCache['updated_at'] ?? '')
            ];
            $cachedPayload['warning'] = 'missing_refresh_token_using_cached_data';
            respond(200, $cachedPayload);
        }
        respond(200, [
            'ok' => false,
            'error' => 'missing_refresh_token',
            'athlete' => ['id' => 0, 'name' => '', 'profile' => ''],
            'latest_activity' => null,
            'week' => ['count' => 0, 'distance_km' => 0, 'moving_time_sec' => 0],
            'cache' => ['hit' => false, 'stale' => false, 'updated_at' => '']
        ]);
    }

    $oauthResponse = null;
    try {
        $oauthResponse = httpPostFormJson('https://www.strava.com/oauth/token', [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
        ]);
    } catch (Throwable $exception) {
        if ($envAccessToken !== '') {
            $tokenData = [
                'access_token' => $envAccessToken,
                'refresh_token' => $envRefreshToken,
                'expires_at' => time() + 240,
                'athlete' => []
            ];
        } else {
            if (is_array($activityCache['payload'] ?? null)) {
                $cachedPayload = $activityCache['payload'];
                $cachedPayload['cache'] = [
                    'hit' => true,
                    'stale' => true,
                    'updated_at' => (string) ($activityCache['updated_at'] ?? '')
                ];
                $cachedPayload['warning'] = 'oauth_refresh_failed_using_cached_data';
                respond(200, $cachedPayload);
            }
            respond(200, [
                'ok' => false,
                'error' => 'oauth_refresh_failed',
                'detail' => $exception->getMessage(),
                'athlete' => ['id' => 0, 'name' => '', 'profile' => ''],
                'latest_activity' => null,
                'week' => ['count' => 0, 'distance_km' => 0, 'moving_time_sec' => 0],
                'cache' => ['hit' => false, 'stale' => false, 'updated_at' => '']
            ]);
        }
    }

    if (is_array($oauthResponse)) {
        $tokenData = [
            'access_token' => trim((string) ($oauthResponse['access_token'] ?? '')),
            'refresh_token' => trim((string) ($oauthResponse['refresh_token'] ?? $refreshToken)),
            'expires_at' => (int) ($oauthResponse['expires_at'] ?? 0),
            'athlete' => is_array($oauthResponse['athlete'] ?? null) ? $oauthResponse['athlete'] : []
        ];

        if ($tokenData['access_token'] === '' || $tokenData['expires_at'] <= 0) {
            respond(200, [
                'ok' => false,
                'error' => 'invalid_oauth_response',
                'athlete' => ['id' => 0, 'name' => '', 'profile' => ''],
                'latest_activity' => null,
                'week' => ['count' => 0, 'distance_km' => 0, 'moving_time_sec' => 0],
                'cache' => ['hit' => false, 'stale' => false, 'updated_at' => '']
            ]);
        }

        writeJsonFile(STRAVA_AUTH_CACHE_FILE, $tokenData);
    }
}

$accessToken = trim((string) ($tokenData['access_token'] ?? ''));
if ($accessToken === '') {
    if (is_array($activityCache['payload'] ?? null)) {
        $cachedPayload = $activityCache['payload'];
        $cachedPayload['cache'] = [
            'hit' => true,
            'stale' => true,
            'updated_at' => (string) ($activityCache['updated_at'] ?? '')
        ];
        $cachedPayload['warning'] = 'missing_access_token_using_cached_data';
        respond(200, $cachedPayload);
    }
    respond(200, [
        'ok' => false,
        'error' => 'missing_access_token',
        'athlete' => ['id' => 0, 'name' => '', 'profile' => ''],
        'latest_activity' => null,
        'week' => ['count' => 0, 'distance_km' => 0, 'moving_time_sec' => 0],
        'cache' => ['hit' => false, 'stale' => false, 'updated_at' => '']
    ]);
}

$athleteRaw = is_array($tokenData['athlete'] ?? null) ? $tokenData['athlete'] : [];
$athleteId = (int) ($athleteRaw['id'] ?? 0);
$athleteName = trim((string) (($athleteRaw['firstname'] ?? '') . ' ' . ($athleteRaw['lastname'] ?? '')));
$athleteProfile = trim((string) ($athleteRaw['profile'] ?? ''));

try {
    $athleteApi = httpGetJson('https://www.strava.com/api/v3/athlete', $accessToken);
    if (is_array($athleteApi)) {
        $athleteId = (int) ($athleteApi['id'] ?? $athleteId);
        $athleteFirst = trim((string) ($athleteApi['firstname'] ?? ''));
        $athleteLast = trim((string) ($athleteApi['lastname'] ?? ''));
        $athleteName = trim(($athleteFirst . ' ' . $athleteLast));
        $athleteProfile = trim((string) (($athleteApi['profile_medium'] ?? '') ?: ($athleteApi['profile'] ?? $athleteProfile)));
    }

    $latestActivities = httpGetJson('https://www.strava.com/api/v3/athlete/activities?per_page=1&page=1', $accessToken);
    $weekAfter = getCurrentWeekStartTimestamp('America/Sao_Paulo');
    $weekActivities = httpGetJson(
        'https://www.strava.com/api/v3/athlete/activities?per_page=50&page=1&after=' . $weekAfter,
        $accessToken
    );
} catch (Throwable $exception) {
    if (is_array($activityCache['payload'] ?? null)) {
        $cachedPayload = $activityCache['payload'];
        $cachedPayload['cache'] = [
            'hit' => true,
            'stale' => true,
            'updated_at' => (string) ($activityCache['updated_at'] ?? '')
        ];
        $cachedPayload['warning'] = 'upstream_failure_using_cached_data';
        respond(200, $cachedPayload);
    }
    respond(200, [
        'ok' => false,
        'error' => 'upstream_failure',
        'detail' => $exception->getMessage(),
        'athlete' => ['id' => $athleteId, 'name' => $athleteName, 'profile' => $athleteProfile],
        'latest_activity' => null,
        'week' => ['count' => 0, 'distance_km' => 0, 'moving_time_sec' => 0],
        'cache' => ['hit' => false, 'stale' => false, 'updated_at' => '']
    ]);
}

$latestRaw = (is_array($latestActivities) && is_array($latestActivities[0] ?? null)) ? $latestActivities[0] : null;
$latest = is_array($latestRaw) ? normalizeActivity($latestRaw) : null;

$weekCount = 0;
$weekDistanceKm = 0.0;
$weekMovingTime = 0;
if (is_array($weekActivities)) {
    foreach ($weekActivities as $activity) {
        if (!is_array($activity)) continue;
        $weekCount += 1;
        $weekDistanceKm += ((float) ($activity['distance'] ?? 0)) / 1000;
        $weekMovingTime += (int) ($activity['moving_time'] ?? 0);
    }
}

$payload = [
    'ok' => true,
    'athlete' => [
        'id' => $athleteId,
        'name' => $athleteName,
        'profile' => $athleteProfile,
    ],
    'latest_activity' => $latest,
    'week' => [
        'count' => $weekCount,
        'distance_km' => round($weekDistanceKm, 2),
        'moving_time_sec' => $weekMovingTime,
    ],
    'token' => [
        'expires_at' => (int) ($tokenData['expires_at'] ?? 0),
        'cached' => is_array($authCache),
    ],
    'cache' => [
        'hit' => false,
        'stale' => false,
        'updated_at' => gmdate('c')
    ]
];

writePayloadCache(STRAVA_ACTIVITY_CACHE_FILE, $payload);
respond(200, $payload);
