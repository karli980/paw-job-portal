<?php

use App\Http\Controllers\Auth\SocialAuthController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| CATÁLOGOS ADMINISTRATIVOS
|--------------------------------------------------------------------------
*/

require __DIR__.'/catalogos/ubicaciones.php';
// Catálogos de formación académica.
require __DIR__.'/catalogos/formacion.php';
// Áreas y subáreas laborales.
require __DIR__.'/catalogos/experiencia.php';

require __DIR__.'/catalogos/competencias.php';
// Catálogos relacionados con empresas.
require __DIR__.'/catalogos/empresas.php';
// Catálogos de datos generales.
require __DIR__.'/catalogos/generales.php';
// Catálogos de redes sociales.
require __DIR__.'/catalogos/redes-sociales.php';

require __DIR__.'/empresa/dashboard.php';

require __DIR__.'/ofertas_laborales.php';

/*
|--------------------------------------------------------------------------
| TESTIMONIOS
|--------------------------------------------------------------------------
*/

require __DIR__.'/testimonios.php';



/*
|--------------------------------------------------------------------------
| MÓDULOS DEL CANDIDATO
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])
    ->prefix('candidato')
    ->name('candidato.')
    ->group(function () {

        // Idiomas del candidato.
        require __DIR__.'/candidato/idiomas.php';

        // Experiencias laborales.
        require __DIR__.'/candidato/experiencias.php';

        // Estudios académicos.
        require __DIR__.'/candidato/estudios.php';

        // Salario pretendido.
        require __DIR__.'/candidato/salario.php';
    });


/*
|--------------------------------------------------------------------------
| AUTENTICACIÓN Y PANEL ADMINISTRATIVO
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Autenticación administrativa.
        require __DIR__.'/admin/auth.php';

        // Usuarios administrativos autenticados.
        Route::middleware([
            'auth',
            'verified',
            'role:super-admin|admin|moderador',
        ])->group(function () {

            // Dashboard y cierre de sesión.
            require __DIR__.'/admin/dashboard.php';

            // Funcionalidades exclusivas del Super Admin.
            Route::middleware('role:super-admin')
                ->group(function () {

                    // Gestión de administradores.
                    require __DIR__.'/admin/usuarios.php';

                    // Gestión de permisos.
                    require __DIR__.'/admin/permisos.php';
                });
        });
    });

// Página principal
Route::inertia('/', 'welcome')->name('home');

Route::middleware([
    'auth',
    'verified',
    'role:super-admin|admin|moderador',
])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/auth/{provider}/redirect', [
    SocialAuthController::class,
    'redirect',
])->whereIn('provider', ['google', 'github'])
    ->name('social.redirect');

Route::get('/auth/{provider}/callback', [
    SocialAuthController::class,
    'callback',
])->whereIn('provider', ['google', 'github'])
    ->name('social.callback');
require __DIR__.'/settings.php';
