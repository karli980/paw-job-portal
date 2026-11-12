<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sub_areas_laborales', function (Blueprint $table) {
            $table->id();

            $table->foreignId('area_laboral_id')
                ->constrained('areas_laborales')
                ->restrictOnDelete();

            $table->string('nombre', 150);

            $table->boolean('estado')->default(true);

            $table->timestamps();

            $table->unique(
                ['area_laboral_id', 'nombre'],
                'sub_areas_laborales_area_nombre_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_areas_laborales');
    }
};

