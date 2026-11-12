<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Estudio extends Model
{
    use HasFactory;

    protected $table = 'estudios';

    protected $fillable = [
        'candidato_id',
        'pais_id',
        'estado_estudio_id',
        'area_estudio_id',
        'nivel_estudio_id',
        'titulo',
        'institucion',
        'fecha_inicio',
        'fecha_finalizacion',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_finalizacion' => 'date',
            'estado' => 'boolean',
        ];
    }

    /**
     * Candidato propietario del estudio.
     */
    public function candidato(): BelongsTo
    {
        return $this->belongsTo(Candidato::class);
    }

    /**
     * País donde se realizó el estudio.
     */
    public function pais(): BelongsTo
    {
        return $this->belongsTo(Pais::class);
    }

    /**
     * Estado académico del estudio.
     */
    public function estadoEstudio(): BelongsTo
    {
        return $this->belongsTo(EstadoEstudio::class);
    }

    /**
     * Área de conocimiento.
     */
    public function areaEstudio(): BelongsTo
    {
        return $this->belongsTo(AreaEstudio::class);
    }

    /**
     * Nivel académico.
     */
    public function nivelEstudio(): BelongsTo
    {
        return $this->belongsTo(NivelEstudio::class);
    }
}

