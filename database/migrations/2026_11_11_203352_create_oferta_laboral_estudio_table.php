<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('oferta_laboral_estudio', function (Blueprint $table) {
            $table->id();

            $table->foreignId('oferta_laboral_id')
                ->constrained('ofertas_laborales')
                ->cascadeOnDelete();

            $table->foreignId('nivel_estudio_id')
                ->constrained('niveles_estudio')
                ->restrictOnDelete();

            $table->foreignId('area_estudio_id')
                ->nullable()
                ->constrained('areas_estudio')
                ->restrictOnDelete();

            $table->boolean('obligatorio')->default(true);

            $table->timestamps();

            $table->unique(
                [
                    'oferta_laboral_id',
                    'nivel_estudio_id',
                    'area_estudio_id',
                ],
                'oferta_estudio_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('oferta_laboral_estudio');
    }
};
