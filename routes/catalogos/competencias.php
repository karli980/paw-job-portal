<?php

use App\Http\Controllers\CategoriaHabilidadController;
use App\Http\Controllers\DestrezaController;
use App\Http\Controllers\HabilidadController;
use App\Http\Controllers\NivelHabilidadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CATÁLOGOS ADMINISTRATIVOS - COMPETENCIAS
|--------------------------------------------------------------------------
|
| Habilidades, categorías, niveles de habilidad y destrezas.
|
| Permisos:
| - listar competencias
| - gestionar competencias
|
*/

Route::middleware([
    'auth',
    'verified',
    'role:super-admin|admin|moderador',
])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | REPORTES PDF Y EXCEL
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'permission:listar competencias|gestionar competencias'
    )->group(function () {

        // Habilidades.
        Route::get('/habilidades/excel', [
            HabilidadController::class,
            'excel',
        ])->name('habilidades.excel');

        Route::get('/habilidades/reporte', [
            HabilidadController::class,
            'reporte',
        ])->name('habilidades.reporte');

        // Categorías de habilidades.
        Route::get('/categorias-habilidades/excel', [
            CategoriaHabilidadController::class,
            'excel',
        ])->name('categorias-habilidades.excel');

        Route::get('/categorias-habilidades/reporte', [
            CategoriaHabilidadController::class,
            'reporte',
        ])->name('categorias-habilidades.reporte');

        // Destrezas.
        Route::get('/destrezas/excel', [
            DestrezaController::class,
            'excel',
        ])->name('destrezas.excel');

        Route::get('/destrezas/reporte', [
            DestrezaController::class,
            'reporte',
        ])->name('destrezas.reporte');
    });

    /*
    |--------------------------------------------------------------------------
    | GESTIÓN DE COMPETENCIAS
    |--------------------------------------------------------------------------
    */

    Route::middleware('permission:gestionar competencias')
        ->group(function () {

            // CRUD de habilidades.
            Route::resource(
                'habilidades',
                HabilidadController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'habilidades' => 'habilidad',
                ]);

            Route::patch(
                '/habilidades/{habilidad}/estado',
                [HabilidadController::class, 'toggleEstado']
            )->name('habilidades.toggleEstado');

            // CRUD de categorías de habilidades.
            Route::resource(
                'categorias-habilidades',
                CategoriaHabilidadController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'categorias-habilidades' => 'categoriaHabilidad',
                ]);

            Route::patch(
                '/categorias-habilidades/{categoriaHabilidad}/estado',
                [CategoriaHabilidadController::class, 'toggleEstado']
            )->name('categorias-habilidades.toggleEstado');

            // CRUD de niveles de habilidad.
            Route::resource(
                'niveles-habilidades',
                NivelHabilidadController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'niveles-habilidades' => 'nivelHabilidad',
                ]);

            Route::patch(
                '/niveles-habilidades/{nivelHabilidad}/estado',
                [NivelHabilidadController::class, 'toggleEstado']
            )->name('niveles-habilidades.toggleEstado');

            // CRUD de destrezas.
            Route::resource(
                'destrezas',
                DestrezaController::class
            )
                ->only([
                    'create',
                    'store',
                    'edit',
                    'update',
                    'destroy',
                ])
                ->parameters([
                    'destrezas' => 'destreza',
                ]);

            Route::patch(
                '/destrezas/{destreza}/estado',
                [DestrezaController::class, 'toggleEstado']
            )->name('destrezas.toggleEstado');
        });

    /*
    |--------------------------------------------------------------------------
    | LISTADO Y CONSULTA DE COMPETENCIAS
    |--------------------------------------------------------------------------
    */

    Route::middleware(
        'permission:listar competencias|gestionar competencias'
    )->group(function () {

        Route::resource(
            'habilidades',
            HabilidadController::class
        )
            ->only(['index', 'show'])
            ->parameters([
                'habilidades' => 'habilidad',
            ]);

        Route::resource(
            'categorias-habilidades',
            CategoriaHabilidadController::class
        )
            ->only(['index', 'show'])
            ->parameters([
                'categorias-habilidades' => 'categoriaHabilidad',
            ]);

        Route::resource(
            'niveles-habilidades',
            NivelHabilidadController::class
        )
            ->only(['index', 'show'])
            ->parameters([
                'niveles-habilidades' => 'nivelHabilidad',
            ]);

        Route::resource(
            'destrezas',
            DestrezaController::class
        )
            ->only(['index', 'show'])
            ->parameters([
                'destrezas' => 'destreza',
            ]);
    });
});
