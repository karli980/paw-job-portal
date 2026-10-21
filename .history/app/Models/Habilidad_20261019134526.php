<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Habilidad extends Model
{
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

    public function candidatos(): BelongsToMany
    {
        return $this->belongsToMany(
            Candidato::class,
            'candidato_habilidad'
        )->withPivot('nivel')->withTimestamps();
    }
}
