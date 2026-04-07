<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    protected $table = 'commentaire';
    protected $primaryKey = 'id_commentaire';
    public $timestamps = false;

    protected $fillable = [
        'contenu', 'id_entrant', 'id_sortant', 'id_auteur'
    ];

    public function auteur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_auteur');
    }

    public function entrant()
    {
        return $this->belongsTo(CourrierEntrant::class, 'id_entrant');
    }

    public function sortant()
    {
        return $this->belongsTo(CourrierSortant::class, 'id_sortant');
    }
}
