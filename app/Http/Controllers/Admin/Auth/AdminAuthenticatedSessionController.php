<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthenticatedSessionController extends Controller
{
    /**
     * Mostrar el formulario de acceso administrativo.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        if (
            Auth::check() &&
            Auth::user()->hasAnyRole([
                'super-admin',
                'admin',
                'moderador',
            ])
        ) {
            return redirect()->intended(route('admin.dashboard'));
        }

        return Inertia::render('Admin/Auth/Login', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Procesar el inicio de sesión administrativo.
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $throttleKey = Str::transliterate(
            Str::lower($request->input('email')).'|'.$request->ip()
        );

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            throw ValidationException::withMessages([
                'email' => 'Demasiados intentos. Intentá nuevamente en unos minutos.',
            ]);
        }

        // Solo permite iniciar sesión a cuentas activas.
        $credentials['estado'] = 1;

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            RateLimiter::hit($throttleKey, 60);

            throw ValidationException::withMessages([
                'email' => 'Las credenciales ingresadas no son válidas o no tenés autorización administrativa.',
            ]);
        }

        $request->session()->regenerate();

        $user = Auth::user();

        // Verificar que el usuario tenga un rol administrativo.
        if (! $user->hasAnyRole([
            'super-admin',
            'admin',
            'moderador',
        ])) {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                'email' => 'Las credenciales ingresadas no son válidas o no tenés autorización administrativa.',
            ]);
        }

        RateLimiter::clear($throttleKey);

        return redirect()->intended(
            route('admin.dashboard')
        );
    }

    /**
     * Cerrar la sesión administrativa.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
