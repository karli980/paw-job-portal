<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadosOfertasLaboralesSeeder extends Seeder
{
    public function run(): void
    {
        $estados = [
            [
                'nombre' => 'Borrador',
                'descripcion' => 'Oferta en preparación, todavía no publicada.',
            ],
            [
                'nombre' => 'Publicada',
                'descripcion' => 'Oferta visible y disponible para recibir postulaciones.',
            ],
            [
                'nombre' => 'Pausada',
                'descripcion' => 'Oferta suspendida temporalmente.',
            ],
            [
                'nombre' => 'Expirada',
                'descripcion' => 'Oferta cuyo plazo de postulación ha vencido.',
            ],
            [
                'nombre' => 'Cerrada',
                'descripcion' => 'Proceso de selección finalizado.',
            ],
            [
                'nombre' => 'Archivada',
                'descripcion' => 'Oferta conservada como registro histórico.',
            ],
        ];

        foreach ($estados as $estado) {
            DB::table('estados_ofertas_laborales')->updateOrInsert(
                ['nombre' => $estado['nombre']],
                [
                    'descripcion' => $estado['descripcion'],
                    'estado' => true,
                    'updated_at' => now(),
                ]
            );
        }
    }
}
