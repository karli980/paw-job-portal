<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {

            $table->foreignId('pais_id')
                ->nullable()
                ->after('logo')
                ->constrained('paises')
                ->restrictOnDelete();

            $table->foreignId('provincia_id')
                ->nullable()
                ->after('pais_id')
                ->constrained('provincias')
                ->restrictOnDelete();

            $table->foreignId('ciudad_id')
                ->nullable()
                ->after('provincia_id')
                ->constrained('ciudades')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {

            $table->dropForeign(['ciudad_id']);
            $table->dropForeign(['provincia_id']);
            $table->dropForeign(['pais_id']);

            $table->dropColumn([
                'pais_id',
                'provincia_id',
                'ciudad_id',
            ]);
        });
    }
};
