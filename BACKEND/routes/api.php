<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Api\CourrierEntrantController;
use App\Http\Controllers\Api\CourrierServiceController;

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
// Routes Protégées par Sanctum
// ============================================================
Route::middleware('auth:sanctum')->group(function () {

    // --------------------------------------------------------
    // Auth — tous utilisateurs connectés
    // --------------------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::get('/me',                [AuthController::class, 'me']);
        Route::post('/logout',           [AuthController::class, 'logout']);
        Route::patch('/change-password', [AuthController::class, 'changePassword']);
    });

    // --------------------------------------------------------
    // EP-01 — Agent BO + Admin
    // --------------------------------------------------------
    Route::middleware('role:agent_bo,admin')->group(function () {

        // ✅ FIX : Route services accessible à agent_bo ET admin
        // Utilisée par le formulaire de création/édition de courrier entrant
        Route::get('/courriers/services', [CourrierServiceController::class, 'index']);

        // Courriers entrants (US-01, US-02, US-04)
        Route::get   ('/courriers/entrants',                        [CourrierEntrantController::class, 'index']);
        Route::post  ('/courriers/entrants',                        [CourrierEntrantController::class, 'store']);
        Route::get   ('/courriers/entrants/{id}',                   [CourrierEntrantController::class, 'show']);
        Route::put   ('/courriers/entrants/{id}',                   [CourrierEntrantController::class, 'update']);
        Route::patch ('/courriers/entrants/{id}/statut',            [CourrierEntrantController::class, 'updateStatut']);
        Route::post  ('/courriers/entrants/{id}/fichiers',          [CourrierEntrantController::class, 'uploadFichier']);
        Route::post  ('/courriers/entrants/{id}/commentaires',      [CourrierEntrantController::class, 'addCommentaire']);
        Route::get   ('/fichiers/{idFichier}/download',             [CourrierEntrantController::class, 'downloadFichier']);
    });

    // --------------------------------------------------------
    // EP-02 — Admin uniquement
    // --------------------------------------------------------
    Route::prefix('admin')->middleware('role:admin')->group(function () {

        // Gestion des utilisateurs (US-05, US-09)
        Route::apiResource('users', AdminUserController::class)->except(['show']);
        Route::patch('users/{user}/toggle-active',  [AdminUserController::class, 'toggleActive']);
        Route::patch('users/{user}/reset-password', [AdminUserController::class, 'resetPassword']);

        // Gestion des services (US-06)
        Route::apiResource('services', AdminServiceController::class);
    });
});
