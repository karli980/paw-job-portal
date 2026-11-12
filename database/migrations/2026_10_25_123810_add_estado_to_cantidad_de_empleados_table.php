
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cantidad_de_empleados', function (Blueprint $table) {
            $table->boolean('estado')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('cantidad_de_empleados', function (Blueprint $table) {
            $table->dropColumn('estado');
        });
    }
};
