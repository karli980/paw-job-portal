
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AreasEstudioSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            'Abogacía',
            'Actuario',
            'Acuicultura',
            'Administración Agropecuaria',
            'Administración de Empresas',
            'Administración y Gestión Pública',
            'Agrimensura',
            'Agronegocios',
            'Análisis de Sistemas',
            'Antropología',
            'Apoderado Aduanal',
            'Arqueología',
            'Arquitectura',
            'Asesoría Legal Internacional',
            'Asesoría en Comercio Exterior',
            'Asistente de Tráfico',
            'Astronomía',
            'Bachillerato',
            'Bacteriología',
            'Bellas Artes',
            'Bibliotecología',
            'Biofísica',
            'Bioingeniería',
            'Biología',
            'Bioquímica',
            'Biotecnología',
            'Call Center',
            'Capacitación en Comercio Exterior',
            'Cartografía',
            'Ciencias de la Educación',
            'Ciencias Físicas',
            'Ciencias Políticas',
            'Comercio Exterior',
            'Comercio Internacional',
            'Comunicación Audiovisual',
            'Comunicación Social',
            'Computación e Informática',
            'Construcción y Obras Civiles',
            'Contabilidad y Auditoría',
            'Dibujo Técnico',
            'Diseño de Imagen y Sonido',
            'Diseño de Indumentaria y Textil',
            'Diseño Gráfico',
            'Diseño Industrial',
            'Diseño Web',
            'Ecología',
            'Economía',
            'Educación',
            'Educación Física',
            'Electricidad',
            'Electrónica',
            'Enfermería',
            'Enología',
            'Escribanía',
            'Estadística',
            'Farmacia',
            'Filosofía',
            'Finanzas',
            'Finanzas Internacionales',
            'Fisioterapia',
            'Fonoaudiología',
            'Fotografía',
            'Gastronomía y Cocina',
            'Geofísica',
            'Geografía',
            'Geología',
            'Hidráulica',
            'Historia',
            'Histopatología',
            'Hotelería',
            'Ingeniería',
            'Kinesiología',
            'Laboratorio',
            'Literatura',
            'Marketing',
            'Mecánica',
            'Mecánica Dental',
            'Medicina',
            'Medio Ambiente',
            'Mercadotecnia Internacional',
            'Metalurgia',
            'Microbiología',
            'Minería, Petróleo y Gas',
            'Música',
            'Nutrición',
            'Oceanografía',
            'Odontología',
            'Organización Industrial',
            'Paisajismo',
            'Periodismo',
            'Perito Mercantil',
            'Procesos y Calidad Total',
            'Programación',
            'Psicología',
            'Psicopedagogía',
            'Publicidad',
            'Química',
            'Recursos Humanos',
            'Relaciones Internacionales',
            'Salud',
            'Secretariado',
            'Seguridad Industrial',
            'Seguros',
            'Sin especificar',
            'Sociología',
            'Tecnología de Alimentos',
            'Tecnología de la Información',
            'Tecnología Médica',
            'Telecomunicaciones',
            'Terapia Ocupacional',
            'Técnico',
            'Trabajo Social',
            'Traducción',
            'Transporte',
            'Turismo',
            'Ventas Internacionales',
            'Veterinaria',
            'Otra',
        ];

        $ahora = now();

        $registros = collect($areas)
            ->unique()
            ->map(fn (string $nombre) => [
                'nombre' => $nombre,
                'estado' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ])
            ->values()
            ->all();

        DB::table('areas_estudio')->upsert(
            $registros,
            ['nombre'],
            ['estado', 'updated_at']
        );

        $this->command?->info(
            count($registros) .
            ' áreas de estudio procesadas correctamente.'
        );
    }
}
