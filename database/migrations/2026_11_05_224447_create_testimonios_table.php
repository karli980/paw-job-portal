<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonios', function (Blueprint $table) {
            $table->id();

            // Usuario que registra el testimonio.
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Perfil de candidato, si corresponde.
            $table->foreignId('candidato_id')
                ->nullable()
                ->unique()
                ->constrained('candidatos')
                ->cascadeOnDelete();

            // Empresa a la que corresponde el testimonio.
            $table->foreignId('empresa_id')
                ->nullable()
                ->unique()
                ->constrained('empresas')
                ->cascadeOnDelete();

            // Contenido del testimonio.
            $table->text('mensaje');

            // Autorización de publicación.
            $table->boolean('consentimiento')
                ->default(false);

            $table->timestamp('consentimiento_at')
                ->nullable();

            $table->timestamp('consentimiento_revocado_at')
                ->nullable();

            // Control administrativo.
            $table->boolean('estado')
                ->default(true);

            $table->boolean('destacado')
                ->default(false);

            $table->timestamps();

            $table->index(
                ['estado', 'consentimiento', 'destacado'],
                'testimonios_publicacion_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonios');
    }
};
