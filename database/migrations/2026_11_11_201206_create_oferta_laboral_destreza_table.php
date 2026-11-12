<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('oferta_laboral_destreza', function (Blueprint $table) {
            $table->id();

            $table->foreignId('oferta_laboral_id')
                ->constrained('ofertas_laborales')
                ->cascadeOnDelete();

            $table->foreignId('destreza_id')
                ->constrained('destrezas')
                ->restrictOnDelete();

            $table->foreignId('nivel_habilidad_id')
                ->nullable()
                ->constrained('niveles_habilidades')
                ->restrictOnDelete();

            $table->boolean('obligatoria')->default(true);

            $table->timestamps();

            $table->unique(
                ['oferta_laboral_id', 'destreza_id'],
                'oferta_destreza_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('oferta_laboral_destreza');
    }
};
