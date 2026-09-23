<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Artisan;

Route::get('/', [MessageController::class, 'index'])->name('home');
Route::post('/send', [MessageController::class, 'store'])->name('message.store');
Route::get('/message/{id}', [MessageController::class, 'show'])->name('message.show');
Route::post('/message/{id}/reply', [MessageController::class, 'storeReply'])->name('message.reply');
Route::delete('/message/{id}', [MessageController::class, 'destroy'])->name('message.destroy');
Route::delete('/reply/{id}', [MessageController::class, 'destroyReply'])->name('reply.destroy');
Route::patch('/message/{id}/read', [MessageController::class, 'markAsRead'])->name('message.read');

Route::middleware('guest')->group(function () {
    Route::get('/login-baday', [AuthController::class, 'showLoginForm'])->middleware('admin.key')->name('login');
    Route::post('/login-baday', [AuthController::class, 'login']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/admin/message/{id}', [AdminController::class, 'showDetail'])->name('admin.message.show');
});