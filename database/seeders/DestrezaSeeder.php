<?php

namespace Database\Seeders;

use App\Models\CategoriaHabilidad;
use App\Models\Destreza;
use Illuminate\Database\Seeder;

class DestrezaSeeder extends Seeder
{
    public function run(): void
    {
        $destrezas = [
            // Backend
            [
                'categoria' => 'Backend',
                'nombres' => [
                    'PHP',
                    'Laravel',
                    'Python',
                    'Java',
                    'Node.js',
                    'C#',
                ],
            ],

            // Frontend
            [
                'categoria' => 'Frontend',
                'nombres' => [
                    'HTML',
                    'CSS',
                    'JavaScript',
                    'TypeScript',
                    'React',
                    'Vue.js',
                    'Tailwind CSS',
                ],
            ],

            // Bases de datos
            [
                'categoria' => 'Bases de datos',
                'nombres' => [
                    'MySQL',
                    'PostgreSQL',
                    'SQL Server',
                    'MongoDB',
                ],
            ],

            // Herramientas y control de versiones
            [
                'categoria' => 'Otros',
                'nombres' => [
                    'Git',
                    'GitHub',
                ],
            ],

            // DevOps
            [
                'categoria' => 'DevOps',
                'nombres' => [
                    'Docker',
                ],
            ],

            // Sistemas
            [
                'categoria' => 'Redes y seguridad informática',
                'nombres' => [
                    'Linux',
                ],
            ],

            // Cloud
            [
                'categoria' => 'Cloud',
                'nombres' => [
                    'AWS',
                ],
            ],

            // Diseño
            [
                'categoria' => 'Diseño gráfico',
                'nombres' => [
                    'Figma',
                ],
            ],

            // Datos
            [
                'categoria' => 'Datos',
                'nombres' => [
                    'Análisis de datos',
                    'Power BI',
                ],
            ],

            // Ofimática
            [
                'categoria' => 'Ofimática',
                'nombres' => [
                    'Excel',
                ],
            ],

            // Habilidades blandas
            [
                'categoria' => 'Habilidades Blandas',
                'nombres' => [
                    'Comunicación',
                    'Trabajo en equipo',
                    'Liderazgo',
                    'Resolución de problemas',
                    'Gestión del tiempo',
                ],
            ],
        ];

        foreach ($destrezas as $grupo) {
            $categoria = CategoriaHabilidad::where(
                'nombre',
                $grupo['categoria']
            )->firstOrFail();

            foreach ($grupo['nombres'] as $nombre) {
                Destreza::updateOrCreate(
                    [
                        'categoria_habilidad_id' => $categoria->id,
                        'nombre' => $nombre,
                    ],
                    [
                        'descripcion' => null,
                        'estado' => true,
                    ]
                );
            }
        }
    }
}
