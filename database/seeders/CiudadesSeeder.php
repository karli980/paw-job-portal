<?php

namespace Database\Seeders;

use App\Models\Ciudad;
use App\Models\Provincia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

class CiudadesSeeder extends Seeder
{
    public function run(): void
    {
        $localidades = [
            'Buenos Aires' => [
                'La Plata',
                'Mar del Plata',
                'Bahía Blanca',
                'Tandil',
                'Olavarría',
                'Pergamino',
                'Junín',
                'Necochea',
                'San Nicolás de los Arroyos',
                'Zárate',
            ],

            'Catamarca' => [
                'San Fernando del Valle de Catamarca',
                'Andalgalá',
                'Belén',
                'Tinogasta',
                'Santa María',
                'Recreo',
                'Fiambalá',
                'Santa Rosa',
                'Pomán',
                'El Rodeo',
            ],

            'Chaco' => [
                'Resistencia',
                'Presidencia Roque Sáenz Peña',
                'Villa Ángela',
                'Charata',
                'General José de San Martín',
                'Quitilipi',
                'Juan José Castelli',
                'Machagai',
                'Barranqueras',
                'Fontana',
            ],

            'Chubut' => [
                'Rawson',
                'Comodoro Rivadavia',
                'Trelew',
                'Puerto Madryn',
                'Esquel',
                'Sarmiento',
                'Gaiman',
                'Rada Tilly',
                'Dolavon',
                'El Maitén',
            ],

            'Córdoba' => [
                'Córdoba',
                'Río Cuarto',
                'Villa María',
                'San Francisco',
                'Villa Carlos Paz',
                'Alta Gracia',
                'Río Tercero',
                'Bell Ville',
                'Jesús María',
                'Villa Dolores',
            ],

            'Corrientes' => [
                'Corrientes',
                'Goya',
                'Paso de los Libres',
                'Mercedes',
                'Curuzú Cuatiá',
                'Santo Tomé',
                'Bella Vista',
                'Esquina',
                'Monte Caseros',
                'Ituzaingó',
            ],

            'Entre Ríos' => [
                'Paraná',
                'Concordia',
                'Gualeguaychú',
                'Concepción del Uruguay',
                'Gualeguay',
                'Villaguay',
                'Victoria',
                'Chajarí',
                'La Paz',
                'Colón',
            ],

            'Formosa' => [
                'Formosa',
                'Clorinda',
                'Pirané',
                'El Colorado',
                'Ingeniero Juárez',
                'Las Lomitas',
                'Ibarreta',
                'Laguna Blanca',
                'Comandante Fontana',
                'General Belgrano',
            ],

            'Jujuy' => [
                'San Salvador de Jujuy',
                'Palpalá',
                'San Pedro de Jujuy',
                'Libertador General San Martín',
                'Perico',
                'La Quiaca',
                'Humahuaca',
                'Tilcara',
                'El Carmen',
                'Abra Pampa',
            ],

            'La Pampa' => [
                'Santa Rosa',
                'General Pico',
                'Toay',
                'General Acha',
                'Eduardo Castex',
                'Realicó',
                'Intendente Alvear',
                'Victorica',
                '25 de Mayo',
                'Macachín',
            ],

            'La Rioja' => [
                'La Rioja',
                'Chilecito',
                'Aimogasta',
                'Chamical',
                'Chepes',
                'Villa Unión',
                'Famatina',
                'Olta',
                'Villa Santa Rita de Catuna',
                'Nonogasta',
            ],

            'Mendoza' => [
                'Mendoza',
                'San Rafael',
                'Godoy Cruz',
                'Guaymallén',
                'Las Heras',
                'Maipú',
                'Luján de Cuyo',
                'Tunuyán',
                'San Martín',
                'General Alvear',
            ],

            'Misiones' => [
                'Posadas',
                'Oberá',
                'Eldorado',
                'Puerto Iguazú',
                'Apóstoles',
                'Leandro N. Alem',
                'Puerto Rico',
                'Montecarlo',
                'Jardín América',
                'San Vicente',
            ],

            'Neuquén' => [
                'Neuquén',
                'San Martín de los Andes',
                'Villa La Angostura',
                'Cutral Có',
                'Plaza Huincul',
                'Zapala',
                'Centenario',
                'Plottier',
                'Junín de los Andes',
                'Chos Malal',
            ],

            'Río Negro' => [
                'Viedma',
                'San Carlos de Bariloche',
                'General Roca',
                'Cipolletti',
                'Villa Regina',
                'El Bolsón',
                'Allen',
                'Choele Choel',
                'San Antonio Oeste',
                'Catriel',
            ],

            'Salta' => [
                'Salta',
                'San Ramón de la Nueva Orán',
                'Tartagal',
                'Metán',
                'Cafayate',
                'General Güemes',
                'Rosario de la Frontera',
                'Embarcación',
                'Pichanal',
                'Rosario de Lerma',
            ],

            'San Juan' => [
                'San Juan',
                'Rawson',
                'Rivadavia',
                'Chimbas',
                'Santa Lucía',
                'Pocito',
                'Caucete',
                'Jáchal',
                'San José de Jáchal',
                'Villa Media Agua',
            ],

            'San Luis' => [
                'San Luis',
                'Villa Mercedes',
                'Merlo',
                'La Punta',
                'Juana Koslay',
                'Justo Daract',
                'Quines',
                'Tilisarao',
                'Concarán',
                'Santa Rosa del Conlara',
            ],

            'Santa Cruz' => [
                'Río Gallegos',
                'Caleta Olivia',
                'El Calafate',
                'Pico Truncado',
                'Puerto Deseado',
                'Las Heras',
                'Puerto San Julián',
                'Río Turbio',
                '28 de Noviembre',
                'Perito Moreno',
            ],

            'Santa Fe' => [
                'Santa Fe',
                'Rosario',
                'Rafaela',
                'Venado Tuerto',
                'Reconquista',
                'Villa Gobernador Gálvez',
                'Santo Tomé',
                'Esperanza',
                'Casilda',
                'Cañada de Gómez',
            ],

            'Santiago del Estero' => [
                'Santiago del Estero',
                'La Banda',
                'Termas de Río Hondo',
                'Añatuya',
                'Frías',
                'Fernández',
                'Quimilí',
                'Loreto',
                'Monte Quemado',
                'Bandera',
            ],

            'Tierra del Fuego, Antártida e Islas del Atlántico Sur' => [
                'Ushuaia',
                'Río Grande',
                'Tolhuin',
            ],

            'Tucumán' => [
                'San Miguel de Tucumán',
                'Yerba Buena',
                'Tafí Viejo',
                'Concepción',
                'Banda del Río Salí',
                'Famaillá',
                'Monteros',
                'Aguilares',
                'Lules',
                'Bella Vista',
            ],

            'Ciudad Autónoma de Buenos Aires' => [
                'Palermo',
                'Belgrano',
                'Caballito',
                'Recoleta',
                'Villa Urquiza',
                'Flores',
                'Almagro',
                'Villa Devoto',
                'Barracas',
                'San Telmo',
            ],
        ];

        // Normalizamos los nombres para evitar problemas
        // con mayúsculas, tildes y espacios.
        $normalizar = fn (string $nombre) =>
            Str::lower(Str::ascii(trim($nombre)));

        $provincias = Provincia::query()
            ->get(['id', 'nombre'])
            ->keyBy(fn (Provincia $provincia) =>
                $normalizar($provincia->nombre)
            );

        foreach ($localidades as $nombreProvincia => $ciudades) {
            $clave = $normalizar($nombreProvincia);
            $provincia = $provincias->get($clave);

            if (! $provincia) {
                throw new RuntimeException(
                    "No se encontró la provincia: {$nombreProvincia}. "
                    . 'Verificá su nombre en la tabla provincias.'
                );
            }

            foreach ($ciudades as $nombreCiudad) {
                Ciudad::firstOrCreate(
                    [
                        'nombre' => $nombreCiudad,
                        'provincia_id' => $provincia->id,
                    ],
                    [
                        'codigo_postal' => null,
                        'estado' => true,
                    ]
                );
            }
        }
    }
}

