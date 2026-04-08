<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Utilisateur;

class AuthController extends Controller
{
    /**
     * Login - US-07
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Chercher l'utilisateur par email
        $user = Utilisateur::where('email', $request->email)->first();

        // Vérifier l'existence + le mot de passe (stocké dans mot_de_passe)
        if (!$user || !Hash::check($request->password, $user->mot_de_passe)) {
            return response()->json([
                'message' => 'Identifiants incorrects'
            ], 401);
        }

        // Vérifier si le compte est actif
        if (!$user->actif) {
            return response()->json([
                'message' => 'Votre compte a été désactivé. Contactez l\'administrateur.'
            ], 403);
        }

        // Révoquer les anciens tokens
        $user->tokens()->delete();

        // Créer le token Sanctum
        $token = $user->createToken('auth-token')->plainTextToken;

        // Charger les relations
        $user->load(['role', 'service']);

        return response()->json([
            'token' => $token,
            'user'  => [
                'id_utilisateur' => $user->id_utilisateur,
                'nom'            => $user->nom,
                'prenom'         => $user->prenom,
                'email'          => $user->email,
                'actif'          => $user->actif,
                'role'           => $user->role,
                'service'        => $user->service,
            ]
        ]);
    }

    /**
     * Get current authenticated user - US-08
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'service']);

        return response()->json([
            'id_utilisateur' => $user->id_utilisateur,
            'nom'            => $user->nom,
            'prenom'         => $user->prenom,
            'email'          => $user->email,
            'actif'          => $user->actif,
            'role'           => $user->role,
            'service'        => $user->service,
        ]);
    }

    /**
     * Logout - US-08
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès'], 200);
    }

    /**
     * Change password (for logged in user) - US-08
     * PATCH /api/auth/change-password
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required|string',
            'password'     => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        // Vérifier l'ancien mot de passe
        if (!Hash::check($request->old_password, $user->mot_de_passe)) {
            return response()->json([
                'message' => 'Ancien mot de passe incorrect',
                'errors'  => ['old_password' => ['Ancien mot de passe incorrect']]
            ], 422);
        }

        $user->update([
            'mot_de_passe' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'Mot de passe modifié avec succès'
        ]);
    }
}
