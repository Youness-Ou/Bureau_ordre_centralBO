<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Usage in routes: middleware('role:admin')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Vérifier que l'utilisateur est authentifié
        if (!$user) {
            return response()->json([
                'message' => 'Non authentifié'
            ], 401);
        }

        // Vérifier que le compte est actif
        if (!$user->actif) {
            return response()->json([
                'message' => 'Votre compte a été désactivé. Contactez l\'administrateur.'
            ], 403);
        }

        // Charger le rôle si pas déjà chargé
        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        // Vérifier que l'utilisateur possède l'un des rôles requis
        if (!in_array($user->role?->libelle, $roles)) {
            return response()->json([
                'message' => 'Accès refusé — Vous ne disposez pas des droits nécessaires.'
            ], 403);
        }

        return $next($request);
    }
}
