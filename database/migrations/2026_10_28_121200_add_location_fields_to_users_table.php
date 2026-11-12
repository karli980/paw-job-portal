<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('pais_id')
                ->nullable()
                ->constrained('paises')
                ->nullOnDelete();

            $table->foreignId('provincia_id')
                ->nullable()
                ->constrained('provincias')
                ->nullOnDelete();

            $table->foreignId('ciudad_id')
                ->nullable()
                ->constrained('ciudades')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('ciudad_id');
            $table->dropConstrainedForeignId('provincia_id');
            $table->dropConstrainedForeignId('pais_id');
        });
    }
};
