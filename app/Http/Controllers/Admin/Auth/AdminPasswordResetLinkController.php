<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminPasswordResetLinkController extends Controller
{
    /**
     * Mostrar el formulario de recuperación administrativa.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Admin/Auth/ForgotPassword', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Procesar la solicitud de recuperación.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $email = Str::lower($validated['email']);

        $throttleKey = Str::transliterate(
            $email . '|' . $request->ip()
        );

        $mensaje = 'Si el correo pertenece a una cuenta administrativa activa, recibirás un enlace para restablecer tu contraseña.';

        // Limitar solicitudes para evitar abusos.
        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            return back()->with('status', $mensaje);
        }

        RateLimiter::hit($throttleKey, 60);

        // Buscar una cuenta administrativa activa.
        $user = User::where('email', $email)
            ->where('estado', true)
            ->first();

        if (
            $user &&
            $user->hasAnyRole([
                'super-admin',
                'admin',
                'moderador',
            ])
        ) {
            // Solicitar el enlace mediante el broker existente.
            Password::broker('users')->sendResetLink([
                'email' => $email,
            ]);
        }

        // Respuesta genérica para no revelar qué cuentas existen.
        return back()->with('status', $mensaje);
    }
}

