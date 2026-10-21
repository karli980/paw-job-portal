<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Reglas de validación para el perfil del usuario.
     *
     * @return array<string, array<int, ValidationRule|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'email' => $this->emailRules($userId),
        ];
    }

    /**
     * Reglas para validar el correo electrónico.
     *
     * @return array<int, ValidationRule|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class, 'email')
                : Rule::unique(User::class, 'email')->ignore($userId),
        ];
    }
}
