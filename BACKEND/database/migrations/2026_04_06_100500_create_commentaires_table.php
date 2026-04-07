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
        Schema::create('commentaire', function (Blueprint $table) {
            $table->id('id_commentaire');
            $table->text('contenu');
            $table->dateTime('date_commentaire')->useCurrent();
            $table->unsignedBigInteger('id_entrant')->nullable();
            $table->unsignedBigInteger('id_sortant')->nullable();
            $table->unsignedBigInteger('id_auteur');
            $table->foreign('id_entrant')->references('id_entrant')->on('courrier_entrant')->cascadeOnDelete();
            $table->foreign('id_sortant')->references('id_sortant')->on('courrier_sortant')->cascadeOnDelete();
            $table->foreign('id_auteur')->references('id_utilisateur')->on('utilisateur');
        });
        
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commentaires');
    }
};
