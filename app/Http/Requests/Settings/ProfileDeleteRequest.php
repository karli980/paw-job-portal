<?php

namespace App\Http\Requests\Settings;

use App\Concerns\PasswordValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileDeleteRequest extends FormRequest
{
    use PasswordValidationRules;

    /**
     * Determinar si el usuario autenticado
     * puede eliminar su propia cuenta.
     *
     * Solo se permite a candidatos que no
     * tengan roles administrativos o empresariales.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        // Verificar que exista un usuario autenticado.
        if (! $user) {
            return false;
        }

        // Roles que no pueden eliminar su cuenta.
        $rolesProtegidos = [
            'super-admin',
            'admin',
            'moderador',
            'representante_empresa',
        ];

        // Bloquear cuentas administrativas
        // y representantes de empresas.
        if ($user->hasAnyRole($rolesProtegidos)) {
            return false;
        }

        // Permitir únicamente candidatos.
        return $user->hasRole('candidato');
    }

    /**
     * Validar los datos necesarios para
     * confirmar la eliminación.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'password' => $this->currentPasswordRules(),
        ];
    }
}
