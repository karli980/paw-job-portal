
<?php

namespace Database\Seeders;

use App\Models\Habilidad;
use Illuminate\Database\Seeder;

class HabilidadSeeder extends Seeder
{
    public function run(): void
    {
        $habilidades = [
            // Desarrollo backend
            ['nombre' => 'PHP', 'categoria' => 'Backend'],
            ['nombre' => 'Laravel', 'categoria' => 'Backend'],
            ['nombre' => 'Python', 'categoria' => 'Backend'],
            ['nombre' => 'Java', 'categoria' => 'Backend'],
            ['nombre' => 'Node.js', 'categoria' => 'Backend'],
            ['nombre' => 'C#', 'categoria' => 'Backend'],

            // Desarrollo frontend
            ['nombre' => 'HTML', 'categoria' => 'Frontend'],
            ['nombre' => 'CSS', 'categoria' => 'Frontend'],
            ['nombre' => 'JavaScript', 'categoria' => 'Frontend'],
            ['nombre' => 'TypeScript', 'categoria' => 'Frontend'],
            ['nombre' => 'React', 'categoria' => 'Frontend'],
            ['nombre' => 'Vue.js', 'categoria' => 'Frontend'],
            ['nombre' => 'Tailwind CSS', 'categoria' => 'Frontend'],

            // Bases de datos
            ['nombre' => 'MySQL', 'categoria' => 'Bases de datos'],
            ['nombre' => 'PostgreSQL', 'categoria' => 'Bases de datos'],
            ['nombre' => 'SQL Server', 'categoria' => 'Bases de datos'],
            ['nombre' => 'MongoDB', 'categoria' => 'Bases de datos'],

            // Herramientas y operaciones
            ['nombre' => 'Git', 'categoria' => 'Herramientas'],
            ['nombre' => 'GitHub', 'categoria' => 'Herramientas'],
            ['nombre' => 'Docker', 'categoria' => 'DevOps'],
            ['nombre' => 'Linux', 'categoria' => 'Sistemas'],
            ['nombre' => 'AWS', 'categoria' => 'Cloud'],

            // Diseño y análisis
            ['nombre' => 'Figma', 'categoria' => 'Diseño'],
            ['nombre' => 'Análisis de datos', 'categoria' => 'Datos'],
            ['nombre' => 'Excel', 'categoria' => 'Ofimática'],
            ['nombre' => 'Power BI', 'categoria' => 'Datos'],

            // Habilidades blandas
            ['nombre' => 'Comunicación', 'categoria' => 'Habilidades blandas'],
            ['nombre' => 'Trabajo en equipo', 'categoria' => 'Habilidades blandas'],
            ['nombre' => 'Liderazgo', 'categoria' => 'Habilidades blandas'],
            ['nombre' => 'Resolución de problemas', 'categoria' => 'Habilidades blandas'],
            ['nombre' => 'Gestión del tiempo', 'categoria' => 'Habilidades blandas'],
        ];

        foreach ($habilidades as $habilidad) {
            Habilidad::updateOrCreate(
                ['nombre' => $habilidad['nombre']],
                [
                    'categoria' => $habilidad['categoria'],
                    'estado' => true,
                ]
            );
        }
    }
}

