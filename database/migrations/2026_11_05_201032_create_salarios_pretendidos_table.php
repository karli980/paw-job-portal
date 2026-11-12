<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salarios_pretendidos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('candidato_id')
                ->unique()
                ->constrained('candidatos')
                ->cascadeOnDelete();

            $table->decimal('monto', 15, 2);

            $table->foreignId('moneda_id')
                ->constrained('monedas')
                ->restrictOnDelete();

            $table->boolean('visible')->default(false);

            $table->boolean('negociable')->default(false);

            $table->boolean('estado')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salarios_pretendidos');
    }
};
