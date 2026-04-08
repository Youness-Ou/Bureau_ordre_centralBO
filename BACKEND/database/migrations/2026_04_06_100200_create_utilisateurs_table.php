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
        Schema::create('utilisateur', function (Blueprint $table) {
            $table->id('id_utilisateur');
            $table->string('nom', 80);
            $table->string('prenom', 80);
            $table->string('email', 150)->unique();
            $table->string('mot_de_passe');
            $table->boolean('actif')->default(true);
            $table->unsignedBigInteger('id_role');
            $table->unsignedBigInteger('id_service');
            $table->timestamps();
            $table->foreign('id_role')->references('id_role')->on('role');
            $table->foreign('id_service')->references('id_service')->on('service');
            $table->index('id_role');
            $table->index('id_service');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
