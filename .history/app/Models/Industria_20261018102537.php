<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Industria extends Model
{
    protected $table = 'industrias';

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
