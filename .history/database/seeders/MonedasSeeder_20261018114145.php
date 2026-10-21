<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MonedasSeeder extends Seeder
{
    public function run(): void
    {
        // Nombre => [símbolo, código ISO 4217]
        $monedas = [
            'Peso argentino' => ['$ ', 'ARS'],
            'Dólar estadounidense' => ['US$', 'USD'],
            'Euro' => ['€', 'EUR'],
            'Real brasileño' => ['R$', 'BRL'],
            'Peso chileno' => ['CLP$', 'CLP'],
            'Peso uruguayo' => ['$U', 'UYU'],
            'Guaraní paraguayo' => ['₲', 'PYG'],
            'Boliviano' => ['Bs.', 'BOB'],
            'Sol peruano' => ['S/', 'PEN'],
            'Peso mexicano' => ['MX$', 'MXN'],
            'Peso colombiano' => ['COL$', 'COP'],
            'Dólar canadiense' => ['CA$', 'CAD'],
            'Dólar australiano' => ['A$', 'AUD'],
            'Libra esterlina' => ['£', 'GBP'],
            'Franco suizo' => ['CHF', 'CHF'],
            'Yen japonés' => ['¥', 'JPY'],
            'Yuan chino' => ['CN¥', 'CNY'],
            'Rupia india' => ['₹', 'INR'],
            'Won surcoreano' => ['₩', 'KRW'],
            'Rublo ruso' => ['₽', 'RUB'],
            'Rand sudafricano' => ['R', 'ZAR'],
            'Corona sueca' => ['kr', 'SEK'],
            'Corona noruega' => ['kr', 'NOK'],
            'Corona danesa' => ['kr', 'DKK'],
            'Zloty polaco' => ['zł', 'PLN'],
            'Lira turca' => ['₺', 'TRY'],
            'Dirham de Emiratos Árabes Unidos' => ['د.إ', 'AED'],
            'Riyal saudí' => ['ر.س', 'SAR'],
            'Dólar de Singapur' => ['S$', 'SGD'],
            'Dólar de Hong Kong' => ['HK$', 'HKD'],
            'Dólar neozelandés' => ['NZ$', 'NZD'],
            'Baht tailandés' => ['฿', 'THB'],
            'Rupia indonesia' => ['Rp', 'IDR'],
            'Ringgit malasio' => ['RM', 'MYR'],
            'Dong vietnamita' => ['₫', 'VND'],
            'Nuevo dólar taiwanés' => ['NT$', 'TWD'],
            'Libra egipcia' => ['E£', 'EGP'],
            'Shekel israelí' => ['₪', 'ILS'],
            'Franco CFA de África Occidental' => ['CFA', 'XOF'],
            'Franco CFA de África Central' => ['FCFA', 'XAF'],
        ];

        $ahora = now();
        $registros = [];

        foreach ($monedas as $nombre => [$simbolo, $codigo]) {
            $registros[] = [
                'nombre' => $nombre,
                'simbolo' => trim($simbolo),
                'codigo' => $codigo,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ];
        }

        DB::table('monedas')->upsert(
            $registros,
            ['codigo'],
            ['nombre', 'simbolo', 'updated_at']
        );

        $this->command?->info(
            count($registros) . ' monedas procesadas correctamente.'
        );
    }
}
