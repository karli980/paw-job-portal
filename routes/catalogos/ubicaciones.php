
<?php

use App\Http\Controllers\Auth\RegistroUbicacionController;
use App\Http\Controllers\CiudadController;
use App\Http\Controllers\PaisController;
use App\Http\Controllers\ProvinciaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CATÁLOGOS ADMINISTRATIVOS - UBICACIONES
|--------------------------------------------------------------------------
|
| Los candidatos y empresas utilizarán los registros activos
| mediante sus propios formularios y controladores.
|
| listar ubicaciones:
|   Permite consultar los catálogos.
|
| gestionar ubicaciones:
|   Permite consultar y administrar los catálogos.
|
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | GESTIONAR UBICACIONES
    |--------------------------------------------------------------------------
    |
    | Se registran primero las rutas de creación y edición
    | para evitar conflictos con las rutas dinámicas de show.
    |
    */

    Route::middleware('permission:gestionar ubicaciones')
        ->group(function () {

            // Países.
            Route::resource('paises', PaisController::class)
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters(['paises' => 'pais']);

            Route::patch(
                '/paises/{pais}/estado',
                [PaisController::class, 'toggleEstado']
            )->name('paises.toggleEstado');

            // Provincias.
            Route::resource('provincias', ProvinciaController::class)
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ]);

            Route::patch(
                '/provincias/{provincia}/toggle-estado',
                [ProvinciaController::class, 'toggleEstado']
            )->name('provincias.toggleEstado');

            // Ciudades.
            Route::resource('ciudades', CiudadController::class)
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters(['ciudades' => 'ciudad']);

            Route::patch(
                '/ciudades/{ciudad}/toggle-estado',
                [CiudadController::class, 'toggleEstado']
            )->name('ciudades.toggleEstado');
        });

    /*
    |--------------------------------------------------------------------------
    | CONSULTAR UBICACIONES
    |--------------------------------------------------------------------------
    |
    | Requiere autenticación, correo verificado
    | y permisos de Spatie.
    |
    */

    Route::middleware(
        'permission:listar ubicaciones|gestionar ubicaciones'
    )->group(function () {

        // Países: listado y detalle.
        Route::resource('paises', PaisController::class)
            ->only(['index', 'show'])
            ->parameters(['paises' => 'pais']);

        // Provincias: listado y detalle.
        Route::resource('provincias', ProvinciaController::class)
            ->only(['index', 'show']);

        // Ciudades: listado y detalle.
        Route::resource('ciudades', CiudadController::class)
            ->only(['index', 'show'])
            ->parameters(['ciudades' => 'ciudad']);
    });

}); // Fin de las rutas administrativas.

/*
|--------------------------------------------------------------------------
| UBICACIONES PÚBLICAS - REGISTRO EMPRESARIAL
|--------------------------------------------------------------------------
|
| Estas rutas permiten consultar provincias y ciudades
| activas durante el registro de empresas.
|
| No requieren autenticación ni correo verificado.
| No permiten crear, modificar o eliminar registros.
|
*/

Route::prefix('registro/ubicaciones')
    ->name('registro.ubicaciones.')
    ->middleware('throttle:60,1')
    ->group(function () {

        /*
        |--------------------------------------------------------------
        | Provincias argentinas activas
        |--------------------------------------------------------------
        */

        Route::get(
            '/provincias',
            [RegistroUbicacionController::class, 'provincias']
        )->name('provincias');

        /*
        |--------------------------------------------------------------
        | Ciudades activas de una provincia
        |--------------------------------------------------------------
        */

        Route::get(
            '/ciudades',
            [RegistroUbicacionController::class, 'ciudades']
        )->name('ciudades');
    });
