<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'nombre',
    'codigo_postal',
    'estado',
    'provincia_id',
])]
class Ciudad extends Model
{
    use HasFactory;

    protected $table = 'ciudades';

    public function provincia(): BelongsTo
    {
        return $this->belongsTo(Provincia::class);
    }
}
