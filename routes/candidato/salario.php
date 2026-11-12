<?php

use App\Http\Controllers\CandidatoSalarioPretendidoController;
use Illuminate\Support\Facades\Route;

Route::prefix('salario-pretendido')
    ->name('salario-pretendido.')
    ->controller(CandidatoSalarioPretendidoController::class)
    ->group(function () {

        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{salarioPretendido}', 'update')->name('update');
        Route::delete('/{salarioPretendido}', 'destroy')->name('destroy');

        Route::patch(
            '/{salarioPretendido}/estado',
            'toggleEstado'
        )->name('toggleEstado');
    });
