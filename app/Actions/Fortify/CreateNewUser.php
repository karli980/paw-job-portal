<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Models\Candidato;
use App\Models\Empresa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validar y crear una cuenta de candidato o empresa.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input): User
    {
        $tipo = $input['tipo'] ?? null;

        if ($tipo === 'candidato') {
            return $this->crearCandidato($input);
        }

        if ($tipo === 'empresa') {
            return $this->crearEmpresa($input);
        }

        Validator::make($input, [
            'tipo' => ['required', 'in:candidato,empresa'],
        ])->validate();

        throw new \InvalidArgumentException('Tipo de cuenta no válido.');
    }

    /**
     * Crear una cuenta de candidato.
     *
     * @param  array<string, mixed>  $input
     */
    private function crearCandidato(array $input): User
    {
        Validator::make($input, [
            'tipo' => ['required', 'in:candidato'],

            'nombre' => ['required', 'string', 'max:255'],

            'apellido' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => $this->passwordRules(),
        ])->validate();

        return DB::transaction(function () use ($input) {

            // Crear usuario candidato.
            $user = User::create([
                'nombre' => $input['nombre'],
                'apellido' => $input['apellido'],
                'email' => $input['email'],
                'password' => $input['password'],
                'password_configured' => true,
                'estado' => true,
            ]);

            // Crear su perfil de candidato.
            Candidato::create([
                'user_id' => $user->id,
            ]);

            return $user;
        });
    }

    /**
     * Crear una cuenta empresarial.
     *
     * @param  array<string, mixed>  $input
     */
    private function crearEmpresa(array $input): User
    {
        Validator::make($input, [
            'tipo' => ['required', 'in:empresa'],

            // Datos del responsable.
            'nombre' => ['required', 'string', 'max:255'],

            'apellido' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'telefono' => ['nullable', 'string', 'max:30'],

            // Datos de la empresa.
            'nombre_comercial' => [
                'required',
                'string',
                'max:150',
            ],

            'razon_social' => [
                'nullable',
                'string',
                'max:200',
            ],

            'cuit' => [
                'nullable',
                'digits:11',
                Rule::unique('empresas', 'cuit'),
            ],

            'descripcion' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'sitio_web' => [
                'nullable',
                'url',
                'max:255',
            ],

            // Contraseña.
            'password' => $this->passwordRules(),
        ])->validate();

        return DB::transaction(function () use ($input) {

            // Crear responsable de la empresa.
            $user = User::create([
                'nombre' => $input['nombre'],
                'apellido' => $input['apellido'],
                'email' => $input['email'],
                'telefono' => $input['telefono'] ?? null,
                'password' => $input['password'],
                'password_configured' => true,
                'estado' => true,
            ]);

            // Crear empresa.
            $empresa = Empresa::create([
                'nombre_comercial' => $input['nombre_comercial'],
                'razon_social' => $input['razon_social'] ?? null,
                'cuit' => $input['cuit'] ?? null,
                'descripcion' => $input['descripcion'] ?? null,
                'sitio_web' => $input['sitio_web'] ?? null,
                'estado' => true,
            ]);

            // Vincular responsable con la empresa.
            $empresa->usuarios()->attach($user->id, [
                'rol' => 'admin',
                'estado' => true,
            ]);

            // Asignar rol global de Spatie.
            $user->assignRole('representante_empresa');

            return $user;
        });
    }
}
