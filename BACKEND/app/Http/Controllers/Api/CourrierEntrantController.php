<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourrierEntrant;
use App\Models\PieceJointe;
use App\Models\Commentaire;
use App\Services\CourrierService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourrierEntrantController extends Controller
{
    /**
     * US-02 : Liste paginée + filtres
     * GET /api/courriers/entrants
     *
     * Isolation des données :
     *   - agent_bo → uniquement SES courriers (id_enregistreur)
     *   - admin    → tous les courriers
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = CourrierEntrant::with(['enregistreur', 'serviceDest'])
            ->orderBy('date_reception', 'desc');

        // ── Filtrage par rôle ─────────────────────────────────────
        if ($user->role->libelle === 'agent_bo') {
            $query->where('id_enregistreur', $user->id_utilisateur);
        }
        // admin → pas de filtre, voit tout

        // ── Filtres de recherche ──────────────────────────────────
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('objet',          'LIKE', "%{$search}%")
                  ->orWhere('expediteur_nom',  'LIKE', "%{$search}%")
                  ->orWhere('numero_ordre',    'LIKE', "%{$search}%");
            });
        }

        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }

        if ($priorite = $request->get('priorite')) {
            $query->where('priorite', $priorite);
        }

        if ($service = $request->get('service_id')) {
            $query->where('id_service_dest', $service);
        }

        if ($dateDebut = $request->get('date_debut')) {
            $query->where('date_reception', '>=', $dateDebut);
        }

        if ($dateFin = $request->get('date_fin')) {
            $query->where('date_reception', '<=', $dateFin);
        }

        $perPage = $request->get('per_page', 15);

        return response()->json($query->paginate($perPage));
    }

    /**
     * US-01 : Enregistrer un nouveau courrier entrant
     * POST /api/courriers/entrants
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'objet'                => 'required|string|max:255',
            'expediteur_nom'       => 'required|string|max:150',
            'organisme'            => 'nullable|string|max:150',
            'date_reception'       => 'required|date|before_or_equal:today',
            'priorite'             => 'required|in:normale,urgente,tres_urgente',
            'id_service_dest'      => 'nullable|exists:service,id_service',
            'commentaire'          => 'nullable|string|max:1000',
        ]);

        $numero = CourrierService::genererNumeroEntrant();

        $courrier = CourrierEntrant::create([
            'numero_ordre'    => $numero,
            'objet'           => $validated['objet'],
            'expediteur_nom'  => $validated['expediteur_nom'],
            'organisme'       => $validated['organisme'] ?? null,
            'date_reception'  => $validated['date_reception'],
            'priorite'        => $validated['priorite'],
            'statut'          => 'enregistre',
            'id_enregistreur' => $user->id_utilisateur,
            'id_service_dest' => $validated['id_service_dest'] ?? null,
        ]);

        // Commentaire initial optionnel
        if (!empty($validated['commentaire'])) {
            Commentaire::create([
                'contenu'    => $validated['commentaire'],
                'id_entrant' => $courrier->id_entrant,
                'id_auteur'  => $user->id_utilisateur,
            ]);
        }

        return response()->json([
            'message' => 'Courrier enregistré avec succès',
            'courrier' => $courrier->load(['enregistreur', 'serviceDest']),
        ], 201);
    }

    /**
     * US-04 : Détail complet d'un courrier
     * GET /api/courriers/entrants/{id}
     */
    public function show($id)
    {
        $user     = Auth::user();
        $courrier = CourrierEntrant::with([
            'enregistreur',
            'serviceDest',
            'commentaires.auteur',
            'piecesJointes.uploader',
        ])->findOrFail($id);

        // Agent BO ne peut voir que ses propres courriers
        if ($user->role->libelle === 'agent_bo' && $courrier->id_enregistreur !== $user->id_utilisateur) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return response()->json($courrier);
    }

    /**
     * US-04.2 : Modifier un courrier (statut = enregistre uniquement)
     * PUT /api/courriers/entrants/{id}
     */
    public function update(Request $request, $id)
    {
        $user     = Auth::user();
        $courrier = CourrierEntrant::findOrFail($id);

        // Agent BO ne peut modifier que ses courriers
        if ($user->role->libelle === 'agent_bo' && $courrier->id_enregistreur !== $user->id_utilisateur) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        if ($courrier->statut !== 'enregistre') {
            return response()->json([
                'message' => 'Seuls les courriers en statut "enregistre" peuvent être modifiés',
            ], 403);
        }

        $validated = $request->validate([
            'objet'           => 'required|string|max:255',
            'expediteur_nom'  => 'required|string|max:150',
            'organisme'       => 'nullable|string|max:150',
            'date_reception'  => 'required|date|before_or_equal:today',
            'priorite'        => 'required|in:normale,urgente,tres_urgente',
            'id_service_dest' => 'nullable|exists:service,id_service',
        ]);

        $courrier->update($validated);

        return response()->json([
            'message'  => 'Courrier modifié avec succès',
            'courrier' => $courrier->fresh()->load(['enregistreur', 'serviceDest']),
        ]);
    }

    /**
     * Mettre à jour le statut d'un courrier
     * PATCH /api/courriers/entrants/{id}/statut
     */
    public function updateStatut(Request $request, $id)
    {
        $user     = Auth::user();
        $courrier = CourrierEntrant::findOrFail($id);

        if ($user->role->libelle === 'agent_bo' && $courrier->id_enregistreur !== $user->id_utilisateur) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $request->validate([
            'statut' => 'required|in:enregistre,affecte,en_cours,traite,archive',
        ]);

        $courrier->update(['statut' => $request->statut]);

        return response()->json([
            'message'  => 'Statut mis à jour',
            'courrier' => $courrier->fresh(),
        ]);
    }

    /**
     * T-01.2 : Upload pièce jointe
     * POST /api/courriers/entrants/{id}/fichiers
     */
    public function uploadFichier(Request $request, $id)
    {
        $courrier = CourrierEntrant::findOrFail($id);
        $user     = Auth::user();

        // Agent BO : accès uniquement à ses courriers
        if ($user->role->libelle === 'agent_bo' && $courrier->id_enregistreur !== $user->id_utilisateur) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $validated = $request->validate([
            'fichier' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx,xlsx',
        ]);

        $file = $validated['fichier'];
        $path = $file->store('pieces_entrants/' . $id, 'public');

        $piece = PieceJointe::create([
            'nom_fichier'     => $file->getClientOriginalName(),
            'chemin_stockage' => $path,
            'type_mime'       => $file->getMimeType(),
            'taille_octets'   => $file->getSize(),
            'id_entrant'      => $id,
            'id_uploader'     => $user->id_utilisateur,
        ]);

        return response()->json([
            'message' => 'Fichier uploadé avec succès',
            'piece'   => $piece,
        ], 201);
    }

    /**
     * T-01.3 : Ajouter un commentaire
     * POST /api/courriers/entrants/{id}/commentaires
     */
    public function addCommentaire(Request $request, $id)
    {
        $courrier = CourrierEntrant::findOrFail($id);
        $user     = Auth::user();

        if ($user->role->libelle === 'agent_bo' && $courrier->id_enregistreur !== $user->id_utilisateur) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $validated = $request->validate([
            'contenu' => 'required|string|min:3',
        ]);

        $commentaire = Commentaire::create([
            'contenu'    => $validated['contenu'],
            'id_entrant' => $id,
            'id_auteur'  => $user->id_utilisateur,
        ]);

        return response()->json([
            'message'     => 'Commentaire ajouté',
            'commentaire' => $commentaire->load('auteur'),
        ], 201);
    }

    /**
     * T-04.1.3 : Télécharger un fichier
     * GET /api/fichiers/{idFichier}/download
     */
    public function downloadFichier($idFichier)
    {
        $piece = PieceJointe::findOrFail($idFichier);
        $path  = storage_path('app/public/' . $piece->chemin_stockage);

        if (!file_exists($path)) {
            abort(404, 'Fichier non trouvé');
        }

        return response()->download($path, $piece->nom_fichier);
    }
}
