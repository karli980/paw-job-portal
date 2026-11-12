<?php

use App\Http\Controllers\RedSocialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CATÁLOGOS ADMINISTRATIVOS - REDES SOCIALES
|--------------------------------------------------------------------------
|
| Administración de las redes sociales disponibles.
|
| Permisos:
| - listar redes sociales
| - gestionar redes sociales
|
*/

Route::middleware([
    'auth',
    'verified',
    'role:super-admin|admin|moderador',
])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | GESTIÓN DE REDES SOCIALES
    |--------------------------------------------------------------------------
    */

    Route::middleware('permission:gestionar redes sociales')
        ->group(function () {

            // Crear, modificar y eliminar redes sociales.
            Route::resource(
                'redes-sociales',
                RedSocialController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'redes-sociales' => 'redSocial',
                ]);

            // Activar o desactivar una red social.
            Route::patch(
                '/redes-sociales/{redSocial}/estado',
                [
                    RedSocialController::class,
                    'toggleEstado',
                ]
            )->name('redes-sociales.toggleEstado');
        });

    /*
    |--------------------------------------------------------------------------
    | CONSULTA DE REDES SOCIALES
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'permission:listar redes sociales|gestionar redes sociales'
    )->group(function () {

        Route::resource(
            'redes-sociales',
            RedSocialController::class
        )
            ->only([
                'index',
                'show',
            ])
            ->parameters([
                'redes-sociales' => 'redSocial',
            ]);
    });
});
