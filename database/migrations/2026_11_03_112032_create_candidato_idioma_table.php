<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidato_idioma', function (Blueprint $table) {
            $table->id();

            $table->foreignId('candidato_id')
                ->constrained('candidatos')
                ->cascadeOnDelete();

            $table->foreignId('idioma_id')
                ->constrained('idiomas')
                ->cascadeOnDelete();

            $table->enum('nivel_lectura', [
                'basico',
                'intermedio',
                'avanzado',
                'nativo',
            ]);

            $table->enum('nivel_escritura', [
                'basico',
                'intermedio',
                'avanzado',
                'nativo',
            ]);

            $table->enum('nivel_oral', [
                'basico',
                'intermedio',
                'avanzado',
                'nativo',
            ]);

            // Evitar que un candidato registre dos veces el mismo idioma.
            $table->unique(
                ['candidato_id', 'idioma_id'],
                'candidato_idioma_unique'
            );

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidato_idioma');
    }
};
