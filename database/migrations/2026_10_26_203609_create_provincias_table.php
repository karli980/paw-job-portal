
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provincias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->boolean('estado')->default(true);

            $table->foreignId('pais_id')
                ->constrained('paises')
                ->restrictOnDelete();

            $table->timestamps();

            $table->unique(['pais_id', 'nombre']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provincias');
    }
};
