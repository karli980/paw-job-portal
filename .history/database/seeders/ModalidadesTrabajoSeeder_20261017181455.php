
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModalidadesTrabajoSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        $modalidades = [
            'Presencial',
            'Híbrido',
            'Remoto',
        ];

        $registros = [];

        foreach ($modalidades as $nombre) {
            $registros[] = [
                'nombre' => $nombre,
                'estado' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ];
        }

        DB::table('modalidades_trabajo')->upsert(
            $registros,
            ['nombre'],
            ['estado', 'updated_at']
        );
    }
}

