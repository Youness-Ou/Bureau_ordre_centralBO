<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'utilisateur';
    protected $primaryKey = 'id_utilisateur';

    protected $fillable = [
        'nom', 'prenom', 'email', 'mot_de_passe',
        'actif', 'id_role', 'id_service',
    ];

    protected $hidden = ['mot_de_passe', 'remember_token'];

    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    protected $casts = [
        'actif' => 'boolean',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role', 'id_role');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'id_service', 'id_service');
    }
}
