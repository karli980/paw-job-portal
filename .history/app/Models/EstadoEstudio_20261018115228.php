<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class EstadoEstudio extends Model
{
    protected $table = 'estado_estudios';

    protected $fillable = [
        'nombre',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }
}
