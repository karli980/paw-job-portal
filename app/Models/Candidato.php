<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Candidato extends Model
{
    protected $table = 'candidatos';

    protected $fillable = [
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function idiomas(): BelongsToMany
    {
        return $this->belongsToMany(
            Idioma::class,
            'candidato_idioma',
            'candidato_id',
            'idioma_id'
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

    /**
     * Experiencias laborales del candidato.
     */
    public function experienciasLaborales(): HasMany
    {
        return $this->hasMany(
            ExperienciaLaboral::class,
            'candidato_id'
        );
    }

    /**
     * Estudios académicos del candidato.
     */
    public function estudios(): HasMany
    {
        return $this->hasMany(
            Estudio::class,
            'candidato_id'
        );
    }

    /**
     * Salario pretendido del candidato.
     */
    public function salarioPretendido(): HasOne
    {
        return $this->hasOne(
            SalarioPretendido::class,
            'candidato_id'
        );
    }

    /**
     * Testimonio del candidato.
     */
    public function testimonio(): HasOne
    {
        return $this->hasOne(Testimonio::class);
    }
}
