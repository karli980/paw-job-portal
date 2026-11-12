<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Idioma extends Model
{
    use HasFactory;

    protected $table = 'idiomas';

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

    public function candidatos(): BelongsToMany
    {
        return $this->belongsToMany(
            Candidato::class,
            'candidato_idioma',
            'idioma_id',
            'candidato_id'
        )
            ->withPivot([
                'id',
                'nivel_lectura',
                'nivel_escritura',
                'nivel_oral',
                'estado',
            ])
            ->wherePivot('estado', true)
            ->withTimestamps();
    }
}
