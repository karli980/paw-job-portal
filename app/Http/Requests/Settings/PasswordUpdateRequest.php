<?php

namespace App\Http\Requests\Settings;

use App\Concerns\PasswordValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class PasswordUpdateRequest extends FormRequest
{
    use PasswordValidationRules;

    public function rules(): array
    {
        $rules = [
            'password' => $this->passwordRules(),
        ];

        if ($this->user()->password_configured) {
            $rules['current_password'] = $this->currentPasswordRules();
        }

        return $rules;
    }
}
