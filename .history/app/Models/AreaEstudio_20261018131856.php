<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AreaEstudio extends Model
{
    protected $table = 'areas_estudio';

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
