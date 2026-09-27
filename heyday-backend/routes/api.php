<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

// --- PUBLIC ENDPOINTS ---
Route::get('/messages', [MessageController::class, 'index']);
Route::post('/send', [MessageController::class, 'store']);
Route::get('/message/{id}', [MessageController::class, 'show']);
Route::post('/message/{id}/reply', [MessageController::class, 'storeReply']);

// --- AUTHENTICATION ---
Route::post('/login', [AuthController::class, 'login'])->middleware('admin.key');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// --- ADMIN ENDPOINTS---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/message/{id}', [AdminController::class, 'showDetail']);
    
    Route::post('/message/{id}/archive', [AdminController::class, 'toggleArchive']);
    Route::post('/reply/{id}/archive', [AdminController::class, 'toggleReplyArchive']);
    
    Route::delete('/message/{id}', [MessageController::class, 'destroy']);
    Route::delete('/reply/{id}', [MessageController::class, 'destroyReply']);
    Route::patch('/message/{id}/read', [MessageController::class, 'markAsRead']);
});