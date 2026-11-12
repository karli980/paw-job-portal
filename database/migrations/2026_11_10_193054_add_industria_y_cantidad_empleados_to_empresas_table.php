<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {

            // Industria principal de la empresa.
            $table->foreignId('industria_id')
                ->nullable()
                ->constrained('industrias')
                ->restrictOnDelete();

            // Rango de cantidad de empleados.
            $table->foreignId('cantidad_de_empleados_id')
                ->nullable()
                ->constrained('cantidad_de_empleados')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {

            $table->dropConstrainedForeignId('industria_id');

            $table->dropConstrainedForeignId(
                'cantidad_de_empleados_id'
            );
        });
    }
};
