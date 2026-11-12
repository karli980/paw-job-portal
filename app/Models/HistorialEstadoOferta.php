<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistorialEstadoOferta extends Model
{
    protected $table = 'historial_estados_ofertas';

    protected $fillable = [
        'oferta_laboral_id',
        'estado_anterior_id',
        'estado_nuevo_id',
        'user_id',
        'motivo',
    ];

    public function ofertaLaboral(): BelongsTo
    {
        return $this->belongsTo(
            OfertaLaboral::class,
            'oferta_laboral_id'
        );
    }

    public function estadoAnterior(): BelongsTo
    {
        return $this->belongsTo(
            EstadoOfertaLaboral::class,
            'estado_anterior_id'
        );
    }

    public function estadoNuevo(): BelongsTo
    {
        return $this->belongsTo(
            EstadoOfertaLaboral::class,
            'estado_nuevo_id'
        );
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
