<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AreaLaboral extends Model
{
    protected $table = 'areas_laborales';

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
