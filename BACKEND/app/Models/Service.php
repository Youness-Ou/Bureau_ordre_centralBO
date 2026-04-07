<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'service';
    protected $primaryKey = 'id_service';
    public $timestamps = false;

    protected $fillable = ['nom', 'description', 'chef_service'];

    public function utilisateurs()
    {
        return $this->hasMany(Utilisateur::class, 'id_service');
    }

    public function courriersEntrants()
    {
        return $this->hasMany(CourrierEntrant::class, 'id_service_dest');
    }

    public function courriersSortants()
    {
        return $this->hasMany(CourrierSortant::class, 'id_service_emetteur');
    }
}
