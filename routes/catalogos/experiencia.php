<?php

use App\Http\Controllers\AreaLaboralController;
use App\Http\Controllers\SubAreaLaboralController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CATÁLOGOS ADMINISTRATIVOS - EXPERIENCIA LABORAL
|--------------------------------------------------------------------------
|
| Áreas y subáreas laborales.
|
| Permisos:
| - listar experiencia laboral
| - gestionar experiencia laboral
|
*/

Route::middleware([
    'auth',
    'verified',
    'role:super-admin|admin|moderador',
])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | CONSULTA Y REPORTES
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'permission:listar experiencia laboral|gestionar experiencia laboral'
    )->group(function () {

        // Reporte Excel de áreas laborales.
        Route::get('/areas-laborales/excel', [
            AreaLaboralController::class,
            'excel',
        ])->name('areas-laborales.excel');

        // Reporte PDF de áreas laborales.
        Route::get('/areas-laborales/reporte', [
            AreaLaboralController::class,
            'reporte',
        ])->name('areas-laborales.reporte');

        // Reporte Excel de subáreas laborales.
        Route::get('/sub-areas-laborales/excel', [
            SubAreaLaboralController::class,
            'excel',
        ])->name('sub-areas-laborales.excel');

        // Reporte PDF de subáreas laborales.
        Route::get('/sub-areas-laborales/reporte', [
            SubAreaLaboralController::class,
            'reporte',
        ])->name('sub-areas-laborales.reporte');
    });

    /*
    |--------------------------------------------------------------------------
    | GESTIÓN DE ÁREAS Y SUBÁREAS LABORALES
    |--------------------------------------------------------------------------
    */

    Route::middleware('permission:gestionar experiencia laboral')
        ->group(function () {

            // CRUD de áreas laborales.
            Route::resource(
                'areas-laborales',
                AreaLaboralController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'areas-laborales' => 'areaLaboral',
                ]);

            // Activar o desactivar un área laboral.
            Route::patch(
                '/areas-laborales/{areaLaboral}/estado',
                [
                    AreaLaboralController::class,
                    'toggleEstado',
                ]
            )->name('areas-laborales.toggleEstado');

            // CRUD de subáreas laborales.
            Route::resource(
                'sub-areas-laborales',
                SubAreaLaboralController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'sub-areas-laborales' => 'subAreaLaboral',
                ]);

            // Activar o desactivar una subárea laboral.
            Route::patch(
                '/sub-areas-laborales/{subAreaLaboral}/estado',
                [
                    SubAreaLaboralController::class,
                    'toggleEstado',
                ]
            )->name('sub-areas-laborales.toggleEstado');
        });

    /*
    |--------------------------------------------------------------------------
    | LISTADO Y CONSULTA
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'permission:listar experiencia laboral|gestionar experiencia laboral'
    )->group(function () {

        Route::resource(
            'areas-laborales',
            AreaLaboralController::class
        )
            ->only(['index', 'show'])
            ->parameters([
                'areas-laborales' => 'areaLaboral',
            ]);

        Route::resource(
            'sub-areas-laborales',
            SubAreaLaboralController::class
        )
            ->only(['index', 'show'])
            ->parameters([
                'sub-areas-laborales' => 'subAreaLaboral',
            ]);
    });
});
