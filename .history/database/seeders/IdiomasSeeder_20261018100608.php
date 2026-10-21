
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IdiomasSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        $idiomas = [
            'Español',
            'Inglés',
            'Portugués',
            'Francés',
            'Italiano',
            'Alemán',
            'Chino',
            'Japonés',
            'Coreano',
            'Árabe',
            'Ruso',
        ];

        $registros = [];

        foreach ($idiomas as $nombre) {
            $registros[] = [
                'nombre' => $nombre,
                'estado' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ];
        }

        DB::table('idiomas')->upsert(
            $registros,
            ['nombre'],
            ['estado', 'updated_at']
        );
    }
}

