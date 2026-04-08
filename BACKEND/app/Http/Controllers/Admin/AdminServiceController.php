<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminServiceController extends Controller
{
    /**
     * Liste des services
     * GET /api/admin/services
     */
    public function index()
    {
        try {
            $services = Service::withCount('utilisateurs')
                ->orderBy('nom')
                ->get();

            return response()->json($services);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du chargement des services'
            ], 500);
        }
    }

    /**
     * Création d'un service
     * POST /api/admin/services
     */
    public function store(ServiceRequest $request)
    {
        try {
            $service = Service::create($request->validated());

            return response()->json([
                'message' => 'Service créé avec succès',
                'data'    => $service
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du service',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modification d'un service
     * PUT /api/admin/services/{service}
     */
    public function update(ServiceRequest $request, Service $service)
    {
        try {
            $service->update($request->validated());

            return response()->json([
                'message' => 'Service modifié avec succès',
                'data'    => $service
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la modification du service'
            ], 500);
        }
    }

    /**
     * Suppression d'un service
     * DELETE /api/admin/services/{service}
     */
    public function destroy(Service $service)
    {
        // Protection : ne pas supprimer si des utilisateurs y sont attachés
        if ($service->utilisateurs()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer ce service car il contient des utilisateurs.'
            ], 422);
        }

        $service->delete();

        return response()->json(null, 204);
    }
}
