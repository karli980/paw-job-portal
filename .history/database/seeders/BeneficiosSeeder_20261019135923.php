
<?php

namespace Database\Seeders;

use App\Models\Beneficio;
use Illuminate\Database\Seeder;

class BeneficioSeeder extends Seeder
{
    public function run(): void
    {
        $beneficios = [
            [
                'nombre' => 'Obra social',
                'descripcion' => 'Cobertura médica para el empleado.',
                'icono' => 'heart-pulse',
            ],
            [
                'nombre' => 'Trabajo remoto',
                'descripcion' => 'Posibilidad de trabajar a distancia.',
                'icono' => 'house',
            ],
            [
                'nombre' => 'Modalidad híbrida',
                'descripcion' => 'Combinación de trabajo presencial y remoto.',
                'icono' => 'laptop',
            ],
            [
                'nombre' => 'Horario flexible',
                'descripcion' => 'Flexibilidad en los horarios de trabajo.',
                'icono' => 'clock',
            ],
            [
                'nombre' => 'Vacaciones adicionales',
                'descripcion' => 'Días de vacaciones adicionales a los habituales.',
                'icono' => 'calendar-days',
            ],
            [
                'nombre' => 'Capacitación',
                'descripcion' => 'Acceso a cursos y formación profesional.',
                'icono' => 'graduation-cap',
            ],
            [
                'nombre' => 'Bonos por desempeño',
                'descripcion' => 'Incentivos económicos por objetivos alcanzados.',
                'icono' => 'wallet',
            ],
            [
                'nombre' => 'Gimnasio',
                'descripcion' => 'Acceso a gimnasio o actividades deportivas.',
                'icono' => 'dumbbell',
            ],
            [
                'nombre' => 'Comedor',
                'descripcion' => 'Comidas o servicio de comedor para empleados.',
                'icono' => 'utensils',
            ],
            [
                'nombre' => 'Día libre por cumpleaños',
                'descripcion' => 'Día libre durante el mes del cumpleaños.',
                'icono' => 'cake',
            ],
            [
                'nombre' => 'Reintegro de internet',
                'descripcion' => 'Ayuda económica para gastos de conectividad.',
                'icono' => 'wifi',
            ],
            [
                'nombre' => 'Equipamiento de trabajo',
                'descripcion' => 'Provisión de computadora y herramientas laborales.',
                'icono' => 'monitor',
            ],
            [
                'nombre' => 'Plan de carrera',
                'descripcion' => 'Oportunidades de crecimiento profesional.',
                'icono' => 'trending-up',
            ],
            [
                'nombre' => 'Licencias extendidas',
                'descripcion' => 'Licencias adicionales según las políticas de la empresa.',
                'icono' => 'calendar-check',
            ],
            [
                'nombre' => 'Descuentos para empleados',
                'descripcion' => 'Descuentos en productos o servicios.',
                'icono' => 'tag',
            ],
        ];

        foreach ($beneficios as $beneficio) {
            Beneficio::updateOrCreate(
                ['nombre' => $beneficio['nombre']],
                [
                    'descripcion' => $beneficio['descripcion'],
                    'icono' => $beneficio['icono'],
                    'estado' => true,
                ]
            );
        }
    }
}
