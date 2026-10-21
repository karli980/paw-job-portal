<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Beneficio extends Model
{
    
    protected $table = 'beneficios';

    protected $fillable = [
        'nombre',
        'descripcion',
        'icono',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }
}
