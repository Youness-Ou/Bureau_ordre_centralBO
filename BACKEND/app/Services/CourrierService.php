<?php

namespace App\Services;

use App\Models\CourrierEntrant ;
use Illuminate\Support\Facades\DB;

class CourrierService
{
    public static function genererNumeroEntrant(): string
    {
        $annee = date('Y');
        $prefix = "ENT-{$annee}-";

        $dernier = CourrierEntrant::where('numero_ordre', 'LIKE', $prefix . '%')
            ->orderBy('numero_ordre', 'desc')
            ->first();

        if (!$dernier) {
            $numeroSuivant = 1;
        } else {
            $dernierNombre = (int) substr($dernier->numero_ordre, -4);
            $numeroSuivant = $dernierNombre + 1;
        }

        $nouveauNumero = $prefix . str_pad($numeroSuivant, 4, '0', STR_PAD_LEFT);

        while (CourrierEntrant::where('numero_ordre', $nouveauNumero)->exists()) {
            $numeroSuivant++;
            $nouveauNumero = $prefix . str_pad($numeroSuivant, 4, '0', STR_PAD_LEFT);
        }

        return $nouveauNumero;
    }
}
