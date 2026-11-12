
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destrezas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('categoria_habilidad_id')
                ->constrained('categorias_habilidades')
                ->restrictOnDelete();

            $table->string('nombre', 100);
            $table->string('descripcion', 255)->nullable();
            $table->boolean('estado')->default(true);

            $table->timestamps();

            $table->unique(
                ['categoria_habilidad_id', 'nombre'],
                'destrezas_categoria_nombre_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destrezas');
    }
};
