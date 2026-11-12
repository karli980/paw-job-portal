<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    /**
     * Listar administradores registrados.
     */
    public function index(Request $request): Response
    {
        $this->verificarSuperAdmin($request);

        $filtros = $request->validate([
            'buscar' => ['nullable', 'string', 'max:100'],
            'por_pagina' => [
                'nullable',
                Rule::in([5, 10, 20]),
            ],
        ]);

        $buscar = trim($filtros['buscar'] ?? '');
        $porPagina = (int) ($filtros['por_pagina'] ?? 10);

        $administradores = User::role('admin')
            ->whereDoesntHave('roles', function ($consulta) {
                $consulta->where('name', 'super-admin');
            })
            ->when($buscar !== '', function ($consulta) use ($buscar) {
                $consulta->where(function ($subconsulta) use ($buscar) {
                    $subconsulta
                        ->where('nombre', 'like', "%{$buscar}%")
                        ->orWhere('apellido', 'like', "%{$buscar}%")
                        ->orWhere('email', 'like', "%{$buscar}%");
                });
            })
            ->orderBy('nombre')
            ->orderBy('apellido')
            ->paginate($porPagina)
            ->withQueryString()
            ->through(fn (User $administrador) => [
                'id' => $administrador->id,
                'nombre' => $administrador->nombre,
                'apellido' => $administrador->apellido,
                'email' => $administrador->email,
                'estado' => $administrador->estado,
                'email_verificado' => $administrador->hasVerifiedEmail(),
            ]);

        return Inertia::render('Admin/Usuarios/Index', [
            'administradores' => $administradores,
            'filtros' => [
                'buscar' => $buscar,
                'por_pagina' => $porPagina,
            ],
        ]);
    }

    /**
     * Crear una nueva cuenta administrativa.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->verificarSuperAdmin($request);

        $datos = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
            ],
            'apellido' => [
                'required',
                'string',
                'max:100',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(12)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols(),
            ],
        ]);

        $administrador = DB::transaction(function () use ($datos) {
            $administrador = User::create([
                'nombre' => trim($datos['nombre']),
                'apellido' => trim($datos['apellido']),
                'email' => strtolower(trim($datos['email'])),
                'password' => $datos['password'],
                'password_configured' => true,
                'estado' => true,
            ]);

            // El nuevo usuario recibe exclusivamente el rol admin.
            $administrador->assignRole('admin');

            return $administrador;
        });

        /*
         * Enviar el correo de verificación.
         * El usuario deberá verificar su dirección de correo.
         */
        event(new Registered($administrador));

        return to_route('admin.usuarios.index')
            ->with(
                'success',
                'Administrador creado correctamente. Se solicitó la verificación de su correo electrónico.'
            );
    }

    /**
     * Actualizar los datos personales de un administrador.
     *
     * Solamente el superadministrador puede
     * realizar esta operación.
     */
    public function update(
        Request $request,
        User $usuario
    ): RedirectResponse {
        // Comprobar que quien realiza la operación
        // tenga el rol super-admin.
        $this->verificarSuperAdmin($request);

        // Solo se permite modificar cuentas admin.
        // No se pueden editar superadministradores
        // desde este módulo.
        abort_unless(
            $usuario->hasRole('admin') &&
            ! $usuario->hasRole('super-admin'),
            404,
            'Administrador no encontrado.'
        );

        // Validar los datos recibidos.
        $datos = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
            ],
            'apellido' => [
                'required',
                'string',
                'max:100',
            ],
        ]);

        // Actualizar solamente los campos permitidos.
        $usuario->update([
            'nombre' => trim($datos['nombre']),
            'apellido' => trim($datos['apellido']),
        ]);

        return back()->with(
            'success',
            'Los datos del administrador se actualizaron correctamente.'
        );

    }

    /**
     * Solo el Super Admin puede utilizar este módulo.
     */

    /**
     * Activar o desactivar una cuenta administrativa.
     *
     * Solamente el superadministrador puede
     * realizar esta operación.
     */
    public function toggleEstado(
        Request $request,
        User $usuario
    ): RedirectResponse {

        // Verificar autorización.
        $this->verificarSuperAdmin($request);

        // Solamente se administran cuentas con rol admin.
        // No permitir modificar superadministradores.
        abort_unless(
            $usuario->hasRole('admin') &&
            ! $usuario->hasRole('super-admin'),
            404,
            'Administrador no encontrado.'
        );

        // Impedir que el usuario modifique su
        // propia cuenta desde esta operación.
        abort_if(
            $usuario->id === $request->user()->id,
            403,
            'No podés modificar el estado de tu propia cuenta.'
        );

        // Invertir el estado actual.
        $nuevoEstado = ! $usuario->estado;

        $usuario->update([
            'estado' => $nuevoEstado,
        ]);

        // Mensaje de confirmación.
        $mensaje = $nuevoEstado
            ? 'Administrador activado correctamente.'
            : 'Administrador desactivado correctamente.';

        return back()->with(
            'success',
            $mensaje
        );
    }

    private function verificarSuperAdmin(Request $request): void
    {
        abort_unless(
            $request->user()?->hasRole('super-admin'),
            403,
            'No tenés autorización para gestionar administradores.'
        );
    }
}
