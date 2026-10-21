
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadosCivilesSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        $estados = [
            'Soltero/a',
            'Casado/a',
            'Divorciado/a',
            'Viudo/a',
            'Unión convivencial',
        ];

        $registros = [];

        foreach ($estados as $nombre) {
            $registros[] = [
                'nombre' => $nombre,
                'estado' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ];
        }

        DB::table('estados_civiles')->upsert(
            $registros,
            ['nombre'],
            ['estado', 'updated_at']
        );
    }
}

