<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminServiceController;

/*
|--------------------------------------------------------------------------
| API Routes — BOC (Bureau d'Ordre Centrale)
|--------------------------------------------------------------------------
*/

// ============================================================
// Routes Publiques
// ============================================================
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// ============================================================
// Routes Protégées par Sanctum (auth:sanctum)
// ============================================================
Route::middleware('auth:sanctum')->group(function () {

    // --------------------------------------------------------
    // Routes communes — tous utilisateurs connectés
    // --------------------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::get('/me',               [AuthController::class, 'me']);
        Route::post('/logout',          [AuthController::class, 'logout']);
        Route::patch('/change-password', [AuthController::class, 'changePassword']);
    });

    // --------------------------------------------------------
    // Routes Admin uniquement — middleware role:admin
    // --------------------------------------------------------
    Route::prefix('admin')->middleware('role:admin')->group(function () {

        // Gestion des utilisateurs (US-05 / US-09)
        Route::apiResource('users', AdminUserController::class)->except(['show']);
        Route::patch('users/{user}/toggle-active',  [AdminUserController::class, 'toggleActive']);
        Route::patch('users/{user}/reset-password', [AdminUserController::class, 'resetPassword']);

        // Gestion des services (US-06)
        Route::apiResource('services', AdminServiceController::class);
    });
});
