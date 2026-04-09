<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourrierEntrant extends Model
{
    protected $table = 'courrier_entrant';
    protected $primaryKey = 'id_entrant';
    public $timestamps = false;

    protected $fillable = [
        'numero_ordre', 'objet', 'expediteur_nom',
        'expediteur_organisme', 'date_reception',
        'statut', 'priorite',
        'id_enregistreur', 'id_affecte',
        'id_archiveur', 'id_service_dest'
    ];

    public function enregistreur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_enregistreur');
    }

    public function affecte()
    {
        return $this->belongsTo(Utilisateur::class, 'id_affecte');
    }

    public function archiveur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_archiveur');
    }

    public function serviceDest()
    {
        return $this->belongsTo(Service::class, 'id_service_dest');
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'id_entrant');
    }

    public function piecesJointes()
    {
        return $this->hasMany(PieceJointe::class, 'id_entrant');
    }

    /* public function sortantReponse()
    {
        return $this->hasOne(CourrierSortant::class, 'id_entrant_ref');
    } */
}
