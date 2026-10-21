
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IndustriasSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        $industrias = [
            'Comercio',
            'Consultora de Recursos Humanos',
            'Consultoría',
            'Servicios',
            'Salud',
            'Gastronomía',
            'Alimenticia',
            'Automotriz',
            'Construcción',
            'Inmobiliaria',
            'Industrial',
            'Educación',
            'Informática/Tecnología',
            'Jurídica',
            'Administración',
            'Textil',
            'Metalúrgica',
            'Transporte',
            'Manufactura',
            'Retail',
            'Seguridad',
            'Telecomunicaciones',
            'Call Center',
            'Laboratorio',
            'Agro-Industrial',
            'Farmacéutica',
            'Seguros',
            'Arquitectura',
            'Publicidad/Marketing/RRPP',
            'Banca/Financiera',
            'Plásticos',
            'Química',
            'Energía',
            'Hotelería',
            'Minería/Petróleo/Gas',
            'ONGS',
            'Comercio Exterior',
            'Otra',
        ];

        $registros = [];

        foreach ($industrias as $nombre) {
            $registros[] = [
                'nombre' => $nombre,
                'estado' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ];
        }

        DB::table('industrias')->upsert(
            $registros,
            ['nombre'],
            ['estado', 'updated_at']
        );

        $this->command?->info(
            count($registros) . ' industrias procesadas correctamente.'
        );
    }
}
