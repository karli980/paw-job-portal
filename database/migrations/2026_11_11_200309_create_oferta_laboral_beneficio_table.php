<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('oferta_laboral_beneficio', function (Blueprint $table) {
            $table->id();

            $table->foreignId('oferta_laboral_id')
                ->constrained('ofertas_laborales')
                ->cascadeOnDelete();

            $table->foreignId('beneficio_id')
                ->constrained('beneficios')
                ->restrictOnDelete();

            $table->timestamps();

            $table->unique(
                ['oferta_laboral_id', 'beneficio_id'],
                'oferta_beneficio_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('oferta_laboral_beneficio');
    }
};
