<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Model
{
    use HasApiTokens;
    protected $table = 'utilisateur';
    protected $primaryKey = 'id_utilisateur';
    public $timestamps = false;

    protected $fillable = [
        'nom', 'prenom', 'email', 'mot_de_passe',
        'actif', 'id_role', 'id_service'
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'id_service');
    }

    public function courriersEnregistres()
    {
        return $this->hasMany(CourrierEntrant::class, 'id_enregistreur');
    }

    public function courriersAffectes()
    {
        return $this->hasMany(CourrierEntrant::class, 'id_affecte');
    }

    public function courriersSortants()
    {
        return $this->hasMany(CourrierSortant::class, 'id_redacteur');
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'id_auteur');
    }
}
