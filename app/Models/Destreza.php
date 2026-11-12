<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Destreza extends Model
{
    protected $table = 'destrezas';

    protected $fillable = [
        'categoria_habilidad_id',
        'nombre',
        'descripcion',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }

    public function categoriaHabilidad(): BelongsTo
    {
        return $this->belongsTo(CategoriaHabilidad::class, 'categoria_habilidad_id');
    }
}

