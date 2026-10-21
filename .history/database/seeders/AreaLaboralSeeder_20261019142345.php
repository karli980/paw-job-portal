
<?php

namespace Database\Seeders;

use App\Models\AreaLaboral;
use Illuminate\Database\Seeder;

class AreaLaboralSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            'Comercial, Ventas y Negocios',
            'Administración, Contabilidad y Finanzas',
            'Producción y Manufactura',
            'Oficios y Otros',
            'Salud, Medicina y Farmacia',
            'Abastecimiento y Logística',
            'Tecnología, Sistemas y Telecomunicaciones',
            'Gastronomía y Turismo',
            'Atención al Cliente, Call Center y Telemarketing',
            'Ingenierías',
            'Construcción',
            'Marketing y Publicidad',
            'Recursos Humanos y Capacitación',
            'Legales',
            'Secretarías y Recepción',
            'Departamento Técnico',
            'Diseño',
            'Aduana y Comercio Exterior',
            'Educación, Docencia e Investigación',
            'Seguros',
            'Gerencia y Dirección General',
            'Minería, Petróleo y Gas',
            'Enfermería',
            'Comunicación, Relaciones Institucionales y Públicas',
            'Naviero, Marítimo y Portuario',
            'Sociología y Trabajo Social',
        ];

        foreach ($areas as $nombre) {
            AreaLaboral::updateOrCreate(
                ['nombre' => $nombre],
                ['estado' => true]
            );
        }
    }
}
