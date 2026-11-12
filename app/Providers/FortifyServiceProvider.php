<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Http\Responses\LoginResponse;
use App\Http\Responses\VerifyEmailResponse;
use App\Models\Pais;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(
            VerifyEmailResponseContract::class,
            VerifyEmailResponse::class
        );

        $this->app->singleton(
            LoginResponseContract::class,
            LoginResponse::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
        Fortify::verifyEmailView(function () {
            return Inertia::render('auth/verify-email');
        });
        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Verificá tu correo electrónico - Talent Match')
                ->view('emails.auth.verify-email', [
                    'user' => $notifiable,
                    'url' => $url,
                ]);
        });

        ResetPasswordNotification::toMailUsing(
            function (object $notifiable, string $token) {

                $esAdministrativo = $notifiable->hasAnyRole([
                    'super-admin',
                    'admin',
                    'moderador',
                ]);

                $ruta = $esAdministrativo
                    ? 'admin.password.reset'
                    : 'password.reset';

                $url = url(route($ruta, [
                    'token' => $token,
                    'email' => $notifiable->getEmailForPasswordReset(),
                ], false));

                return (new MailMessage)
                    ->subject('Restablecé tu contraseña - Talent Match')
                    ->view('emails.auth.reset-password', [
                        'user' => $notifiable,
                        'url' => $url,
                    ]);
            }
        );

        // ------------------------------------------
        // AUTENTICACIÓN DE CUENTAS ACTIVAS
        // ------------------------------------------

        Fortify::authenticateUsing(function (Request $request) {

            $usuario = User::where(
                'email',
                $request->input('email')
            )
                ->where('estado', true)
                ->first();

            $password = $request->input('password');

            // Rechazar cuentas inexistentes, inactivas
            // o sin contraseña válida.
            if (
                ! $usuario ||
                ! is_string($password) ||
                ! $usuario->password ||
                ! Hash::check($password, $usuario->password)
            ) {
                return null;
            }

            return $usuario;
        });

    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        /*
        |--------------------------------------------------------------------------
        | INICIO DE SESIÓN
        |--------------------------------------------------------------------------
        */

        Fortify::loginView(function (Request $request) {
            $tipo = $request->query('tipo');

            $props = [
                'canResetPassword' => Features::enabled(
                    Features::resetPasswords()
                ),
                'status' => $request->session()->get('status'),
            ];

            // Inicio de sesión de candidatos.
            if ($tipo === 'candidato') {
                return Inertia::render(
                    'auth/login-candidate',
                    $props
                );
            }

            // Inicio de sesión de empresas.
            if ($tipo === 'empresa') {
                return Inertia::render(
                    'auth/login-empresa',
                    $props
                );
            }

            // Selección del tipo de inicio de sesión.
            return Inertia::render('auth/login-type');
        });

        /*
        |--------------------------------------------------------------------------
        | RESTABLECIMIENTO DE CONTRASEÑA
        |--------------------------------------------------------------------------
        */

        Fortify::resetPasswordView(
            fn (Request $request) => Inertia::render(
                'auth/reset-password',
                [
                    'email' => $request->email,
                    'token' => $request->route('token'),
                    'passwordRules' => Password::defaults()->toPasswordRulesString(),
                ]
            )
        );

        Fortify::requestPasswordResetLinkView(
            fn (Request $request) => Inertia::render(
                'auth/forgot-password',
                [
                    'status' => $request->session()->get('status'),
                ]
            )
        );

        /*
        |--------------------------------------------------------------------------
        | REGISTRO DE USUARIOS
        |--------------------------------------------------------------------------
        */

        Fortify::registerView(function (Request $request) {
            $tipo = $request->query('tipo');

            // Registro empresarial.
            if ($tipo === 'empresa') {

                $paises = Pais::query()
                    ->where('estado', true)
                    ->orderBy('nombre')
                    ->get([
                        'id',
                        'nombre',
                        'codigo_iso',
                    ]);

                return Inertia::render('auth/register', [
                    'passwordRules' => Password::defaults()->toPasswordRulesString(),
                    'tipo' => 'empresa',
                    'paises' => $paises,
                ]);
            }

            // Registro de candidatos.
            if ($tipo === 'candidato') {
                return Inertia::render('auth/register-candidate', [
                    'passwordRules' => Password::defaults()->toPasswordRulesString(),
                ]);
            }

            // Selección del tipo de cuenta.
            return Inertia::render('auth/register-type');
        });
    }

    private function configureRateLimiting(): void
    {

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

    }
}
