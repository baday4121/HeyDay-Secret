<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'HeyDay Secret API Server is running.',
        'version' => '1.0'
    ], 200);
});

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'error' => 'Not Found',
        'message' => 'The requested endpoint does not exist. Please use /api/... endpoints.'
    ], 404);
});