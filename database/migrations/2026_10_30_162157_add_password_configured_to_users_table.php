<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('password_configured')
                ->default(true);
        });

        // Las cuentas sociales existentes todavía no tienen
        // una contraseña local configurada.
        DB::table('users')
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('social_accounts')
                    ->whereColumn('social_accounts.user_id', 'users.id');
            })
            ->update(['password_configured' => false]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('password_configured');
        });
    }
};
