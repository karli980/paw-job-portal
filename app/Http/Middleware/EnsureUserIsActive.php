<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Verificar que el usuario autenticado
     * tenga su cuenta activa en Talent Match.
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        // Obtener el usuario autenticado.
        $usuario = $request->user();

        // ------------------------------------------
        // USUARIO NO AUTENTICADO
        // ------------------------------------------

        // Permitir el acceso a las páginas públicas.
        if (! $usuario) {
            return $next($request);
        }

        // ------------------------------------------
        // USUARIO ACTIVO
        // ------------------------------------------

        // Si su cuenta está activa,
        // permitir que continúe navegando.
        if ($usuario->estado) {
            return $next($request);
        }

        // ------------------------------------------
        // USUARIO DESACTIVADO
        // ------------------------------------------

        // Identificar si pertenece a la administración.
        $esAdministrativo = $usuario->hasAnyRole([
            'super-admin',
            'admin',
            'moderador',
        ]);

        // Cerrar la sesión del usuario.
        Auth::logout();

        // Invalidar la sesión actual.
        $request->session()->invalidate();

        // Regenerar el token CSRF.
        $request->session()->regenerateToken();

        // Determinar a qué pantalla de login redirigir.
        $rutaLogin = $esAdministrativo
            ? 'admin.login'
            : 'login';

        // Redirigir con un mensaje informativo.
        return redirect()
            ->route($rutaLogin)
            ->with(
                'status',
                'Tu cuenta se encuentra desactivada. Contactá con el administrador de Talent Match.'
            );
    }
}
