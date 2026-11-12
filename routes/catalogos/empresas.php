<?php

use App\Http\Controllers\CantidadEmpleadoController;
use App\Http\Controllers\IndustriaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CATÁLOGOS ADMINISTRATIVOS - DATOS DE EMPRESAS
|--------------------------------------------------------------------------
|
| Industrias y cantidad de empleados.
|
| Permisos:
| - listar empresas
| - gestionar empresas
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
        'permission:listar empresas|gestionar empresas'
    )->group(function () {

        // Reporte Excel de industrias.
        Route::get('/industrias/excel', [
            IndustriaController::class,
            'excel',
        ])->name('industrias.excel');

        // Reporte PDF de industrias.
        Route::get('/industrias/reporte', [
            IndustriaController::class,
            'reporte',
        ])->name('industrias.reporte');
    });

    /*
    |--------------------------------------------------------------------------
    | GESTIÓN DE CATÁLOGOS
    |--------------------------------------------------------------------------
    */

    Route::middleware('permission:gestionar empresas')
        ->group(function () {

            // Industrias.
            Route::resource(
                'industrias',
                IndustriaController::class
            )->only([
                'create',
                'store',
                'edit',
                'update',
                'destroy',
            ]);

            Route::patch(
                '/industrias/{industria}/toggle-estado',
                [IndustriaController::class, 'toggleEstado']
            )->name('industrias.toggleEstado');

            // Cantidad de empleados.
            Route::resource(
                'cantidad-empleados',
                CantidadEmpleadoController::class
            )->only([
                'create',
                'store',
                'edit',
                'update',
                'destroy',
            ])->parameters([
                'cantidad-empleados' => 'cantidadEmpleado',
            ]);

            Route::patch(
                '/cantidad-empleados/{cantidadEmpleado}/estado',
                [CantidadEmpleadoController::class, 'toggleEstado']
            )->name('cantidad-empleados.toggleEstado');
        });

    /*
    |--------------------------------------------------------------------------
    | LISTADO Y CONSULTA
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'permission:listar empresas|gestionar empresas'
    )->group(function () {

        // Consultar industrias.
        Route::resource(
            'industrias',
            IndustriaController::class
        )->only([
            'index',
            'show',
        ]);

        // Consultar cantidades de empleados.
        Route::resource(
            'cantidad-empleados',
            CantidadEmpleadoController::class
        )->only([
            'index',
            'show',
        ])->parameters([
            'cantidad-empleados' => 'cantidadEmpleado',
        ]);
    });
});

