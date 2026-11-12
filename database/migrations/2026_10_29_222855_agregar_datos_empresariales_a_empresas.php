<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->string('razon_social', 200)
                ->nullable()
                ->after('nombre_comercial');

            $table->string('cuit', 11)
                ->nullable()
                ->unique()
                ->after('razon_social');

            $table->text('descripcion')
                ->nullable()
                ->after('cuit');

            $table->string('sitio_web', 255)
                ->nullable()
                ->after('descripcion');

            $table->string('logo', 255)
                ->nullable()
                ->after('sitio_web');
        });
    }

    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropUnique(['cuit']);

            $table->dropColumn([
                'razon_social',
                'cuit',
                'descripcion',
                'sitio_web',
                'logo',
            ]);
        });
    }
};
