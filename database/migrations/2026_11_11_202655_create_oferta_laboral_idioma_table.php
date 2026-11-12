<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('oferta_laboral_idioma', function (Blueprint $table) {
            $table->id();

            $table->foreignId('oferta_laboral_id')
                ->constrained('ofertas_laborales')
                ->cascadeOnDelete();

            $table->foreignId('idioma_id')
                ->constrained('idiomas')
                ->restrictOnDelete();

            // Niveles mínimos requeridos
            $niveles = [
                'basico',
                'intermedio',
                'avanzado',
                'nativo',
            ];

            $table->enum('nivel_lectura', $niveles)->nullable();
            $table->enum('nivel_escritura', $niveles)->nullable();
            $table->enum('nivel_oral', $niveles)->nullable();

            // Requisito obligatorio o deseable
            $table->boolean('obligatorio')->default(true);

            $table->timestamps();

            $table->unique(
                ['oferta_laboral_id', 'idioma_id'],
                'oferta_idioma_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('oferta_laboral_idioma');
    }
};
