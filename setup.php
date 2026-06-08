<?php
// One-time setup script — DELETE THIS FILE after running it once

echo "<pre>\n";

$zip = new ZipArchive();

// Extract laravel.zip into laravel/ subfolder
if (file_exists('laravel.zip')) {
    if ($zip->open('laravel.zip') === TRUE) {
        $zip->extractTo('./laravel/');
        $zip->close();
        echo "✓ laravel.zip extracted into laravel/\n";
    } else {
        echo "✗ Failed to open laravel.zip\n";
    }
} else {
    echo "✗ laravel.zip not found\n";
}

// Extract htdocs.zip into current directory (public files)
if (file_exists('htdocs.zip')) {
    if ($zip->open('htdocs.zip') === TRUE) {
        $zip->extractTo('./');
        $zip->close();
        echo "✓ htdocs.zip extracted\n";
    } else {
        echo "✗ Failed to open htdocs.zip\n";
    }
} else {
    echo "✗ htdocs.zip not found\n";
}

// Rename .env.production to .env inside laravel/
$envProd = './laravel/.env.production';
$envDest = './laravel/.env';

if (file_exists($envProd)) {
    if (file_exists($envDest)) {
        unlink($envDest); // delete old local .env
    }
    rename($envProd, $envDest);
    echo "✓ .env.production renamed to .env\n";
} else {
    echo "✗ .env.production not found in laravel/\n";
}

// Clean up zip files
if (file_exists('laravel.zip')) { unlink('laravel.zip'); echo "✓ laravel.zip deleted\n"; }
if (file_exists('htdocs.zip'))  { unlink('htdocs.zip');  echo "✓ htdocs.zip deleted\n"; }

echo "\nDone! DELETE this setup.php file now.\n";
echo "</pre>\n";
