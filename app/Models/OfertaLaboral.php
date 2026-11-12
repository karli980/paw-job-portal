<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OfertaLaboral extends Model
{
    use SoftDeletes;

    protected $table = 'ofertas_laborales';

    protected $fillable = [
        'empresa_id',
        'titulo',
        'slug',
        'resumen',
        'descripcion',
        'responsabilidades',
        'requisitos',
        'area_laboral_id',
        'sub_area_laboral_id',
        'modalidad_trabajo_id',
        'experiencia_minima_anios',
        'vacantes',
        'pais_id',
        'provincia_id',
        'ciudad_id',
        'direccion_trabajo',
        'salario_minimo',
        'salario_maximo',
        'moneda_id',
        'periodicidad_salarial',
        'salario_visible',
        'salario_negociable',
        'apta_discapacidad',
        'informacion_accesibilidad',
        'identidad_empresa_visible',
        'es_urgente',
        'estado_oferta_id',
        'fecha_publicacion',
        'fecha_vencimiento',
    ];

    protected function casts(): array
    {
        return [
            'experiencia_minima_anios' => 'integer',
            'vacantes' => 'integer',
            'salario_minimo' => 'decimal:2',
            'salario_maximo' => 'decimal:2',
            'salario_visible' => 'boolean',
            'salario_negociable' => 'boolean',
            'apta_discapacidad' => 'boolean',
            'identidad_empresa_visible' => 'boolean',
            'es_urgente' => 'boolean',
            'fecha_publicacion' => 'datetime',
            'fecha_vencimiento' => 'datetime',
        ];
    }

    // Empresa que publica la oferta
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }

    // Estado actual de la oferta
    public function estadoOferta(): BelongsTo
    {
        return $this->belongsTo(
            EstadoOfertaLaboral::class,
            'estado_oferta_id'
        );
    }

    // Clasificación laboral
    public function areaLaboral(): BelongsTo
    {
        return $this->belongsTo(AreaLaboral::class);
    }

    public function subAreaLaboral(): BelongsTo
    {
        return $this->belongsTo(SubAreaLaboral::class);
    }

    public function modalidadTrabajo(): BelongsTo
    {
        return $this->belongsTo(
            ModalidadTrabajo::class,
            'modalidad_trabajo_id'
        );
    }

    // Ubicación laboral
    public function pais(): BelongsTo
    {
        return $this->belongsTo(Pais::class);
    }

    public function provincia(): BelongsTo
    {
        return $this->belongsTo(Provincia::class);
    }

    public function ciudad(): BelongsTo
    {
        return $this->belongsTo(Ciudad::class);
    }

    // Remuneración
    public function moneda(): BelongsTo
    {
        return $this->belongsTo(Moneda::class);
    }

    public function beneficios(): BelongsToMany
    {
        return $this->belongsToMany(
            Beneficio::class,
            'oferta_laboral_beneficio',
            'oferta_laboral_id',
            'beneficio_id'
        )->withTimestamps();
    }

    public function idiomas(): BelongsToMany
    {
        return $this->belongsToMany(
            Idioma::class,
            'oferta_laboral_idioma',
            'oferta_laboral_id',
            'idioma_id'
        )->withPivot([
            'nivel_lectura',
            'nivel_escritura',
            'nivel_oral',
            'obligatorio',
        ])->withTimestamps();
    }

    public function nivelesEstudio(): BelongsToMany
    {
        return $this->belongsToMany(
            NivelEstudio::class,
            'oferta_laboral_estudio',
            'oferta_laboral_id',
            'nivel_estudio_id'
        )->withPivot([
            'id',
            'area_estudio_id',
            'obligatorio',
        ])->withTimestamps();
    }
    public function historialEstados(): HasMany
{
    return $this->hasMany(
        HistorialEstadoOferta::class,
        'oferta_laboral_id'
    )->orderBy('created_at', 'desc')->orderBy('id', 'desc');
}
}
