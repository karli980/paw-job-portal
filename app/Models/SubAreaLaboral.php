<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class SubAreaLaboral extends Model
{
    use HasFactory;

    protected $table = 'sub_areas_laborales';

    protected $fillable = [
        'area_laboral_id',
        'nombre',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }

    /**
     * Obtener el área laboral a la que pertenece.
     */
    public function areaLaboral(): BelongsTo
    {
        return $this->belongsTo(AreaLaboral::class);
    }

    /**
     * Experiencias laborales clasificadas en esta subárea.
     */
    public function experienciasLaborales(): HasMany
    {
        return $this->hasMany(
            ExperienciaLaboral::class,
            'sub_area_laboral_id'
        );
    }
}
