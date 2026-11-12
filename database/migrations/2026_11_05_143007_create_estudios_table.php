<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estudios', function (Blueprint $table) {
            $table->id();

            // Relaciones principales
            $table->foreignId('candidato_id')
                ->constrained('candidatos')
                ->cascadeOnDelete();

            $table->foreignId('pais_id')
                ->constrained('paises')
                ->restrictOnDelete();

            $table->foreignId('estado_estudio_id')
                ->constrained('estado_estudios')
                ->restrictOnDelete();

            $table->foreignId('area_estudio_id')
                ->constrained('areas_estudio')
                ->restrictOnDelete();

            $table->foreignId('nivel_estudio_id')
                ->constrained('niveles_estudio')
                ->restrictOnDelete();

            // Información académica
            $table->string('titulo', 150);
            $table->string('institucion', 150);

            // Período de formación
            $table->date('fecha_inicio');
            $table->date('fecha_finalizacion')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('estudios');
    }
};
