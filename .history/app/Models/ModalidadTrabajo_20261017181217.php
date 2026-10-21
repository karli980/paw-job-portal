
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModalidadTrabajo extends Model
{
    protected $table = 'modalidades_trabajo';

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

