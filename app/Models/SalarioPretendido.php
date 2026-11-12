<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalarioPretendido extends Model
{
    protected $table = 'salarios_pretendidos';

    protected $fillable = [
        'candidato_id',
        'monto',
        'moneda_id',
        'visible',
        'negociable',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'monto' => 'decimal:2',
            'visible' => 'boolean',
            'negociable' => 'boolean',
            'estado' => 'boolean',
        ];
    }

    /**
     * Candidato propietario del salario pretendido.
     */
    public function candidato(): BelongsTo
    {
        return $this->belongsTo(
            Candidato::class,
            'candidato_id'
        );
    }

    /**
     * Moneda del salario pretendido.
     */
    public function moneda(): BelongsTo
    {
        return $this->belongsTo(
            Moneda::class,
            'moneda_id'
        );
    }
}
