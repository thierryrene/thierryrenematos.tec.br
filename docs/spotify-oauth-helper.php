<?php
/**
 * Spotify OAuth Helper
 * Uso: php docs/spotify-oauth-helper.php
 *
 * Requer PHP CLI e que a porta 8888 esteja livre.
 * Execute na raiz do projeto para que o .env seja lido automaticamente.
 */

declare(strict_types=1);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadEnv(string $path): void
{
    if (!is_file($path)) return;
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        [$k, $v] = array_pad(explode('=', $line, 2), 2, '');
        $k = trim($k);
        $v = trim($v);
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

// ─── Bootstrap ───────────────────────────────────────────────────────────────

loadEnv(__DIR__ . '/../.env');

$clientId     = env('SPOTIFY_CLIENT_ID');
$clientSecret = env('SPOTIFY_CLIENT_SECRET');
$redirectUri  = 'http://localhost:8888/callback';
$scope        = 'user-read-currently-playing user-read-recently-played';

if ($clientId === '' || $clientSecret === '') {
    fwrite(STDERR, "ERRO: SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET nao encontrados no .env\n");
    exit(1);
}

// ─── Se chamado como servidor interno (callback) ──────────────────────────────

if (PHP_SAPI === 'cli-server') {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

    if ($uri === '/callback') {
        $error = $_GET['error'] ?? '';
        $code  = $_GET['code']  ?? '';

        if ($error !== '') {
            http_response_code(400);
            echo "<pre>Erro do Spotify: $error</pre>";
            exit;
        }

        if ($code === '') {
            http_response_code(400);
            echo "<pre>Parametro 'code' ausente.</pre>";
            exit;
        }

        // Troca code por tokens
        $postBody = http_build_query([
            'grant_type'   => 'authorization_code',
            'code'         => $code,
            'redirect_uri' => $redirectUri,
        ]);
        $authHeader = 'Authorization: Basic ' . base64_encode("$clientId:$clientSecret");

        if (function_exists('curl_init')) {
            $ch = curl_init('https://accounts.spotify.com/api/token');
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $postBody,
                CURLOPT_HTTPHEADER => [
                    $authHeader,
                    'Content-Type: application/x-www-form-urlencoded',
                    'Accept: application/json',
                ],
                CURLOPT_TIMEOUT => 15,
            ]);
            $body = curl_exec($ch);
            curl_close($ch);
        } else {
            $ctx  = stream_context_create(['http' => [
                'method'  => 'POST',
                'header'  => "$authHeader\r\nContent-Type: application/x-www-form-urlencoded\r\nAccept: application/json\r\n",
                'content' => $postBody,
                'timeout' => 15,
            ]]);
            $body = @file_get_contents('https://accounts.spotify.com/api/token', false, $ctx);
        }

        $data = json_decode((string) $body, true);

        if (!is_array($data) || empty($data['refresh_token'])) {
            http_response_code(500);
            echo '<pre>Falha ao obter refresh_token. Resposta Spotify:' . "\n";
            echo htmlspecialchars(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo '</pre>';
            exit;
        }

        $refreshToken = $data['refresh_token'];
        $accessToken  = $data['access_token'] ?? '';
        $expiresIn    = $data['expires_in']   ?? 3600;

        // Escreve cache de auth
        $cacheFile = __DIR__ . '/../data/spotify-auth-cache.json';
        file_put_contents($cacheFile, json_encode([
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
            'expires_at'    => time() + (int) $expiresIn,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL, LOCK_EX);

        header('Content-Type: text/html; charset=utf-8');
        echo '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Spotify OAuth</title></head><body style="font-family:monospace;padding:2rem">';
        echo '<h2 style="color:green">&#10003; Autenticacao concluida!</h2>';
        echo '<p><strong>SPOTIFY_REFRESH_TOKEN</strong> (adicione ao .env):</p>';
        echo '<pre style="background:#f4f4f4;padding:1rem;border-radius:4px;word-break:break-all">' . htmlspecialchars($refreshToken) . '</pre>';
        echo '<p>O cache de auth tambem foi salvo em <code>data/spotify-auth-cache.json</code>.</p>';
        echo '<p>Voce ja pode fechar esta aba e parar o servidor (<kbd>Ctrl+C</kbd>).</p>';
        echo '</body></html>';
        exit;
    }

    // Root – redireciona para auth
    $authUrl = 'https://accounts.spotify.com/authorize?' . http_build_query([
        'client_id'     => $clientId,
        'response_type' => 'code',
        'redirect_uri'  => $redirectUri,
        'scope'         => $scope,
    ]);
    header('Location: ' . $authUrl);
    exit;
}

// ─── Modo CLI: instrucoes + inicia servidor ───────────────────────────────────

echo "\n";
echo "╔══════════════════════════════════════════════════════╗\n";
echo "║         Spotify OAuth Helper — thierry.dashboard     ║\n";
echo "╚══════════════════════════════════════════════════════╝\n\n";

// Verifica se curl esta disponivel
if (!function_exists('curl_init')) {
    fwrite(STDERR, "AVISO: extensao curl nao encontrada no PHP CLI — usando file_get_contents como fallback.\n\n");
}

echo "Client ID    : $clientId\n";
echo "Redirect URI : $redirectUri\n";
echo "Scope        : $scope\n\n";

echo "1. Iniciando servidor local em http://localhost:8888 ...\n";
echo "2. Abra no navegador: http://localhost:8888\n";
echo "   (o servidor vai redirecionar automaticamente para o Spotify)\n";
echo "3. Autorize o acesso e aguarde o refresh_token aparecer na pagina.\n";
echo "4. Copie o SPOTIFY_REFRESH_TOKEN exibido e adicione ao .env\n\n";
echo "Pressione Ctrl+C para encerrar apos concluir.\n\n";

$scriptPath = __FILE__;
$cmd = "php -S localhost:8888 \"$scriptPath\"";
passthru($cmd);
