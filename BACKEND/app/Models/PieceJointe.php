<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PieceJointe extends Model
{
    protected $table = 'piece_jointe';
    protected $primaryKey = 'id_fichier';
    public $timestamps = false;

    protected $fillable = [
        'nom_fichier', 'chemin_stockage',
        'type_mime', 'taille_octets',
        'id_entrant', 'id_sortant', 'id_uploader'
    ];

    public function entrant()
    {
        return $this->belongsTo(CourrierEntrant::class, 'id_entrant');
    }

    public function sortant()
    {
        return $this->belongsTo(CourrierSortant::class, 'id_sortant');
    }

    public function uploader()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uploader');
    }
}
