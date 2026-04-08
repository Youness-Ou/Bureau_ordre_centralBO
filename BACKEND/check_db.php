<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== État de la base de données ===\n";
echo "Rôles: " . \App\Models\Role::count() . "\n";
echo "Services: " . \App\Models\Service::count() . "\n";
echo "Utilisateurs: " . \App\Models\Utilisateur::count() . "\n";

echo "\n=== Détails des rôles ===\n";
$roles = \App\Models\Role::all();
foreach ($roles as $role) {
    echo "- {$role->libelle} (ID: {$role->id_role})\n";
}

echo "\n=== Détails des services ===\n";
$services = \App\Models\Service::all();
foreach ($services as $service) {
    echo "- {$service->nom} (ID: {$service->id_service})\n";
}
