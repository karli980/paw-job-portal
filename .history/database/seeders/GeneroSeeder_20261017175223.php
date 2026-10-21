
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GenerosSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        DB::table('generos')->upsert(
            [
                [
                    'nombre' => 'Hombre',
                    'estado' => true,
                    'created_at' => $ahora,
                    'updated_at' => $ahora,
                ],
                [
                    'nombre' => 'Mujer',
                    'estado' => true,
                    'created_at' => $ahora,
                    'updated_at' => $ahora,
                ],
                [
                    'nombre' => 'Otro',
                    'estado' => true,
                    'created_at' => $ahora,
                    'updated_at' => $ahora,
                ],
            ],
            ['nombre'],
            ['estado', 'updated_at']
        );
    }
}

