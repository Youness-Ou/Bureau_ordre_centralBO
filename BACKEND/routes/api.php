<?php

use App\Http\Controllers\Api\CourrierEntrantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Utilisateur;

// ====================== LOGIN TEST ======================
Route::post('/login-test', function (Request $request) {
    $user = Utilisateur::where('email', $request->email)->first();

    if (!$user || !password_verify($request->password, $user->mot_de_passe)) {
        return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
    }

    $token = $user->createToken('postman-test')->plainTextToken;

    return response()->json([
        'message' => 'Connexion réussie',
        'token'   => $token
    ]);
});

// ====================== API COURRIERS ======================
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/courriers/entrants', [CourrierEntrantController::class, 'index']);
    Route::post('/courriers/entrants', [CourrierEntrantController::class, 'store']);
    Route::get('/courriers/entrants/{id}', [CourrierEntrantController::class, 'show']);
    Route::put('/courriers/entrants/{id}', [CourrierEntrantController::class, 'update']);
    Route::post('/courriers/entrants/{id}/fichiers', [CourrierEntrantController::class, 'uploadFichier']);
    Route::post('/courriers/entrants/{id}/commentaires', [CourrierEntrantController::class, 'addCommentaire']);
    Route::get('/fichiers/{idFichier}/download', [CourrierEntrantController::class, 'downloadFichier']);

});