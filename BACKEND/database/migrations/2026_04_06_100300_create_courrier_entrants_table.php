<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courrier_entrant', function (Blueprint $table) {
            $table->id('id_entrant');
            $table->string('numero_ordre', 20)->unique();
            $table->string('objet');
            $table->string('expediteur_nom');
            $table->string('expediteur_organisme')->nullable();
            $table->date('date_reception');
            $table->dateTime('date_enregistrement')->useCurrent();
            $table->enum('statut', ['enregistre','affecte','en_cours','traite','archive'])->default('enregistre');
            $table->enum('priorite', ['normale','urgente','tres_urgente'])->default('normale');
            $table->unsignedBigInteger('id_enregistreur');
            $table->unsignedBigInteger('id_affecte')->nullable();
            $table->unsignedBigInteger('id_archiveur')->nullable();
            $table->unsignedBigInteger('id_service_dest')->nullable();
            $table->dateTime('date_affectation')->nullable();
            $table->dateTime('date_archivage')->nullable();
            $table->foreign('id_enregistreur')->references('id_utilisateur')->on('utilisateur');
            $table->foreign('id_affecte')->references('id_utilisateur')->on('utilisateur');
            $table->foreign('id_archiveur')->references('id_utilisateur')->on('utilisateur');
            $table->foreign('id_service_dest')->references('id_service')->on('service');
            $table->index('statut');
            $table->index('id_affecte');
            $table->index('date_reception');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courrier_entrants');
    }
};
