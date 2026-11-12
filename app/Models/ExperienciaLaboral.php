<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExperienciaLaboral extends Model
{
    use HasFactory;

    protected $table = 'experiencias_laborales';

    protected $fillable = [
        'candidato_id',
        'sub_area_laboral_id',
        'nombre_empleador',
        'puesto',
        'fecha_inicio',
        'fecha_finalizacion',
        'trabaja_actualmente',
        'responsabilidades',
        'personas_a_cargo',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_finalizacion' => 'date',
            'trabaja_actualmente' => 'boolean',
            'personas_a_cargo' => 'integer',
            'estado' => 'boolean',
        ];
    }

    public function candidato(): BelongsTo
    {
        return $this->belongsTo(Candidato::class, 'candidato_id');
    }

    public function subAreaLaboral(): BelongsTo
    {
        return $this->belongsTo(SubAreaLaboral::class, 'sub_area_laboral_id');
    }
}
