<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | REDES SOCIALES PERSONALES
        |--------------------------------------------------------------------------
        */

        Schema::create('user_red_social', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('red_social_id')
                ->constrained('redes_sociales')
                ->restrictOnDelete();

            $table->string('url_perfil', 2048);

            $table->boolean('estado')->default(true);

            $table->timestamps();

            $table->unique(
                ['user_id', 'red_social_id'],
                'user_red_social_unique'
            );
        });

        /*
        |--------------------------------------------------------------------------
        | REDES SOCIALES EMPRESARIALES
        |--------------------------------------------------------------------------
        */

        Schema::create('empresa_red_social', function (Blueprint $table) {
            $table->id();

            $table->foreignId('empresa_id')
                ->constrained('empresas')
                ->restrictOnDelete();

            $table->foreignId('red_social_id')
                ->constrained('redes_sociales')
                ->restrictOnDelete();

            $table->string('url_perfil', 2048);

            $table->boolean('estado')->default(true);

            $table->timestamps();

            $table->unique(
                ['empresa_id', 'red_social_id'],
                'empresa_red_social_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empresa_red_social');
        Schema::dropIfExists('user_red_social');
    }
};
