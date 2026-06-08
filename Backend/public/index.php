<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// InfinityFree deploys Laravel into ./laravel/; local dev uses the standard ../
$laravelBase = file_exists(__DIR__.'/laravel/vendor/autoload.php')
    ? __DIR__.'/laravel'
    : realpath(__DIR__.'/..');

$onInfinityFree = ($laravelBase === __DIR__.'/laravel');

// ── InfinityFree-only: manual CORS + Authorization header fix ────────────────
// On InfinityFree, mod_headers is unreliable and Apache strips Authorization.
// Locally, Laravel's own CORS middleware handles everything — don't duplicate.
if ($onInfinityFree) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
    header('Access-Control-Max-Age: 86400');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit();
    }

    if (empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $allHeaders = function_exists('getallheaders') ? getallheaders() : [];
        $auth = $allHeaders['Authorization'] ?? $allHeaders['authorization'] ?? null;
        if ($auth) {
            $_SERVER['HTTP_AUTHORIZATION'] = $auth;
        }
    }
}
// ─────────────────────────────────────────────────────────────────────────────

if (file_exists($maintenance = $laravelBase.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $laravelBase.'/vendor/autoload.php';

/** @var Application $app */
$app = require_once $laravelBase.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
