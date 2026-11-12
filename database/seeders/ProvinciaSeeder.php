<?php

namespace Database\Seeders;

use App\Models\Pais;
use Illuminate\Database\Seeder;

class ProvinciaSeeder extends Seeder
{
    public function run(): void
    {
        // Buscar Argentina por su código ISO
        $pais = Pais::where('codigo_iso', 'AR')->firstOrFail();

        $provincias = [
            'Buenos Aires',
            'Catamarca',
            'Chaco',
            'Chubut',
            'Córdoba',
            'Corrientes',
            'Entre Ríos',
            'Formosa',
            'Jujuy',
            'La Pampa',
            'La Rioja',
            'Mendoza',
            'Misiones',
            'Neuquén',
            'Río Negro',
            'Salta',
            'San Juan',
            'San Luis',
            'Santa Cruz',
            'Santa Fe',
            'Santiago del Estero',
            'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
            'Tucumán',
            'Ciudad Autónoma de Buenos Aires',
        ];

        foreach ($provincias as $nombre) {
            $pais->provincias()->updateOrCreate(
                ['nombre' => $nombre],
                ['estado' => true]
            );
        }
    }
}
