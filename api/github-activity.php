<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

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

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getenvOr(string $key, string $fallback = ''): string
{
    $value = getenv($key);
    if ($value === false) return $fallback;
    $trimmed = trim((string) $value);
    return $trimmed === '' ? $fallback : $trimmed;
}

function httpGetJson(string $url, ?string $token = null): array
{
    $responseBody = '';

    $headers = [
        'Accept: application/vnd.github+json',
        'User-Agent: thierry-dashboard-github/1.0'
    ];

    if ($token !== null && trim($token) !== '') {
        $headers[] = 'Authorization: Bearer ' . trim($token);
    }

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
        $responseBody = (string) $result;
        if ($httpCode < 200 || $httpCode >= 300) throw new RuntimeException('upstream_http_' . $httpCode);
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

function normalizeActivity(array $event): array
{
    $type = (string) ($event['type'] ?? 'Activity');
    $repo = (string) ($event['repo']['name'] ?? '');
    $createdAt = (string) ($event['created_at'] ?? '');
    $payload = is_array($event['payload'] ?? null) ? $event['payload'] : [];

    $title = 'Atividade recente no GitHub';
    $url = $repo !== '' ? 'https://github.com/' . $repo : 'https://github.com/';
    $latestPushCommits = 0;

    if ($type === 'PushEvent') {
        $commitCount = getPushCommitCount($payload);
        $latestPushCommits = $commitCount;
        $title = $commitCount > 1
            ? '🚀 Push com ' . $commitCount . ' commits'
            : '🚀 Push recente no repositorio';
        if ($repo !== '') $url = 'https://github.com/' . $repo . '/commits';
    } elseif ($type === 'PullRequestEvent') {
        $action = (string) ($payload['action'] ?? 'updated');
        $title = '🔀 PR ' . $action;
        $prUrl = (string) ($payload['pull_request']['html_url'] ?? '');
        if ($prUrl !== '') $url = $prUrl;
    } elseif ($type === 'IssuesEvent') {
        $action = (string) ($payload['action'] ?? 'updated');
        $title = '🐞 Issue ' . $action;
        $issueUrl = (string) ($payload['issue']['html_url'] ?? '');
        if ($issueUrl !== '') $url = $issueUrl;
    } elseif ($type === 'CreateEvent') {
        $refType = (string) ($payload['ref_type'] ?? 'item');
        if ($refType === 'repository') {
            $title = '🆕 Repo criado';
        } elseif ($refType === 'branch') {
            $title = '🌱 Branch criada';
        } elseif ($refType === 'tag') {
            $title = '🏷️ Tag criada';
        } else {
            $title = '✨ Create ' . $refType;
        }
    } elseif ($type === 'WatchEvent') {
        $title = '⭐ Novo favorito';
    } elseif ($type === 'ForkEvent') {
        $title = '🍴 Fork realizado';
    } elseif ($type === 'ReleaseEvent') {
        $action = (string) ($payload['action'] ?? 'published');
        $title = '📦 Release ' . $action;
    } elseif ($type === 'DeleteEvent') {
        $refType = (string) ($payload['ref_type'] ?? 'item');
        $title = '🗑️ ' . ucfirst($refType) . ' removido';
    } elseif ($type === 'PublicEvent') {
        $title = '🌍 Repositorio publico';
    } elseif ($type === 'CommitCommentEvent') {
        $title = '💬 Comentario em commit';
    } elseif ($type === 'IssueCommentEvent') {
        $title = '💬 Comentario em issue';
    } elseif ($type === 'PullRequestReviewCommentEvent') {
        $title = '📝 Comentario em review';
    }

    return [
        'type' => $type,
        'title' => $title,
        'repo' => $repo,
        'url' => $url,
        'created_at' => $createdAt,
        'latest_push_commits' => $latestPushCommits,
    ];
}

function getPushCommitCount(array $payload): int
{
    $commitsFromArray = is_array($payload['commits'] ?? null) ? count($payload['commits']) : 0;
    $commitsFromSize = is_numeric($payload['size'] ?? null) ? (int) $payload['size'] : 0;
    $commitsFromDistinct = is_numeric($payload['distinct_size'] ?? null) ? (int) $payload['distinct_size'] : 0;
    $count = max($commitsFromArray, $commitsFromSize, $commitsFromDistinct);

    // GitHub public events can omit commit counts; keep heatmap useful with a conservative fallback.
    if ($count <= 0) return 1;
    return $count;
}

function getCurrentWeekWindow(string $timezoneId = 'America/Sao_Paulo'): array
{
    $tz = new DateTimeZone($timezoneId);
    $now = new DateTimeImmutable('now', $tz);
    $weekday = (int) $now->format('N'); // 1=Mon..7=Sun
    $startOfWeek = $now->setTime(0, 0, 0)->modify('-' . ($weekday - 1) . ' days');
    $endOfWeek = $startOfWeek->modify('+7 days');

    return [$startOfWeek, $endOfWeek, $tz];
}

function computeWeeklyCommitHeat(array $events, string $timezoneId = 'America/Sao_Paulo'): array
{
    [$startOfWeek, $endOfWeek, $tz] = getCurrentWeekWindow($timezoneId);
    $commits = [0, 0, 0, 0, 0, 0, 0];

    foreach ($events as $event) {
        if (!is_array($event)) continue;
        if (($event['type'] ?? '') !== 'PushEvent') continue;

        $createdAtRaw = (string) ($event['created_at'] ?? '');
        if ($createdAtRaw === '') continue;

        try {
            $eventAt = new DateTimeImmutable($createdAtRaw);
            $eventAtLocal = $eventAt->setTimezone($tz);
        } catch (Throwable $exception) {
            continue;
        }

        if ($eventAtLocal < $startOfWeek || $eventAtLocal >= $endOfWeek) {
            continue;
        }

        $dayIndex = (int) $eventAtLocal->format('N') - 1; // 0..6
        if ($dayIndex < 0 || $dayIndex > 6) continue;

        $payload = is_array($event['payload'] ?? null) ? $event['payload'] : [];
        $eventCommitCount = getPushCommitCount($payload);
        $commits[$dayIndex] += $eventCommitCount;
    }

    return [
        'timezone' => $timezoneId,
        'starts_at' => $startOfWeek->format(DateTimeInterface::ATOM),
        'ends_at' => $endOfWeek->format(DateTimeInterface::ATOM),
        'commits' => $commits,
        'total_commits' => array_sum($commits),
    ];
}

function fetchLatestStarredRepo(string $username, ?string $token = null): array
{
    $starredUrl = sprintf(
        'https://api.github.com/users/%s/starred?per_page=1&sort=created&direction=desc',
        rawurlencode($username)
    );

    try {
        $repos = httpGetJson($starredUrl, $token);
    } catch (Throwable $exception) {
        return [
            'name' => '',
            'url' => '',
        ];
    }

    if (!is_array($repos) || count($repos) === 0 || !is_array($repos[0] ?? null)) {
        return [
            'name' => '',
            'url' => '',
        ];
    }

    $repo = $repos[0];
    $fullName = trim((string) ($repo['full_name'] ?? ''));
    $htmlUrl = trim((string) ($repo['html_url'] ?? ''));

    return [
        'name' => $fullName,
        'url' => $htmlUrl,
    ];
}

loadEnvFile(__DIR__ . '/../.env');

$username = getenvOr('GITHUB_USERNAME', 'thierryrene');
$token = getenvOr('GITHUB_TOKEN', '');

$githubUrl = sprintf(
    'https://api.github.com/users/%s/events/public?per_page=100',
    rawurlencode($username)
);

try {
    $events = httpGetJson($githubUrl, $token !== '' ? $token : null);
} catch (Throwable $exception) {
    respond(502, [
        'ok' => false,
        'error' => 'upstream_failure',
        'username' => $username,
    ]);
}

if (!is_array($events) || count($events) === 0) {
    $latestStarred = fetchLatestStarredRepo($username, $token !== '' ? $token : null);
    respond(200, [
        'ok' => true,
        'username' => $username,
        'activity' => [
            'type' => 'NoActivity',
            'title' => 'Sem atividade publica recente',
            'repo' => '',
            'url' => 'https://github.com/' . $username,
            'created_at' => '',
            'latest_push_commits' => 0,
        ],
        'week' => computeWeeklyCommitHeat($events),
        'starred' => $latestStarred,
    ]);
}

$firstEvent = null;
foreach ($events as $candidate) {
    if (is_array($candidate) && !empty($candidate['type'])) {
        $firstEvent = $candidate;
        break;
    }
}

if (!is_array($firstEvent)) {
    $latestStarred = fetchLatestStarredRepo($username, $token !== '' ? $token : null);
    respond(200, [
        'ok' => true,
        'username' => $username,
        'activity' => [
            'type' => 'NoActivity',
            'title' => 'Sem atividade publica recente',
            'repo' => '',
            'url' => 'https://github.com/' . $username,
            'created_at' => '',
            'latest_push_commits' => 0,
        ],
        'week' => computeWeeklyCommitHeat($events),
        'starred' => $latestStarred,
    ]);
}

$latestStarred = fetchLatestStarredRepo($username, $token !== '' ? $token : null);

respond(200, [
    'ok' => true,
    'username' => $username,
    'activity' => normalizeActivity($firstEvent),
    'week' => computeWeeklyCommitHeat($events),
    'starred' => $latestStarred,
]);
