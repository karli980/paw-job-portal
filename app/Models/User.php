<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $nombre
 * @property string|null $apellido
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property bool $password_configured
 * @property string|null $imagen
 * @property string|null $telefono
 * @property bool $estado
 * @property int|null $pais_id
 * @property int|null $provincia_id
 * @property int|null $ciudad_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'nombre',
    'apellido',
    'email',
    'imagen',
    'telefono',
    'password',
    'password_configured',
    'estado',
    'pais_id',
    'provincia_id',
    'ciudad_id',
])]
#[Hidden([
    'password',
    'password_configured',
    'two_factor_secret',
    'two_factor_recovery_codes',
    'remember_token',
])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * Obtener los atributos convertidos a tipos nativos.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
            'password' => 'hashed',
            'password_configured' => 'boolean',
            'estado' => 'boolean',
        ];
    }

    /**
     * País de residencia del usuario.
     */
    public function pais(): BelongsTo
    {
        return $this->belongsTo(Pais::class);
    }

    /**
     * Provincia de residencia del usuario.
     */
    public function provincia(): BelongsTo
    {
        return $this->belongsTo(Provincia::class);
    }

    /**
     * Ciudad de residencia del usuario.
     */
    public function ciudad(): BelongsTo
    {
        return $this->belongsTo(Ciudad::class);
    }

    /**
     * Perfil profesional del candidato.
     */
    public function candidato(): HasOne
    {
        return $this->hasOne(Candidato::class);
    }

    /**
     * Empresas vinculadas al usuario y sus permisos.
     */
    public function empresas(): BelongsToMany
    {
        return $this->belongsToMany(Empresa::class, 'empresa_usuario')
            ->withPivot('rol', 'estado')
            ->withTimestamps();
    }

    /**
     * Identidades sociales vinculadas al usuario.
     */
    public function socialAccounts(): HasMany
    {
        return $this->hasMany(SocialAccount::class);
    }

    /**
     * Testimonios enviados por el usuario.
     */
    public function testimonios(): HasMany
    {
        return $this->hasMany(Testimonio::class);
    }
}
