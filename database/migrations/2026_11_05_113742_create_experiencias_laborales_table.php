<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiencias_laborales', function (Blueprint $table) {
            $table->id();

            $table->foreignId('candidato_id')
                ->constrained('candidatos')
                ->cascadeOnDelete();

            $table->foreignId('sub_area_laboral_id')
                ->constrained('sub_areas_laborales')
                ->restrictOnDelete();

            $table->string('nombre_empleador', 150);

            $table->string('puesto', 150);

            $table->date('fecha_inicio');

            $table->date('fecha_finalizacion')
                ->nullable();

            $table->boolean('trabaja_actualmente')
                ->default(false);

            $table->text('responsabilidades');

            $table->unsignedSmallInteger('personas_a_cargo')
                ->nullable();

            $table->timestamps();
            
            $table->boolean('estado')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiencias_laborales');
    }
};

