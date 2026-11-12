<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Moneda extends Model
{
    use HasFactory;

    protected $table = 'monedas';

    protected $fillable = [
        'nombre',
        'simbolo',
        'codigo',
        'estado',
    ];

    /**
     * Salarios pretendidos asociados a esta moneda.
     */
    public function salariosPretendidos(): HasMany
    {
        return $this->hasMany(
            SalarioPretendido::class,
            'moneda_id'
        );
    }
}
