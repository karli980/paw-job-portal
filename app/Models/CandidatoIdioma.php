<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidatoIdioma extends Model
{
    protected $table = 'candidato_idioma';

    protected $fillable = [
        'candidato_id',
        'idioma_id',
        'nivel_lectura',
        'nivel_escritura',
        'nivel_oral',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }

    public function candidato(): BelongsTo
    {
        return $this->belongsTo(Candidato::class);
    }

    public function idioma(): BelongsTo
    {
        return $this->belongsTo(Idioma::class);
    }
}
