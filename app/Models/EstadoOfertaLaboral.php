<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoOfertaLaboral extends Model
{
    protected $table = 'estados_ofertas_laborales';

    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }

    public function ofertasLaborales(): HasMany
    {
        return $this->hasMany(OfertaLaboral::class, 'estado_oferta_id');
    }
}

