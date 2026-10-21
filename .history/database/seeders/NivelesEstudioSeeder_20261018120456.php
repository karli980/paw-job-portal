<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NivelesEstudioSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        $nombres = [
            'Curso',
            'Secundario',
            'Terciario',
            'Universitario',
            'Posgrado',
            'Maestría',
            'Especialidad',
            'Doctorado',
            'Otro',
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

        DB::table('niveles_estudio')->upsert(
            $registros,
            ['nombre'],
            ['estado', 'updated_at']
        );

        $this->command?->info(
            count($registros) .
            ' niveles de estudio procesados correctamente.'
        );
    }
}

