<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empresa_contactos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('empresa_id')
                ->unique()
                ->constrained('empresas')
                ->restrictOnDelete();

            $table->string('email', 255)->nullable();
            $table->string('telefono', 30)->nullable();

            $table->boolean('estado')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empresa_contactos');
    }
};
