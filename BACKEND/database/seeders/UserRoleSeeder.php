<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Utilisateur;
use App\Models\Role;
use App\Models\Service;
use Illuminate\Support\Facades\Hash;

class UserRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roleAdmin   = Role::where('libelle', 'admin')->firstOrFail();
        $roleAgent   = Role::where('libelle', 'agent_bo')->firstOrFail();
        $roleEmploye = Role::where('libelle', 'employe')->firstOrFail();

        $dirGen   = Service::where('nom', 'Direction Générale')->first() ?? Service::first();
        $svcBo    = Service::where('nom', 'Bureau d\'Ordre')->first()    ?? Service::first();
        $svcCompt = Service::where('nom', 'Comptabilité & Finances')->first() ?? Service::first();

        // Admin
        Utilisateur::updateOrCreate(
            ['email' => 'admin@boc.ma'],
            [
                'nom'          => 'Benali',
                'prenom'       => 'Karim',
                'mot_de_passe' => Hash::make('password'),
                'id_role'      => $roleAdmin->id_role,
                'id_service'   => $dirGen->id_service,
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
                'id_service'   => $svcBo->id_service,
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
                'id_service'   => $svcCompt->id_service,
                'actif'        => true,
            ]
        );

        $this->command->info('✅ Utilisateurs par défaut créés avec succès !');
        $this->command->info('   admin@boc.ma    / password');
        $this->command->info('   agent@boc.ma    / password');
        $this->command->info('   employe@boc.ma  / password');
    }
}
