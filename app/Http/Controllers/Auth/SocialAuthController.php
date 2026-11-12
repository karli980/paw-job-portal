<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Candidato;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class SocialAuthController extends Controller
{
    /**
     * Iniciar la autenticación con Google o GitHub.
     */
    public function redirect(string $provider): RedirectResponse
    {
        abort_unless(
            in_array($provider, ['google', 'github'], true),
            404
        );

        if (Auth::check()) {
            abort_unless(Auth::user()->candidato, 403);
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Procesar la respuesta del proveedor social.
     */
    public function callback(string $provider): RedirectResponse
    {
        abort_unless(
            in_array($provider, ['google', 'github'], true),
            404
        );

        try {
            $socialUser = Socialite::driver($provider)->user();

            /*
             * Obtener un correo verificado según el proveedor.
             */
            if ($provider === 'google') {
                $emailVerified = filter_var(
                    $socialUser->user['email_verified'] ?? false,
                    FILTER_VALIDATE_BOOLEAN
                );

                $email = $socialUser->getEmail();

                if (! $emailVerified || ! $email) {
                    return $this->loginError(
                        'Google no confirmó que tu correo electrónico esté verificado.'
                    );
                }
            } else {
                /*
                 * GitHub permite consultar los correos de la cuenta
                 * y comprobar cuáles están verificados.
                 */
                $response = Http::withToken($socialUser->token)
                    ->acceptJson()
                    ->withHeaders([
                        'User-Agent' => 'TalentMatch',
                    ])
                    ->timeout(10)
                    ->get('https://api.github.com/user/emails');

                $response->throw();

                $emails = $response->json();

                if (! is_array($emails)) {
                    return $this->loginError(
                        'No se pudieron verificar los correos de GitHub.'
                    );
                }

                $verifiedEmails = collect($emails)
                    ->filter(fn ($item) => is_array($item)
                        && ($item['verified'] ?? false) === true
                        && filter_var(
                            $item['email'] ?? null,
                            FILTER_VALIDATE_EMAIL
                        )
                    );

                $selectedEmail = $verifiedEmails->first(
                    fn ($item) => ($item['primary'] ?? false) === true
                );

                $selectedEmail ??= $verifiedEmails->first();

                $email = $selectedEmail['email'] ?? null;

                if (! $email) {
                    return $this->loginError(
                        'GitHub no proporcionó un correo electrónico verificado.'
                    );
                }
            }
        } catch (Throwable $exception) {
            report($exception);

            return $this->loginError(
                'No se pudo completar el acceso social. Intentá nuevamente.'
            );
        }

        $providerUserId = (string) $socialUser->getId();

        if ($providerUserId === '') {
            return $this->loginError(
                'El proveedor no proporcionó un identificador válido.'
            );
        }

        /*
         * Buscar una identidad social previamente vinculada.
         */
        $socialAccount = SocialAccount::query()
            ->where('provider', $provider)
            ->where('provider_user_id', $providerUserId)
            ->first();

        if ($socialAccount) {
            $user = $socialAccount->user;

            if (
                ! $user
                || ! $user->estado
                || ! $user->candidato
            ) {
                return $this->loginError(
                    'Esta cuenta no está habilitada para iniciar sesión como candidato.'
                );
            }

            /*
             * El proveedor confirmó el correo electrónico.
             */
            if (! $user->hasVerifiedEmail()) {
                $user->forceFill([
                    'email_verified_at' => now(),
                ])->save();
            }

            Auth::login($user);

            request()->session()->regenerate();

            return redirect()->intended(route('dashboard'));
        }

        /*
         * No vincular automáticamente identidades por coincidencia
         * de correo electrónico.
         */
        if (User::where('email', $email)->exists()) {
            return $this->loginError(
                'Ya existe una cuenta con ese correo. Iniciá sesión con tu método habitual.'
            );
        }

        /*
         * Separar nombre y apellido.
         */
        $fullName = trim((string) $socialUser->getName());

        if ($fullName === '') {
            $fullName = trim(
                (string) $socialUser->getNickname()
            );
        }

        $parts = preg_split('/\s+/', $fullName, 2);

        $nombre = trim($parts[0] ?? '');
        $apellido = trim($parts[1] ?? '');

        if ($nombre === '') {
            $nombre = 'Usuario';
        }

        /*
         * Evitar guardar una URL de avatar que supere la longitud
         * permitida por la columna imagen.
         */
        $avatar = $socialUser->getAvatar();

        if (
            ! is_string($avatar)
            || strlen($avatar) > 255
            || ! filter_var($avatar, FILTER_VALIDATE_URL)
        ) {
            $avatar = null;
        }

        /*
         * Crear el usuario, su perfil de candidato y su identidad
         * social dentro de una única transacción.
         */
        try {
            $user = DB::transaction(function () use (
                $provider,
                $providerUserId,
                $email,
                $avatar,
                $nombre,
                $apellido
            ) {
                $user = User::create([
                    'nombre' => $nombre,
                    'apellido' => $apellido,
                    'email' => $email,
                    'imagen' => $avatar,
                    'password' => Str::random(64),
                    'password_configured' => false,
                    'estado' => true,
                ]);

                /*
                 * El correo ya fue verificado por Google o GitHub.
                 */
                $user->forceFill([
                    'email_verified_at' => now(),
                ])->save();

                Candidato::create([
                    'user_id' => $user->id,
                ]);

                // Asignar el rol de candidato mediante Spatie.
                $user->assignRole('candidato');

                SocialAccount::create([
                    'user_id' => $user->id,
                    'provider' => $provider,
                    'provider_user_id' => $providerUserId,
                    'provider_email' => $email,
                ]);

                return $user;
            });
        } catch (Throwable $exception) {
            report($exception);

            return $this->loginError(
                'No se pudo crear la cuenta. Verificá los datos e intentá nuevamente.'
            );
        }

        /*
         * Iniciar sesión y regenerar la sesión.
         */
        Auth::login($user);

        request()->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Devolver al formulario de acceso con un mensaje de error.
     */
    private function loginError(string $message): RedirectResponse
    {
        return redirect()
            ->route('login')
            ->withErrors([
                'email' => $message,
            ]);
    }
}
