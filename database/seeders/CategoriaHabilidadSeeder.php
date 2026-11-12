<?php

namespace Database\Seeders;

use App\Models\CategoriaHabilidad;
use Illuminate\Database\Seeder;

class CategoriaHabilidadSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            'Programación',
            'Bases de datos',
            'Diseño gráfico',
            'Marketing digital',
            'Comunicación',
            'Gestión de proyectos',
            'Idiomas',
            'Administración',
            'Ofimática',
            'Redes y seguridad informática',
            'Habilidades Blandas',
            'Frontend',
            'Backend',
            'Cloud',
            'Datos',
            'DevOps',
            'Otros'
        ];

        foreach ($categorias as $nombre) {
            CategoriaHabilidad::firstOrCreate(
                ['nombre' => $nombre],
                ['estado' => true]
            );
        }
    }
}
