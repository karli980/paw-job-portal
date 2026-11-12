<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonio extends Model
{
    protected $table = 'testimonios';

    protected $fillable = [
        'user_id',
        'candidato_id',
        'empresa_id',
        'mensaje',
        'consentimiento',
        'consentimiento_at',
        'consentimiento_revocado_at',
        'estado',
        'destacado',
    ];

    protected function casts(): array
    {
        return [
            'consentimiento' => 'boolean',
            'consentimiento_at' => 'datetime',
            'consentimiento_revocado_at' => 'datetime',
            'estado' => 'boolean',
            'destacado' => 'boolean',
        ];
    }

    /**
     * Usuario que registró el testimonio.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Perfil del candidato.
     */
    public function candidato(): BelongsTo
    {
        return $this->belongsTo(Candidato::class);
    }

    /**
     * Empresa a la que pertenece.
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class);
    }
}
