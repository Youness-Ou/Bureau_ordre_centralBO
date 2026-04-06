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
        Schema::create('courrier_sortant', function (Blueprint $table) {
            $table->id('id_sortant');
            $table->string('numero_ordre', 20)->unique();
            $table->string('objet');
            $table->string('destinataire_nom');
            $table->string('destinataire_organisme')->nullable();
            $table->date('date_envoi')->nullable();
            $table->dateTime('date_enregistrement')->useCurrent();

            $table->enum('statut', ['redige','envoye','archive'])->default('redige');
            $table->enum('priorite', ['normale','urgente','tres_urgente'])->default('normale');

            $table->unsignedBigInteger('id_redacteur');
            $table->unsignedBigInteger('id_archiveur')->nullable();
            $table->unsignedBigInteger('id_service_emetteur');
            $table->unsignedBigInteger('id_entrant_ref')->nullable();

            $table->dateTime('date_archivage')->nullable();

            $table->foreign('id_redacteur')->references('id_utilisateur')->on('utilisateur');
            $table->foreign('id_archiveur')->references('id_utilisateur')->on('utilisateur');
            $table->foreign('id_service_emetteur')->references('id_service')->on('service');
            $table->foreign('id_entrant_ref')->references('id_entrant')->on('courrier_entrant')->nullOnDelete();

            $table->index('statut');
            $table->index('id_entrant_ref');
            $table->index('date_envoi');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courrier_sortants');
    }
};
