
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('name', 'nombre');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('apellido')->nullable();
            $table->string('imagen')->nullable();
            $table->string('telefono', 30)->nullable();
            $table->boolean('estado')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'apellido',
                'imagen',
                'telefono',
                'estado',
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('nombre', 'name');
        });
    }
};
