<?php

namespace Database\Seeders;

use App\Models\AreaLaboral;
use App\Models\SubAreaLaboral;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubAreaLaboralSeeder extends Seeder
{
    public function run(): void
    {
        $subAreasPorArea = [

            'Abastecimiento y Logística' => [
                'Abastecimiento',
                'Almacén / Depósito / Expedición',
                'Asistente de Tráfico',
                'Compras',
                'Distribución',
                'Logística',
                'Otra',
                'Transporte',
            ],

            'Administración, Contabilidad y Finanzas' => [
                'Administración',
                'Análisis de Riesgos',
                'Auditoría',
                'Consultoría',
                'Contabilidad',
                'Control de Gestión',
                'Banca de Inversión',
                'Créditos y Cobranzas',
                'Cuentas Corrientes',
                'Evaluación Económica',
                'Facturación',
                'Finanzas',
                'Finanzas Internacionales',
                'Impuestos',
                'Inversiones',
                'Operaciones',
                'Organización y Métodos',
                'Otra',
                'Planeamiento Económico y Financiero',
                'Tesorería',
            ],

            'Aduana y Comercio Exterior' => [
                'Apoderado Aduanal',
                'Compras Internacionales / Importación',
                'Consultoría de Comercio Exterior',
                'Otra',
                'Ventas Internacionales / Exportación',
            ],

            'Atención al Cliente, Call Center y Telemarketing' => [
                'Atención al Cliente',
                'Call Center',
                'Telemarketing',
                'Otra',
            ],

            'Comercial, Ventas y Negocios' => [
                'Comercial',
                'Comercio Exterior',
                'Desarrollo de Negocios',
                'Negocios Internacionales',
                'Otra',
                'Planeamiento Comercial',
                'Ventas',
            ],

            'Comunicación, Relaciones Institucionales y Públicas' => [
                'Comunicación',
                'Comunicación Externa',
                'Comunicación Interna',
                'Otra',
                'Periodismo',
                'Relaciones Institucionales / Públicas',
                'Responsabilidad Social',
            ],

            'Departamento Técnico' => [
                'Otra',
            ],

            'Diseño' => [
                'Diseño',
                'Diseño Gráfico',
                'Diseño Industrial',
                'Diseño Multimedia',
                'Diseño Textil',
                'Diseño Web',
                'Diseño de Interiores / Decoración',
                'Otra',
            ],

            'Educación, Docencia e Investigación' => [
                'Bienestar Estudiantil',
                'Educación Especial',
                'Educación / Docencia',
                'Idiomas',
                'Investigación y Desarrollo',
                'Otra',
                'Psicopedagogía',
            ],

            'Enfermería' => [
                'Emergencias',
                'Clínica Médica',
                'Consultorios',
                'Cuidados Intensivos',
                'Hemodinamia',
                'Internación General',
                'Internación Domiciliaria',
                'Maternidad',
                'Nefrología',
                'Oncología',
                'Otra',
                'Recién Nacido',
                'Recuperación',
                'Terapia Intermedia e Intensiva',
                'Vacunatorio',
            ],

            'Gastronomía y Turismo' => [
                'Camareros / Mozos',
                'Casinos',
                'Gastronomía',
                'Hotelería',
                'Otra',
                'Turismo',
            ],

            'Gerencia y Dirección General' => [
                'Dirección',
                'Gerencia',
                'Otra',
            ],

            'Construcción' => [
                'Arquitectura',
                'Construcción',
                'Dirección de Obra',
                'Ingeniería Civil',
                'Instrumentación',
                'Operaciones',
                'Otra',
                'Seguridad e Higiene',
                'Topografía',
                'Urbanismo',
            ],

            'Ingenierías' => [
                'Ingeniería Automotriz',
                'Ingeniería Eléctrica y Electrónica',
                'Ingeniería Industrial',
                'Ingeniería Mecánica',
                'Ingeniería Metalúrgica',
                'Ingeniería Textil',
                'Ingeniería Agronómica',
                'Ingeniería Electromecánica',
                'Proyecto',
                'Ingeniería Química',
                'Ingeniería de Procesos',
                'Ingeniería de Producto',
                'Ingeniería de Ventas',
                'Ingeniería en Alimentos',
                'Otras',
            ],

            'Legales' => [
                'Asesoría Legal Internacional',
                'Garantías',
                'Legal',
                'Otra',
            ],

            'Marketing y Publicidad' => [
                'Business Intelligence',
                'Community Management',
                'Creatividad',
                'E-commerce',
                'Marketing',
                'Media Planning',
                'Mercadotecnia Internacional',
                'Multimedia',
                'Otra',
                'Producto',
            ],

            'Minería, Petróleo y Gas' => [
                'Exploración Minera y Petroquímica',
                'Geología',
                'Ingeniería Geológica',
                'Ingeniería en Minas',
                'Ingeniería en Petróleo',
                'Petroquímica',
                'Instrumentación Minera',
                'Medio Ambiente',
                'Minería / Petróleo / Gas',
                'Otra',
            ],

            'Naviero, Marítimo y Portuario' => [
                'Otra',
            ],

            'Oficios y Otros' => [
                'Arte y Cultura',
                'Back Office',
                'Cadetería',
                'Caja',
                'Estética y Cuidado Personal',
                'Independiente',
                'Jóvenes Profesionales',
                'Mantenimiento y Limpieza',
                'Oficios y Profesiones',
                'Otra',
                'Otros',
                'Pasantía',
                'Promotor',
                'Seguridad',
                'Servicios',
                'Trabajo Social',
                'Traducción',
                'Transporte de Pasajeros',
            ],

            'Producción y Manufactura' => [
                'Calidad',
                'Mantenimiento',
                'Otra',
                'Producción',
                'Programación de Producción',
            ],

            'Recursos Humanos y Capacitación' => [
                'Administración de Personal',
                'Capacitación',
                'Compensación y Planilla',
                'Otra',
                'Recursos Humanos',
                'Selección y Entrevistas',
            ],

            'Salud, Medicina y Farmacia' => [
                'Anatomía Patológica (Técnicos)',
                'Anestesia',
                'Auditoría Médica',
                'Bioquímica',
                'Cosmiatría / Dermocosmiatría',
                'Diagnóstico por Imágenes',
                'Emergentología',
                'Enfermería',
                'Esterilización',
                'Farmacia Comercial',
                'Farmacia Hospitalaria',
                'Farmacia Industrial',
                'Farmacéutica',
                'Fonoaudiología',
                'Instrumentación Quirúrgica',
                'Kinesiología / Terapia Ocupacional',
                'Laboratorio',
                'Medicina',
                'Medicina Laboral',
                'Neurología',
                'Nutrición',
                'Odontología',
                'Otra',
                'Otra Especialidad',
                'Otras Áreas de Salud',
                'Prevención',
                'Prácticas Cardiológicas',
                'Psicología',
                'Química',
                'Salud',
                'Traslados',
                'Veterinaria',
            ],

            'Secretarías y Recepción' => [
                'Asistente',
                'Otra',
                'Recepcionista',
                'Secretaria',
                'Telefonista',
            ],

            'Seguros' => [
                'Técnico en Seguros',
                'Auditorías de Seguros',
                'Otra',
                'Seguros',
                'Venta de Seguros',
            ],

            'Sociología y Trabajo Social' => [
                'Técnico Estadístico',
                'Agente Sanitario',
                'Trabajo Social',
                'Otra',
            ],

            'Tecnología, Sistemas y Telecomunicaciones' => [
                'Administración de Base de Datos',
                'Análisis Funcional',
                'Análisis de Datos',
                'Data Entry',
                'Data Warehousing',
                'Infraestructura',
                'Internet',
                'Liderazgo de Proyecto',
                'Otra',
                'Programación',
                'Redes',
                'Seguridad Informática',
                'Sistemas',
                'Soporte Técnico',
                'Tecnología / Sistemas',
                'Tecnologías de la Información',
                'Telecomunicación',
                'Testing / QA / QC',
            ],
        ];

        DB::transaction(function () use ($subAreasPorArea) {

            foreach ($subAreasPorArea as $nombreArea => $subAreas) {

                $area = AreaLaboral::where('nombre', $nombreArea)->firstOrFail();

                foreach ($subAreas as $nombreSubArea) {

                    SubAreaLaboral::updateOrCreate(
                        [
                            'area_laboral_id' => $area->id,
                            'nombre' => $nombreSubArea,
                        ],
                        [
                            'estado' => true,
                        ]
                    );
                }
            }
        });
    }
}
