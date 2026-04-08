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
        return $this->hasMany(Utilisateur::class, 'id_service', 'id_service');
    }
}
