
<?php

use App\Http\Controllers\AreaEstudioController;
use App\Http\Controllers\EstadoEstudioController;
use App\Http\Controllers\NivelEstudioController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CATÁLOGOS ADMINISTRATIVOS - FORMACIÓN ACADÉMICA
|--------------------------------------------------------------------------
|
| Los administradores autorizados mantienen los catálogos.
| Los candidatos utilizan estos datos para registrar sus estudios.
|
| Permisos:
| - listar formacion
| - gestionar formacion
|
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | REPORTES
    |--------------------------------------------------------------------------
    |
    | Deben registrarse antes de las rutas dinámicas
    | de los recursos.
    |
    */

    Route::middleware(
        'permission:listar formacion|gestionar formacion'
    )->group(function () {

        // Reporte Excel de áreas de estudio.
        Route::get('/areas-estudio/excel', [
            AreaEstudioController::class,
            'excel',
        ])->name('areas-estudio.excel');

        // Reporte PDF de áreas de estudio.
        Route::get('/areas-estudio/reporte', [
            AreaEstudioController::class,
            'reporte',
        ])->name('areas-estudio.reporte');
    });

    /*
    |--------------------------------------------------------------------------
    | GESTIÓN DE CATÁLOGOS
    |--------------------------------------------------------------------------
    */

    Route::middleware('permission:gestionar formacion')
        ->group(function () {

            // Áreas de estudio.
            Route::resource(
                'areas-estudio',
                AreaEstudioController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'areas-estudio' => 'areaEstudio',
                ]);

            Route::patch(
                '/areas-estudio/{areaEstudio}/estado',
                [AreaEstudioController::class, 'toggleEstado']
            )->name('areas-estudio.toggleEstado');

            // Niveles de estudio.
            Route::resource(
                'niveles-estudio',
                NivelEstudioController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'niveles-estudio' => 'nivelEstudio',
                ]);

            Route::patch(
                '/niveles-estudio/{nivelEstudio}/estado',
                [NivelEstudioController::class, 'toggleEstado']
            )->name('niveles-estudio.toggleEstado');

            // Estados de estudio.
            Route::resource(
                'estado-estudios',
                EstadoEstudioController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'estado-estudios' => 'estadoEstudio',
                ]);

            Route::patch(
                '/estado-estudios/{estadoEstudio}/estado',
                [EstadoEstudioController::class, 'toggleEstado']
            )->name('estado-estudios.toggleEstado');
        });

    /*
    |--------------------------------------------------------------------------
    | CONSULTA DE CATÁLOGOS
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'permission:listar formacion|gestionar formacion'
    )->group(function () {

        // Consultar áreas de estudio.
        Route::resource(
            'areas-estudio',
            AreaEstudioController::class
        )
            ->only(['index', 'show'])
            ->parameters([
                'areas-estudio' => 'areaEstudio',
            ]);

        // Consultar niveles de estudio.
        Route::resource(
            'niveles-estudio',
            NivelEstudioController::class
        )
            ->only(['index', 'show'])
            ->parameters([
                'niveles-estudio' => 'nivelEstudio',
            ]);

        // Consultar estados de estudio.
        Route::resource(
            'estado-estudios',
            EstadoEstudioController::class
        )
            ->only(['index', 'show'])
            ->parameters([
                'estado-estudios' => 'estadoEstudio',
            ]);
    });
});
