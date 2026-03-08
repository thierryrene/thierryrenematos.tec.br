<?php
/**
 * Spotify OAuth Helper
 * Acesse via Docker webserver: http://localhost/thierryrenematos.tec.br/docs/spotify-oauth-helper.php
 *
 * Antes de usar, adicione esta URL como Redirect URI no Spotify Developer Dashboard:
 * http://localhost/thierryrenematos.tec.br/docs/spotify-oauth-helper.php
 */

declare(strict_types=1);

function loadEnv(string $path): void
{
    if (!is_file($path)) return;
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) continue;
        $k = trim($parts[0]);
        $v = trim($parts[1]);
        if ($k === '') continue;
        if (preg_match('/^["\'](.*)[\'"]\s*$/', $v, $m)) $v = $m[1];
        if (getenv($k) === false) putenv("$k=$v");
    }
}

function env(string $key, string $default = ''): string
{
    $v = getenv($key);
    return ($v === false || trim($v) === '') ? $default : trim($v);
}

loadEnv(__DIR__ . '/../.env');

$clientId     = env('SPOTIFY_CLIENT_ID');
$clientSecret = env('SPOTIFY_CLIENT_SECRET');
$redirectUri  = 'http://localhost/thierryrenematos.tec.br/docs/spotify-oauth-helper.php';
$scope        = 'user-read-currently-playing user-read-recently-played';

header('Content-Type: text/html; charset=utf-8');

// ─── Etapa 2: callback com code ───────────────────────────────────────────────
if (isset($_GET['code']) && $_GET['code'] !== '') {
    $code = $_GET['code'];

    $postBody = http_build_query([
        'grant_type'   => 'authorization_code',
        'code'         => $code,
        'redirect_uri' => $redirectUri,
    ]);
    $authHeader = 'Authorization: Basic ' . base64_encode("$clientId:$clientSecret");

    $ch = curl_init('https://accounts.spotify.com/api/token');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $postBody,
        CURLOPT_HTTPHEADER     => [
            $authHeader,
            'Content-Type: application/x-www-form-urlencoded',
            'Accept: application/json',
        ],
        CURLOPT_TIMEOUT => 15,
    ]);
    $body = (string) curl_exec($ch);
    curl_close($ch);

    $data = json_decode($body, true);

    if (!is_array($data) || empty($data['refresh_token'])) {
        echo '<pre style="color:red">Falha ao obter refresh_token. Resposta Spotify:' . "\n";
        echo htmlspecialchars(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo '</pre>';
        exit;
    }

    $refreshToken = $data['refresh_token'];
    $accessToken  = $data['access_token'] ?? '';
    $expiresIn    = (int) ($data['expires_in'] ?? 3600);

    // Salva cache de auth para o endpoint usar imediatamente
    $cacheFile = __DIR__ . '/../data/spotify-auth-cache.json';
    file_put_contents($cacheFile, json_encode([
        'access_token'  => $accessToken,
        'refresh_token' => $refreshToken,
        'expires_at'    => time() + $expiresIn,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL, LOCK_EX);

    echo '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Spotify OAuth</title>
<style>body{font-family:monospace;padding:2rem;max-width:700px}pre{background:#f4f4f4;padding:1rem;border-radius:4px;word-break:break-all;white-space:pre-wrap}</style>
</head><body>';
    echo '<h2 style="color:green">&#10003; Autenticação concluída!</h2>';
    echo '<p>Adicione ao <code>.env</code>:</p>';
    echo '<pre>SPOTIFY_REFRESH_TOKEN=' . htmlspecialchars($refreshToken) . '</pre>';
    echo '<p>O cache de auth foi salvo em <code>data/spotify-auth-cache.json</code>.<br>';
    echo 'O card Spotify já está operacional — atualize a página do dashboard para confirmar.</p>';
    echo '</body></html>';
    exit;
}

// ─── Etapa 1: erro de auth ────────────────────────────────────────────────────
if (isset($_GET['error'])) {
    echo '<pre style="color:red">Erro retornado pelo Spotify: ' . htmlspecialchars($_GET['error']) . '</pre>';
    exit;
}

// ─── Etapa 0: tela inicial ────────────────────────────────────────────────────
$authUrl = 'https://accounts.spotify.com/authorize?' . http_build_query([
    'client_id'     => $clientId,
    'response_type' => 'code',
    'redirect_uri'  => $redirectUri,
    'scope'         => $scope,
]);

echo '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Spotify OAuth Helper</title>
<style>body{font-family:monospace;padding:2rem;max-width:700px}code{background:#f4f4f4;padding:2px 6px;border-radius:3px}
a.btn{display:inline-block;margin-top:1.5rem;padding:.75rem 1.5rem;background:#1db954;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold}
</style></head><body>';
echo '<h2>Spotify OAuth Helper</h2>';
echo '<p><strong>Client ID:</strong> <code>' . htmlspecialchars($clientId) . '</code></p>';
echo '<p><strong>Redirect URI:</strong> <code>' . htmlspecialchars($redirectUri) . '</code></p>';
echo '<p><strong>Scope:</strong> <code>' . htmlspecialchars($scope) . '</code></p>';
echo '<p>Certifique-se de que a Redirect URI acima está cadastrada no <a href="https://developer.spotify.com/dashboard" target="_blank">Spotify Developer Dashboard</a>.</p>';
echo '<a class="btn" href="' . htmlspecialchars($authUrl) . '">Autorizar no Spotify</a>';
echo '</body></html>';
