<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Actions\Fortify\ResetUserPassword;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminNewPasswordController extends Controller
{
    public function create(Request $request, string $token): Response
    {
        return Inertia::render('Admin/Auth/ResetPassword', [
            'email' => $request->query('email'),
            'token' => $token,
            'passwordRules' => PasswordRule::defaults()->toPasswordRulesString(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'password_confirmation' => ['required', 'same:password'],
        ]);

        $email = Str::lower($validated['email']);

        $user = User::where('email', $email)
            ->where('estado', true)
            ->first();

        if (
            ! $user ||
            ! $user->hasAnyRole(['super-admin', 'admin', 'moderador'])
        ) {
            throw ValidationException::withMessages([
                'email' => 'El enlace de recuperación no es válido o ha vencido.',
            ]);
        }

        $status = Password::broker('users')->reset(
            [
                'email' => $email,
                'token' => $validated['token'],
                'password' => $validated['password'],
                'password_confirmation' => $validated['password_confirmation'],
            ],
            function (User $user) use ($validated) {
                if (
                    ! $user->estado ||
                    ! $user->hasAnyRole(['super-admin', 'admin', 'moderador'])
                ) {
                    throw ValidationException::withMessages([
                        'email' => 'El enlace de recuperación no es válido o ha vencido.',
                    ]);
                }

                app(ResetUserPassword::class)->reset($user, $validated);

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            $user = User::where('email', $email)
                ->where('estado', true)
                ->firstOrFail();

            if (! $user->hasAnyRole(['super-admin', 'admin', 'moderador'])) {
                throw ValidationException::withMessages([
                    'email' => 'La cuenta ya no tiene acceso administrativo.',
                ]);
            }

            Auth::login($user);

            $request->session()->regenerate();

            return redirect()
                ->route('admin.dashboard')
                ->with(
                    'status',
                    'Tu contraseña administrativa fue restablecida correctamente.'
                );
        }

        return back()->withErrors([
            'email' => 'El enlace de recuperación no es válido o ha vencido. Solicitá uno nuevo.',
        ]);
    }
}
