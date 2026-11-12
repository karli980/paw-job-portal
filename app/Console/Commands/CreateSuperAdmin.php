<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class CreateSuperAdmin extends Command
{
    /**
     * Nombre del comando.
     */
    protected $signature = 'app:create-super-admin';

    /**
     * Descripción.
     */
    protected $description = 'Crear el primer superadministrador de Talent Match';

    /**
     * Ejecutar el comando.
     */
    public function handle(): int
    {
        $this->info('======================================');
        $this->info(' CREAR SUPERADMINISTRADOR - TALENT MATCH');
        $this->info('======================================');

        // Solicitar datos personales.
        $nombre = $this->ask('Nombre');

        $apellido = $this->ask('Apellido');

        $email = $this->ask('Correo electrónico');

        // Validar los datos ingresados.
        $validator = Validator::make([
            'nombre' => $nombre,
            'apellido' => $apellido,
            'email' => $email,
        ], [
            'nombre' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        // Solicitar contraseña sin mostrarla en pantalla.
        $password = $this->secret('Ingresá una contraseña');

        $passwordConfirmation = $this->secret('Confirmá la contraseña');

        if (empty($password) || $password !== $passwordConfirmation) {
            $this->error('Las contraseñas están vacías o no coinciden.');

            return self::FAILURE;
        }

        if (strlen($password) < 8) {
            $this->error('La contraseña debe tener al menos 8 caracteres.');

            return self::FAILURE;
        }

        // Obtener el rol super-admin.
        $rol = Role::where('name', 'super-admin')
            ->where('guard_name', 'web')
            ->first();

        if (!$rol) {
            $this->error('No existe el rol super-admin.');
            $this->line('Ejecutá primero RolesAndPermissionsSeeder.');

            return self::FAILURE;
        }

        // Crear el usuario y asignar el rol en una transacción.
        try {
            $usuario = \DB::transaction(function () use (
                $nombre,
                $apellido,
                $email,
                $password,
                $rol
            ) {
                $usuario = User::create([
                    'nombre' => $nombre,
                    'apellido' => $apellido,
                    'email' => $email,
                    'password' => Hash::make($password),
                    'password_configured' => true,
                    'estado' => true,
                    'email_verified_at' => now(),
                ]);

                $usuario->assignRole($rol);

                return $usuario;
            });
        } catch (\Throwable $exception) {
            report($exception);

            $this->error('No se pudo crear el superadministrador.');
            $this->line('Revisá el registro de errores de Laravel.');

            return self::FAILURE;
        }

        $this->newLine();

        $this->info('¡Superadministrador creado correctamente!');

        $this->table(
            ['Dato', 'Valor'],
            [
                ['ID', $usuario->id],
                ['Nombre', $usuario->nombre . ' ' . $usuario->apellido],
                ['Correo', $usuario->email],
                ['Rol', 'super-admin'],
                ['Estado', 'Activo'],
                ['Correo verificado', 'Sí'],
            ]
        );

        return self::SUCCESS;
    }
}
