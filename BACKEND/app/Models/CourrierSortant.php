<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourrierSortant extends Model
{
     protected $table = 'courrier_sortant';
    protected $primaryKey = 'id_sortant';
    public $timestamps = false;

    protected $fillable = [
        'numero_ordre', 'objet',
        'destinataire_nom', 'destinataire_organisme',
        'statut', 'priorite',
        'id_redacteur', 'id_service_emetteur',
        'id_entrant_ref'
    ];

    public function redacteur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_redacteur');
    }

    public function serviceEmetteur()
    {
        return $this->belongsTo(Service::class, 'id_service_emetteur');
    }

    public function entrant()
    {
        return $this->belongsTo(CourrierEntrant::class, 'id_entrant_ref');
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'id_sortant');
    }

    public function piecesJointes()
    {
        return $this->hasMany(PieceJointe::class, 'id_sortant');
    }
}
