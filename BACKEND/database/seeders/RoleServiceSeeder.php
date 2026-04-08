<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Service;

class RoleServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Créer les rôles
        $roles = [
            ['libelle' => 'admin',    'description' => 'Administrateur système — accès complet'],
            ['libelle' => 'agent_bo', 'description' => 'Agent Bureau d\'Ordre — gestion du courrier'],
            ['libelle' => 'employe',  'description' => 'Employé — accès lecture'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['libelle' => $role['libelle']], $role);
        }

        // Créer les services
        $services = [
            ['nom' => 'Direction Générale',       'description' => 'Direction et coordination générale',    'chef_service' => null],
            ['nom' => 'Bureau d\'Ordre',           'description' => 'Gestion du courrier entrant/sortant',   'chef_service' => null],
            ['nom' => 'Comptabilité & Finances',   'description' => 'Gestion financière et comptabilité',   'chef_service' => null],
            ['nom' => 'Ressources Humaines',       'description' => 'Gestion du personnel et recrutement',  'chef_service' => null],
            ['nom' => 'Informatique & DSI',        'description' => 'Systèmes d\'information et réseaux',   'chef_service' => null],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(['nom' => $service['nom']], $service);
        }

        $this->command->info('✅ Rôles et services créés avec succès !');
    }
}
