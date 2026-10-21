<?php

namespace Database\Seeders;

use App\Models\CantidadDeEmpleados;
use Illuminate\Database\Seeder;

class CantidadDeEmpleadosSeeder extends Seeder
{
    public function run(): void
    {
        $rangos = [
            ['nombre' => '1 a 10 empleados', 'minimo' => 1, 'maximo' => 10],
            ['nombre' => '11 a 50 empleados', 'minimo' => 11, 'maximo' => 50],
            ['nombre' => '51 a 200 empleados', 'minimo' => 51, 'maximo' => 200],
            ['nombre' => '201 a 500 empleados', 'minimo' => 201, 'maximo' => 500],
            ['nombre' => '501 a 1.000 empleados', 'minimo' => 501, 'maximo' => 1000],
            ['nombre' => 'Más de 1.000 empleados', 'minimo' => 1001, 'maximo' => null],
        ];

        foreach ($rangos as $rango) {
            CantidadDeEmpleados::updateOrCreate(
                ['nombre' => $rango['nombre']],
                [
                    'minimo' => $rango['minimo'],
                    'maximo' => $rango['maximo'],
                ]
            );
        }
    }
}
