<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Habilidad extends Model
{
    use HasFactory;
    
    protected $table = 'habilidades';

    protected $fillable = [
        'nombre',
        'categoria',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }


}
