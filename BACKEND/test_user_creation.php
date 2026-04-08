<?php

// Test script pour vérifier la création d'utilisateur
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "=== Test de création d'utilisateur ===\n";

    // Données de test
    $data = [
        'nom' => 'Test',
        'prenom' => 'User',
        'email' => 'test' . time() . '@example.com', // Email unique
        'mot_de_passe' => \Illuminate\Support\Facades\Hash::make('password'),
        'id_role' => 1, // admin
        'id_service' => 1, // Direction Générale
        'actif' => true
    ];

    echo "Données à créer :\n";
    print_r($data);

    // Création
    $user = \App\Models\Utilisateur::create($data);

    echo "\nUtilisateur créé avec succès !\n";
    echo "ID: " . $user->id_utilisateur . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Nom: " . $user->nom . " " . $user->prenom . "\n";

    // Vérification en base
    $count = \App\Models\Utilisateur::count();
    echo "\nTotal utilisateurs en base: " . $count . "\n";

} catch (\Exception $e) {
    echo "\n❌ Erreur lors de la création: " . $e->getMessage() . "\n";
    echo "Fichier: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
