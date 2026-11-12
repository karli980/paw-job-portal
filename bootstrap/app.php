<?php

use App\Http\Middleware\EnsureUserIsActive;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        $middleware->redirectGuestsTo(function (Request $request) {

            // Las rutas administrativas utilizan su propio login.
            if ($request->is('admin/*')) {
                return route('admin.login');
            }

            // Si el visitante abre un enlace de verificación,
            // identificar el tipo de cuenta destinataria.
            if ($request->routeIs('verification.verify')) {

                $id = $request->route('id');

                if (ctype_digit((string) $id)) {
                    $usuario = User::find((int) $id);

                    if (
                        $usuario?->hasAnyRole([
                            'super-admin',
                            'admin',
                            'moderador',
                        ])
                    ) {
                        return route('admin.login');
                    }
                }
            }

            // Candidatos y empresas conservan su login general.
            return route('login');
        });

        // ------------------------------------------
        // CONFIGURACIÓN DE COOKIES
        // ------------------------------------------

        $middleware->encryptCookies(except: [
            'appearance',
            'sidebar_state',
        ]);

        // ------------------------------------------
        // MIDDLEWARE WEB
        // ------------------------------------------

        $middleware->web(append: [
            HandleAppearance::class,

            // Bloquear sesiones de cuentas inactivas.
            EnsureUserIsActive::class,

            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // ------------------------------------------
        // SPATIE LARAVEL PERMISSION
        // ------------------------------------------

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') ||
                $request->expectsJson(),
        );

    })
    ->create();
