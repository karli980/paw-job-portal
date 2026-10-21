<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CantidadDeEmpleados extends Model
{
    protected $table = 'cantidad_de_empleados';

    protected $fillable = [
        'nombre',
        'minimo',
        'maximo',
    ];

    protected function casts(): array
    {
        return [
            'minimo' => 'integer',
            'maximo' => 'integer',
        ];
    }

   
}
