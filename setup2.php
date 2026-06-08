<?php
// One-time fix script — DELETE AFTER USE

echo "<pre>\n";

// Step 1: Delete broken laravel/ folder
function deleteDir($dir) {
    if (!is_dir($dir)) return;
    $files = array_diff(scandir($dir), ['.', '..']);
    foreach ($files as $file) {
        $path = "$dir/$file";
        is_dir($path) ? deleteDir($path) : unlink($path);
    }
    rmdir($dir);
}

if (is_dir('./laravel')) {
    deleteDir('./laravel');
    echo "✓ Old laravel/ folder deleted\n";
}

// Step 2: Extract fixed zip
$zip = new ZipArchive();
if (file_exists('laravel_fixed.zip')) {
    if ($zip->open('laravel_fixed.zip') === TRUE) {
        $zip->extractTo('./laravel/');
        $zip->close();
        echo "✓ laravel_fixed.zip extracted into laravel/\n";
    } else {
        echo "✗ Failed to open laravel_fixed.zip\n";
    }
} else {
    echo "✗ laravel_fixed.zip not found\n";
}

// Step 3: Rename .env.production to .env
$envProd = './laravel/.env.production';
$envDest = './laravel/.env';
if (file_exists($envProd)) {
    if (file_exists($envDest)) unlink($envDest);
    rename($envProd, $envDest);
    echo "✓ .env set\n";
} else {
    echo "- .env.production not found (may already be .env)\n";
}

// Step 4: Set storage permissions
@chmod('./laravel/storage', 0755);
@chmod('./laravel/bootstrap/cache', 0755);
echo "✓ Permissions set\n";

// Step 5: Clean up
if (file_exists('laravel_fixed.zip')) { unlink('laravel_fixed.zip'); echo "✓ Zip deleted\n"; }

echo "\nDone! DELETE this setup2.php file now.\n";
echo "</pre>\n";
