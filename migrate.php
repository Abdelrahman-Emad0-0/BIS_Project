<?php
// One-time migration runner for InfinityFree shared hosting
// DELETE THIS FILE immediately after running migrations!

define('LARAVEL_START', microtime(true));

require __DIR__ . '/laravel/vendor/autoload.php';

$app = require_once __DIR__ . '/laravel/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<pre style='background:#111;color:#0f0;padding:20px;font-size:13px;'>\n";
echo "=== Learn X Change — Database Migration Runner ===\n\n";

try {
    $exitCode = Artisan::call('migrate', ['--force' => true]);
    echo Artisan::output();
    echo "\nExit code: $exitCode\n";
    echo $exitCode === 0 ? "\n✅ Migrations completed successfully!\n" : "\n❌ Migrations failed.\n";
} catch (\Throwable $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " line " . $e->getLine() . "\n";
}

echo "\n⚠️  DELETE this file from your server now!\n";
echo "</pre>\n";
