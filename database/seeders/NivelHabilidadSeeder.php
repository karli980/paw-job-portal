<?php

namespace Database\Seeders;

use App\Models\NivelHabilidad;
use Illuminate\Database\Seeder;

class NivelHabilidadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $niveles = [
            [
                'nombre' => 'Inicial',
                'porcentaje' => 25,
                'descripcion' => 'Conocimientos iniciales de la habilidad.',
                'estado' => true,
            ],
            [
                'nombre' => 'Básico',
                'porcentaje' => 40,
                'descripcion' => 'Conocimientos básicos y capacidad para realizar tareas sencillas.',
                'estado' => true,
            ],
            [
                'nombre' => 'Intermedio',
                'porcentaje' => 70,
                'descripcion' => 'Manejo autónomo de la habilidad en situaciones habituales.',
                'estado' => true,
            ],
            [
                'nombre' => 'Avanzado',
                'porcentaje' => 90,
                'descripcion' => 'Dominio avanzado de la habilidad y resolución de tareas complejas.',
                'estado' => true,
            ],
            [
                'nombre' => 'Experto',
                'porcentaje' => null,
                'descripcion' => 'Dominio experto de la habilidad.',
                'estado' => true,
            ],
        ];

        foreach ($niveles as $nivel) {
            NivelHabilidad::updateOrCreate(
                ['nombre' => $nivel['nombre']],
                $nivel
            );
        }
    }
}

