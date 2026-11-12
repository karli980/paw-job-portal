<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Empresa extends Model
{
    protected $table = 'empresas';

    protected $fillable = [
        'nombre_comercial',
        'razon_social',
        'cuit',
        'descripcion',
        'sitio_web',
        'logo',
        'pais_id',
        'provincia_id',
        'ciudad_id',
        'estado',
        'industria_id',
        'cantidad_de_empleados_id',
        'direccion',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }

    /**
     * Usuarios representantes de la empresa.
     */
    public function usuarios(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'empresa_usuario'
        )
            ->withPivot('rol', 'estado')
            ->withTimestamps();
    }

    /**
     * Testimonio de la empresa.
     */
    public function testimonio(): HasOne
    {
        return $this->hasOne(Testimonio::class);
    }

    /**
     * País donde está radicada la empresa.
     */
    public function pais(): BelongsTo
    {
        return $this->belongsTo(Pais::class, 'pais_id');
    }

    /**
     * Provincia de radicación.
     */
    public function provincia(): BelongsTo
    {
        return $this->belongsTo(Provincia::class, 'provincia_id');
    }

    /**
     * Ciudad de radicación.
     */
    public function ciudad(): BelongsTo
    {
        return $this->belongsTo(Ciudad::class, 'ciudad_id');
    }

    /**
     * Industria principal de la empresa.
     */
    public function industria(): BelongsTo
    {
        return $this->belongsTo(Industria::class, 'industria_id');
    }

    /**
     * Rango de cantidad de empleados.
     */
    public function cantidadDeEmpleados(): BelongsTo
    {
        return $this->belongsTo(
            CantidadDeEmpleados::class,
            'cantidad_de_empleados_id'
        );
    }

    /**
     * Redes sociales asociadas a la empresa.
     */
    public function redesSociales(): BelongsToMany
    {
        return $this->belongsToMany(
            RedSocial::class,
            'empresa_red_social',
            'empresa_id',
            'red_social_id'
        )
            ->withPivot([
                'id',
                'url_perfil',
                'estado',
            ])
            ->withTimestamps();
    }

    /**
     * Información de contacto institucional de la empresa.
     */
    public function contacto(): HasOne
    {
        return $this->hasOne(EmpresaContacto::class, 'empresa_id');
    }
}
