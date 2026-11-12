<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empresa_usuario', function (Blueprint $table) {
            $table->id();

            $table->foreignId('empresa_id')
                ->constrained('empresas')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('rol', 30)->default('admin');
            $table->boolean('estado')->default(true);

            $table->timestamps();

            $table->unique(
                ['empresa_id', 'user_id'],
                'empresa_usuario_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empresa_usuario');
    }
};
