<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoEstudiosSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        $nombres = [
            'En Curso',
            'Graduado',
            'Abandonado',
        ];

        $registros = [];

        foreach ($nombres as $nombre) {
            $registros[] = [
                'nombre' => $nombre,
                'estado' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ];
        }

        DB::table('estado_estudios')->upsert(
            $registros,
            ['nombre'],
            ['estado', 'updated_at']
        );

        $this->command?->info(
            count($registros) . ' estados de estudio procesados correctamente.'
        );
    }
}
