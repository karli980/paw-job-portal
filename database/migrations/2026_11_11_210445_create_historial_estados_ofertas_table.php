<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historial_estados_ofertas', function (Blueprint $table) {
            $table->id();

            // Oferta relacionada
            $table->foreignId('oferta_laboral_id')
                ->constrained('ofertas_laborales')
                ->restrictOnDelete();

            // Estado anterior (NULL en la creación)
            $table->foreignId('estado_anterior_id')
                ->nullable()
                ->constrained('estados_ofertas_laborales')
                ->restrictOnDelete();

            // Nuevo estado
            $table->foreignId('estado_nuevo_id')
                ->constrained('estados_ofertas_laborales')
                ->restrictOnDelete();

            // Usuario responsable del cambio
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Motivo del cambio
            $table->text('motivo')->nullable();

            $table->timestamps();

            // Consultas del historial por oferta
            $table->index(
                ['oferta_laboral_id', 'created_at'],
                'historial_oferta_fecha_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historial_estados_ofertas');
    }
};
