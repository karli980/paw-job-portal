<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ofertas_laborales', function (Blueprint $table) {
            // Identificación
            $table->id();

            $table->foreignId('empresa_id')
                ->constrained('empresas')
                ->restrictOnDelete();

            $table->string('titulo', 180)->nullable();
            $table->string('slug', 220)->nullable()->unique();
            $table->string('resumen', 300)->nullable();
            $table->longText('descripcion')->nullable();
            $table->longText('responsabilidades')->nullable();
            $table->longText('requisitos')->nullable();

            // Clasificación laboral
            $table->foreignId('area_laboral_id')
                ->nullable()
                ->constrained('areas_laborales')
                ->restrictOnDelete();

            $table->foreignId('sub_area_laboral_id')
                ->nullable()
                ->constrained('sub_areas_laborales')
                ->restrictOnDelete();

            $table->foreignId('modalidad_trabajo_id')
                ->nullable()
                ->constrained('modalidades_trabajos')
                ->restrictOnDelete();

            $table->unsignedSmallInteger('experiencia_minima_anios')
                ->nullable();

            $table->unsignedInteger('vacantes')->default(1);

            // Ubicación del puesto
            $table->foreignId('pais_id')
                ->nullable()
                ->constrained('paises')
                ->restrictOnDelete();

            $table->foreignId('provincia_id')
                ->nullable()
                ->constrained('provincias')
                ->restrictOnDelete();

            $table->foreignId('ciudad_id')
                ->nullable()
                ->constrained('ciudades')
                ->restrictOnDelete();

            $table->string('direccion_trabajo', 255)->nullable();

            // Remuneración
            $table->decimal('salario_minimo', 15, 2)->nullable();
            $table->decimal('salario_maximo', 15, 2)->nullable();

            $table->foreignId('moneda_id')
                ->nullable()
                ->constrained('monedas')
                ->restrictOnDelete();

            $table->string('periodicidad_salarial', 20)->nullable();
            $table->boolean('salario_visible')->default(false);
            $table->boolean('salario_negociable')->default(false);

            // Inclusión y accesibilidad
            $table->boolean('apta_discapacidad')->nullable();
            $table->text('informacion_accesibilidad')->nullable();

            // Privacidad y prioridad
            $table->boolean('identidad_empresa_visible')->default(true);
            $table->boolean('es_urgente')->default(false);

            // Ciclo de vida
            $table->foreignId('estado_oferta_id')
                ->constrained('estados_ofertas_laborales')
                ->restrictOnDelete();

            $table->dateTime('fecha_publicacion')->nullable();
            $table->dateTime('fecha_vencimiento')->nullable();

            // Auditoría y eliminación lógica
            $table->timestamps();
            $table->softDeletes();

            // Índices para búsquedas y listados
            $table->index(['estado_oferta_id', 'fecha_publicacion']);
            $table->index(['empresa_id', 'estado_oferta_id']);
            $table->index('fecha_vencimiento');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ofertas_laborales');
    }
};
