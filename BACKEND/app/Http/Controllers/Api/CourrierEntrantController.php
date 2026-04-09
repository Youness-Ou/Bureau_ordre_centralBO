<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;   // ← Cette ligne était manquante
use App\Models\CourrierEntrant;
use App\Models\PieceJointe;
use App\Models\Commentaire;
use App\Services\CourrierService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;



class CourrierEntrantController extends Controller
{
    
    /**
     * US-02 : Liste paginée + recherche multicritère
     */
    public function index(Request $request)
    {
        $query = CourrierEntrant::with(['enregistreur', 'serviceDest'])
            ->orderBy('date_reception', 'desc');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('objet', 'LIKE', "%{$search}%")
                  ->orWhere('expediteur_nom', 'LIKE', "%{$search}%")
                  ->orWhere('numero_ordre', 'LIKE', "%{$search}%");
            });
        }

        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }

        if ($priorite = $request->get('priorite')) {
            $query->where('priorite', $priorite);
        }

        if ($service = $request->get('id_service_dest')) {
            $query->where('id_service_dest', $service);
        }

        if ($dateDebut = $request->get('date_debut')) {
            $query->where('date_reception', '>=', $dateDebut);
        }
        if ($dateFin = $request->get('date_fin')) {
            $query->where('date_reception', '<=', $dateFin);
        }

        $courriers = $query->paginate(15);

        return response()->json($courriers);
    }

    /**
     * US-01 : Créer un nouveau courrier entrant
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'objet'                => 'required|string|max:255',
            'expediteur_nom'       => 'required|string|max:150',
            'expediteur_organisme' => 'nullable|string|max:150',
            'date_reception'       => 'required|date|before_or_equal:today',
            'priorite'             => 'required|in:normale,urgente,tres_urgente',
            'id_service_dest'      => 'nullable|exists:service,id_service',
        ]);

        $numero = CourrierService::genererNumeroEntrant();

        $courrier = CourrierEntrant::create([
            'numero_ordre'         => $numero,
            'objet'                => $validated['objet'],
            'expediteur_nom'       => $validated['expediteur_nom'],
            'expediteur_organisme' => $validated['expediteur_organisme'],
            'date_reception'       => $validated['date_reception'],
            'priorite'             => $validated['priorite'],
            'statut'               => 'enregistre',
            'id_enregistreur'      => $user->id_utilisateur,
            'id_service_dest'      => $validated['id_service_dest'] ?? null,
        ]);

        return response()->json([
            'message' => 'Courrier enregistré avec succès',
            'courrier' => $courrier->load(['enregistreur', 'serviceDest'])
        ], 201);
    }

    /**
     * US-04 : Détail complet d’un courrier
     */
    public function show($id)
    {
        $courrier = CourrierEntrant::with([
            'enregistreur',
            'affecte',
            'archiveur',
            'serviceDest',
            'commentaires.auteur',
            'piecesJointes.uploader'
        ])->findOrFail($id);

        return response()->json($courrier);
    }

    /**
     * US-04.2 : Modification avant affectation
     */
        /**
 * US-04.2 : Modification avant affectation
 */
    public function update(Request $request, $id)
{
    $courrier = CourrierEntrant::findOrFail($id);

    if ($courrier->statut !== 'enregistre') {
        return response()->json(['message' => 'Seuls les courriers en statut "enregistre" peuvent être modifiés'], 403);
    }

    $validated = $request->validate([
        'objet'                => 'required|string|max:255',
        'expediteur_nom'       => 'required|string|max:150',
        'expediteur_organisme' => 'nullable|string|max:150',
        'date_reception'       => 'required|date|before_or_equal:today',
        'priorite'             => 'required|in:normale,urgente,tres_urgente',
        'id_service_dest'      => 'nullable|exists:service,id_service',
    ]);

    $courrier->update($validated);

    // Force JSON
    return response()->json([
        'status'   => 'success',
        'message'  => 'Courrier modifié avec succès',
        'courrier' => $courrier->fresh()->load(['enregistreur', 'serviceDest'])
    ]);
}

    /**
     * Upload pièce jointe (T-01.2)
     */
    public function uploadFichier(Request $request, $id)
    {
        $courrier = CourrierEntrant::findOrFail($id);

        $validated = $request->validate([
            'fichier' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx,xlsx',
        ]);

        $file = $validated['fichier'];
        $user = Auth::user();

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
            'piece'   => $piece
        ], 201);
    }

    /**
     * Ajout commentaire (T-01.3)
     */
    public function addCommentaire(Request $request, $id)
    {
        $courrier = CourrierEntrant::findOrFail($id);

        $validated = $request->validate([
            'contenu' => 'required|string|min:3',
        ]);

        $user = Auth::user();

        $commentaire = Commentaire::create([
            'contenu'    => $validated['contenu'],
            'id_entrant' => $id,
            'id_auteur'  => $user->id_utilisateur,
        ]);

        $commentaire->load('auteur');

        return response()->json([
            'message' => 'Commentaire ajouté',
            'commentaire' => $commentaire
        ], 201);
    }

    /**
     * Téléchargement fichier (T-04.1.3)
     */
    public function downloadFichier($idFichier)
    {
        $piece = PieceJointe::findOrFail($idFichier);
        $path = storage_path('app/public/' . $piece->chemin_stockage);

        if (!file_exists($path)) {
            abort(404, 'Fichier non trouvé');
        }

        return response()->download($path, $piece->nom_fichier);
    }
}