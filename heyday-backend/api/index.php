<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);

    echo '<pre>';
    echo 'ERROR: ' . $e->getMessage() . "\n\n";
    echo 'FILE: ' . $e->getFile() . "\n";
    echo 'LINE: ' . $e->getLine() . "\n\n";
    echo $e->getTraceAsString();
    echo '</pre>';
}