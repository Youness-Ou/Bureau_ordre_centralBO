<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    /**
     * Liste des utilisateurs avec filtres et pagination
     * GET /api/admin/users
     */
    public function index(Request $request)
    {
        try {
            $query = Utilisateur::with(['role', 'service']);

            // Recherche globale
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'LIKE', "%{$search}%")
                      ->orWhere('prenom', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            }

            // Filtre par rôle
            if ($request->filled('role_id')) {
                $query->where('id_role', $request->role_id);
            }

            // Filtre par service
            if ($request->filled('service_id')) {
                $query->where('id_service', $request->service_id);
            }

            // Filtre actif
            if ($request->has('actif') && $request->actif !== '') {
                $query->where('actif', filter_var($request->actif, FILTER_VALIDATE_BOOLEAN));
            }

            $perPage = $request->get('per_page', 20);
            $users = $query->paginate($perPage);

            return response()->json($users);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur lors du chargement des utilisateurs',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Création d'un utilisateur
     * POST /api/admin/users
     */
    public function store(StoreUserRequest $request)
    {
        try {
            $data = $request->validated();

            $data['mot_de_passe'] = Hash::make($data['password']);
            unset($data['password'], $data['password_confirmation']);

            $data['actif'] = $data['actif'] ?? true;

            $user = Utilisateur::create($data);

            $user->load(['role', 'service']);
            $user->makeHidden(['mot_de_passe']);

            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'data'    => $user
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création de l\'utilisateur',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modification d'un utilisateur
     * PUT /api/admin/users/{user}
     */
    public function update(UpdateUserRequest $request, Utilisateur $user)
    {
        try {
            $data = $request->validated();

            if (!empty($data['password'])) {
                $data['mot_de_passe'] = Hash::make($data['password']);
            }

            unset($data['password'], $data['password_confirmation']);

            $user->update($data);
            $user->load(['role', 'service']);
            $user->makeHidden(['mot_de_passe']);

            return response()->json([
                'message' => 'Utilisateur modifié avec succès',
                'data'    => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la modification',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activation / Désactivation d'un compte
     * PATCH /api/admin/users/{user}/toggle-active
     */
    public function toggleActive(Utilisateur $user)
    {
        $user->update(['actif' => !$user->actif]);

        return response()->json([
            'id_utilisateur' => $user->id_utilisateur,
            'actif'          => $user->actif,
            'message'        => $user->actif ? 'Utilisateur activé avec succès' : 'Utilisateur désactivé avec succès'
        ]);
    }

    /**
     * Réinitialisation du mot de passe par Admin
     * PATCH /api/admin/users/{user}/reset-password
     */
    public function resetPassword(Request $request, Utilisateur $user)
    {
        $request->validate([
            'password'              => 'required|min:8|confirmed',
            'password_confirmation' => 'required',
        ]);

        $user->update([
            'mot_de_passe' => Hash::make($request->password)
        ]);

        $user->tokens()->delete(); // Révoque tous les tokens

        return response()->json([
            'message' => 'Mot de passe réinitialisé avec succès'
        ]);
    }

    /**
     * Suppression d'un utilisateur
     * DELETE /api/admin/users/{user}
     */
    public function destroy(Utilisateur $user)
    {
        $user->tokens()->delete();
        $user->delete();

        return response()->json(null, 204);
    }
}
