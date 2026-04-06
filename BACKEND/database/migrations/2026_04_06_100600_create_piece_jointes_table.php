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
        Schema::create('piece_jointe', function (Blueprint $table) {
            $table->id('id_fichier');
            $table->string('nom_fichier');
            $table->string('chemin_stockage');
            $table->string('type_mime')->nullable();
            $table->bigInteger('taille_octets')->nullable();
            $table->dateTime('date_upload')->useCurrent();
            $table->unsignedBigInteger('id_entrant')->nullable();
            $table->unsignedBigInteger('id_sortant')->nullable();
            $table->unsignedBigInteger('id_uploader');
            $table->foreign('id_entrant')->references('id_entrant')->on('courrier_entrant')->cascadeOnDelete();
            $table->foreign('id_sortant')->references('id_sortant')->on('courrier_sortant')->cascadeOnDelete();
            $table->foreign('id_uploader')->references('id_utilisateur')->on('utilisateur');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('piece_jointes');
    }
};
