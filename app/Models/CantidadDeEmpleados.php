<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CantidadDeEmpleados extends Model
{
    use HasFactory;

    protected $table = 'cantidad_de_empleados';

    protected $fillable = [
        'nombre',
        'minimo',
        'maximo',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'minimo' => 'integer',
            'maximo' => 'integer',
            'estado' => 'boolean',
        ];
    }
}
