<?php

use App\Http\Controllers\TestimonioController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| GESTIÓN ADMINISTRATIVA DE TESTIMONIOS
|--------------------------------------------------------------------------
|
| Permisos de Spatie:
|
| - listar testimonios
| - moderar testimonios
| - destacar testimonios
| - eliminar testimonios
|
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | CONSULTAR TESTIMONIOS
    |--------------------------------------------------------------------------
    */

    Route::get('/testimonios', [
        TestimonioController::class,
        'index',
    ])
        ->middleware('permission:listar testimonios')
        ->name('testimonios.index');

    /*
    |--------------------------------------------------------------------------
    | MODERAR TESTIMONIOS
    |--------------------------------------------------------------------------
    */

    Route::patch(
        '/testimonios/{testimonio}/estado',
        [
            TestimonioController::class,
            'toggleEstado',
        ]
    )
        ->middleware('permission:moderar testimonios')
        ->name('testimonios.toggleEstado');

    /*
    |--------------------------------------------------------------------------
    | DESTACAR TESTIMONIOS
    |--------------------------------------------------------------------------
    */

    Route::patch(
        '/testimonios/{testimonio}/destacado',
        [
            TestimonioController::class,
            'toggleDestacado',
        ]
    )
        ->middleware('permission:destacar testimonios')
        ->name('testimonios.toggleDestacado');

    /*
    |--------------------------------------------------------------------------
    | ELIMINAR TESTIMONIOS
    |--------------------------------------------------------------------------
    */

    Route::delete('/testimonios/{testimonio}', [
        TestimonioController::class,
        'destroy',
    ])
        ->middleware('permission:eliminar testimonios')
        ->name('testimonios.destroy');
});
