<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nombre', 'estado'])]
class CategoriaHabilidad extends Model
{
    protected $table = 'categorias_habilidades';

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }

    public function destrezas(): HasMany
    {
        return $this->hasMany(Destreza::class, 'categoria_habilidad_id');
    }
}

