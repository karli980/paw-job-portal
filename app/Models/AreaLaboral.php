<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AreaLaboral extends Model
{
    use HasFactory;

    protected $table = 'areas_laborales';

    protected $fillable = [
        'nombre',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }

    public function subAreasLaborales(): HasMany
    {
        return $this->hasMany(SubAreaLaboral::class, 'area_laboral_id');
    }
}
