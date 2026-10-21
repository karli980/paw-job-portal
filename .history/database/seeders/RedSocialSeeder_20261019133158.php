<?php

namespace Database\Seeders;

use App\Models\RedSocial;
use Illuminate\Database\Seeder;

class RedSocialSeeder extends Seeder
{
    public function run(): void
    {
        $redes = [
            [
                'nombre' => 'LinkedIn',
                'url' => 'https://www.linkedin.com/',
                'icono' => 'linkedin',
                'estado' => true,
            ],
            [
                'nombre' => 'Facebook',
                'url' => 'https://www.facebook.com/',
                'icono' => 'facebook',
                'estado' => true,
            ],
            [
                'nombre' => 'Instagram',
                'url' => 'https://www.instagram.com/',
                'icono' => 'instagram',
                'estado' => true,
            ],
            [
                'nombre' => 'YouTube',
                'url' => 'https://www.youtube.com/',
                'icono' => 'youtube',
                'estado' => true,
            ],
            [
                'nombre' => 'X',
                'url' => 'https://x.com/',
                'icono' => 'twitter',
                'estado' => true,
            ],
        ];

        foreach ($redes as $red) {
            RedSocial::updateOrCreate(
                ['nombre' => $red['nombre']],
                [
                    'url' => $red['url'],
                    'icono' => $red['icono'],
                    'estado' => $red['estado'],
                ]
            );
        }
    }
}
