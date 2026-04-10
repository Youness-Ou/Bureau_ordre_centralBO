<?php

/*namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Role;     
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;

class ServiceUserSeeder extends Seeder
{
    public function run(): void
    {
        // ====================== CRÉATION DES SERVICES ======================
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

        $this->command->info('Services créés ou mis à jour avec succès !');

        // ====================== CRÉATION DES UTILISATEURS ======================
        $roleAdmin   = Role::where('libelle', 'admin')->firstOrFail();
        $roleAgent   = Role::where('libelle', 'agent_bo')->firstOrFail();
        $roleEmploye = Role::where('libelle', 'employe')->firstOrFail();

        $dirGen = Service::where('nom', 'Direction Générale')->first();
        $svcBo  = Service::where('nom', 'Bureau d\'Ordre')->first();
        $svcCompt = Service::where('nom', 'Comptabilité & Finances')->first();

        // Admin
        Utilisateur::updateOrCreate(
            ['email' => 'admin@boc.ma'],
            [
                'nom'          => 'Benali',
                'prenom'       => 'Karim',
                'mot_de_passe' => Hash::make('password'),
                'id_role'      => $roleAdmin->id_role,
                'id_service'   => $dirGen?->id_service,
                'actif'        => true,
            ]
        );

        // Agent Bureau d'Ordre
        Utilisateur::updateOrCreate(
            ['email' => 'agent@boc.ma'],
            [
                'nom'          => 'Tahiri',
                'prenom'       => 'Samira',
                'mot_de_passe' => Hash::make('password'),
                'id_role'      => $roleAgent->id_role,
                'id_service'   => $svcBo?->id_service,
                'actif'        => true,
            ]
        );

        // Employé
        Utilisateur::updateOrCreate(
            ['email' => 'employe@boc.ma'],
            [
                'nom'          => 'Alami',
                'prenom'       => 'Youssef',
                'mot_de_passe' => Hash::make('password'),
                'id_role'      => $roleEmploye->id_role,
                'id_service'   => $svcCompt?->id_service,
                'actif'        => true,
            ]
        );

        $this->command->info('✅ Utilisateurs par défaut créés avec succès !');
        $this->command->info('   admin@boc.ma    / password');
        $this->command->info('   agent@boc.ma    / password');
        $this->command->info('   employe@boc.ma  / password');
    }
}*/