<?php

use App\Http\Controllers\BeneficioController;
use App\Http\Controllers\EstadoCivilController;
use App\Http\Controllers\GeneroController;
use App\Http\Controllers\IdiomaController;
use App\Http\Controllers\ModalidadTrabajoController;
use App\Http\Controllers\MonedaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CATÁLOGOS ADMINISTRATIVOS - DATOS GENERALES
|--------------------------------------------------------------------------
|
| Géneros, estados civiles, idiomas, monedas,
| modalidades de trabajo y beneficios.
|
| Permisos:
| - listar datos generales
| - gestionar datos generales
|
*/

Route::middleware([
    'auth',
    'verified',
    'role:super-admin|admin|moderador',
])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | REPORTES
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'permission:listar datos generales|gestionar datos generales'
    )->group(function () {

        // Excel de beneficios.
        Route::get('/beneficios/excel', [
            BeneficioController::class,
            'excel',
        ])->name('beneficios.excel');

        // PDF de beneficios.
        Route::get('/beneficios/reporte', [
            BeneficioController::class,
            'reporte',
        ])->name('beneficios.reporte');
    });

    /*
    |--------------------------------------------------------------------------
    | GESTIÓN DE CATÁLOGOS
    |--------------------------------------------------------------------------
    */

    Route::middleware('permission:gestionar datos generales')
        ->group(function () {

            // Géneros.
            Route::resource(
                'generos',
                GeneroController::class
            )->only([
                'create', 'store', 'edit', 'update', 'destroy',
            ]);

            Route::patch('/generos/{genero}/estado', [
                GeneroController::class,
                'toggleEstado',
            ])->name('generos.toggleEstado');

            // Estados civiles.
            Route::resource(
                'estado-civil',
                EstadoCivilController::class
            )->only([
                'create', 'store', 'edit', 'update', 'destroy',
            ]);

            Route::patch(
                '/estado-civil/{estadoCivil}/toggle-estado',
                [EstadoCivilController::class, 'toggleEstado']
            )->name('estado-civil.toggle-estado');

            // Idiomas.
            Route::resource(
                'idiomas',
                IdiomaController::class
            )->only([
                'create', 'store', 'edit', 'update', 'destroy',
            ]);

            Route::patch('/idiomas/{idioma}/estado', [
                IdiomaController::class,
                'toggleEstado',
            ])->name('idiomas.toggleEstado');

            // Monedas.
            Route::resource(
                'monedas',
                MonedaController::class
            )->only([
                'create', 'store', 'edit', 'update', 'destroy',
            ]);

            Route::patch('/monedas/{moneda}/estado', [
                MonedaController::class,
                'toggleEstado',
            ])->name('monedas.toggleEstado');

            // Modalidades de trabajo.
            Route::resource(
                'modalidades-trabajo',
                ModalidadTrabajoController::class
            )->only([
                'create', 'store', 'edit', 'update', 'destroy',
            ])->parameters([
                'modalidades-trabajo' => 'modalidadTrabajo',
            ]);

            Route::patch(
                '/modalidades-trabajo/{modalidadTrabajo}/estado',
                [ModalidadTrabajoController::class, 'toggleEstado']
            )->name('modalidades-trabajo.toggleEstado');

            // Beneficios.
            Route::resource(
                'beneficios',
                BeneficioController::class
            )->only([
                'create', 'store', 'edit', 'update', 'destroy',
            ]);

            Route::patch('/beneficios/{beneficio}/estado', [
                BeneficioController::class,
                'toggleEstado',
            ])->name('beneficios.toggleEstado');
        });

    /*
    |--------------------------------------------------------------------------
    | LISTADO Y CONSULTA
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'permission:listar datos generales|gestionar datos generales'
    )->group(function () {

        Route::resource(
            'generos',
            GeneroController::class
        )->only(['index', 'show']);

        Route::resource(
            'estado-civil',
            EstadoCivilController::class
        )->only(['index', 'show']);

        Route::resource(
            'idiomas',
            IdiomaController::class
        )->only(['index', 'show']);

        Route::resource(
            'monedas',
            MonedaController::class
        )->only(['index', 'show']);

        Route::resource(
            'modalidades-trabajo',
            ModalidadTrabajoController::class
        )->only(['index', 'show'])
            ->parameters([
                'modalidades-trabajo' => 'modalidadTrabajo',
            ]);

        Route::resource(
            'beneficios',
            BeneficioController::class
        )->only(['index', 'show']);
    });
});
