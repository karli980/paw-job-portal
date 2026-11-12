<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NivelHabilidad extends Model
{
    protected $table = 'niveles_habilidades';

    protected $fillable = [
        'nombre',
        'porcentaje',
        'descripcion',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'porcentaje' => 'integer',
            'estado' => 'boolean',
        ];
    }
}
